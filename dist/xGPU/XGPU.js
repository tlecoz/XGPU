// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { BuiltIns } from "./BuiltIns";
import { Float, Int, IVec2, IVec3, IVec4, IVec4Array, Matrix3x3, Matrix4x4, Matrix4x4Array, Uint, UVec2, UVec3, UVec4, UVec4Array, Vec2, Vec3, Vec4, Vec4Array } from "./PrimitiveType";
import { UniformGroup } from "./shader/resources/UniformGroup";
import { UniformGroupArray } from "./shader/resources/UniformGroupArray";
import { WebGPUProperties } from "./WebGPUProperties";
export class XGPU {
    static showVertexShader = false;
    static showFragmentShader = false;
    static showComputeShader = false;
    static showVertexDebuggerShader = false;
    static _ready = false;
    static get ready() { return this._ready; }
    static gpuDevice;
    static debugUsage(usage) {
        return WebGPUProperties.getBufferUsageById(usage);
    }
    static debugTextureUsage(usage) {
        return WebGPUProperties.getTextureUsageById(usage);
    }
    static debugShaderStage(n) {
        return WebGPUProperties.getShaderStageById(n);
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
    static getTransferableUniforms(uniforms) {
        let def;
        let o;
        const transferables = [];
        const items = {};
        for (let z in uniforms) {
            o = uniforms[z];
            o.name = z;
            def = o.definition;
            items[z] = def;
            console.log("type ======> ", o.type);
            if (def.type == "UniformGroup") {
                if (transferables.includes(def.values) == false) {
                    transferables.push(def.values);
                }
            }
            else if (def.type == "UniformGroupArray") {
                let groups = def.groups;
                for (let i = 0; i < groups.length; i++) {
                    if (transferables.includes(groups[i].values) == false) {
                        transferables.push(groups[i].values);
                    }
                }
            }
            else if (def.values.buffer) {
                if (transferables.includes(def.values.buffer) == false) {
                    transferables.push(def.values.buffer);
                }
            }
        }
        return {
            items,
            transferables
        };
    }
    /*
    export type TransferableUniforms = {
    items:{name:string,type:string,values:any,groups?:any,items?:any};
    transferables:ArrayBuffer[]
}
    */
    static parseTransferableUniform(uniforms) {
        const parsePrimitive = (o) => {
            if (o.type == "Float")
                return new Float(o.values[0]);
            if (o.type == "Vec2")
                return new Vec2(o.values[0], o.values[1]);
            if (o.type == "Vec3")
                return new Vec3(o.values[0], o.values[1], o.values[2]);
            if (o.type == "Vec4")
                return new Vec4(o.values[0], o.values[1], o.values[2], o.values[3]);
            if (o.type == "Int")
                return new Int(o.values[0]);
            if (o.type == "IVec2")
                return new IVec2(o.values[0], o.values[1]);
            if (o.type == "IVec3")
                return new IVec3(o.values[0], o.values[1], o.values[2]);
            if (o.type == "IVec4")
                return new IVec4(o.values[0], o.values[1], o.values[2], o.values[3]);
            if (o.type == "Uint")
                return new Uint(o.values[0]);
            if (o.type == "UVec2")
                return new UVec2(o.values[0], o.values[1]);
            if (o.type == "UVec3")
                return new UVec3(o.values[0], o.values[1], o.values[2]);
            if (o.type == "UVec4")
                return new UVec4(o.values[0], o.values[1], o.values[2], o.values[3]);
            if (o.type == "Matrix4x4") {
                return new Matrix4x4(o.values);
            }
            if (o.type == "Matrix3x3") {
                return new Matrix3x3(o.values);
            }
            if (o.type == "Vec4Array") {
                const array = new Vec4Array(o.values.length / 4);
                array.set(o.values);
                return array;
            }
            if (o.type == "IVec4Array") {
                const array = new IVec4Array(o.values.length / 4);
                array.set(o.values);
                return array;
            }
            if (o.type == "UVec4Array") {
                const array = new UVec4Array(o.values.length / 4);
                array.set(o.values);
                return array;
            }
            if (o.type == "Matrix4x4Array") {
                const array = new Matrix4x4Array(o.values.length / 16);
                array.set(o.values);
                return array;
            }
            throw new Error("incorrect type");
        };
        const parseObject = (o) => {
            let result = {};
            let item;
            for (let z in o.items) {
                item = o.items[z];
                if (item.type == "UniformGroup") {
                    result[z] = parseUniformGroup(item);
                }
                else if (item.type == "UniformGroupArray") {
                    result[z] = parseUniformGroupArray(item);
                }
                else {
                    result[z] = parsePrimitive(item);
                }
            }
            return result;
        };
        const parseUniformGroup = (o) => {
            let result = {};
            let item;
            for (let z in o.items) {
                item = o.items[z];
                if (item.type == "UniformGroup") {
                    result[z] = parseUniformGroup(item);
                }
                else if (item.type == "UniformGroupArray") {
                    result[z] = parseUniformGroupArray(item);
                }
                else {
                    result[z] = parsePrimitive(item);
                }
            }
            return new UniformGroup(result);
        };
        const parseUniformGroupArray = (o) => {
            let result = [];
            for (let i = 0; i < o.groups.length; i++) {
                result[i] = parseUniformGroup(o.groups[i]);
            }
            return new UniformGroupArray(result);
        };
        return parseObject(uniforms);
    }
    static init(options) {
        this.requestAdapterOptions = options;
        BuiltIns.__initDebug();
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
                await WebGPUProperties.init();
                this.debugUsage(172);
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
