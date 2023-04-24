import { XGPU } from "../XGPU";
import { GPURenderer } from "../GPURenderer";
import { HeadlessGPURenderer } from "../HeadlessGPURenderer";
import { Bindgroup } from "../shader/Bindgroup";
import { FragmentShader } from "../shader/FragmentShader";
import { VertexAttribute } from "../shader/resources/VertexAttribute";
import { VertexBuffer } from "../shader/resources/VertexBuffer";
import { ShaderStruct } from "../shader/shaderParts/ShaderStruct";
import { VertexShader } from "../shader/VertexShader";
import { Pipeline } from "./Pipeline";
import { BlendMode } from "./resources/blendmodes/BlendMode";
import { DepthStencilTexture } from "./resources/textures/DepthStencilTexture";
import { MultiSampleTexture } from "./resources/textures/MultiSampleTexture";
import { RenderPassTexture } from "./resources/textures/RenderPassTexture";
import { IndexBuffer } from "./resources/IndexBuffer";
import { BuiltIns } from "../BuiltIns";
import { IShaderResource } from "../shader/resources/IShaderResource";
import { UniformBuffer } from "../shader/resources/UniformBuffer";
import { PrimitiveFloatUniform, PrimitiveIntUniform, PrimitiveUintUniform } from "../shader/PrimitiveType";
import { ImageTexture } from "../shader/resources/ImageTexture";
import { TextureSampler } from "../shader/resources/TextureSampler";


export class RenderPipeline extends Pipeline {


    public renderer: GPURenderer | HeadlessGPURenderer;
    protected canvas: { width: number, height: number, dimensionChanged: boolean };

    protected _depthStencilTexture: DepthStencilTexture;
    protected multisampleTexture: MultiSampleTexture;
    protected renderPassTexture: RenderPassTexture;

    /*
    protected shadow: Shadow = null;
    protected _light: Light = null;
    */
    public outputColor: any;
    public renderPassDescriptor: any = { colorAttachments: [] }
    public indexBuffer: IndexBuffer = null;


    protected gpuPipeline: GPURenderPipeline;

    public debug: string = "renderPipeline";
    public onDrawBegin: () => void;
    public onDrawEnd: () => void;

    constructor(renderer: GPURenderer | HeadlessGPURenderer, bgColor: { r: number, g: number, b: number, a: number } = { r: 0, g: 0, b: 0, a: 1 }) {
        super();

        if (!renderer.canvas) {
            throw new Error("A RenderPipeline need a GPUProcess with a canvas in order to draw things inside. You must pass a reference to a canvas when you instanciate the GPUProcess.")
        }
        this.type = "render";
        this.renderer = renderer;
        this.canvas = renderer.canvas as any;
        this.vertexShader = new VertexShader();
        this.fragmentShader = new FragmentShader();
        this.description.primitive = {
            topology: "triangle-list",
            cullMode: "none",
            frontFace: "ccw"
        }

        if (bgColor !== null) {
            this.outputColor = this.createColorAttachment(bgColor);
        }




    }

    public get depthStencilTexture(): DepthStencilTexture { return this._depthStencilTexture; }

    //=============================== HIGH LEVEL PARSING ================================================================

