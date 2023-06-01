// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { HeadlessGPURenderer } from "./HeadlessGPURenderer";
import { XGPU } from "./XGPU";


export class GPURenderer extends HeadlessGPURenderer {

    protected domElement: HTMLCanvasElement = null;
    protected ctx: GPUCanvasContext;
    protected canvasW: number;
    protected canvasH: number;


    constructor(useTextureInComputeShader: boolean = false) {
        super(useTextureInComputeShader)
    }


    public initCanvas(canvas: HTMLCanvasElement, alphaMode: "opaque" | "premultiplied" = "opaque"): Promise<HTMLCanvasElement> {
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


    public get canvas(): { width: number, height: number, dimensionChanged: boolean } { return this.domElement as any; }
    public get texture(): GPUTexture { return this.ctx.getCurrentTexture() }

    public get width(): number { return this.canvas.width }
    public get height(): number { return this.canvas.height }

    public get dimensionChanged(): boolean { return (this.canvas as any).dimensionChanged; }
    public get view(): GPUTextureView { return this.ctx.getCurrentTexture().createView(); }

    public configure(textureUsage: GPUTextureUsageFlags = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING, alphaMode: "opaque" | "premultiplied" = "opaque") {
        this.ctx.configure({
            device: XGPU.device,
            format: XGPU.getPreferredCanvasFormat(),
            alphaMode: alphaMode,
            colorSpace: "srgb",
            usage: textureUsage
        })
    }

    public update() {
        if (!this.ctx) return;

        if (this.canvas.width != this.canvasW || this.canvas.height != this.canvasH) {
            this.canvasW = this.canvas.width;
            this.canvasH = this.canvas.height;
            (this.canvas as any).dimensionChanged = true;
        }

        super.update()
    }
}