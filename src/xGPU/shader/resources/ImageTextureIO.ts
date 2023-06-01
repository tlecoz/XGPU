// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "../../XGPU";
import { ComputePipeline } from "../../pipelines/ComputePipeline";
import { ImageTexture } from "./ImageTexture";

export class ImageTextureIO {

    public textures: ImageTexture[] = [];
    public descriptor: { size: GPUExtent3D, format: GPUTextureFormat, usage?: number }

    protected stagingBuffer: GPUBuffer;
    protected canCallMapAsync: boolean = true;
    public onOutputData: (data: Uint32Array) => void;

    constructor(descriptor: {
        source: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture | null,
        width?: number,
        height?: number,
        format?: GPUTextureFormat
    }) {

        let w, h;
        if (descriptor.source != null) {
            w = descriptor.source.width;
            h = descriptor.source.height;
        } else {
            if (!descriptor.width || !descriptor.height) {
                throw new Error("ImageTextureIO width and/or height missing in descriptor")
            }
            w = descriptor.width;
            h = descriptor.height;
        }


        this.descriptor = {
            size: [w, h],
            format: "rgba8unorm",
            usage: (descriptor.source instanceof GPUTexture) ? descriptor.source.usage : undefined
        };
        if (descriptor.format) this.descriptor.format = descriptor.format;

        this.textures[0] = new ImageTexture(this.descriptor);
        this.textures[1] = new ImageTexture(this.descriptor)


        this.textures[0].io = 1;
        this.textures[1].io = 2;

        this.textures[0].resourceIO = this;
        this.textures[1].resourceIO = this;

        if (descriptor.source != null) this.textures[0].source = descriptor.source;
    }

    public clone(): ImageTextureIO {
        const obj = {
            source: this.textures[0].gpuResource,
            width: this.descriptor.size[0],
            height: this.descriptor.size[1],
            format: this.descriptor.format
        }
        return new ImageTextureIO(obj);
    }


    public createDeclaration(name: string, bindingId: number, groupId: number): string {



        let result = "";
        const varName = name.substring(0, 1).toLowerCase() + name.slice(1);
        result += " @binding(" + bindingId + ") @group(" + groupId + ") var " + varName + " : texture_2d<f32>;\n";
        result += " @binding(" + (bindingId + 1) + ") @group(" + groupId + ") var " + varName + "_out" + " : texture_storage_2d<rgba8unorm, write>;\n";
        return result;
    }


    protected outputBuffer: GPUBuffer;


    public destroy() {
        if (this.stagingBuffer) this.stagingBuffer.destroy();
        this.textures = undefined;
        this.onOutputData = undefined;
    }

    public async getOutputData() {

        if (!this.onOutputData || !this.canCallMapAsync) return;

        if (!this.outputBuffer) {

            this.outputBuffer = XGPU.device.createBuffer({
                size: this.width * this.height * 4 * 4,
                usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
                mappedAtCreation: false,
            })

            this.stagingBuffer = XGPU.createStagingBuffer(this.outputBuffer.size);
        }

        var texture = this.textures[0].gpuResource;
        const copyEncoder = XGPU.device.createCommandEncoder();
        const stage = this.stagingBuffer;

        copyEncoder.copyTextureToBuffer({ texture: texture }, { buffer: this.outputBuffer, bytesPerRow: Math.ceil((this.width * 4) / 256) * 256, rowsPerImage: this.height }, [this.width, this.height, 1]);
        copyEncoder.copyBufferToBuffer(this.outputBuffer, 0, stage, 0, stage.size);

        XGPU.device.queue.submit([copyEncoder.finish()]);

        this.canCallMapAsync = false;
        await this.stagingBuffer.mapAsync(GPUMapMode.READ, 0, stage.size)
        this.canCallMapAsync = true;

        const copyArray = stage.getMappedRange(0, stage.size);
        const data = copyArray.slice(0);
        stage.unmap();

        this.onOutputData(new Uint32Array(data));

    }



    public get width(): number { return this.textures[0].gpuResource.width }
    public get height(): number { return this.textures[0].gpuResource.height }

    public textureSize(): GPUExtent3D { return this.descriptor.size }

}