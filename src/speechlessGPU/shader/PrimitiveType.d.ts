import { GPUType } from "../GPUType";
import { UniformBuffer } from "./resources/UniformBuffer";
export type PrimitiveType = PrimitiveFloatUniform | PrimitiveIntUniform | PrimitiveUintUniform;
export declare class PrimitiveFloatUniform extends Float32Array {
    name: string;
    type: GPUType;
    startId: number;
    mustBeTransfered: boolean;
    uniformBuffer: UniformBuffer;
    propertyNames: string[];
    createVariableInsideMain: boolean;
    protected className: string;
    constructor(type: string, val: number[] | Float32Array, createLocalVariable?: boolean);
    clone(): PrimitiveFloatUniform;
    initStruct(propertyNames: string[], createVariableInsideMain?: boolean): void;
    createStruct(): string;
    set(m: Float32Array, offset?: number): void;
    createVariable(uniformBufferName: string): string;
    update(): void;
}
export declare class PrimitiveIntUniform extends Int32Array {
    name: string;
    type: GPUType;
    startId: number;
    mustBeTransfered: boolean;
    uniformBuffer: UniformBuffer;
    propertyNames: string[];
    createVariableInsideMain: boolean;
    protected className: string;
    constructor(type: string, val: number[] | Int32Array, createLocalVariable?: boolean);
    clone(): PrimitiveIntUniform;
    initStruct(propertyNames: string[], createVariableInsideMain?: boolean): void;
    createStruct(): string;
    createVariable(uniformBufferName: string): string;
    update(): void;
}
export declare class PrimitiveUintUniform extends Uint32Array {
    name: string;
    type: GPUType;
    startId: number;
    mustBeTransfered: boolean;
    uniformBuffer: UniformBuffer;
    propertyNames: string[];
    createVariableInsideMain: boolean;
    protected className: string;
    constructor(type: string, val: number[] | Uint32Array, createLocalVariable?: boolean);
    clone(): PrimitiveUintUniform;
    initStruct(propertyNames: string[], createVariableInsideMain?: boolean): void;
    createStruct(): string;
    createVariable(uniformBufferName: string): string;
    update(): void;
}
export declare class Float extends PrimitiveFloatUniform {
    constructor(x?: number, createLocalVariable?: boolean);
    set x(n: number);
    get x(): number;
}
export declare class Vec2 extends PrimitiveFloatUniform {
    constructor(x?: number, y?: number, createLocalVariable?: boolean);
    set x(n: number);
    set y(n: number);
    get x(): number;
    get y(): number;
}
export declare class Vec3 extends PrimitiveFloatUniform {
    constructor(x?: number, y?: number, z?: number, createLocalVariable?: boolean);
    set x(n: number);
    set y(n: number);
    set z(n: number);
    get x(): number;
    get y(): number;
    get z(): number;
}
export declare class Vec4 extends PrimitiveFloatUniform {
    constructor(x?: number, y?: number, z?: number, w?: number, createLocalVariable?: boolean);
    set x(n: number);
    set y(n: number);
    set z(n: number);
    set w(n: number);
    get x(): number;
    get y(): number;
    get z(): number;
    get w(): number;
}
export declare class Int extends PrimitiveIntUniform {
    constructor(x?: number, createLocalVariable?: boolean);
    set x(n: number);
    get x(): number;
}
export declare class IVec2 extends PrimitiveIntUniform {
    constructor(x?: number, y?: number, createLocalVariable?: boolean);
    set x(n: number);
    set y(n: number);
    get x(): number;
    get y(): number;
}
export declare class IVec3 extends PrimitiveIntUniform {
    constructor(x?: number, y?: number, z?: number, createLocalVariable?: boolean);
    set x(n: number);
    set y(n: number);
    set z(n: number);
    get x(): number;
    get y(): number;
    get z(): number;
}
export declare class IVec4 extends PrimitiveIntUniform {
    constructor(x?: number, y?: number, z?: number, w?: number, createLocalVariable?: boolean);
    set x(n: number);
    set y(n: number);
    set z(n: number);
    set w(n: number);
    get x(): number;
    get y(): number;
    get z(): number;
    get w(): number;
}
export declare class Uint extends PrimitiveUintUniform {
    constructor(x?: number, createLocalVariable?: boolean);
    set x(n: number);
    get x(): number;
}
export declare class UVec2 extends PrimitiveUintUniform {
    constructor(x?: number, y?: number, createLocalVariable?: boolean);
    set x(n: number);
    set y(n: number);
    get x(): number;
    get y(): number;
}
export declare class UVec3 extends PrimitiveUintUniform {
    constructor(x?: number, y?: number, z?: number, createLocalVariable?: boolean);
    set x(n: number);
    set y(n: number);
    set z(n: number);
    get x(): number;
    get y(): number;
    get z(): number;
}
export declare class UVec4 extends PrimitiveUintUniform {
    constructor(x?: number, y?: number, z?: number, w?: number, createLocalVariable?: boolean);
    set x(n: number);
    set y(n: number);
    set z(n: number);
    set w(n: number);
    get x(): number;
    get y(): number;
    get z(): number;
    get w(): number;
}
export declare class Vec4Array extends PrimitiveFloatUniform {
    constructor(vec4Array: Vec4[]);
}
export declare class IVec4Array extends PrimitiveIntUniform {
    constructor(vec4Array: IVec4[]);
}
export declare class UVec4Array extends PrimitiveUintUniform {
    constructor(vec4Array: UVec4[]);
}
export declare class Matrix3x3 extends PrimitiveFloatUniform {
    constructor();
}
export declare class Matrix2x2 extends PrimitiveFloatUniform {
    constructor();
}
export declare class Matrix2x3 extends PrimitiveFloatUniform {
    constructor();
}
export declare class Matrix4x4 extends PrimitiveFloatUniform {
    protected _x: number;
    protected _y: number;
    protected _z: number;
    protected _sx: number;
    protected _sy: number;
    protected _sz: number;
    protected _rx: number;
    protected _ry: number;
    protected _rz: number;
    protected disableUpdate: boolean;
    constructor(floatArray?: Float32Array);
    get x(): number;
    get y(): number;
    get z(): number;
    get rotationX(): number;
    get rotationY(): number;
    get rotationZ(): number;
    get scaleX(): number;
    get scaleY(): number;
    get scaleZ(): number;
    set x(n: number);
    set y(n: number);
    set z(n: number);
    set rotationX(n: number);
    set rotationY(n: number);
    set rotationZ(n: number);
    set scaleX(n: number);
    set scaleY(n: number);
    set scaleZ(n: number);
    set scaleXYZ(n: number);
    setMatrix(mat: Float32Array): void;
    update(): void;
}
export declare class ModelViewMatrix extends Matrix4x4 {
    model: Matrix4x4;
    view: Matrix4x4;
    constructor();
    get x(): number;
    get y(): number;
    get z(): number;
    get rotationX(): number;
    get rotationY(): number;
    get rotationZ(): number;
    get scaleX(): number;
    get scaleY(): number;
    get scaleZ(): number;
    set x(n: number);
    set y(n: number);
    set z(n: number);
    set rotationX(n: number);
    set rotationY(n: number);
    set rotationZ(n: number);
    set scaleX(n: number);
    set scaleY(n: number);
    set scaleZ(n: number);
    set(m: Float32Array, offset?: number): void;
    setMatrix(mat: Float32Array): void;
    update(): void;
}
export declare class Matrix4x4Array extends PrimitiveFloatUniform {
    matrixs: Matrix4x4[];
    constructor(mat4x4Array: Matrix4x4[]);
    update(): void;
}
