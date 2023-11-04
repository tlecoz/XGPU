// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

export class XGPU {




    public static debugShaders: boolean = false;
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
        else if (usage === 172) return "GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_SRC"

        return ""
    }

    public static debugShaderStage(n: number) {
        if (n === GPUShaderStage.COMPUTE) return "GPUShaderStage.COMPUTE"
        else if (n === GPUShaderStage.VERTEX) return "GPUShaderStage.VERTEX"
        else if (n === GPUShaderStage.FRAGMENT) return "GPUShaderStage.FRAGMENT"
        return ""
    }


    constructor() {
        throw new Error("GPU is static and can't be instanciated")
    }

    private static requestAdapterOptions: GPURequestAdapterOptions;
    private static losingDevice: boolean = false;


    public static deviceLost: boolean = false;
    private static deviceLostTime: number;

    public static deviceId: number = -1;

    public static loseDevice() {
        this.losingDevice = true;
        this.gpuDevice.destroy();
    }
    public static clear() {
        this.gpuDevice.destroy();
    }

    public static get loseDeviceRecently(): boolean {
        //console.log("delay = ", new Date().getTime() - this.deviceLostTime)
        return new Date().getTime() - this.deviceLostTime <= 3000;
    }



    public static init(options?: { powerPreference?: "low-power" | "high-performance", forceFallbackAdaoter?: boolean }): Promise<void> {
        this.requestAdapterOptions = options;

        return new Promise(async (resolve: (val: any) => void, error: () => void) => {

            if (this.gpuDevice) {
                resolve(this);
                return;
            }

            const adapter = await navigator.gpu.requestAdapter(options)
            if (adapter) {
                this.gpuDevice = await adapter.requestDevice();

                this.deviceId++;
                //console.log("get GPU device : ", this.deviceId)


                this.deviceLost = false;

                this.gpuDevice.lost.then((info) => {
                    console.clear();
                    console.error(`WebGPU device was lost: ${info.message}`);
                    this.gpuDevice = null;
                    this._ready = false;
                    this.deviceLost = true;
                    this.deviceLostTime = new Date().getTime();
                    if (this.losingDevice || info.reason != 'destroyed') {

                        this.losingDevice = false;
                        XGPU.init(this.requestAdapterOptions);
                    }
                })

                this._ready = true;
                resolve(this);
            } else {
                error()
            }
        })
    }

    public static get device(): GPUDevice {
        if (this.deviceLost) return null;
        if (!this.gpuDevice && !this.ready) throw new Error("you must use XGPU.init() to get the reference of the gpuDevice")
        return this.gpuDevice;
    }

    private static _preferedCanvasFormat: GPUTextureFormat;

    public static getPreferredCanvasFormat(): GPUTextureFormat {
        if (!this._preferedCanvasFormat) this._preferedCanvasFormat = navigator.gpu.getPreferredCanvasFormat();
        //console.warn("getPreferedCanvasFormat = ", this._preferedCanvasFormat)
        return this._preferedCanvasFormat;
    }

    public static setPreferredCanvasFormat(format: GPUTextureFormat) {
        this._preferedCanvasFormat = format;
    }

    public static destroy() {
        if (this.gpuDevice) {
            this.gpuDevice.destroy();
            this.gpuDevice = null;
            this._ready = false;
        }
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