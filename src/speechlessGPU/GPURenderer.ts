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
    public initCanvas(w: number, h: number, useAlphaChannel: boolean = true): Promise<HTMLCanvasElement> {

        return new Promise((onResolve: (val: any) => void, onError: (val?: any) => void) => {

            SLGPU.init().then(() => {

                this.domElement = document.createElement("canvas");

                this.ctx = this.domElement.getContext("webgpu");

                const devicePixelRatio = window.devicePixelRatio || 1;
                this.canvasW = this.domElement.width = w * devicePixelRatio;
                this.canvasH = this.domElement.height = h * devicePixelRatio;

                let alphaMode: "opaque" | "premultiplied" = "opaque";
                if (useAlphaChannel) alphaMode = "premultiplied";

                if (!this.ctx.configure) onError(null);
                this.ctx.configure({
                    device: SLGPU.device,
                    format: SLGPU.getPreferredCanvasFormat(),
                    alphaMode: alphaMode,
                    colorSpace: "srgb",
                    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
                })
                onResolve(this.canvas);

            })
        });
    }

    public get firstPipeline(): RenderPipeline { return this.renderPipelines[0]; }

    public get canvas(): HTMLCanvasElement { return this.domElement; }
    public get texture(): GPUTexture { return this.ctx.getCurrentTexture() }

    public configure(textureUsage: GPUTextureUsageFlags = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC, alphaMode: "opaque" | "premultiplied" = "opaque") {
        this.ctx.configure({
            device: SLGPU.device,
            format: SLGPU.getPreferredCanvasFormat(),
            alphaMode: alphaMode,
            colorSpace: "srgb",
            usage: textureUsage
        })
    }

    public addPipeline(pipeline: RenderPipeline) {
        this.renderPipelines.push(pipeline);
    }

    public get useSinglePipeline(): boolean { return this.renderPipelines.length === 1 }

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