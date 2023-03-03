import { mat2, mat2d, mat3, mat4, vec3 } from "gl-matrix";

export class PrimitiveFloatUniform extends Float32Array {

    public mixedUniformData: Float32Array;
    public mixedUniformDataId: number;
    public mixed: boolean = false;

    protected _type: string;
    constructor(type: string, val: number[] | Float32Array) {
        super(val);
        this._type = type;
    }
    public get type(): string { return this._type; }
}

//--------------

export class Float extends PrimitiveFloatUniform {

    constructor(x: number = 0) {
        super("f32", [x]);
    }

    public set x(n: number) {
        if (!this.mixed) this[0] = n;
        else this.mixedUniformData[this.mixedUniformDataId] = n;
    }
    public get x(): number {
        if (!this.mixed) return this[0];
        else return this.mixedUniformData[this.mixedUniformDataId];
    }
}

//--------------

export class Vec2 extends PrimitiveFloatUniform {

    constructor(x: number = 0, y: number = 0) {
        super("vec2<f32>", [x, y]);
    }

    public set x(n: number) {
        if (!this.mixed) this[0] = n;
        else this.mixedUniformData[this.mixedUniformDataId] = n;
    }
    public get x(): number {
        if (!this.mixed) return this[0];
        else return this.mixedUniformData[this.mixedUniformDataId];
    }

    public set y(n: number) {
        if (!this.mixed) this[1] = n;
        else this.mixedUniformData[this.mixedUniformDataId + 1] = n;
    }
    public get y(): number {
        if (!this.mixed) return this[1];
        else return this.mixedUniformData[this.mixedUniformDataId + 1];
    }
}

//--------------

export class Vec3 extends PrimitiveFloatUniform {

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        super("vec3<f32>", [x, y, z]);
    }

    public set x(n: number) {
        if (!this.mixed) this[0] = n;
        else this.mixedUniformData[this.mixedUniformDataId] = n;
    }
    public get x(): number {
        if (!this.mixed) return this[0];
        else return this.mixedUniformData[this.mixedUniformDataId];
    }

    public set y(n: number) {
        if (!this.mixed) this[1] = n;
        else this.mixedUniformData[this.mixedUniformDataId + 1] = n;
    }
    public get y(): number {
        if (!this.mixed) return this[1];
        else return this.mixedUniformData[this.mixedUniformDataId + 1];
    }

    public set z(n: number) {
        if (!this.mixed) this[2] = n;
        else this.mixedUniformData[this.mixedUniformDataId + 2] = n;
    }
    public get z(): number {
        if (!this.mixed) return this[2];
        else return this.mixedUniformData[this.mixedUniformDataId + 2];
    }
}

//--------------

export class Vec4 extends PrimitiveFloatUniform {

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
        super("vec4<f32>", [x, y, z, w]);
    }

    public set x(n: number) {
        if (!this.mixed) this[0] = n;
        else this.mixedUniformData[this.mixedUniformDataId] = n;
    }
    public get x(): number {
        if (!this.mixed) return this[0];
        else return this.mixedUniformData[this.mixedUniformDataId];
    }

    public set y(n: number) {
        if (!this.mixed) this[1] = n;
        else this.mixedUniformData[this.mixedUniformDataId + 1] = n;
    }
    public get y(): number {
        if (!this.mixed) return this[1];
        else return this.mixedUniformData[this.mixedUniformDataId + 1];
    }

    public set z(n: number) {
        if (!this.mixed) this[2] = n;
        else this.mixedUniformData[this.mixedUniformDataId + 2] = n;
    }
    public get z(): number {
        if (!this.mixed) return this[2];
        else return this.mixedUniformData[this.mixedUniformDataId + 2];
    }

    public set w(n: number) {
        if (!this.mixed) this[3] = n;
        else this.mixedUniformData[this.mixedUniformDataId + 3] = n;
    }
    public get w(): number {
        if (!this.mixed) return this[3];
        else return this.mixedUniformData[this.mixedUniformDataId + 3];
    }
}


//================================================================================

export class PrimitiveIntUniform extends Int32Array {

    public mixedUniformData: Int32Array;
    public mixedUniformDataId: number;
    public mixed: boolean = false;

    protected _type: string;
    constructor(type: string, val: number[] | Int32Array) {
        super(val);
        this._type = type;
    }
    public get type(): string { return this._type; }
}

//--------------

export class Int extends PrimitiveIntUniform {

    constructor(x: number = 0) {
        super("i32", [x]);
    }

