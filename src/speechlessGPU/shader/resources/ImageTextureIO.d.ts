/// <reference types="dist" />
import { ImageTexture } from "./ImageTexture";
export declare class ImageTextureIO {
    textures: ImageTexture[];
    descriptor: {
        size: GPUExtent3D;
        format: GPUTextureFormat;
    };
    constructor(descriptor: {
        source: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture | null;
        width?: number;
        height?: number;
        format?: GPUTextureFormat;
    });
    clone(): ImageTextureIO;
    createDeclaration(name: string, bindingId: number, groupId: number): string;
    textureSize(): GPUExtent3D;
}
