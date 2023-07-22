// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { XGPU } from "./XGPU";
import { Texture } from "./pipelines/resources/textures/Texture";
export class HeadlessGPURenderer {
    textureObj;
    dimension;
    renderPipelines = [];
    useTextureInComputeShader;
    constructor(useTextureInComputeShader = false) {
        this.useTextureInComputeShader = useTextureInComputeShader;
    }
    deviceId;
    init(w, h, usage, sampleCount) {
        this.dimension = { width: w, height: h, dimensionChanged: true };
        return new Promise((onResolve) => {
            XGPU.init().then(() => {
                this.deviceId = XGPU.deviceId;
                if (!usage)
                    usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC;
                let format = "bgra8unorm";
                if (this.useTextureInComputeShader) {
                    format = "rgba8unorm";
                    usage += GPUTextureUsage.STORAGE_BINDING;
                }
                this.textureObj = new Texture({
                    size: [w, h],
                    format,
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
    get nbPipeline() { return this.renderPipelines.length; }
    get useSinglePipeline() { return this.nbColorAttachment === 1; }
    resize(w, h) {
        this.dimension.width = w;
        this.dimension.height = h;
        this.dimension.dimensionChanged = true;
        if (this.textureObj)
            this.textureObj.resize(w, h);
    }
    destroy() {
        for (let i = 0; i < this.renderPipelines.length; i++) {
            this.renderPipelines[i].destroy();
        }
        this.renderPipelines = [];
        for (let z in this) {
            this[z] = null;
        }
    }
    update() {
        if (!XGPU.ready || this.renderPipelines.length === 0 || this.deviceId === undefined)
            return;
        //console.log(XGPU.deviceId + " VS " + this.deviceId);
        let deviceChanged = XGPU.deviceId != this.deviceId;
        if (deviceChanged) {
            if (this.textureObj)
                this.textureObj.create();
            this.deviceId = XGPU.deviceId;
            for (let i = 0; i < this.renderPipelines.length; i++) {
                this.renderPipelines[i].clearAfterDeviceLostAndRebuild();
            }
        }
        const commandEncoder = XGPU.device.createCommandEncoder();
        //console.log("nbPipeline = ", this.renderPipelines.length)
        let pipeline, renderPass;
        for (let i = 0; i < this.renderPipelines.length; i++) {
            pipeline = this.renderPipelines[i];
            pipeline.update();
            for (let j = 0; j < pipeline.pipelineCount; j++) {
                renderPass = pipeline.beginRenderPass(commandEncoder, this.view, j);
                if (pipeline.onDraw)
                    pipeline.onDraw(j);
                pipeline.draw(renderPass);
                pipeline.end(commandEncoder, renderPass);
            }
        }
        XGPU.device.queue.submit([commandEncoder.finish()]);
        this.canvas.dimensionChanged = false;
    }
    get dimensionChanged() { return this.dimension.dimensionChanged; }
    get canvas() { return this.dimension; }
    get width() { return this.dimension.width; }
    get height() { return this.dimension.height; }
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
