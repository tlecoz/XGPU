import { SLGPU } from "../../SLGPU";
export class TextureSampler {
    mustBeTransfered = false; // not applicable with sampler
    gpuResource;
    descriptor;
    constructor(descriptor) {
        if (!descriptor)
            descriptor = {};
        if (!descriptor.compare) {
            descriptor = { ...descriptor };
            if (undefined === descriptor.minFilter)
                descriptor.minFilter = "linear";
            if (undefined === descriptor.magFilter)
                descriptor.magFilter = "linear";
            if (undefined === descriptor.addressModeU)
                descriptor.addressModeU = "clamp-to-edge";
            if (undefined === descriptor.addressModeV)
                descriptor.addressModeV = "clamp-to-edge";
            if (undefined === descriptor.addressModeW)
                descriptor.addressModeW = "clamp-to-edge";
            if (undefined === descriptor.mipmapFilter)
                descriptor.mipmapFilter = "nearest";
            if (undefined === descriptor.lodMinClamp)
                descriptor.lodMinClamp = 0;
            if (undefined === descriptor.lodMaxClamp)
                descriptor.lodMaxClamp = 32;
            if (undefined === descriptor.maxAnisotropy)
                descriptor.maxAnisotropy = 1;
        }
        if (descriptor)
            this.descriptor = descriptor;
    }
    clone() {
        return new TextureSampler(this.descriptor);
    }
    get isComparison() { return !!this.descriptor.compare; }
    get isFiltering() {
        /*
        Note: Comparison samplers may use filtering, but the sampling results will be implementation-dependent and may differ from the normal filtering rules.
        //https://www.w3.org/TR/webgpu/#enumdef-gpucomparefunction
        */
        return this.descriptor.minFilter === "linear" || this.descriptor.magFilter === "linear" || this.descriptor.mipmapFilter === "linear";
    }
    setAddressModes(u = "clamp-to-edge", v = "clamp-to-edge", w = "clamp-to-edge") {
        this.descriptor.addressModeU = u;
        this.descriptor.addressModeV = v;
        this.descriptor.addressModeW = w;
    }
    setFilterModes(min = "nearest", mag = "nearest", mipmap = "nearest") {
        this.descriptor.minFilter = min;
        this.descriptor.magFilter = mag;
        this.descriptor.mipmapFilter = mipmap;
    }
    setClamp(min = 0, max = 32) {
        this.descriptor.lodMinClamp = min;
        this.descriptor.lodMaxClamp = max;
    }
    setCompareFunction(compareType) {
        this.descriptor.compare = compareType;
    }
    setMaxAnisotropy(n) {
        n = Math.round(n);
        if (n < 1)
            n = 1;
        if (n > 16)
            n = 16;
        this.descriptor.maxAnisotropy = n;
    }
    //----------------------------
    createGpuResource() {
        if (!this.gpuResource) {
            //console.log("create sampler : ", this.descriptor)
            this.gpuResource = SLGPU.device.createSampler(this.descriptor);
        }
    }
    destroyGpuResource() {
        /*
        GPUSampler doesn't seem to have a destroy function
        */
    }
    update() {
        /*
        GPUSampler doesn't require to be updated
        */
    }
    createDeclaration(varName, bindingId, groupId = 0) {
        if (this.isComparison)
            return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":sampler_comparison;\n";
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":sampler;\n";
    }
    createBindGroupLayoutEntry(bindingId) {
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
        };
    }
    createBindGroupEntry(bindingId) {
        if (!this.gpuResource)
            this.createGpuResource();
        return {
            binding: bindingId,
            resource: this.gpuResource
        };
    }
    setPipelineType(pipelineType) {
        if (pipelineType) { }
        //use to handle particular cases in descriptor relative to the nature of pipeline
    }
}
