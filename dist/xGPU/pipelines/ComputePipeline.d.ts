/// <reference types="dist" />
import { ComputeShader } from "../shader/ComputeShader";
import { ImageTextureIO } from "../shader/resources/ImageTextureIO";
import { VertexBuffer } from "../shader/resources/VertexBuffer";
import { VertexBufferIO } from "../shader/resources/VertexBufferIO";
import { Pipeline } from "./Pipeline";
import { ImageTexture } from "../shader/resources/ImageTexture";
export declare class ComputePipeline extends Pipeline {
    static ON_COMPUTE_SHADER_CODE_BUILT: string;
    static ON_COMPUTE_BEGIN: string;
    static ON_COMPUTE_END: string;
    static ON_GPU_PIPELINE_BUILT: string;
    static ON_INIT_FROM_OBJECT: string;
    static ON_DESTROY: string;
    static ON_DEVICE_LOST: string;
    static ON_UPDATE_RESOURCES: string;
    static ON_SUBMIT_QUEUE: string;
    computeShader: ComputeShader;
    protected gpuComputePipeline: GPUComputePipeline;
    workgroups: number[];
    protected dispatchWorkgroup: number[];
    protected bufferSize: number;
    protected textureSize: number[];
    protected stagingBuffer: GPUBuffer;
    protected bufferIOs: VertexBuffer[];
    protected textureIOs: ImageTexture[];
    onComputeBegin: () => void;
    onComputeEnd: () => void;
    onShaderBuild: (shaderInfos: {
        code: string;
    }) => void;
    constructor();
    set useRenderPipeline(b: boolean);
    initFromObject(descriptor: {
        bindgroups?: any;
        computeShader: {
            outputs?: any;
            main: string;
            inputs?: any;
            constants?: string;
        } | string | ComputeShader;
        [key: string]: unknown;
    }): {
        [key: string]: unknown;
        bindgroups?: any;
        computeShader: {
            outputs?: any;
            main: string;
            inputs?: any;
            constants?: string;
        } | string | ComputeShader;
    };
    destroy(): void;
    setWorkgroups(x: number, y?: number, z?: number): void;
    setDispatchWorkgroup(x?: number, y?: number, z?: number): void;
    protected vertexBufferIOs: VertexBufferIO[];
    protected imageTextureIOs: ImageTextureIO[];
    protected resourceIOs: (VertexBufferIO | ImageTextureIO)[];
    protected nbVertexMax: number;
    protected widthMax: number;
    protected heightMax: number;
    protected initResourceIOs(): void;
    protected deviceId: number;
    protected lastFrameTime: number;
    update(): void;
    protected setupDefaultWorkgroups(): void;
    protected rebuildingAfterDeviceLost: boolean;
    clearAfterDeviceLostAndRebuild(): void;
    buildGpuPipeline(): GPUComputePipeline;
    private firstFrame;
    private processingFirstFrame;
    private waitingFrame;
    nextFrame(): Promise<void>;
}
