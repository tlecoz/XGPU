// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
export class XGPU {
    static debugShaders = false;
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
            return "GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_SRC";
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
    static requestAdapterOptions;
    static losingDevice = false;
    static deviceLost = false;
    static deviceLostTime;
    static deviceId = -1;
    static loseDevice() {
        this.losingDevice = true;
        this.gpuDevice.destroy();
    }
    static clear() {
        this.gpuDevice.destroy();
    }
    static get loseDeviceRecently() {
        //console.log("delay = ", new Date().getTime() - this.deviceLostTime)
        return new Date().getTime() - this.deviceLostTime <= 3000;
    }
    static init(options) {
        this.requestAdapterOptions = options;
        console.log("INIT");
        return new Promise(async (resolve, error) => {
            if (this.gpuDevice) {
                resolve(this);
                return;
            }
            const adapter = await navigator.gpu.requestAdapter(options);
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
                });
                this._ready = true;
                resolve(this);
            }
            else {
                error();
            }
        });
    }
    static get device() {
        if (this.deviceLost)
            return null;
        if (!this.gpuDevice && !this.ready)
            throw new Error("you must use XGPU.init() to get the reference of the gpuDevice");
        return this.gpuDevice;
    }
    static _preferedCanvasFormat;
    static getPreferredCanvasFormat() {
        if (!this._preferedCanvasFormat)
            this._preferedCanvasFormat = navigator.gpu.getPreferredCanvasFormat();
        //console.warn("getPreferedCanvasFormat = ", this._preferedCanvasFormat)
        return this._preferedCanvasFormat;
    }
    static setPreferredCanvasFormat(format) {
        this._preferedCanvasFormat = format;
    }
    static destroy() {
        if (this.gpuDevice) {
            this.gpuDevice.destroy();
            this.gpuDevice = null;
            this._ready = false;
        }
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
