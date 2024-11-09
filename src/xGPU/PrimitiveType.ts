// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

//import { mat3, mat4, vec3 } from "wgpu-matrix";
import { mat4, vec3 } from "gl-matrix";
import { GPUType } from "./GPUType";
import { UniformBuffer } from "./shader/resources/UniformBuffer";

export type PrimitiveType = PrimitiveFloatUniform | PrimitiveIntUniform | PrimitiveUintUniform;

export class PrimitiveFloatUniform extends Float32Array {






    public static ON_CHANGE:string = "ON_CHANGE";
    public static ON_CHANGED: string = "ON_CHANGED";


    //public uniform: Uniform;
    public name: string;
    public type: GPUType;
    public startId: number = 0;


    public onChange: () => void;



    protected _mustBeTransfered: boolean = true;
    public get mustBeTransfered(): boolean { return this._mustBeTransfered; }
    public set mustBeTransfered(b: boolean) {

        if(this.name != "timeBytes"){
            console.warn(this.name,this._mustBeTransfered,b);
        }
        if (b != this._mustBeTransfered) {

            

            if (!b) this.dispatchEvent(PrimitiveFloatUniform.ON_CHANGED);
            else this.dispatchEvent(PrimitiveFloatUniform.ON_CHANGE);
            //if (!b && this.onChange) this.onChange();
            this._mustBeTransfered = b;
        }
    }


    public uniformBuffer: UniformBuffer;

    public propertyNames: string[];
    public createVariableInsideMain: boolean = false;

    public className: string;

    constructor(type: string, val: number[] | Float32Array, createLocalVariable: boolean = false) {
        super(val);
        this.type = new GPUType(type);
        this.createVariableInsideMain = createLocalVariable;
        this.className = this.constructor.name;
    }

    public clone(): PrimitiveFloatUniform {
        const o = new PrimitiveFloatUniform(this.type.rawType, this as Float32Array, this.createVariableInsideMain);
        o.propertyNames = this.propertyNames;
        o.className = this.className;
        o.name = this.name;
        o.startId = this.startId;

        //for (let z in this) o[z] = this[z];
        return o;
    }

    public initStruct(propertyNames: string[], createVariableInsideMain: boolean = false) {
        if (this.type.isArray || this.type.isMatrix) throw new Error("initStruct doesn't accept array or matrix");
        this.propertyNames = propertyNames;
        this.createVariableInsideMain = createVariableInsideMain;
    }

    public createStruct(): string {

        //let result = "struct " + this.constructor.name + " {\n";
        let result = "struct " + this.className + " {\n";
        for (let i = 0; i < this.propertyNames.length; i++) {
            result += "   " + this.propertyNames[i] + ":f32,\n";
        }
        result += "}\n"
        return result;
    }

    public override set(m: Float32Array, offset?: number) {
        super.set(m, offset);
        this.mustBeTransfered = true;
    }



    public createVariable(uniformBufferName: string, name?: string): string {
        if (!this.createVariableInsideMain) return "";

        if (!name) name = this.name;

        let type = this.className;
        if (type === "Float") type = "f32";
        if (type === "Vec2") type = "vec2<f32>";
        if (type === "Vec3") type = "vec3<f32>";
        if (type === "Vec4") type = "vec4<f32>";

        const res: string = "   var " + name + ":" + type + " = " + uniformBufferName + "." + name + ";\n";
        //console.log("createVariable = ", res);

        return res;
    }

    /*
    public feedbackVertexId: number = 0;
    public feedbackInstanceId: number = 0;
    public setFeedback(vertexId: number, instanceId: number): PrimitiveFloatUniform {
        this.feedbackVertexId = vertexId;
        this.feedbackInstanceId = instanceId;
        return this;
    }*/


    public update() { }



    //--------- EVENT DISPATCHER CLASS (that I can't extends because we already extends Float32Array)----
    protected eventListeners: any = {};
    public addEventListener(eventName: string, callback: (dispatcher: PrimitiveFloatUniform, data?: any) => void) {
        if (!this.eventListeners[eventName]) this.eventListeners[eventName] = [];
        this.eventListeners[eventName].push(callback);
    }
    public removeEventListener(eventName: string, callback: (dispatcher: PrimitiveFloatUniform, data?: any) => void) {
        if (this.eventListeners[eventName]) {
            const id = this.eventListeners[eventName].indexOf(callback);
            if (id != -1) {
                this.eventListeners[eventName].splice(id, 1);
            }
        }
    }
    public dispatchEvent(eventName: string, eventData?: any) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName].forEach(callback => {
                callback(this, eventData);
            });
        }
    }
    //---------------------------------------------------------------------------------------------
}


export class PrimitiveIntUniform extends Int32Array {



    public static ON_CHANGE:string = "ON_CHANGE";
    public static ON_CHANGED: string = "ON_CHANGED";

