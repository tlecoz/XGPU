/// <reference types="dist" />
import { UniformBuffer } from "./UniformBuffer";
import { UniformGroup } from "./UniformGroup";
export declare class UniformGroupArray {
    groups: UniformGroup[];
    startId: number;
    createVariableInsideMain: boolean;
    mustBeTransfered: boolean;
    name: string;
    protected buffer: UniformBuffer;
    get uniformBuffer(): UniformBuffer;
    set uniformBuffer(buffer: UniformBuffer);
    constructor(groups: UniformGroup[], createLocalVariable?: boolean);
    clone(): UniformGroupArray;
    get type(): any;
    copyIntoDataView(dataView: DataView, offset: number): void;
    protected getStructName(name: string): string;
    protected getVarName(name: string): string;
    createVariable(uniformBufferName: string): string;
    update(gpuResource: GPUBuffer, fromUniformBuffer?: boolean): void;
    forceUpdate(): void;
    getElementById(id: number): UniformGroup;
    get length(): number;
    get arrayStride(): number;
    get isArray(): boolean;
    get isUniformGroup(): boolean;
}
