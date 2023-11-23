/// <reference types="dist" />
import { RenderPipeline } from "./pipelines/RenderPipeline";
export interface IRenderer {
    addPipeline(pipeline: RenderPipeline, offset?: number): void;
    resize(w: number, h: number): any;
    destroy(): void;
    update(): void;
    get renderPipelines(): RenderPipeline[];
    get canvas(): HTMLCanvasElement;
    get resized(): boolean;
    get width(): number;
    get height(): number;
    get texture(): GPUTexture;
    get view(): GPUTextureView;
    get frameId(): number;
    get commandEncoder(): GPUCommandEncoder;
}
