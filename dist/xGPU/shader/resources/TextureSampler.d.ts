/// <reference types="dist" />
import { IShaderResource } from "./IShaderResource";
export type TextureSamplerDescriptor = {
    minFilter?: "nearest" | "linear";
    magFilter?: "nearest" | "linear";
    addressModeU?: "clamp-to-edge" | "repeat" | "mirror-repeat";
    addressModeV?: "clamp-to-edge" | "repeat" | "mirror-repeat";
    addressModeW?: "clamp-to-edge" | "repeat" | "mirror-repeat";
    mipmapFilter?: "nearest" | "linear";
    lodMinClamp?: number;
    lodMaxClamp?: number;
    maxAnisotropy?: number;
    compare?: "never" | "less" | "equal" | "less-equal" | "greater" | "not-equal" | "greater-equal" | "always";
};
export declare class TextureSampler implements IShaderResource {
    mustBeTransfered: boolean;
    gpuResource: GPUSampler;
    descriptor: TextureSamplerDescriptor;
    constructor(descriptor?: {
        minFilter?: "nearest" | "linear";
        magFilter?: "nearest" | "linear";
        addressModeU?: "clamp-to-edge" | "repeat" | "mirror-repeat";
        addressModeV?: "clamp-to-edge" | "repeat" | "mirror-repeat";
        addressModeW?: "clamp-to-edge" | "repeat" | "mirror-repeat";
        mipmapFilter?: "nearest" | "linear";
        lodMinClamp?: number;
        lodMaxClamp?: number;
        maxAnisotropy?: number;
        compare?: "never" | "less" | "equal" | "less-equal" | "greater" | "not-equal" | "greater-equal" | "always";
    });
    clone(): TextureSampler;
    get isComparison(): boolean;
    get isFiltering(): boolean;
    setAddressModes(u?: GPUAddressMode, v?: GPUAddressMode, w?: GPUAddressMode): void;
    setFilterModes(min?: GPUFilterMode, mag?: GPUFilterMode, mipmap?: GPUMipmapFilterMode): void;
    setClamp(min?: number, max?: number): void;
    setCompareFunction(compareType?: "never" | "less" | "equal" | "less-equal" | "greater" | "not-equal" | "greater-equal" | "always"): void;
    setMaxAnisotropy(n: number): void;
    protected deviceId: number;
    createGpuResource(): void;
    destroyGpuResource(): void;
    update(): void;
    createDeclaration(varName: string, bindingId: number, groupId?: number): string;
    createBindGroupLayoutEntry(bindingId: number): {
        binding: number;
        visibility: number;
        sampler: {
            type: string;
        };
    };
    createBindGroupEntry(bindingId: number): {
        binding: number;
        resource: GPUSampler;
    };
    setPipelineType(pipelineType: "compute" | "render" | "compute_mixed"): void;
}
