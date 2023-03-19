import { SLGPU } from "../../../SLGPU";

export type TextureDescriptor = {
    size: GPUExtent3D,
    format: GPUTextureFormat,
    usage?: GPUTextureUsageFlags,
    sampleCount?: GPUSize32,
}

export class Texture {

    public descriptor: TextureDescriptor;
    public gpuResource: GPUTexture = null;
    protected _view: GPUTextureView = null;

    constructor(descriptor: {
        size: GPUExtent3D,
        format: GPUTextureFormat,
        usage?: GPUTextureUsageFlags,
        sampleCount?: GPUSize32,
    }) {
        if (!descriptor.usage) descriptor.usage = GPUTextureUsage.RENDER_ATTACHMENT;
        if (!descriptor.sampleCount) descriptor.sampleCount = 1;
        this.descriptor = descriptor;

    }
    public get sampleCount(): number { return this.descriptor.sampleCount }
    public get format(): any { return this.descriptor.format }
    public get size(): GPUExtent3D { return this.descriptor.size }
    public get usage(): number { return this.descriptor.usage }
    public get view(): GPUTextureView { return this._view; }

    public destroy(): void {
        if (this.gpuResource) this.gpuResource.destroy();
        this.gpuResource = null;
    }
    public create(): void {
        if (this.gpuResource) this.gpuResource.destroy();
        this.gpuResource = SLGPU.device.createTexture(this.descriptor as GPUTextureDescriptor);
        this.createView();
    }

    private createView(): void {
        this._view = this.gpuResource.createView();
        (this._view as any).texture = this;
    }

    public resize(width: number, height: number): void {
        this.descriptor.size = [width, height];
        this.create();
    }


}