/// <reference types="dist" />
import { ComputeShader } from "../shader/ComputeShader";
import { ImageTextureIO } from "../shader/resources/ImageTextureIO";
import { VertexBuffer } from "../shader/resources/VertexBuffer";
import { VertexBufferIO } from "../shader/resources/VertexBufferIO";
import { Pipeline } from "./Pipeline";
import { ImageTexture } from "../shader/resources/ImageTexture";
export declare class ComputePipeline extends Pipeline {
    computeShader: ComputeShader;
    onReceiveData: (datas: Float32Array) => void;
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
    constructor();
    set useRenderPipeline(b: boolean);
    initFromObject(descriptor: {
        bindgroups?: any;
        computeShader: {
            outputs?: any;
            main: string;
            inputs?: any;
            constants?: string;
        } | string;
        [key: string]: unknown;
    }): {
        [key: string]: unknown;
        bindgroups?: any;
        computeShader: {
            outputs?: any;
            main: string;
            inputs?: any;
            constants?: string;
        } | string;
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
