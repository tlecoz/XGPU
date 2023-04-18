import { SLGPU } from "../SLGPU";
import { Bindgroup } from "../shader/Bindgroup";
import { FragmentShader } from "../shader/FragmentShader";
import { ShaderStruct } from "../shader/shaderParts/ShaderStruct";
import { VertexShader } from "../shader/VertexShader";
import { Pipeline } from "./Pipeline";
import { DepthStencilTexture } from "./resources/textures/DepthStencilTexture";
import { MultiSampleTexture } from "./resources/textures/MultiSampleTexture";
import { RenderPassTexture } from "./resources/textures/RenderPassTexture";
export class RenderPipeline extends Pipeline {
    renderer;
    canvas;
    _depthStencilTexture;
    multisampleTexture;
    renderPassTexture;
    /*
    protected shadow: Shadow = null;
    protected _light: Light = null;
    */
    outputColor;
    renderPassDescriptor = { colorAttachments: [] };
    indexBuffer = null;
    gpuPipeline;
    debug = "renderPipeline";
    onDrawBegin;
    onDrawEnd;
    constructor(renderer, bgColor = { r: 0, g: 0, b: 0, a: 1 }) {
        super();
        if (!renderer.canvas) {
            throw new Error("A RenderPipeline need a GPUProcess with a canvas in order to draw things inside. You must pass a reference to a canvas when you instanciate the GPUProcess.");
        }
        this.type = "render";
        this.renderer = renderer;
        this.canvas = renderer.canvas;
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
    get depthStencilTexture() { return this._depthStencilTexture; }
    initFromObject(descriptor) {
        this.vertexShader = null;
        this.fragmentShader = null;
        this.bindGroups.destroy();
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
            }
        }
        if (!descriptor.frontFace)
            this.description.primitive.frontFace = "ccw";
        else
            this.description.primitive.frontFace = descriptor.frontFace;
        if (descriptor.indexBuffer)
            this.indexBuffer = descriptor.indexBuffer;
        if (this.outputColor) {
            if (descriptor.clearColor)
                this.outputColor.clearValue = descriptor.clearColor;
            else
                descriptor.clearColor = this.outputColor.clearValue;
        }
        if (descriptor.blendMode)
            this.blendMode = descriptor.blendMode;
        if (descriptor.bindgroups) {
            let group;
            for (let z in descriptor.bindgroups) {
                group = new Bindgroup(z);
                group.initFromObject(descriptor.bindgroups[z]);
                this.bindGroups.add(group);
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
        this.vertexShader.inputs = createArrayOfObjects(descriptor.vertexShader.inputs);
        this.vertexShader.outputs = createArrayOfObjects(descriptor.vertexShader.outputs);
        if (descriptor.vertexShader.code)
            this.vertexShader.code.text = descriptor.vertexShader.code;
        this.vertexShader.main.text = descriptor.vertexShader.main;
        if (descriptor.fragmentShader) {
            this.fragmentShader = new FragmentShader();
            this.fragmentShader.inputs = createArrayOfObjects(descriptor.fragmentShader.inputs);
            ;
            this.fragmentShader.outputs = createArrayOfObjects(descriptor.fragmentShader.outputs);
            ;
            if (descriptor.fragmentShader.code)
                this.fragmentShader.code.text = descriptor.fragmentShader.code;
            this.fragmentShader.main.text = descriptor.fragmentShader.main;
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
    //----------- used if there is no indexBuffer ------
    drawConfig = {
        vertexCount: -1,
        instanceCount: 1,
        firstVertexId: 0,
        firstInstanceId: 0
    };
    setupDraw(o) {
        if (o.instanceCount !== undefined)
            this.drawConfig.instanceCount = o.instanceCount;
        if (o.vertexCount !== undefined)
            this.drawConfig.vertexCount = o.vertexCount;
        if (o.firstVertexId !== undefined)
            this.drawConfig.firstVertexId = o.firstVertexId;
        if (o.firstInstanceId !== undefined)
            this.drawConfig.firstInstanceId = o.firstInstanceId;
    }
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
    }
    //---------------------------
    setupDepthStencilView(descriptor, depthStencilDescription, depthStencilAttachmentOptions) {
        if (!descriptor)
            descriptor = {};
        if (!descriptor.size)
            descriptor.size = [this.renderer.width, this.renderer.height];
        if (this._depthStencilTexture)
            this._depthStencilTexture.destroy();
        this._depthStencilTexture = new DepthStencilTexture(descriptor, depthStencilDescription, depthStencilAttachmentOptions);
        this.renderPassDescriptor.depthStencilAttachment = this.depthStencilTexture.attachment;
        this.description.depthStencil = this.depthStencilTexture.description;
        //console.log("depthStencilAttachment ", this.depthStencilTexture.attachment)
        //console.log("this.description.depthStencil ", this.description.depthStencil)
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
            format: SLGPU.getPreferredCanvasFormat(),
        };
        if (this.blendMode)
            o.blend = this.blendMode;
        return o;
    }
    buildGpuPipeline() {
        if (this.gpuPipeline)
            return this.gpuPipeline;
        this.bindGroups.handleRenderPipelineResourceIOs();
        this.initPipelineResources(this);
        const o = this.bindGroups.build();
        const buffers = o.buffers;
        this.description.vertex = o.description.vertex;
        if (o.description.layout)
            this.description.layout = o.description.layout;
        else
            this.description.layout = "auto";
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
            module: SLGPU.device.createShaderModule({
                code: vertexShader.code
            }),
            entryPoint: "main",
            buffers: o.description.vertex.buffers //this.createVertexBufferLayout()
        };
        if (this.fragmentShader) {
            this.description.fragment = {
                module: SLGPU.device.createShaderModule({
                    code: fragmentShader.code
                }),
                entryPoint: "main",
                targets: [
                    this.getFragmentShaderColorOptions()
                ]
            };
        }
        //this.description.layout = this.gpuPipelineLayout;
        //console.log("buildGPUPipeline description = ", this.description)
        this.gpuPipeline = SLGPU.createRenderPipeline(this.description);
        //console.log("gpuPipeline = ", this.gpuPipeline)
        return this.gpuPipeline;
    }
    //-------------------------------------------
    clearOpReady = false;
    rendererUseSinglePipeline = true;
    beginRenderPass(commandEncoder, outputView) {
        if (!this.resourceDefined)
            return null;
        if (this.onDrawBegin)
            this.onDrawBegin();
        let rendererUseSinglePipeline = this.renderer.useSinglePipeline;
        if (this.rendererUseSinglePipeline !== rendererUseSinglePipeline) {
            this.clearOpReady = false;
            this.rendererUseSinglePipeline = rendererUseSinglePipeline;
        }
        if (this.clearOpReady === false && this.renderPassDescriptor.colorAttachments[0]) {
            this.clearOpReady = true;
            if (rendererUseSinglePipeline)
                this.renderPassDescriptor.colorAttachments[0].loadOp = "clear";
            else {
                if (this.renderer.firstPipeline === this)
                    this.renderPassDescriptor.colorAttachments[0].loadOp = "clear";
                else
                    this.renderPassDescriptor.colorAttachments[0].loadOp = "load";
            }
        }
        if (!this.gpuPipeline)
            this.buildGpuPipeline();
        if (this.drawConfig.vertexCount === 0) {
            if (this.vertexBuffers.length) {
                this.drawConfig.vertexCount = this.vertexBuffers[0].nbVertex;
            }
        }
        //console.log("drawConfig = ", this.drawConfig)
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
                //console.log("MSAA view = ", this.multisampleTexture.view)
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
        this.bindGroups.update();
    }
    draw(renderPass, gpuPipeline) {
        if (!this.resourceDefined)
            return;
        if (gpuPipeline) {
            //this.initPipelineResources(this);
            //this.build();
            this.bindGroups.update();
        }
        else {
            renderPass.setPipeline(this.gpuPipeline);
            //console.log("bindGroups.resources = ", this.bindGroups.resources)
            const resourceByType = this.bindGroups.resources.types;
            const buffers = resourceByType.vertexBuffers;
            if (this.drawConfig.vertexCount === -1) {
                if (!buffers) {
                    throw new Error("a renderPipeline require a vertexBuffer or a drawConfig object in order to draw. You must add a vertexBuffer or call RenderPipeline.setupDraw");
                }
                const vertexBuffer = buffers[0].resource;
                this.drawConfig.vertexCount = vertexBuffer.nbVertex;
            }
            if (buffers) {
                //console.log("DRAW BUFFERS ", buffers)
                let k = 0;
                for (let i = 0; i < buffers.length; i++) {
                    //if (i > 2) continue;
                    //console.log(" renderPass.setVertexBuffer(", k, ",", buffers[i].resource.getCurrentBuffer(), ", 0,", buffers[i].resource.getCurrentBuffer().size, ")")
                    renderPass.setVertexBuffer(k++, buffers[i].resource.getCurrentBuffer());
                }
            }
        }
        this.bindGroups.apply(renderPass);
        if (this.indexBuffer) {
            //console.log("a ", this.debug, this.drawConfig)
            if (!this.indexBuffer.gpuResource)
                this.indexBuffer.createGpuResource();
            renderPass.setIndexBuffer(this.indexBuffer.gpuResource, this.indexBuffer.dataType, this.indexBuffer.offset, this.indexBuffer.getBufferSize());
            renderPass.drawIndexed(this.indexBuffer.nbPoint);
        }
        else {
            if (this.drawConfig.vertexCount !== -1) {
                renderPass.draw(this.drawConfig.vertexCount, this.drawConfig.instanceCount, this.drawConfig.firstVertexId, this.drawConfig.firstInstanceId);
            }
        }
    }
    //-------------------------------
    end(commandEncoder, renderPass) {
        if (!this.resourceDefined)
            return;
        renderPass.end();
        if (this.renderPassTexture) {
            if (!this.renderPassTexture.gpuResource)
                this.renderPassTexture.createGpuResource();
            commandEncoder.copyTextureToTexture({ texture: this.renderer.texture }, { texture: this.renderPassTexture.gpuResource }, [this.canvas.width, this.canvas.height]);
        }
        if (this.onDrawEnd)
            this.onDrawEnd();
    }
    get resourceDefined() { return !!this.bindGroups.resources.all; }
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
