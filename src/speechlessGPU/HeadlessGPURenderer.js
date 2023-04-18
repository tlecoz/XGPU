import { SLGPU } from "./SLGPU";
import { Texture } from "./pipelines/resources/textures/Texture";
export class HeadlessGPURenderer {
    textureObj;
    dimension;
    renderPipelines = [];
    constructor() {
    }
    init(w, h, usage, sampleCount) {
        this.dimension = { width: w, height: h, dimensionChanged: true };
        return new Promise((onResolve) => {
            SLGPU.init().then(() => {
                if (!usage)
                    usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC;
                this.textureObj = new Texture({
                    size: [w, h],
                    format: "bgra8unorm",
                    usage,
                    sampleCount
                });
                this.textureObj.create();
                onResolve(this);
            });
        });
    }
    get firstPipeline() { return this.renderPipelines[0]; }
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
    resize(w, h) {
        this.dimension.width = w;
        this.dimension.height = h;
        this.dimension.dimensionChanged = true;
        this.textureObj.resize(w, h);
    }
    update() {
        if (!SLGPU.ready || this.renderPipelines.length === 0)
            return;
        const commandEncoder = SLGPU.device.createCommandEncoder();
        let pipeline, renderPass;
        for (let i = 0; i < this.renderPipelines.length; i++) {
            pipeline = this.renderPipelines[i];
            renderPass = pipeline.beginRenderPass(commandEncoder, this.view);
            pipeline.update();
            pipeline.draw(renderPass);
            pipeline.end(commandEncoder, renderPass);
        }
        SLGPU.device.queue.submit([commandEncoder.finish()]);
        this.dimension.dimensionChanged = false;
    }
    get canvas() { return this.dimension; }
    get width() { return this.canvas.width; }
    get height() { return this.canvas.height; }
    get texture() {
        if (!this.textureObj)
            throw new Error("HeadlessGPURenderer is not initialized yet. You must Use HeadlessGPURenderer.init in order to initialize it");
        return this.textureObj.gpuResource;
    }
    get view() {
        if (!this.textureObj)
            throw new Error("HeadlessGPURenderer is not initialized yet. You must Use HeadlessGPURenderer.init in order to initialize it");
        return this.textureObj.view;
    }
}
