import { GPURenderer } from "../GPURenderer";
import { ComputePipeline } from "./ComputePipeline";
import { RenderPipeline } from "./RenderPipeline";
export declare class MixedPipeline extends RenderPipeline {
    protected _computePipeline: ComputePipeline;
    constructor(renderer: GPURenderer, bgColor?: {
        r: number;
        g: number;
        b: number;
        a: number;
    });
    get computePipeline(): ComputePipeline;
    buildPipelines(): void;
}
