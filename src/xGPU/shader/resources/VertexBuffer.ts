// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "../../XGPU";
import { GPUType } from "../../GPUType";
import { ShaderStruct } from "../shaderParts/ShaderStruct";
import { IShaderResource } from "./IShaderResource";
import { VertexAttribute } from "./VertexAttribute";
import { VertexBufferIO } from "./VertexBufferIO";

export type VertexBufferDescriptor = {
    stepMode?: "vertex" | "instance",
    accessMode?: "read" | "read_write",
    usage?: GPUBufferUsageFlags,
    datas?: Float32Array | Int32Array | Uint32Array | Uint16Array,
}


export class VertexBuffer implements IShaderResource {


    public bufferId: number //the id used in renderPass.setVertexBuffer

    public io: number = 0;
    public resourceIO: VertexBufferIO = null;
    public mustBeTransfered: boolean = false;
    public vertexArrays: VertexAttribute[] = [];
    public attributes: any = {};
    public gpuResource: GPUBuffer;
    public descriptor: VertexBufferDescriptor;



    private _nbComponent: number = 0;

    private _datas: Float32Array | Int32Array | Uint32Array | Uint16Array;
    public nbComponentData: number;
    public attributeChanged: boolean = false;




    constructor(attributes: any, descriptor?: {
        stepMode?: "vertex" | "instance",
        accessMode?: "read" | "read_write",
        usage?: GPUBufferUsageFlags,
        datas?: Float32Array | Int32Array | Uint32Array | Uint16Array,
        gpuUpdateMode?:"auto"|"manual"
    }) {

        //console.warn("VERTEX BUFFER 2", attributes)

        if (!descriptor) descriptor = {};
        else descriptor = { ...descriptor };

        if (!descriptor.stepMode) descriptor.stepMode = "vertex";
       
        this.descriptor = descriptor;

        const items: any = attributes;
        let buffer, offset, datas;
        let attribute: VertexAttribute;
        let nbComponent:number = 0;
        for (let name in items) {
            buffer = items[name];
            offset = buffer.offset;
            datas = buffer.datas;
            nbComponent += buffer.nbComponent;
            //console.log("=> ", name, offset,buffer.nbComponent)

            if (!this.attributes[name]) {
                attribute = this.createArray(name, buffer.type, offset);
                //console.log(name, offset)
                if (datas) attribute.datas = datas;
            } else {
                //console.log(this.attributes[name])
            }

        }
        if (descriptor.datas) this.datas = descriptor.datas;


        if(descriptor.gpuUpdateMode == "manual"){
           
            const accessMode = descriptor.accessMode ? descriptor.accessMode : "read";

            if(!descriptor.usage){
                throw new Error("VertexBuffer constructor : you must set the property 'usage' in the descriptor if 'gpuUpdateMode' is set to 'manual' ")
            }

            const usage = descriptor.usage;
            this.createLowLevelBuffer(nbComponent * 4,accessMode,usage);
        }

    }

    /*
    public pushDatas(datas: Float32Array | Int32Array | Uint32Array | Uint16Array) {
        this.mustBeTransfered = true;

        if (!extraBufferSize) extraBufferSize = 1000;

        //if (this.datas) console.log(this.datas.length + " VS " + (offset + len))

        if (!this._datas || this._datas.length < offset + len) {


           


            if (!this._datas) {
                this._datas = datas;
                this.createGpuResource();
            } else if ((offset + len) - this._datas.length >= extraBufferSize) {
                this._datas = datas;
                this.createGpuResource();
            } else {

                //console.log("B")

                if (indices instanceof Uint16Array) this._datas = new Uint16Array(this._datas.length + extraBufferSize);
                else this._datas = new Uint32Array(this._datas.length + extraBufferSize);
                this._datas.set(indices);
                this.createGpuResource();
            }
        } else {
            //console.log("A ", indices.slice(offset, offset + len))
            if (offset && len) this._datas.set(indices.slice(offset, offset + len), offset)
            else this._datas.set(indices);
        }

        this.update();
    }
    */


