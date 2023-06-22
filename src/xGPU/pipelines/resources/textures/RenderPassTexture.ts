// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "../../../XGPU";
import { ImageTexture } from "../../../shader/resources/ImageTexture";

export type RenderPassTextureDescriptor = {
    size: GPUExtent3D,
    format?: GPUTextureFormat,
    usage?: GPUTextureUsageFlags,
    mipLevelCount?: GPUIntegerCoordinate,
    sampleCount?: GPUSize32,
    dimension?: GPUTextureDimension,
    viewFormats?: GPUTextureFormat[];
}

export class RenderPassTexture extends ImageTexture {

    constructor(descriptor: {
        size: GPUExtent3D,
        format?: GPUTextureFormat,
        usage?: GPUTextureUsageFlags,
        mipLevelCount?: GPUIntegerCoordinate,
        sampleCount?: GPUSize32,
        dimension?: GPUTextureDimension,
        viewFormats?: GPUTextureFormat[];
    }) {

        if (!descriptor.format) descriptor.format = XGPU.getPreferredCanvasFormat();
        if (!descriptor.usage) descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC;
        if (!descriptor.mipLevelCount) descriptor.mipLevelCount = 1;
        if (!descriptor.sampleCount) descriptor.sampleCount = 1;
        if (!descriptor.dimension) descriptor.dimension = "2d";
        if (!descriptor.viewFormats) descriptor.viewFormats = [];

        super(descriptor)



        this.createGpuResource();
        //this.useOutsideTexture = true;
    }





    public createBindGroupEntry(bindingId: number): { binding: number; resource: GPUTextureView; } {
        if (this.deviceId !== XGPU.deviceId) {
            this.deviceId = XGPU.deviceId;
            this.gpuResource = XGPU.device.createTexture(this.descriptor as GPUTextureDescriptor)
            this._view = this.gpuResource.createView();
        }
        return super.createBindGroupEntry(bindingId)
    }

    public get width(): number { return this.descriptor.size[0] }
    public get height(): number { return this.descriptor.size[1] }

    public update(): void {
        //nothing here

        //console.log(this.deviceId === XGPU.deviceId, this.gpuResource)
    }

    public get source(): ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture { return null }
    public set source(bmp: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture) { if (bmp) return }
}