/// <reference types="dist" />
import { ImageTexture } from "../../../shader/resources/ImageTexture";
export type RenderPassTextureDescriptor = {
    size: GPUExtent3D;
    format?: GPUTextureFormat;
    usage?: GPUTextureUsageFlags;
    mipLevelCount?: GPUIntegerCoordinate;
    sampleCount?: GPUSize32;
    dimension?: GPUTextureDimension;
    viewFormats?: GPUTextureFormat[];
};
export declare class RenderPassTexture extends ImageTexture {
    constructor(descriptor: {
        size: GPUExtent3D;
        format?: GPUTextureFormat;
        usage?: GPUTextureUsageFlags;
        mipLevelCount?: GPUIntegerCoordinate;
        sampleCount?: GPUSize32;
        dimension?: GPUTextureDimension;
        viewFormats?: GPUTextureFormat[];
    });
    createBindGroupEntry(bindingId: number): {
        binding: number;
        resource: GPUTextureView;
    };
    get width(): number;
    get height(): number;
    update(): void;
    get source(): ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture;
    set source(bmp: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture);
}