    public set x(n: number) {
        if (!this.mixed) this[0] = n;
        else this.mixedUniformData[this.mixedUniformDataId] = n;
    }
    public get x(): number {
        if (!this.mixed) return this[0];
        else return this.mixedUniformData[this.mixedUniformDataId];
    }
}

//--------------

export class IVec2 extends PrimitiveIntUniform {

    constructor(x: number = 0, y: number = 0) {
        super("vec2<i32>", [x, y]);
    }

    public set x(n: number) {
        if (!this.mixed) this[0] = n;
        else this.mixedUniformData[this.mixedUniformDataId] = n;
    }
    public get x(): number {
        if (!this.mixed) return this[0];
        else return this.mixedUniformData[this.mixedUniformDataId];
    }

    public set y(n: number) {
        if (!this.mixed) this[1] = n;
        else this.mixedUniformData[this.mixedUniformDataId + 1] = n;
    }
    public get y(): number {
        if (!this.mixed) return this[1];
        else return this.mixedUniformData[this.mixedUniformDataId + 1];
    }
}

//--------------

export class IVec3 extends PrimitiveIntUniform {

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        super("vec3<i32>", [x, y, z]);
    }

    public set x(n: number) {
        if (!this.mixed) this[0] = n;
        else this.mixedUniformData[this.mixedUniformDataId] = n;
    }
    public get x(): number {
        if (!this.mixed) return this[0];
        else return this.mixedUniformData[this.mixedUniformDataId];
    }

    public set y(n: number) {
        if (!this.mixed) this[1] = n;
        else this.mixedUniformData[this.mixedUniformDataId + 1] = n;
    }
    public get y(): number {
        if (!this.mixed) return this[1];
        else return this.mixedUniformData[this.mixedUniformDataId + 1];
    }

    public set z(n: number) {
        if (!this.mixed) this[2] = n;
        else this.mixedUniformData[this.mixedUniformDataId + 2] = n;
    }
    public get z(): number {
        if (!this.mixed) return this[2];
        else return this.mixedUniformData[this.mixedUniformDataId + 2];
    }
}

//--------------

export class IVec4 extends PrimitiveIntUniform {

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
        super("vec4<i32>", [x, y, z, w]);
    }

    public set x(n: number) {
        if (!this.mixed) this[0] = n;
        else this.mixedUniformData[this.mixedUniformDataId] = n;
    }
    public get x(): number {
        if (!this.mixed) return this[0];
        else return this.mixedUniformData[this.mixedUniformDataId];
    }

    public set y(n: number) {
        if (!this.mixed) this[1] = n;
        else this.mixedUniformData[this.mixedUniformDataId + 1] = n;
    }
    public get y(): number {
        if (!this.mixed) return this[1];
        else return this.mixedUniformData[this.mixedUniformDataId + 1];
    }

    public set z(n: number) {
        if (!this.mixed) this[2] = n;
        else this.mixedUniformData[this.mixedUniformDataId + 2] = n;
    }
    public get z(): number {
        if (!this.mixed) return this[2];
        else return this.mixedUniformData[this.mixedUniformDataId + 2];
    }

    public set w(n: number) {
        if (!this.mixed) this[3] = n;
        else this.mixedUniformData[this.mixedUniformDataId + 3] = n;
    }
    public get w(): number {
        if (!this.mixed) return this[3];
        else return this.mixedUniformData[this.mixedUniformDataId + 3];
    }
}

//================================================================================

export class PrimitiveUintUniform extends Uint32Array {

    public mixedUniformData: Uint32Array;
    public mixedUniformDataId: number;
    public mixed: boolean = false;

    protected _type: string;
    constructor(type: string, val: number[] | Uint32Array) {
        super(val);
        this._type = type;
    }
    public get type(): string { return this._type; }
}

//--------------

export class Uint extends PrimitiveUintUniform {

    constructor(x: number = 0) {
        super("u32", [x]);
    }

    public set x(n: number) {
        if (!this.mixed) this[0] = n;
        else this.mixedUniformData[this.mixedUniformDataId] = n;
    }
    public get x(): number {
        if (!this.mixed) return this[0];
        else return this.mixedUniformData[this.mixedUniformDataId];
    }
}

//--------------

export class UVec2 extends PrimitiveUintUniform {

    constructor(x: number = 0, y: number = 0) {
        super("vec2<u32>", [x, y]);
    }

