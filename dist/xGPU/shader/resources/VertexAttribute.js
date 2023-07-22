// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { GPUType } from "../../GPUType";
export class VertexAttribute {
    static Float(datas, offset) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        //console.log("offset = ", datas, offset)
        return { type: "float32", offset, datas };
    }
    static Vec2(datas, offset) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "float32x2", offset, datas };
    }
    static Vec3(datas, offset) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "float32x3", offset, datas };
    }
    static Vec4(datas, offset) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "float32x4", offset, datas };
    }
    static Int(datas, offset) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "sint32", offset, datas };
    }
    static IVec2(datas, offset) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "sint32x2", offset, datas };
    }
    static IVec3(datas, offset) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "sint32x3", offset, datas };
    }
    static IVec4(datas, offset) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "sint32x4", offset, datas };
    }
    static Uint(datas, offset) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "uint32", offset, datas };
    }
    static UVec2(datas, offset) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "uint32x2", offset, datas };
    }
    static UVec3(datas, offset) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "uint32x3", offset, datas };
    }
    static UVec4(datas, offset) {
        if (datas && !offset) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        return { type: "uint32x4", offset, datas };
    }
    static get types() {
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
        };
    }
    _name;
    _dataType;
    nbValues;
    vertexType;
    _data;
    dataOffset;
    mustBeTransfered = false;
    vertexBuffer;
    constructor(name, dataType, offset) {
        dataType = this.renameVertexDataType(dataType);
        this._name = name;
        this._dataType = dataType;
        this.dataOffset = offset;
        if (VertexAttribute.types[dataType]) {
            this.vertexType = VertexAttribute.types[dataType];
            this.nbValues = this.vertexType.nbComponent;
        }
        else {
            const infos = new GPUType(dataType);
            this.nbValues = infos.nbValues;
            this.vertexType = this.getVertexDataType(infos.dataType);
        }
    }
    get datas() { return this._data; }
    set datas(n) {
        if (this._data != n) {
            this._data = n;
            this.vertexBuffer.attributeChanged = true;
            this.mustBeTransfered = true;
        }
    }
    get useByVertexData() { return typeof this._data[0] != "number"; }
    get format() { return this._dataType; }
    get bytePerElement() { return this.vertexType.bytes; }
    get varType() { return this.vertexType.varType; }
    get name() { return this._name; }
    get nbComponent() { return this.nbValues; }
    renameVertexDataType(type) {
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
    getVertexDataType(dataType) {
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
                throw new Error("GPUVertexAttribute.getVertexDataType error : dataInfo doesn't represent a correct VertexAttribute data-type");
        }
    }
}
