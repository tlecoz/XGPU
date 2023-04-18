import { ComputePipeline } from "./ComputePipeline";
import { RenderPipeline } from "./RenderPipeline";
export class MixedPipeline extends RenderPipeline {
    _computePipeline;
    constructor(renderer, bgColor) {
        super(renderer, bgColor);
        this._computePipeline = new ComputePipeline();
        this._computePipeline.useRenderPipeline = true;
        this.type = "render";
    }
    get computePipeline() { return this._computePipeline; }
    buildPipelines() {
        //console.log("build compute")
        this._computePipeline.buildGpuPipeline();
        this._computePipeline.nextFrame();
        //console.log("build render")
        super.buildGpuPipeline();
    }
}
