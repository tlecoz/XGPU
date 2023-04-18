import { mat2, mat2d, mat3, mat4, vec3 } from "gl-matrix";
import { GPUType } from "../GPUType";
export class PrimitiveFloatUniform extends Float32Array {
    //public uniform: Uniform;
    name;
    type;
    startId = 0;
    mustBeTransfered = true;
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
        return new PrimitiveFloatUniform(this.type.rawType, this, this.createVariableInsideMain);
    }
    initStruct(propertyNames, createVariableInsideMain = false) {
        if (this.type.isArray || this.type.isMatrix)
            throw new Error("initStruct doesn't accept array or matrix");
        this.propertyNames = propertyNames;
        this.createVariableInsideMain = createVariableInsideMain;
    }
    createStruct() {
        console.warn("createStruct");
        let result = "struct " + this.constructor.name + " {\n";
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
    createVariable(uniformBufferName) {
        if (!this.createVariableInsideMain)
            return "";
        let type = this.className;
        if (type === "Float")
            type = "f32";
        if (type === "Vec2")
            type = "vec2<f32>";
        if (type === "Vec3")
            type = "vec3<f32>";
        if (type === "Vec4")
            type = "vec4<f32>";
        const items = this.uniformBuffer.items;
        let name;
        for (let z in items) {
            if (items[z] === this) {
                name = z;
            }
        }
        return "   var " + name + ":" + type + " = " + uniformBufferName + "." + name + ";";
    }
    update() { }
}
export class PrimitiveIntUniform extends Int32Array {
    name;
    type;
    startId = 0;
    mustBeTransfered = true;
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
        console.warn("createStruct");
        let result = "struct " + this.constructor.name + " {\n";
        for (let i = 0; i < this.propertyNames.length; i++) {
            result += "   " + this.propertyNames[i] + ":i32,\n";
        }
        result += "}\n";
        return result;
    }
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
        const items = this.uniformBuffer.items;
        let name;
        for (let z in items) {
            if (items[z] === this) {
                name = z;
            }
        }
        return "   var " + this.constructor.name.toLowerCase() + ":" + type + " = " + uniformBufferName + "." + name + ";";
    }
    update() { }
}
export class PrimitiveUintUniform extends Uint32Array {
    name;
    type;
    startId = 0;
    mustBeTransfered = true;
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
        return new PrimitiveUintUniform(this.type.rawType, this, this.createVariableInsideMain);
    }
    initStruct(propertyNames, createVariableInsideMain = false) {
        if (this.type.isArray || this.type.isMatrix)
            throw new Error("initStruct doesn't accept array or matrix");
        this.propertyNames = propertyNames;
        this.createVariableInsideMain = createVariableInsideMain;
    }
    createStruct() {
        console.warn("createStruct");
        let result = "struct " + this.constructor.name + " {\n";
        for (let i = 0; i < this.propertyNames.length; i++) {
            result += "   " + this.propertyNames[i] + ":u32,\n";
        }
        result += "}\n";
        return result;
    }
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
        const items = this.uniformBuffer.items;
        let name;
        for (let z in items) {
            if (items[z] === this) {
                name = z;
            }
        }
        return "   var " + this.constructor.name.toLowerCase() + ":" + type + " = " + uniformBufferName + "." + name + ";";
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
    constructor(vec4Array) {
        let buf = new Float32Array(vec4Array.length * 4);
        for (let i = 0; i < vec4Array.length; i++)
            buf.set(vec4Array[i], i * 4);
        super("array<vec4<f32>," + vec4Array.length + ">", buf);
    }
}
export class IVec4Array extends PrimitiveIntUniform {
    constructor(vec4Array) {
        let buf = new Int32Array(vec4Array.length * 4);
        for (let i = 0; i < vec4Array.length; i++)
            buf.set(vec4Array[i], i * 4);
        super("array<vec4<i32>," + vec4Array.length + ">", buf);
    }
}
export class UVec4Array extends PrimitiveUintUniform {
    constructor(vec4Array) {
        let buf = new Uint32Array(vec4Array.length * 4);
        for (let i = 0; i < vec4Array.length; i++)
            buf.set(vec4Array[i], i * 4);
        super("array<vec4<i32>," + vec4Array.length + ">", buf);
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
        if (this.disableUpdate)
            return;
        if (this.mustBeTransfered) {
            mat4.identity(this);
            mat4.rotate(this, this, this._rx, vec3.fromValues(1, 0, 0));
            mat4.rotate(this, this, this._ry, vec3.fromValues(0, 1, 0));
            mat4.rotate(this, this, this._rz, vec3.fromValues(0, 0, 1));
            mat4.translate(this, this, vec3.fromValues(this._x, this._y, this._z));
            mat4.scale(this, this, vec3.fromValues(this._sx, this._sy, this._sz));
        }
    }
}
//--------------------
export class ModelViewMatrix extends Matrix4x4 {
    model;
    view;
    constructor() {
        super();
        this.className = "mat4x4<f32>";
        this.model = new Matrix4x4();
        this.view = new Matrix4x4();
    }
    get x() { return this.view.x; }
    get y() { return this.view.y; }
    get z() { return this.view.z; }
    get rotationX() { return this.model.rotationX; }
    get rotationY() { return this.model.rotationY; }
    get rotationZ() { return this.model.rotationZ; }
    get scaleX() { return this.model.scaleX; }
    get scaleY() { return this.model.scaleY; }
    get scaleZ() { return this.model.scaleZ; }
    set x(n) {
        if (n === this.view.x)
            return;
        this.view.x = n;
    }
    set y(n) {
        if (n === this.view.y)
            return;
        this.view.y = n;
    }
    set z(n) {
        if (n === this.view.z)
            return;
        this.view.z = n;
    }
    set rotationX(n) {
        if (n === this.model.rotationX)
            return;
        this.model.rotationX = n;
    }
    set rotationY(n) {
        if (n === this.model.rotationY)
            return;
        this.model.rotationY = n;
    }
    set rotationZ(n) {
        if (n === this.model.rotationZ)
            return;
        this.model.rotationZ = n;
    }
    set scaleX(n) {
        if (n === this.model.scaleX)
            return;
        this.model.scaleX = n;
    }
    set scaleY(n) {
        if (n === this.model.scaleY)
            return;
        this.model.scaleY = n;
    }
    set scaleZ(n) {
        if (n === this.model.scaleZ)
            return;
        this.model.scaleZ = n;
    }
    set(m, offset) {
        super.set(m, offset);
        this.mustBeTransfered = true;
    }
    setMatrix(mat) {
        this.set(mat);
        this.mustBeTransfered = true;
    }
    update() {
        if (this.model.mustBeTransfered || this.view.mustBeTransfered) {
            if (this.model.mustBeTransfered)
                this.model.update();
            if (this.view.mustBeTransfered)
                this.view.update();
            //mat4.identity(this);
            mat4.multiply(this, this.view, this.model);
            this.model.mustBeTransfered = this.view.mustBeTransfered = false;
            this.mustBeTransfered = true;
        }
    }
}
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
    }
    update() {
        //console.log("matrixArray.update")
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
