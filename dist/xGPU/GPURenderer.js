// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { HeadlessGPURenderer } from "./HeadlessGPURenderer";
import { XGPU } from "./XGPU";
export class GPURenderer extends HeadlessGPURenderer {
    domElement = null;
    ctx;
    canvasW;
    canvasH;
    constructor(useTextureInComputeShader = false) {
        super(useTextureInComputeShader);
    }
    gpuCtxConfiguration;
    initCanvas(canvas, alphaMode = "opaque") {
        this.canvasW = canvas.width;
        this.canvasH = canvas.height;
        this.domElement = canvas;
        return new Promise(async (resolve, error) => {
            await XGPU.init();
            this.deviceId = XGPU.deviceId;
            if (this.domElement == null)
                return;
            try {
                this.gpuCtxConfiguration = {
                    device: XGPU.device,
                    format: XGPU.getPreferredCanvasFormat(),
                    alphaMode: alphaMode,
                    colorSpace: "srgb",
                    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING,
                };
                this.ctx = this.domElement.getContext("webgpu");
                this.ctx.configure(this.gpuCtxConfiguration);
                resolve(canvas);
            }
            catch (e) {
                error(e);
            }
        });
    }
    get canvas() { return this.domElement; }
    get texture() { return this.ctx.getCurrentTexture(); }
    get width() { return this.canvas.width; }
    get height() { return this.canvas.height; }
    get dimensionChanged() { return this.canvas.dimensionChanged; }
    get view() { return this.ctx.getCurrentTexture().createView(); }
    configure(textureUsage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING, alphaMode = "opaque") {
        this.gpuCtxConfiguration = {
            device: XGPU.device,
            format: XGPU.getPreferredCanvasFormat(),
            alphaMode: alphaMode,
            colorSpace: "srgb",
            usage: textureUsage
        };
        this.ctx.configure(this.gpuCtxConfiguration);
    }
    update() {
        if (!this.ctx)
            return;
        if (XGPU.deviceId != this.deviceId) {
            this.ctx.configure({ ...this.gpuCtxConfiguration, device: XGPU.device });
        }
        if (this.canvas.width != this.canvasW || this.canvas.height != this.canvasH) {
            this.canvasW = this.canvas.width;
            this.canvasH = this.canvas.height;
            this.canvas.dimensionChanged = true;
        }
        super.update();
    }
}
