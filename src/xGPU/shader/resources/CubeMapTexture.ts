// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "../../XGPU";
import { ImageTextureArray } from "./ImageTextureArray";
import { IShaderResource } from "./IShaderResource";

export type CubeMapTextureDescriptor = {
    source?: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[],
    size: GPUExtent3D,
    usage?: GPUTextureUsageFlags,
    dimension: string,
    defaultViewDescriptor?: GPUTextureViewDescriptor,
    sampledType?: "f32" | "i32" | "u32"
}


export class CubeMapTexture extends ImageTextureArray implements IShaderResource {

    declare public descriptor: any;



    constructor(descriptor: {
        source?: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture)[], ////front,back,left,right,top,bottom
        size: GPUExtent3D,
        usage?: GPUTextureUsageFlags,
        defaultViewDescriptor?: GPUTextureViewDescriptor,
        dimension?: string,
        sampledType?: "f32" | "i32" | "u32"
    }) {

        descriptor = { ...descriptor };
        if (!descriptor.dimension) descriptor.dimension = "2d"
        if (undefined === descriptor.usage) descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;

        super(descriptor as any);
        if (descriptor.source) this.sides = descriptor.source

    }


    public clone(): CubeMapTexture {
        if (!this.descriptor.source) this.descriptor.source = this._bitmaps;
        return new CubeMapTexture(this.descriptor);
    }


    public set right(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture) {

        this._bitmaps[0] = bmp;
        this.mustBeTransfered = true;
    }
    public set left(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture) {
        if (!this.descriptor.source) this.descriptor.source = {};
        this._bitmaps[1] = bmp;
        this.mustBeTransfered = true;
    }
    public set bottom(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture) {
        if (!this.descriptor.source) this.descriptor.source = {};
        this._bitmaps[2] = bmp;
        this.mustBeTransfered = true;
    }
    public set top(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture) {
        if (!this.descriptor.source) this.descriptor.source = {};
        this._bitmaps[3] = bmp;
        this.mustBeTransfered = true;
    }
    public set back(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture) {
        if (!this.descriptor.source) this.descriptor.source = {};
        this._bitmaps[4] = bmp;
        this.mustBeTransfered = true;
    }
    public set front(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture) {
        if (!this.descriptor.source) this.descriptor.source = {};
        this._bitmaps[5] = bmp;
        this.mustBeTransfered = true;
    }

    public set sides(images: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture)[]) {
        for (let i = 0; i < 6; i++) this._bitmaps[i] = images[i];
        this.mustBeTransfered = true;
        this.update();
    }
    public get sides(): (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture)[] { return this._bitmaps; }

    public createGpuResource(): void {
        if (this.gpuResource) this.gpuResource.destroy();
        //console.log("cubemap createtexture ", this.descriptor)
        this.gpuResource = XGPU.device.createTexture(this.descriptor as GPUTextureDescriptor);
        this._view = this.gpuResource.createView({ dimension: 'cube' });
    }



    //-----

    public createDeclaration(varName: string, bindingId: number, groupId: number = 0): string {
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_cube<" + this.sampledType + ">;\n";
    }


    public createBindGroupLayoutEntry(bindingId: number): { binding: number, visibility: number, texture: GPUTextureBindingLayout } {
        let sampleType: GPUTextureSampleType = "float";
        if (this.sampledType === "i32") sampleType = "sint";
        else if (this.sampledType === "u32") sampleType = "uint";

        return {
            binding: bindingId,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
                sampleType,
                viewDimension: "cube",
                multisampled: false
            },
        }
    }


    public createBindGroupEntry(bindingId: number): { binding: number, resource: GPUTextureView } {
        if (!this.gpuResource) this.createGpuResource();
        return {
            binding: bindingId,
            resource: this._view,
        }
    }

    public setPipelineType(pipelineType: "compute" | "render" | "compute_mixed") {
        if (pipelineType) { }

        //use to handle particular cases in descriptor relative to the nature of pipeline
    }
}