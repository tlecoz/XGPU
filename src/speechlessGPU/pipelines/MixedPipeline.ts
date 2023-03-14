import { GPURenderer } from "../GPURenderer";
import { ComputePipeline } from "./ComputePipeline";
import { RenderPipeline } from "./RenderPipeline";

export class MixedPipeline extends RenderPipeline {

    protected _computePipeline: ComputePipeline;

    constructor(renderer: GPURenderer, bgColor?: { r: number, g: number, b: number, a: number }) {
        super(renderer, bgColor)
        this._computePipeline = new ComputePipeline();
        this._computePipeline.useRenderPipeline = true;
        this.type = "render";
    }

    public get computePipeline(): ComputePipeline { return this._computePipeline; }

    public buildPipelines() {
        //console.log("build compute")
        this._computePipeline.buildGpuPipeline();

        //console.log("build render")
        super.buildGpuPipeline();
    }


}