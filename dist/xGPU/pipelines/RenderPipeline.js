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
import { VertexShaderDebuggerPipeline } from "./VertexShaderDebuggerPipeline";
export class RenderPipeline extends Pipeline {
    static ON_ADDED_TO_RENDERER = "ON_ADDED_TO_RENDERER";
    static ON_REMOVED_FROM_RENDERER = "ON_REMOVED_FROM_RENDERER";
    static ON_DRAW_BEGIN = "ON_DRAW_BEGIN";
    static ON_DRAW_END = "ON_DRAW_END";
    static ON_DRAW = "ON_DRAW";
    static ON_GPU_PIPELINE_BUILT = "ON_GPU_PIPELINE_BUILT";
    static ON_LOG = "ON_LOG";
    static ON_VERTEX_SHADER_CODE_BUILT = "ON_VERTEX_SHADER_CODE_BUILT";
    static ON_FRAGMENT_SHADER_CODE_BUILT = "ON_FRAGMENT_SHADER_CODE_BUILT";
    static ON_INIT_FROM_OBJECT = "ON_INIT_FROM_OBJECT";
    static ON_DEVICE_LOST = "ON_DEVICE_LOST";
    static ON_UPDATE_RESOURCES = "ON_UPDATE_RESOURCES";
    _renderer;
    get renderer() { return this._renderer; }
    set renderer(renderer) {
        if (this._renderer != renderer) {
            this._renderer = renderer;
            if (renderer) {
                if (this.waitingMultisampleTexture) {
                    this.setupMultiSampleView(this.multiSampleTextureDescriptor);
                    this.waitingMultisampleTexture = false;
                }
                if (this.waitingDepthStencilTexture) {
                    this.setupDepthStencilView(this.depthStencilTextureDescriptor);
                    this.waitingDepthStencilTexture = false;
                }
                //console.log("dispatch")
                this.dispatchEvent(RenderPipeline.ON_ADDED_TO_RENDERER);
            }
            else {
                this.dispatchEvent(RenderPipeline.ON_REMOVED_FROM_RENDERER);
            }
        }
    }
    drawConfig;
    multiSampleTextureDescriptor;
    waitingMultisampleTexture = false;
    multisampleTexture;
    waitingDepthStencilTexture = false;
    depthStencilTextureDescriptor;
    _depthStencilTexture;
    renderPassTexture;
    outputColor;
    renderPassDescriptor = { colorAttachments: [] };
    vertexShaderDebuggerPipeline = null;
    gpuPipeline;
    debug = "renderPipeline";
    constructor(bgColor = { r: 0, g: 0, b: 0, a: 1 }) {
        super();
        this.type = "render";
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
    /*
    public get canvas(): any {
        if (!this.renderer) return null;
        return this.renderer.canvas;
    }
    */
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
        this.gpuPipeline = null;
        this.bindGroups.destroy();
        this.bindGroups = new Bindgroups(this, "pipeline");
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
        if (typeof descriptor.vertexShader === "string") {
            this.vertexShader.main.text = descriptor.vertexShader;
        }
        else {
            if (descriptor.vertexShader instanceof VertexShader) {
                this.vertexShader = descriptor.vertexShader;
            }
            else {
                if (descriptor.vertexShader.constants)
                    this.vertexShader.constants.text = descriptor.vertexShader.constants;
                this.vertexShader.main.text = descriptor.vertexShader.main;
            }
            this.vertexShader.inputs = createArrayOfObjects(descriptor.vertexShader.inputs);
            this.vertexShader.outputs = createArrayOfObjects(descriptor.vertexShader.outputs);
        }
        if (descriptor.fragmentShader) {
            this.fragmentShader = new FragmentShader();
            if (typeof descriptor.fragmentShader === "string") {
                this.fragmentShader.main.text = descriptor.fragmentShader;
            }
            else {
                if (descriptor.fragmentShader instanceof FragmentShader) {
                    this.fragmentShader = descriptor.fragmentShader;
                }
                else {
                    if (descriptor.fragmentShader.constants)
                        this.fragmentShader.constants.text = descriptor.fragmentShader.constants;
                    this.fragmentShader.main.text = descriptor.fragmentShader.main;
                }
                this.fragmentShader.inputs = createArrayOfObjects(descriptor.fragmentShader.inputs);
                ;
                this.fragmentShader.outputs = createArrayOfObjects(descriptor.fragmentShader.outputs);
                ;
            }
        }
        this.dispatchEvent(RenderPipeline.ON_INIT_FROM_OBJECT, descriptor);
        return descriptor;
    }
    _clearValue = null;
    get clearValue() {
        return this._clearValue;
        //if (!this.renderPassDescriptor.colorAttachment) return null;
        //return this.renderPassDescriptor.colorAttachment.clearValue;
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
    get debugVertexCount() { return this.resources.debugVertexCount; }
    set debugVertexCount(n) { this.resources.debugVertexCount = n; }
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
        if (!this.renderer) {
            this.waitingMultisampleTexture = true;
            this.multiSampleTextureDescriptor = descriptor;
            return;
        }
        if (this.multisampleTexture)
            this.multisampleTexture.destroy();
        if (!descriptor)
            descriptor = {};
        if (!descriptor.size)
            descriptor.size = [this.renderer.width, this.renderer.height];
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
        if (!this.renderer) {
            this.waitingDepthStencilTexture = true;
            this.depthStencilTextureDescriptor = descriptor;
            return;
        }
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
            this.renderPassTexture = new RenderPassTexture(this);
        }
        return this.renderPassTexture;
    }
    get useRenderPassTexture() {
        return !!this.renderPassTexture;
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
        this.dispatchEvent(RenderPipeline.ON_DEVICE_LOST);
        if (this.onRebuildStartAfterDeviceLost)
            this.onRebuildStartAfterDeviceLost();
        this.gpuPipeline = null;
        if (this.drawConfig.indexBuffer)
            this.drawConfig.indexBuffer.createGpuResource();
        if (this.multisampleTexture)
            this.multisampleTexture.resize(this.renderer.width, this.renderer.height);
        if (this.depthStencilTexture)
            this.depthStencilTexture.resize(this.renderer.width, this.renderer.height);
        if (this.renderPassTexture)
            this.renderPassTexture.resize(this.renderer.width, this.renderer.height);
        this.rebuildingAfterDeviceLost = true;
        super.clearAfterDeviceLostAndRebuild();
    }
    buildingPipeline = false;
    buildGpuPipeline() {
        if (this.gpuPipeline || this.buildingPipeline)
            return this.gpuPipeline;
        this.buildingPipeline = true;
        //console.warn("BUILD GPUPIPELINE")
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
            this.dispatchEvent(RenderPipeline.ON_VERTEX_SHADER_CODE_BUILT, vertexShader);
            let fragmentShader;
            if (this.fragmentShader) {
                fragmentShader = this.fragmentShader.build(this, vertexShader.output.getInputFromOutput());
                this.dispatchEvent(RenderPipeline.ON_FRAGMENT_SHADER_CODE_BUILT, fragmentShader);
            }
            this.description.vertex = {
                code: vertexShader.code,
                entryPoint: "main",
                buffers: o.description.vertex.buffers
            };
            if (this.fragmentShader) {
                this.description.fragment = {
                    code: fragmentShader.code,
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
        let resources = this.bindGroups.resources.types;
        for (let type in resources) {
            resources[type].forEach((o) => {
                if (o.resource.gpuResource) {
                    o.resource.gpuResource.label = o.name;
                }
            });
        }
        if (this.resources.__DEBUG__) {
            this.vertexShaderDebuggerPipeline = new VertexShaderDebuggerPipeline();
            this.vertexShaderDebuggerPipeline.init(this, this.debugVertexCount);
            this.vertexShaderDebuggerPipeline.onLog = (o) => {
                console.log(o);
                this.dispatchEvent(RenderPipeline.ON_LOG, o);
                //this._onLog(o);
            };
        }
        this.buildingPipeline = false;
        this.dispatchEvent(RenderPipeline.ON_GPU_PIPELINE_BUILT);
        return this.gpuPipeline;
    }
    //-------------------------------------------
    clearOpReady = false;
    rendererUseSinglePipeline = true;
    beginRenderPass(commandEncoder, outputView, drawCallId, usingRenderPassTexture = false) {
        if (!this.resourceDefined)
            return null;
        if (this.vertexShaderDebuggerPipeline)
            this.vertexShaderDebuggerPipeline.nextFrame();
        this.dispatchEvent(RenderPipeline.ON_DRAW_BEGIN);
        if (usingRenderPassTexture) {
            //console.log("usingRenderPassTexture")
            this.renderPassDescriptor.colorAttachments[0].loadOp = "clear";
        }
        else {
            if (this.renderPassDescriptor.colorAttachments[0]) {
                this._clearValue = this.renderPassDescriptor.colorAttachments[0].clearValue;
            }
            //console.log("not usingRenderPassTexture")
            let rendererUseSinglePipeline = this.renderer.renderPipelines.length == 1 && this.pipelineCount === 1;
            if (this.rendererUseSinglePipeline !== rendererUseSinglePipeline) {
                this.clearOpReady = false;
                this.rendererUseSinglePipeline = rendererUseSinglePipeline;
            }
            if (this.clearOpReady === false && this.renderPassDescriptor.colorAttachments[0] || this.pipelineCount > 1) {
                this.clearOpReady = true;
                /*if (this.useRenderPassTexture && this.renderPassDescriptor.colorAttachments[0]) {
                    this.renderPassDescriptor.colorAttachments[0].loadOp = "clear"
                } else {*/
                if (rendererUseSinglePipeline && this.pipelineCount == 1)
                    this.renderPassDescriptor.colorAttachments[0].loadOp = "clear";
                else {
                    if (this.pipelineCount === 1) {
                        if (this.renderer.renderPipelines[0] === this)
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
                //}
            }
        }
        if (!this.gpuPipeline)
            this.buildGpuPipeline();
        if (outputView && this.outputColor)
            this.handleOutputColor(outputView);
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
        //console.log("renderPipeline.update start gpuPipeline = ", this.gpuPipeline)
        if (!this.gpuPipeline)
            return;
        if (this.renderPassTexture)
            this.renderPassTexture.update();
        this.bindGroups.update();
        this.dispatchEvent(RenderPipeline.ON_UPDATE_RESOURCES);
        //console.log("renderPipeline.update end")
    }
    draw(renderPass) {
        if (!this.resourceDefined)
            return;
        //console.log("draw")
        renderPass.setPipeline(this.gpuPipeline);
        this.bindGroups.apply(renderPass);
    }
    //-------------------------------
    end(commandEncoder, renderPass) {
        if (!this.resourceDefined)
            return;
        renderPass.end();
        //console.log("end")
        //------ the arrays of textures may contains GPUTexture so I must use commandEncoder.copyTextureToTexture 
        // to update the content from a GPUTexture to the texture_array_2d 
        const types = this.bindGroups.resources.types;
        if (types) {
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
        }
        //----------------------------------------------------------------------------------------
        const { width, height } = this.renderer;
        if (this.renderer.resized) {
            if (this.multisampleTexture) {
                this.multisampleTexture.resize(width, height);
            }
            if (this.depthStencilTexture) {
                this.depthStencilTexture.resize(width, height);
            }
            if (this.renderPassTexture) {
                this.renderPassTexture.resize(width, height);
            }
        }
        if (this.renderPassTexture && this.renderPassTexture.mustUseCopyTextureToTexture) {
            if (!this.renderPassTexture.gpuResource)
                this.renderPassTexture.createGpuResource();
            commandEncoder.copyTextureToTexture({ texture: this.renderer.texture }, { texture: this.renderPassTexture.gpuResource }, [width, height]);
        }
        if (this.multisampleTexture)
            this.multisampleTexture.update();
        if (this.depthStencilTexture)
            this.depthStencilTexture.update();
        if (this.renderPassTexture)
            this.renderPassTexture.update();
        this.dispatchEvent(RenderPipeline.ON_DRAW_END);
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
