export class GPU {

    private static _ready: boolean = false;
    public static get ready(): boolean { return this._ready; }

    protected static gpuDevice: GPUDevice;

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
        console.warn("createBindgroupLayout ", o)
        return this.device.createBindGroupLayout(o);
    }

    public static createPipelineLayout(o: any): GPUPipelineLayout {
        return this.device.createPipelineLayout(o);
    }

    public static createRenderPipeline(o: any): GPURenderPipeline {
        return this.device.createRenderPipeline(o);
    }

}