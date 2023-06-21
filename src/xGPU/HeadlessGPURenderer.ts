// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "./XGPU";
import { RenderPipeline } from "./pipelines/RenderPipeline";
import { Texture } from "./pipelines/resources/textures/Texture";
import { IRenderer } from "./IRenderer"

export class HeadlessGPURenderer implements IRenderer {

    protected textureObj: Texture
    protected dimension: { width: number, height: number, dimensionChanged: boolean };
    protected renderPipelines: RenderPipeline[] = [];

    protected useTextureInComputeShader;

    constructor(useTextureInComputeShader: boolean = false) {
        this.useTextureInComputeShader = useTextureInComputeShader;
    }

    protected deviceId: number;

    public init(w: number, h: number, usage?: number, sampleCount?: number) {
        this.dimension = { width: w, height: h, dimensionChanged: true };
        return new Promise((onResolve: (val: any) => void) => {

            XGPU.init().then(() => {

                this.deviceId = XGPU.deviceId;

                if (!usage) usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC;

                let format: GPUTextureFormat = "bgra8unorm";
                if (this.useTextureInComputeShader) {
                    format = "rgba8unorm";
                    usage += GPUTextureUsage.STORAGE_BINDING;
                }



                this.textureObj = new Texture({
                    size: [w, h],
                    format,
                    usage,
                    sampleCount
                })
                this.textureObj.create();

                onResolve(this);
            });

        });


    }

    public get firstPipeline(): RenderPipeline { return this.renderPipelines[0]; }

    protected nbColorAttachment: number = 0;

    public addPipeline(pipeline: RenderPipeline, offset: number = null) {

        if (offset === null) this.renderPipelines.push(pipeline);
        else this.renderPipelines.splice(offset, 0, pipeline)


        if (pipeline.renderPassDescriptor.colorAttachments[0]) this.nbColorAttachment++;
    }
    public get nbPipeline(): number { return this.renderPipelines.length }
    public get useSinglePipeline(): boolean { return this.nbColorAttachment === 1 }

    public resize(w: number, h: number) {
        this.dimension.width = w;
        this.dimension.height = h;
        this.dimension.dimensionChanged = true;
        if (this.textureObj) this.textureObj.resize(w, h);
    }

    public destroy(): void {
        for (let i = 0; i < this.renderPipelines.length; i++) {
            this.renderPipelines[i].destroy();
        }
        this.renderPipelines = [];
        for (let z in this) {
            this[z] = null;
        }
    }

    public update() {

        if (!XGPU.ready || this.renderPipelines.length === 0 || this.deviceId === undefined) return;
        //console.log(XGPU.deviceId + " VS " + this.deviceId);
        let deviceChanged: boolean = XGPU.deviceId != this.deviceId;
        if (deviceChanged) {
            if (this.textureObj) this.textureObj.create();
            this.deviceId = XGPU.deviceId;
        }


        const commandEncoder = XGPU.device.createCommandEncoder();

        let pipeline: RenderPipeline, renderPass;
        for (let i = 0; i < this.renderPipelines.length; i++) {
            pipeline = this.renderPipelines[i];
            if (deviceChanged) {

                pipeline.clearAfterDeviceLostAndRebuild();
            }

            pipeline.update()

            for (let j = 0; j < pipeline.pipelineCount; j++) {
                renderPass = pipeline.beginRenderPass(commandEncoder, this.view, j);
                if (pipeline.onDraw) pipeline.onDraw(j);
                pipeline.draw(renderPass);
                pipeline.end(commandEncoder, renderPass);

            }
        }

        XGPU.device.queue.submit([commandEncoder.finish()]);

        this.canvas.dimensionChanged = false;
    }

    public get dimensionChanged(): boolean { return this.dimension.dimensionChanged; }
    public get canvas(): { width: number, height: number, dimensionChanged: boolean } { return this.dimension; }
    public get width(): number { return this.dimension.width }
    public get height(): number { return this.dimension.height }

    public get texture(): GPUTexture {
        if (!this.textureObj) throw new Error("HeadlessGPURenderer is not initialized yet. You must Use HeadlessGPURenderer.init in order to initialize it")
        return this.textureObj.gpuResource;
    }
    public get view(): GPUTextureView {
        if (!this.textureObj) throw new Error("HeadlessGPURenderer is not initialized yet. You must Use HeadlessGPURenderer.init in order to initialize it")
        return this.textureObj.view;
    }



}