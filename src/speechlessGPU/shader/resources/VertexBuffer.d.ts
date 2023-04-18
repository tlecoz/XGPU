/// <reference types="dist" />
import { ShaderStruct } from "../shaderParts/ShaderStruct";
import { IShaderResource } from "./IShaderResource";
import { VertexAttribute } from "./VertexAttribute";
export type VertexBufferDescriptor = {
    stepMode?: "vertex" | "instance";
    accessMode?: "read" | "read_write";
    usage?: GPUBufferUsageFlags;
    datas?: Float32Array;
};
export declare class VertexBuffer implements IShaderResource {
    static Float(datas?: number[][] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[][];
    };
    static Vec2(datas?: number[][] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[][];
    };
    static Vec3(datas?: number[][] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[][];
    };
    static Vec4(datas?: number[][] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[][];
    };
    static Int(datas?: number[][] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[][];
    };
    static IVec2(datas?: number[][] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[][];
    };
    static IVec3(datas?: number[][] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[][];
    };
    static IVec4(datas?: number[][] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[][];
    };
    static Uint(datas?: number[][] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[][];
    };
    static UVec2(datas?: number[][] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[][];
    };
    static UVec3(datas?: number[][] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[][];
    };
    static UVec4(datas?: number[][] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[][];
    };
    io: number;
    mustBeTransfered: boolean;
    vertexArrays: VertexAttribute[];
    attributes: any;
    gpuResource: GPUBuffer;
    descriptor: VertexBufferDescriptor;
    private _nbComponent;
    private _datas;
    nbComponentData: number;
    attributeChanged: boolean;
    constructor(attributes: any, descriptor?: {
        stepMode?: "vertex" | "instance";
        datas?: Float32Array;
    });
    clone(): VertexBuffer;
    protected gpuBufferIOs: GPUBuffer[];
    protected gpuBufferIO_index: number;
    initBufferIO(buffers: GPUBuffer[]): void;
    get buffer(): GPUBuffer;
    getCurrentBuffer(): GPUBuffer;
    get length(): number;
    get nbComponent(): number;
    get nbVertex(): number;
    get datas(): Float32Array;
    set datas(f: Float32Array);
    setComplexDatas(datas: Float32Array, nbComponentTotal: number): void;
    protected mustRefactorData: boolean;
    protected refactorInfos: {
        nbCompo: number;
        nbEmpty: number;
    }[];
    private refactorData;
    get attributeDescriptor(): any;
    private _byteCount;
    createArray(name: string, dataType: string, offset?: number): VertexAttribute;
    getAttributeByName(name: string): VertexAttribute;
    createDeclaration(vertexBufferName: string, bindingId: number, groupId?: number, isInput?: boolean): string;
    createBindGroupLayoutEntry(bindingId: number): any;
    createBindGroupEntry(bindingId: number): any;
    protected canRefactorData: boolean;
    setPipelineType(pipelineType: "compute" | "render" | "compute_mixed"): void;
    createStruct(name: string): ShaderStruct;
    createVertexBufferLayout(builtinOffset?: number): any;
    protected _bufferSize: number;
    get bufferSize(): number;
    createGpuResource(): void;
    destroyGpuResource(): void;
    updateBuffer(): void;
    getVertexArrayById(id: number): VertexAttribute;
    protected updateAttributes(): void;
    update(): boolean;
}
