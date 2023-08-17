// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { XGPU } from "../XGPU";
import { Bindgroup } from "../shader/Bindgroup";
import { FragmentShader } from "../shader/FragmentShader";
import { ShaderStruct } from "../shader/shaderParts/ShaderStruct";
import { VertexShader } from "../shader/VertexShader";
import { Pipeline } from "./Pipeline";
import { DepthStencilTexture } from "./resources/textures/DepthStencilTexture";
import { MultiSampleTexture } from "./resources/textures/MultiSampleTexture";
import { RenderPassTexture } from "./resources/textures/RenderPassTexture";
import { Bindgroups } from "../shader/Bindgroups";
import { DrawConfig } from "./resources/DrawConfig";
import { HighLevelParser } from "../HighLevelParser";
export class RenderPipeline extends Pipeline {
    renderer; //GPURenderer | HeadlessGPURenderer;
    drawConfig;
    _depthStencilTexture;
    multisampleTexture;
    renderPassTexture;
    outputColor;
    renderPassDescriptor = { colorAttachments: [] };
    gpuPipeline;
    debug = "renderPipeline";
    onDrawBegin;
    onDrawEnd;
    onDraw;
    constructor(renderer, bgColor = { r: 0, g: 0, b: 0, a: 1 }) {
        super();
        if (!renderer.canvas) {
            throw new Error("A RenderPipeline need a GPUProcess with a canvas in order to draw things inside. You must pass a reference to a canvas when you instanciate the GPUProcess.");
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
        };
        if (bgColor !== null) {
            this.outputColor = this.createColorAttachment(bgColor);
        }
    }
    get canvas() { return this.renderer.canvas; }
    get depthStencilTexture() { return this._depthStencilTexture; }
    destroy() {
        this.bindGroups.destroy();
        if (this.multisampleTexture)
            this.multisampleTexture.destroy();
        if (this.renderPassTexture)
            this.renderPassTexture.destroyGpuResource();
        if (this.depthStencilTexture)
            this.depthStencilTexture.destroy();
        for (let z in this.description)
            this.description[z] = null;
        for (let z in this) {
            try {
                this[z].destroy();
            }
            catch (e) {
                try {
                    this[z].destroyGpuResource();
                }
                catch (e) {
                }
            }
            this[z] = null;
        }
    }
    initFromObject(descriptor) {
        this._resources = {};
        this.vertexShader = null;
        this.fragmentShader = null;
        this.bindGroups.destroy();
        this.bindGroups = new Bindgroups(this, "pipeline");
        //--------
        descriptor = HighLevelParser.parse(descriptor, "render", this.drawConfig);
        super.initFromObject(descriptor);
        if (!descriptor.cullMode)
            this.description.primitive.cullMode = "none";
        else
            this.description.primitive.cullMode = descriptor.cullMode;
        if (!descriptor.topology)
            this.description.primitive.topology = "triangle-list";
        else {
            this.description.primitive.topology = descriptor.topology;
            if (descriptor.topology === "line-strip" || descriptor.topology === "triangle-strip") {
                if (!descriptor.stripIndexFormat) {
                    throw new Error("You must define a 'stripIndexFormat' in order to use a topology 'triangle-strip' or 'line-strip'. See https://www.w3.org/TR/webgpu/#enumdef-gpuindexformat for more details");
                }
                else {
                    this.description.primitive.stripIndexFormat = descriptor.stripIndexFormat;
                }
            }
        }
        if (!descriptor.frontFace)
            this.description.primitive.frontFace = "ccw";
        else
            this.description.primitive.frontFace = descriptor.frontFace;
        if (descriptor.indexBuffer) {
            this.drawConfig.indexBuffer = descriptor.indexBuffer;
            //this.indexBuffer = descriptor.indexBuffer;
        }
        if (this.outputColor) {
            if (descriptor.clearColor)
                this.outputColor.clearValue = descriptor.clearColor;
            else
                descriptor.clearColor = this.outputColor.clearValue;
        }
        if (descriptor.blendMode)
            this.blendMode = descriptor.blendMode;
        if (descriptor.antiAliasing)
            this.setupMultiSampleView();
        if (descriptor.useDepthTexture) {
            let depthTextureSize = 1024;
            if (descriptor.depthTextureSize)
                depthTextureSize = descriptor.depthTextureSize;
            this.setupDepthStencilView({
                size: [depthTextureSize, depthTextureSize, 1],
                format: "depth32float",
                usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
            });
        }
        else if (descriptor.depthTest)
            this.setupDepthStencilView();
        if (descriptor.bindgroups) {
            let group;
            let resourcesGroups = [];
            let k = 0;
            for (let z in descriptor.bindgroups) {
                if (descriptor.bindgroups[z] instanceof Bindgroup) {
                    const elements = descriptor.bindgroups[z].elements;
                    const resources = [];
                    for (let i = 0; i < elements.length; i++) {
                        resources[i] = elements[i].resource;
                    }
                    resourcesGroups[k++] = resources;
                    descriptor.bindgroups[z].name = z;
                    this.bindGroups.add(descriptor.bindgroups[z]);
                }
                else {
                    group = new Bindgroup();
                    group.name = z;
                    const g = group.initFromObject(descriptor.bindgroups[z]);
                    resourcesGroups[k++] = g;
                    this.bindGroups.add(group);
                }
            }
            if (descriptor.bindgroups.default) {
                if (descriptor.bindgroups.default.buffer) {
                    const attributes = descriptor.bindgroups.default.buffer.attributes;
                    for (let z in attributes) {
                        if (descriptor[z])
                            descriptor[z] = attributes[z];
                    }
                }
            }
        }
        const createArrayOfObjects = (obj) => {
            const result = [];
            let o;
            for (let z in obj) {
                o = obj[z];
                result.push({ name: z, ...o });
            }
            return result;
        };
        this.vertexShader = new VertexShader();
        //if (descriptor.keepRendererAspectRatio !== undefined) this.vertexShader.keepRendererAspectRatio = descriptor.keepRendererAspectRatio;
        if (typeof descriptor.vertexShader === "string") {
            this.vertexShader.main.text = descriptor.vertexShader;
        }
        else {
            this.vertexShader.inputs = createArrayOfObjects(descriptor.vertexShader.inputs);
            this.vertexShader.outputs = createArrayOfObjects(descriptor.vertexShader.outputs);
            if (descriptor.vertexShader.constants)
                this.vertexShader.constants.text = descriptor.vertexShader.constants;
            this.vertexShader.main.text = descriptor.vertexShader.main;
        }
        if (descriptor.fragmentShader) {
            this.fragmentShader = new FragmentShader();
            if (typeof descriptor.fragmentShader === "string") {
                this.fragmentShader.main.text = descriptor.fragmentShader;
            }
            else {
                this.fragmentShader.inputs = createArrayOfObjects(descriptor.fragmentShader.inputs);
                ;
                this.fragmentShader.outputs = createArrayOfObjects(descriptor.fragmentShader.outputs);
                ;
                if (descriptor.fragmentShader.constants)
                    this.fragmentShader.constants.text = descriptor.fragmentShader.constants;
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
    get clearValue() {
        if (!this.renderPassDescriptor.colorAttachment)
            return null;
        return this.renderPassDescriptor.colorAttachment.clearValue;
    }
    createColorAttachment(rgba, view = undefined) {
        const colorAttachment = {
            view: view,
            clearValue: rgba,
            loadOp: "clear",
            storeOp: "store"
        };
        this.renderPassDescriptor.colorAttachments.push(colorAttachment);
        return colorAttachment;
    }
    //-----------------
    setupDraw(o) {
        if (o.instanceCount !== undefined)
            this.drawConfig.instanceCount = o.instanceCount;
        if (o.vertexCount !== undefined)
            this.drawConfig.vertexCount = o.vertexCount;
        if (o.firstVertexId !== undefined)
            this.drawConfig.firstVertexId = o.firstVertexId;
        if (o.firstInstanceId !== undefined)
            this.drawConfig.firstInstanceId = o.firstInstanceId;
        if (o.indexBuffer !== undefined)
            this.drawConfig.indexBuffer = o.indexBuffer;
        if (o.baseVertex !== undefined)
            this.drawConfig.baseVertex = o.baseVertex;
    }
    get vertexCount() { return this.drawConfig.vertexCount; }
    set vertexCount(n) { this.drawConfig.vertexCount = n; }
    get instanceCount() { return this.drawConfig.instanceCount; }
    set instanceCount(n) { this.drawConfig.instanceCount = n; }
    get firstVertexId() { return this.drawConfig.firstVertexId; }
    set firstVertexId(n) { this.drawConfig.firstVertexId = n; }
    get firstInstanceId() { return this.drawConfig.firstInstanceId; }
    set firstInstanceId(n) { this.drawConfig.firstInstanceId = n; }
    get baseVertex() { return this.drawConfig.baseVertex; }
    set baseVertex(n) { this.drawConfig.baseVertex = n; }
    //------------------------------------------------
    setupMultiSampleView(descriptor) {
        if (this.multisampleTexture)
            this.multisampleTexture.destroy();
        if (!descriptor)
            descriptor = {};
        if (!descriptor.size)
            descriptor.size = [this.canvas.width, this.canvas.height];
        this.multisampleTexture = new MultiSampleTexture(descriptor);
        this.description.multisample = {
            count: this.multisampleTexture.description.count
        };
        if (this._depthStencilTexture) {
            this.renderPassDescriptor.description.sampleCount = 4;
            this._depthStencilTexture.create();
        }
    }
    //---------------------------
    setupDepthStencilView(descriptor, depthStencilDescription, depthStencilAttachmentOptions) {
        if (!depthStencilAttachmentOptions)
            depthStencilAttachmentOptions = {};
        if (!descriptor)
            descriptor = {};
        if (!descriptor.size)
            descriptor.size = [this.renderer.width, this.renderer.height];
        if (this.multisampleTexture)
            descriptor.sampleCount = 4;
        else
            descriptor.sampleCount = 1;
        if (this._depthStencilTexture)
            this._depthStencilTexture.destroy();
        this._depthStencilTexture = new DepthStencilTexture(descriptor, depthStencilDescription, depthStencilAttachmentOptions);
        this.renderPassDescriptor.depthStencilAttachment = this.depthStencilTexture.attachment;
        this.description.depthStencil = this.depthStencilTexture.description;
    }
    //----------------------------------------
    get renderPassView() { return this.renderPass.view; }
    get renderPass() {
        if (!this.renderPassTexture) {
            this.renderPassTexture = new RenderPassTexture({ size: [this.canvas.width, this.canvas.height] });
        }
        return this.renderPassTexture;
    }
    cleanInputs( /*initIO: boolean = false*/) {
        const _inputs = [];
        const t = this.vertexShader.inputs;
        for (let z in t)
            _inputs.push({ name: z, ...t[z] });
        this.vertexShader.inputs = _inputs;
        return _inputs;
    }
    blendMode;
    getFragmentShaderColorOptions() {
        const o = {
            format: XGPU.getPreferredCanvasFormat(),
        };
        if (this.blendMode)
            o.blend = this.blendMode;
        return o;
    }
    rebuildingAfterDeviceLost = false;
    onRebuildStartAfterDeviceLost;
    clearAfterDeviceLostAndRebuild() {
        if (this.onRebuildStartAfterDeviceLost)
            this.onRebuildStartAfterDeviceLost();
        this.gpuPipeline = null;
        if (this.drawConfig.indexBuffer)
            this.drawConfig.indexBuffer.createGpuResource();
        if (this.multisampleTexture)
            this.multisampleTexture.resize(this.canvas.width, this.canvas.height);
        if (this.depthStencilTexture)
            this.depthStencilTexture.resize(this.canvas.width, this.canvas.height);
        if (this.renderPassTexture)
            this.renderPassTexture.resize(this.canvas.width, this.canvas.height);
        this.rebuildingAfterDeviceLost = true;
        super.clearAfterDeviceLostAndRebuild();
    }
    buildGpuPipeline() {
        if (this.gpuPipeline)
            return this.gpuPipeline;
        this.bindGroups.handleRenderPipelineResourceIOs();
        this.initPipelineResources(this);
        const o = this.bindGroups.build();
        if (o.description.layout)
            this.description.layout = o.description.layout;
        else
            this.description.layout = "auto";
        if (!this.rebuildingAfterDeviceLost) {
            const buffers = o.buffers;
            this.description.vertex = o.description.vertex;
            //setup vertexShader inputs ------
            const vertexInput = new ShaderStruct("Input", this.cleanInputs());
            ;
            if (buffers.length) {
                let buffer;
                let arrays;
                let builtin = 0;
                for (let i = 0; i < buffers.length; i++) {
                    buffer = buffers[i];
                    arrays = buffer.vertexArrays;
                    for (let j = 0; j < arrays.length; j++) {
                        vertexInput.addProperty({ name: arrays[j].name, type: arrays[j].varType, builtin: "@location(" + builtin + ")" });
                        builtin++;
                    }
                }
            }
            //---------------------------------
            const vertexShader = this.vertexShader.build(this, vertexInput);
            let fragmentShader;
            if (this.fragmentShader) {
                fragmentShader = this.fragmentShader.build(this, vertexShader.output.getInputFromOutput());
            }
            this.description.vertex = {
                code: vertexShader.code,
                /*module: XGPU.device.createShaderModule({
                    code: vertexShader.code
                }),*/
                entryPoint: "main",
                buffers: o.description.vertex.buffers //this.createVertexBufferLayout()
            };
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
                };
            }
        }
        this.description.vertex.module = XGPU.device.createShaderModule({ code: this.description.vertex.code });
        if (this.description.fragment) {
            this.description.fragment.module = XGPU.device.createShaderModule({ code: this.description.fragment.code });
        }
        this.rebuildingAfterDeviceLost = false;
        this.gpuPipeline = XGPU.createRenderPipeline(this.description);
        return this.gpuPipeline;
    }
    //-------------------------------------------
    clearOpReady = false;
    rendererUseSinglePipeline = true;
    beginRenderPass(commandEncoder, outputView, drawCallId) {
        if (!this.resourceDefined)
            return null;
        if (this.onDrawBegin)
            this.onDrawBegin();
        let rendererUseSinglePipeline = this.renderer.useSinglePipeline && this.pipelineCount === 1;
        if (this.rendererUseSinglePipeline !== rendererUseSinglePipeline) {
            this.clearOpReady = false;
            this.rendererUseSinglePipeline = rendererUseSinglePipeline;
        }
        if (this.clearOpReady === false && this.renderPassDescriptor.colorAttachments[0] || this.pipelineCount > 1) {
            this.clearOpReady = true;
            if (rendererUseSinglePipeline && this.pipelineCount == 1)
                this.renderPassDescriptor.colorAttachments[0].loadOp = "clear";
            else {
                if (this.pipelineCount === 1) {
                    if (this.renderer.firstPipeline === this)
                        this.renderPassDescriptor.colorAttachments[0].loadOp = "clear";
                    else
                        this.renderPassDescriptor.colorAttachments[0].loadOp = "load";
                }
                else {
                    this.renderPassDescriptor.colorAttachments[0].loadOp = "clear";
                    if (drawCallId === 0) { }
                    else
                        this.renderPassDescriptor.colorAttachments[0].loadOp = "load";
                }
            }
        }
        if (!this.gpuPipeline)
            this.buildGpuPipeline();
        if (outputView && this.outputColor)
            this.handleOutputColor(outputView);
        //console.log("renderPassDescriptor = ", this.renderPassDescriptor);
        return commandEncoder.beginRenderPass(this.renderPassDescriptor);
    }
    handleOutputColor(outputView) {
        if (this.outputColor) {
            if (this.multisampleTexture) {
                if (!this.multisampleTexture.view)
                    this.multisampleTexture.create();
                this.outputColor.view = this.multisampleTexture.view;
                if (this.multisampleTexture.resolveTarget)
                    this.outputColor.resolveTarget = this.multisampleTexture.resolveTarget;
                else
                    this.outputColor.resolveTarget = outputView;
            }
            else {
                this.outputColor.view = outputView;
            }
        }
    }
    //----------------------------------------------------------------------
    update() {
        if (!this.gpuPipeline)
            return;
        if (this.renderPassTexture)
            this.renderPassTexture.update();
        this.bindGroups.update();
    }
    draw(renderPass) {
        if (!this.resourceDefined)
            return;
        renderPass.setPipeline(this.gpuPipeline);
        this.bindGroups.apply(renderPass);
    }
    //-------------------------------
    end(commandEncoder, renderPass) {
        if (!this.resourceDefined)
            return;
        renderPass.end();
        //------ the arrays of textures may contains GPUTexture so I must use commandEncoder.copyTextureToTexture 
        // to update the content from a GPUTexture to the texture_array_2d 
        const types = this.bindGroups.resources.types;
        if (!types.textureArrays) {
            let textureArrays = [];
            if (types.imageTextureArrays)
                textureArrays = textureArrays.concat(types.imageTextureArrays);
            if (types.cubeMapTextureArrays)
                textureArrays = textureArrays.concat(types.cubeMapTextureArrays);
            if (types.cubeMapTexture)
                textureArrays = textureArrays.concat(types.cubeMapTexture);
            types.textureArrays = textureArrays;
        }
        for (let i = 0; i < types.textureArrays.length; i++) {
            types.textureArrays[i].resource.updateInnerGpuTextures(commandEncoder);
        }
        //----------------------------------------------------------------------------------------
        if (this.renderPassTexture) {
            if (!this.renderPassTexture.gpuResource)
                this.renderPassTexture.createGpuResource();
            commandEncoder.copyTextureToTexture({ texture: this.renderer.texture }, { texture: this.renderPassTexture.gpuResource }, [this.canvas.width, this.canvas.height]);
        }
        if (this.canvas.dimensionChanged) {
            if (this.multisampleTexture) {
                this.multisampleTexture.resize(this.canvas.width, this.canvas.height);
            }
            if (this.depthStencilTexture) {
                this.depthStencilTexture.resize(this.canvas.width, this.canvas.height);
            }
            if (this.renderPassTexture) {
                this.renderPassTexture.resize(this.canvas.width, this.canvas.height);
            }
        }
        if (this.multisampleTexture)
            this.multisampleTexture.update();
        if (this.depthStencilTexture)
            this.depthStencilTexture.update();
        if (this.renderPassTexture)
            this.renderPassTexture.update();
        if (this.onDrawEnd)
            this.onDrawEnd();
    }
    get resourceDefined() {
        const bool = !!this.bindGroups.resources.all;
        if (!bool) {
            //some very basic shader can run without any resource
            if (this.drawConfig.vertexCount > 0) {
                if (this.vertexShader.main.text != "" && this.fragmentShader.main.text != "") {
                    return true;
                }
            }
            return false;
        }
        return true;
    }
    get pipeline() { return this.gpuPipeline; }
    get cullMode() { return this.description.primitive.cullMode; }
    set cullMode(s) { this.description.primitive.cullMode = s; }
    get topology() { return this.description.primitive.topology; }
    set topology(s) { this.description.primitive.topology = s; }
    get frontFace() { return this.description.primitive.frontFace; }
    set frontFace(s) { this.description.primitive.frontFace = s; }
    get stripIndexFormat() { return this.description.primitive.stripIndexFormat; }
    set stripIndexFormat(s) { this.description.primitive.stripIndexFormat = s; }
}
