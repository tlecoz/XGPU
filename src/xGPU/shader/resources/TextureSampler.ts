// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "../../XGPU";
import { IShaderResource } from "./IShaderResource";

export type TextureSamplerDescriptor = {
    minFilter?: "nearest" | "linear",
    magFilter?: "nearest" | "linear",
    addressModeU?: "clamp-to-edge" | "repeat" | "mirror-repeat",
    addressModeV?: "clamp-to-edge" | "repeat" | "mirror-repeat",
    addressModeW?: "clamp-to-edge" | "repeat" | "mirror-repeat",
    mipmapFilter?: "nearest" | "linear",
    lodMinClamp?: number,
    lodMaxClamp?: number,
    maxAnisotropy?: number
    compare?: "never" | "less" | "equal" | "less-equal" | "greater" | "not-equal" | "greater-equal" | "always"
}


export class TextureSampler implements IShaderResource {

    public mustBeTransfered: boolean = false; // not applicable with sampler
    public gpuResource: GPUSampler;
    public descriptor: TextureSamplerDescriptor;


    constructor(descriptor?: {
        minFilter?: "nearest" | "linear",
        magFilter?: "nearest" | "linear",
        addressModeU?: "clamp-to-edge" | "repeat" | "mirror-repeat",
        addressModeV?: "clamp-to-edge" | "repeat" | "mirror-repeat",
        addressModeW?: "clamp-to-edge" | "repeat" | "mirror-repeat",
        mipmapFilter?: "nearest" | "linear",
        lodMinClamp?: number,
        lodMaxClamp?: number,
        maxAnisotropy?: number
        compare?: "never" | "less" | "equal" | "less-equal" | "greater" | "not-equal" | "greater-equal" | "always"
    }) {

        if (!descriptor) descriptor = {};

        if (!descriptor.compare) {

            descriptor = { ...descriptor };

            if (undefined === descriptor.minFilter) descriptor.minFilter = "linear";
            if (undefined === descriptor.magFilter) descriptor.magFilter = "linear";
            if (undefined === descriptor.addressModeU) descriptor.addressModeU = "clamp-to-edge";
            if (undefined === descriptor.addressModeV) descriptor.addressModeV = "clamp-to-edge";
            if (undefined === descriptor.addressModeW) descriptor.addressModeW = "clamp-to-edge";
            if (undefined === descriptor.mipmapFilter) descriptor.mipmapFilter = "nearest";
            if (undefined === descriptor.lodMinClamp) descriptor.lodMinClamp = 0;
            if (undefined === descriptor.lodMaxClamp) descriptor.lodMaxClamp = 32;
            if (undefined === descriptor.maxAnisotropy) descriptor.maxAnisotropy = 1;
        }



        if (descriptor) this.descriptor = descriptor;

    }

    public clone(): TextureSampler {
        return new TextureSampler(this.descriptor);
    }

    public get isComparison(): boolean { return !!this.descriptor.compare }
    public get isFiltering(): boolean {
        /*
        Note: Comparison samplers may use filtering, but the sampling results will be implementation-dependent and may differ from the normal filtering rules.
        //https://www.w3.org/TR/webgpu/#enumdef-gpucomparefunction
        */

        return this.descriptor.minFilter === "linear" || this.descriptor.magFilter === "linear" || this.descriptor.mipmapFilter === "linear";
    }


    public setAddressModes(u: GPUAddressMode = "clamp-to-edge", v: GPUAddressMode = "clamp-to-edge", w: GPUAddressMode = "clamp-to-edge") {

        this.descriptor.addressModeU = u;
        this.descriptor.addressModeV = v;
        this.descriptor.addressModeW = w;
    }

    public setFilterModes(min: GPUFilterMode = "nearest", mag: GPUFilterMode = "nearest", mipmap: GPUMipmapFilterMode = "nearest") {
        this.descriptor.minFilter = min;
        this.descriptor.magFilter = mag;
        this.descriptor.mipmapFilter = mipmap;
    }

    public setClamp(min: number = 0, max: number = 32) {
        this.descriptor.lodMinClamp = min;
        this.descriptor.lodMaxClamp = max;
    }

    public setCompareFunction(compareType?: "never" | "less" | "equal" | "less-equal" | "greater" | "not-equal" | "greater-equal" | "always") {
        this.descriptor.compare = compareType;
    }


    public setMaxAnisotropy(n: number) {
        n = Math.round(n);
        if (n < 1) n = 1;
        if (n > 16) n = 16;
        this.descriptor.maxAnisotropy = n;
    }

    //----------------------------



    public createGpuResource(): void {


        //console.log("create sampler : ", this.descriptor)
        this.gpuResource = XGPU.device.createSampler(this.descriptor);

    }
    public destroyGpuResource() {
        this.gpuResource = null;
        /*
        GPUSampler doesn't seem to have a destroy function
        */
    }
    public update() {
        /*
        GPUSampler doesn't require to be updated
        */
    }


    public createDeclaration(varName: string, bindingId: number, groupId: number = 0): string {
        if (this.isComparison) return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":sampler_comparison;\n";
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":sampler;\n";
    }


    public createBindGroupLayoutEntry(bindingId: number): { binding: number, visibility: number, sampler: { type: string } } {

        let type = "comparison";
        if (!this.isComparison) {
            type = "filtering";
            if (!this.isFiltering) {
                type = "non-filtering";
            }
        }

        return {
            binding: bindingId,
            visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
            sampler: {
                type: type
            },
        }
    }

    public createBindGroupEntry(bindingId: number): { binding: number, resource: GPUSampler } {
        if (!this.gpuResource) this.createGpuResource();
        return {
            binding: bindingId,
            resource: this.gpuResource
        }
    }

    public setPipelineType(pipelineType: "compute" | "render" | "compute_mixed") {
        if (pipelineType) { }
        //use to handle particular cases in descriptor relative to the nature of pipeline
    }
}