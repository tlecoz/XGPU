/// <reference types="dist" />
import { RenderPipeline } from "./pipelines/RenderPipeline";
import { Texture } from "./pipelines/resources/textures/Texture";
import { IRenderer } from "./IRenderer";
export declare class HeadlessGPURenderer implements IRenderer {
    protected textureObj: Texture;
    protected dimension: {
        width: number;
        height: number;
        dimensionChanged: boolean;
    };
    protected renderPipelines: RenderPipeline[];
    protected useTextureInComputeShader: any;
    constructor(useTextureInComputeShader?: boolean);
    protected deviceId: number;
    init(w: number, h: number, usage?: number, sampleCount?: number): Promise<any>;
    get firstPipeline(): RenderPipeline;
    protected nbColorAttachment: number;
    addPipeline(pipeline: RenderPipeline, offset?: number): void;
    get nbPipeline(): number;
    get useSinglePipeline(): boolean;
    resize(w: number, h: number): void;
    destroy(): void;
    update(): void;
    get dimensionChanged(): boolean;
    get canvas(): {
        width: number;
        height: number;
        dimensionChanged: boolean;
    };
    get width(): number;
    get height(): number;
    get texture(): GPUTexture;
    get view(): GPUTextureView;
}
