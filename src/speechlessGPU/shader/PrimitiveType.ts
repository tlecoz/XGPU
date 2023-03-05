import { mat2, mat2d, mat3, mat4, vec3 } from "gl-matrix";
import { GPUType } from "../GPUType";
import { UniformBuffer } from "./resources/UniformBuffer";

export type PrimitiveType = PrimitiveFloatUniform | PrimitiveIntUniform | PrimitiveUintUniform;

export class PrimitiveFloatUniform extends Float32Array {

    //public uniform: Uniform;
    public name: string;
    public type: GPUType;
    public startId: number = 0;
    public mustBeTransfered: boolean = true;
    public uniformBuffer: UniformBuffer;


    constructor(type: string, val: number[] | Float32Array) {
        super(val);
        this.type = new GPUType(type);
    }

}


export class PrimitiveIntUniform extends Int32Array {


    public name: string;
    public type: GPUType;
    public startId: number = 0;
    public mustBeTransfered: boolean = true;
    public uniformBuffer: UniformBuffer;

    constructor(type: string, val: number[] | Int32Array) {
        super(val);
        this.type = new GPUType(type);
    }

}


export class PrimitiveUintUniform extends Uint32Array {

    public name: string;
    public type: GPUType;
    public startId: number = 0;
    public mustBeTransfered: boolean = true;
    public uniformBuffer: UniformBuffer;
    constructor(type: string, val: number[] | Uint32Array) {
        super(val);
        this.type = new GPUType(type);
    }

}

//--------------

export class Float extends PrimitiveFloatUniform {

    constructor(x: number = 0) {
        super("f32", [x]);
    }

    public set x(n: number) {
        this[0] = n;
        this.mustBeTransfered = true;
    }
    public get x(): number {
        return this[0];
    }
}

//--------------

export class Vec2 extends PrimitiveFloatUniform {

    constructor(x: number = 0, y: number = 0) {
        super("vec2<f32>", [x, y]);
    }

    public set x(n: number) {
        this[0] = n;
        this.mustBeTransfered = true;
    }

    public set y(n: number) {
        this[1] = n;
        this.mustBeTransfered = true;
    }

    public get x(): number { return this[0]; }
    public get y(): number { return this[1]; }
}

//--------------

export class Vec3 extends PrimitiveFloatUniform {

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        super("vec3<f32>", [x, y, z]);
    }

    public set x(n: number) {
        this[0] = n;
        this.mustBeTransfered = true;
    }

    public set y(n: number) {
        this[1] = n;
        this.mustBeTransfered = true;
    }

    public set z(n: number) {
        this[2] = n;
        this.mustBeTransfered = true;
    }

    public get x(): number { return this[0]; }
    public get y(): number { return this[1]; }
    public get z(): number { return this[2]; }
}

//--------------

export class Vec4 extends PrimitiveFloatUniform {

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
        super("vec4<f32>", [x, y, z, w]);
    }

    public set x(n: number) {
        this[0] = n;
        this.mustBeTransfered = true;
    }

    public set y(n: number) {
        this[1] = n;
        this.mustBeTransfered = true;
    }


    public set z(n: number) {
        this[2] = n;
        this.mustBeTransfered = true;
    }


    public set w(n: number) {
        this[3] = n;
        this.mustBeTransfered = true;
    }


    public get x(): number { return this[0]; }
    public get y(): number { return this[1]; }
    public get z(): number { return this[2]; }
    public get w(): number { return this[3]; }
}


//================================================================================



//--------------

export class Int extends PrimitiveIntUniform {

    constructor(x: number = 0) {
        super("i32", [x]);
    }

    public set x(n: number) {
        this[0] = n;
        this.mustBeTransfered = true;
    }

    public get x(): number { return this[0]; }

}

//--------------

export class IVec2 extends PrimitiveIntUniform {

    constructor(x: number = 0, y: number = 0) {
        super("vec2<i32>", [x, y]);
    }

