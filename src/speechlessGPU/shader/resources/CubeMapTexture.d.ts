/// <reference types="dist" />
import { ImageTexture } from "./ImageTexture";
import { IShaderResource } from "./IShaderResource";
export type CubeMapTextureDescriptor = {
    source?: {
        front: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas;
        back: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas;
        left: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas;
        right: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas;
        top: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas;
        bottom: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas;
    };
    size: GPUExtent3D;
    usage?: GPUTextureUsageFlags;
    dimension: string;
    defaultViewDescriptor?: GPUTextureViewDescriptor;
};
export declare class CubeMapTexture extends ImageTexture implements IShaderResource {
    descriptor: any;
    protected _sides: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[];
    constructor(descriptor: {
        source?: ImageBitmap[];
        size: GPUExtent3D;
        usage?: GPUTextureUsageFlags;
        defaultViewDescriptor?: GPUTextureViewDescriptor;
        dimension?: string;
    });
    clone(): CubeMapTexture;
    set right(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas);
    set left(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas);
    set bottom(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas);
    set top(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas);
    set back(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas);
    set front(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas);
    set sides(images: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[]);
    get sides(): (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[];
    createGpuResource(): void;
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
    setPipelineType(pipelineType: "compute" | "render" | "compute_mixed"): void;
}
