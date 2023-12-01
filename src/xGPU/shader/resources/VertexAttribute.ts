// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { GPUType } from "../../GPUType";
import { VertexBuffer } from "./VertexBuffer";

export class VertexAttribute {



    public static Float(datas?: number[][] | number[] | number, offset?: number) {


        if (datas != undefined && offset === undefined) {

            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        //console.log("offset = ", datas, offset)
        return { type: "float32", offset, datas }
    }
    public static Vec2(datas?: number[][] | number[] | number, offset?: number) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "float32x2", offset, datas }
    }
    public static Vec3(datas?: number[][] | number[] | number, offset?: number) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "float32x3", offset, datas }
    }
    public static Vec4(datas?: number[][] | number[] | number, offset?: number) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "float32x4", offset, datas }
    }

    public static Int(datas?: number[][] | number[] | number, offset?: number) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "sint32", offset, datas }
    }
    public static IVec2(datas?: number[][] | number[] | number, offset?: number) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "sint32x2", offset, datas }
    }
    public static IVec3(datas?: number[][] | number[] | number, offset?: number) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "sint32x3", offset, datas }
    }
    public static IVec4(datas?: number[][] | number[] | number, offset?: number) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "sint32x4", offset, datas }
    }

    public static Uint(datas?: number[][] | number[] | number, offset?: number) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "uint32", offset, datas }
    }
    public static UVec2(datas?: number[][] | number[] | number, offset?: number) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "uint32x2", offset, datas }
    }
    public static UVec3(datas?: number[][] | number[] | number, offset?: number) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "uint32x3", offset, datas }
    }
    public static UVec4(datas?: number[][] | number[] | number, offset?: number) {
        if (datas && !offset) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "uint32x4", offset, datas }
    }



    public static get types(): any {
        return {
            "uint8x2": { nbComponent: 2, bytes: 2, varType: "vec2<u32>" },
            "uint8x4": { nbComponent: 4, bytes: 4, varType: "vec4<u32>" },
            "sint8x2": { nbComponent: 2, bytes: 2, varType: "vec2<i32>" },
            "sint8x4": { nbComponent: 4, bytes: 4, varType: "vec4<i32>" },

            "unorm8x2": { nbComponent: 2, bytes: 2, varType: "vec2<f32>" },
            "unorm8x4": { nbComponent: 4, bytes: 4, varType: "vec4<f32>" },

            "snorm8x2": { nbComponent: 2, bytes: 2, varType: "vec2<f32>" },
            "snorm8x4": { nbComponent: 4, bytes: 4, varType: "vec4<f32>" },

            "uint16x2": { nbComponent: 2, bytes: 4, varType: "vec2<u32>" },
            "uint16x4": { nbComponent: 4, bytes: 8, varType: "vec4<u32>" },

            "sint16x2": { nbComponent: 2, bytes: 4, varType: "vec2<i32>" },
            "sint16x4": { nbComponent: 4, bytes: 8, varType: "vec4<i32>" },

            "unorm16x2": { nbComponent: 2, bytes: 4, varType: "vec2<f32>" },
            "unorm16x4": { nbComponent: 4, bytes: 8, varType: "vec4<f32>" },

            "snorm16x2": { nbComponent: 2, bytes: 4, varType: "vec2<f32>" },
            "snorm16x4": { nbComponent: 4, bytes: 8, varType: "vec4<f32>" },

            "float16x2": { nbComponent: 2, bytes: 4, varType: "vec2<f16>" },
            "float16x4": { nbComponent: 4, bytes: 8, varType: "vec4<f16>" },

            "float32": { nbComponent: 1, bytes: 4, varType: "f32" },
            "float32x2": { nbComponent: 2, bytes: 8, varType: "vec2<f32>" },
            "float32x3": { nbComponent: 3, bytes: 12, varType: "vec3<f32>" },
            "float32x4": { nbComponent: 4, bytes: 16, varType: "vec4<f32>" },

            "uint32": { nbComponent: 1, bytes: 4, varType: "u32" },
            "uint32x2": { nbComponent: 2, bytes: 8, varType: "vec2<u32>" },
            "uint32x3": { nbComponent: 3, bytes: 12, varType: "vec3<u32>" },
            "uint32x4": { nbComponent: 4, bytes: 16, varType: "vec4<u32>" },

            "sint32": { nbComponent: 1, bytes: 4, varType: "i32" },
            "sint32x2": { nbComponent: 2, bytes: 8, varType: "vec2<i32>" },
            "sint32x3": { nbComponent: 3, bytes: 12, varType: "vec3<i32>" },
            "sint32x4": { nbComponent: 4, bytes: 16, varType: "vec4<i32>" },
        }
    }


    private _name: string;
    private _dataType: string;
    private nbValues: number;
    private vertexType: { name: string, nbComponent: number, bytes: number, varType: string };

    private _data: number[][] | number[];
    public dataOffset: number;
    public mustBeTransfered: boolean = false;

    protected _vertexBuffer: VertexBuffer;






    constructor(name: string, dataType: string, offset?: number) {

        dataType = this.renameVertexDataType(dataType);

        this._name = name;
        this._dataType = dataType;
        this.dataOffset = offset;

        if (VertexAttribute.types[dataType]) {
            this.vertexType = VertexAttribute.types[dataType];
            this.nbValues = this.vertexType.nbComponent;
        } else {

            const infos = new GPUType(dataType);
            this.nbValues = infos.nbValues;
            this.vertexType = this.getVertexDataType(infos.dataType)
        }
    }


    protected waitingVertexBuffer: boolean = false;
    public get vertexBuffer(): VertexBuffer { return this._vertexBuffer; }
    public set vertexBuffer(vb: VertexBuffer) {
        this._vertexBuffer = vb;
        if (this.waitingVertexBuffer) {
            this.waitingVertexBuffer = true;
            this.vertexBuffer.attributeChanged = true;
        }
    }



    public get datas(): number[][] | number[] { return this._data }
    public set datas(n: number[][] | number[]) {
        if (this._data != n) {
            this._data = n;
            if (this.vertexBuffer) this.vertexBuffer.attributeChanged = true;
            else this.waitingVertexBuffer = true;
            this.mustBeTransfered = true;
        }
    }


    public get useByVertexData(): boolean { return typeof this._data[0] != "number" }

    public get format(): string { return this._dataType }

    public get type(): string {//---------------------------
        //this function will be used in HighLevelParser. 
        //It mimic the existing structure using VertexAttribute.Float instead of FloatBuffer
        return this._dataType;
    }//---------------------------------------------------

    public get bytePerElement(): number { return this.vertexType.bytes }
    public get varType(): string { return this.vertexType.varType }
    public get name(): string { return this._name; }
    public get nbComponent(): number { return this.nbValues; }


    private renameVertexDataType(type: string): string {
        switch (type) {
            case "float":
                return "float32";
            case "vec2":
                return "float32x2";
            case "vec3":
                return "float32x3";
            case "vec4":
                return "float32x4";

            case "int":
                return "sint32";
            case "ivec2":
                return "sint32x2";
            case "ivec3":
                return "sint32x3";
            case "ivec4":
                return "sint32x4";


            case "uint":
                return "uint32";
            case "uvec2":
                return "uint32x2";
            case "uvec3":
                return "uint32x3";
            case "uvec4":
                return "uint32x4";

        }
        return type;
    }


    private getVertexDataType(dataType: string): { name: string, nbComponent: number, bytes: number, varType: string } {

        switch (dataType) {

            case "u32":
                return { name: "uint32", nbComponent: 1, bytes: 4, varType: "u32" };
            case "vec2<u32>":
                return { name: "uint32x2", nbComponent: 2, bytes: 8, varType: "vec2<u32>" };
            case "vec3<u32>":
                return { name: "uint32x3", nbComponent: 3, bytes: 12, varType: "vec3<u32>" };
            case "vec4<u32>":
                return { name: "uint32x4", nbComponent: 4, bytes: 16, varType: "vec4<u32>" };

            case "i32":
                return { name: "sint32", nbComponent: 1, bytes: 4, varType: "i32" };
            case "vec2<i32>":
                return { name: "sint32x2", nbComponent: 2, bytes: 8, varType: "vec2<i32>" };
            case "vec3<i32>":
                return { name: "sint32x3", nbComponent: 3, bytes: 12, varType: "vec3<i32>" };
            case "vec4<i32>":
                return { name: "sint32x4", nbComponent: 4, bytes: 16, varType: "vec4<i32>" };

            case "f32":
                return { name: "float32", nbComponent: 1, bytes: 4, varType: "f32" };
            case "vec2<f32>":
                return { name: "float32x2", nbComponent: 2, bytes: 8, varType: "vec2<f32>" };
            case "vec3<f32>":
                return { name: "float32x3", nbComponent: 3, bytes: 12, varType: "vec3<f32>" };
            case "vec4<f32>":
                return { name: "float32x4", nbComponent: 4, bytes: 16, varType: "vec4<f32>" };


            case "vec2<f16>":
                return { name: "float16x2", nbComponent: 2, bytes: 4, varType: "vec2<f16>" };
            case "vec4<f16>":
                return { name: "float16x4", nbComponent: 4, bytes: 8, varType: "vec4<f16>" };

            default:
                throw new Error("GPUVertexAttribute.getVertexDataType error : dataInfo doesn't represent a correct VertexAttribute data-type")

        }


    }

}