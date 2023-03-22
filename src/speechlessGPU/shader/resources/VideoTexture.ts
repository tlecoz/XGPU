import { SLGPU } from "../../SLGPU";
import { IShaderResource } from "./IShaderResource";



export type VideoTextureDescriptor = {
    source?: HTMLVideoElement,
    format?: GPUTextureFormat,
    usage?: GPUTextureUsageFlags,
    size?: GPUExtent3D,
    mipLevelCount?: GPUIntegerCoordinate,
    sampleCount?: GPUSize32,
    dimension?: GPUTextureDimension,
    viewFormats?: GPUTextureFormat[],
    defaultViewDescriptor?: any
}


export class VideoTexture implements IShaderResource {

    public mustBeTransfered: boolean = true;
    public descriptor: VideoTextureDescriptor;
    public gpuResource: HTMLVideoElement

    constructor(descriptor: {
        source?: HTMLVideoElement,
        format?: GPUTextureFormat,
        usage?: GPUTextureUsageFlags,
        size?: GPUExtent3D,
        mipLevelCount?: GPUIntegerCoordinate,
        sampleCount?: GPUSize32,
        dimension?: GPUTextureDimension,
        viewFormats?: GPUTextureFormat[],
        defaultViewDescriptor?: any
    }) {

        if (undefined === descriptor.format) descriptor.format = "rgba8unorm";
        if (undefined === descriptor.usage) descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;
        if (undefined === descriptor.mipLevelCount) descriptor.mipLevelCount = 1;
        if (undefined === descriptor.sampleCount) descriptor.sampleCount = 1;
        if (undefined === descriptor.dimension) descriptor.dimension = "2d";
        if (undefined === descriptor.viewFormats) descriptor.viewFormats = [];

        if (descriptor.source) {
            this.gpuResource = descriptor.source;
            descriptor.size = [descriptor.source.width, descriptor.source.height];
        }

        this.descriptor = descriptor;

    }

    public clone(): VideoTexture {
        return new VideoTexture(this.descriptor);
    }


    public set source(video: HTMLVideoElement) {
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


    public createDeclaration(varName: string, bindingId: number, groupId: number = 0): string {
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_external;\n";
    }


    public createBindGroupLayoutEntry(bindingId: number): { binding: number, visibility: number, externalTexture: GPUExternalTextureBindingLayout } {
        return {
            binding: bindingId,
            visibility: GPUShaderStage.FRAGMENT,
            externalTexture: {},
        }
    }

    public createGpuResource() {
        /*
        no code here : 
        The HtmlVideoElement is used as gpyResource 
        */
    }
    public update(): void {
        /*
        np code here :
        the video update itself automaticly
        */
    }

    public destroyGpuResource() {
        if (this.gpuResource) {
            this.gpuResource.src = undefined;
            this.gpuResource = null;
        }
    }

    public createBindGroupEntry(bindingId: number): { binding: number, resource: GPUExternalTexture } {
        if (!this.gpuResource) throw new Error("gpuResource cannot be null. You must provide a HTMLVideoElement")
        return {
            binding: bindingId,
            resource: SLGPU.device.importExternalTexture({
                source: this.gpuResource
            })
        }
    }

    public setPipelineType(pipelineType: "compute" | "render" | "compute_mixed") {
        if (pipelineType) { }
        //use to handle particular cases in descriptor relative to the nature of pipeline
    }

}