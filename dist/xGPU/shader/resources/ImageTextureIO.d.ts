/// <reference types="dist" />
import { ImageTexture } from "./ImageTexture";
export declare class ImageTextureIO {
    textures: ImageTexture[];
    descriptor: {
        size: GPUExtent3D;
        format: GPUTextureFormat;
        usage?: number;
    };
    protected stagingBuffer: GPUBuffer;
    protected canCallMapAsync: boolean;
    onOutputData: (data: Uint32Array) => void;
    constructor(descriptor: {
        source: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture | null;
        width?: number;
        height?: number;
        format?: GPUTextureFormat;
    });
    clone(): ImageTextureIO;
    createDeclaration(name: string, bindingId: number, groupId: number): string;
    protected outputBuffer: GPUBuffer;
    destroy(): void;
    getOutputData(): Promise<void>;
    get width(): number;
    get height(): number;
    textureSize(): GPUExtent3D;
}
