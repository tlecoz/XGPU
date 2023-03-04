import { GPUType } from "../../GPUType";
import { PrimitiveType } from "../PrimitiveType";
import { UniformBuffer } from "./UniformBuffer";


export class Uniform {

    public _name: string;
    private _type: GPUType;
    private _data: PrimitiveType;
    private _byteSize: number = 0;
    private _buffer: UniformBuffer;
    public startId: number = 0;
    //public builtin: number = 0;
    public mustBeTransfered: boolean = false;

    constructor(buffer: UniformBuffer, name: string, type: GPUType, data: PrimitiveType) {
        this._name = name;
        this._type = type;
        this._buffer = buffer;
        //console.log("uniform ", name, type)
        //console.log("nbVal = ", type.nbValues)
        //if (!data) data = new Float32Array(type.nbValues);
        data.uniform = this;
        this.data = data;


        this._byteSize = type.byteSize;
    }

    public clone(parentBuffer: UniformBuffer): Uniform {
        const u = new Uniform(parentBuffer, this._name, this._type, this._data);
        u.startId = this.startId;
        return u;
    }


    public get name(): string { return this._name; }
    public get type(): GPUType { return this._type; }
    public get byteSize(): number { return this._byteSize; }
    //public set byteSize(n: number) { this._byteSize = n; }

    public get buffer(): UniformBuffer { return this._buffer; }



    private oldValues: string = "";
    public get data(): PrimitiveType { return this._data; }
    public set data(data: any) {
        if (!data) return
        const str = data.toString();
        if (str === this.oldValues) return;


        if (data.length === this.type.nbValues) {
            this._data = data;
            this.mustBeTransfered = true;
            this.oldValues = str;
        } else {
            if (this.type.isArray) {
                if (data.length === this.type.arrayLength) {
                    if (data[0].length === this.type.nbValues / this.type.arrayLength) {
                        this._data = data;
                        this.mustBeTransfered = true;
                        this.oldValues = str;
                    }
                }
            } else {
                console.log(this.name, this.type)
                throw new Error("incorrect data length. Expected " + this.type.nbValues + ", got " + data.length)
            }

        }
    }

    public writeInsideBuffer(bufferData: Float32Array, offset: number) {
        const len = this.type.nbValues;
        for (let i = 0; i < len; i++) bufferData[offset + i] = this._data[i];
    }



}