    public clone(): VertexBuffer {
        const vb = new VertexBuffer(this.attributeDescriptor, this.descriptor);
        vb.bufferId = this.bufferId;
        let datas: Float32Array | Int32Array | Uint32Array;
        if (this.datas instanceof Float32Array) datas = new Float32Array(this.datas.length);
        else if (this.datas instanceof Int32Array) datas = new Int32Array(this.datas.length);
        else if (this.datas instanceof Uint32Array) datas = new Uint32Array(this.datas.length);


        //const data = new Float32Array(this.datas.length);
        datas.set(this.datas);
        vb.datas = datas;

        //console.log("clone")

        return vb;
    }


    protected gpuBufferIOs: GPUBuffer[];
    protected gpuBufferIO_index: number = 1;

    public initBufferIO(buffers: GPUBuffer[]) {
        this.gpuBufferIOs = buffers;
    }


    public get buffer(): GPUBuffer {
        if (this.gpuBufferIOs) {

            const buf: any = this.gpuBufferIOs[this.gpuBufferIO_index++ % 2]
            return buf;
        }

        return this.gpuResource;
    }

    public getCurrentBuffer() {

        if (this.gpuBufferIOs) return this.gpuBufferIOs[(this.gpuBufferIO_index + 1) % 2]
        if (!this.gpuResource) this.createGpuResource();
        return this.gpuResource;
    }

    public get stepMode(): "vertex" | "instance" { return this.descriptor.stepMode }

    public get length(): number { return this.vertexArrays.length; }
    public get nbComponent(): number { return this._nbComponent; }
    public get nbVertex(): number {
        if (!this.datas) return 0;
        if (this.nbComponentData) return this.datas.length / this.nbComponentData;
        return this.datas.length / this._nbComponent
    }


    public get datas(): Float32Array | Int32Array | Uint32Array | Uint16Array { return this._datas; }
    public set datas(f: Float32Array | Int32Array | Uint32Array | Uint16Array) {
        this._datas = f;
        this.mustBeTransfered = true;
    }


    public setComplexDatas(datas: Float32Array | Int32Array | Uint32Array, nbComponentTotal: number) {
        this._nbComponent = nbComponentTotal;
        this.datas = datas;
    }

    public get attributeDescriptor(): any {
        const result = {};
        let o;
        for (let name in this.attributes) {
            o = this.attributes[name] as VertexAttribute;
            result[name] = {
                type: o.format,
                offset: o.dataOffset
            }
        }
        return result;
    }

    private _byteCount: number = 0;
    public createArray(name: string, dataType: string, offset?: number): VertexAttribute {

        if (this.attributes[name] && this.attributes[name].vertexBuffer) {

            return this.attributes[name];
        }


        let v: VertexAttribute = this.attributes[name];

        //console.warn("createArray ", name, dataType, offset, this.attributes[name]);

        if (!v) v = this.attributes[name] = new VertexAttribute(name, dataType, offset);
        v.vertexBuffer = this;

        const nbCompo = v.nbComponent;
        const _offset = v.dataOffset === undefined ? 0 : v.dataOffset;
        this._nbComponent += nbCompo;

        //console.log("v.dataOffset = ", name, v.dataOffset)

        if (v.dataOffset === undefined) this._byteCount += nbCompo * new GPUType(v.varType).byteValue;
        else this._byteCount = Math.max(this._byteCount, (_offset + v.nbComponent) * new GPUType(v.varType).byteValue);

        this.vertexArrays.push(v);
        return v;
    }

    public getAttributeByName(name: string): VertexAttribute {
        return this.attributes[name];
    }

    //----------------------------- USED WITH COMPUTE PIPELINE ----------------------------------------

