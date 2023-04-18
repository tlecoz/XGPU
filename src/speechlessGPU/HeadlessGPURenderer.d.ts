/// <reference types="dist" />
import { RenderPipeline } from "./pipelines/RenderPipeline";
import { Texture } from "./pipelines/resources/textures/Texture";
export declare class HeadlessGPURenderer {
    protected textureObj: Texture;
    protected dimension: {
        width: number;
        height: number;
        dimensionChanged: boolean;
    };
    protected renderPipelines: RenderPipeline[];
    constructor();
    init(w: number, h: number, usage?: number, sampleCount?: number): Promise<any>;
    get firstPipeline(): RenderPipeline;
    protected nbColorAttachment: number;
    addPipeline(pipeline: RenderPipeline, offset?: number): void;
    get useSinglePipeline(): boolean;
    resize(w: number, h: number): void;
    update(): void;
    get canvas(): {
        width: number;
        height: number;
    };
    get width(): number;
    get height(): number;
    get texture(): GPUTexture;
    get view(): GPUTextureView;
}
