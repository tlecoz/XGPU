import { SLGPU } from "../../SLGPU";
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

    public static Float(offset?: number) { return { type: "float32", offset } }
    public static Vec2(offset?: number) { return { type: "float32x2", offset } }
    public static Vec3(offset?: number) { return { type: "float32x3", offset } }
    public static Vec4(offset?: number) { return { type: "float32x4", offset } }

    public static Int(offset?: number) { return { type: "sint32", offset } }
    public static IVec2(offset?: number) { return { type: "sint32x2", offset } }
    public static IVec3(offset?: number) { return { type: "sint32x3", offset } }
    public static IVec4(offset?: number) { return { type: "sint32x4", offset } }

    public static Uint(offset?: number) { return { type: "uint32", offset } }
    public static UVec2(offset?: number) { return { type: "uint32x2", offset } }
    public static UVec3(offset?: number) { return { type: "uint32x3", offset } }
    public static UVec4(offset?: number) { return { type: "uint32x4", offset } }


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

        if (!descriptor) descriptor = {};
        else descriptor = { ...descriptor };

        if (!descriptor.stepMode) descriptor.stepMode = "vertex";
        this.descriptor = descriptor;

        const items: any = attributes;
        let buffer, offset;
        for (let name in items) {
            buffer = items[name];
            offset = buffer.offset;
            //console.log("=> ", name, buffer.offset)

            this.createArray(name, buffer.type, offset);
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


    protected mustRefactorData: boolean = false;
    protected refactorInfos: { nbCompo: number, nbEmpty: number }[] = [];
    //protected emptyMapIndex:number[] = [];

    /*
    private refactorData(): void {


        //console.warn("Warning , VertexBuffer.datas has been refactored in order to respect bytes-align")
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

        //console.log(new Float32Array(datas.buffer))
        //console.log("refactorData nbData = ", nbData, " , nbCompo = ", nbCompo, " , lengths[0] = ", lengths[0], ", len = ", len)

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

                //-------
                if (i === 0) {
                    this.vertexArrays[j].dataOffset = k;
                }

                //-------
                //console.log(j, k)

                for (let n = 0; n < length; n++) result[k++] = datas[kk++];
            }

        }


        this.datas = new Float32Array(result);
    }*/



    private refactorData(): void {

        if (!this.canRefactorData) return;
        //console.warn("Warning , VertexBuffer.datas has been refactored in order to respect bytes-align")
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


        //console.log(new Float32Array(datas.buffer))
        //console.log("refactorData nbData = ", nbData, " , nbCompo = ", nbCompo, " , lengths[0] = ", lengths[0], ", len = ", len)

        let byteCount = 0;
        let length;
        let k = 0, kk = 0;
        let dif;
        for (let i = 0; i < len; i += nbCompo) {

            if (i == 0) console.log("nb = ", len, nbData)
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

                //-------
                if (i === 0) {
                    this.vertexArrays[j].dataOffset = k;
                    //console.log("dataOffset = ", k, this.nbComponent)
                }

                //-------
                //console.log(j, k)

                for (let n = 0; n < length; n++) result[k++] = datas[kk++];
            }

            if (i === 0) {
                console.log("KKKKK ", k)

                dif = (4 - k % 4) % 4;

                this.nbComponentData = Math.ceil(k / 4) * 4;

                console.log("dif = ", dif)
            }

            for (let o = 0; o < dif; o++) {
                result[k++] = 0;
            }



        }



        console.log("datas.length = ", result.length)


        this.datas = new Float32Array(result);
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
        // console.log("new VertexAttribute ", name, dataType, offset)
        const v = this.attributes[name] = new VertexAttribute(name, dataType, offset);
        v.vertexBuffer = this;

        const nbCompo = v.nbComponent;
        this._nbComponent += nbCompo;
        this._byteCount += v.nbComponent * new GPUType(v.varType).byteValue;
        //console.log("byteCount = ", v.nbComponent + " * " + new GPUType(v.varType).byteValue)
        //console.log(this._byteCount);

        if (!this.mustRefactorData) {

            const type = new GPUType(v.varType);
            const nb = type.byteAlign;
            const dif = this._byteCount % nb;

            //console.log("AAAAAAAAAAAAAAAAAAAA ", name, this._byteCount, nb, dif)

            if (dif !== 0) this.mustRefactorData = true;
        }

        this.vertexArrays.push(v);
        return v;
    }

    //----------------------------- USED WITH COMPUTE PIPELINE ----------------------------------------

    public createDeclaration(vertexBufferName: string, bindingId: number, groupId: number = 0, isInput: boolean = true): string {
        //console.warn("VB.createDeclaration ", vertexBufferName, isInput)
        if (isInput) { }

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
            this.canRefactorData = false;
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
            if (this.vertexArrays[i].dataOffset !== undefined) offset = componentId = this.vertexArrays[i].dataOffset;
            obj.attributes[i] = {
                shaderLocation: builtinOffset + i,
                offset: offset * Float32Array.BYTES_PER_ELEMENT,
                format: this.vertexArrays[i].format
            }
            //console.log(i, obj.attributes[i])
            componentId += this.vertexArrays[i].nbComponent;
        }

        obj.arrayStride = componentId * Float32Array.BYTES_PER_ELEMENT;

        return obj;
    }

    protected _bufferSize: number;
    public get bufferSize(): number { return this._bufferSize; }
    public createGpuResource() {
        if (this.attributeChanged) this.updateAttributes();

        if (!this.datas || this.gpuBufferIOs) return;
        if (this.mustRefactorData) this.refactorData();

        if (this.gpuResource) this.gpuResource.destroy();



        this._bufferSize = this.datas.byteLength;
        this.gpuResource = SLGPU.device.createBuffer({
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
        console.log("updateBuffer ", this.datas.length, this.datas.byteLength + " vs " + this._bufferSize)

        if (this.datas.byteLength != this._bufferSize) this.createGpuResource();



        SLGPU.device.queue.writeBuffer(this.gpuResource, 0, this.datas.buffer)

    }

    public getVertexArrayById(id: number): VertexAttribute { return this.vertexArrays[id]; }


    protected updateAttributes() {

        let attribute: VertexAttribute;
        attribute = this.vertexArrays[0];
        const nbAttributes = this.vertexArrays.length;
        const nbVertex = attribute.data.length;
        let offset: number = 0;
        if (!this._datas) this._datas = new Float32Array(nbVertex * this.nbComponent)
        for (let i = 0; i < nbVertex; i++) {
            for (let j = 0; j < nbAttributes; j++) {
                attribute = this.vertexArrays[j];
                if (attribute.mustBeTransfered) {
                    this._datas.set(attribute.data[i], offset);

                }
                offset += attribute.nbComponent;
            }
        }

        console.log(this._datas)
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