/// <reference types="dist" />
import { Texture } from "./Texture";
export type MultiSampleTextureDescriptor = {
    size: GPUExtent3D;
    format?: GPUTextureFormat;
    usage?: GPUTextureUsageFlags;
    sampleCount?: GPUSize32;
    alphaToCoverageEnabled?: boolean;
    mask?: number;
    resolveTarget?: GPUTextureView;
};
export declare class MultiSampleTexture extends Texture {
    private _description;
    get description(): {
        count: number;
        mask: number;
        alphaToCoverageEnabled: boolean;
    };
    constructor(descriptor: {
        size: GPUExtent3D;
        format?: GPUTextureFormat;
        usage?: GPUTextureUsageFlags;
        sampleCount?: GPUSize32;
        alphaToCoverageEnabled?: boolean;
        mask?: number;
        resolveTarget?: GPUTextureView;
    });
    create(): void;
    get resolveTarget(): any;
}
