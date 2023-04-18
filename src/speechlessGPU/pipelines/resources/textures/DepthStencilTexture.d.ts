/// <reference types="dist" />
import { IShaderResource } from "../../../shader/resources/IShaderResource";
import { Texture } from "./Texture";
export type DepthStencilTextureDescriptor = {
    size: GPUExtent3D;
    format?: "stencil8" | "depth16unorm" | "depth24plus" | "depth24plus-stencil8" | "depth32float";
};
export declare class DepthStencilTexture extends Texture implements IShaderResource {
    protected _isDepthTexture: boolean;
    private _description;
    get description(): {
        depthWriteEnabled: boolean;
        depthCompare: string;
        format: string;
    };
    private _attachment;
    get attachment(): any;
    constructor(descriptor: {
        size: GPUExtent3D;
        format?: "stencil8" | "depth16unorm" | "depth24plus" | "depth24plus-stencil8" | "depth32float";
        usage?: GPUTextureUsageFlags;
    }, depthStencilDescription?: {
        depthWriteEnabled: boolean;
        depthCompare: "never" | "less" | "equal" | "less-equal" | "greater" | "not-equal" | "greater-equal" | "always";
    }, depthStencilAttachmentOptions?: any);
    get isDepthTexture(): boolean;
    mustBeTransfered: boolean;
    protected _visibility: GPUShaderStageFlags;
    setPipelineType(pipelineType: "compute" | "render" | "compute_mixed"): void;
    createBindGroupEntry(bindingId: number): {
        binding: number;
        resource: GPUTextureView;
    };
    createBindGroupLayoutEntry(bindingId: number): {
        binding: number;
        visibility: number;
        texture: {
            sampleType: string;
        };
    };
    createDeclaration(varName: string, bindingId: number, groupId: number): string;
    createGpuResource(): void;
    destroyGpuResource(): void;
    update(): void;
    clone(): DepthStencilTexture;
}
