// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "../../XGPU";
import { GPUType } from "../../GPUType";
import { ShaderStruct } from "../shaderParts/ShaderStruct";
import { IShaderResource } from "./IShaderResource";
import { VertexAttribute } from "./VertexAttribute";

export type VertexBufferDescriptor = {
    stepMode?: "vertex" | "instance",
    accessMode?: "read" | "read_write",
    usage?: GPUBufferUsageFlags,
    datas?: Float32Array
}


export class VertexBuffer implements IShaderResource {




    public io: number = 0;
    public mustBeTransfered: boolean = false;
    public vertexArrays: VertexAttribute[] = [];
    public attributes: any = {};
    public gpuResource: GPUBuffer;
    public descriptor: VertexBufferDescriptor;



    private _nbComponent: number = 0;

    private _datas: Float32Array;
    public nbComponentData: number;
    public attributeChanged: boolean = false;




    constructor(attributes: any, descriptor?: {
        stepMode?: "vertex" | "instance",
        datas?: Float32Array
    }) {

        //console.log("VERTEX BUFFER ", attributes)

        if (!descriptor) descriptor = {};
        else descriptor = { ...descriptor };

        if (!descriptor.stepMode) descriptor.stepMode = "vertex";
        this.descriptor = descriptor;

        const items: any = attributes;
        let buffer, offset, datas;
        let attribute: VertexAttribute;
        for (let name in items) {
            buffer = items[name];
            offset = buffer.offset;
            datas = buffer.datas;
            //console.log("=> ", name, offset)
            if (!this.attributes[name]) {
                attribute = this.createArray(name, buffer.type, offset);
                //console.log(name, offset)
                if (datas) attribute.datas = datas;
            } else {
                //console.log(this.attributes[name])
            }

        }
        if (descriptor.datas) this.datas = descriptor.datas;

    }


    public clone(): VertexBuffer {
        const vb = new VertexBuffer(this.attributeDescriptor, this.descriptor);
        const data = new Float32Array(this.datas.length);
        data.set(this.datas);
        vb.datas = data;
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
        return this.gpuResource;
    }


    public get length(): number { return this.vertexArrays.length; }
    public get nbComponent(): number { return this._nbComponent; }
    public get nbVertex(): number {
        if (!this.datas) return 0;
        if (this.nbComponentData) return this.datas.length / this.nbComponentData;
        return this.datas.length / this._nbComponent
    }


    public get datas(): Float32Array { return this._datas; }
    public set datas(f: Float32Array) {
        this._datas = f;
        this.mustBeTransfered = true;
    }


    public setComplexDatas(datas: Float32Array, nbComponentTotal: number) {
        this._datas = datas;
        this._nbComponent = nbComponentTotal;
        this.mustBeTransfered = true;
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
        //console.log("new VertexAttribute ", name, dataType, offset)

        if (this.attributes[name]) {

            return this.attributes[name];
        }

        const v = this.attributes[name] = new VertexAttribute(name, dataType, offset);
        v.vertexBuffer = this;

        const nbCompo = v.nbComponent;
        const _offset = v.dataOffset === undefined ? 0 : v.dataOffset;
        this._nbComponent += nbCompo;

        if (v.dataOffset === undefined) this._byteCount += nbCompo * new GPUType(v.varType).byteValue;
        else this._byteCount = Math.max(this._byteCount, (_offset + v.nbComponent) * new GPUType(v.varType).byteValue);
        //console.log("byteCount = ", v.nbComponent + " * " + new GPUType(v.varType).byteValue)
        //console.log("createArray ", name, this._byteCount, (_offset + v.nbComponent) * new GPUType(v.varType).byteValue);



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


        let result = "";
        let type = "storage, read";
        if (this.io === 1) {

            result += "struct " + structName + "{\n";
            let a: VertexAttribute;
            for (let i = 0; i < this.vertexArrays.length; i++) {
                a = this.vertexArrays[i];
                result += "   " + a.name + ":" + a.varType + ",\n";
            }
            result += "}\n\n";

        } else {
            type = "storage, read_write"
            structName = structName.slice(0, structName.length - 4);
        }






        result += "@binding(" + bindingId + ") @group(" + groupId + ") var<" + type + "> " + varName + ":array<" + structName + ">;\n";//+ "_Array;\n\n";

        return result;


    }

    public createBindGroupLayoutEntry(bindingId: number): any {

        //console.warn("VB accessMode = ", this.descriptor.accessMode)
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
        //console.log("buff = ", this.gpuResource)
        return {
            binding: bindingId,
            resource: {
                buffer: this.gpuResource,
                offset: 0,
                size: this.datas.byteLength
            }
        }
    }

