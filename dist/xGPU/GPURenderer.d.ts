/// <reference types="dist" />
import { EventDispatcher } from "./EventDispatcher";
import { IRenderer } from "./IRenderer";
import { RenderPipeline } from "./pipelines/RenderPipeline";
export declare class GPURenderer extends EventDispatcher implements IRenderer {
    static ON_DRAW_END: string;
    protected domElement: HTMLCanvasElement;
    protected canvasView: GPUTextureView;
    protected ctx: GPUCanvasContext;
    protected currentWidth: number;
    protected currentHeight: number;
    protected dimensionChanged: boolean;
    protected deviceId: number;
    frameId: number;
    protected nbColorAttachment: number;
    renderPipelines: RenderPipeline[];
    private static texturedQuadPipeline;
    protected texturedQuadPipeline: any;
    constructor();
    resize(w: number, h: number): void;
    destroy(): void;
    protected gpuCtxConfiguration: any;
    initCanvas(canvas: HTMLCanvasElement, alphaMode?: "opaque" | "premultiplied"): Promise<HTMLCanvasElement>;
    get resized(): boolean;
    get firstPipeline(): RenderPipeline;
    get texture(): GPUTexture;
    get view(): GPUTextureView;
    get width(): number;
    get height(): number;
    get canvas(): HTMLCanvasElement;
    addPipeline(pipeline: RenderPipeline, offset?: number): RenderPipeline;
    removePipeline(pipeline: RenderPipeline): RenderPipeline;
    get nbPipeline(): number;
    get useSinglePipeline(): boolean;
    configure(textureUsage?: GPUTextureUsageFlags, alphaMode?: "opaque" | "premultiplied"): void;
    commandEncoder: GPUCommandEncoder;
    update(): Promise<void>;
}