    public set x(n: number) {
        if (!this.mixed) this[0] = n;
        else this.mixedUniformData[this.mixedUniformDataId] = n;
    }
    public get x(): number {
        if (!this.mixed) return this[0];
        else return this.mixedUniformData[this.mixedUniformDataId];
    }

    public set y(n: number) {
        if (!this.mixed) this[1] = n;
        else this.mixedUniformData[this.mixedUniformDataId + 1] = n;
    }
    public get y(): number {
        if (!this.mixed) return this[1];
        else return this.mixedUniformData[this.mixedUniformDataId + 1];
    }
}

//--------------

export class UVec3 extends PrimitiveUintUniform {

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        super("vec3<u32>", [x, y, z]);
    }

    public set x(n: number) {
        if (!this.mixed) this[0] = n;
        else this.mixedUniformData[this.mixedUniformDataId] = n;
    }
    public get x(): number {
        if (!this.mixed) return this[0];
        else return this.mixedUniformData[this.mixedUniformDataId];
    }

    public set y(n: number) {
        if (!this.mixed) this[1] = n;
        else this.mixedUniformData[this.mixedUniformDataId + 1] = n;
    }
    public get y(): number {
        if (!this.mixed) return this[1];
        else return this.mixedUniformData[this.mixedUniformDataId + 1];
    }

    public set z(n: number) {
        if (!this.mixed) this[2] = n;
        else this.mixedUniformData[this.mixedUniformDataId + 2] = n;
    }
    public get z(): number {
        if (!this.mixed) return this[2];
        else return this.mixedUniformData[this.mixedUniformDataId + 2];
    }
}

//--------------

export class UVec4 extends PrimitiveUintUniform {

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
        super("vec4<u32>", [x, y, z, w]);
    }

    public set x(n: number) {
        if (!this.mixed) this[0] = n;
        else this.mixedUniformData[this.mixedUniformDataId] = n;
    }
    public get x(): number {
        if (!this.mixed) return this[0];
        else return this.mixedUniformData[this.mixedUniformDataId];
    }

    public set y(n: number) {
        if (!this.mixed) this[1] = n;
        else this.mixedUniformData[this.mixedUniformDataId + 1] = n;
    }
    public get y(): number {
        if (!this.mixed) return this[1];
        else return this.mixedUniformData[this.mixedUniformDataId + 1];
    }

    public set z(n: number) {
        if (!this.mixed) this[2] = n;
        else this.mixedUniformData[this.mixedUniformDataId + 2] = n;
    }
    public get z(): number {
        if (!this.mixed) return this[2];
        else return this.mixedUniformData[this.mixedUniformDataId + 2];
    }

    public set w(n: number) {
        if (!this.mixed) this[3] = n;
        else this.mixedUniformData[this.mixedUniformDataId + 3] = n;
    }
    public get w(): number {
        if (!this.mixed) return this[3];
        else return this.mixedUniformData[this.mixedUniformDataId + 3];
    }
}

//==========================================================================

export class Vec4Array extends PrimitiveFloatUniform {

    constructor(vec4Array: Vec4[]) {
        let buf: Float32Array = new Float32Array(vec4Array.length * 4);
        for (let i = 0; i < vec4Array.length; i++) buf.set(vec4Array[i], i * 4);
        super("array<vec4<f32>," + vec4Array.length + ">", buf)
    }

    public getElementById(id: number): Vec4 {
        const v = new Vec4();
        v.mixedUniformData = this;
        v.mixedUniformDataId = id * 4;
        v.mixed = true;
        return v;
    }
}

export class IVec4Array extends PrimitiveIntUniform {

    constructor(vec4Array: IVec4[]) {
        let buf: Int32Array = new Int32Array(vec4Array.length * 4);
        for (let i = 0; i < vec4Array.length; i++) buf.set(vec4Array[i], i * 4);
        super("array<vec4<i32>," + vec4Array.length + ">", buf)
    }

    public getElementById(id: number): IVec4 {
        const v = new IVec4();
        v.mixedUniformData = this;
        v.mixedUniformDataId = id * 4;
        v.mixed = true;
        return v;
    }
}

export class UVec4Array extends PrimitiveUintUniform {

    constructor(vec4Array: UVec4[]) {
        let buf: Uint32Array = new Uint32Array(vec4Array.length * 4);
        for (let i = 0; i < vec4Array.length; i++) buf.set(vec4Array[i], i * 4);
        super("array<vec4<i32>," + vec4Array.length + ">", buf)
    }

