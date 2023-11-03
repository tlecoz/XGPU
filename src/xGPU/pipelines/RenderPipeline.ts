// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "../XGPU";
import { Bindgroup } from "../shader/Bindgroup";
import { FragmentShader } from "../shader/FragmentShader";
import { VertexAttribute } from "../shader/resources/VertexAttribute";
import { VertexBuffer } from "../shader/resources/VertexBuffer";
import { ShaderStruct } from "../shader/shaderParts/ShaderStruct";
import { VertexShader } from "../shader/VertexShader";
import { Pipeline } from "./Pipeline";
import { BlendMode } from "../blendmodes/BlendMode";
import { DepthStencilTexture } from "./resources/textures/DepthStencilTexture";
import { MultiSampleTexture } from "./resources/textures/MultiSampleTexture";
import { RenderPassTexture } from "./resources/textures/RenderPassTexture";
import { IndexBuffer } from "./resources/IndexBuffer";
import { IShaderResource } from "../shader/resources/IShaderResource";
import { Bindgroups } from "../shader/Bindgroups";
import { ImageTextureArray } from "../shader/resources/ImageTextureArray";
import { IRenderer } from "../IRenderer";
import { DrawConfig } from "./resources/DrawConfig";
import { HighLevelParser } from "../HighLevelParser";
import { FragmentShaderInput, FragmentShaderOutputs, VertexShaderInput, VertexShaderOutput } from "../BuiltIns";
import { VertexBufferIO } from "../shader/resources/VertexBufferIO";
import { ImageTextureIO } from "../shader/resources/ImageTextureIO";
import { PrimitiveType } from "../PrimitiveType";
import { UniformBuffer } from "../shader/resources/UniformBuffer";

export type HighLevelShaderResource = (IShaderResource | VertexBufferIO | ImageTextureIO | PrimitiveType | VertexAttribute)



export type BindgroupDescriptor = {
    [key: string]: HighLevelShaderResource
}

export type DefaultBindgroup = BindgroupDescriptor & {
    uniforms?: UniformBuffer
    buffer?: VertexBuffer
}

export type BindgroupsDescriptor = {
    default?: DefaultBindgroup,
    [key: string]: (Bindgroup | BindgroupDescriptor)
}

export type VertexShaderDescriptor = {
    main: string,
    constants?: string,
    inputs: {
        [key: string]: VertexShaderInput
    },
    outputs: {
        [key: string]: VertexShaderOutput
    }
} | string;

export type FragmentShaderDescriptor = {
    main: string,
    constants?: string,
    inputs: {
        [key: string]: FragmentShaderInput
    },
    outputs: {
        [key: string]: FragmentShaderOutputs
    }
} | string;

export type RenderPipelineProperties = {
    vertexCount?: number,
    instanceCount?: number,
    firstVertexId?: number,
    firstInstanceId?: number,
    cullMode?: "front" | "back" | "none",
    topology?: "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip",
    frontFace?: "ccw" | "cw",
    stripIndexFormat?: "uint16" | "uint32",
    antiAliasing?: boolean,
    useDepthTexture?: boolean,
    depthTextureSize?: number,
    depthTest?: boolean,
    clearColor?: { r: number, g: number, b: number, a: number },
    blendMode?: BlendMode,
    bindgroups?: BindgroupsDescriptor,
    indexBuffer?: IndexBuffer,
    vertexShader: VertexShaderDescriptor,
    fragmentShader?: FragmentShaderDescriptor,
}

export type RenderPipelineDescriptor = RenderPipelineProperties & BindgroupDescriptor

export class RenderPipeline extends Pipeline {


    public renderer: IRenderer;//GPURenderer | HeadlessGPURenderer;
    public drawConfig: DrawConfig;
    protected _depthStencilTexture: DepthStencilTexture;
    protected multisampleTexture: MultiSampleTexture;
    protected renderPassTexture: RenderPassTexture;

    public outputColor: any;
    public renderPassDescriptor: any = { colorAttachments: [] }



    protected gpuPipeline: GPURenderPipeline;

