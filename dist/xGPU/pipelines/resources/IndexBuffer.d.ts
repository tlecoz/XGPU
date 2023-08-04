/// <reference types="dist" />
import { DrawConfig } from "./DrawConfig";
export type IndexBufferDescriptor = {
    nbPoint?: number;
    dataType?: "uint16" | "uint32";
    datas?: Uint16Array | Uint32Array;
    offset?: number;
};
export declare class IndexBuffer {
    gpuResource: GPUBuffer;
    descriptor: IndexBufferDescriptor;
    mustUpdateData: boolean;
    constructor(descriptor?: {
        nbPoint?: number;
        dataType?: "uint16" | "uint32";
        datas?: Uint16Array | Uint32Array;
        offset?: number;
    });
    destroyGpuResource(): void;
    createGpuResource(): void;
    getBufferSize(): number;
    get dataType(): GPUIndexFormat;
    get nbPoint(): number;
    set nbPoint(n: number);
    get offset(): number;
    set offset(n: number);
    private _datas;
    set datas(indices: Uint32Array | Uint16Array);
    updateDatas(indices: Uint32Array | Uint16Array, offset: number, len: number, extraBufferSize?: number): void;
    get datas(): Uint32Array | Uint16Array;
    update(): void;
    apply(renderPass: GPURenderPassEncoder, drawConfig: DrawConfig): void;
}
