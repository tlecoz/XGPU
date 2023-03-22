import { SLGPU } from "../SLGPU";
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

export class RenderPipeline extends Pipeline {


    protected renderer: GPURenderer | HeadlessGPURenderer;
    protected canvas: { width: number, height: number, dimensionChanged: boolean };

    protected depthStencilTexture: DepthStencilTexture;
    protected multisampleTexture: MultiSampleTexture;
    protected renderPassTexture: RenderPassTexture;

    public outputColor: any;
    public renderPassDescriptor: any = { colorAttachments: [] }
    public indexBuffer: IndexBuffer = null;

    protected gpuPipeline: GPURenderPipeline;

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
        this.outputColor = this.createColorAttachment(bgColor);
    }




    public initFromObject(descriptor: {
        stepMode?: "vertex" | "instance",
        clearColor?: { r: number, g: number, b: number, a: number },
        blendMode?: BlendMode,
        bindgroups?: any,
        indexBuffer?: IndexBuffer,
        vertexShader: {
            outputs: any,
            main: string
            inputs?: any,
            code?: string,
        },
        fragmentShader: {
            outputs: any,
            main: string,
            inputs?: any,
            code?: string
        }
    }) {

        super.initFromObject(descriptor);

        if (descriptor.indexBuffer) this.indexBuffer = descriptor.indexBuffer;

        if (descriptor.clearColor) this.outputColor.clearValue = descriptor.clearColor;
        else descriptor.clearColor = this.outputColor.clearValue;

        if (descriptor.blendMode) this.blendMode = descriptor.blendMode;

        if (descriptor.bindgroups) {
            let group: Bindgroup;
            for (let z in descriptor.bindgroups) {
                group = new Bindgroup(z);
                group.initFromObject(descriptor.bindgroups[z]);
                this.bindGroups.add(group);
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

        this.vertexShader.inputs = createArrayOfObjects(descriptor.vertexShader.inputs);
        this.fragmentShader.inputs = createArrayOfObjects(descriptor.fragmentShader.inputs);;

        this.vertexShader.outputs = createArrayOfObjects(descriptor.vertexShader.outputs);
        this.fragmentShader.outputs = createArrayOfObjects(descriptor.fragmentShader.outputs);;

        if (descriptor.vertexShader.code) this.vertexShader.code.text = descriptor.vertexShader.code;
        this.vertexShader.main.text = descriptor.vertexShader.main;

        if (descriptor.fragmentShader.code) this.fragmentShader.code.text = descriptor.fragmentShader.code;
        this.fragmentShader.main.text = descriptor.fragmentShader.main;

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
    //------------------------------------------------

    public setupMultiSampleView(descriptor: {
        size: GPUExtent3D,
        format?: GPUTextureFormat,
        usage?: GPUTextureUsageFlags,
        sampleCount?: GPUSize32,
        alphaToCoverageEnabled?: boolean,
        mask?: number,
        resolveTarget?: GPUTextureView
    }) {


        if (this.multisampleTexture) this.multisampleTexture.destroy();

        descriptor.size = [this.canvas.width, this.canvas.height];
        this.multisampleTexture = new MultiSampleTexture(descriptor);

        this.description.multisample = {
            count: this.multisampleTexture.description.count
        }
    }

    //---------------------------

    public setupDepthStencilView(
        descriptor: {
            size: GPUExtent3D,
            format?: "stencil8" | "depth16unorm" | "depth24plus" | "depth24plus-stencil8" | "depth32float",
        },
        depthStencilDescription?: {
            depthWriteEnabled: boolean,
            depthCompare: "never" | "less" | "equal" | "less-equal" | "greater" | "not-equal" | "greater-equal" | "always",
            format: string
        },
        depthStencilAttachmentOptions?: any

    ) {

        if (this.depthStencilTexture) this.depthStencilTexture.destroy();
        this.depthStencilTexture = new DepthStencilTexture(descriptor, depthStencilDescription, depthStencilAttachmentOptions)

        console.log("depthStencilAttachment ", this.depthStencilTexture.attachment)
        this.renderPassDescriptor.depthStencilAttachment = this.depthStencilTexture.attachment;
        this.description.depthStencil = this.depthStencilTexture.description;

    }
    //----------------------------------------

    public get renderPassView(): GPUTextureView { return this.renderPass.view }
    public get renderPass(): RenderPassTexture {
        if (!this.renderPassTexture) {
            this.renderPassTexture = new RenderPassTexture({ size: [this.canvas.width, this.canvas.height] })
        }
        return this.renderPassTexture;
    }



    //----------------------------------------




    protected cleanInputs(/*initIO: boolean = false*/) {
        const _inputs = [];
        const t = this.vertexShader.inputs;
        //console.log(t)
        //let o: any;
        /*
        let k = 0;
        
        for (let i = 0; i < t.length; i++) {
            
            //o = t[i];
            //if ((o instanceof VertexBufferIO) || (o instanceof TextureIO)) {
                //must be overrided
            //    continue;
            //}
            //_inputs[k++] = t[i];
        }*/

        for (let z in t) _inputs.push({ name: z, ...t[z] });
        //console.log("inputs = ", _inputs)
        this.vertexShader.inputs = _inputs;
        return _inputs;
    }


    public blendMode: BlendMode;
    private getFragmentShaderColorOptions() {
        const o: any = {
            format: SLGPU.getPreferredCanvasFormat(),

        }
        if (this.blendMode) o.blend = this.blendMode;
        return o;
    }

    public buildGpuPipeline(): GPURenderPipeline {
        if (this.gpuPipeline) return this.gpuPipeline

        this.bindGroups.handleRenderPipelineResourceIOs();

        this.initPipelineResources(this);
        this.build();

        //setup vertexShader inputs ------
        const vertexInput: ShaderStruct = new ShaderStruct("Input", this.cleanInputs());;

        if (this.vertexBuffers.length) {
            let buffer: VertexBuffer;
            let arrays: VertexAttribute[];
            let builtin: number = 0;
            for (let i = 0; i < this.vertexBuffers.length; i++) {
                buffer = this.vertexBuffers[i];
                arrays = buffer.vertexArrays;
                for (let j = 0; j < arrays.length; j++) {
                    vertexInput.addProperty({ name: arrays[j].name, type: arrays[j].varType, builtin: "@location(" + builtin + ")" })
                    builtin++;
                }
            }
        }

        //---------------------------------


        const vertexShader: { code: string, output: ShaderStruct } = this.vertexShader.build(this, vertexInput);
        const fragmentShader: { code: string, output: ShaderStruct } = this.fragmentShader.build(this, vertexShader.output.getInputFromOutput());

        this.description.vertex = {
            module: SLGPU.device.createShaderModule({
                code: vertexShader.code
            }),
            entryPoint: "main",
            buffers: this.createVertexBufferLayout()
        }

        this.description.fragment = {
            module: SLGPU.device.createShaderModule({
                code: fragmentShader.code
            }),
            entryPoint: "main",
            targets: [
                this.getFragmentShaderColorOptions()
                /*
                {
                    format: SLGPU.getPreferredCanvasFormat(),
                    blend: {
                        color: {
                            operation: "add",
                            srcFactor: "src-alpha",
                            dstFactor: "one-minus-src-alpha"
                        },
                        alpha: {
                            operation: "add",
                            srcFactor: "src-alpha",
                            dstFactor: "one-minus-src-alpha"
                        }
                    }
                },*/


            ]
        }



        this.description.layout = this.gpuPipelineLayout;

        console.log("buildGPUPipeline description = ", this.description)
        this.gpuPipeline = SLGPU.createRenderPipeline(this.description);

        return this.gpuPipeline;

    }

    //-------------------------------------------


    public beginRenderPass(commandEncoder: GPUCommandEncoder, outputView?: GPUTextureView): GPURenderPassEncoder {
        if (!this.resourceDefined) return;

        if (!this.gpuPipeline) this.buildGpuPipeline();

        if (this.drawConfig.vertexCount === 0) {
            if (this.vertexBuffers.length) {
                this.drawConfig.vertexCount = this.vertexBuffers[0].nbVertex;

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


    public draw(renderPass: GPURenderPassEncoder) {

        if (!this.resourceDefined) return;


        renderPass.setPipeline(this.gpuPipeline);

        //console.log("bindGroups.resources = ", this.bindGroups.resources)
        const resourceByType = this.bindGroups.resources.types;
        const buffers = resourceByType.vertexBuffers;


        if (this.drawConfig.vertexCount === -1) {
            if (!buffers) {
                throw new Error("a renderPipeline require a vertexBuffer or a drawConfig object in order to draw. You must add a vertexBuffer or call RenderPipeline.setupDraw")
            }
            const vertexBuffer: VertexBuffer = buffers[0].resource as VertexBuffer;
            this.drawConfig.vertexCount = vertexBuffer.nbVertex;
        }

        if (buffers) {
            //console.log("DRAW BUFFERS ", buffers)
            let k = 0;
            for (let i = 0; i < buffers.length; i++) {
                //if (i > 2) continue;
                //console.log(" renderPass.setVertexBuffer(", k, ",", buffers[i].resource.getCurrentBuffer(), ", 0,", buffers[i].resource.getCurrentBuffer().size, ")")
                renderPass.setVertexBuffer(k++, buffers[i].resource.getCurrentBuffer())
            }
        }

        this.bindGroups.apply(renderPass);






        if (this.indexBuffer) {
            if (!this.indexBuffer.gpuResource) this.indexBuffer.createGpuResource();
            renderPass.setIndexBuffer(this.indexBuffer.gpuResource, this.indexBuffer.dataType, this.indexBuffer.offset, this.indexBuffer.nbPoint * 4);
            renderPass.drawIndexed(this.indexBuffer.nbPoint);
        } else {

            if (this.drawConfig.vertexCount !== -1) {

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


    private get resourceDefined(): boolean { return !!this.bindGroups.resources.all }

    public get pipeline(): GPURenderPipeline { return this.gpuPipeline }

    public get cullMode(): string { return this.description.primitive.cullMode }
    public set cullMode(s: string) { this.description.primitive.cullMode = s }

    public get topology(): string { return this.description.primitive.topology }
    public set topology(s: string) { this.description.primitive.topology = s }
}