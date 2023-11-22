/*
import { XGPU } from "./XGPU";
import { RenderPipeline } from "./pipelines/RenderPipeline";

export class GPURendererV2 {




    
    protected canvas:HTMLCanvasElement;
    protected canvasView:GPUTextureView;
    protected ctx: GPUCanvasContext;

    protected currentWidth:number;
    protected currentHeight:number;
    protected dimensionChanged:boolean = false;
    
    protected deviceId:number;

    protected renderPipelines:RenderPipeline[] = [];

    protected texturedQuadPipeline:RenderPipeline;

    constructor(){

        this.texturedQuadPipeline = new RenderPipeline()


    }


    protected gpuCtxConfiguration: any;
    public initCanvas(canvas: HTMLCanvasElement, alphaMode: "opaque" | "premultiplied" = "opaque"): Promise<HTMLCanvasElement> {
        
        this.canvas = canvas;
        
        
        return new Promise(async (resolve: (e: HTMLCanvasElement) => void, error: (e: unknown) => void) => {
            await XGPU.init()
            this.deviceId = XGPU.deviceId;
            if (this.canvas == null) return

            this.currentWidth = this.canvas.width;
            this.currentHeight = this.canvas.height;

            try {
                this.gpuCtxConfiguration = {
                    device: XGPU.device,
                    format: XGPU.getPreferredCanvasFormat(),
                    alphaMode: alphaMode,
                    colorSpace: "srgb",
                    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING,
                };
                this.ctx = this.canvas.getContext("webgpu");
                this.ctx.configure(this.gpuCtxConfiguration)

                resolve(canvas)
            } catch (e) {
                error(e)
            }

        })
    }




   
    public get texture(): GPUTexture { return this.ctx.getCurrentTexture() }
    public get view(): GPUTextureView { return this.ctx.getCurrentTexture().createView(); }

    public get width(): number { return this.canvas.width }
    public get height(): number { return this.canvas.height }




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

            if (this.textureObj) this.textureObj.create();
            this.deviceId = XGPU.deviceId;
            for (let i = 0; i < this.renderPipelines.length; i++) {
                this.renderPipelines[i].clearAfterDeviceLostAndRebuild();
            }
        }

        const commandEncoder = XGPU.device.createCommandEncoder();


        let pipeline: RenderPipeline, renderPass;
        for (let i = 0; i < this.renderPipelines.length; i++) {
            pipeline = this.renderPipelines[i];
            pipeline.update();

            for (let j = 0; j < pipeline.pipelineCount; j++) {

                renderPass = pipeline.beginRenderPass(commandEncoder, this.view, j);
                if (pipeline.onDraw) pipeline.onDraw(j);
                pipeline.draw(renderPass);
                pipeline.end(commandEncoder, renderPass);
            }
        }

        const commandBuffer = commandEncoder.finish();

        XGPU.device.queue.submit([commandBuffer]);

        this.canvas.dimensionChanged = false;


        if (this.onDrawEnd) this.onDrawEnd();
        
    }

}*/