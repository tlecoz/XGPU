// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "./XGPU";
import { RenderPipeline } from "./pipelines/RenderPipeline";
import { Texture } from "./pipelines/resources/textures/Texture";
import { IRenderer } from "./IRenderer"

export class TextureRenderer implements IRenderer {

    protected textureObj: Texture
    protected dimensionChanged: boolean = false;
    protected currentWidth: number;
    protected currentHeight: number;

    public renderPipelines: RenderPipeline[] = [];

    protected useTextureInComputeShader;
    public frameId: number = -1;


    constructor(useTextureInComputeShader: boolean = false) {
        this.useTextureInComputeShader = useTextureInComputeShader;
    }

    protected deviceId: number;

    public init(w: number, h: number, usage?: number, sampleCount?: number) {

        this.currentWidth = w;
        this.currentHeight = h;

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

    //public get firstPipeline(): RenderPipeline { return this.renderPipelines[0]; }

    protected nbColorAttachment: number = 0;

    public addPipeline(pipeline: RenderPipeline, offset: number = null): RenderPipeline {

        pipeline.renderer = this;
        if (pipeline.renderPassDescriptor.colorAttachments[0]) this.nbColorAttachment++;

        if (offset === null) this.renderPipelines.push(pipeline);
        else this.renderPipelines.splice(offset, 0, pipeline)

        return pipeline;
    }

    public removePipeline(pipeline: RenderPipeline) {
        if (pipeline.renderPassDescriptor.colorAttachments[0]) this.nbColorAttachment--;
        const id = this.renderPipelines.indexOf(pipeline);
        if (id != -1) {
            this.renderPipelines.splice(id, 1);
        }
        pipeline.renderer = null;
        return pipeline;
    }


    //public get nbPipeline(): number { return this.renderPipelines.length }
    //public get useSinglePipeline(): boolean { return this.nbColorAttachment === 1 }

    public resize(w: number, h: number) {
        this.currentWidth = w;
        this.currentHeight = h;
        this.dimensionChanged = true;
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

    public commandEncoder: GPUCommandEncoder = null;


    public async update() {




        if (!XGPU.ready || this.renderPipelines.length === 0 || this.deviceId === undefined) return;

        let deviceChanged: boolean = XGPU.deviceId != this.deviceId;
        if (deviceChanged) {

            if (this.textureObj) this.textureObj.create();
            this.deviceId = XGPU.deviceId;
            for (let i = 0; i < this.renderPipelines.length; i++) {
                this.renderPipelines[i].clearAfterDeviceLostAndRebuild();
            }
        }

        this.commandEncoder = XGPU.device.createCommandEncoder();


        let pipeline: RenderPipeline, renderPass;
        for (let i = 0; i < this.renderPipelines.length; i++) {
            pipeline = this.renderPipelines[i];
            pipeline.update();

            for (let j = 0; j < pipeline.pipelineCount; j++) {

                renderPass = pipeline.beginRenderPass(this.commandEncoder, this.view, j);
                pipeline.dispatchEvent(RenderPipeline.ON_DRAW, j);
                //if (pipeline.onDraw) pipeline.onDraw(j);
                pipeline.draw(renderPass);
                pipeline.end(this.commandEncoder, renderPass);
            }
        }

        const commandBuffer = this.commandEncoder.finish();
        this.commandEncoder = null;

        XGPU.device.queue.submit([commandBuffer]);

        this.dimensionChanged = false;



    }

    public get resized(): boolean { return this.dimensionChanged; }
    public get canvas(): HTMLCanvasElement { return null; }
    public get width(): number { return this.currentWidth }
    public get height(): number { return this.currentHeight }

    public get texture(): GPUTexture {
        if (!this.textureObj) throw new Error("TextureRenderer is not initialized yet. You must Use TextureRenderer.init in order to initialize it")
        return this.textureObj.gpuResource;
    }
    public get view(): GPUTextureView {
        if (!this.textureObj) throw new Error("TextureRenderer is not initialized yet. You must Use TextureRenderer.init in order to initialize it")
        return this.textureObj.view;
    }





}