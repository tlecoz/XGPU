/// <reference types="dist" />
import { ImageTextureArray } from "../../../shader/resources/ImageTextureArray";
import { DepthStencilTexture } from "./DepthStencilTexture";
export declare class DepthTextureArray extends ImageTextureArray {
    private _description;
    get description(): {
        depthWriteEnabled: boolean;
        depthCompare: string;
        format: string;
        sampleCount?: number;
    };
    private _attachment;
    get attachment(): any;
    constructor(descriptor: {
        source: DepthStencilTexture[] | GPUTexture[];
        size: GPUExtent3D;
        format?: "stencil8" | "depth16unorm" | "depth24plus" | "depth24plus-stencil8" | "depth32float";
        usage?: GPUTextureUsageFlags;
        sampleCount?: number;
    }, depthStencilDescription?: {
        depthWriteEnabled: boolean;
        depthCompare: "never" | "less" | "equal" | "less-equal" | "greater" | "not-equal" | "greater-equal" | "always";
    });
    protected _visibility: GPUShaderStageFlags;
    setPipelineType(pipelineType: "compute" | "render" | "compute_mixed"): void;
    createBindGroupLayoutEntry(bindingId: number): {
        binding: number;
        visibility: number;
        texture: GPUTextureBindingLayout;
    };
    get isDepthTexture(): boolean;
    createDeclaration(varName: string, bindingId: number, groupId: number): string;
}
