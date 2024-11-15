/// <reference types="dist" />
import { Uniformable } from "./shader/resources/UniformGroup";
export type TransferableUniforms = {
    items: {
        name: string;
        type: string;
        values: any;
        groups?: any;
        items?: any;
    };
    transferables: ArrayBuffer[];
};
export declare class XGPU {
    static showVertexShader: boolean;
    static showFragmentShader: boolean;
    static showComputeShader: boolean;
    static showVertexDebuggerShader: boolean;
    private static _ready;
    static get ready(): boolean;
    protected static gpuDevice: GPUDevice;
    static debugUsage(usage: number): string;
    static debugTextureUsage(usage: number): string;
    static debugShaderStage(n: number): string;
    constructor();
    private static requestAdapterOptions;
    private static losingDevice;
    static deviceLost: boolean;
    private static deviceLostTime;
    static deviceId: number;
    static loseDevice(): void;
    static clear(): void;
    static get loseDeviceRecently(): boolean;
    static getTransferableUniforms(uniforms: {
        [key: string]: Uniformable;
    }): TransferableUniforms;
    static parseTransferableUniform(uniforms: TransferableUniforms): {
        [key: string]: Uniformable;
    };
    static init(options?: {
        powerPreference?: "low-power" | "high-performance";
        forceFallbackAdaoter?: boolean;
    }): Promise<void>;
    static get device(): GPUDevice;
    private static _preferedCanvasFormat;
    static getPreferredCanvasFormat(): GPUTextureFormat;
    static setPreferredCanvasFormat(format: GPUTextureFormat): void;
    static destroy(): void;
    static createBindgroup(o: any): GPUBindGroup;
    static createBindgroupLayout(o: any): GPUBindGroupLayout;
    static createPipelineLayout(o: any): GPUPipelineLayout;
    static createRenderPipeline(o: any): GPURenderPipeline;
    static createComputePipeline(o: any): GPUComputePipeline;
    static createStagingBuffer(size: number): GPUBuffer;
}
