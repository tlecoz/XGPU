// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "../../XGPU";
import { ImageTexture } from "./ImageTexture";
import { ImageTextureArray } from "./ImageTextureArray";
import { IShaderResource } from "./IShaderResource";

export type ImageTextureArrayDescriptor = {
    source?: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[],
    size: GPUExtent3D,
    usage?: GPUTextureUsageFlags,
    dimension: string,
    defaultViewDescriptor?: GPUTextureViewDescriptor,
    sampledType?: "f32" | "i32" | "u32"
}


export class CubeMapTextureArray extends ImageTextureArray implements IShaderResource {


    declare public descriptor: any;


    constructor(descriptor: ImageTextureArrayDescriptor) {

        descriptor = { ...descriptor };

        if (descriptor.source) {
            if (descriptor.source.length === 0 || descriptor.source.length % 6 !== 0) {
                throw new Error("CubeMapTextureArray error : descriptor.source must contains an array of (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) with a length greater than 0 and multiple of 6.")
            }
        }


        if (!descriptor.dimension) descriptor.dimension = "2d"
        if (undefined === descriptor.usage) descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;

        super(descriptor as any);
        if (descriptor.source) this.bitmaps = descriptor.source

    }


    public clone(): CubeMapTextureArray {
        if (!this.descriptor.source) this.descriptor.source = this._bitmaps;
        return new CubeMapTextureArray(this.descriptor);
    }




    public set bitmaps(images: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture)[]) {

        if (images.length === 0 || images.length % 6 !== 0) {
            throw new Error("CubeMapTextureArray error : descriptor.source must contains an array of (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) with a length greater than 0 and multiple of 6.")
        }

        for (let i = 0; i < images.length; i++) {
            this._bitmaps[i] = images[i];
            this.mustUpdate[i] = true;
        }
        this.mustBeTransfered = true;
        this.update();
    }
    public get bitmaps(): (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture)[] { return this._bitmaps; }

    public setCubeSideById(cubeid: number, sideId: number, image: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | GPUTexture)) {

        if (this._bitmaps[cubeid * 6 + sideId] instanceof ImageBitmap) (this._bitmaps[cubeid * 6 + sideId] as ImageBitmap).close();

        this._bitmaps[cubeid * 6 + sideId] = image;
        this.mustUpdate[cubeid * 6 + sideId] = true;
        this.mustBeTransfered = true;
    }

    public createGpuResource(): void {
        if (this.gpuResource) this.gpuResource.destroy();
        //console.log("cubemap createtexture ", this.descriptor)
        this.gpuResource = XGPU.device.createTexture(this.descriptor as GPUTextureDescriptor);
        this._view = this.gpuResource.createView({ dimension: 'cube-array', arrayLayerCount: this._bitmaps.length });
    }






    //-----

    public createDeclaration(varName: string, bindingId: number, groupId: number = 0): string {
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_cube_array<" + this.sampledType + ">;\n";
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
                viewDimension: "cube-array",
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