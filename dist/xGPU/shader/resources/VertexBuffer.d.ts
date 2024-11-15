/// <reference types="dist" />
import { ShaderStruct } from "../shaderParts/ShaderStruct";
import { IShaderResource } from "./IShaderResource";
import { VertexAttribute } from "./VertexAttribute";
import { VertexBufferIO } from "./VertexBufferIO";
import { StageableBuffer } from "./StageableBuffer";
export type VertexBufferDescriptor = {
    stepMode?: "vertex" | "instance";
    accessMode?: "read" | "read_write";
    usage?: GPUBufferUsageFlags;
    datas?: Float32Array | Int32Array | Uint32Array | Uint16Array;
};
export declare class VertexBuffer extends StageableBuffer implements IShaderResource {
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
        accessMode?: "read" | "read_write";
        usage?: GPUBufferUsageFlags;
        datas?: Float32Array | Int32Array | Uint32Array | Uint16Array;
        gpuUpdateMode?: "auto" | "manual";
    });
    clone(): VertexBuffer;
    protected gpuBufferIOs: GPUBuffer[];
    protected gpuBufferIO_index: number;
    initBufferIO(buffers: GPUBuffer[]): void;
    get buffer(): GPUBuffer;
    getCurrentBuffer(): GPUBuffer;
    get stepMode(): "vertex" | "instance";
    get length(): number;
    get nbComponent(): number;
    get nbVertex(): number;
    get datas(): Float32Array | Int32Array | Uint32Array | Uint16Array;
    set datas(f: Float32Array | Int32Array | Uint32Array | Uint16Array);
    setComplexDatas(datas: Float32Array | Int32Array | Uint32Array, nbComponentTotal: number): void;
    get attributeDescriptor(): any;
    private _byteCount;
    createArray(name: string, dataType: string, offset?: number): VertexAttribute;
    getAttributeByName(name: string): VertexAttribute;
    createDeclaration(vertexBufferName: string, bindingId: number, groupId?: number, isInput?: boolean): string;
    debug: boolean;
    createBindGroupLayoutEntry(bindingId: number): any;
    createBindGroupEntry(bindingId: number): any;
    protected pipelineType: "compute" | "render" | "compute_mixed";
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
    lowLevelBuffer: boolean;
    createLowLevelBuffer(bufferSize: number, accessMode?: "read" | "read_write", usage?: number): void;
    resizeLowLevelBuffer(byteLength: number, copyPreviousDataWithin?: boolean): void;
    updateLowLevelBuffer(buffer: ArrayBuffer, bufferOffset: number, dataOffset?: number, size?: number): void;
    protected _bufferSize: number;
    protected deviceId: number;
    get bufferSize(): number;
    createGpuResource(): void;
    time: number;
    protected destroyed: boolean;
    destroyGpuResource(): void;
    updateBuffer(): void;
    getVertexArrayById(id: number): VertexAttribute;
    protected updateAttributes(): void;
    update(): boolean;
}