    public createDeclaration(vertexBufferName: string, bindingId: number, groupId: number = 0, isInput: boolean = true): string {
        //console.warn("VB.createDeclaration ", vertexBufferName, isInput)
        if (isInput) { }


        this.stackAttributes();

        let structName = vertexBufferName.substring(0, 1).toUpperCase() + vertexBufferName.slice(1);
        const varName = vertexBufferName.substring(0, 1).toLowerCase() + vertexBufferName.slice(1);

        //console.log("XGPU||| structName = ",structName);

        let result = "";
        let type = "storage, read";
        let structType = "array<" + structName + ">"
        if (this.descriptor.accessMode == "read"){ //this.io === 1 || this.io === 0) {

            result += "struct " + structName + "{\n";
            let a: VertexAttribute;
            for (let i = 0; i < this.vertexArrays.length; i++) {
                a = this.vertexArrays[i];
                result += "   " + a.name + ":" + a.varType + ",\n";
            }
            result += "}\n\n";
            structType = "array<" + structName + ">"
        } else {
            type = "storage, read_write"
            if(this.io == 2){
                //remove the '_out' 
                structName = structName.slice(0, structName.length - 4);
            }else{

                result += "struct " + structName + "{\n";
                let a: VertexAttribute;
                for (let i = 0; i < this.vertexArrays.length; i++) {
                    a = this.vertexArrays[i];
                    result += "   " + a.name + ":" + a.varType + ",\n";
                }
                result += "}\n\n";
                structType = "array<" + structName + ">"


            }
           
            structType = "array<" + structName + ">"
        }

        result += "@binding(" + bindingId + ") @group(" + groupId + ") var<" + type + "> " + varName + ":" + structType + ";\n";

        return result;


    }
    public debug:boolean = false;

    public createBindGroupLayoutEntry(bindingId: number): any {
        
        return {
            binding: bindingId,
            visibility: GPUShaderStage.COMPUTE,
            buffer: {
                type: this.descriptor.accessMode === "read" ? "read-only-storage" : "storage"
            },
        }
    }

    public createBindGroupEntry(bindingId: number): any {

        if (!this.gpuResource) this.createGpuResource();
        //console.log("VertexBuffer.createBindgroupEntry size = ", this.datas.byteLength)
        let size = 0;
        if (this.datas) size = this.datas.byteLength;
        if(this.lowLevelBuffer) size = this._bufferSize;
        return {
            binding: bindingId,
            resource: {
                buffer: this.gpuResource,
                offset: 0,
                size
            }
        }
    }


    protected pipelineType: "compute" | "render" | "compute_mixed";

    public setPipelineType(pipelineType: "compute" | "render" | "compute_mixed") {
        if (this.pipelineType || pipelineType == "compute" && this.lowLevelBuffer == true) return;
        
        this.pipelineType = pipelineType ;
        //use to handle particular cases in descriptor relative to the nature of pipeline

        if (pipelineType === "render") {
            if (!this.descriptor.accessMode) this.descriptor.accessMode = "read";
            if (!this.descriptor.usage) this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;

        } else if (pipelineType === "compute_mixed") {
           
            if (this.io === 1 || this.io === 0) { //VertexBufferIO output , usable in a renderPipeline
                if (!this.descriptor.usage) this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC;
                if (!this.descriptor.accessMode) this.descriptor.accessMode = "read";
            } else if (this.io === 2) { //VertexBufferIO input
                if (!this.descriptor.usage) this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC;
                if (!this.descriptor.accessMode) this.descriptor.accessMode = "read_write";
            }

        } else if (pipelineType === "compute") {
            if (this.io === 1 || this.io == 0) { //VertexBufferIO output || VertexBuffer in computeShader
                if (!this.descriptor.usage) this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC;
                if (!this.descriptor.accessMode) this.descriptor.accessMode = "read";
            } else if (this.io === 2) { //VertexBufferIO input
                if (!this.descriptor.usage) this.descriptor.usage =  GPUBufferUsage.VERTEX |GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC;
                if (!this.descriptor.accessMode) this.descriptor.accessMode = "read_write";
            }
        }
    }

    //------------------------------------------------------------------------------------------------------

    public createStruct(name: string): ShaderStruct {

        const structName = name.substring(0, 1).toUpperCase() + name.slice(1);
        const properties: { name: string, type: string, builtin?: string }[] = [];
        let a: VertexAttribute;
        for (let i = 0; i < this.vertexArrays.length; i++) {
            a = this.vertexArrays[i];
            properties[i] = { name: a.name, type: a.varType, builtin: "" };
        }

        return new ShaderStruct(structName, properties)
    }



