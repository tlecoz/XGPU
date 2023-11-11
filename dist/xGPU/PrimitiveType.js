// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { mat3, mat4, vec3 } from "wgpu-matrix";
import { GPUType } from "./GPUType";
export class PrimitiveFloatUniform extends Float32Array {
    //public uniform: Uniform;
    name;
    type;
    startId = 0;
    onChange;
    _mustBeTransfered = true;
    get mustBeTransfered() { return this._mustBeTransfered; }
    set mustBeTransfered(b) {
        if (b != this._mustBeTransfered) {
            if (!b && this.onChange)
                this.onChange();
            this._mustBeTransfered = b;
        }
    }
    uniformBuffer;
    propertyNames;
    createVariableInsideMain = false;
    className;
    constructor(type, val, createLocalVariable = false) {
        super(val);
        this.type = new GPUType(type);
        this.createVariableInsideMain = createLocalVariable;
        this.className = this.constructor.name;
    }
    clone() {
        const o = new PrimitiveFloatUniform(this.type.rawType, this, this.createVariableInsideMain);
        o.propertyNames = this.propertyNames;
        o.className = this.className;
        o.name = this.name;
        o.startId = this.startId;
        //for (let z in this) o[z] = this[z];
        return o;
    }
    initStruct(propertyNames, createVariableInsideMain = false) {
        if (this.type.isArray || this.type.isMatrix)
            throw new Error("initStruct doesn't accept array or matrix");
        this.propertyNames = propertyNames;
        this.createVariableInsideMain = createVariableInsideMain;
    }
    createStruct() {
        //let result = "struct " + this.constructor.name + " {\n";
        let result = "struct " + this.className + " {\n";
        for (let i = 0; i < this.propertyNames.length; i++) {
            result += "   " + this.propertyNames[i] + ":f32,\n";
        }
        result += "}\n";
        return result;
    }
    set(m, offset) {
        super.set(m, offset);
        this.mustBeTransfered = true;
    }
    /*
    public createVariable(uniformBufferName: string): string {
        if (!this.createVariableInsideMain) return "";

        let type = this.className;
        if (type === "Float") type = "f32";
        if (type === "Vec2") type = "vec2<f32>";
        if (type === "Vec3") type = "vec3<f32>";
        if (type === "Vec4") type = "vec4<f32>";

        const items = this.uniformBuffer.items;
        let name: string;
        for (let z in items) {
            if (items[z] === this) {
                name = z;
            }
        }

        return "   var " + name + ":" + type + " = " + uniformBufferName + "." + name + ";"
    }
    */
    createVariable(uniformBufferName, name) {
        if (!this.createVariableInsideMain)
            return "";
        if (!name)
            name = this.name;
        let type = this.className;
        if (type === "Float")
            type = "f32";
        if (type === "Vec2")
            type = "vec2<f32>";
        if (type === "Vec3")
            type = "vec3<f32>";
        if (type === "Vec4")
            type = "vec4<f32>";
        const res = "   var " + name + ":" + type + " = " + uniformBufferName + "." + name + ";\n";
        //console.log("createVariable = ", res);
        return res;
    }
    update() { }
}
export class PrimitiveIntUniform extends Int32Array {
    name;
    type;
    startId = 0;
    onChange;
    _mustBeTransfered = true;
    get mustBeTransfered() { return this._mustBeTransfered; }
    set mustBeTransfered(b) {
        if (b != this._mustBeTransfered) {
            if (!b && this.onChange)
                this.onChange();
            this._mustBeTransfered = b;
        }
    }
    uniformBuffer;
    propertyNames;
    createVariableInsideMain = false;
    ;
    className;
    constructor(type, val, createLocalVariable = false) {
        super(val);
        this.type = new GPUType(type);
        this.createVariableInsideMain = createLocalVariable;
        this.className = this.constructor.name;
    }
    clone() {
        return new PrimitiveIntUniform(this.type.rawType, this, this.createVariableInsideMain);
    }
    initStruct(propertyNames, createVariableInsideMain = false) {
        if (this.type.isArray || this.type.isMatrix)
            throw new Error("initStruct doesn't accept array or matrix");
        this.propertyNames = propertyNames;
        this.createVariableInsideMain = createVariableInsideMain;
    }
    createStruct() {
        let result = "struct " + this.constructor.name + " {\n";
        for (let i = 0; i < this.propertyNames.length; i++) {
            result += "   " + this.propertyNames[i] + ":i32,\n";
        }
        result += "}\n";
        return result;
    }
    /*
    public createVariable(uniformBufferName: string): string {
        if (!this.createVariableInsideMain) return "";

        let type = this.className;
        if (type === "Int") type = "i32";
        if (type === "IVec2") type = "vec2<i32>";
        if (type === "IVec3") type = "vec3<i32>";
        if (type === "IVec4") type = "vec4<i32>";


        const items = this.uniformBuffer.items;
        let name: string;
        for (let z in items) {
            if (items[z] === this) {
                name = z;
            }
        }
        return "   var " + this.constructor.name.toLowerCase() + ":" + type + " = " + uniformBufferName + "." + name + ";"
    }
    */
    createVariable(uniformBufferName) {
        if (!this.createVariableInsideMain)
            return "";
        let type = this.className;
        if (type === "Int")
            type = "i32";
        if (type === "IVec2")
            type = "vec2<i32>";
        if (type === "IVec3")
            type = "vec3<i32>";
        if (type === "IVec4")
            type = "vec4<i32>";
        return "   var " + this.name + ":" + type + " = " + uniformBufferName + "." + this.name + ";\n";
    }
    update() { }
}
export class PrimitiveUintUniform extends Uint32Array {
    name;
    type;
    startId = 0;
    uniformBuffer;
    onChange;
    _mustBeTransfered = true;
    get mustBeTransfered() { return this._mustBeTransfered; }
    set mustBeTransfered(b) {
        if (b != this._mustBeTransfered) {
            if (!b && this.onChange)
                this.onChange();
            this._mustBeTransfered = b;
        }
    }
    propertyNames;
    createVariableInsideMain = false;
    ;
    className;
    constructor(type, val, createLocalVariable = false) {
        super(val);
        this.type = new GPUType(type);
        this.createVariableInsideMain = createLocalVariable;
        this.className = this.constructor.name;
    }
    clone() {
        return new PrimitiveUintUniform(this.type.rawType, this, this.createVariableInsideMain);
    }
    initStruct(propertyNames, createVariableInsideMain = false) {
        if (this.type.isArray || this.type.isMatrix)
            throw new Error("initStruct doesn't accept array or matrix");
        this.propertyNames = propertyNames;
        this.createVariableInsideMain = createVariableInsideMain;
    }
    createStruct() {
        let result = "struct " + this.constructor.name + " {\n";
        for (let i = 0; i < this.propertyNames.length; i++) {
            result += "   " + this.propertyNames[i] + ":u32,\n";
        }
        result += "}\n";
        return result;
    }
    /*
    public createVariable(uniformBufferName: string): string {
        if (!this.createVariableInsideMain) return "";

        let type = this.className;
        if (type === "Uint") type = "u32";
        if (type === "UVec2") type = "vec2<u32>";
        if (type === "UVec3") type = "vec3<u32>";
        if (type === "UVec4") type = "vec4<u32>";

        const items = this.uniformBuffer.items;
        let name: string;
        for (let z in items) {
            if (items[z] === this) {
                name = z;
            }
        }
        return "   var " + this.constructor.name.toLowerCase() + ":" + type + " = " + uniformBufferName + "." + name + ";"
    }*/
    createVariable(uniformBufferName) {
        if (!this.createVariableInsideMain)
            return "";
        let type = this.className;
        if (type === "Uint")
            type = "u32";
        if (type === "UVec2")
            type = "vec2<u32>";
        if (type === "UVec3")
            type = "vec3<u32>";
        if (type === "UVec4")
            type = "vec4<u32>";
        return "   var " + this.name + ":" + type + " = " + uniformBufferName + "." + this.name + ";\n";
    }
    update() { }
}
//--------------
export class Float extends PrimitiveFloatUniform {
    constructor(x = 0, createLocalVariable = false) {
        super("f32", [x], createLocalVariable);
    }
    set x(n) {
        this[0] = n;
        this.mustBeTransfered = true;
    }
    get x() {
        return this[0];
    }
}
//--------------
export class Vec2 extends PrimitiveFloatUniform {
    constructor(x = 0, y = 0, createLocalVariable = false) {
        super("vec2<f32>", [x, y], createLocalVariable);
    }
    set x(n) {
        this[0] = n;
        this.mustBeTransfered = true;
    }
    set y(n) {
        this[1] = n;
        this.mustBeTransfered = true;
    }
    get x() { return this[0]; }
    get y() { return this[1]; }
}
//--------------
export class Vec3 extends PrimitiveFloatUniform {
    constructor(x = 0, y = 0, z = 0, createLocalVariable = false) {
        super("vec3<f32>", [x, y, z], createLocalVariable);
    }
    set x(n) {
        this[0] = n;
        this.mustBeTransfered = true;
    }
    set y(n) {
        this[1] = n;
        this.mustBeTransfered = true;
    }
    set z(n) {
        this[2] = n;
        this.mustBeTransfered = true;
    }
    get x() { return this[0]; }
    get y() { return this[1]; }
    get z() { return this[2]; }
}
//--------------
export class Vec4 extends PrimitiveFloatUniform {
    constructor(x = 0, y = 0, z = 0, w = 0, createLocalVariable = false) {
        super("vec4<f32>", [x, y, z, w], createLocalVariable);
    }
    set x(n) {
        this[0] = n;
        this.mustBeTransfered = true;
    }
    set y(n) {
        this[1] = n;
        this.mustBeTransfered = true;
    }
    set z(n) {
        this[2] = n;
        this.mustBeTransfered = true;
    }
    set w(n) {
        this[3] = n;
        this.mustBeTransfered = true;
    }
    get x() { return this[0]; }
    get y() { return this[1]; }
    get z() { return this[2]; }
    get w() { return this[3]; }
}
//================================================================================
//--------------
export class Int extends PrimitiveIntUniform {
    constructor(x = 0, createLocalVariable = false) {
        super("i32", [x], createLocalVariable);
    }
    set x(n) {
        this[0] = n;
        this.mustBeTransfered = true;
    }
    get x() { return this[0]; }
}
//--------------
export class IVec2 extends PrimitiveIntUniform {
    constructor(x = 0, y = 0, createLocalVariable = false) {
        super("vec2<i32>", [x, y], createLocalVariable);
    }
    set x(n) {
        this[0] = n;
        this.mustBeTransfered = true;
    }
    set y(n) {
        this[1] = n;
        this.mustBeTransfered = true;
    }
    get x() { return this[0]; }
    get y() { return this[1]; }
}
//--------------
export class IVec3 extends PrimitiveIntUniform {
    constructor(x = 0, y = 0, z = 0, createLocalVariable = false) {
        super("vec3<i32>", [x, y, z], createLocalVariable);
    }
    set x(n) {
        this[0] = n;
        this.mustBeTransfered = true;
    }
    set y(n) {
        this[1] = n;
        this.mustBeTransfered = true;
    }
    set z(n) {
        this[2] = n;
        this.mustBeTransfered = true;
    }
    get x() { return this[0]; }
    get y() { return this[1]; }
    get z() { return this[2]; }
}
//--------------
export class IVec4 extends PrimitiveIntUniform {
    constructor(x = 0, y = 0, z = 0, w = 0, createLocalVariable = false) {
        super("vec4<i32>", [x, y, z, w], createLocalVariable);
    }
    set x(n) {
        this[0] = n;
        this.mustBeTransfered = true;
    }
    set y(n) {
        this[1] = n;
        this.mustBeTransfered = true;
    }
    set z(n) {
        this[2] = n;
        this.mustBeTransfered = true;
    }
    set w(n) {
        this[3] = n;
        this.mustBeTransfered = true;
    }
    get x() { return this[0]; }
    get y() { return this[1]; }
    get z() { return this[2]; }
    get w() { return this[3]; }
}
//================================================================================
//--------------
export class Uint extends PrimitiveUintUniform {
    constructor(x = 0, createLocalVariable = false) {
        super("u32", [x], createLocalVariable);
    }
    set x(n) {
        this[0] = n;
        this.mustBeTransfered = true;
    }
    get x() { return this[0]; }
}
//--------------
export class UVec2 extends PrimitiveUintUniform {
    constructor(x = 0, y = 0, createLocalVariable = false) {
        super("vec2<u32>", [x, y], createLocalVariable);
    }
    set x(n) {
        this[0] = n;
        this.mustBeTransfered = true;
    }
    set y(n) {
        this[1] = n;
        this.mustBeTransfered = true;
    }
    get x() { return this[0]; }
    get y() { return this[1]; }
}
//--------------
export class UVec3 extends PrimitiveUintUniform {
    constructor(x = 0, y = 0, z = 0, createLocalVariable = false) {
        super("vec3<u32>", [x, y, z], createLocalVariable);
    }
    set x(n) {
        this[0] = n;
        this.mustBeTransfered = true;
    }
    set y(n) {
        this[1] = n;
        this.mustBeTransfered = true;
    }
    set z(n) {
        this[2] = n;
        this.mustBeTransfered = true;
    }
    get x() { return this[0]; }
    get y() { return this[1]; }
    get z() { return this[2]; }
}
//--------------
export class UVec4 extends PrimitiveUintUniform {
    constructor(x = 0, y = 0, z = 0, w = 0, createLocalVariable = false) {
        super("vec4<u32>", [x, y, z, w], createLocalVariable);
    }
    set x(n) {
        this[0] = n;
        this.mustBeTransfered = true;
    }
    set y(n) {
        this[1] = n;
        this.mustBeTransfered = true;
    }
    set z(n) {
        this[2] = n;
        this.mustBeTransfered = true;
    }
    set w(n) {
        this[3] = n;
        this.mustBeTransfered = true;
    }
    get x() { return this[0]; }
    get y() { return this[1]; }
    get z() { return this[2]; }
    get w() { return this[3]; }
}
//==========================================================================
export class Vec4Array extends PrimitiveFloatUniform {
    vec4Array;
    constructor(vec4Array) {
        let buf = new Float32Array(vec4Array.length * 4);
        for (let i = 0; i < vec4Array.length; i++)
            buf.set(vec4Array[i], i * 4);
        let type = "array<vec4<f32>," + vec4Array.length + ">";
        super("array<vec4<f32>," + vec4Array.length + ">", buf);
        this.className = type;
        this.vec4Array = vec4Array;
    }
    update() {
        let mustBeTransfered = false;
        let m;
        for (let i = 0; i < this.vec4Array.length; i++) {
            m = this.vec4Array[i];
            m.update();
            if (m.mustBeTransfered) {
                mustBeTransfered = true;
                this.set(m, i * 4);
                m.mustBeTransfered = false;
            }
        }
        this.mustBeTransfered = mustBeTransfered;
    }
}
//-------
export class IVec4Array extends PrimitiveIntUniform {
    ivec4Array;
    constructor(ivec4Array) {
        let buf = new Int32Array(ivec4Array.length * 4);
        for (let i = 0; i < ivec4Array.length; i++)
            buf.set(ivec4Array[i], i * 4);
        let type = "array<vec4<i32>," + ivec4Array.length + ">";
        super(type, buf);
        this.className = type;
        this.ivec4Array = ivec4Array;
    }
    update() {
        let mustBeTransfered = false;
        let m;
        for (let i = 0; i < this.ivec4Array.length; i++) {
            m = this.ivec4Array[i];
            m.update();
            if (m.mustBeTransfered) {
                mustBeTransfered = true;
                this.set(m, i * 4);
                m.mustBeTransfered = false;
            }
        }
        this.mustBeTransfered = mustBeTransfered;
    }
}
//-----
export class UVec4Array extends PrimitiveUintUniform {
    uvec4Array;
    constructor(uvec4Array) {
        let buf = new Uint32Array(uvec4Array.length * 4);
        for (let i = 0; i < uvec4Array.length; i++)
            buf.set(uvec4Array[i], i * 4);
        let type = "array<vec4<u32>," + uvec4Array.length + ">";
        super(type, buf);
        this.className = type;
        this.uvec4Array = uvec4Array;
    }
    update() {
        let mustBeTransfered = false;
        let m;
        for (let i = 0; i < this.uvec4Array.length; i++) {
            m = this.uvec4Array[i];
            m.update();
            if (m.mustBeTransfered) {
                mustBeTransfered = true;
                this.set(m, i * 4);
                m.mustBeTransfered = false;
            }
        }
        this.mustBeTransfered = mustBeTransfered;
    }
}
//==============================================================
export class Matrix3x3 extends PrimitiveFloatUniform {
    constructor() {
        super("mat3x3<f32>", mat3.create());
    }
}
/*
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
*/
export class Matrix4x4 extends PrimitiveFloatUniform {
    _x = 0;
    _y = 0;
    _z = 0;
    _sx = 1;
    _sy = 1;
    _sz = 1;
    _rx = 0;
    _ry = 0;
    _rz = 0;
    disableUpdate;
    constructor(floatArray = null) {
        const disableUpdate = !!floatArray;
        if (!floatArray)
            floatArray = mat4.create();
        super("mat4x4<f32>", floatArray);
        this.className = "mat4x4<f32>";
        this.disableUpdate = disableUpdate;
    }
    clone() {
        const m = new Matrix4x4(this);
        m.x = this.x;
        m.y = this.y;
        m.z = this.z;
        m.rotationX = this.rotationX;
        m.rotationY = this.rotationY;
        m.rotationZ = this.rotationZ;
        m.scaleX = this.scaleX;
        m.scaleY = this.scaleY;
        m.scaleZ = this.scaleZ;
        m.disableUpdate = this.disableUpdate;
        return m;
    }
    get x() { return this._x; }
    get y() { return this._y; }
    get z() { return this._z; }
    get rotationX() { return this._rx; }
    get rotationY() { return this._ry; }
    get rotationZ() { return this._rz; }
    get scaleX() { return this._sx; }
    get scaleY() { return this._sy; }
    get scaleZ() { return this._sz; }
    set x(n) {
        if (n === this._x)
            return;
        this.mustBeTransfered = true;
        this._x = n;
    }
    set y(n) {
        if (n === this._y)
            return;
        this.mustBeTransfered = true;
        this._y = n;
    }
    set z(n) {
        if (n === this._z)
            return;
        this.mustBeTransfered = true;
        this._z = n;
    }
    set rotationX(n) {
        if (n === this._rx)
            return;
        this.mustBeTransfered = true;
        this._rx = n;
    }
    set rotationY(n) {
        if (n === this._ry)
            return;
        this.mustBeTransfered = true;
        this._ry = n;
    }
    set rotationZ(n) {
        if (n === this._rz)
            return;
        this.mustBeTransfered = true;
        this._rz = n;
    }
    set scaleX(n) {
        if (n === this._sx)
            return;
        this.mustBeTransfered = true;
        this._sx = n;
    }
    set scaleY(n) {
        if (n === this._sy)
            return;
        this.mustBeTransfered = true;
        this._sy = n;
    }
    set scaleZ(n) {
        if (n === this._sz)
            return;
        this.mustBeTransfered = true;
        this._sz = n;
    }
    set scaleXYZ(n) {
        this._sx = this._sy = this._sz = n;
        this.mustBeTransfered = true;
    }
    setMatrix(mat) {
        this.set(mat);
        this.mustBeTransfered = true;
    }
    update() {
        //console.log("matrix.update ", this.disableUpdate)
        if (this.disableUpdate)
            return;
        if (this.mustBeTransfered) {
            mat4.identity(this);
            /*
            mat4.rotate(this, this, this._rx, vec3.fromValues(1, 0, 0));
            mat4.rotate(this, this, this._ry, vec3.fromValues(0, 1, 0));
            mat4.rotate(this, this, this._rz, vec3.fromValues(0, 0, 1));

            mat4.translate(this, this, vec3.fromValues(this._x, this._y, this._z));

            mat4.scale(this, this, vec3.fromValues(this._sx, this._sy, this._sz));
            */
            mat4.rotateX(this, this._rx, this);
            mat4.rotateY(this, this._ry, this);
            mat4.rotateZ(this, this._rz, this);
            mat4.translate(this, vec3.fromValues(this._x, this._y, this._z), this);
            mat4.scale(this, vec3.fromValues(this._sx, this._sy, this._sz), this);
        }
    }
}
//--------------------
//--------------------
export class Matrix4x4Array extends PrimitiveFloatUniform {
    matrixs;
    constructor(mat4x4Array) {
        let buf = new Float32Array(mat4x4Array.length * 16);
        for (let i = 0; i < mat4x4Array.length; i++)
            buf.set(mat4x4Array[i], i * 16);
        super("array<mat4x4<f32>," + mat4x4Array.length + ">", buf);
        this.matrixs = mat4x4Array;
        this.mustBeTransfered = true;
        this.className = "array<mat4x4<f32>," + mat4x4Array.length + ">";
    }
    update() {
        let mustBeTransfered = false;
        let m;
        for (let i = 0; i < this.matrixs.length; i++) {
            m = this.matrixs[i];
            m.update();
            if (m.mustBeTransfered) {
                mustBeTransfered = true;
                this.set(m, i * 16);
                m.mustBeTransfered = false;
            }
        }
        this.mustBeTransfered = mustBeTransfered;
    }
}
