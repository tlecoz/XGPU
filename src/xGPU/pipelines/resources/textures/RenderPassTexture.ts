// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "../../../XGPU";
import { ImageTexture } from "../../../shader/resources/ImageTexture";
import { Pipeline } from "../../Pipeline";
import { RenderPipeline } from "../../RenderPipeline";

export type RenderPassTextureDescriptor = {
    size: GPUExtent3D,
    format?: GPUTextureFormat,
    usage?: GPUTextureUsageFlags,
    mipLevelCount?: GPUIntegerCoordinate,
    sampleCount?: GPUSize32,
    dimension?: GPUTextureDimension,
    viewFormats?: GPUTextureFormat[],
    label?: string,
}

export class RenderPassTexture extends ImageTexture {

    public static RESOURCE_CHANGED: string = "RESOURCE_CHANGED";

    private ready: boolean = false;

    constructor(pipeline: RenderPipeline, descriptor?: {
        size: GPUExtent3D,
        format?: GPUTextureFormat,
        usage?: GPUTextureUsageFlags,
        mipLevelCount?: GPUIntegerCoordinate,
        sampleCount?: GPUSize32,
        dimension?: GPUTextureDimension,
        viewFormats?: GPUTextureFormat[],
        label?: string,
    }) {

        if (!descriptor) {

            if (pipeline.renderer) descriptor = { size: [pipeline.renderer.width, pipeline.renderer.height] };
            else descriptor = { size: [1, 1] };

        } if (!descriptor.format) descriptor.format = XGPU.getPreferredCanvasFormat();
        if (!descriptor.usage) descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT;
        if (!descriptor.mipLevelCount) descriptor.mipLevelCount = 1;
        if (!descriptor.sampleCount) descriptor.sampleCount = 1;
        if (!descriptor.dimension) descriptor.dimension = "2d";
        if (!descriptor.viewFormats) descriptor.viewFormats = [];
        if (!descriptor.label) descriptor.label = "RenderPassTexture";

        super(descriptor)


        if (!pipeline.renderer) {
            this.ready = false;
            //console.log("wait event")
            pipeline.addEventListener(RenderPipeline.ON_ADDED_TO_RENDERER, () => {
                this.ready = true;
                //console.log("resize")
                this.resize(pipeline.renderer.width, pipeline.renderer.height)

            }, true);
        } else {
            this.ready = true;
        }


        this.renderPipeline = pipeline;
        this.createGpuResource();
        //this.useOutsideTexture = true;
    }

    public renderPipeline: RenderPipeline;

    protected _mustUseCopyTextureToTexture: boolean = false;
    public get mustUseCopyTextureToTexture(): boolean { return this._mustUseCopyTextureToTexture }

    protected frameId: number = -1;
    public applyRenderPass(pipeline: Pipeline) {


        if (this.renderPipeline === pipeline) {
            this._mustUseCopyTextureToTexture = true;
            return
        } else {
            if (!this.ready) {
                if (pipeline instanceof RenderPipeline && pipeline.renderer) {
                    this.renderPipeline.renderer = pipeline.renderer;
                    this.ready = true;
                } else {
                    return;
                }
            }
        }





        if (this.frameId != this.renderPipeline.renderer.frameId) { //avoid potential useless renderPass

            const commandEncoder: GPUCommandEncoder = this.renderPipeline.renderer.commandEncoder;
            if (commandEncoder) {
                this.frameId = this.renderPipeline.renderer.frameId;
                if (!this.renderPipeline.pipeline) {
                    this.renderPipeline.buildGpuPipeline();
                }
                this.renderPipeline.update();
                const renderPass: GPURenderPassEncoder = this.renderPipeline.beginRenderPass(commandEncoder, this.view, 0, true);
                for (let j = 0; j < this.renderPipeline.pipelineCount; j++) {
                    this.renderPipeline.dispatchEvent(RenderPipeline.ON_DRAW, j);
                    this.renderPipeline.draw(renderPass);
                }
                this.renderPipeline.end(commandEncoder, renderPass);



            }
        }

    }

    public resize(w: number, h: number): ImageTexture {
        //if (this.useOutsideTexture) return null;
        this.descriptor.size = [w, h];
        this.createGpuResource()
        this.dispatchEvent(RenderPassTexture.RESOURCE_CHANGED);
        return this;
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
    public get isRenderPass(): boolean { return true; }

    public update(): void {
        //nothing here

        //console.log(this.deviceId === XGPU.deviceId, this.gpuResource)
    }

    public get source(): ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture { return null }
    public set source(bmp: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture) { if (bmp) return }
}