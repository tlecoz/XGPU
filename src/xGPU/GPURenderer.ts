// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "./XGPU";
import { RenderPipeline } from "./pipelines/RenderPipeline";

export class GPURenderer {

    protected domElement: HTMLCanvasElement = null;
    protected ctx: GPUCanvasContext;
    protected canvasW: number;
    protected canvasH: number;

    protected renderPipelines: RenderPipeline[] = [];


    constructor() {

    }


    public init(canvas: HTMLCanvasElement, alphaMode: "opaque" | "premultiplied" = "opaque"): Promise<HTMLCanvasElement> {
        this.canvasW = canvas.width;
        this.canvasH = canvas.height;
        this.domElement = canvas;




        return new Promise(async (resolve: (e: HTMLCanvasElement) => void, error: (e: unknown) => void) => {
            await XGPU.init()

            if (this.domElement == null) return

            try {
                this.ctx = this.domElement.getContext("webgpu");
                this.ctx.configure({
                    device: XGPU.device,
                    format: XGPU.getPreferredCanvasFormat(),
                    alphaMode: alphaMode,
                    colorSpace: "srgb",
                    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING,
                })

                resolve(canvas)
            } catch (e) {
                error(e)
            }

        })
    }

    public initCanvas(w: number, h: number, useAlphaChannel: boolean = true): Promise<HTMLCanvasElement> {

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;

        let alphaMode: "opaque" | "premultiplied" = "opaque";
        if (useAlphaChannel) alphaMode = "premultiplied";

        return this.init(canvas, alphaMode);


    }

    public get firstPipeline(): RenderPipeline { return this.renderPipelines[0]; }

    public get canvas(): { width: number, height: number, dimensionChanged: boolean } { return this.domElement as any; }
    public get texture(): GPUTexture { return this.ctx.getCurrentTexture() }

    public get width(): number { return this.canvas.width }
    public get height(): number { return this.canvas.height }


    public configure(textureUsage: GPUTextureUsageFlags = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING, alphaMode: "opaque" | "premultiplied" = "opaque") {
        this.ctx.configure({
            device: XGPU.device,
            format: XGPU.getPreferredCanvasFormat(),
            alphaMode: alphaMode,
            colorSpace: "srgb",
            usage: textureUsage
        })
    }

    protected nbColorAttachment: number = 0;

    public addPipeline(pipeline: RenderPipeline, offset: number = null) {

        if (offset === null) this.renderPipelines.push(pipeline);
        else this.renderPipelines.splice(offset, 0, pipeline)

        if (pipeline.renderPassDescriptor.colorAttachments[0]) this.nbColorAttachment++;
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

    public get useSinglePipeline(): boolean { return this.nbColorAttachment === 1 }

    public get nbPipeline(): number { return this.renderPipelines.length }

    public update() {
        if (!XGPU.ready || this.renderPipelines.length === 0 || !this.ctx) return;
        if (this.canvas.width != this.canvasW || this.canvas.height != this.canvasH) {
            this.canvasW = this.canvas.width;
            this.canvasH = this.canvas.height;
            (this.canvas as any).dimensionChanged = true;
        }

        const commandEncoder = XGPU.device.createCommandEncoder();
        const textureView = this.ctx.getCurrentTexture().createView();



        let pipeline: RenderPipeline, renderPass;

        for (let i = 0; i < this.renderPipelines.length; i++) {
            pipeline = this.renderPipelines[i];
            pipeline.update()

            for (let j = 0; j < pipeline.pipelineCount; j++) {
                renderPass = pipeline.beginRenderPass(commandEncoder, textureView, j);
                if (pipeline.onDraw) pipeline.onDraw(j);
                pipeline.draw(renderPass);
                pipeline.end(commandEncoder, renderPass);

            }




        }



        XGPU.device.queue.submit([commandEncoder.finish()]);

        (this.canvas as any).dimensionChanged = false;
    }
}