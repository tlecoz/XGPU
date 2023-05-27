// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "../../XGPU";
import { ImageTexture } from "./ImageTexture";
import { IShaderResource } from "./IShaderResource";

export type ImageTextureArrayDescriptor = {
    source?: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[],
    size: GPUExtent3D,
    usage?: GPUTextureUsageFlags,
    dimension: string,
    defaultViewDescriptor?: GPUTextureViewDescriptor,
    sampledType?: "f32" | "i32" | "u32"
}


export class ImageTextureArray extends ImageTexture implements IShaderResource {


    declare public descriptor: any;

    protected _bitmaps: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[] = [];

    constructor(descriptor: {
        source?: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[], ////front,back,left,right,top,bottom
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
        if (descriptor.source) this.bitmaps = descriptor.source

    }


    public clone(): ImageTextureArray {
        if (!this.descriptor.source) this.descriptor.source = this._bitmaps;
        return new ImageTextureArray(this.descriptor);
    }




    public set bitmaps(images: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[]) {
        for (let i = 0; i < images.length; i++) this._bitmaps[i] = images[i];
        this.mustBeTransfered = true;
        this.update();
    }
    public get bitmaps(): (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[] { return this._bitmaps; }

    public setImageById(image: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas), id: number) {
        this._bitmaps[id] = image;
    }

    public createGpuResource(): void {
        if (this.gpuResource) this.gpuResource.destroy();
        console.log("textureArray createtexture ", this.descriptor)
        this.gpuResource = XGPU.device.createTexture(this.descriptor as GPUTextureDescriptor);
        this._view = this.gpuResource.createView({ dimension: '2d-array', arrayLayerCount: this._bitmaps.length });
    }

    public update(): void {


        if (this.mustBeTransfered) {

            if (!this.gpuResource) this.createGpuResource();

            let bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas;
            for (let i = 0; i < this._bitmaps.length; i++) {
                bmp = this.bitmaps[i];
                //console.log("upload texture ", bmp)
                if (bmp) {
                    XGPU.device.queue.copyExternalImageToTexture(
                        { source: bmp },
                        { texture: this.gpuResource, origin: [0, 0, i] },
                        [bmp.width, bmp.height]
                    );
                }
            }
            //if (bmp instanceof ImageBitmap) bmp.close();
            this.mustBeTransfered = false;
        }


    }

    //-----

    public createDeclaration(varName: string, bindingId: number, groupId: number = 0): string {
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_2d_array<" + this.sampledType + ">;\n";
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
                viewDimension: "2d-array",
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