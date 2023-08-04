// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { XGPU } from "../../XGPU";
import { ImageTexture } from "./ImageTexture";
export class ImageTextureArray extends ImageTexture {
    _bitmaps = [];
    mustUpdate = [];
    constructor(descriptor) {
        descriptor = { ...descriptor };
        if (descriptor.source && !descriptor.size) {
            descriptor.size = [descriptor.source[0].width, descriptor.source[0].height, descriptor.source.length];
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
        return new ImageTextureArray(this.descriptor);
    }
    set bitmaps(images) {
        for (let i = 0; i < images.length; i++) {
            this._bitmaps[i] = images[i];
            this.mustUpdate[i] = true;
        }
        this.mustBeTransfered = true;
        this.update();
    }
    get bitmaps() { return this._bitmaps; }
    setImageById(image, id) {
        this._bitmaps[id] = image;
        this.mustUpdate[id] = true;
        this.mustBeTransfered = true;
    }
    createGpuResource() {
        if (this.gpuResource)
            this.gpuResource.destroy();
        //console.log("cubemap createtexture ", this.descriptor)
        this.gpuResource = XGPU.device.createTexture(this.descriptor);
        this._view = this.gpuResource.createView({ dimension: '2d-array', arrayLayerCount: this._bitmaps.length });
        for (let i = 0; i < this.mustUpdate.length; i++)
            this.mustUpdate[i] = true;
        this.mustBeTransfered = true;
    }
    updateInnerGpuTextures(commandEncoder) {
        let bmp;
        for (let i = 0; i < this._bitmaps.length; i++) {
            bmp = this.bitmaps[i];
            if (bmp instanceof GPUTexture) {
                commandEncoder.copyTextureToTexture({ texture: bmp }, { texture: this.gpuResource }, [this.gpuResource.width, this.gpuResource.height, i]);
            }
        }
    }
    update() {
        if (this.mustBeTransfered) {
            //console.log("update textureArray")
            if (!this.gpuResource)
                this.createGpuResource();
            let bmp;
            for (let i = 0; i < this._bitmaps.length; i++) {
                bmp = this.bitmaps[i];
                if (!(bmp instanceof GPUTexture) && this.mustUpdate[i]) {
                    XGPU.device.queue.copyExternalImageToTexture({ source: bmp }, { texture: this.gpuResource, origin: [0, 0, i] }, [bmp.width, bmp.height]);
                    this.mustUpdate[i] = false;
                }
            }
            this.mustBeTransfered = false;
        }
    }
    //-----
    createDeclaration(varName, bindingId, groupId = 0) {
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_2d_array<" + this.sampledType + ">;\n";
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
                viewDimension: "2d-array",
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