    public name: string;
    public type: GPUType;
    public startId: number = 0;

    public onChange: () => void;
    protected _mustBeTransfered: boolean = true;
    public get mustBeTransfered(): boolean { return this._mustBeTransfered; }
    public set mustBeTransfered(b: boolean) {
        if (b != this._mustBeTransfered) {
            if (!b) this.dispatchEvent(PrimitiveIntUniform.ON_CHANGED)
            else this.dispatchEvent(PrimitiveIntUniform.ON_CHANGE);
            //if (!b && this.onChange) this.onChange();
            this._mustBeTransfered = b;
        }
    }

    public uniformBuffer: UniformBuffer;

    public propertyNames: string[];
    public createVariableInsideMain: boolean = false;;
    public className: string;

    constructor(type: string, val: number[] | Int32Array, createLocalVariable: boolean = false) {
        super(val);
        this.type = new GPUType(type);
        this.createVariableInsideMain = createLocalVariable;
        this.className = this.constructor.name;
    }

    public clone(): PrimitiveIntUniform {
        return new PrimitiveIntUniform(this.type.rawType, this as Int32Array, this.createVariableInsideMain)
    }

    public initStruct(propertyNames: string[], createVariableInsideMain: boolean = false) {
        if (this.type.isArray || this.type.isMatrix) throw new Error("initStruct doesn't accept array or matrix");
        this.propertyNames = propertyNames;
        this.createVariableInsideMain = createVariableInsideMain;
    }

    public createStruct(): string {

        let result = "struct " + this.constructor.name + " {\n";
        for (let i = 0; i < this.propertyNames.length; i++) {
            result += "   " + this.propertyNames[i] + ":i32,\n";
        }
        result += "}\n"
        return result;
    }



    public createVariable(uniformBufferName: string): string {
        if (!this.createVariableInsideMain) return "";

        let type = this.className;
        if (type === "Int") type = "i32";
        if (type === "IVec2") type = "vec2<i32>";
        if (type === "IVec3") type = "vec3<i32>";
        if (type === "IVec4") type = "vec4<i32>";

        return "   var " + this.name + ":" + type + " = " + uniformBufferName + "." + this.name + ";\n"
    }

    /*
    public feedbackVertexId: number = 0;
    public feedbackInstanceId: number = 0;
    public setFeedback(vertexId: number, instanceId: number): PrimitiveIntUniform {
        this.feedbackVertexId = vertexId;
        this.feedbackInstanceId = instanceId;
        return this;
    }*/

    public update() { }

    //--------- EVENT DISPATCHER CLASS (that I can't extends because we already extends Int32Array)----
    protected eventListeners: any = {};
    public addEventListener(eventName: string, callback: (dispatcher: PrimitiveIntUniform, data?: any) => void) {
        if (!this.eventListeners[eventName]) this.eventListeners[eventName] = [];
        this.eventListeners[eventName].push(callback);
    }
    public removeEventListener(eventName: string, callback: (dispatcher: PrimitiveIntUniform, data?: any) => void) {
        if (this.eventListeners[eventName]) {
            const id = this.eventListeners[eventName].indexOf(callback);
            if (id != -1) {
                this.eventListeners[eventName].splice(id, 1);
            }
        }
    }
    public dispatchEvent(eventName: string, eventData?: any) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName].forEach(callback => {
                callback(this, eventData);
            });
        }
    }
    //---------------------------------------------------------------------------------------------

}


export class PrimitiveUintUniform extends Uint32Array {


    public static ON_CHANGE:string = "ON_CHANGE";
    public static ON_CHANGED: string = "ON_CHANGED";



    public name: string;
    public type: GPUType;
    public startId: number = 0;
    public uniformBuffer: UniformBuffer;

    public onChange: () => void;
    protected _mustBeTransfered: boolean = true;
    public get mustBeTransfered(): boolean { return this._mustBeTransfered; }
    public set mustBeTransfered(b: boolean) {
        if (b != this._mustBeTransfered) {
            //if (!b && this.onChange) this.onChange();
            if (!b) this.dispatchEvent(PrimitiveUintUniform.ON_CHANGED)
            else this.dispatchEvent(PrimitiveUintUniform.ON_CHANGE);
            this._mustBeTransfered = b;
        }
    }

    public propertyNames: string[];
    public createVariableInsideMain: boolean = false;;
    public className: string;

    constructor(type: string, val: number[] | Uint32Array, createLocalVariable: boolean = false) {
        super(val);
        this.type = new GPUType(type);
        this.createVariableInsideMain = createLocalVariable;
        this.className = this.constructor.name;
    }

    public clone(): PrimitiveUintUniform {
        return new PrimitiveUintUniform(this.type.rawType, this as Uint32Array, this.createVariableInsideMain)
    }