    public arrayStride: number;
    public stackAttributes(builtinOffset: number = 0) {

        //console.log("---------- STACK ATTRIBUTES ------------");
        //console.log(this.descriptor.stepMode)
        const result: VertexAttribute[] = []

        let bound = 1;

        var floats: VertexAttribute[] = [];
        var vec2s: VertexAttribute[] = [];
        var vec3s: VertexAttribute[] = [];

        let v;
        let offset = 0;
        for (let i = 0; i < this.vertexArrays.length; i++) {
            v = this.vertexArrays[i];
            if (v.nbComponent === 1) floats.push(v);
            else if (v.nbComponent === 2) {
                if (bound < 2) bound = 2;
                vec2s.push(v);
            } else if (v.nbComponent === 3) {
                bound = 4;
                vec3s.push(v);
            } else if (v.nbComponent === 4) {
                bound = 4;
                v.dataOffset = offset;
                offset += 4;
                result.push(v);
            }
        }


        //------------------------


        const addVec3 = () => {
            v = vec3s.shift();
            v.dataOffset = offset;
            offset += 3;
            result.push(v);
            if (floats.length) {
                const f = floats.shift();
                f.dataOffset = offset;
                result.push(f);
            }
            offset++
        }

        let nb = vec3s.length;
        for (let i = 0; i < nb; i++) addVec3();

        //--------------------------

        nb = vec2s.length;
        for (let i = 0; i < nb; i++) {
            v = vec2s.shift();
            v.dataOffset = offset;
            offset += 2;
            result.push(v);
        }

        //--------------------------

        nb = floats.length;
        for (let i = 0; i < nb; i++) {
            v = floats.shift();
            v.dataOffset = offset;
            offset++;
            result.push(v);
        }

        //--------------------------

        if (offset % bound !== 0) {
            offset += bound - (offset % bound);
        }

        //--------------------------
        this.vertexArrays = result;

        const attributes = [];
        for (let i = 0; i < result.length; i++) {
            attributes[i] = {
                shaderLocation: builtinOffset + i,
                offset: result[i].dataOffset * Float32Array.BYTES_PER_ELEMENT,
                format: this.vertexArrays[i].format
            }
        }

        //-----------------
        this.arrayStride = offset;

        //console.log("this.arrayStride = ", offset);
        //console.log(this.descriptor.stepMode)

        const res =  {
            stepMode: this.descriptor.stepMode,
            arrayStride: Float32Array.BYTES_PER_ELEMENT * this.arrayStride,
            attributes
        }

        //console.log("res = ",res)
        return res


    }


    public addVertexInstance(instanceId: number, o: any) {
        const start = instanceId * this.arrayStride;
        const datas = this._datas;
        let attribute: VertexAttribute;
        for (let z in o) {
            attribute = this.getAttributeByName(z);
            if (attribute) {
                datas[start + attribute.dataOffset] = o[z];
            }
        }
    }


    protected layout: any;

    public createVertexBufferLayout(builtinOffset: number = 0): any {


        //console.log(this.io, this.descriptor.stepMode)
        if (this.gpuBufferIOs) {
            //console.log("GPUBufferIOs = ",this.gpuBufferIOs)
            return this.stackAttributes(builtinOffset);
        }



        let nb = this._nbComponent;
        if (this.nbComponentData) nb = this.nbComponentData;

        const obj = {
            stepMode: this.descriptor.stepMode,
            arrayStride: Float32Array.BYTES_PER_ELEMENT * nb,
            attributes: []
        }

        let componentId = 0;
        let offset: number;
        for (let i = 0; i < this.vertexArrays.length; i++) {
            offset = componentId;
            if (this.vertexArrays[i].dataOffset !== undefined) offset = componentId = this.vertexArrays[i].dataOffset;
            obj.attributes[i] = {
                shaderLocation: builtinOffset + i,
                offset: offset * Float32Array.BYTES_PER_ELEMENT,
                format: this.vertexArrays[i].format
            }

            componentId += this.vertexArrays[i].nbComponent;
        }
        //console.log("vb layout = ", obj)
        obj.arrayStride = Math.max(this._byteCount, nb * Float32Array.BYTES_PER_ELEMENT);
        this.layout = obj;
        return obj;
    }


