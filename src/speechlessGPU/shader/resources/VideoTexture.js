import { SLGPU } from "../../SLGPU";
export class VideoTexture {
    mustBeTransfered = true;
    descriptor;
    gpuResource;
    constructor(descriptor) {
        if (undefined === descriptor.format)
            descriptor.format = "rgba8unorm";
        if (undefined === descriptor.usage)
            descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;
        if (undefined === descriptor.mipLevelCount)
            descriptor.mipLevelCount = 1;
        if (undefined === descriptor.sampleCount)
            descriptor.sampleCount = 1;
        if (undefined === descriptor.dimension)
            descriptor.dimension = "2d";
        if (undefined === descriptor.viewFormats)
            descriptor.viewFormats = [];
        if (descriptor.source) {
            this.gpuResource = descriptor.source;
            descriptor.size = [descriptor.source.width, descriptor.source.height];
        }
        this.descriptor = descriptor;
    }
    clone() {
        return new VideoTexture(this.descriptor);
    }
    set source(video) {
        this.gpuResource = video;
        this.descriptor.source = video;
    }
    /*
    public get texture(): GPUTexture { return this._texture; }
    protected _texture: GPUTexture;
    protected _view: GPUTextureView;
    protected textureBinding: boolean;
    protected viewDescriptor: GPUTextureViewDescriptor = undefined;
    public createView(viewDescriptor?: GPUTextureViewDescriptor): GPUTextureView {
        let desc: GPUTextureViewDescriptor = this.viewDescriptor;
        if (viewDescriptor) desc = viewDescriptor;
        return this._texture.createView(desc);
    }
    */
    createDeclaration(varName, bindingId, groupId = 0) {
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_external;\n";
    }
    createBindGroupLayoutEntry(bindingId) {
        return {
            binding: bindingId,
            visibility: GPUShaderStage.FRAGMENT,
            externalTexture: {},
        };
    }
    createGpuResource() {
        /*
        no code here :
        The HtmlVideoElement is used as gpyResource
        */
    }
    update() {
        /*
        np code here :
        the video update itself automaticly
        */
    }
    destroyGpuResource() {
        if (this.gpuResource) {
            this.gpuResource.src = undefined;
            this.gpuResource = null;
        }
    }
    createBindGroupEntry(bindingId) {
        if (!this.gpuResource)
            throw new Error("gpuResource cannot be null. You must provide a HTMLVideoElement");
        return {
            binding: bindingId,
            resource: SLGPU.device.importExternalTexture({
                source: this.gpuResource
            })
        };
    }
    setPipelineType(pipelineType) {
        if (pipelineType) { }
        //use to handle particular cases in descriptor relative to the nature of pipeline
    }
}
