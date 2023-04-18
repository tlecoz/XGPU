/// <reference types="dist" />
import { ComputeShader } from "../shader/ComputeShader";
import { VertexBuffer } from "../shader/resources/VertexBuffer";
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
    protected canCallMapAsync: boolean;
    protected bufferIOs: VertexBuffer[];
    protected textureIOs: ImageTexture[];
    private checkedBufferIO;
    private checkedTextureIO;
    constructor();
    set useRenderPipeline(b: boolean);
    initFromObject(descriptor: {
        bindgroups?: any;
        computeShader: {
            outputs?: any;
            main: string;
            inputs: any;
            code?: string;
        };
    }): {
        bindgroups?: any;
        computeShader: {
            outputs?: any;
            main: string;
            inputs: any;
            code?: string;
        };
    };
    setWorkgroups(x: number, y?: number, z?: number): void;
    setDispatchWorkgroup(x?: number, y?: number, z?: number): void;
    protected cleanInputsAndInitBufferIO(): any[];
    update(): void;
    buildGpuPipeline(): GPUComputePipeline;
    nextFrame(): Promise<void>;
}
