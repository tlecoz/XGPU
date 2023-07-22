import { ImageTextureArray } from "../../../shader/resources/ImageTextureArray";
import { DepthStencilTexture } from "./DepthStencilTexture";
export class DepthTextureArray extends ImageTextureArray {
    _description;
    get description() { return this._description; }
    _attachment;
    get attachment() { return this._attachment; }
    ;
    constructor(descriptor, depthStencilDescription = null) {
        if (undefined === descriptor.format)
            descriptor.format = "depth32float";
        if (undefined === descriptor.sampleCount)
            descriptor.sampleCount = 1;
        if (descriptor.source[0] instanceof DepthStencilTexture) {
            for (let i = 0; i < descriptor.source.length; i++) {
                descriptor.source[i] = descriptor.source[i].gpuResource;
            }
        }
        if (undefined === descriptor.usage) {
            descriptor.usage = descriptor.source[0].usage;
        }
        super(descriptor);
        //--------
        if (!depthStencilDescription) {
            depthStencilDescription = {
                depthWriteEnabled: true,
                depthCompare: "less",
                format: this.gpuResource.format
            };
        }
        this._description = { format: this.gpuResource.format, ...depthStencilDescription };
    }
    _visibility = GPUShaderStage.FRAGMENT;
    setPipelineType(pipelineType) {
        if (pipelineType === "render")
            this._visibility = GPUShaderStage.FRAGMENT;
        else if (pipelineType === "compute_mixed")
            this._visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE;
        else if (pipelineType === "compute")
            this._visibility = GPUShaderStage.COMPUTE;
    }
    createBindGroupLayoutEntry(bindingId) {
        let sampleType = "float";
        if (this.sampledType === "i32")
            sampleType = "sint";
        else if (this.sampledType === "u32")
            sampleType = "uint";
        return {
            binding: bindingId,
            visibility: this._visibility,
            texture: {
                sampleType,
                viewDimension: "2d-array",
                multisampled: false
            },
        };
    }
    get isDepthTexture() { return true; }
    createDeclaration(varName, bindingId, groupId) {
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_depth_2d_array;\n";
    }
}
