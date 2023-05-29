import { ImageTextureArray } from "../../../shader/resources/ImageTextureArray";
import { DepthStencilTexture } from "./DepthStencilTexture";

export class DepthTextureArray extends ImageTextureArray {

    private _description: { depthWriteEnabled: boolean, depthCompare: string, format: string, sampleCount?: number };
    public get description(): { depthWriteEnabled: boolean, depthCompare: string, format: string, sampleCount?: number } { return this._description; }

    private _attachment: any;
    public get attachment(): any { return this._attachment };

    constructor(descriptor: {
        source: DepthStencilTexture[] | GPUTexture[],
        size: GPUExtent3D,
        format?: "stencil8" | "depth16unorm" | "depth24plus" | "depth24plus-stencil8" | "depth32float",
        usage?: GPUTextureUsageFlags,
        sampleCount?: number,
    }, depthStencilDescription: {
        depthWriteEnabled: boolean,
        depthCompare: "never" | "less" | "equal" | "less-equal" | "greater" | "not-equal" | "greater-equal" | "always",
    } = null) {

        if (undefined === descriptor.format) descriptor.format = "depth32float";
        if (undefined === descriptor.sampleCount) descriptor.sampleCount = 1;


        if (descriptor.source[0] instanceof DepthStencilTexture) {
            for (let i = 0; i < descriptor.source.length; i++) {
                descriptor.source[i] = (descriptor.source[i] as DepthStencilTexture).gpuResource as GPUTexture;
            }
        }

        if (undefined === descriptor.usage) {
            descriptor.usage = (descriptor.source[0] as GPUTexture).usage;
        }


        super(descriptor as any);

        //--------
        if (!depthStencilDescription) {
            depthStencilDescription = {
                depthWriteEnabled: true,
                depthCompare: "less",
                format: this.gpuResource.format

            } as any
        }
        this._description = { format: this.gpuResource.format, ...depthStencilDescription };

    }


    protected _visibility: GPUShaderStageFlags = GPUShaderStage.FRAGMENT;

    public setPipelineType(pipelineType: "compute" | "render" | "compute_mixed") {
        if (pipelineType === "render") this._visibility = GPUShaderStage.FRAGMENT;
        else if (pipelineType === "compute_mixed") this._visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE;
        else if (pipelineType === "compute") this._visibility = GPUShaderStage.COMPUTE;
    }


    public createBindGroupLayoutEntry(bindingId: number): { binding: number, visibility: number, texture: GPUTextureBindingLayout } {

        let sampleType: GPUTextureSampleType = "float";
        if (this.sampledType === "i32") sampleType = "sint";
        else if (this.sampledType === "u32") sampleType = "uint";

        return {
            binding: bindingId,
            visibility: this._visibility,
            texture: {
                sampleType,
                viewDimension: "2d-array",
                multisampled: false
            },
        }
    }

    public get isDepthTexture(): boolean { return true; }

    public createDeclaration(varName: string, bindingId: number, groupId: number): string {
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_depth_2d_array;\n";
    }


}