    public debug: string = "renderPipeline";
    public onDrawBegin: () => void;
    public onDrawEnd: () => void;
    public onDraw: (drawCallId: number) => void;

    constructor(renderer: IRenderer, bgColor: { r: number, g: number, b: number, a: number } = { r: 0, g: 0, b: 0, a: 1 }) {
        super();

        if (!renderer.canvas) {
            throw new Error("A RenderPipeline need a GPUProcess with a canvas in order to draw things inside. You must pass a reference to a canvas when you instanciate the GPUProcess.")
        }
        this.type = "render";
        this.renderer = renderer;
        this.drawConfig = new DrawConfig(this);
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
    public get canvas(): any { return this.renderer.canvas; }
    public get depthStencilTexture(): DepthStencilTexture { return this._depthStencilTexture; }


    public destroy() {
        this.bindGroups.destroy();
        if (this.multisampleTexture) this.multisampleTexture.destroy();
        if (this.renderPassTexture) this.renderPassTexture.destroyGpuResource();
        if (this.depthStencilTexture) this.depthStencilTexture.destroy();
        for (let z in this.description) this.description[z] = null;
        for (let z in this) {
            try {
                (this[z] as any).destroy();
            } catch (e) {
                try {
                    (this[z] as any).destroyGpuResource();
                } catch (e) {

                }
            }

            this[z] = null;
        }



    }

    public initFromObject(descriptor: {
        //description primitive : 
        cullMode?: "front" | "back" | "none",
        topology?: "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip",
        frontFace?: "ccw" | "cw",
        stripIndexFormat?: "uint16" | "uint32"
        keepRendererAspectRatio?: boolean,

        antiAliasing?: boolean,
        useDepthTexture?: boolean,
        depthTextureSize?: number,
        depthTest?: boolean,
        clearColor?: { r: number, g: number, b: number, a: number },
        blendMode?: BlendMode,
        bindgroups?: any,
        indexBuffer?: IndexBuffer,
        vertexShader: {
            main: string
            outputs?: any,
            inputs?: any,
            constants?: string,
        } | string,
        fragmentShader?: {
            main: string,
            outputs?: any,
            inputs?: any,
            constants?: string
        } | string
        , [key: string]: unknown
    }): any {

        const time = new Date().getTime();

        this._resources = {};
        this.vertexShader = null;
        this.fragmentShader = null;
        this.gpuPipeline = null;
        this.bindGroups.destroy();
        this.bindGroups = new Bindgroups(this, "pipeline");

        //--------



        descriptor = HighLevelParser.parse(descriptor, "render", this.drawConfig);




        super.initFromObject(descriptor);

        if (!descriptor.cullMode) this.description.primitive.cullMode = "none";
        else this.description.primitive.cullMode = descriptor.cullMode;

        if (!descriptor.topology) this.description.primitive.topology = "triangle-list";
        else {
            this.description.primitive.topology = descriptor.topology;
            if (descriptor.topology === "line-strip" || descriptor.topology === "triangle-strip") {
                if (!descriptor.stripIndexFormat) {
                    throw new Error("You must define a 'stripIndexFormat' in order to use a topology 'triangle-strip' or 'line-strip'. See https://www.w3.org/TR/webgpu/#enumdef-gpuindexformat for more details")
                } else {
                    this.description.primitive.stripIndexFormat = descriptor.stripIndexFormat;
                }
            }
        }

        if (!descriptor.frontFace) this.description.primitive.frontFace = "ccw";
        else this.description.primitive.frontFace = descriptor.frontFace;


        if (descriptor.indexBuffer) {

            this.drawConfig.indexBuffer = descriptor.indexBuffer;
            //this.indexBuffer = descriptor.indexBuffer;
        }

        if (this.outputColor) {
            if (descriptor.clearColor) this.outputColor.clearValue = descriptor.clearColor;
            else descriptor.clearColor = this.outputColor.clearValue;
        }



        if (descriptor.blendMode) this.blendMode = descriptor.blendMode;

        if (descriptor.antiAliasing) this.setupMultiSampleView();

        if (descriptor.useDepthTexture) {
            let depthTextureSize: number = 1024;
            if (descriptor.depthTextureSize) depthTextureSize = descriptor.depthTextureSize;
            this.setupDepthStencilView({
                size: [depthTextureSize, depthTextureSize, 1],
                format: "depth32float",
                usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
            })
        } else if (descriptor.depthTest) this.setupDepthStencilView();


        if (descriptor.bindgroups) {
            let group: Bindgroup;
            let resourcesGroups: IShaderResource[][] = [];
            let k = 0;
            for (let z in descriptor.bindgroups) {

                if (descriptor.bindgroups[z] instanceof Bindgroup) {

                    const elements = descriptor.bindgroups[z].elements as { name: string, resource: IShaderResource }[];
                    const resources: IShaderResource[] = [];
                    for (let i = 0; i < elements.length; i++) {
                        resources[i] = elements[i].resource;
                    }

                    resourcesGroups[k++] = resources;
                    descriptor.bindgroups[z].name = z;
                    this.bindGroups.add(descriptor.bindgroups[z] as Bindgroup);

                } else {

                    group = new Bindgroup();
                    group.name = z;
                    const g = group.initFromObject(descriptor.bindgroups[z]);
                    resourcesGroups[k++] = g;

                    this.bindGroups.add(group);
                }


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

        //if (descriptor.keepRendererAspectRatio !== undefined) this.vertexShader.keepRendererAspectRatio = descriptor.keepRendererAspectRatio;

        if (typeof descriptor.vertexShader === "string") {
            this.vertexShader.main.text = descriptor.vertexShader;
        } else {
            this.vertexShader.inputs = createArrayOfObjects(descriptor.vertexShader.inputs);
            this.vertexShader.outputs = createArrayOfObjects(descriptor.vertexShader.outputs);
            if (descriptor.vertexShader.constants) this.vertexShader.constants.text = descriptor.vertexShader.constants;
            this.vertexShader.main.text = descriptor.vertexShader.main;
        }



        if (descriptor.fragmentShader) {
            this.fragmentShader = new FragmentShader();

            if (typeof descriptor.fragmentShader === "string") {
                this.fragmentShader.main.text = descriptor.fragmentShader;
            } else {
                this.fragmentShader.inputs = createArrayOfObjects(descriptor.fragmentShader.inputs);;
                this.fragmentShader.outputs = createArrayOfObjects(descriptor.fragmentShader.outputs);;
                if (descriptor.fragmentShader.constants) this.fragmentShader.constants.text = descriptor.fragmentShader.constants;
                this.fragmentShader.main.text = descriptor.fragmentShader.main;
            }

        }

        //console.log("initFromObject time = ", (new Date().getTime() - time))

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
    public get clearValue(): { r: number, g: number, b: number, a: number } {
        if (!this.renderPassDescriptor.colorAttachment) return null;
        return this.renderPassDescriptor.colorAttachment.clearValue;
    }
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



    //-----------------



    public setupDraw(o: { vertexCount: number, instanceCount?: number, firstVertexId?: number, firstInstanceId?: number, indexBuffer?: IndexBuffer, baseVertex?: number }) {



        if (o.instanceCount !== undefined) this.drawConfig.instanceCount = o.instanceCount;
        if (o.vertexCount !== undefined) this.drawConfig.vertexCount = o.vertexCount;
        if (o.firstVertexId !== undefined) this.drawConfig.firstVertexId = o.firstVertexId;
        if (o.firstInstanceId !== undefined) this.drawConfig.firstInstanceId = o.firstInstanceId;
        if (o.indexBuffer !== undefined) this.drawConfig.indexBuffer = o.indexBuffer;
        if (o.baseVertex !== undefined) this.drawConfig.baseVertex = o.baseVertex;
    }


    public get vertexCount(): number { return this.drawConfig.vertexCount }
    public set vertexCount(n: number) { this.drawConfig.vertexCount = n; }

    public get instanceCount(): number { return this.drawConfig.instanceCount }
    public set instanceCount(n: number) { this.drawConfig.instanceCount = n; }

    public get firstVertexId(): number { return this.drawConfig.firstVertexId }
    public set firstVertexId(n: number) { this.drawConfig.firstVertexId = n; }

    public get firstInstanceId(): number { return this.drawConfig.firstInstanceId }
    public set firstInstanceId(n: number) { this.drawConfig.firstInstanceId = n; }

    public get baseVertex(): number { return this.drawConfig.baseVertex }
    public set baseVertex(n: number) { this.drawConfig.baseVertex = n; }

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

        if (this._depthStencilTexture) {

            this.renderPassDescriptor.description.sampleCount = 4;
            this._depthStencilTexture.create();
        }
    }

    //---------------------------

    public setupDepthStencilView(
        descriptor?: {
            size?: GPUExtent3D,
            format?: "stencil8" | "depth16unorm" | "depth24plus" | "depth24plus-stencil8" | "depth32float",
            usage?: GPUTextureUsageFlags,
            sampleCount?: number,
        },
        depthStencilDescription?: {
            depthWriteEnabled: boolean,
            depthCompare: "never" | "less" | "equal" | "less-equal" | "greater" | "not-equal" | "greater-equal" | "always",

        },
        depthStencilAttachmentOptions?: any

    ) {

        if (!depthStencilAttachmentOptions) depthStencilAttachmentOptions = {};


        if (!descriptor) descriptor = {}
        if (!descriptor.size) descriptor.size = [this.renderer.width, this.renderer.height];
        if (this.multisampleTexture) descriptor.sampleCount = 4;
        else descriptor.sampleCount = 1;


        if (this._depthStencilTexture) this._depthStencilTexture.destroy();
        this._depthStencilTexture = new DepthStencilTexture(descriptor as any, depthStencilDescription, depthStencilAttachmentOptions)


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


    protected rebuildingAfterDeviceLost: boolean = false;
    public onRebuildStartAfterDeviceLost: () => void;
    public clearAfterDeviceLostAndRebuild() {


        if (this.onRebuildStartAfterDeviceLost) this.onRebuildStartAfterDeviceLost();

        this.gpuPipeline = null;
        if (this.drawConfig.indexBuffer) this.drawConfig.indexBuffer.createGpuResource();
        if (this.multisampleTexture) this.multisampleTexture.resize(this.canvas.width, this.canvas.height);
        if (this.depthStencilTexture) this.depthStencilTexture.resize(this.canvas.width, this.canvas.height);
        if (this.renderPassTexture) this.renderPassTexture.resize(this.canvas.width, this.canvas.height);
        this.rebuildingAfterDeviceLost = true;
        super.clearAfterDeviceLostAndRebuild();


    }



    public buildGpuPipeline(): GPURenderPipeline {
        if (this.gpuPipeline) return this.gpuPipeline;


        this.bindGroups.handleRenderPipelineResourceIOs();

        this.initPipelineResources(this);


        const o = this.bindGroups.build();


        if (o.description.layout) this.description.layout = o.description.layout;
        else this.description.layout = "auto";


        if (!this.rebuildingAfterDeviceLost) {

            const buffers: VertexBuffer[] = o.buffers;
            this.description.vertex = o.description.vertex;




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
                code: vertexShader.code,
                /*module: XGPU.device.createShaderModule({
                    code: vertexShader.code
                }),*/
                entryPoint: "main",
                buffers: o.description.vertex.buffers//this.createVertexBufferLayout()
            }

            if (this.fragmentShader) {

                this.description.fragment = {
                    code: fragmentShader.code,
                    /*module: XGPU.device.createShaderModule({
                        code: fragmentShader.code
                    }),*/
                    entryPoint: "main",
                    targets: [
                        this.getFragmentShaderColorOptions()
                    ]

                }
            }

        }

        this.description.vertex.module = XGPU.device.createShaderModule({ code: this.description.vertex.code })

        if (this.description.fragment) {
            this.description.fragment.module = XGPU.device.createShaderModule({ code: this.description.fragment.code })
        }



        this.rebuildingAfterDeviceLost = false;
        this.gpuPipeline = XGPU.createRenderPipeline(this.description);



        return this.gpuPipeline;

    }

    //-------------------------------------------

    private clearOpReady: boolean = false;
    private rendererUseSinglePipeline: boolean = true;

    public beginRenderPass(commandEncoder: GPUCommandEncoder, outputView?: GPUTextureView, drawCallId?: number): GPURenderPassEncoder {
        if (!this.resourceDefined) return null;

        if (this.onDrawBegin) this.onDrawBegin();

        let rendererUseSinglePipeline: boolean = this.renderer.useSinglePipeline && this.pipelineCount === 1;

        if (this.rendererUseSinglePipeline !== rendererUseSinglePipeline) {
            this.clearOpReady = false;
            this.rendererUseSinglePipeline = rendererUseSinglePipeline;
        }

        if (this.clearOpReady === false && this.renderPassDescriptor.colorAttachments[0] || this.pipelineCount > 1) {
            this.clearOpReady = true;



            if (rendererUseSinglePipeline && this.pipelineCount == 1) this.renderPassDescriptor.colorAttachments[0].loadOp = "clear";
            else {
                if (this.pipelineCount === 1) {
                    if (this.renderer.firstPipeline === this) this.renderPassDescriptor.colorAttachments[0].loadOp = "clear";
                    else this.renderPassDescriptor.colorAttachments[0].loadOp = "load";
                } else {

                    this.renderPassDescriptor.colorAttachments[0].loadOp = "clear";
                    if (drawCallId === 0) { }
                    else this.renderPassDescriptor.colorAttachments[0].loadOp = "load";
                }

            }
        }




        if (!this.gpuPipeline) this.buildGpuPipeline();





        if (outputView && this.outputColor) this.handleOutputColor(outputView);




        //console.log("renderPassDescriptor = ", this.renderPassDescriptor);
        return commandEncoder.beginRenderPass(this.renderPassDescriptor);
    }

    private handleOutputColor(outputView: GPUTextureView) {
        if (this.outputColor) {

            if (this.multisampleTexture) {
                if (!this.multisampleTexture.view) this.multisampleTexture.create();


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
        //console.log("renderPipeline.update start gpuPipeline = ", this.gpuPipeline)
        if (!this.gpuPipeline) return;


        if (this.renderPassTexture) this.renderPassTexture.update();
        this.bindGroups.update();
        //console.log("renderPipeline.update end")
    }


    public draw(renderPass: GPURenderPassEncoder) {

        if (!this.resourceDefined) return;
        //console.log("renderPipeline.draw start ", this.bindGroups.resources.all)
        renderPass.setPipeline(this.gpuPipeline);

        this.bindGroups.apply(renderPass);


    }


    //-------------------------------

    public end(commandEncoder, renderPass) {
        if (!this.resourceDefined) return;

        renderPass.end();


        //------ the arrays of textures may contains GPUTexture so I must use commandEncoder.copyTextureToTexture 
        // to update the content from a GPUTexture to the texture_array_2d 
        const types = this.bindGroups.resources.types;

        if (types) {

            if (!types.textureArrays) {
                let textureArrays = [];
                if (types.imageTextureArrays) textureArrays = textureArrays.concat(types.imageTextureArrays);
                if (types.cubeMapTextureArrays) textureArrays = textureArrays.concat(types.cubeMapTextureArrays);
                if (types.cubeMapTexture) textureArrays = textureArrays.concat(types.cubeMapTexture);
                types.textureArrays = textureArrays;
            }

            for (let i = 0; i < types.textureArrays.length; i++) {
                (types.textureArrays[i].resource as ImageTextureArray).updateInnerGpuTextures(commandEncoder);
            }
        }


        //----------------------------------------------------------------------------------------



        if (this.renderPassTexture) {
            if (!this.renderPassTexture.gpuResource) this.renderPassTexture.createGpuResource();

            commandEncoder.copyTextureToTexture({ texture: this.renderer.texture }, { texture: this.renderPassTexture.gpuResource }, [this.canvas.width, this.canvas.height]);
        }


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

        if (this.multisampleTexture) this.multisampleTexture.update();
        if (this.depthStencilTexture) this.depthStencilTexture.update();
        if (this.renderPassTexture) this.renderPassTexture.update();

        if (this.onDrawEnd) this.onDrawEnd();
    }


    public get resourceDefined(): boolean {
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