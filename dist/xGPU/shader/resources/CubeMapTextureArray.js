// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { XGPU } from "../../XGPU";
import { ImageTextureArray } from "./ImageTextureArray";
export class CubeMapTextureArray extends ImageTextureArray {
    constructor(descriptor) {
        descriptor = { ...descriptor };
        if (descriptor.source) {
            if (descriptor.source.length === 0 || descriptor.source.length % 6 !== 0) {
                throw new Error("CubeMapTextureArray error : descriptor.source must contains an array of (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) with a length greater than 0 and multiple of 6.");
            }
        }
        if (!descriptor.dimension)
            descriptor.dimension = "2d";
        if (undefined === descriptor.usage)
            descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;
        super(descriptor);
        if (descriptor.source)
            this.bitmaps = descriptor.source;
    }
    clone() {
        if (!this.descriptor.source)
            this.descriptor.source = this._bitmaps;
        return new CubeMapTextureArray(this.descriptor);
    }
    set bitmaps(images) {
        if (images.length === 0 || images.length % 6 !== 0) {
            throw new Error("CubeMapTextureArray error : descriptor.source must contains an array of (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) with a length greater than 0 and multiple of 6.");
        }
        for (let i = 0; i < images.length; i++) {
            this._bitmaps[i] = images[i];
            this.mustUpdate[i] = true;
        }
        this.mustBeTransfered = true;
        this.update();
    }
    get bitmaps() { return this._bitmaps; }
    setCubeSideById(cubeid, sideId, image) {
        if (this._bitmaps[cubeid * 6 + sideId] instanceof ImageBitmap)
            this._bitmaps[cubeid * 6 + sideId].close();
        this._bitmaps[cubeid * 6 + sideId] = image;
        this.mustUpdate[cubeid * 6 + sideId] = true;
        this.mustBeTransfered = true;
    }
    createGpuResource() {
        if (this.gpuResource)
            this.gpuResource.destroy();
        //console.log("cubemap createtexture ", this.descriptor)
        this.gpuResource = XGPU.device.createTexture(this.descriptor);
        this._view = this.gpuResource.createView({ dimension: 'cube-array', arrayLayerCount: this._bitmaps.length });
    }
    //-----
    createDeclaration(varName, bindingId, groupId = 0) {
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_cube_array<" + this.sampledType + ">;\n";
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
                viewDimension: "cube-array",
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
