/// <reference types="dist" />
import { IShaderResource } from "./IShaderResource";
export type VideoTextureDescriptor = {
    source?: HTMLVideoElement;
    format?: GPUTextureFormat;
    usage?: GPUTextureUsageFlags;
    size?: GPUExtent3D;
    mipLevelCount?: GPUIntegerCoordinate;
    sampleCount?: GPUSize32;
    dimension?: GPUTextureDimension;
    viewFormats?: GPUTextureFormat[];
    defaultViewDescriptor?: any;
};
export declare class VideoTexture implements IShaderResource {
    mustBeTransfered: boolean;
    descriptor: VideoTextureDescriptor;
    gpuResource: HTMLVideoElement;
    constructor(descriptor: {
        source?: HTMLVideoElement;
        format?: GPUTextureFormat;
        usage?: GPUTextureUsageFlags;
        size?: GPUExtent3D;
        mipLevelCount?: GPUIntegerCoordinate;
        sampleCount?: GPUSize32;
        dimension?: GPUTextureDimension;
        viewFormats?: GPUTextureFormat[];
        defaultViewDescriptor?: any;
    });
    clone(): VideoTexture;
    set source(video: HTMLVideoElement);
    createDeclaration(varName: string, bindingId: number, groupId?: number): string;
    createBindGroupLayoutEntry(bindingId: number): {
        binding: number;
        visibility: number;
        externalTexture: GPUExternalTextureBindingLayout;
    };
    createGpuResource(): void;
    update(): void;
    destroyGpuResource(): void;
    createBindGroupEntry(bindingId: number): {
        binding: number;
        resource: GPUExternalTexture;
    };
    setPipelineType(pipelineType: "compute" | "render" | "compute_mixed"): void;
}