    public initStruct(propertyNames: string[], createVariableInsideMain: boolean = false) {
        if (this.type.isArray || this.type.isMatrix) throw new Error("initStruct doesn't accept array or matrix");
        this.propertyNames = propertyNames;
        this.createVariableInsideMain = createVariableInsideMain;
    }

    public createStruct(): string {

        let result = "struct " + this.constructor.name + " {\n";
        for (let i = 0; i < this.propertyNames.length; i++) {
            result += "   " + this.propertyNames[i] + ":u32,\n";
        }
        result += "}\n"
        return result;
    }



    public createVariable(uniformBufferName: string): string {
        if (!this.createVariableInsideMain) return "";

        let type = this.className;
        if (type === "Uint") type = "u32";
        if (type === "UVec2") type = "vec2<u32>";
        if (type === "UVec3") type = "vec3<u32>";
        if (type === "UVec4") type = "vec4<u32>";


        return "   var " + this.name + ":" + type + " = " + uniformBufferName + "." + this.name + ";\n";
    }
    /*
    public feedbackVertexId: number = 0;
    public feedbackInstanceId: number = 0;
    public setFeedback(vertexId: number, instanceId: number): PrimitiveUintUniform {
        this.feedbackVertexId = vertexId;
        this.feedbackInstanceId = instanceId;
        return this;
    }
    */

    public update() { }

    //--------- EVENT DISPATCHER CLASS (that I can't extends because we already extends Uint32Array)----
    protected eventListeners: any = {};
    public addEventListener(eventName: string, callback: (dispatcher: PrimitiveUintUniform, data?: any) => void) {
        if (!this.eventListeners[eventName]) this.eventListeners[eventName] = [];
        this.eventListeners[eventName].push(callback);
    }
    public removeEventListener(eventName: string, callback: (dispatcher: PrimitiveUintUniform, data?: any) => void) {
        if (this.eventListeners[eventName]) {
            const id = this.eventListeners[eventName].indexOf(callback);
            if (id != -1) {
                this.eventListeners[eventName].splice(id, 1);
            }
        }
    }
    public dispatchEvent(eventName: string, eventData?: any) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName].forEach(callback => {
                callback(this, eventData);
            });
        }
    }
    //---------------------------------------------------------------------------------------------

}

//--------------

export class Float extends PrimitiveFloatUniform {

