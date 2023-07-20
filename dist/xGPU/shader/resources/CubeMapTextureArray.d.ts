/// <reference types="dist" />
import { ImageTextureArray } from "./ImageTextureArray";
import { IShaderResource } from "./IShaderResource";
export type ImageTextureArrayDescriptor = {
    source?: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[];
    size: GPUExtent3D;
    usage?: GPUTextureUsageFlags;
    dimension: string;
    defaultViewDescriptor?: GPUTextureViewDescriptor;
    sampledType?: "f32" | "i32" | "u32";
};
export declare class CubeMapTextureArray extends ImageTextureArray implements IShaderResource {
    descriptor: any;
    constructor(descriptor: ImageTextureArrayDescriptor);
    clone(): CubeMapTextureArray;
    set bitmaps(images: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture)[]);
    get bitmaps(): (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture)[];
    setCubeSideById(cubeid: number, sideId: number, image: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture)): void;
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
