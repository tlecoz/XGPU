/// <reference types="dist" />
export type TextureDescriptor = {
    size: GPUExtent3D;
    format: GPUTextureFormat;
    usage?: GPUTextureUsageFlags;
    sampleCount?: GPUSize32;
};
export declare class Texture {
    descriptor: TextureDescriptor;
    gpuResource: GPUTexture;
    protected _view: GPUTextureView;
    constructor(descriptor: {
        size: GPUExtent3D;
        format: GPUTextureFormat;
        usage?: GPUTextureUsageFlags;
        sampleCount?: GPUSize32;
    });
    get sampleCount(): number;
    get format(): any;
    get size(): GPUExtent3D;
    get usage(): number;
    get view(): GPUTextureView;
    destroy(): void;
    protected deviceId: number;
    time: number;
    create(): void;
    createGpuResource(): void;
    update(): void;
    private createView;
    resize(width: number, height: number): void;
}