    protected canRefactorData: boolean = true;
    public setPipelineType(pipelineType: "compute" | "render" | "compute_mixed") {

        //use to handle particular cases in descriptor relative to the nature of pipeline

        if (pipelineType === "render") {
            this.descriptor.accessMode = "read";
            this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;
            this.canRefactorData = false;

        } else if (pipelineType === "compute_mixed") {

            //i use accessMode = "read_write" for both here because we will apply a ping-pong structure: 
            //the computeShader result will be used as input of the computeShader itself for the next frame. 
            //=> to render the first frame we will use buffers[0]  
            // to render the second frame we will use buffers[1]
            // to render the third frame we will use buffers[0]
            // ... 
            //we can swap the bindgroup entry that contains the reference of the buffer , 
            //but we can't swap bindgroupLayout that define the accessMode
            //that's why I forced to use "read_write" for both in that scenario

            //console.log("---compute mixed")

            if (this.io === 1) {
                this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE;
                this.descriptor.accessMode = "read";
            } else if (this.io === 2) {
                this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_SRC | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST;
                this.descriptor.accessMode = "read_write";
            }

        } else if (pipelineType === "compute") {

            //this case is a bit different because a computePipeline alone must return a result shaped into a Float32Array
            //
            //a final step is applyed to get back the gpu buffers into the cpu context 
            //because we do that, we can use these output-data as input-data of the compute shader 
            //with no need to alternate the bindgroup.

            //that's why I use one buffer with "read" accessMode and a second one with "read_write"

            //console.log("---compute")



            this.canRefactorData = true;



            if (this.io === 1) {
                this.descriptor.usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC;
                this.descriptor.accessMode = "read";
            } else if (this.io === 2) {
                this.descriptor.usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC;
                this.descriptor.accessMode = "read_write" as any;
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
        return {
            stepMode: this.descriptor.stepMode,
            arrayStride: Float32Array.BYTES_PER_ELEMENT * this.arrayStride,
            attributes
        }


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




    public createVertexBufferLayout(builtinOffset: number = 0): any {

        if (this.gpuBufferIOs) {
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

            let type = new GPUType(this.vertexArrays[i].varType);
            console.log("type = ", this.vertexArrays[i].varType, type.byteAlign, type.byteSize, type.byteValue);
            //nb = offset + Math.ceil((1 + this.vertexArrays[i].nbComponent) / 2) * 2;
            console.log("nb = ", Math.ceil((1 + this.vertexArrays[i].nbComponent) / 2) * 2)
            //console.log("=========>>>>>> ", offset, this.vertexArrays[i].nbComponent)
            //console.log(i, obj.attributes[i])
            componentId += this.vertexArrays[i].nbComponent;
        }

        console.log("IO:", this.gpuBufferIOs, " | ", this._byteCount + " VS " + (nb * Float32Array.BYTES_PER_ELEMENT))



        obj.arrayStride = Math.max(this._byteCount, nb * Float32Array.BYTES_PER_ELEMENT);

        return obj;
    }

    protected _bufferSize: number;
    public get bufferSize(): number { return this._bufferSize; }
    public createGpuResource() {
        if (this.attributeChanged) this.updateAttributes();

        if (!this.datas || this.gpuBufferIOs) return;


        if (this.gpuResource) this.gpuResource.destroy();

        //console.log("VB.createGPUResource ", this.datas, this.datas.byteLength)

        this._bufferSize = this.datas.byteLength;
        this.gpuResource = XGPU.device.createBuffer({
            size: this.datas.byteLength,
            usage: this.descriptor.usage,
            mappedAtCreation: false,
        })


    }

    public destroyGpuResource() {
        if (this.gpuResource) {
            this.gpuResource.destroy();
            this.gpuResource = null;
        }
    }


    public updateBuffer(): void {
        if (!this.datas) return;
        if (!this.gpuResource) {
            this.createGpuResource();

        }
        //console.log("updateBuffer ", this.datas.length, this.datas.byteLength + " vs " + this._bufferSize)

        if (this.datas.byteLength != this._bufferSize) this.createGpuResource();



        XGPU.device.queue.writeBuffer(this.gpuResource, 0, this.datas.buffer)

    }

    public getVertexArrayById(id: number): VertexAttribute { return this.vertexArrays[id]; }


    protected updateAttributes() {

        let attribute: VertexAttribute;
        attribute = this.vertexArrays[0];
        const nbAttributes = this.vertexArrays.length;
        const nbVertex = attribute.datas.length;
        let offset: number = 0;
        if (!this._datas) this._datas = new Float32Array(nbVertex * this.nbComponent)


        if (this.vertexArrays[0] && this.vertexArrays[0].useByVertexData) {

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
        if (this.vertexArrays.length === 0) return false;


        if (this.attributeChanged) this.updateAttributes();










        if (this.mustBeTransfered) {
            this.mustBeTransfered = false;
            this.updateBuffer();
        }




        return true;
    }




}