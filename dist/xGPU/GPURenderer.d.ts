/// <reference types="dist" />
import { HeadlessGPURenderer } from "./HeadlessGPURenderer";
import { IRenderer } from "./IRenderer";
export declare class GPURenderer extends HeadlessGPURenderer implements IRenderer {
    protected domElement: HTMLCanvasElement;
    protected ctx: GPUCanvasContext;
    protected canvasW: number;
    protected canvasH: number;
    constructor(useTextureInComputeShader?: boolean);
    protected gpuCtxConfiguration: any;
    initCanvas(canvas: HTMLCanvasElement, alphaMode?: "opaque" | "premultiplied"): Promise<HTMLCanvasElement>;
    get canvas(): {
        width: number;
        height: number;
        dimensionChanged: boolean;
    };
    get texture(): GPUTexture;
    get width(): number;
    get height(): number;
    get dimensionChanged(): boolean;
    get view(): GPUTextureView;
    configure(textureUsage?: GPUTextureUsageFlags, alphaMode?: "opaque" | "premultiplied"): void;
    update(): void;
}
