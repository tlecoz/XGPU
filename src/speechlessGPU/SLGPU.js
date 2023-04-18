export class SLGPU {
    static _ready = false;
    static get ready() { return this._ready; }
    static gpuDevice;
    static debugUsage(usage) {
        if (usage === 128)
            return "GPUBufferUsage.STORAGE";
        else if (usage === 8)
            return "GPUBufferUsage.COPY_DST";
        else if (usage === 32)
            return "GPUBufferUsage.VERTEX";
        else if (usage == 136)
            return "GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST";
        else if (usage === 168)
            return "GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX";
        else if (usage === 4)
            return "GPUBufferUsage.COPY_SRC";
        else if (usage === 132)
            return "GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC";
        else if (usage === 40)
            return "GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST";
        else if (usage === 140)
            return "GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST";
        else if (usage === 172)
            return "";
        return "";
    }
    static debugShaderStage(n) {
        if (n === GPUShaderStage.COMPUTE)
            return "GPUShaderStage.COMPUTE";
        else if (n === GPUShaderStage.VERTEX)
            return "GPUShaderStage.VERTEX";
        else if (n === GPUShaderStage.FRAGMENT)
            return "GPUShaderStage.FRAGMENT";
        return "";
    }
    constructor() {
        throw new Error("GPU is static and can't be instanciated");
    }
    static init() {
        return new Promise(async (resolve, error) => {
            if (this.gpuDevice) {
                resolve(this);
                return;
            }
            const adapter = await navigator.gpu.requestAdapter({
                powerPreference: "high-performance",
                forceFallbackAdapter: false
            });
            if (adapter) {
                this.gpuDevice = await adapter.requestDevice();
                this._ready = true;
                resolve(this);
            }
            else {
                error();
            }
        });
    }
    static get device() {
        if (!this.gpuDevice)
            throw new Error("you must use SLGPU.init() to get the reference of the gpuDevice");
        return this.gpuDevice;
    }
    static getPreferredCanvasFormat() {
        return navigator.gpu.getPreferredCanvasFormat();
    }
    static createBindgroup(o) {
        return this.device.createBindGroup(o);
    }
    static createBindgroupLayout(o) {
        return this.device.createBindGroupLayout(o);
    }
    static createPipelineLayout(o) {
        return this.device.createPipelineLayout(o);
    }
    static createRenderPipeline(o) {
        return this.device.createRenderPipeline(o);
    }
    static createComputePipeline(o) {
        return this.device.createComputePipeline(o);
    }
    static createStagingBuffer(size) {
        return this.device.createBuffer({
            size,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            mappedAtCreation: false
        });
    }
}
