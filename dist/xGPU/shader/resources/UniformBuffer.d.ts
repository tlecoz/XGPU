/// <reference types="dist" />
import { PrimitiveType } from "../../PrimitiveType";
import { IShaderResource } from "./IShaderResource";
import { UniformGroup, Uniformable } from "./UniformGroup";
export type UniformBufferDescriptor = {
    useLocalVariable?: boolean;
    visibility?: GPUShaderStageFlags;
};
export declare class UniformBuffer implements IShaderResource {
    gpuResource: GPUBuffer;
    descriptor: UniformBufferDescriptor;
    group: UniformGroup;
    get mustBeTransfered(): boolean;
    set mustBeTransfered(b: boolean);
    constructor(items: any, descriptor?: {
        useLocalVariable?: boolean;
        visibility?: GPUShaderStageFlags;
    });
    cloned: boolean;
    clone(propertyNames?: string[]): UniformBuffer;
    add(name: string, data: PrimitiveType, useLocalVariable?: boolean): Uniformable;
    remove(name: string): Uniformable;
    update(): void;
    createStruct(uniformName: string): {
        struct: string;
        localVariables: string;
    };
    createDeclaration(uniformName: string, bindingId: number, groupId?: number): string;
    getUniformById(id: number): Uniformable;
    getUniformByName(name: string): Uniformable;
    protected _bufferType: "read-only-storage" | "uniform";
    get bufferType(): "read-only-storage" | "uniform";
    createGpuResource(): any;
    getItemsAsArray(): any[];
    time: number;
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
    protected _usage: number;
    protected debug: string;
    protected shaderVisibility: GPUShaderStageFlags;
    protected pipelineType: "compute" | "render" | "compute_mixed";
    setPipelineType(pipelineType: "compute" | "render" | "compute_mixed"): void;
}