    public lowLevelBuffer:boolean = false;
    public createLowLevelBuffer(bufferSize:number,accessMode:"read"|"read_write" = "read" ,usage:number = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST){
        this.lowLevelBuffer = true;

        if (this.gpuResource) this.gpuResource.destroy();
       
        this.descriptor.usage = usage;
        this.descriptor.accessMode = accessMode;
        this.deviceId = XGPU.deviceId;

        this._bufferSize = bufferSize;
        this.gpuResource = XGPU.device.createBuffer({
            size: bufferSize,
            usage: this.descriptor.usage,
            mappedAtCreation: false,
        })

       
       

        this.destroyed = false;
        this.mustBeTransfered = true;
    }

   
    public resizeLowLevelBuffer(byteLength:number,copyPreviousDataWithin:boolean=false){

        if(!this.lowLevelBuffer) return false;

        const oldBuffer = this.gpuResource;

        this._bufferSize = byteLength;
        this.gpuResource = XGPU.device.createBuffer({
            size: byteLength,
            usage: this.descriptor.usage,
            mappedAtCreation: false,
        })


        if(copyPreviousDataWithin){
            
            const command = XGPU.device.createCommandEncoder();
            command.copyBufferToBuffer(oldBuffer,0,this.gpuResource,0,oldBuffer.size);
            const end = command.finish();
        
            XGPU.device.queue.submit([end]);
            XGPU.device.queue.onSubmittedWorkDone().then(()=>{
                //console.log("DESTROY BUFFER")
                oldBuffer.destroy();
            })
        
        }else{
            
            oldBuffer.destroy();
            
        }
            
    }

    public updateLowLevelBuffer(buffer:ArrayBuffer,bufferOffset:number,dataOffset?:number,size?:number){
        //console.log({dataOffset,size,buffer})

       
            if(size == undefined) size = buffer.byteLength;
            if(dataOffset == undefined) dataOffset = 0;

            if(!this.gpuResource) throw new Error("you must create a GPUBuffer using VertexBuffer.createGPUResource(bufferSize)");
            //if(bufferOffset + size > this._bufferSize) throw new Error("incorrect gpu buffer length, max length = "+this._bufferSize+" vs "+(bufferOffset + size));
            
            
            if(dataOffset + size > buffer.byteLength) throw new Error("incorrect datas length")

            XGPU.device.queue.writeBuffer(this.gpuResource, bufferOffset, buffer,dataOffset,size)
      


     }


     protected stagingBuffer:GPUBuffer;
     protected canCallMapAsync:boolean = true;
     public onCanCallMapAsync:(()=>void)|null = null;
     public onOutputData:((buf:ArrayBuffer)=>void)|null = null;
     public async getOutputData(){
        if(!this.onOutputData) return;
        

        

        if (!this.canCallMapAsync) return;

        this.canCallMapAsync = false;

        const buffer:GPUBuffer = this.gpuResource;

        //console.log("getOutputData ",buffer.size+" vs "+this.bufferSize);

        if (!this.stagingBuffer || buffer.size != this.stagingBuffer.size) this.stagingBuffer = XGPU.createStagingBuffer(this.bufferSize);
        const copyEncoder = XGPU.device.createCommandEncoder();
        const stage = this.stagingBuffer;

      

        copyEncoder.copyBufferToBuffer(buffer, 0, stage, 0, stage.size);

        XGPU.device.queue.submit([copyEncoder.finish()]);


        await this.stagingBuffer.mapAsync(GPUMapMode.READ, 0, stage.size)
       

        const copyArray = stage.getMappedRange(0, stage.size);
        const data = copyArray.slice(0);
        stage.unmap();
        this.canCallMapAsync = true;
        if(this.onCanCallMapAsync) this.onCanCallMapAsync();

        this.onOutputData(data);

        
     }















    protected _bufferSize: number;
    protected deviceId: number;
    public get bufferSize(): number { return this._bufferSize; }
    public createGpuResource() {
        if(this.lowLevelBuffer) return;
        if (this.attributeChanged) this.updateAttributes();
        if (!this.datas || this.gpuBufferIOs) return;
        if (this.gpuResource) this.gpuResource.destroy();

        const bufferSize = this.datas.byteLength;
        //console.warn("VB.createGPUResource ", this.io, this.pipelineType, XGPU.debugUsage(this.descriptor.usage))
        this.deviceId = XGPU.deviceId;
        this._bufferSize = bufferSize;
        this.gpuResource = XGPU.device.createBuffer({
            size: bufferSize,
            usage: this.descriptor.usage,
            mappedAtCreation: false,
        })
        this.destroyed = false;
        this.mustBeTransfered = true;

    }

