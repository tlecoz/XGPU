import { SLGPU } from "./SLGPU";
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
        return new Promise((resolve: (e: HTMLCanvasElement) => void, error: (e: unknown) => void) => {
            SLGPU.init().then(() => {

                this.domElement = canvas;
                this.ctx = this.domElement.getContext("webgpu");

                if (!this.ctx.configure) error(null);
                this.ctx.configure({
                    device: SLGPU.device,
                    format: SLGPU.getPreferredCanvasFormat(),
                    alphaMode: alphaMode,
                    colorSpace: "srgb",
                    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
                })
                resolve(canvas);
            });
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

    public get canvas(): HTMLCanvasElement { return this.domElement; }
    public get texture(): GPUTexture { return this.ctx.getCurrentTexture() }

    public get width(): number { return this.canvas.width }
    public get height(): number { return this.canvas.height }


    public configure(textureUsage: GPUTextureUsageFlags = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC, alphaMode: "opaque" | "premultiplied" = "opaque") {
        this.ctx.configure({
            device: SLGPU.device,
            format: SLGPU.getPreferredCanvasFormat(),
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

    public get useSinglePipeline(): boolean { return this.nbColorAttachment === 1 }

    public update() {
        if (!SLGPU.ready || this.renderPipelines.length === 0) return;
        if (this.canvas.width != this.canvasW || this.canvas.height != this.canvasH) {
            this.canvasW = this.canvas.width;
            this.canvasH = this.canvas.height;
            (this.canvas as any).dimensionChanged = true;
        }

        const commandEncoder = SLGPU.device.createCommandEncoder();
        const textureView = this.ctx.getCurrentTexture().createView();

        let pipeline: RenderPipeline, renderPass;

        for (let i = 0; i < this.renderPipelines.length; i++) {
            pipeline = this.renderPipelines[i];

            renderPass = pipeline.beginRenderPass(commandEncoder, textureView);


            pipeline.update()
            pipeline.draw(renderPass);





            pipeline.end(commandEncoder, renderPass);


        }



        SLGPU.device.queue.submit([commandEncoder.finish()]);

        (this.canvas as any).dimensionChanged = false;
    }
}