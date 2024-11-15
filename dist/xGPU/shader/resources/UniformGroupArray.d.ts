/// <reference types="dist" />
import { EventDispatcher } from "../../EventDispatcher";
import { UniformBuffer } from "./UniformBuffer";
import { UniformGroup } from "./UniformGroup";
export declare class UniformGroupArray extends EventDispatcher {
    static ON_CHANGE: string;
    static ON_CHANGED: string;
    groups: UniformGroup[];
    startId: number;
    globalStartId: number;
    createVariableInsideMain: boolean;
    name: string;
    mustBeTransfered: boolean;
    protected mustDispatchChangeEvent: boolean;
    protected buffer: UniformBuffer;
    get uniformBuffer(): UniformBuffer;
    set uniformBuffer(buffer: UniformBuffer);
    constructor(groups: UniformGroup[], createLocalVariable?: boolean);
    updateStartIdFromParentToChildren(): void;
    clone(): UniformGroupArray;
    get type(): any;
    copyIntoDataView(dataView: DataView, offset: number): void;
    protected getStructName(name: string): string;
    protected getVarName(name: string): string;
    createVariable(uniformBufferName: string): string;
    update(gpuResource: GPUBuffer): void;
    forceUpdate(): void;
    getElementById(id: number): UniformGroup;
    get length(): number;
    get arrayStride(): number;
    get isArray(): boolean;
    get isUniformGroup(): boolean;
    get definition(): {
        type: string;
        groups: any[];
        name: string;
    };
}
