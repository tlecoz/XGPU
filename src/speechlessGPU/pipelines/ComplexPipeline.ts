
import { GPURenderer } from "../GPURenderer";
import { RenderPipeline } from "./RenderPipeline";

export class ComplexPipeline extends RenderPipeline {

    public renderPipeline: RenderPipeline;
    public computePipeline: any;
    public gpuComputePipeline: GPUComputePipeline;

    constructor(renderer: GPURenderer, bgColor?: { r: number, g: number, b: number, a: number }) {
        super(renderer, bgColor);
        //this.computePipeline = new ComputePipeline();
        this.renderPipeline = new RenderPipeline(renderer, bgColor);
    }


}