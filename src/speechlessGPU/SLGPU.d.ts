/// <reference types="dist" />
export declare class SLGPU {
    private static _ready;
    static get ready(): boolean;
    protected static gpuDevice: GPUDevice;
    static debugUsage(usage: number): "GPUBufferUsage.STORAGE" | "GPUBufferUsage.COPY_DST" | "GPUBufferUsage.VERTEX" | "GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST" | "GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX" | "GPUBufferUsage.COPY_SRC" | "GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC" | "GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST" | "GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST" | "";
    static debugShaderStage(n: number): "" | "GPUShaderStage.COMPUTE" | "GPUShaderStage.VERTEX" | "GPUShaderStage.FRAGMENT";
    constructor();
    static init(): Promise<void>;
    static get device(): GPUDevice;
    static getPreferredCanvasFormat(): GPUTextureFormat;
    static createBindgroup(o: any): GPUBindGroup;
    static createBindgroupLayout(o: any): GPUBindGroupLayout;
    static createPipelineLayout(o: any): GPUPipelineLayout;
    static createRenderPipeline(o: any): GPURenderPipeline;
    static createComputePipeline(o: any): GPUComputePipeline;
    static createStagingBuffer(size: number): GPUBuffer;
}
