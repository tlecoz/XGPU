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


        let div = document.createElement("div");
        div.style.backgroundColor = "#f0f";
        div.style.width = "100px";
        div.style.height = "100px";
        div.style.zIndex = "999999999999";
        div.style.position = "absolute";
        div.style.top = "0px";
        div.style.left = "0px";
        div.style.cursor = "pointer";
        document.body.appendChild(div);

        div.onclick = () => {
            XGPU.loseDevice();
        }

    }

    protected gpuCtxConfiguration: any;
    public initCanvas(canvas: HTMLCanvasElement, alphaMode: "opaque" | "premultiplied" = "opaque"): Promise<HTMLCanvasElement> {
        this.canvasW = canvas.width;
        this.canvasH = canvas.height;
        this.domElement = canvas;

        return new Promise(async (resolve: (e: HTMLCanvasElement) => void, error: (e: unknown) => void) => {
            await XGPU.init()
            this.deviceId = XGPU.deviceId;
            if (this.domElement == null) return

            try {
                this.gpuCtxConfiguration = {
                    device: XGPU.device,
                    format: XGPU.getPreferredCanvasFormat(),
                    alphaMode: alphaMode,
                    colorSpace: "srgb",
                    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING,
                };
                this.ctx = this.domElement.getContext("webgpu");
                this.ctx.configure(this.gpuCtxConfiguration)

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

        this.gpuCtxConfiguration = {
            device: XGPU.device,
            format: XGPU.getPreferredCanvasFormat(),
            alphaMode: alphaMode,
            colorSpace: "srgb",
            usage: textureUsage
        };

        this.ctx.configure(this.gpuCtxConfiguration)
    }

    public update() {
        if (!this.ctx) return;


        if (XGPU.deviceId != this.deviceId) {
            this.ctx.configure({ ...this.gpuCtxConfiguration, device: XGPU.device })

        }

        if (this.canvas.width != this.canvasW || this.canvas.height != this.canvasH) {
            this.canvasW = this.canvas.width;
            this.canvasH = this.canvas.height;
            (this.canvas as any).dimensionChanged = true;
        }

        super.update()
    }
}