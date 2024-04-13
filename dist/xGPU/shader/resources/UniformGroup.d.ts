/// <reference types="dist" />
import { PrimitiveFloatUniform, PrimitiveIntUniform, PrimitiveType, PrimitiveUintUniform } from "../../PrimitiveType";
import { UniformBuffer } from "./UniformBuffer";
import { UniformGroupArray } from "./UniformGroupArray";
export type Uniformable = PrimitiveFloatUniform | PrimitiveIntUniform | PrimitiveUintUniform | UniformGroup | UniformGroupArray;
export declare class UniformGroup {
    unstackedItems: any;
    items: Uniformable[];
    itemNames: string[];
    arrayStride: number;
    startId: number;
    createVariableInsideMain: boolean;
    mustBeTransfered: boolean;
    protected _name: string;
    wgsl: {
        struct: string;
        localVariables: string;
    };
    wgslStructNames: string[];
    datas: ArrayBuffer;
    dataView: DataView;
    set(datas: ArrayBuffer): void;
    protected buffer: UniformBuffer;
    get uniformBuffer(): UniformBuffer;
    set uniformBuffer(buffer: UniformBuffer);
    destroy(): void;
    constructor(items: any, useLocalVariable?: boolean);
    get name(): string;
    set name(s: string);
    clone(propertyNames?: string[]): UniformGroup;
    remove(name: string): Uniformable;
    add(name: string, data: Uniformable, useLocalVariable?: boolean, stackItems?: boolean): Uniformable;
    getElementByName(name: string): Uniformable;
    protected getStructName(name: string): string;
    protected getVarName(name: string): string;
    createVariable(uniformBufferName: string): string;
    updateStack(): void;
    forceUpdate(): void;
    get type(): any;
    setDatas(item: PrimitiveType, dataView?: DataView, offset?: number): void;
    copyIntoDataView(dataView: DataView, offset: number): void;
    update(gpuResource: GPUBuffer, fromUniformBuffer?: boolean): Promise<void>;
    getStruct(name: string): {
        struct: string;
        localVariables: string;
    };
    stackItems(items: any): Uniformable[];
}
