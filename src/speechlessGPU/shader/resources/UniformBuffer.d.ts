/// <reference types="dist" />
import { PrimitiveType } from "../PrimitiveType";
import { ShaderStruct } from "../shaderParts/ShaderStruct";
import { IShaderResource } from "./IShaderResource";
export type UniformBufferDescriptor = {
    useLocalVariable?: boolean;
    visibility?: GPUShaderStageFlags;
};
export declare class UniformBuffer implements IShaderResource {
    mustBeTransfered: boolean;
    gpuResource: GPUBuffer;
    descriptor: UniformBufferDescriptor;
    protected uniforms: PrimitiveType[];
    protected byteSize: number;
    protected _nbComponent: number;
    protected _data: Float32Array;
    protected _items: any;
    protected _itemNames: string[];
    protected uniformAlignmentReady: boolean;
    constructor(items: any, descriptor?: {
        useLocalVariable?: boolean;
        visibility?: GPUShaderStageFlags;
    });
    clone(propertyNames?: string[]): UniformBuffer;
    add(name: string, data: PrimitiveType): PrimitiveType;
    private setupUniformAlignment;
    update(): void;
    createStruct(uniformName: string): ShaderStruct;
    createDeclaration(uniformName: string, bindingId: number, groupId?: number): string;
    getUniformById(id: number): PrimitiveType;
    getUniformByName(name: string): PrimitiveType;
    createGpuResource(): any;
    destroyGpuResource(): void;
    createBindGroupLayoutEntry(bindingId: number): {
        binding: number;
        visibility: number;
        buffer: {
            type: string;
        };
    };
    createBindGroupEntry(bindingId: number): {
        binding: number;
        resource: {
            buffer: GPUBuffer;
        };
    };
    get items(): any;
    get itemNames(): string[];
    get nbComponent(): number;
    get nbUniforms(): number;
    setPipelineType(pipelineType: "compute" | "render" | "compute_mixed"): void;
}