    public getElementById(id: number): UVec4 {
        const v = new UVec4();
        v.mixedUniformData = this;
        v.mixedUniformDataId = id * 4;
        v.mixed = true;
        return v;
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
        this.mustUpdate = true;
        this._x = n;
    }

    public set y(n: number) {
        if (n === this._y) return;
        this.mustUpdate = true;
        this._y = n;
    }

    public set z(n: number) {
        if (n === this._z) return;
        this.mustUpdate = true;
        this._z = n;
    }

    public set rotationX(n: number) {
        if (n === this._rx) return;
        this.mustUpdate = true;
        this._rx = n;
    }

    public set rotationY(n: number) {
        if (n === this._ry) return;
        this.mustUpdate = true;
        this._ry = n;
    }

    public set rotationZ(n: number) {
        if (n === this._rz) return;
        this.mustUpdate = true;
        this._rz = n;
    }

    public set scaleX(n: number) {
        if (n === this._sx) return;
        this.mustUpdate = true;
        this._sx = n;
    }

    public set scaleY(n: number) {
        if (n === this._sy) return;
        this.mustUpdate = true;
        this._sy = n;
    }

    public set scaleZ(n: number) {
        if (n === this._sz) return;
        this.mustUpdate = true;
        this._sz = n;
    }

    public update() {

        if (!this.mustUpdate) return;
        this.mustUpdate = false;

        mat4.identity(this);
        mat4.rotate(this, this, 1, vec3.fromValues(this._rx, this._ry, this._rz));
        mat4.scale(this, this, vec3.fromValues(this._sx, this._sy, this._sz));
        mat4.translate(this, this, vec3.fromValues(this._x, this._y, this._z));

        if (this.mixed) {
            this.mixedUniformData.set(this, this.mixedUniformDataId)
        }
    }
}

//--------------------

export class Matrix4x4Array extends PrimitiveFloatUniform {
    constructor(mat4x4Array: Matrix4x4[]) {
        let buf: Float32Array = new Float32Array(mat4x4Array.length * 16);
        for (let i = 0; i < mat4x4Array.length; i++) buf.set(mat4x4Array[i], i * 16);
        super("array<mat4x4<f32>," + mat4x4Array.length + ">", buf)
    }

    public getElementById(id: number): Matrix4x4 {
        const v = new Matrix4x4(this.slice(this.mixedUniformDataId, this.mixedUniformDataId + 1));
        v.mixedUniformData = this;
        v.mixedUniformDataId = id * 4;
        v.mixed = true;
        return v;
    }
}

//========================

export class VertexAttributeBufferDefinition {
    protected _offset: number;
    protected _type: string;
    constructor(type: string, offset?: number) {
        this._offset = offset;
        this._type = type;
    }
    public get type(): string { return this._type; }
    public get offset(): number { return this._offset; }
}

export class FloatBuffer extends VertexAttributeBufferDefinition {
    constructor(offset?: number) {
        super("float32", offset)
    }
}
export class Vec2Buffer extends VertexAttributeBufferDefinition {
    constructor(offset?: number) {
        super("float32x2", offset)
    }
}
export class Vec3Buffer extends VertexAttributeBufferDefinition {
    constructor(offset?: number) {
        super("float32x3", offset)
    }
}
export class Vec4Buffer extends VertexAttributeBufferDefinition {
    constructor(offset?: number) {
        super("float32x4", offset)
    }
}

export class IntBuffer extends VertexAttributeBufferDefinition {
    constructor(offset?: number) {
        super("sint32", offset)
    }
}
export class IVec2Buffer extends VertexAttributeBufferDefinition {
    constructor(offset?: number) {
        super("sint32x2", offset)
    }
}
export class IVec3Buffer extends VertexAttributeBufferDefinition {
    constructor(offset?: number) {
        super("sint32x3", offset)
    }
}
export class IVec4Buffer extends VertexAttributeBufferDefinition {
    constructor(offset?: number) {
        super("sint32x4", offset)
    }
}

export class UintBuffer extends VertexAttributeBufferDefinition {
    constructor(offset?: number) {
        super("uint32", offset)
    }
}
export class UVec2Buffer extends VertexAttributeBufferDefinition {
    constructor(offset?: number) {
        super("uint32x2", offset)
    }
}
export class UVec3Buffer extends VertexAttributeBufferDefinition {
    constructor(offset?: number) {
        super("uint32x3", offset)
    }
}
export class UVec4Buffer extends VertexAttributeBufferDefinition {
    constructor(offset?: number) {
        super("uint32x4", offset)
    }
}