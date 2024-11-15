// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.



import { BuiltIns } from "./BuiltIns";
import { EventDispatcher } from "./EventDispatcher";
import { IRenderer } from "./IRenderer";
import { XGPU } from "./XGPU";
import { RenderPipeline } from "./pipelines/RenderPipeline";
import { ImageTexture } from "./shader/resources/ImageTexture";
import { TextureSampler } from "./shader/resources/TextureSampler";

export class GPURenderer extends EventDispatcher implements IRenderer {


    public static ON_DRAW_END: string = "ON_DRAW_END";


    protected domElement: HTMLCanvasElement;
    protected canvasView: GPUTextureView;
    protected ctx: GPUCanvasContext;

    protected currentWidth: number;
    protected currentHeight: number;
    protected dimensionChanged: boolean = false;

    protected deviceId: number;
    public frameId: number = 0;
    protected nbColorAttachment: number = 0;
    public renderPipelines: RenderPipeline[] = [];


    private static texturedQuadPipeline: RenderPipeline;
    protected texturedQuadPipeline;
    constructor() {
        super();

        if (!GPURenderer.texturedQuadPipeline) {
            GPURenderer.texturedQuadPipeline = new RenderPipeline()
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
            })
        }

        this.texturedQuadPipeline = GPURenderer.texturedQuadPipeline;




    }

    public resize(w: number, h: number) {
        this.domElement.width = w;
        this.domElement.height = h;
        this.dimensionChanged = true;

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

    protected gpuCtxConfiguration: any;
    public initCanvas(canvas: HTMLCanvasElement, alphaMode: "opaque" | "premultiplied" = "opaque"): Promise<HTMLCanvasElement> {

        this.domElement = canvas;


        return new Promise(async (resolve: (e: HTMLCanvasElement) => void, error: (e: unknown) => void) => {
            await XGPU.init()
            this.deviceId = XGPU.deviceId;
            if (this.domElement == null) return

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
                this.ctx.configure(this.gpuCtxConfiguration)

                resolve(canvas)
            } catch (e) {
                error(e)
            }

        })
    }



    public get resized(): boolean { return this.dimensionChanged; }
    public get firstPipeline(): RenderPipeline { return this.renderPipelines[0]; }
    public get texture(): GPUTexture { return this.ctx.getCurrentTexture() }
    public get view(): GPUTextureView { return this.ctx.getCurrentTexture().createView(); }

    public get width(): number { return this.domElement.width }
    public get height(): number { return this.domElement.height }
    public get canvas(): HTMLCanvasElement { return this.domElement }
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
    public get nbPipeline(): number { return this.renderPipelines.length }
    public get useSinglePipeline(): boolean { return this.nbColorAttachment === 1 }

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



    public commandEncoder: GPUCommandEncoder = null;

    public async update() {
        if (!this.ctx) return;
        if (!XGPU.ready || this.renderPipelines.length === 0 || this.deviceId === undefined) return;


        if (XGPU.deviceId != this.deviceId) {
            this.ctx.configure({ ...this.gpuCtxConfiguration, device: XGPU.device })
        }

        if (this.canvas.width != this.currentWidth || this.canvas.height != this.currentHeight) {
            this.currentWidth = this.canvas.width;
            this.currentHeight = this.canvas.height;
            this.dimensionChanged = true;
        }






        let deviceChanged: boolean = XGPU.deviceId != this.deviceId;
        if (deviceChanged) {


            this.deviceId = XGPU.deviceId;
            for (let i = 0; i < this.renderPipelines.length; i++) {
                this.renderPipelines[i].clearAfterDeviceLostAndRebuild();
            }
        }

        this.commandEncoder = XGPU.device.createCommandEncoder();







        let pipeline: RenderPipeline, renderPass:GPURenderPassEncoder;
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


