// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { XGPU } from "../../../XGPU";
import { ImageTexture } from "../../../shader/resources/ImageTexture";
export class RenderPassTexture extends ImageTexture {
    constructor(descriptor) {
        if (!descriptor.format)
            descriptor.format = XGPU.getPreferredCanvasFormat();
        if (!descriptor.usage)
            descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC;
        if (!descriptor.mipLevelCount)
            descriptor.mipLevelCount = 1;
        if (!descriptor.sampleCount)
            descriptor.sampleCount = 1;
        if (!descriptor.dimension)
            descriptor.dimension = "2d";
        if (!descriptor.viewFormats)
            descriptor.viewFormats = [];
        super(descriptor);
        this.createGpuResource();
        //this.useOutsideTexture = true;
    }
    createBindGroupEntry(bindingId) {
        if (this.deviceId !== XGPU.deviceId) {
            this.deviceId = XGPU.deviceId;
            this.gpuResource = XGPU.device.createTexture(this.descriptor);
            this._view = this.gpuResource.createView();
        }
        return super.createBindGroupEntry(bindingId);
    }
    get width() { return this.descriptor.size[0]; }
    get height() { return this.descriptor.size[1]; }
    update() {
        //nothing here
        //console.log(this.deviceId === XGPU.deviceId, this.gpuResource)
    }
    get source() { return null; }
    set source(bmp) { if (bmp)
        return; }
}
