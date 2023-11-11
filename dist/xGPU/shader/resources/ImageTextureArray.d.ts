/// <reference types="dist" />
import { ImageTexture } from "./ImageTexture";
import { IShaderResource } from "./IShaderResource";
export type ImageTextureArrayDescriptor = {
    source?: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture)[];
    size: GPUExtent3D;
    usage?: GPUTextureUsageFlags;
    dimension: string;
    defaultViewDescriptor?: GPUTextureViewDescriptor;
    sampledType?: "f32" | "i32" | "u32";
};
export declare class ImageTextureArray extends ImageTexture implements IShaderResource {
    descriptor: any;
    protected _bitmaps: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture)[];
    protected mustUpdate: boolean[];
    constructor(descriptor: {
        source?: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[];
        size: GPUExtent3D;
        usage?: GPUTextureUsageFlags;
        defaultViewDescriptor?: GPUTextureViewDescriptor;
        dimension?: string;
        sampledType?: "f32" | "i32" | "u32";
    });
    clone(): ImageTextureArray;
    set bitmaps(images: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture)[]);
    get bitmaps(): (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture)[];
    setImageById(image: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture), id: number): void;
    createGpuResource(): void;
    updateInnerGpuTextures(commandEncoder: GPUCommandEncoder): void;
    update(): void;
    createDeclaration(varName: string, bindingId: number, groupId?: number): string;
    createBindGroupLayoutEntry(bindingId: number): {
        binding: number;
        visibility: number;
        texture: GPUTextureBindingLayout;
    };
    createBindGroupEntry(bindingId: number): {
        binding: number;
        resource: GPUTextureView;
    };
}
