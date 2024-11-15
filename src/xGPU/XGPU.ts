// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { BuiltIns } from "./BuiltIns";
import { Float, Int, IVec2, IVec3, IVec4, IVec4Array, Matrix3x3, Matrix4x4, Matrix4x4Array, PrimitiveType, Uint, UVec2, UVec3, UVec4, UVec4Array, Vec2, Vec3, Vec4, Vec4Array } from "./PrimitiveType";
import { Uniformable, UniformGroup } from "./shader/resources/UniformGroup";
import { UniformGroupArray } from "./shader/resources/UniformGroupArray";
import { WebGPUProperties } from "./WebGPUProperties";


export type TransferableUniforms = {
    items:{name:string,type:string,values:any,groups?:any,items?:any};
    transferables:ArrayBuffer[]
} 

export class XGPU {


    public static showVertexShader: boolean = false;
    public static showFragmentShader: boolean = false;
    public static showComputeShader: boolean = false;
    public static showVertexDebuggerShader: boolean = false;

    private static _ready: boolean = false;
    public static get ready(): boolean { return this._ready; }

    protected static gpuDevice: GPUDevice;



    public static debugUsage(usage: number) {
        return WebGPUProperties.getBufferUsageById(usage);
    }

    public static debugTextureUsage(usage: number): string {
        return WebGPUProperties.getTextureUsageById(usage);
    }

    public static debugShaderStage(n: number) {
        return WebGPUProperties.getShaderStageById(n)
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






    public static getTransferableUniforms(uniforms:{[key:string]:Uniformable}):TransferableUniforms{
        
        let def:any;
        let o:Uniformable;
        const transferables:ArrayBuffer[] = [];
        const items:any = {};
        for(let z in uniforms){
            o = uniforms[z];
            o.name = z;

            def = o.definition;

            items[z] = def;
            console.log("type ======> ",o.type)
            if(def.type == "UniformGroup"){
                if(transferables.includes(def.values) == false){
                    transferables.push(def.values);
                }
            }else if(def.type == "UniformGroupArray"){
                let groups = def.groups;
                for(let i=0;i<groups.length;i++){
                    if(transferables.includes(groups[i].values) == false){
                        transferables.push(groups[i].values)
                    }
                }
            }else if(def.values.buffer){
                if(transferables.includes(def.values.buffer) == false){
                    transferables.push(def.values.buffer);
                }
            } 
        }

        return {
            items,
            transferables
        }
    }
    /*
    export type TransferableUniforms = {
    items:{name:string,type:string,values:any,groups?:any,items?:any};
    transferables:ArrayBuffer[]
} 
    */
    public static parseTransferableUniform(uniforms:TransferableUniforms):{[key:string]:Uniformable}{

        const parsePrimitive = (o:any):PrimitiveType=>{
            if(o.type == "Float") return new Float(o.values[0]);
            if(o.type == "Vec2") return new Vec2(o.values[0],o.values[1]);
            if(o.type == "Vec3") return new Vec3(o.values[0],o.values[1],o.values[2]);
            if(o.type == "Vec4") return new Vec4(o.values[0],o.values[1],o.values[2],o.values[3]);

            if(o.type == "Int") return new Int(o.values[0]);
            if(o.type == "IVec2") return new IVec2(o.values[0],o.values[1]);
            if(o.type == "IVec3") return new IVec3(o.values[0],o.values[1],o.values[2]);
            if(o.type == "IVec4") return new IVec4(o.values[0],o.values[1],o.values[2],o.values[3]);

            if(o.type == "Uint") return new Uint(o.values[0]);
            if(o.type == "UVec2") return new UVec2(o.values[0],o.values[1]);
            if(o.type == "UVec3") return new UVec3(o.values[0],o.values[1],o.values[2]);
            if(o.type == "UVec4") return new UVec4(o.values[0],o.values[1],o.values[2],o.values[3]);

            if(o.type == "Matrix4x4"){
                return new Matrix4x4(o.values);
            }
            if(o.type == "Matrix3x3"){
                return new Matrix3x3(o.values);
            }

            if(o.type == "Vec4Array"){
                const array = new Vec4Array(o.values.length/4);
                array.set(o.values);
                return array
            }

            if(o.type == "IVec4Array"){
                const array = new IVec4Array(o.values.length/4);
                array.set(o.values);
                return array
            }

            if(o.type == "UVec4Array"){
                const array = new UVec4Array(o.values.length/4);
                array.set(o.values);
                return array
            }

            if(o.type == "Matrix4x4Array"){
                const array = new Matrix4x4Array(o.values.length/16);
                array.set(o.values);
                return array
            }

            throw new Error("incorrect type")
        }

        const parseObject = (o:any):{[key:string]:Uniformable}=>{
            let result:{[key:string]:Uniformable} = {};
            let item;
            for(let z in o.items){
                item = o.items[z];
                if(item.type == "UniformGroup"){
                    result[z] = parseUniformGroup(item);
                }else if(item.type == "UniformGroupArray"){
                    result[z] = parseUniformGroupArray(item);
                }else{  
                    result[z] = parsePrimitive(item);
                }
            }
            return result;
        }

        const parseUniformGroup = (o:any):UniformGroup=>{
            let result = {};
            let item;
            for(let z in o.items){
                item = o.items[z];
                if(item.type == "UniformGroup"){
                    result[z] = parseUniformGroup(item);
                }else if(item.type == "UniformGroupArray"){
                    result[z] = parseUniformGroupArray(item);
                }else{  
                    result[z] = parsePrimitive(item);
                }
            }
           
            return new UniformGroup(result);
        }

        const parseUniformGroupArray = (o:any):UniformGroupArray=>{
            let result = [];
            for(let i=0;i<o.groups.length;i++){
                result[i] = parseUniformGroup(o.groups[i]);
            }
            return new UniformGroupArray(result)
        }



        return parseObject(uniforms);
    }



    public static init(options?: { powerPreference?: "low-power" | "high-performance", forceFallbackAdaoter?: boolean }): Promise<void> {
        this.requestAdapterOptions = options;
        BuiltIns.__initDebug();
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

                await WebGPUProperties.init();
                this.debugUsage(172)
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