    private parseShaderBuiltins(descriptor: any) {
        //------------- VERTEX INPUTS -----------------

        const addVertexInput = (name: string, val: any) => {
            if (typeof descriptor.vertexShader === "string") {
                const main: string = descriptor.vertexShader;
                descriptor.vertexShader = {
                    main
                }
            }
            if (!descriptor.vertexShader.inputs) descriptor.vertexShader.inputs = {};
            descriptor.vertexShader.inputs[name] = val;
        }
        const checkVertexInputBuiltIns = (name: string, o: any) => {

            for (let z in BuiltIns.vertexInputs) {
                if (o === BuiltIns.vertexInputs[z]) {
                    addVertexInput(name, o);
                }
            }
        }

        //-------------- VERTEX OUTPUTS ------------
        const addVertexOutput = (name: string, val: any) => {
            if (typeof descriptor.vertexShader === "string") {
                const main: string = descriptor.vertexShader;
                descriptor.vertexShader = {
                    main
                }
            }
            if (!descriptor.vertexShader.outputs) descriptor.vertexShader.outputs = {};
            descriptor.vertexShader.outputs[name] = val;
        }
        const checkVertexOutputBuiltIns = (name: string, o: any) => {
            for (let z in BuiltIns.vertexOutputs) {
                if (o === BuiltIns.vertexOutputs[z]) {
                    addVertexOutput(name, o);
                }
            }
        }

        //------------- FRAGMENT INPUTS -----------------

        const addFragmentInput = (name: string, val: any) => {
            if (typeof descriptor.fragmentShader === "string") {
                const main: string = descriptor.fragmentShader;
                descriptor.fragmentShader = {
                    main
                }
            }
            if (!descriptor.fragmentShader.inputs) descriptor.fragmentShader.inputs = {};
            descriptor.fragmentShader.inputs[name] = val;
        }
        const checkFragmentInputBuiltIns = (name: string, o: any) => {

            for (let z in BuiltIns.fragmentInputs) {
                if (o === BuiltIns.vertexInputs[z]) {
                    addFragmentInput(name, o);
                }
            }
        }

        //-------------- FRAGMENT OUTPUTS ------------
        const addFragmentOutput = (name: string, val: any) => {
            if (typeof descriptor.fragmentShader === "string") {
                const main: string = descriptor.fragmentShader;
                descriptor.fragmentShader = {
                    main
                }
            }
            if (!descriptor.fragmentShader.outputs) descriptor.fragmentShader.outputs = {};
            descriptor.fragmentShader.outputs[name] = val;
        }
        const checkFragmentOutputBuiltIns = (name: string, o: any) => {
            for (let z in BuiltIns.fragmentOutputs) {
                if (o === BuiltIns.fragmentOutputs[z]) {
                    addFragmentOutput(name, o);
                }
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) {
                checkVertexInputBuiltIns(z, o);
                checkVertexOutputBuiltIns(z, o);
                checkFragmentInputBuiltIns(z, o);
                checkFragmentOutputBuiltIns(z, o);
            }
        }

        return descriptor;
    }

    private parseVertexBuffers(descriptor: any) {

        const addVertexBuffer = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
            descriptor.bindgroups.default[name] = o;
            return o;
        }

        const checkVertexBuffer = (name: string, o: any) => {
            if (o instanceof VertexBuffer) {
                addVertexBuffer(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkVertexBuffer(z, o);
        }

        return descriptor;
    }

    private parseVertexAttributes(descriptor: any) {

        const addVertexAttribute = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};


            if (!descriptor.bindgroups.default.buffer) {
                const attributes: any = {};
                attributes[name] = o;
                descriptor.bindgroups.default.buffer = new VertexBuffer(attributes);
            } else {
                const attribute = (descriptor.bindgroups.default.buffer as VertexBuffer).createArray(name, o.type, o.offset);
                if (o.datas) attribute.datas = o.datas;
            }
        }