    public set x(n: number) {
        this[0] = n;
        this.mustBeTransfered = true;
    }

    public set y(n: number) {
        this[1] = n;
        this.mustBeTransfered = true;
    }

    public get x(): number { return this[0]; }
    public get y(): number { return this[1]; }
}

//--------------

export class IVec3 extends PrimitiveIntUniform {

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        super("vec3<i32>", [x, y, z]);
    }

    public set x(n: number) {
        this[0] = n;
        this.mustBeTransfered = true;
    }

    public set y(n: number) {
        this[1] = n;
        this.mustBeTransfered = true;
    }


    public set z(n: number) {
        this[2] = n;
        this.mustBeTransfered = true;
    }

    public get x(): number { return this[0]; }
    public get y(): number { return this[1]; }
    public get z(): number { return this[2]; }

}

//--------------

export class IVec4 extends PrimitiveIntUniform {

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
        super("vec4<i32>", [x, y, z, w]);
    }

    public set x(n: number) {
        this[0] = n;
        this.mustBeTransfered = true;
    }

    public set y(n: number) {
        this[1] = n;
        this.mustBeTransfered = true;
    }


    public set z(n: number) {
        this[2] = n;
        this.mustBeTransfered = true;
    }


    public set w(n: number) {
        this[3] = n;
        this.mustBeTransfered = true;
    }


    public get x(): number { return this[0]; }
    public get y(): number { return this[1]; }
    public get z(): number { return this[2]; }
    public get w(): number { return this[3]; }
}

//================================================================================



//--------------

export class Uint extends PrimitiveUintUniform {

    constructor(x: number = 0) {
        super("u32", [x]);
    }

    public set x(n: number) {
        this[0] = n;
        this.mustBeTransfered = true;
    }

    public get x(): number { return this[0]; }

}

//--------------

export class UVec2 extends PrimitiveUintUniform {

    constructor(x: number = 0, y: number = 0) {
        super("vec2<u32>", [x, y]);
    }

    public set x(n: number) {
        this[0] = n;
        this.mustBeTransfered = true;
    }

    public set y(n: number) {
        this[1] = n;
        this.mustBeTransfered = true;
    }

    public get x(): number { return this[0]; }
    public get y(): number { return this[1]; }
}

//--------------

export class UVec3 extends PrimitiveUintUniform {

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        super("vec3<u32>", [x, y, z]);
    }

    public set x(n: number) {
        this[0] = n;
        this.mustBeTransfered = true;
    }

    public set y(n: number) {
        this[1] = n;
        this.mustBeTransfered = true;
    }


    public set z(n: number) {
        this[2] = n;
        this.mustBeTransfered = true;
    }

    public get x(): number { return this[0]; }
    public get y(): number { return this[1]; }
    public get z(): number { return this[2]; }
}

//--------------

export class UVec4 extends PrimitiveUintUniform {

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
        super("vec4<u32>", [x, y, z, w]);
    }

    public set x(n: number) {
        this[0] = n;
        this.mustBeTransfered = true;
    }

    public set y(n: number) {
        this[1] = n;
        this.mustBeTransfered = true;
    }


    public set z(n: number) {
        this[2] = n;
        this.mustBeTransfered = true;
    }


    public set w(n: number) {
        this[3] = n;
        this.mustBeTransfered = true;
    }


    public get x(): number { return this[0]; }
    public get y(): number { return this[1]; }
    public get z(): number { return this[2]; }
    public get w(): number { return this[3]; }
}

//==========================================================================

export class Vec4Array extends PrimitiveFloatUniform {

    constructor(vec4Array: Vec4[]) {
        let buf: Float32Array = new Float32Array(vec4Array.length * 4);
        for (let i = 0; i < vec4Array.length; i++) buf.set(vec4Array[i], i * 4);
        super("array<vec4<f32>," + vec4Array.length + ">", buf)
    }


}

