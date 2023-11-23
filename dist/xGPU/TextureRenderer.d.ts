/// <reference types="dist" />
import { RenderPipeline } from "./pipelines/RenderPipeline";
import { Texture } from "./pipelines/resources/textures/Texture";
import { IRenderer } from "./IRenderer";
export declare class TextureRenderer implements IRenderer {
    protected textureObj: Texture;
    protected dimensionChanged: boolean;
    protected currentWidth: number;
    protected currentHeight: number;
    renderPipelines: RenderPipeline[];
    protected useTextureInComputeShader: any;
    frameId: number;
    constructor(useTextureInComputeShader?: boolean);
    protected deviceId: number;
    init(w: number, h: number, usage?: number, sampleCount?: number): Promise<any>;
    protected nbColorAttachment: number;
    addPipeline(pipeline: RenderPipeline, offset?: number): RenderPipeline;
    removePipeline(pipeline: RenderPipeline): RenderPipeline;
    resize(w: number, h: number): void;
    destroy(): void;
    commandEncoder: GPUCommandEncoder;
    update(): Promise<void>;
    get resized(): boolean;
    get canvas(): HTMLCanvasElement;
    get width(): number;
    get height(): number;
    get texture(): GPUTexture;
    get view(): GPUTextureView;
}
