import { SLGPU } from "./SLGPU";
export class GPURenderer {
    domElement = null;
    ctx;
    canvasW;
    canvasH;
    renderPipelines = [];
    constructor() {
    }
    initCanvas(w, h, useAlphaChannel = true) {
        return new Promise((onResolve, onError) => {
            SLGPU.init().then(() => {
                this.domElement = document.createElement("canvas");
                this.ctx = this.domElement.getContext("webgpu");
                const devicePixelRatio = window.devicePixelRatio || 1;
                this.canvasW = this.domElement.width = w * devicePixelRatio;
                this.canvasH = this.domElement.height = h * devicePixelRatio;
                let alphaMode = "opaque";
                if (useAlphaChannel)
                    alphaMode = "premultiplied";
                if (!this.ctx.configure)
                    onError(null);
                this.ctx.configure({
                    device: SLGPU.device,
                    format: SLGPU.getPreferredCanvasFormat(),
                    alphaMode: alphaMode,
                    colorSpace: "srgb",
                    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
                });
                onResolve(this.canvas);
            });
        });
    }
    get firstPipeline() { return this.renderPipelines[0]; }
    get canvas() { return this.domElement; }
    get texture() { return this.ctx.getCurrentTexture(); }
    get width() { return this.canvas.width; }
    get height() { return this.canvas.height; }
    configure(textureUsage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC, alphaMode = "opaque") {
        this.ctx.configure({
            device: SLGPU.device,
            format: SLGPU.getPreferredCanvasFormat(),
            alphaMode: alphaMode,
            colorSpace: "srgb",
            usage: textureUsage
        });
    }
    nbColorAttachment = 0;
    addPipeline(pipeline, offset = null) {
        if (offset === null)
            this.renderPipelines.push(pipeline);
        else
            this.renderPipelines.splice(offset, 0, pipeline);
        if (pipeline.renderPassDescriptor.colorAttachments[0])
            this.nbColorAttachment++;
    }
    get useSinglePipeline() { return this.nbColorAttachment === 1; }
    update() {
        if (!SLGPU.ready || this.renderPipelines.length === 0)
            return;
        if (this.canvas.width != this.canvasW || this.canvas.height != this.canvasH) {
            this.canvasW = this.canvas.width;
            this.canvasH = this.canvas.height;
            this.canvas.dimensionChanged = true;
        }
        const commandEncoder = SLGPU.device.createCommandEncoder();
        const textureView = this.ctx.getCurrentTexture().createView();
        let pipeline, renderPass;
        for (let i = 0; i < this.renderPipelines.length; i++) {
            pipeline = this.renderPipelines[i];
            renderPass = pipeline.beginRenderPass(commandEncoder, textureView);
            pipeline.update();
            pipeline.draw(renderPass);
            pipeline.end(commandEncoder, renderPass);
        }
        SLGPU.device.queue.submit([commandEncoder.finish()]);
        this.canvas.dimensionChanged = false;
    }
}