    constructor(x: number = 0, createLocalVariable: boolean = false) {
        super("f32", [x], createLocalVariable);
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

    constructor(x: number = 0, y: number = 0, createLocalVariable: boolean = false) {
        super("vec2<f32>", [x, y], createLocalVariable);
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

    constructor(x: number = 0, y: number = 0, z: number = 0, createLocalVariable: boolean = false) {
        super("vec3<f32>", [x, y, z], createLocalVariable);
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

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0, createLocalVariable: boolean = false) {
        super("vec4<f32>", [x, y, z, w], createLocalVariable);
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

    constructor(x: number = 0, createLocalVariable: boolean = false) {
        super("i32", [x], createLocalVariable);
    }

    public set x(n: number) {
        this[0] = n;
        this.mustBeTransfered = true;
    }

    public get x(): number { return this[0]; }

}

//--------------

export class IVec2 extends PrimitiveIntUniform {

    constructor(x: number = 0, y: number = 0, createLocalVariable: boolean = false) {
        super("vec2<i32>", [x, y], createLocalVariable);
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

    constructor(x: number = 0, y: number = 0, z: number = 0, createLocalVariable: boolean = false) {
        super("vec3<i32>", [x, y, z], createLocalVariable);
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

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0, createLocalVariable: boolean = false) {
        super("vec4<i32>", [x, y, z, w], createLocalVariable);
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

    constructor(x: number = 0, createLocalVariable: boolean = false) {
        super("u32", [x], createLocalVariable);
    }

    public set x(n: number) {
        this[0] = n;
        this.mustBeTransfered = true;
    }

    public get x(): number { return this[0]; }

}

//--------------

export class UVec2 extends PrimitiveUintUniform {

    constructor(x: number = 0, y: number = 0, createLocalVariable: boolean = false) {
        super("vec2<u32>", [x, y], createLocalVariable);
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

    constructor(x: number = 0, y: number = 0, z: number = 0, createLocalVariable: boolean = false) {
        super("vec3<u32>", [x, y, z], createLocalVariable);
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

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0, createLocalVariable: boolean = false) {
        super("vec4<u32>", [x, y, z, w], createLocalVariable);
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

    public vec4Array: Vec4[];

    constructor(vec4Array: Vec4[]) {
        let buf: Float32Array = new Float32Array(vec4Array.length * 4);
        for (let i = 0; i < vec4Array.length; i++) buf.set(vec4Array[i], i * 4);
        let type: string = "array<vec4<f32>," + vec4Array.length + ">";
        super("array<vec4<f32>," + vec4Array.length + ">", buf)
        this.className = type;
        this.vec4Array = vec4Array;
       
        
    }

    public update(): void {
        
        let mustBeTransfered = false;
        let m: Vec4;
        for (let i = 0; i < this.vec4Array.length; i++) {
            m = this.vec4Array[i];
            m.update();
            if (m.mustBeTransfered) {
               
                mustBeTransfered = true;
                this.set(m, i * 4);
                m.mustBeTransfered = false;
               
            }
        }

        if(this.mustBeTransfered != mustBeTransfered){
            this.mustBeTransfered = mustBeTransfered;
        }
        
    }
}


//-------



export class IVec4Array extends PrimitiveIntUniform {

    public ivec4Array: IVec4[];

    constructor(ivec4Array: IVec4[]) {
        let buf: Int32Array = new Int32Array(ivec4Array.length * 4);
        for (let i = 0; i < ivec4Array.length; i++) buf.set(ivec4Array[i], i * 4);
        let type: string = "array<vec4<i32>," + ivec4Array.length + ">";
        super(type, buf);
        this.className = type;
        this.ivec4Array = ivec4Array;
    }

    public update(): void {

        let mustBeTransfered = false;
        let m: IVec4;
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

    public uvec4Array: UVec4[];

    constructor(uvec4Array: UVec4[]) {
        let buf: Uint32Array = new Uint32Array(uvec4Array.length * 4);
        for (let i = 0; i < uvec4Array.length; i++) buf.set(uvec4Array[i], i * 4);
        let type: string = "array<vec4<u32>," + uvec4Array.length + ">";
        super(type, buf);
        this.className = type;
        this.uvec4Array = uvec4Array;
    }

    public update(): void {

        let mustBeTransfered = false;
        let m: UVec4;
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
        super("mat3x3<f32>", new Float32Array([1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0]) as Float32Array);
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



    protected _x: number = 0;
    protected _y: number = 0;
    protected _z: number = 0;

    protected _sx: number = 1;
    protected _sy: number = 1;
    protected _sz: number = 1;

    protected _rx: number = 0;
    protected _ry: number = 0;
    protected _rz: number = 0;

    protected disableUpdate: boolean;


    constructor(floatArray: Float32Array = null) {
        const disableUpdate = !!floatArray;
        if (!floatArray) floatArray = new Float32Array([1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1]);
        super("mat4x4<f32>", floatArray);
        this.className = "mat4x4<f32>"
        this.disableUpdate = disableUpdate;

    }

    public clone(): PrimitiveFloatUniform {
        const m = new Matrix4x4(this as Float32Array);
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

    public set scaleXYZ(n: number) {
        this.scaleX = this.scaleY = this.scaleZ = n;
        this.mustBeTransfered = true;
    }


    public setMatrix(mat: Float32Array) {
        this.set(mat);
        this.mustBeTransfered = true;
    }

    public update() {

        //console.log("matrix.update ", this.disableUpdate)
        if (this.disableUpdate) return;

        if (this.mustBeTransfered) {

            mat4.identity(this);
            mat4.rotate(this, this, this._rx, vec3.fromValues(1, 0, 0));
            mat4.rotate(this, this, this._ry, vec3.fromValues(0, 1, 0));
            mat4.rotate(this, this, this._rz, vec3.fromValues(0, 0, 1));
            mat4.translate(this, this, vec3.fromValues(this._x, this._y, this._z));
            mat4.scale(this, this, vec3.fromValues(this._sx, this._sy, this._sz));



            /*
            
            //with wgpu-matrix
             mat4.identity(this);
            mat4.rotateX(this, this._rx, this);
            mat4.rotateY(this, this._ry, this);
            mat4.rotateZ(this, this._rz, this);
            mat4.translate(this, vec3.fromValues(this._x, this._y, this._z), this)
            mat4.scale(this, vec3.fromValues(this._sx, this._sy, this._sz), this);

            */
        }


    }

}

//--------------------



//--------------------

export class Matrix4x4Array extends PrimitiveFloatUniform {

    public matrixs: Matrix4x4[];

    constructor(mat4x4Array: Matrix4x4[]) {

        let buf: Float32Array = new Float32Array(mat4x4Array.length * 16);
        for (let i = 0; i < mat4x4Array.length; i++) buf.set(mat4x4Array[i], i * 16);
        super("array<mat4x4<f32>," + mat4x4Array.length + ">", buf)

        this.matrixs = mat4x4Array;
        this.mustBeTransfered = true;

        this.className = "array<mat4x4<f32>," + mat4x4Array.length + ">";
    }

    public update(): void {



        let mustBeTransfered = false;
        let m: Matrix4x4;
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

