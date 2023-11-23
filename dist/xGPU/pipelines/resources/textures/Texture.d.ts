/// <reference types="dist" />
import { EventDispatcher } from "../../../EventDispatcher";
export type TextureDescriptor = {
    size: GPUExtent3D;
    format: GPUTextureFormat;
    usage?: GPUTextureUsageFlags;
    sampleCount?: GPUSize32;
    label?: string;
};
export declare class Texture extends EventDispatcher {
    descriptor: TextureDescriptor;
    gpuResource: GPUTexture;
    protected _view: GPUTextureView;
    constructor(descriptor: {
        size: GPUExtent3D;
        format: GPUTextureFormat;
        usage?: GPUTextureUsageFlags;
        sampleCount?: GPUSize32;
        label?: string;
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
