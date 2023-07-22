// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { XGPU } from "../../XGPU";
import { ImageTextureArray } from "./ImageTextureArray";
export class CubeMapTexture extends ImageTextureArray {
    constructor(descriptor) {
        descriptor = { ...descriptor };
        if (!descriptor.dimension)
            descriptor.dimension = "2d";
        if (undefined === descriptor.usage)
            descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;
        super(descriptor);
        if (descriptor.source)
            this.sides = descriptor.source;
    }
    clone() {
        if (!this.descriptor.source)
            this.descriptor.source = this._bitmaps;
        return new CubeMapTexture(this.descriptor);
    }
    set right(bmp) {
        this._bitmaps[0] = bmp;
        this.mustBeTransfered = true;
    }
    set left(bmp) {
        if (!this.descriptor.source)
            this.descriptor.source = {};
        this._bitmaps[1] = bmp;
        this.mustBeTransfered = true;
    }
    set bottom(bmp) {
        if (!this.descriptor.source)
            this.descriptor.source = {};
        this._bitmaps[2] = bmp;
        this.mustBeTransfered = true;
    }
    set top(bmp) {
        if (!this.descriptor.source)
            this.descriptor.source = {};
        this._bitmaps[3] = bmp;
        this.mustBeTransfered = true;
    }
    set back(bmp) {
        if (!this.descriptor.source)
            this.descriptor.source = {};
        this._bitmaps[4] = bmp;
        this.mustBeTransfered = true;
    }
    set front(bmp) {
        if (!this.descriptor.source)
            this.descriptor.source = {};
        this._bitmaps[5] = bmp;
        this.mustBeTransfered = true;
    }
    set sides(images) {
        for (let i = 0; i < 6; i++)
            this._bitmaps[i] = images[i];
        this.mustBeTransfered = true;
        this.update();
    }
    get sides() { return this._bitmaps; }
    createGpuResource() {
        if (this.gpuResource)
            this.gpuResource.destroy();
        this.gpuResource = XGPU.device.createTexture(this.descriptor);
        this._view = this.gpuResource.createView({ dimension: 'cube' });
        for (let i = 0; i < this.mustUpdate.length; i++)
            this.mustUpdate[i] = true;
        this.mustBeTransfered = true;
    }
    //-----
    createDeclaration(varName, bindingId, groupId = 0) {
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_cube<" + this.sampledType + ">;\n";
    }
    createBindGroupLayoutEntry(bindingId) {
        let sampleType = "float";
        if (this.sampledType === "i32")
            sampleType = "sint";
        else if (this.sampledType === "u32")
            sampleType = "uint";
        return {
            binding: bindingId,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
                sampleType,
                viewDimension: "cube",
                multisampled: false
            },
        };
    }
    createBindGroupEntry(bindingId) {
        if (!this.gpuResource)
            this.createGpuResource();
        return {
            binding: bindingId,
            resource: this._view,
        };
    }
    setPipelineType(pipelineType) {
        if (pipelineType) { }
        //use to handle particular cases in descriptor relative to the nature of pipeline
    }
}
