/// <reference types="dist" />
import { RenderPipeline } from "./pipelines/RenderPipeline";
export declare class GPURenderer {
    protected domElement: HTMLCanvasElement;
    protected ctx: GPUCanvasContext;
    protected canvasW: number;
    protected canvasH: number;
    protected renderPipelines: RenderPipeline[];
    constructor();
    initCanvas(w: number, h: number, useAlphaChannel?: boolean): Promise<HTMLCanvasElement>;
    get firstPipeline(): RenderPipeline;
    get canvas(): HTMLCanvasElement;
    get texture(): GPUTexture;
    get width(): number;
    get height(): number;
    configure(textureUsage?: GPUTextureUsageFlags, alphaMode?: "opaque" | "premultiplied"): void;
    protected nbColorAttachment: number;
    addPipeline(pipeline: RenderPipeline, offset?: number): void;
    get useSinglePipeline(): boolean;
    update(): void;
}
