/// <reference types="dist" />
import { ImageTextureArray } from "./ImageTextureArray";
import { IShaderResource } from "./IShaderResource";
export type CubeMapTextureDescriptor = {
    source?: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[];
    size: GPUExtent3D;
    usage?: GPUTextureUsageFlags;
    dimension: string;
    defaultViewDescriptor?: GPUTextureViewDescriptor;
    sampledType?: "f32" | "i32" | "u32";
};
export declare class CubeMapTexture extends ImageTextureArray implements IShaderResource {
    descriptor: any;
    constructor(descriptor: {
        source?: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture)[];
        size: GPUExtent3D;
        usage?: GPUTextureUsageFlags;
        defaultViewDescriptor?: GPUTextureViewDescriptor;
        dimension?: string;
        sampledType?: "f32" | "i32" | "u32";
    });
    clone(): CubeMapTexture;
    set right(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture);
    set left(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture);
    set bottom(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture);
    set top(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture);
    set back(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture);
    set front(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture);
    set sides(images: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture)[]);
    get sides(): (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture)[];
    createGpuResource(): void;
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
    setPipelineType(pipelineType: "compute" | "render" | "compute_mixed"): void;
}
