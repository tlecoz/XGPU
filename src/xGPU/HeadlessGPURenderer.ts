import { XGPU } from "./XGPU";
import { RenderPipeline } from "./pipelines/RenderPipeline";
import { Texture } from "./pipelines/resources/textures/Texture";

export class HeadlessGPURenderer {

    protected textureObj: Texture
    protected dimension: { width: number, height: number, dimensionChanged: boolean };
    protected renderPipelines: RenderPipeline[] = [];

    constructor() {

    }

    public init(w: number, h: number, usage?: number, sampleCount?: number) {
        this.dimension = { width: w, height: h, dimensionChanged: true };
        return new Promise((onResolve: (val: any) => void) => {

            XGPU.init().then(() => {


                if (!usage) usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC;

                this.textureObj = new Texture({
                    size: [w, h],
                    format: "bgra8unorm",
                    usage,
                    sampleCount
                })
                this.textureObj.create();

                onResolve(this);
            });

        });


    }

    public get firstPipeline(): RenderPipeline { return this.renderPipelines[0]; }

    protected nbColorAttachment: number = 0;

    public addPipeline(pipeline: RenderPipeline, offset: number = null) {

        if (offset === null) this.renderPipelines.push(pipeline);
        else this.renderPipelines.splice(offset, 0, pipeline)


        if (pipeline.renderPassDescriptor.colorAttachments[0]) this.nbColorAttachment++;
    }

    public get useSinglePipeline(): boolean { return this.nbColorAttachment === 1 }

    public resize(w: number, h: number) {
        this.dimension.width = w;
        this.dimension.height = h;
        this.dimension.dimensionChanged = true;
        this.textureObj.resize(w, h);
    }

    public update() {
        if (!XGPU.ready || this.renderPipelines.length === 0) return;

        const commandEncoder = XGPU.device.createCommandEncoder();

        let pipeline: RenderPipeline, renderPass;
        for (let i = 0; i < this.renderPipelines.length; i++) {
            pipeline = this.renderPipelines[i];
            renderPass = pipeline.beginRenderPass(commandEncoder, this.view);
            pipeline.update();
            pipeline.draw(renderPass);
            pipeline.end(commandEncoder, renderPass);
        }

        XGPU.device.queue.submit([commandEncoder.finish()]);

        this.dimension.dimensionChanged = false;
    }


    public get canvas(): { width: number, height: number } { return this.dimension; }
    public get width(): number { return this.canvas.width }
    public get height(): number { return this.canvas.height }

    public get texture(): GPUTexture {
        if (!this.textureObj) throw new Error("HeadlessGPURenderer is not initialized yet. You must Use HeadlessGPURenderer.init in order to initialize it")
        return this.textureObj.gpuResource;
    }
    public get view(): GPUTextureView {
        if (!this.textureObj) throw new Error("HeadlessGPURenderer is not initialized yet. You must Use HeadlessGPURenderer.init in order to initialize it")
        return this.textureObj.view;
    }



}