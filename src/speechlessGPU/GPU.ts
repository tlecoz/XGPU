export class GPU {

    private static _ready: boolean = false;
    public static get ready(): boolean { return this._ready; }

    protected static gpuDevice: GPUDevice;

    public static debugUsage(usage: number) {

        if (usage === 128) return "GPUBufferUsage.STORAGE";
        else if (usage === 8) return "GPUBufferUsage.COPY_DST";
        else if (usage === 32) return "GPUBufferUsage.VERTEX";
        else if (usage == 136) return "GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST";
        else if (usage === 168) return "GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX";
        else if (usage === 4) return "GPUBufferUsage.COPY_SRC";
        else if (usage === 132) return "GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC";
        else if (usage === 40) return "GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST";
        else if (usage === 140) return "GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST";
        else if (usage === 172) return ""
    }

    public static debugShaderStage(n: number) {
        if (n === GPUShaderStage.COMPUTE) return "GPUShaderStage.COMPUTE"
        else if (n === GPUShaderStage.VERTEX) return "GPUShaderStage.VERTEX"
        else if (n === GPUShaderStage.FRAGMENT) return "GPUShaderStage.FRAGMENT"
    }


    constructor() {
        throw new Error("GPU is static and can't be instanciated")
    }

    public static init(): Promise<void> {
        return new Promise(async (resolve: (val: any) => void, error: () => void) => {
            const adapter = await navigator.gpu.requestAdapter({
                powerPreference: "high-performance",
                forceFallbackAdapter: false
            })
            if (adapter) {
                this.gpuDevice = await adapter.requestDevice()
                this._ready = true;
                resolve(this);
            } else {
                error()
            }
        })
    }

    public static get device(): GPUDevice {
        if (!this.gpuDevice) throw new Error("you must use GPU.init() to get the reference of the gpuDevice")
        return this.gpuDevice;
    }

    public static getPreferredCanvasFormat(): GPUTextureFormat {
        return navigator.gpu.getPreferredCanvasFormat();
    }


    public static createBindgroup(o: any): GPUBindGroup {
        return this.device.createBindGroup(o);
    }
    public static createBindgroupLayout(o: any): GPUBindGroupLayout {
        return this.device.createBindGroupLayout(o);
    }

    public static createPipelineLayout(o: any): GPUPipelineLayout {
        return this.device.createPipelineLayout(o);
    }

    public static createRenderPipeline(o: any): GPURenderPipeline {
        return this.device.createRenderPipeline(o);
    }
    public static createComputePipeline(o: any): GPUComputePipeline {
        return this.device.createComputePipeline(o);
    }

    public static createStagingBuffer(size: number): GPUBuffer {
        return this.device.createBuffer({
            size,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            mappedAtCreation: false
        })
    }
}