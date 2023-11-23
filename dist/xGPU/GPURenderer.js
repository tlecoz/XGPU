// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { BuiltIns } from "./BuiltIns";
import { EventDispatcher } from "./EventDispatcher";
import { XGPU } from "./XGPU";
import { RenderPipeline } from "./pipelines/RenderPipeline";
import { ImageTexture } from "./shader/resources/ImageTexture";
import { TextureSampler } from "./shader/resources/TextureSampler";
export class GPURenderer extends EventDispatcher {
    static ON_DRAW_END = "ON_DRAW_END";
    domElement;
    canvasView;
    ctx;
    currentWidth;
    currentHeight;
    dimensionChanged = false;
    deviceId;
    frameId = 0;
    nbColorAttachment = 0;
    renderPipelines = [];
    static texturedQuadPipeline;
    texturedQuadPipeline;
    constructor() {
        super();
        if (!GPURenderer.texturedQuadPipeline) {
            GPURenderer.texturedQuadPipeline = new RenderPipeline();
            GPURenderer.texturedQuadPipeline.initFromObject({
                vertexCount: 6,
                vertexId: BuiltIns.vertexInputs.vertexIndex,
                image: new ImageTexture({ source: null }),
                imgSampler: new TextureSampler(),
                uv: BuiltIns.vertexOutputs.Vec2,
                vertexShader: {
                    constants: `
                    const pos = array<vec2<f32>([
                        vec2(-0.5,-0.5),
                        vec2(+0.5,-0.5),
                        vec2(-0.5,+0.5),
                        vec2(+0.5,-0.5),
                        vec2(+0.5,+0.5),
                        vec2(-0.5,+0.5),
                    ]);
                    `,
                    main: `
                    output.position = vec4(pos[vertexId],0.0,1.0);
                    output.uv = 0.5 + output.position.xy;
                    `
                },
                fragmentShader: `
                    output.color = textureSample(image,imgSampler,uv);
                `,
            });
        }
        this.texturedQuadPipeline = GPURenderer.texturedQuadPipeline;
    }
    resize(w, h) {
        this.domElement.width = w;
        this.domElement.height = h;
        this.dimensionChanged = true;
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
    gpuCtxConfiguration;
    initCanvas(canvas, alphaMode = "opaque") {
        this.domElement = canvas;
        return new Promise(async (resolve, error) => {
            await XGPU.init();
            this.deviceId = XGPU.deviceId;
            if (this.domElement == null)
                return;
            this.currentWidth = this.domElement.width;
            this.currentHeight = this.domElement.height;
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
    get resized() { return this.dimensionChanged; }
    get firstPipeline() { return this.renderPipelines[0]; }
    get texture() { return this.ctx.getCurrentTexture(); }
    get view() { return this.ctx.getCurrentTexture().createView(); }
    get width() { return this.domElement.width; }
    get height() { return this.domElement.height; }
    get canvas() { return this.domElement; }
    addPipeline(pipeline, offset = null) {
        pipeline.renderer = this;
        if (pipeline.renderPassDescriptor.colorAttachments[0])
            this.nbColorAttachment++;
        if (offset === null)
            this.renderPipelines.push(pipeline);
        else
            this.renderPipelines.splice(offset, 0, pipeline);
        return pipeline;
    }
    removePipeline(pipeline) {
        if (pipeline.renderPassDescriptor.colorAttachments[0])
            this.nbColorAttachment--;
        const id = this.renderPipelines.indexOf(pipeline);
        if (id != -1) {
            this.renderPipelines.splice(id, 1);
        }
        pipeline.renderer = null;
        return pipeline;
    }
    get nbPipeline() { return this.renderPipelines.length; }
    get useSinglePipeline() { return this.nbColorAttachment === 1; }
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
    commandEncoder = null;
    async update() {
        if (!this.ctx)
            return;
        if (!XGPU.ready || this.renderPipelines.length === 0 || this.deviceId === undefined)
            return;
        if (XGPU.deviceId != this.deviceId) {
            this.ctx.configure({ ...this.gpuCtxConfiguration, device: XGPU.device });
        }
        if (this.canvas.width != this.currentWidth || this.canvas.height != this.currentHeight) {
            this.currentWidth = this.canvas.width;
            this.currentHeight = this.canvas.height;
            this.dimensionChanged = true;
        }
        let deviceChanged = XGPU.deviceId != this.deviceId;
        if (deviceChanged) {
            this.deviceId = XGPU.deviceId;
            for (let i = 0; i < this.renderPipelines.length; i++) {
                this.renderPipelines[i].clearAfterDeviceLostAndRebuild();
            }
        }
        this.commandEncoder = XGPU.device.createCommandEncoder();
        let pipeline, renderPass;
        for (let i = 0; i < this.renderPipelines.length; i++) {
            pipeline = this.renderPipelines[i];
            pipeline.update();
            renderPass = pipeline.beginRenderPass(this.commandEncoder, this.view, 0);
            for (let j = 0; j < pipeline.pipelineCount; j++) {
                pipeline.dispatchEvent(RenderPipeline.ON_DRAW, j);
                pipeline.draw(renderPass);
            }
            pipeline.end(this.commandEncoder, renderPass);
        }
        const commandBuffer = this.commandEncoder.finish();
        this.commandEncoder = null;
        XGPU.device.queue.submit([commandBuffer]);
        this.dimensionChanged = false;
        this.dispatchEvent(GPURenderer.ON_DRAW_END);
        this.frameId++;
    }
}