    public time: number;
    protected destroyed: boolean = true;
    public destroyGpuResource() {
        if (this.destroyed) return;


        if (this.time && new Date().getTime() - this.time < 100 && XGPU.loseDeviceRecently) {
            return;
        }
        this.time = new Date().getTime();

        if (this.io && XGPU.loseDeviceRecently) {

            if (this.io === 1) {


                const vbio = this.resourceIO;
                const vbs = vbio.buffers;

               
               
                this.setPipelineType(this.pipelineType)
                const currentDatas = vbio.currentDatas ? vbio.currentDatas : vbs[0]._datas;

                if (vbs[0]._datas instanceof Float32Array) vbs[0]._datas = vbs[1]._datas = new Float32Array(currentDatas);
                else if (vbs[0]._datas instanceof Int32Array) vbs[0]._datas = vbs[1]._datas = new Int32Array(currentDatas);
                else if (vbs[0]._datas instanceof Uint32Array) vbs[0]._datas = vbs[1]._datas = new Uint32Array(currentDatas);

                //vbs[0]._datas = 
                let temp = vbs[0].gpuBufferIOs;
                vbs[0].gpuBufferIOs = null;
                vbs[0].createGpuResource();
                vbs[0].gpuBufferIOs = temp;

                temp = vbs[1].gpuBufferIOs;
                vbs[1].gpuBufferIOs = null;
                vbs[1].createGpuResource();
                vbs[1].gpuBufferIOs = temp;

                vbs[0].gpuBufferIOs[0] = vbs[0].gpuResource;
                vbs[0].gpuBufferIOs[1] = vbs[1].gpuResource;


            }
            return

        }
        this.destroyed = true;
        if (this.resourceIO) {
            this.resourceIO.destroy();
            this.resourceIO = null;
        }
        if (this.gpuResource) {
            this.gpuResource.destroy();
            this.gpuResource = null;
        }


    }

    

    public updateBuffer(): void {
        if(this.lowLevelBuffer) return;
        if (!this.datas) return;
        if (!this.gpuResource) this.createGpuResource();
        if (this.datas.byteLength != this._bufferSize) this.createGpuResource();

        XGPU.device.queue.writeBuffer(this.gpuResource, 0, this.datas.buffer)

    }

    public getVertexArrayById(id: number): VertexAttribute { return this.vertexArrays[id]; }


    protected updateAttributes() {

        let attribute: VertexAttribute;
        attribute = this.vertexArrays[0];
        const nbAttributes = this.vertexArrays.length;

        let offset: number = 0;

        if (this.vertexArrays[0] && this.vertexArrays[0].useByVertexData) {


            const nbVertex = attribute.datas.length;
            if (!this._datas) this._datas = new Float32Array(nbVertex * this.nbComponent)

            for (let i = 0; i < nbVertex; i++) {
                for (let j = 0; j < nbAttributes; j++) {
                    attribute = this.vertexArrays[j];
                    if (attribute.mustBeTransfered) {
                        //console.log(nbVertex, nbAttributes, offset, attribute)
                        this._datas.set((attribute.datas as number[][])[i], offset);

                    }
                    offset += attribute.nbComponent;
                }
            }
        } else {

            const nbVertex = attribute.datas.length / attribute.nbComponent;
            if (!this._datas) this._datas = new Float32Array(nbVertex * this.nbComponent)


            for (let j = 0; j < nbAttributes; j++) {
                attribute = this.vertexArrays[j];
                if (attribute.mustBeTransfered) {

                    this._datas.set(attribute.datas as number[], offset);
                }
                offset += attribute.nbComponent;

            }

        }




        for (let j = 0; j < nbAttributes; j++) this.vertexArrays[j].mustBeTransfered = false;

        this.attributeChanged = false;
        this.mustBeTransfered = true;

    }


    public update(): boolean {
        if(this.lowLevelBuffer) return true;
        if (this.vertexArrays.length === 0) return false;
        if (this.attributeChanged) this.updateAttributes();

        if (this.mustBeTransfered) {
            this.mustBeTransfered = false;
            this.updateBuffer();
        }

        return true;
    }

}