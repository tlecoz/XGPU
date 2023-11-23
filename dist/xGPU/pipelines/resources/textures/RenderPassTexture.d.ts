/// <reference types="dist" />
import { ImageTexture } from "../../../shader/resources/ImageTexture";
import { Pipeline } from "../../Pipeline";
import { RenderPipeline } from "../../RenderPipeline";
export type RenderPassTextureDescriptor = {
    size: GPUExtent3D;
    format?: GPUTextureFormat;
    usage?: GPUTextureUsageFlags;
    mipLevelCount?: GPUIntegerCoordinate;
    sampleCount?: GPUSize32;
    dimension?: GPUTextureDimension;
    viewFormats?: GPUTextureFormat[];
    label?: string;
};
export declare class RenderPassTexture extends ImageTexture {
    static RESOURCE_CHANGED: string;
    private ready;
    constructor(pipeline: RenderPipeline, descriptor?: {
        size: GPUExtent3D;
        format?: GPUTextureFormat;
        usage?: GPUTextureUsageFlags;
        mipLevelCount?: GPUIntegerCoordinate;
        sampleCount?: GPUSize32;
        dimension?: GPUTextureDimension;
        viewFormats?: GPUTextureFormat[];
        label?: string;
    });
    renderPipeline: RenderPipeline;
    protected _mustUseCopyTextureToTexture: boolean;
    get mustUseCopyTextureToTexture(): boolean;
    protected frameId: number;
    applyRenderPass(pipeline: Pipeline): void;
    resize(w: number, h: number): ImageTexture;
    createBindGroupEntry(bindingId: number): {
        binding: number;
        resource: GPUTextureView;
    };
    get width(): number;
    get height(): number;
    get isRenderPass(): boolean;
    update(): void;
    get source(): ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture;
    set source(bmp: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture);
}
