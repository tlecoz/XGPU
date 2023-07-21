/// <reference types="dist" />
import { ShaderStruct } from "../shaderParts/ShaderStruct";
import { IShaderResource } from "./IShaderResource";
import { VertexAttribute } from "./VertexAttribute";
import { VertexBufferIO } from "./VertexBufferIO";
export type VertexBufferDescriptor = {
    stepMode?: "vertex" | "instance";
    accessMode?: "read" | "read_write";
    usage?: GPUBufferUsageFlags;
    datas?: Float32Array | Int32Array | Uint32Array;
};
export declare class VertexBuffer implements IShaderResource {
    bufferId: number;
    io: number;
    resourceIO: VertexBufferIO;
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
        datas?: Float32Array | Int32Array | Uint32Array;
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
    get datas(): Float32Array | Int32Array | Uint32Array;
    set datas(f: Float32Array | Int32Array | Uint32Array);
    setComplexDatas(datas: Float32Array | Int32Array | Uint32Array, nbComponentTotal: number): void;
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
    arrayStride: number;
    stackAttributes(builtinOffset?: number): {
        stepMode: "instance" | "vertex";
        arrayStride: number;
        attributes: any[];
    };
    addVertexInstance(instanceId: number, o: any): void;
    protected layout: any;
    createVertexBufferLayout(builtinOffset?: number): any;
    protected _bufferSize: number;
    get bufferSize(): number;
    createGpuResource(): void;
    time: number;
    destroyGpuResource(): void;
    updateBuffer(): void;
    getVertexArrayById(id: number): VertexAttribute;
    protected updateAttributes(): void;
    update(): boolean;
}