        const checkVertexAttribute = (name: string, o: any) => {
            if (o.type && VertexAttribute.types[o.type]) {
                addVertexAttribute(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkVertexAttribute(z, o);
        }

        return descriptor;
    }

    private parseDrawConfig(descriptor: any) {
        // vertexCount: number, instanceCount: number, firstVertexId: number, firstInstanceId: number
        if (descriptor.vertexCount) {
            if (isNaN(descriptor.vertexCount)) throw new Error("descriptor.vertexCount is a reserved keyword and must be a number");
            this.drawConfig.vertexCount = descriptor.vertexCount;
        }
        if (descriptor.instanceCount) {
            if (isNaN(descriptor.instanceCount)) throw new Error("descriptor.instanceCount is a reserved keyword and must be a number");
            this.drawConfig.instanceCount = descriptor.instanceCount;
        }
        if (descriptor.firstVertexId) {
            if (isNaN(descriptor.firstVertexId)) throw new Error("descriptor.firstVertexId is a reserved keyword and must be a number");
            this.drawConfig.firstVertexId = descriptor.firstVertexId;
        }
        if (descriptor.firstInstanceId) {
            if (isNaN(descriptor.firstInstanceId)) throw new Error("descriptor.firstInstanceId is a reserved keyword and must be a number");
            this.drawConfig.firstInstanceId = descriptor.firstInstanceId;
        }
        return descriptor;
    }




    private parseUniformBuffers(descriptor: any) {

        const addUniformBuffer = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
            descriptor.bindgroups.default[name] = o;
            return o;
        }

        const checkUniformBuffer = (name: string, o: any) => {
            if (o instanceof UniformBuffer) {
                addUniformBuffer(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkUniformBuffer(z, o);
        }

        return descriptor;
    }

    private parseUniform(descriptor: any) {

        const addUniform = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};


            if (!descriptor.bindgroups.default.uniforms) {
                const uniforms: any = {};
                uniforms[name] = o;
                descriptor.bindgroups.default.uniforms = new UniformBuffer(uniforms, { useLocalVariable: true });
            } else {
                (descriptor.bindgroups.default.uniforms as UniformBuffer).add(name, o);
            }
        }

        const checkUniform = (name: string, o: any) => {
            if (o instanceof PrimitiveFloatUniform || o instanceof PrimitiveIntUniform || o instanceof PrimitiveUintUniform) {
                addUniform(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkUniform(z, o);
        }

        return descriptor;
    }

    private parseImageTexture(descriptor: any) {

        const addImageTexture = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
            descriptor.bindgroups.default[name] = o;
        }

        const checkImageTexture = (name: string, o: any) => {
            if (o instanceof ImageTexture) {
                addImageTexture(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkImageTexture(z, o);
        }

        return descriptor;
    }

    private parseTextureSampler(descriptor: any) {

        const addTextureSampler = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
            descriptor.bindgroups.default[name] = o;
        }

        const checkTextureSampler = (name: string, o: any) => {
            if (o instanceof TextureSampler) {
                addTextureSampler(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkTextureSampler(z, o);
        }

        return descriptor;
    }


    private highLevelParse(descriptor: any) {

        descriptor = this.parseShaderBuiltins(descriptor);
        descriptor = this.parseVertexBuffers(descriptor);
        descriptor = this.parseVertexAttributes(descriptor);
        descriptor = this.parseDrawConfig(descriptor);
        descriptor = this.parseUniformBuffers(descriptor);
        descriptor = this.parseUniform(descriptor);
        descriptor = this.parseImageTexture(descriptor);
        descriptor = this.parseTextureSampler(descriptor);
        //console.log("descriptor = ", descriptor)
        return descriptor;
    }


    public initFromObject(descriptor: {
        //description primitive : 
        cullMode?: "front" | "back" | "none",
        topology?: "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip",
        frontFace?: "ccw" | "cw",
        stripIndexFormat?: "uint16" | "uint32"
        antiAliasing?: boolean,
        depthTest?: boolean,
        clearColor?: { r: number, g: number, b: number, a: number },
        blendMode?: BlendMode,
        bindgroups?: any,
        indexBuffer?: IndexBuffer,
        vertexShader: {
            main: string
            outputs?: any,
            inputs?: any,
            code?: string,
        } | string,
        fragmentShader?: {
            main: string,
            outputs?: any,
            inputs?: any,
            code?: string
        } | string
        , [key: string]: unknown
    }) {


        descriptor = this.highLevelParse(descriptor);



        this.vertexShader = null;
        this.fragmentShader = null;

        this.bindGroups.destroy();

        super.initFromObject(descriptor);

        if (!descriptor.cullMode) this.description.primitive.cullMode = "none";
        else this.description.primitive.cullMode = descriptor.cullMode;

        if (!descriptor.topology) this.description.primitive.topology = "triangle-list";
        else {
            this.description.primitive.topology = descriptor.topology;
            if (descriptor.topology === "line-strip" || descriptor.topology === "triangle-strip") {
                if (!descriptor.stripIndexFormat) {
                    throw new Error("You must define a 'stripIndexFormat' in order to use a topology 'triangle-strip' or 'line-strip'. See https://www.w3.org/TR/webgpu/#enumdef-gpuindexformat for more details")
                }
            }
        }

        if (!descriptor.frontFace) this.description.primitive.frontFace = "ccw";
        else this.description.primitive.frontFace = descriptor.frontFace;


        if (descriptor.indexBuffer) this.indexBuffer = descriptor.indexBuffer;

        if (this.outputColor) {
            if (descriptor.clearColor) this.outputColor.clearValue = descriptor.clearColor;
            else descriptor.clearColor = this.outputColor.clearValue;
        }


        if (descriptor.blendMode) this.blendMode = descriptor.blendMode;

        if (descriptor.antiAliasing) this.setupMultiSampleView();
        if (descriptor.depthTest) this.setupDepthStencilView();

        if (descriptor.bindgroups) {
            let group: Bindgroup;
            let resourcesGroups: IShaderResource[][] = [];
            let k = 0;
            for (let z in descriptor.bindgroups) {
                group = new Bindgroup(z);
                //console.log("=> ", z, descriptor.bindgroups[z])
                resourcesGroups[k++] = group.initFromObject(descriptor.bindgroups[z]);
                this.bindGroups.add(group);
            }



            if (descriptor.bindgroups.default) {
                if (descriptor.bindgroups.default.buffer) {
                    const attributes = (descriptor.bindgroups.default.buffer as VertexBuffer).attributes;
                    for (let z in attributes) {
                        if (descriptor[z]) descriptor[z] = attributes[z];
                    }
                }
            }

        }


        const createArrayOfObjects = (obj: any) => {
            const result = [];
            let o: any;
            for (let z in obj) {
                o = obj[z];
                result.push({ name: z, ...o })
            }
            return result;
        }


        this.vertexShader = new VertexShader();

        if (typeof descriptor.vertexShader === "string") {
            this.vertexShader.main.text = descriptor.vertexShader;
        } else {
            this.vertexShader.inputs = createArrayOfObjects(descriptor.vertexShader.inputs);
            this.vertexShader.outputs = createArrayOfObjects(descriptor.vertexShader.outputs);
            if (descriptor.vertexShader.code) this.vertexShader.code.text = descriptor.vertexShader.code;
            this.vertexShader.main.text = descriptor.vertexShader.main;
        }



        if (descriptor.fragmentShader) {
            this.fragmentShader = new FragmentShader();

            if (typeof descriptor.fragmentShader === "string") {
                this.fragmentShader.main.text = descriptor.fragmentShader;
            } else {
                this.fragmentShader.inputs = createArrayOfObjects(descriptor.fragmentShader.inputs);;
                this.fragmentShader.outputs = createArrayOfObjects(descriptor.fragmentShader.outputs);;
                if (descriptor.fragmentShader.code) this.fragmentShader.code.text = descriptor.fragmentShader.code;
                this.fragmentShader.main.text = descriptor.fragmentShader.main;
            }

        }


        return descriptor;

    }
    /*
    private handleVertexBufferIO(){
        const groups = this.bindGroups.groups;
        let group:Bindgroup;
        let element:{name:string,resource:IShaderResource};
        for(let i=0;i<groups.length;i++){
            group = groups[i];
            for(group.elements
        }
    }
    */

    public createColorAttachment(rgba: { r: number, g: number, b: number, a: number }, view: GPUTextureView = undefined): any {

        const colorAttachment = {
            view: view,
            clearValue: rgba,
            loadOp: "clear",
            storeOp: "store"
        }

        this.renderPassDescriptor.colorAttachments.push(colorAttachment);



        return colorAttachment;
    }
    //----------- used if there is no indexBuffer ------
    private drawConfig: { vertexCount: number, instanceCount: number, firstVertexId: number, firstInstanceId: number } = {
        vertexCount: -1,
        instanceCount: 1,
        firstVertexId: 0,
        firstInstanceId: 0
    }

    public setupDraw(o: { instanceCount?: number, vertexCount?: number, firstVertexId?: number, firstInstanceId?: number }) {

        if (o.instanceCount !== undefined) this.drawConfig.instanceCount = o.instanceCount;
        if (o.vertexCount !== undefined) this.drawConfig.vertexCount = o.vertexCount;
        if (o.firstVertexId !== undefined) this.drawConfig.firstVertexId = o.firstVertexId;
        if (o.firstInstanceId !== undefined) this.drawConfig.firstInstanceId = o.firstInstanceId;
    }

    public get vertexCount(): number { return this.drawConfig.vertexCount }
    public set vertexCount(n: number) { this.drawConfig.vertexCount = n; }

    public get instanceCount(): number { return this.drawConfig.instanceCount }
    public set instanceCount(n: number) { this.drawConfig.instanceCount = n; }

    public get firstVertexId(): number { return this.drawConfig.firstVertexId }
    public set firstVertexId(n: number) { this.drawConfig.firstVertexId = n; }

    public get firstInstanceId(): number { return this.drawConfig.firstInstanceId }
    public set firstInstanceId(n: number) { this.drawConfig.firstInstanceId = n; }

    //------------------------------------------------

    public setupMultiSampleView(descriptor?: {
        size?: GPUExtent3D,
        format?: GPUTextureFormat,
        usage?: GPUTextureUsageFlags,
        sampleCount?: GPUSize32,
        alphaToCoverageEnabled?: boolean,
        mask?: number,
        resolveTarget?: GPUTextureView
    }) {


        if (this.multisampleTexture) this.multisampleTexture.destroy();
        if (!descriptor) descriptor = {};
        if (!descriptor.size) descriptor.size = [this.canvas.width, this.canvas.height];
        this.multisampleTexture = new MultiSampleTexture(descriptor as any);

        this.description.multisample = {
            count: this.multisampleTexture.description.count
        }
    }

    //---------------------------

    public setupDepthStencilView(
        descriptor?: {
            size?: GPUExtent3D,
            format?: "stencil8" | "depth16unorm" | "depth24plus" | "depth24plus-stencil8" | "depth32float",
            usage?: GPUTextureUsageFlags
        },
        depthStencilDescription?: {
            depthWriteEnabled: boolean,
            depthCompare: "never" | "less" | "equal" | "less-equal" | "greater" | "not-equal" | "greater-equal" | "always",

        },
        depthStencilAttachmentOptions?: any

    ) {

        if (!descriptor) descriptor = {}
        if (!descriptor.size) descriptor.size = [this.renderer.width, this.renderer.height];


        if (this._depthStencilTexture) this._depthStencilTexture.destroy();
        this._depthStencilTexture = new DepthStencilTexture(descriptor as any, depthStencilDescription, depthStencilAttachmentOptions)


        this.renderPassDescriptor.depthStencilAttachment = this.depthStencilTexture.attachment;
        this.description.depthStencil = this.depthStencilTexture.description;

        //console.log("depthStencilAttachment ", this.depthStencilTexture.attachment)
        //console.log("this.description.depthStencil ", this.description.depthStencil)

    }
    //----------------------------------------

    public get renderPassView(): GPUTextureView { return this.renderPass.view }
    public get renderPass(): RenderPassTexture {
        if (!this.renderPassTexture) {
            this.renderPassTexture = new RenderPassTexture({ size: [this.canvas.width, this.canvas.height] })
        }
        return this.renderPassTexture;
    }



    protected cleanInputs(/*initIO: boolean = false*/) {
        const _inputs = [];
        const t = this.vertexShader.inputs;
        for (let z in t) _inputs.push({ name: z, ...t[z] });
        this.vertexShader.inputs = _inputs;
        return _inputs;
    }


    public blendMode: BlendMode;
    private getFragmentShaderColorOptions() {
        const o: any = {
            format: XGPU.getPreferredCanvasFormat(),

        }
        if (this.blendMode) o.blend = this.blendMode;
        return o;
    }


    public buildGpuPipeline(): GPURenderPipeline {
        if (this.gpuPipeline) return this.gpuPipeline;

        this.bindGroups.handleRenderPipelineResourceIOs();
        this.initPipelineResources(this);


        const o = this.bindGroups.build();
        const buffers: VertexBuffer[] = o.buffers;
        this.description.vertex = o.description.vertex;

        if (o.description.layout) this.description.layout = o.description.layout;
        else this.description.layout = "auto";


        //setup vertexShader inputs ------
        const vertexInput: ShaderStruct = new ShaderStruct("Input", this.cleanInputs());;

        if (buffers.length) {
            let buffer: VertexBuffer;
            let arrays: VertexAttribute[];
            let builtin: number = 0;
            for (let i = 0; i < buffers.length; i++) {
                buffer = buffers[i];
                arrays = buffer.vertexArrays;
                for (let j = 0; j < arrays.length; j++) {
                    vertexInput.addProperty({ name: arrays[j].name, type: arrays[j].varType, builtin: "@location(" + builtin + ")" })
                    builtin++;
                }
            }
        }

        //---------------------------------


        const vertexShader: { code: string, output: ShaderStruct } = this.vertexShader.build(this, vertexInput);


        let fragmentShader: { code: string, output: ShaderStruct };
        if (this.fragmentShader) {
            fragmentShader = this.fragmentShader.build(this, vertexShader.output.getInputFromOutput());
        }


        this.description.vertex = {
            module: XGPU.device.createShaderModule({
                code: vertexShader.code
            }),
            entryPoint: "main",
            buffers: o.description.vertex.buffers//this.createVertexBufferLayout()
        }

        if (this.fragmentShader) {

            this.description.fragment = {
                module: XGPU.device.createShaderModule({
                    code: fragmentShader.code
                }),
                entryPoint: "main",
                targets: [
                    this.getFragmentShaderColorOptions()
                ]

            }
        }





        //this.description.layout = this.gpuPipelineLayout;

        //console.log("buildGPUPipeline description = ", this.description)
        this.gpuPipeline = XGPU.createRenderPipeline(this.description);
        //console.log("gpuPipeline = ", this.gpuPipeline)
        return this.gpuPipeline;

    }

    //-------------------------------------------

    private clearOpReady: boolean = false;
    private rendererUseSinglePipeline: boolean = true;

    public beginRenderPass(commandEncoder: GPUCommandEncoder, outputView?: GPUTextureView): GPURenderPassEncoder {
        if (!this.resourceDefined) return null;

        if (this.onDrawBegin) this.onDrawBegin();

        let rendererUseSinglePipeline: boolean = this.renderer.useSinglePipeline;

        if (this.rendererUseSinglePipeline !== rendererUseSinglePipeline) {
            this.clearOpReady = false;
            this.rendererUseSinglePipeline = rendererUseSinglePipeline;
        }

        if (this.clearOpReady === false && this.renderPassDescriptor.colorAttachments[0]) {
            this.clearOpReady = true;



            if (rendererUseSinglePipeline) this.renderPassDescriptor.colorAttachments[0].loadOp = "clear";
            else {
                if (this.renderer.firstPipeline === this) this.renderPassDescriptor.colorAttachments[0].loadOp = "clear";
                else this.renderPassDescriptor.colorAttachments[0].loadOp = "load";
            }


        }


        if (!this.gpuPipeline) this.buildGpuPipeline();

        if (this.drawConfig.vertexCount <= 0) {


            if (this.bindGroups.resources.types) {

                const vertexBuffers = this.bindGroups.resources.types.vertexBuffers;
                if (vertexBuffers) {
                    for (let i = 0; i < vertexBuffers.length; i++) {

                        if (vertexBuffers[i].resource.descriptor.stepMode === "vertex") {
                            this.drawConfig.vertexCount = vertexBuffers[i].resource.nbVertex; //this.vertexBuffers[0].nbVertex;
                            break;
                        }
                    }
                }
            }


        }
        //console.log("drawConfig = ", this.drawConfig)

        if ((this.canvas as any).dimensionChanged) {
            if (this.multisampleTexture) {
                this.multisampleTexture.resize(this.canvas.width, this.canvas.height);
            }
            if (this.depthStencilTexture) {
                this.depthStencilTexture.resize(this.canvas.width, this.canvas.height);
            }
            if (this.renderPassTexture) {
                this.renderPassTexture.resize(this.canvas.width, this.canvas.height)
            }
        }

        if (outputView && this.outputColor) this.handleOutputColor(outputView);


        //console.log("renderPassDescriptor = ", this.renderPassDescriptor);
        return commandEncoder.beginRenderPass(this.renderPassDescriptor);
    }

    private handleOutputColor(outputView: GPUTextureView) {
        if (this.outputColor) {

            if (this.multisampleTexture) {
                if (!this.multisampleTexture.view) this.multisampleTexture.create();
                //console.log("MSAA view = ", this.multisampleTexture.view)
                this.outputColor.view = this.multisampleTexture.view;

                if (this.multisampleTexture.resolveTarget) this.outputColor.resolveTarget = this.multisampleTexture.resolveTarget;
                else this.outputColor.resolveTarget = outputView;

            } else {
                this.outputColor.view = outputView;
            }
        }

    }

    //----------------------------------------------------------------------

    public update(): void {
        if (!this.gpuPipeline) return;
        this.bindGroups.update();
    }


    public draw(renderPass: GPURenderPassEncoder, gpuPipeline?: GPURenderPipeline) {

        if (!this.resourceDefined) return;



        if (gpuPipeline) {

            this.bindGroups.update();


        } else {

            renderPass.setPipeline(this.gpuPipeline);

            const resourceByType = this.bindGroups.resources.types;
            if (resourceByType) {

                const buffers = resourceByType.vertexBuffers;

                if (this.drawConfig.vertexCount <= 0) {

                    if (!buffers) {
                        throw new Error("a renderPipeline require a vertexBuffer or a drawConfig object in order to draw. You must add a vertexBuffer or call RenderPipeline.setupDraw")
                    }
                    const vertexBuffer: VertexBuffer = buffers[0].resource as VertexBuffer;
                    this.drawConfig.vertexCount = vertexBuffer.nbVertex;
                }

                if (buffers) {
                    let k = 0;
                    for (let i = 0; i < buffers.length; i++) {
                        renderPass.setVertexBuffer(k++, buffers[i].resource.getCurrentBuffer())
                    }
                }
            }


        }

        this.bindGroups.apply(renderPass);






        if (this.indexBuffer) {
            //console.log("a ", this.debug, this.drawConfig)
            if (!this.indexBuffer.gpuResource) this.indexBuffer.createGpuResource();



            renderPass.setIndexBuffer(this.indexBuffer.gpuResource, this.indexBuffer.dataType, this.indexBuffer.offset, this.indexBuffer.getBufferSize());
            renderPass.drawIndexed(this.indexBuffer.nbPoint);


        } else {

            if (this.drawConfig.vertexCount !== -1) {
                //console.log("drawConfig = ", this.drawConfig)
                renderPass.draw(this.drawConfig.vertexCount, this.drawConfig.instanceCount, this.drawConfig.firstVertexId, this.drawConfig.firstInstanceId)
            }

        }

    }


    //-------------------------------

    public end(commandEncoder, renderPass) {
        if (!this.resourceDefined) return;

        renderPass.end();

        if (this.renderPassTexture) {
            if (!this.renderPassTexture.gpuResource) this.renderPassTexture.createGpuResource();

            commandEncoder.copyTextureToTexture({ texture: this.renderer.texture }, { texture: this.renderPassTexture.gpuResource }, [this.canvas.width, this.canvas.height]);
        }
        if (this.onDrawEnd) this.onDrawEnd();
    }


    private get resourceDefined(): boolean {
        const bool = !!this.bindGroups.resources.all
        if (!bool) {
            //some very basic shader can run without any resource
            if (this.drawConfig.vertexCount > 0) {
                if (this.vertexShader.main.text != "" && this.fragmentShader.main.text != "") {
                    return true;
                }
            }

            return false;
        }
        return true
    }

    public get pipeline(): GPURenderPipeline { return this.gpuPipeline }

    public get cullMode(): "front" | "back" | "none" { return this.description.primitive.cullMode }
    public set cullMode(s: "front" | "back" | "none") { this.description.primitive.cullMode = s }

    public get topology(): "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip" { return this.description.primitive.topology }
    public set topology(s: "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip") { this.description.primitive.topology = s }

    public get frontFace(): "ccw" | "cw" { return this.description.primitive.frontFace }
    public set frontFace(s: "ccw" | "cw") { this.description.primitive.frontFace = s }

    public get stripIndexFormat(): "uint16" | "uint32" { return this.description.primitive.stripIndexFormat }
    public set stripIndexFormat(s: "uint16" | "uint32") { this.description.primitive.stripIndexFormat = s }
}