export class IVec4Array extends PrimitiveIntUniform {

    constructor(vec4Array: IVec4[]) {
        let buf: Int32Array = new Int32Array(vec4Array.length * 4);
        for (let i = 0; i < vec4Array.length; i++) buf.set(vec4Array[i], i * 4);
        super("array<vec4<i32>," + vec4Array.length + ">", buf)
    }


}

export class UVec4Array extends PrimitiveUintUniform {

    constructor(vec4Array: UVec4[]) {
        let buf: Uint32Array = new Uint32Array(vec4Array.length * 4);
        for (let i = 0; i < vec4Array.length; i++) buf.set(vec4Array[i], i * 4);
        super("array<vec4<i32>," + vec4Array.length + ">", buf)
    }

}


//==============================================================

export class Matrix3x3 extends PrimitiveFloatUniform {
    constructor() {
        super("mat3x3<f32>", mat3.create());
    }
}

export class Matrix2x2 extends PrimitiveFloatUniform {
    constructor() {
        super("mat2x2<f32>", mat2.create());
    }
}

export class Matrix2x3 extends PrimitiveFloatUniform {
    constructor() {
        super("mat2x3<f32>", mat2d.create());
    }
}

export class Matrix4x4 extends PrimitiveFloatUniform {

    protected mustUpdate: boolean = false;

    protected _x: number = 0;
    protected _y: number = 0;
    protected _z: number = 0;

    protected _sx: number = 1;
    protected _sy: number = 1;
    protected _sz: number = 1;

    protected _rx: number = 0;
    protected _ry: number = 0;
    protected _rz: number = 0;

    constructor(floatArray: Float32Array = null) {
        if (!floatArray) floatArray = mat4.create() as Float32Array;
        super("mat4x4<f32>", floatArray);
    }

    public get x(): number { return this._x; }
    public get y(): number { return this._y; }
    public get z(): number { return this._z; }

    public get rotationX(): number { return this._rx; }
    public get rotationY(): number { return this._ry; }
    public get rotationZ(): number { return this._rz; }

    public get scaleX(): number { return this._sx; }
    public get scaleY(): number { return this._sy; }
    public get scaleZ(): number { return this._sz; }


    public set x(n: number) {
        if (n === this._x) return;
        this.mustBeTransfered = true;
        this._x = n;
    }

    public set y(n: number) {
        if (n === this._y) return;
        this.mustBeTransfered = true;
        this._y = n;
    }

    public set z(n: number) {
        if (n === this._z) return;
        this.mustBeTransfered = true;
        this._z = n;

    }

    public set rotationX(n: number) {
        if (n === this._rx) return;
        this.mustBeTransfered = true;
        this._rx = n;
    }

    public set rotationY(n: number) {
        if (n === this._ry) return;
        this.mustBeTransfered = true;
        this._ry = n;
    }

    public set rotationZ(n: number) {
        if (n === this._rz) return;
        this.mustBeTransfered = true;
        this._rz = n;
    }

    public set scaleX(n: number) {
        if (n === this._sx) return;
        this.mustBeTransfered = true;
        this._sx = n;
    }

    public set scaleY(n: number) {
        if (n === this._sy) return;
        this.mustBeTransfered = true;
        this._sy = n;
    }

    public set scaleZ(n: number) {
        if (n === this._sz) return;
        this.mustBeTransfered = true;
        this._sz = n;
    }

    public setMatrix(mat: Float32Array) {
        this.set(mat);
        this.mustBeTransfered = true;
    }


}

//--------------------

export class Matrix4x4Array extends PrimitiveFloatUniform {
    constructor(mat4x4Array: Matrix4x4[]) {
        let buf: Float32Array = new Float32Array(mat4x4Array.length * 16);
        for (let i = 0; i < mat4x4Array.length; i++) buf.set(mat4x4Array[i], i * 16);
        super("array<mat4x4<f32>," + mat4x4Array.length + ">", buf)
    }


}

