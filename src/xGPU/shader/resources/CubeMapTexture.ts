// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "../../XGPU";
import { ImageTexture } from "./ImageTexture";
import { IShaderResource } from "./IShaderResource";

export type CubeMapTextureDescriptor = {
    source?: {
        front: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas,
        back: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas,
        left: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas,
        right: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas,
        top: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas,
        bottom: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas,
    },
    size: GPUExtent3D,
    usage?: GPUTextureUsageFlags,
    dimension: string,
    defaultViewDescriptor?: GPUTextureViewDescriptor
}


export class CubeMapTexture extends ImageTexture implements IShaderResource {


    declare public descriptor: any;

    protected _sides: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[] = [];

    constructor(descriptor: {
        source?: ImageBitmap[], ////front,back,left,right,top,bottom
        size: GPUExtent3D,
        usage?: GPUTextureUsageFlags,
        defaultViewDescriptor?: GPUTextureViewDescriptor,
        dimension?: string
    }) {

        descriptor = { ...descriptor };
        if (!descriptor.dimension) descriptor.dimension = "2d"

        if (undefined === descriptor.usage) descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;

        super(descriptor as any);
        if (descriptor.source) this.sides = descriptor.source

    }


    public clone(): CubeMapTexture {
        if (!this.descriptor.source) this.descriptor.source = this._sides;
        return new CubeMapTexture(this.descriptor);
    }


    public set right(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) {

        this._sides[0] = bmp;
        this.mustBeTransfered = true;
    }
    public set left(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) {
        if (!this.descriptor.source) this.descriptor.source = {};
        this._sides[1] = bmp;
        this.mustBeTransfered = true;
    }
    public set bottom(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) {
        if (!this.descriptor.source) this.descriptor.source = {};
        this._sides[2] = bmp;
        this.mustBeTransfered = true;
    }
    public set top(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) {
        if (!this.descriptor.source) this.descriptor.source = {};
        this._sides[3] = bmp;
        this.mustBeTransfered = true;
    }
    public set back(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) {
        if (!this.descriptor.source) this.descriptor.source = {};
        this._sides[4] = bmp;
        this.mustBeTransfered = true;
    }
    public set front(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) {
        if (!this.descriptor.source) this.descriptor.source = {};
        this._sides[5] = bmp;
        this.mustBeTransfered = true;
    }

    public set sides(images: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[]) {
        for (let i = 0; i < 6; i++) this._sides[i] = images[i];
        this.mustBeTransfered = true;
        this.update();
    }
    public get sides(): (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[] { return this._sides; }

    public createGpuResource(): void {
        if (this.gpuResource) this.gpuResource.destroy();
        //console.log("cubemap createtexture ", this.descriptor)
        this.gpuResource = XGPU.device.createTexture(this.descriptor as GPUTextureDescriptor);
        this._view = this.gpuResource.createView({ dimension: 'cube' });
    }

    public update(): void {


        if (this.mustBeTransfered) {

            if (!this.gpuResource) this.createGpuResource();

            let bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas;
            for (let i = 0; i < 6; i++) {
                bmp = this._sides[i];
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
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_cube<f32>;\n";
    }


    public createBindGroupLayoutEntry(bindingId: number): { binding: number, visibility: number, texture: GPUTextureBindingLayout } {
        return {
            binding: bindingId,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
                sampleType: "float",
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