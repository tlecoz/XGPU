/// <reference types="dist" />
import { PrimitiveFloatUniform, PrimitiveIntUniform, PrimitiveType, PrimitiveUintUniform } from "../../PrimitiveType";
import { UniformBuffer } from "./UniformBuffer";
import { UniformGroupArray } from "./UniformGroupArray";
import { EventDispatcher } from "../../EventDispatcher";
export type Uniformable = PrimitiveFloatUniform | PrimitiveIntUniform | PrimitiveUintUniform | UniformGroup | UniformGroupArray;
export declare class UniformGroup extends EventDispatcher {
    static ON_CHANGE: string;
    static ON_CHANGED: string;
    unstackedItems: any;
    items: Uniformable[];
    itemNames: string[];
    arrayStride: number;
    startId: number;
    globalStartId: number;
    createVariableInsideMain: boolean;
    mustBeTransfered: boolean;
    protected mustDispatchChangeEvent: boolean;
    protected _name: string;
    wgsl: {
        struct: string;
        localVariables: string;
    };
    wgslStructNames: string[];
    datas: ArrayBuffer;
    dataView: DataView;
    private debug;
    set(datas: ArrayBuffer): void;
    protected buffer: UniformBuffer;
    get uniformBuffer(): UniformBuffer;
    set uniformBuffer(buffer: UniformBuffer);
    destroy(): void;
    protected usedAsUniformBuffer: boolean;
    constructor(items: any, useLocalVariable?: boolean, usedAsUniformBuffer?: boolean);
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
    updateItemFromDataView(dataView: DataView, offset: number): void;
    copyIntoDataView(dataView: DataView, offset: number): void;
    transfertWholeBuffer: boolean;
    update(gpuResource: GPUBuffer): Promise<void>;
    existingStrucName: string;
    getStruct(name: string): {
        struct: string;
        localVariables: string;
    };
    stackItems(items: any): Uniformable[];
    updateStartIdFromParentToChildren(): void;
    get definition(): {
        type: string;
        values: ArrayBuffer;
        items: any;
        name: string;
    };
}
