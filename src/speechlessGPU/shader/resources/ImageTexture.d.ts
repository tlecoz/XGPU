/// <reference types="dist" />
import { IShaderResource } from "./IShaderResource";
export type ImageTextureDescriptor = {
    source?: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture;
    size?: GPUExtent3D;
    usage?: GPUTextureUsageFlags;
    format?: GPUTextureFormat;
    defaultViewDescriptor?: GPUTextureViewDescriptor;
};
export declare class ImageTexture implements IShaderResource {
    io: number;
    mustBeTransfered: boolean;
    descriptor: ImageTextureDescriptor;
    gpuResource: GPUTexture;
    protected _view: GPUTextureView;
    protected viewDescriptor: GPUTextureViewDescriptor;
    protected useOutsideTexture: boolean;
    constructor(descriptor: {
        source?: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture;
        size?: GPUExtent3D;
        usage?: GPUTextureUsageFlags;
        format?: GPUTextureFormat;
        defaultViewDescriptor?: GPUTextureViewDescriptor;
    });
    clone(): ImageTexture;
    protected gpuTextureIOs: GPUTexture[];
    protected gpuTextureIO_index: number;
    initTextureIO(textures: GPUTexture[]): void;
    get texture(): GPUTexture;
    getCurrentTexture(): GPUTexture;
    createView(viewDescriptor?: GPUTextureViewDescriptor): GPUTextureView;
    resize(w: number, h: number): ImageTexture;
    get view(): GPUTextureView;
    get source(): ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture;
    set source(bmp: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture);
    update(): void;
    createGpuResource(): void;
    destroyGpuResource(): void;
    createDeclaration(varName: string, bindingId: number, groupId?: number): string;
    createBindGroupLayoutEntry(bindingId: number): {
        binding: number;
        visibility: number;
        storageTexture?: GPUStorageTextureBindingLayout;
        texture?: GPUTextureBindingLayout;
    };
    createBindGroupEntry(bindingId: number): {
        binding: number;
        resource: GPUTextureView;
    };
    setPipelineType(pipelineType: "compute" | "render" | "compute_mixed"): void;
}
