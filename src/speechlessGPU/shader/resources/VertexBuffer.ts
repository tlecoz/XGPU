import { GPU } from "../../GPU";
import { GPUType } from "../../GPUType";
import { ShaderStruct } from "../shaderParts/ShaderStruct";
import { IShaderResource } from "./IShaderResource";
import { VertexAttribute } from "./VertexAttribute";

export type VertexBufferDescriptor = {
    stepMode?: "vertex" | "instance",
    accessMode?: "read" | "read_write",
    usage?: GPUBufferUsageFlags,
    attributes: any,
    datas?: Float32Array
}


export class VertexBuffer implements IShaderResource {

    public io: boolean = false;
    public mustBeTransfered: boolean = true;
    public vertexArrays: VertexAttribute[] = [];
    public attributes: any = {};
    public gpuResource: any;
    public descriptor: VertexBufferDescriptor;


    private _nbComponent: number = 0;

    private _datas: Float32Array;
    public nbComponentData: number;
    private _buffer: GPUBuffer;




    constructor(descriptor: {
        stepMode?: "vertex" | "instance",
        accessMode?: "read" | "read_write",
        usage?: GPUBufferUsageFlags,
        attributes: any,
        datas?: Float32Array
    }) {

        this.descriptor = descriptor;


        if (undefined === descriptor.stepMode) descriptor.stepMode = "vertex";
        if (undefined === descriptor.accessMode) descriptor.accessMode = "read";
        if (undefined === descriptor.usage) descriptor.usage = GPUBufferUsage.VERTEX;

        const items: any = descriptor.attributes;
        let buffer;
        for (let name in items) {
            buffer = items[name];
            this.createArray(name, buffer.type, buffer.offset);
        }
        if (descriptor.datas) {
            this.datas = descriptor.datas;
            this.createGpuResource();
        }

    }

    public get buffer(): GPUBuffer { return this._buffer; }


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


    protected mustRefactorData: boolean = false;
    protected refactorInfos: { nbCompo: number, nbEmpty: number }[] = [];
    //protected emptyMapIndex:number[] = [];

    private refactorData(): void {
        console.warn("Warning , VertexBuffer.datas has been refactored in order to respect bytes-align")
        const result = [];
        const aligns = [];
        const lengths = [];
        const values = [];
        let type: GPUType;

        for (let i = 0; i < this.vertexArrays.length; i++) {
            type = new GPUType(this.vertexArrays[i].varType);
            values[i] = type.byteValue;
            lengths[i] = this.vertexArrays[i].nbComponent;
            aligns[i] = type.byteAlign;
        }

        const nbData = lengths.length;
        const nbCompo = this.nbComponent;
        const datas = this.datas;
        const len = datas.length


        let byteCount = 0;
        let length;
        let k = 0, kk = 0;
        for (let i = 0; i < len; i += nbCompo) {


            for (let j = 0; j < nbData; j++) {
                if (j > 0) {

                    const dif = byteCount % aligns[j];

                    if (dif !== 0) {
                        const v = values[j - 1];
                        const nb = Math.ceil(dif / v);

                        byteCount += nb * v;
                        for (let n = 0; n < nb; n++) result[k++] = 0;
                    }
                }

                length = lengths[j];
                byteCount += values[j] * length;
                for (let n = 0; n < length; n++) result[k++] = datas[kk++];
            }
        }


        this.datas = new Float32Array(result);
    }

    private _byteCount: number = 0;
    public createArray(name: string, dataType: string, offset?: number): VertexAttribute {
        const v = this.attributes[name] = new VertexAttribute(name, dataType, offset);
        const nbCompo = v.nbComponent;
        this._nbComponent += nbCompo;
        this._byteCount += v.nbComponent * new GPUType(v.varType).byteValue;



        if (!this.mustRefactorData) {
            const type = new GPUType(v.varType);
            const nb = type.byteAlign;
            const dif = this._byteCount % nb;
            if (dif !== 0) this.mustRefactorData = true;
        }

        this.vertexArrays.push(v);
        return v;
    }

    //----------------------------- USED WITH COMPUTE PIPELINE ----------------------------------------

    public createDeclaration(vertexBufferName: string, bindingId: number, groupId: number = 0, isInput: boolean = true): string {
        console.warn("VB.createDeclaration ", vertexBufferName)
        /*let temp = this.name ? this.name : this._name;

        const t = temp.split(".");
        if (t.length > 1) t.shift();
        let name = t.join(".");
        if (name.indexOf("#") !== -1) name = name.slice(0, name.indexOf("#"));
        */

        const structName = vertexBufferName.substring(0, 1).toUpperCase() + vertexBufferName.slice(1);
        const varName = vertexBufferName.substring(0, 1).toLowerCase() + vertexBufferName.slice(1);

        let result = "";
        result += "struct " + structName + "{\n";
        let a: VertexAttribute;
        for (let i = 0; i < this.vertexArrays.length; i++) {
            a = this.vertexArrays[i];
            result += "   " + a.name + ":" + a.varType + ",\n";
        }
        result += "}\n\n";


        let type = "storage, read";
        if (!isInput) type = "storage, read_write"
        result += "@binding(" + bindingId + ") @group(" + groupId + ") var<" + type + "> " + varName + ":array<" + structName + ">;\n";//+ "_Array;\n\n";

        return result;


    }

    public createBindGroupLayoutEntry(bindingId: number): any {

        console.warn("VB accessMode = ", this.descriptor.accessMode)
        return {
            binding: bindingId,
            visibility: GPUShaderStage.COMPUTE,
            buffer: {
                type: this.descriptor.accessMode === "read" ? "read-only-storage" : "storage"
            },
        }


    }

    public createBindGroupEntry(bindingId: number): any {
        if (!this._buffer) this.createGpuResource();
        //console.log("buff = ", this._buffer)
        return {
            binding: bindingId,
            resource: {
                buffer: this._buffer,
                offset: 0,
                size: this.datas.byteLength
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


    public createVertexBufferLayout(builtinOffset: number = 0): any {

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
            if (this.vertexArrays[i].dataOffset !== undefined) offset = this.vertexArrays[i].dataOffset;
            obj.attributes[i] = {
                shaderLocation: builtinOffset + i,
                offset: offset * Float32Array.BYTES_PER_ELEMENT,
                format: this.vertexArrays[i].format
            }
            componentId += this.vertexArrays[i].nbComponent;
        }

        return obj;
    }


    public createGpuResource() {


        if (!this.datas || this._buffer) return;
        if (this.mustRefactorData) this.refactorData();

        this._buffer = GPU.device.createBuffer({
            size: this.datas.byteLength,
            usage: this.descriptor.usage,
            mappedAtCreation: true,
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
        if (!this._buffer) {
            this.createGpuResource();

        }

        //console.warn("DATA ", this.datas)
        new Float32Array(this._buffer.getMappedRange()).set(this.datas);

        this._buffer.unmap();
    }

    public getVertexArrayById(id: number): VertexAttribute { return this.vertexArrays[id]; }

    public update(): boolean {
        if (this.vertexArrays.length === 0) return false;

        if (this.mustBeTransfered) {
            this.mustBeTransfered = false;
            this.updateBuffer();
        }




        return true;
    }




}