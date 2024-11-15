var ke = Object.defineProperty;
var je = (v, t, e) => t in v ? ke(v, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : v[t] = e;
var u = (v, t, e) => je(v, typeof t != "symbol" ? t + "" : t, e);
import { mat4 as ee, vec3 as ae } from "gl-matrix";
class b {
  static __initDebug() {
    let t;
    for (let e in this.vertexDebug)
      t = this.vertexDebug[e](), this.vertexDebug[e].isArray = !!t.isArray, this.vertexDebug[e].len = t.len, this.vertexDebug[e].primitiveType = t.primitiveType, this.vertexDebug[e].type = t.type, this.vertexDebug[e].__debug = !0;
  }
}
u(b, "vertexInputs", {
  vertexIndex: { builtin: "@builtin(vertex_index)", type: "u32" },
  instanceIndex: { builtin: "@builtin(instance_index)", type: "u32" }
}), u(b, "vertexOutputs", {
  position: { builtin: "@builtin(position)", type: "vec4<f32>" },
  Float: { type: "f32", vsOut: !0 },
  Vec2: { type: "vec2<f32>", vsOut: !0 },
  Vec3: { type: "vec3<f32>", vsOut: !0 },
  Vec4: { type: "vec4<f32>", vsOut: !0 }
}), u(b, "vertexDebug", {
  Float: (t = 0, e = 0) => ({ vertexId: e, instanceId: t, type: "f32", __debug: !0 }),
  Vec2: (t = 0, e = 0) => ({ vertexId: e, instanceId: t, type: "vec2<f32>", __debug: !0 }),
  Vec3: (t = 0, e = 0) => ({ vertexId: e, instanceId: t, type: "vec3<f32>", __debug: !0 }),
  Vec4: (t = 0, e = 0) => ({ vertexId: e, instanceId: t, type: "vec4<f32>", __debug: !0 }),
  Int: (t = 0, e = 0) => ({ vertexId: e, instanceId: t, type: "i32", __debug: !0 }),
  IVec2: (t = 0, e = 0) => ({ vertexId: e, instanceId: t, type: "vec2<i32>", __debug: !0 }),
  IVec3: (t = 0, e = 0) => ({ vertexId: e, instanceId: t, type: "vec3<i32>", __debug: !0 }),
  IVec4: (t = 0, e = 0) => ({ vertexId: e, instanceId: t, type: "vec4<i32>", __debug: !0 }),
  Uint: (t = 0, e = 0) => ({ vertexId: e, instanceId: t, type: "uint", __debug: !0 }),
  UVec2: (t = 0, e = 0) => ({ vertexId: e, instanceId: t, type: "vec2<u32>", __debug: !0 }),
  UVec3: (t = 0, e = 0) => ({ vertexId: e, instanceId: t, type: "vec3<u32>", __debug: !0 }),
  UVec4: (t = 0, e = 0) => ({ vertexId: e, instanceId: t, type: "vec4<uf32>", __debug: !0 }),
  Matrix3x3: (t = 0, e = 0) => ({ vertexId: e, instanceId: t, type: "mat3x3<f32>", __debug: !0 }),
  Matrix4x4: (t = 0, e = 0) => ({ vertexId: e, instanceId: t, type: "mat4x4<f32>", __debug: !0 }),
  Vec4Array: (t = 1, e = 0, s = 0) => ({ vertexId: s, instanceId: e, type: "array<vec4<f32>," + t + ">", __debug: !0, len: t, isArray: !0, primitiveType: "f32" }),
  IVec4Array: (t = 1, e = 0, s = 0) => ({ vertexId: s, instanceId: e, type: "array<vec4<i32>," + t + ">", __debug: !0, len: t, isArray: !0, primitiveType: "i32" }),
  UVec4Array: (t = 1, e = 0, s = 0) => ({ vertexId: s, instanceId: e, type: "array<vec4<u32>," + t + ">", __debug: !0, len: t, isArray: !0, primitiveType: "u32" }),
  Matrix4x4Array: (t = 1, e = 0, s = 0) => ({ vertexId: s, instanceId: e, type: "array<mat4x4<f32>," + t + ">", __debug: !0, len: t, isArray: !0, primitiveType: "mat4" })
}), //----
u(b, "fragmentInputs", {
  frontFacing: { builtin: "@builtin(front_facing)", type: "bool" },
  fragDepth: { builtin: "@builtin(frag_depth)", type: "f32" },
  sampleIndex: { builtin: "@builtin(sample_index)", type: "u32" },
  sampleMask: { builtin: "@builtin(sample_mask)", type: "u32" }
}), u(b, "fragmentOutputs", {
  color: { builtin: "@location(0)", type: "vec4<f32>" }
}), //----
u(b, "computeInputs", {
  localInvocationId: { builtin: "@builtin(local_invocation_id)", type: "vec3<u32>" },
  localInvocationIndex: { builtin: "@builtin(local_invocation_index)", type: "u32" },
  globalInvocationId: { builtin: "@builtin(global_invocation_id)", type: "vec3<u32>" },
  workgroupId: { builtin: "@builtin(workgroup_id)", type: "vec3<u32>" },
  numWorkgroup: { builtin: "@builtin(num_workgroup)", type: "vec3<u32>" }
}), u(b, "computeOutputs", {
  result: { builtin: "@location(0)", type: "???" }
});
class ie {
  //https://www.w3.org/TR/WGSL/#alignment-and-size
  constructor(t) {
    u(this, "_isVector", !1);
    u(this, "_isMatrix", !1);
    u(this, "_isArray", !1);
    u(this, "_vecType", 1);
    u(this, "_arrayLen");
    u(this, "_primitive");
    u(this, "_matrixColumns", 1);
    u(this, "_matrixRows", 1);
    u(this, "_alignOf");
    u(this, "_sizeOf");
    u(this, "_dataType");
    u(this, "_rawType");
    u(this, "getPrimitiveDataType", (t, e) => {
      switch (t.substring(e, e + 1)) {
        case "u":
          this._primitive = "u32", this._alignOf = 4, this._sizeOf = 4;
          break;
        case "i":
          this._primitive = "i32", this._alignOf = 4, this._sizeOf = 4;
          break;
        case "f":
          const i = t.substring(e, e + 3);
          if (i === "f32" || i == "flo")
            this._primitive = "f32", this._alignOf = 4, this._sizeOf = 4;
          else if (i === "f16")
            this._primitive = i, this._alignOf = 2, this._sizeOf = 2;
          else throw new Error("invalid primitive type");
          break;
        case "v":
          if (t.substring(e, e + 3) === "vec") {
            this._isVector = !0;
            const n = Number(t.substring(e + 3, e + 4));
            if (n >= 2 && n <= 4)
              this._vecType = n, this.getPrimitiveDataType(t, e + 5), this._primitive === "f16" ? (this._sizeOf = 2 * n, n === 2 ? this._alignOf = 4 : n === 3 ? this._alignOf = 8 : n === 4 && (this._alignOf = 8)) : (this._sizeOf = 4 * n, n === 2 ? this._alignOf = 8 : n === 3 ? this._alignOf = 16 : n === 4 && (this._alignOf = 16));
            else
              throw new Error("invalid vec type");
          } else
            throw new Error("invalid primitive type");
          break;
        case "a":
          if (t.substring(e, e + 5) === "array") {
            this._isArray = !0;
            let n = 15;
            if (t.substring(6, 7) === "m" ? n = 17 : (t.substring(6, 7) === "f" || t.substring(6, 7) === "i" || t.substring(6, 7) === "u") && (n = 9), t.substring(e + n, e + n + 1) === ",") {
              let r;
              n++;
              for (let a = 1; a < 16; a++) {
                let o = t.substring(n, n + a);
                if (isNaN(Number(o))) break;
                r = o;
              }
              this._arrayLen = Number(r);
            }
            this.getPrimitiveDataType(t, e + 6), this.arrayLength && (this._sizeOf *= this._arrayLen);
          } else
            throw new Error("invalid primitive type");
          break;
        case "m":
          if (t.substring(e, e + 3) === "mat") {
            this._isMatrix = !0;
            const n = Number(t.substring(e + 3, e + 4)), r = Number(t.substring(e + 5, e + 6));
            if (!isNaN(n) && !isNaN(r))
              if (this._matrixColumns = n, this._matrixRows = r, this.getPrimitiveDataType(t, e + 7), this._primitive === "f16" || this._primitive === "f32")
                this.getMatrixBytesStructure(n, r, this._primitive);
              else
                throw new Error("Matrix values must be f32 or f16");
            else
              throw new Error("invalid matrix type");
          } else
            throw new Error("invalid primitive type");
          break;
      }
    });
    this._rawType = t, t = this.renameDataType(t), this._dataType = t, this.getPrimitiveDataType(t, 0);
  }
  renameDataType(t) {
    switch (t) {
      case "float":
        return "f32";
      case "vec2":
        return "vec2<f32>";
      case "vec3":
        return "vec3<f32>";
      case "vec4":
        return "vec4<f32>";
      case "int":
        return "i32";
      case "ivec2":
        return "vec2<i32>";
      case "ivec3":
        return "vec3<i32>";
      case "ivec4":
        return "vec4<i32>";
      case "uint":
        return "u32";
      case "uvec2":
        return "vec2<u32>";
      case "uvec3":
        return "vec3<u32>";
      case "uvec4":
        return "vec4<u32>";
      case "mat4":
        return "mat4x4<f32>";
      case "mat3":
        return "mat3x3<f32>";
      case "mat2":
        return "mat2x2<f32>";
      case "mat2d":
        return "mat2w3<f32>";
    }
    return t;
  }
  get isPrimitive() {
    return !this._isVector && !this._isArray && !this._isMatrix;
  }
  get isVector() {
    return this._isVector && !this._isArray && !this._isMatrix;
  }
  get isMatrix() {
    return this._isMatrix && !this._isArray;
  }
  get isArray() {
    return this._isArray;
  }
  get isMatrixOfVectors() {
    return this._isMatrix && this._isVector;
  }
  get isArrayOfVectors() {
    return this._isArray && this._isVector;
  }
  get isArrayOfMatrixs() {
    return this._isArray && this._isMatrix;
  }
  get vectorType() {
    return this._vecType;
  }
  get arrayLength() {
    return this._arrayLen;
  }
  get matrixColumns() {
    return this._matrixColumns;
  }
  get matrixRows() {
    return this._matrixRows;
  }
  get primitive() {
    return this._primitive;
  }
  get nbValues() {
    return this._matrixColumns * this._matrixRows * this._vecType * (this._arrayLen ? this._arrayLen : 1);
  }
  get byteSize() {
    return this._sizeOf;
  }
  get byteAlign() {
    return this._alignOf;
  }
  set byteAlign(t) {
    this._alignOf = t;
  }
  get dataType() {
    return this._dataType;
  }
  get rawType() {
    return this._rawType;
  }
  get byteValue() {
    return this._primitive === "f16" ? 2 : 4;
  }
  getMatrixBytesStructure(t, e, s) {
    const i = "mat" + t + "x" + e + "<" + s + ">", r = {
      "mat2x2<f32>": [8, 16],
      "mat2x2<f16>": [4, 8],
      "mat3x2<f32>": [8, 24],
      "mat3x2<f16>": [4, 12],
      "mat4x2<f32>": [8, 32],
      "mat4x2<f16>": [4, 16],
      "mat2x3<f32>": [16, 32],
      "mat2x3<f16>": [8, 16],
      "mat3x3<f32>": [16, 48],
      "mat3x3<f16>": [8, 24],
      "mat4x3<f32>": [16, 64],
      "mat4x3<f16>": [8, 32],
      "mat2x4<f32>": [16, 32],
      "mat2x4<f16>": [8, 16],
      "mat3x4<f32>": [16, 48],
      "mat3x4<f16>": [8, 24],
      "mat4x4<f32>": [16, 64],
      "mat4x4<f16>": [8, 32]
    }[i];
    this._alignOf = r[0], this._sizeOf = r[1];
  }
}
const $ = class $ extends Float32Array {
  constructor(e, s, i = !1) {
    super(s);
    //public uniform: Uniform;
    u(this, "name");
    u(this, "type");
    u(this, "startId", 0);
    u(this, "globalStartId", 0);
    u(this, "onChange");
    u(this, "_mustBeTransfered", !0);
    //public mustBeTransfered:boolean = true;
    u(this, "uniformBuffer");
    u(this, "propertyNames");
    u(this, "createVariableInsideMain", !1);
    u(this, "className");
    //--------- EVENT DISPATCHER CLASS (that I can't extends because we already extends Float32Array)----
    u(this, "eventListeners", {});
    this.type = new ie(e), this.createVariableInsideMain = i, this.className = this.constructor.name;
  }
  get mustBeTransfered() {
    return this._mustBeTransfered;
  }
  set mustBeTransfered(e) {
    e != this._mustBeTransfered && (e ? this.dispatchEvent($.ON_CHANGE) : this.dispatchEvent($.ON_CHANGED), this._mustBeTransfered = e);
  }
  clone() {
    const e = new $(this.type.rawType, this, this.createVariableInsideMain);
    return e.propertyNames = this.propertyNames, e.className = this.className, e.name = this.name, e.startId = this.startId, e;
  }
  initStruct(e, s = !1) {
    if (this.type.isArray || this.type.isMatrix) throw new Error("initStruct doesn't accept array or matrix");
    this.propertyNames = e, this.createVariableInsideMain = s;
  }
  createStruct() {
    let e = "struct " + this.className + ` {
`;
    for (let s = 0; s < this.propertyNames.length; s++)
      e += "   " + this.propertyNames[s] + `:f32,
`;
    return e += `}
`, e;
  }
  set(e, s) {
    super.set(e, s), this.mustBeTransfered = !0;
  }
  createVariable(e, s) {
    if (!this.createVariableInsideMain) return "";
    s || (s = this.name);
    let i = this.className;
    return i === "Float" && (i = "f32"), i === "Vec2" && (i = "vec2<f32>"), i === "Vec3" && (i = "vec3<f32>"), i === "Vec4" && (i = "vec4<f32>"), "   var " + s + ":" + i + " = " + e + "." + s + `;
`;
  }
  update() {
  }
  updateStartIdFromParentToChildren() {
  }
  addEventListener(e, s) {
    this.eventListeners[e] || (this.eventListeners[e] = []), this.eventListeners[e].push(s);
  }
  removeEventListener(e, s) {
    if (this.eventListeners[e]) {
      const i = this.eventListeners[e].indexOf(s);
      i != -1 && this.eventListeners[e].splice(i, 1);
    }
  }
  dispatchEvent(e, s) {
    this.eventListeners[e] && this.eventListeners[e].forEach((i) => {
      i(this, s);
    });
  }
  //---------------------------------------------------------------------------------------------
  get definition() {
    return { type: this.constructor.name, values: this, name: this.name };
  }
};
u($, "ON_CHANGE", "ON_CHANGE"), u($, "ON_CHANGED", "ON_CHANGED");
let O = $;
const q = class q extends Int32Array {
  constructor(e, s, i = !1) {
    super(s);
    u(this, "name");
    u(this, "type");
    u(this, "startId", 0);
    u(this, "globalStartId", 0);
    u(this, "onChange");
    u(this, "_mustBeTransfered", !0);
    u(this, "uniformBuffer");
    u(this, "propertyNames");
    u(this, "createVariableInsideMain", !1);
    u(this, "className");
    //--------- EVENT DISPATCHER CLASS (that I can't extends because we already extends Int32Array)----
    u(this, "eventListeners", {});
    this.type = new ie(e), this.createVariableInsideMain = i, this.className = this.constructor.name;
  }
  get mustBeTransfered() {
    return this._mustBeTransfered;
  }
  set mustBeTransfered(e) {
    e != this._mustBeTransfered && (e ? this.dispatchEvent(q.ON_CHANGE) : this.dispatchEvent(q.ON_CHANGED), this._mustBeTransfered = e);
  }
  clone() {
    return new q(this.type.rawType, this, this.createVariableInsideMain);
  }
  initStruct(e, s = !1) {
    if (this.type.isArray || this.type.isMatrix) throw new Error("initStruct doesn't accept array or matrix");
    this.propertyNames = e, this.createVariableInsideMain = s;
  }
  createStruct() {
    let e = "struct " + this.constructor.name + ` {
`;
    for (let s = 0; s < this.propertyNames.length; s++)
      e += "   " + this.propertyNames[s] + `:i32,
`;
    return e += `}
`, e;
  }
  updateStartIdFromParentToChildren() {
  }
  createVariable(e) {
    if (!this.createVariableInsideMain) return "";
    let s = this.className;
    return s === "Int" && (s = "i32"), s === "IVec2" && (s = "vec2<i32>"), s === "IVec3" && (s = "vec3<i32>"), s === "IVec4" && (s = "vec4<i32>"), "   var " + this.name + ":" + s + " = " + e + "." + this.name + `;
`;
  }
  /*
  public feedbackVertexId: number = 0;
  public feedbackInstanceId: number = 0;
  public setFeedback(vertexId: number, instanceId: number): PrimitiveIntUniform {
      this.feedbackVertexId = vertexId;
      this.feedbackInstanceId = instanceId;
      return this;
  }*/
  update() {
  }
  addEventListener(e, s) {
    this.eventListeners[e] || (this.eventListeners[e] = []), this.eventListeners[e].push(s);
  }
  removeEventListener(e, s) {
    if (this.eventListeners[e]) {
      const i = this.eventListeners[e].indexOf(s);
      i != -1 && this.eventListeners[e].splice(i, 1);
    }
  }
  dispatchEvent(e, s) {
    this.eventListeners[e] && this.eventListeners[e].forEach((i) => {
      i(this, s);
    });
  }
  //---------------------------------------------------------------------------------------------
  get definition() {
    return { type: this.constructor.name, values: this, name: this.name };
  }
};
u(q, "ON_CHANGE", "ON_CHANGE"), u(q, "ON_CHANGED", "ON_CHANGED");
let P = q;
const X = class X extends Uint32Array {
  constructor(e, s, i = !1) {
    super(s);
    u(this, "name");
    u(this, "type");
    u(this, "startId", 0);
    u(this, "globalStartId", 0);
    u(this, "uniformBuffer");
    u(this, "onChange");
    u(this, "_mustBeTransfered", !0);
    u(this, "propertyNames");
    u(this, "createVariableInsideMain", !1);
    u(this, "className");
    //--------- EVENT DISPATCHER CLASS (that I can't extends because we already extends Uint32Array)----
    u(this, "eventListeners", {});
    this.type = new ie(e), this.createVariableInsideMain = i, this.className = this.constructor.name;
  }
  get mustBeTransfered() {
    return this._mustBeTransfered;
  }
  set mustBeTransfered(e) {
    e != this._mustBeTransfered && (e ? this.dispatchEvent(X.ON_CHANGE) : this.dispatchEvent(X.ON_CHANGED), this._mustBeTransfered = e);
  }
  clone() {
    return new X(this.type.rawType, this, this.createVariableInsideMain);
  }
  initStruct(e, s = !1) {
    if (this.type.isArray || this.type.isMatrix) throw new Error("initStruct doesn't accept array or matrix");
    this.propertyNames = e, this.createVariableInsideMain = s;
  }
  createStruct() {
    let e = "struct " + this.constructor.name + ` {
`;
    for (let s = 0; s < this.propertyNames.length; s++)
      e += "   " + this.propertyNames[s] + `:u32,
`;
    return e += `}
`, e;
  }
  updateStartIdFromParentToChildren() {
  }
  createVariable(e) {
    if (!this.createVariableInsideMain) return "";
    let s = this.className;
    return s === "Uint" && (s = "u32"), s === "UVec2" && (s = "vec2<u32>"), s === "UVec3" && (s = "vec3<u32>"), s === "UVec4" && (s = "vec4<u32>"), "   var " + this.name + ":" + s + " = " + e + "." + this.name + `;
`;
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
  update() {
  }
  addEventListener(e, s) {
    this.eventListeners[e] || (this.eventListeners[e] = []), this.eventListeners[e].push(s);
  }
  removeEventListener(e, s) {
    if (this.eventListeners[e]) {
      const i = this.eventListeners[e].indexOf(s);
      i != -1 && this.eventListeners[e].splice(i, 1);
    }
  }
  dispatchEvent(e, s) {
    this.eventListeners[e] && this.eventListeners[e].forEach((i) => {
      i(this, s);
    });
  }
  //---------------------------------------------------------------------------------------------
  get definition() {
    return { type: this.constructor.name, values: this, name: this.name };
  }
};
u(X, "ON_CHANGE", "ON_CHANGE"), u(X, "ON_CHANGED", "ON_CHANGED");
let D = X;
class Ve extends O {
  constructor(t = 0, e = !1) {
    super("f32", [t], e);
  }
  set x(t) {
    this[0] = t, this.mustBeTransfered = !0;
  }
  get x() {
    return this[0];
  }
}
class He extends O {
  constructor(t = 0, e = 0, s = !1) {
    super("vec2<f32>", [t, e], s);
  }
  set x(t) {
    this[0] = t, this.mustBeTransfered = !0;
  }
  set y(t) {
    this[1] = t, this.mustBeTransfered = !0;
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
}
class Ye extends O {
  constructor(t = 0, e = 0, s = 0, i = !1) {
    super("vec3<f32>", [t, e, s], i);
  }
  set x(t) {
    this[0] = t, this.mustBeTransfered = !0;
  }
  set y(t) {
    this[1] = t, this.mustBeTransfered = !0;
  }
  set z(t) {
    this[2] = t, this.mustBeTransfered = !0;
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get z() {
    return this[2];
  }
}
class Ce extends O {
  constructor(t = 0, e = 0, s = 0, i = 0, n = !1) {
    super("vec4<f32>", [t, e, s, i], n);
  }
  set x(t) {
    this[0] = t, this.mustBeTransfered = !0;
  }
  set y(t) {
    this[1] = t, this.mustBeTransfered = !0;
  }
  set z(t) {
    this[2] = t, this.mustBeTransfered = !0;
  }
  set w(t) {
    this[3] = t, this.mustBeTransfered = !0;
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get z() {
    return this[2];
  }
  get w() {
    return this[3];
  }
}
class We extends P {
  constructor(t = 0, e = !1) {
    super("i32", [t], e);
  }
  set x(t) {
    this[0] = t, this.mustBeTransfered = !0;
  }
  get x() {
    return this[0];
  }
}
class $e extends P {
  constructor(t = 0, e = 0, s = !1) {
    super("vec2<i32>", [t, e], s);
  }
  set x(t) {
    this[0] = t, this.mustBeTransfered = !0;
  }
  set y(t) {
    this[1] = t, this.mustBeTransfered = !0;
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
}
class qe extends P {
  constructor(t = 0, e = 0, s = 0, i = !1) {
    super("vec3<i32>", [t, e, s], i);
  }
  set x(t) {
    this[0] = t, this.mustBeTransfered = !0;
  }
  set y(t) {
    this[1] = t, this.mustBeTransfered = !0;
  }
  set z(t) {
    this[2] = t, this.mustBeTransfered = !0;
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get z() {
    return this[2];
  }
}
class Me extends P {
  constructor(t = 0, e = 0, s = 0, i = 0, n = !1) {
    super("vec4<i32>", [t, e, s, i], n);
  }
  set x(t) {
    this[0] = t, this.mustBeTransfered = !0;
  }
  set y(t) {
    this[1] = t, this.mustBeTransfered = !0;
  }
  set z(t) {
    this[2] = t, this.mustBeTransfered = !0;
  }
  set w(t) {
    this[3] = t, this.mustBeTransfered = !0;
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get z() {
    return this[2];
  }
  get w() {
    return this[3];
  }
}
class Xe extends D {
  constructor(t = 0, e = !1) {
    super("u32", [t], e);
  }
  set x(t) {
    this[0] = t, this.mustBeTransfered = !0;
  }
  get x() {
    return this[0];
  }
}
class Qe extends D {
  constructor(t = 0, e = 0, s = !1) {
    super("vec2<u32>", [t, e], s);
  }
  set x(t) {
    this[0] = t, this.mustBeTransfered = !0;
  }
  set y(t) {
    this[1] = t, this.mustBeTransfered = !0;
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
}
class Ze extends D {
  constructor(t = 0, e = 0, s = 0, i = !1) {
    super("vec3<u32>", [t, e, s], i);
  }
  set x(t) {
    this[0] = t, this.mustBeTransfered = !0;
  }
  set y(t) {
    this[1] = t, this.mustBeTransfered = !0;
  }
  set z(t) {
    this[2] = t, this.mustBeTransfered = !0;
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get z() {
    return this[2];
  }
}
class Le extends D {
  constructor(t = 0, e = 0, s = 0, i = 0, n = !1) {
    super("vec4<u32>", [t, e, s, i], n);
  }
  set x(t) {
    this[0] = t, this.mustBeTransfered = !0;
  }
  set y(t) {
    this[1] = t, this.mustBeTransfered = !0;
  }
  set z(t) {
    this[2] = t, this.mustBeTransfered = !0;
  }
  set w(t) {
    this[3] = t, this.mustBeTransfered = !0;
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get z() {
    return this[2];
  }
  get w() {
    return this[3];
  }
}
class Fe extends O {
  constructor(e) {
    let s;
    if (typeof e != "number") s = e;
    else {
      s = [];
      for (let a = 0; a < e; a++) s[a] = new Ce();
    }
    const i = s.length;
    let n = new Float32Array(i * 4);
    for (let a = 0; a < i; a++) n.set(s[a], a * 4);
    let r = "array<vec4<f32>," + s.length + ">";
    super("array<vec4<f32>," + s.length + ">", n);
    u(this, "vec4Array");
    this.className = r, this.vec4Array = s;
    for (let a = 0; a < this.vec4Array.length; a++)
      this.vec4Array[a].addEventListener("ON_CHANGE", () => {
        this.mustBeTransfered = !0, this.set(this.vec4Array[a], a * 4), this.dispatchEvent("ON_CHANGE");
      });
  }
  updateStartIdFromParentToChildren() {
    for (let e = 0; e < this.vec4Array.length; e++)
      this.vec4Array[e].globalStartId = this.globalStartId + this.vec4Array[e].startId;
  }
  update() {
    let e = !1, s;
    for (let i = 0; i < this.vec4Array.length; i++)
      s = this.vec4Array[i], s.name || (s.name = this.name + "#" + i), s.update(), s.mustBeTransfered && (e = !0, this.set(s, i * 4), s.mustBeTransfered = !1);
    this.mustBeTransfered != e && (this.mustBeTransfered = e);
  }
}
class Je extends P {
  constructor(e) {
    let s;
    if (typeof e != "number") s = e;
    else {
      s = [];
      for (let a = 0; a < e; a++) s[a] = new Me();
    }
    const i = s.length;
    let n = new Int32Array(i * 4);
    for (let a = 0; a < i; a++) n.set(s[a], a * 4);
    let r = "array<vec4<i32>," + s.length + ">";
    super(r, n);
    u(this, "ivec4Array");
    this.className = r, this.ivec4Array = s;
    for (let a = 0; a < this.ivec4Array.length; a++)
      this.ivec4Array[a].addEventListener("ON_CHANGE", () => {
        this.mustBeTransfered = !0, this.set(this.ivec4Array[a], a * 4), this.dispatchEvent("ON_CHANGE");
      });
  }
  updateStartIdFromParentToChildren() {
    for (let e = 0; e < this.ivec4Array.length; e++)
      this.ivec4Array[e].globalStartId = this.globalStartId + this.ivec4Array[e].startId;
  }
  update() {
    let e = !1, s;
    for (let i = 0; i < this.ivec4Array.length; i++)
      s = this.ivec4Array[i], s.update(), s.mustBeTransfered && (e = !0, this.set(s, i * 4), s.mustBeTransfered = !1);
    this.mustBeTransfered = e;
  }
}
class Ke extends D {
  constructor(e) {
    let s;
    if (typeof e != "number") s = e;
    else {
      s = [];
      for (let a = 0; a < e; a++) s[a] = new Le();
    }
    const i = s.length;
    let n = new Uint32Array(i * 4);
    for (let a = 0; a < i; a++) n.set(s[a], a * 4);
    let r = "array<vec4<u32>," + s.length + ">";
    super(r, n);
    u(this, "uvec4Array");
    this.className = r, this.uvec4Array = s;
    for (let a = 0; a < this.uvec4Array.length; a++)
      this.uvec4Array[a].addEventListener("ON_CHANGE", () => {
        this.mustBeTransfered = !0, this.set(this.uvec4Array[a], a * 4), this.dispatchEvent("ON_CHANGE");
      });
  }
  updateStartIdFromParentToChildren() {
    for (let e = 0; e < this.uvec4Array.length; e++)
      this.uvec4Array[e].globalStartId = this.globalStartId + this.uvec4Array[e].startId;
  }
  update() {
    let e = !1, s;
    for (let i = 0; i < this.uvec4Array.length; i++)
      s = this.uvec4Array[i], s.update(), s.mustBeTransfered && (e = !0, this.set(s, i * 4), s.mustBeTransfered = !1);
    this.mustBeTransfered = e;
  }
}
class et extends O {
  constructor(e = null) {
    const s = !!e;
    e || (e = new Float32Array([
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ]));
    super("mat3x3<f32>", e);
    u(this, "disableUpdate");
    this.className = "mat3x3<f32>", this.disableUpdate = s;
  }
}
class ye extends O {
  constructor(e = null) {
    const s = !!e;
    e || (e = new Float32Array([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ]));
    super("mat4x4<f32>", e);
    u(this, "_x", 0);
    u(this, "_y", 0);
    u(this, "_z", 0);
    u(this, "_sx", 1);
    u(this, "_sy", 1);
    u(this, "_sz", 1);
    u(this, "_rx", 0);
    u(this, "_ry", 0);
    u(this, "_rz", 0);
    u(this, "disableUpdate");
    this.className = "mat4x4<f32>", this.disableUpdate = s;
  }
  clone() {
    const e = new ye(this);
    return e.x = this.x, e.y = this.y, e.z = this.z, e.rotationX = this.rotationX, e.rotationY = this.rotationY, e.rotationZ = this.rotationZ, e.scaleX = this.scaleX, e.scaleY = this.scaleY, e.scaleZ = this.scaleZ, e.disableUpdate = this.disableUpdate, e;
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get z() {
    return this._z;
  }
  get rotationX() {
    return this._rx;
  }
  get rotationY() {
    return this._ry;
  }
  get rotationZ() {
    return this._rz;
  }
  get scaleX() {
    return this._sx;
  }
  get scaleY() {
    return this._sy;
  }
  get scaleZ() {
    return this._sz;
  }
  set x(e) {
    e !== this._x && (this.mustBeTransfered = !0, this._x = e);
  }
  set y(e) {
    e !== this._y && (this.mustBeTransfered = !0, this._y = e);
  }
  set z(e) {
    e !== this._z && (this.mustBeTransfered = !0, this._z = e);
  }
  set rotationX(e) {
    e !== this._rx && (this.mustBeTransfered = !0, this._rx = e);
  }
  set rotationY(e) {
    e !== this._ry && (this.mustBeTransfered = !0, this._ry = e);
  }
  set rotationZ(e) {
    e !== this._rz && (this.mustBeTransfered = !0, this._rz = e);
  }
  set scaleX(e) {
    e !== this._sx && (this.mustBeTransfered = !0, this._sx = e);
  }
  set scaleY(e) {
    e !== this._sy && (this.mustBeTransfered = !0, this._sy = e);
  }
  set scaleZ(e) {
    e !== this._sz && (this.mustBeTransfered = !0, this._sz = e);
  }
  set scaleXYZ(e) {
    this.scaleX = this.scaleY = this.scaleZ = e, this.mustBeTransfered = !0;
  }
  setMatrix(e) {
    this.set(e), this.mustBeTransfered = !0;
  }
  update() {
    this.disableUpdate || this.mustBeTransfered && (ee.identity(this), ee.rotate(this, this, this._rx, ae.fromValues(1, 0, 0)), ee.rotate(this, this, this._ry, ae.fromValues(0, 1, 0)), ee.rotate(this, this, this._rz, ae.fromValues(0, 0, 1)), ee.translate(this, this, ae.fromValues(this._x, this._y, this._z)), ee.scale(this, this, ae.fromValues(this._sx, this._sy, this._sz)));
  }
}
class tt extends O {
  constructor(e) {
    let s;
    if (typeof e != "number") s = e;
    else {
      s = [];
      for (let r = 0; r < e; r++) s[r] = new ye();
    }
    const i = s.length;
    let n = new Float32Array(i * 16);
    for (let r = 0; r < i; r++) n.set(s[r], r * 16);
    super("array<mat4x4<f32>," + i + ">", n);
    u(this, "matrixs");
    this.matrixs = s, this.mustBeTransfered = !0, this.className = "array<mat4x4<f32>," + i + ">";
    for (let r = 0; r < this.matrixs.length; r++)
      this.matrixs[r].addEventListener("ON_CHANGE", () => {
        this.mustBeTransfered = !0, this.set(this.matrixs[r], r * 16), this.dispatchEvent("ON_CHANGE");
      });
  }
  updateStartIdFromParentToChildren() {
    for (let e = 0; e < this.matrixs.length; e++)
      this.matrixs[e].globalStartId = this.globalStartId + this.matrixs[e].startId;
  }
  update() {
    let e = !1, s;
    for (let i = 0; i < this.matrixs.length; i++)
      s = this.matrixs[i], s.update(), s.mustBeTransfered && (e = !0, this.set(s, i * 16), s.mustBeTransfered = !1);
    this.mustBeTransfered = e;
  }
}
class Z {
  constructor() {
    u(this, "eventListeners", {});
  }
  addEventListener(t, e, s = !1) {
    this.eventListeners[t] || (this.eventListeners[t] = []), s && (e.removeAfter = !0), this.eventListeners[t].push(e);
  }
  removeEventListener(t, e) {
    if (this.eventListeners[t]) {
      const s = this.eventListeners[t].indexOf(e);
      s != -1 && this.eventListeners[t].splice(s, 1);
    }
  }
  clearEvents(t) {
    this.addEventListener[t] = [];
  }
  hasEventListener(t) {
    return !!this.eventListeners[t];
  }
  dispatchEvent(t, e) {
    this.eventListeners[t] && [...this.eventListeners[t]].forEach((i) => {
      i(e), i.removeAfter && this.removeEventListener(t, i);
    });
  }
}
const se = class se extends Z {
  constructor(e, s = !1) {
    super();
    u(this, "groups");
    u(this, "startId", 0);
    u(this, "globalStartId", 0);
    u(this, "createVariableInsideMain", !1);
    u(this, "name");
    u(this, "mustBeTransfered", !0);
    u(this, "mustDispatchChangeEvent", !1);
    u(this, "buffer", null);
    this.groups = e;
    let i = 0;
    e.forEach((n) => {
      n.startId = i, n.startId = i, i += n.arrayStride, n.addEventListener(re.ON_CHANGE, () => {
        this.mustBeTransfered = !0, this.dispatchEvent(se.ON_CHANGE);
      });
    }), this.createVariableInsideMain = s;
  }
  get uniformBuffer() {
    return this.buffer;
  }
  set uniformBuffer(e) {
    this.buffer = e, e && (e.mustBeTransfered = !0);
    for (let s = 0; s < this.groups.length; s++)
      this.groups[s].uniformBuffer = e;
  }
  updateStartIdFromParentToChildren() {
    for (let e = 0; e < this.groups.length; e++)
      this.groups[e].globalStartId = this.globalStartId + this.groups[e].startId, this.groups[e].updateStartIdFromParentToChildren();
  }
  clone() {
    const e = [...this.groups];
    for (let i = 0; i < e.length; i++)
      e[i] = e[i].clone();
    const s = new se(e, this.createVariableInsideMain);
    return s.startId = this.startId, s.name = this.name, s;
  }
  get type() {
    return { nbComponent: this.arrayStride, isUniformGroup: !0, isArray: !0 };
  }
  copyIntoDataView(e, s) {
    let i;
    for (let n = 0; n < this.groups.length; n++)
      i = this.groups[n], i.mustBeTransfered && (i.copyIntoDataView(e, s), i.mustBeTransfered = !1), s += i.arrayStride;
    this.mustBeTransfered = !1;
  }
  getStructName(e) {
    return e ? e[0].toUpperCase() + e.slice(1) : null;
  }
  getVarName(e) {
    return e ? e[0].toLowerCase() + e.slice(1) : null;
  }
  createVariable(e) {
    if (!this.createVariableInsideMain) return "";
    const s = this.getVarName(this.name);
    return "   var " + s + ":array<" + this.getStructName(this.name) + "," + this.length + "> = " + this.getVarName(e) + "." + s + `;
`;
  }
  update(e) {
    for (let s = 0; s < this.groups.length; s++)
      this.groups[s].update(e);
  }
  forceUpdate() {
    for (let e = 0; e < this.groups.length; e++)
      this.groups[e].forceUpdate();
  }
  getElementById(e) {
    return this.groups[e];
  }
  get length() {
    return this.groups.length;
  }
  get arrayStride() {
    return this.groups[0].arrayStride * this.groups.length;
  }
  get isArray() {
    return !0;
  }
  get isUniformGroup() {
    return !0;
  }
  get definition() {
    const e = [];
    for (let s = 0; s < this.groups.length; s++)
      e[s] = this.groups[s].definition;
    return { type: "UniformGroupArray", groups: e, name: this.name };
  }
};
u(se, "ON_CHANGE", "ON_CHANGE"), u(se, "ON_CHANGED", "ON_CHANGED");
let U = se;
const A = class A extends Z {
  constructor(e, s, i = !1) {
    super();
    u(this, "unstackedItems", {});
    u(this, "items");
    u(this, "itemNames", []);
    u(this, "arrayStride", 0);
    u(this, "startId", 0);
    u(this, "globalStartId", 0);
    u(this, "createVariableInsideMain", !1);
    u(this, "mustBeTransfered", !0);
    u(this, "mustDispatchChangeEvent", !1);
    /*
    protected _mustBeTransfered: boolean = true;
    public get mustBeTransfered():boolean{return this._mustBeTransfered};
    public set mustBeTransfered(b:boolean){
        if(b != this._mustBeTransfered){
            console.warn(b)
            if(b) this.dispatchEvent(UniformGroup.ON_CHANGE);
            else this.dispatchEvent(UniformGroup.ON_CHANGED);
            this._mustBeTransfered = b;
        }
    }*/
    u(this, "_name");
    u(this, "wgsl");
    u(this, "wgslStructNames", []);
    /*an uniformGroup can be used multiple times, not necessarily in an array so we must 
    so we must store the name we use when we build the 'struct' in order to write a 'struct' 
    for every properties while being sure we don't have two sames structs*/
    u(this, "datas");
    u(this, "dataView");
    u(this, "debug", !1);
    u(this, "buffer", null);
    u(this, "usedAsUniformBuffer");
    u(this, "transfertWholeBuffer", !1);
    u(this, "existingStrucName");
    this.usedAsUniformBuffer = i, this.createVariableInsideMain = !!s;
    let n;
    for (let r in e) {
      if (n = e[r], !(n instanceof O || n instanceof P || n instanceof D || n instanceof A || n instanceof U)) throw new Error("UniformGroup accept only PrimitiveFloatUniform, PrimitiveIntUniform, PrimitiveUintUniform, UniformGroup and UniformGroupArray");
      this.add(r, n, this.createVariableInsideMain, !1);
    }
    this.items = this.stackItems(e);
  }
  set(e) {
    this.datas = e, this.dataView = new DataView(e, 0, e.byteLength), this.updateItemFromDataView(this.dataView, 0), console.log("SET DATA ", new Float32Array(e)), this.mustBeTransfered = !0;
  }
  get uniformBuffer() {
    return this.buffer;
  }
  set uniformBuffer(e) {
    this.buffer = e, e && (e.mustBeTransfered = !0);
    for (let s = 0; s < this.items.length; s++)
      this.items[s].uniformBuffer = e;
  }
  destroy() {
    console.warn("uniformGroup.destroy"), this.unstackedItems = {}, this.items = [], this.itemNames = [], this.arrayStride = 0, this.startId = 0, this.mustBeTransfered = !0, this.datas = null, this.buffer = null, this.wgsl = null, this._name = null, this.uniformBuffer = null;
  }
  get name() {
    return this._name;
  }
  set name(e) {
    this._name = this.getStructName(e);
  }
  clone(e) {
    const s = { ...this.unstackedItems };
    if (e)
      for (let n = 0; n < e.length; n++)
        s[e[n]] = s[e[n]].clone();
    else
      for (let n in s)
        s[n] = s[n].clone();
    const i = new A(s);
    return i.name = this.name, i;
  }
  remove(e) {
    for (let s = 0; s < this.items.length; s++)
      if (this.items[s].name === e) {
        const i = this.items.splice(s, 1)[0];
        return this.itemNames.splice(this.itemNames.indexOf(e), 1), i;
      }
    return null;
  }
  add(e, s, i = !1, n = !0) {
    s.uniformBuffer = this.uniformBuffer, s.name = e, s.mustBeTransfered = !0, (this.uniformBuffer && this.uniformBuffer.descriptor.useLocalVariable || i) && (s.createVariableInsideMain = !0), (this.usedAsUniformBuffer == !1 || s instanceof A || s instanceof U || s instanceof Fe) && s.addEventListener("ON_CHANGE", () => {
      this.mustBeTransfered = !0, this.dispatchEvent("ON_CHANGE");
    });
    const r = !!this.unstackedItems[e];
    if (this.unstackedItems[e] = s, r) {
      for (let a = 0; a < this.items.length; a++)
        if (this.items[a].name === e) {
          this.items[a] = s;
          break;
        }
    } else
      this.itemNames.push(e);
    return n && (this.items = this.stackItems(this.unstackedItems)), this.wgsl && (this.wgsl = this.getStruct(this.name)), this.uniformBuffer && (this.uniformBuffer.mustBeTransfered = !0), s;
  }
  getElementByName(e) {
    for (let s = 0; s < this.items.length; s++)
      if (this.items[s].name === e)
        return this.items[s];
    return null;
  }
  getStructName(e) {
    return e ? e[0].toUpperCase() + e.slice(1) : null;
  }
  getVarName(e) {
    return e ? e[0].toLowerCase() + e.slice(1) : null;
  }
  createVariable(e) {
    if (!this.createVariableInsideMain) return "";
    const s = this.getVarName(this.name);
    return "   var " + s + ":" + this.getStructName(this.name) + " = " + this.getVarName(e) + "." + s + `;
`;
  }
  updateStack() {
    this.items = this.stackItems(this.items);
  }
  forceUpdate() {
    for (let e = 0; e < this.items.length; e++)
      (this.items[e] instanceof A || this.items[e] instanceof U) && this.items[e].forceUpdate(), this.items[e].mustBeTransfered = !0;
  }
  get type() {
    return {
      nbComponent: this.arrayStride,
      isUniformGroup: !0,
      isArray: !1
    };
  }
  setDatas(e, s = null, i = 0) {
    s || (s = this.dataView);
    const n = e.startId + i, r = e.type;
    switch (r.primitive) {
      case "f32":
        for (let o = 0; o < r.nbValues; o++) s.setFloat32((n + o) * 4, e[o], !0);
        break;
      case "i32":
        for (let o = 0; o < r.nbValues; o++) s.setInt32((n + o) * 4, e[o], !0);
        break;
      case "u32":
        for (let o = 0; o < r.nbValues; o++) s.setUint32((n + o) * 4, e[o], !0);
        break;
    }
    this.usedAsUniformBuffer == !1 && e.type.isArray == !1 && (e.mustBeTransfered = !1);
  }
  updateItemFromDataView(e, s) {
    let i;
    for (let n = 0; n < this.items.length; n++)
      if (i = this.items[n], i instanceof A || i instanceof U)
        i.updateItemFromDataView(e, s + i.startId);
      else {
        const r = i.startId + s, a = i.type, o = a.primitive, f = a.nbValues;
        if (o == "f32")
          for (let l = 0; l < f; l++) i[l] = e.getFloat32((r + l) * 4, !0);
        else if (o == "i32")
          for (let l = 0; l < f; l++) i[l] = e.getInt32((r + l) * 4, !0);
        else if (o == "u32")
          for (let l = 0; l < f; l++) i[l] = e.getUint32((r + l) * 4, !0);
        i.mustBeTransfered = !0;
      }
  }
  copyIntoDataView(e, s) {
    let i, n = !1;
    for (let r = 0; r < this.items.length; r++)
      i = this.items[r], i.mustBeTransfered && (n = !0, i instanceof A || i instanceof U ? i.copyIntoDataView(e, s + i.startId) : this.setDatas(i, e, s), this.usedAsUniformBuffer == !1 && (i.mustBeTransfered = !1));
    this.mustBeTransfered = n, n && this.dispatchEvent(A.ON_CHANGE);
  }
  async update(e) {
    let s = !1, i;
    for (let n = 0; n < this.items.length; n++)
      i = this.items[n], i.type.isUniformGroup ? i.update(e) : i.update(), i.mustBeTransfered && (s = !0, i instanceof A || i instanceof U ? i.copyIntoDataView(this.dataView, i.startId) : (this.setDatas(i), i.mustBeTransfered = !1, (this.transfertWholeBuffer == !1 || i.type.isArray) && this.transfertWholeBuffer == !1 && m.device.queue.writeBuffer(
        e,
        i.globalStartId * Float32Array.BYTES_PER_ELEMENT,
        //item.startId * Float32Array.BYTES_PER_ELEMENT,
        i.buffer,
        i.byteOffset,
        i.byteLength
      )));
    /*this.usedAsUniformBuffer &&*/
    this.transfertWholeBuffer && (console.log("AAAAAAAAAAAAA ", this.debug, new Float32Array(this.datas)), s && m.device.queue.writeBuffer(
      e,
      0,
      this.datas,
      0,
      this.arrayStride * 4
    ));
  }
  getStruct(e) {
    this.name = e;
    let s = "struct " + this.name + ` {
`, i, n = "", r = "", a = "", o;
    for (let f = 0; f < this.items.length; f++)
      if (i = this.items[f], i instanceof A || i instanceof U)
        i instanceof A ? (i.wgsl || (o = i.getStruct(i.name), n += o.localVariables + `
`, i.wgslStructNames.push(i.name)), r.indexOf(i.wgsl.struct) === -1 && (r = i.wgsl.struct + r), s += "    " + this.getVarName(i.name) + ":" + i.name + `,
`, n += i.createVariable(this.name)) : (e = i.name, i.groups[0].wgsl || (o = i.groups[0].getStruct(i.name), n += o.localVariables), r.indexOf(i.groups[0].wgsl.struct) === -1 && (r = i.groups[0].wgsl.struct + r), s += "@size(" + i.length * i.groups[0].arrayStride * 4 + ")    " + e + ":array<" + this.getStructName(e) + "," + i.length + `>,
`, n += i.createVariable(this.name));
      else {
        let l = i;
        if (l.propertyNames) {
          let h = l.createStruct();
          a.indexOf(h) === -1 && r.indexOf(h) === -1 && s.indexOf(h) === -1 && (a += h + `
`), s += "     @size(16) " + l.name + ":" + l.className + `,
`;
        } else if (l.type.isArray)
          if (l.type.isArrayOfMatrixs) {
            let h = l.type.matrixColumns, c = 4;
            l.type.matrixRows === 2 && (c = 2), s += "    @size(" + l.type.arrayLength * h * c * 4 + ") " + l.name + ":" + l.type.dataType + `,
`;
          } else
            s += "    @size(" + l.type.arrayLength * 16 + ") " + l.name + ":" + l.type.dataType + `,
`;
        else
          s += "    " + l.name + ":" + l.type.dataType + `,
`;
        l.createVariableInsideMain && (n += l.createVariable(this.getVarName(this.name)));
      }
    return s += `}

`, s = a + r + s, this.wgsl = {
      struct: s,
      localVariables: n
    }, this.wgsl;
  }
  stackItems(e) {
    const s = [];
    let i = 1;
    var n = [], r = [], a = [];
    let o, f, l, h = 0;
    for (let d in e)
      if (o = e[d], o.name = d, f = o.type, o instanceof U)
        o.startId = h, h += o.arrayStride, s.push(o);
      else if (f.isArray)
        o.startId = h, f.isArrayOfMatrixs ? h += f.matrixRows * 4 * f.arrayLength : h += 4 * f.arrayLength, i = 4, s.push(o);
      else if (f.isMatrix) {
        o.startId = h;
        let p = f.matrixColumns, y = 4;
        f.matrixRows === 2 && (y = 2), h += p * y, i = y, s.push(o);
      } else f.isUniformGroup ? f.nbComponent >= 4 && (i = 4, o.startId = h, h += Math.ceil(f.nbComponent / 4) * 4, s.push(o)) : o.propertyNames ? (i = 4, o.startId = h, h += 4, s.push(o)) : (l = f.nbValues, l === 1 ? n.push(o) : l === 2 ? (i < 2 && (i = 2), r.push(o)) : l === 3 ? (i = 4, a.push(o)) : l >= 4 && (i = 4, o.startId = h, h += l, s.push(o)));
    const c = () => {
      if (o = a.shift(), o.startId = h, h += 3, s.push(o), n.length) {
        const d = n.shift();
        d.startId = h, s.push(d);
      }
      h++;
    };
    let g = a.length;
    for (let d = 0; d < g; d++) c();
    g = r.length;
    for (let d = 0; d < g; d++)
      o = r.shift(), o.startId = h, h += 2, s.push(o);
    g = n.length;
    for (let d = 0; d < g; d++)
      o = n.shift(), o.startId = h, h++, s.push(o);
    if (h % i !== 0 && (h += i - h % i), h % 4 != 0) {
      const d = 4 - h % 4;
      if (!this.usedAsUniformBuffer)
        for (let p = 0; p < d; p++) {
          const y = new Ve(0);
          y.startId = h, y.name = "padding_" + p, s.push(y), this.itemNames.push(y.name);
        }
      h += d;
    }
    return this.arrayStride = h, this.datas = new ArrayBuffer(h * 4), this.dataView = new DataView(this.datas, 0, this.datas.byteLength), this.items = s, this.copyIntoDataView(this.dataView, 0), s;
  }
  updateStartIdFromParentToChildren() {
    let e;
    for (let s = 0; s < this.items.length; s++)
      e = this.items[s], e.globalStartId = this.globalStartId + e.startId, (e instanceof A || e instanceof U || e.type.isArray) && e.updateStartIdFromParentToChildren();
  }
  get definition() {
    const e = {};
    for (let s = 0; s < this.items.length; s++)
      e[this.itemNames[s]] = this.items[s].definition;
    return { type: "UniformGroup", values: this.datas, items: e, name: this.name };
  }
  /*
      protected createTypedArrayBuffer(result: any) {
  
          let datas: Float32Array | Int32Array | Uint32Array;
          if (this.primitiveType === "f32") datas = new Float32Array(this.arrayStride);
          else if (this.primitiveType === "i32") datas = new Int32Array(this.arrayStride);
          else if (this.primitiveType === "u32") datas = new Uint32Array(this.arrayStride);
  
          //console.log("uniform type = ", this._primitiveType)
  
          let o: any;
          for (let i = 0; i < result.length; i++) {
              o = result[i];
              if (o instanceof UniformGroup || o instanceof UniformGroupArray) {
                  if (o instanceof UniformGroup) {
                      datas.set(o.datas as Float32Array | Int32Array | Uint32Array, o.startId);
                  } else {
                      let start = o.startId;
                      for (let j = 0; j < o.length; j++) {
                          datas.set(o.groups[j].datas as Float32Array | Int32Array | Uint32Array, start);
                          start += o.groups[j].arrayStride;
                      }
                  }
              } else {
                  datas.set(o, o.startId)
              }
          }
  
          this.datas = datas;
  
      }
      */
};
u(A, "ON_CHANGE", "ON_CHANGE"), u(A, "ON_CHANGED", "ON_CHANGED");
let re = A;
const M = class M {
  static build(t, e, s) {
    let i = {}, n = /* @__PURE__ */ new Set(), r = [{ id: e, names: s }];
    for (; r.length > 0; ) {
      let a = r.pop(), o = a.id, f = a.names;
      if (!n.has(o)) {
        for (let l in t) {
          let h = t[l], c = o | h, g = [...new Set(f.concat(l))];
          c in i ? i[c] = [...new Set(i[c].concat(g))] : (i[c] = g, r.push({ id: c, names: g }));
        }
        n.add(o);
      }
    }
    return i;
  }
  static resolve(t, e) {
    return e in t ? t[e].join("|") : "undefined";
  }
  static async getResult(t) {
    return new Promise((e) => {
      const s = this.build(t, 0, []);
      setTimeout(() => {
        e(s);
      }, 1);
    });
  }
  static async init() {
    return this._instance || new M(), new Promise(async (t) => {
      this.ready || (this.bufferUsage = await this.getResult(GPUBufferUsage), this.shaderStage = await this.getResult(GPUShaderStage), this.textureUsage = await this.getResult(GPUTextureUsage), this.ready = !0), t();
    });
  }
  constructor() {
    if (M._instance)
      throw new Error("WebGPUProperties is not instanciable");
    M._instance = this;
  }
  static getTextureUsageById(t) {
    return this.resolve(this.textureUsage, t);
  }
  static getBufferUsageById(t) {
    return this.resolve(this.bufferUsage, t);
  }
  static getShaderStageById(t) {
    return this.resolve(this.shaderStage, t);
  }
};
u(M, "ready", !1), u(M, "textureUsage"), u(M, "bufferUsage"), u(M, "shaderStage"), u(M, "_instance");
let te = M;
const N = class N {
  static get ready() {
    return this._ready;
  }
  static debugUsage(t) {
    return te.getBufferUsageById(t);
  }
  static debugTextureUsage(t) {
    return te.getTextureUsageById(t);
  }
  static debugShaderStage(t) {
    return te.getShaderStageById(t);
  }
  constructor() {
    throw new Error("GPU is static and can't be instanciated");
  }
  static loseDevice() {
    this.losingDevice = !0, this.gpuDevice.destroy();
  }
  static clear() {
    this.gpuDevice.destroy();
  }
  static get loseDeviceRecently() {
    return (/* @__PURE__ */ new Date()).getTime() - this.deviceLostTime <= 3e3;
  }
  static getTransferableUniforms(t) {
    let e, s;
    const i = [], n = {};
    for (let r in t)
      if (s = t[r], s.name = r, e = s.definition, n[r] = e, console.log("type ======> ", s.type), e.type == "UniformGroup")
        i.includes(e.values) == !1 && i.push(e.values);
      else if (e.type == "UniformGroupArray") {
        let a = e.groups;
        for (let o = 0; o < a.length; o++)
          i.includes(a[o].values) == !1 && i.push(a[o].values);
      } else e.values.buffer && i.includes(e.values.buffer) == !1 && i.push(e.values.buffer);
    return {
      items: n,
      transferables: i
    };
  }
  /*
      export type TransferableUniforms = {
      items:{name:string,type:string,values:any,groups?:any,items?:any};
      transferables:ArrayBuffer[]
  } 
      */
  static parseTransferableUniform(t) {
    const e = (r) => {
      if (r.type == "Float") return new Ve(r.values[0]);
      if (r.type == "Vec2") return new He(r.values[0], r.values[1]);
      if (r.type == "Vec3") return new Ye(r.values[0], r.values[1], r.values[2]);
      if (r.type == "Vec4") return new Ce(r.values[0], r.values[1], r.values[2], r.values[3]);
      if (r.type == "Int") return new We(r.values[0]);
      if (r.type == "IVec2") return new $e(r.values[0], r.values[1]);
      if (r.type == "IVec3") return new qe(r.values[0], r.values[1], r.values[2]);
      if (r.type == "IVec4") return new Me(r.values[0], r.values[1], r.values[2], r.values[3]);
      if (r.type == "Uint") return new Xe(r.values[0]);
      if (r.type == "UVec2") return new Qe(r.values[0], r.values[1]);
      if (r.type == "UVec3") return new Ze(r.values[0], r.values[1], r.values[2]);
      if (r.type == "UVec4") return new Le(r.values[0], r.values[1], r.values[2], r.values[3]);
      if (r.type == "Matrix4x4")
        return new ye(r.values);
      if (r.type == "Matrix3x3")
        return new et(r.values);
      if (r.type == "Vec4Array") {
        const a = new Fe(r.values.length / 4);
        return a.set(r.values), a;
      }
      if (r.type == "IVec4Array") {
        const a = new Je(r.values.length / 4);
        return a.set(r.values), a;
      }
      if (r.type == "UVec4Array") {
        const a = new Ke(r.values.length / 4);
        return a.set(r.values), a;
      }
      if (r.type == "Matrix4x4Array") {
        const a = new tt(r.values.length / 16);
        return a.set(r.values), a;
      }
      throw new Error("incorrect type");
    }, s = (r) => {
      let a = {}, o;
      for (let f in r.items)
        o = r.items[f], o.type == "UniformGroup" ? a[f] = i(o) : o.type == "UniformGroupArray" ? a[f] = n(o) : a[f] = e(o);
      return a;
    }, i = (r) => {
      let a = {}, o;
      for (let f in r.items)
        o = r.items[f], o.type == "UniformGroup" ? a[f] = i(o) : o.type == "UniformGroupArray" ? a[f] = n(o) : a[f] = e(o);
      return new re(a);
    }, n = (r) => {
      let a = [];
      for (let o = 0; o < r.groups.length; o++)
        a[o] = i(r.groups[o]);
      return new U(a);
    };
    return s(t);
  }
  static init(t) {
    return this.requestAdapterOptions = t, b.__initDebug(), new Promise(async (e, s) => {
      if (this.gpuDevice) {
        e(this);
        return;
      }
      const i = await navigator.gpu.requestAdapter(t);
      i ? (this.gpuDevice = await i.requestDevice(), this.deviceId++, this.deviceLost = !1, this.gpuDevice.lost.then((n) => {
        console.clear(), console.error(`WebGPU device was lost: ${n.message}`), this.gpuDevice = null, this._ready = !1, this.deviceLost = !0, this.deviceLostTime = (/* @__PURE__ */ new Date()).getTime(), (this.losingDevice || n.reason != "destroyed") && (this.losingDevice = !1, N.init(this.requestAdapterOptions));
      }), await te.init(), this.debugUsage(172), this._ready = !0, e(this)) : s();
    });
  }
  static get device() {
    if (this.deviceLost) return null;
    if (!this.gpuDevice && !this.ready) throw new Error("you must use XGPU.init() to get the reference of the gpuDevice");
    return this.gpuDevice;
  }
  static getPreferredCanvasFormat() {
    return this._preferedCanvasFormat || (this._preferedCanvasFormat = navigator.gpu.getPreferredCanvasFormat()), this._preferedCanvasFormat;
  }
  static setPreferredCanvasFormat(t) {
    this._preferedCanvasFormat = t;
  }
  static destroy() {
    this.gpuDevice && (this.gpuDevice.destroy(), this.gpuDevice = null, this._ready = !1);
  }
  static createBindgroup(t) {
    return this.device.createBindGroup(t);
  }
  static createBindgroupLayout(t) {
    return this.device.createBindGroupLayout(t);
  }
  static createPipelineLayout(t) {
    return this.device.createPipelineLayout(t);
  }
  static createRenderPipeline(t) {
    return this.device.createRenderPipeline(t);
  }
  static createComputePipeline(t) {
    return this.device.createComputePipeline(t);
  }
  static createStagingBuffer(t) {
    return this.device.createBuffer({
      size: t,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
      mappedAtCreation: !1
    });
  }
};
u(N, "showVertexShader", !1), u(N, "showFragmentShader", !1), u(N, "showComputeShader", !1), u(N, "showVertexDebuggerShader", !1), u(N, "_ready", !1), u(N, "gpuDevice"), u(N, "requestAdapterOptions"), u(N, "losingDevice", !1), u(N, "deviceLost", !1), u(N, "deviceLostTime"), u(N, "deviceId", -1), u(N, "_preferedCanvasFormat");
let m = N;
class R extends Z {
  constructor(e) {
    super();
    u(this, "resourceIO");
    u(this, "io", 0);
    u(this, "mustBeTransfered", !1);
    u(this, "descriptor");
    u(this, "gpuResource");
    u(this, "_view");
    u(this, "viewDescriptor");
    u(this, "useOutsideTexture", !1);
    u(this, "renderPassTexture");
    u(this, "gpuTextureIOs");
    u(this, "gpuTextureIO_index", 1);
    u(this, "deviceId");
    u(this, "time");
    u(this, "_textureType");
    e = { ...e }, this.descriptor = e, e.sampledType === void 0 && (e.sampledType = "f32"), e.usage === void 0 && (e.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT), e.format === void 0 && (e.format = "rgba8unorm"), e.label === void 0 && (e.label = "ImageTexture"), e.size === void 0 && (e.source ? (e.size = [e.source.width, e.source.height], e.source instanceof GPUTexture ? this.initFromTexture(e.source) : e.source instanceof R && e.source.isRenderPass && (this.renderPassTexture = e.source, this.renderPassTexture.addEventListener("RESOURCE_CHANGED", () => {
      this.initFromTexture(this.renderPassTexture.texture);
    }), this.initFromTexture(e.source.texture))) : e.size = [1, 1]), e.source && (this.mustBeTransfered = !0);
  }
  initFromTexture(e) {
    this.gpuResource = e, this.descriptor.format = e.format, this.descriptor.usage = e.usage, this._view = this.gpuResource.createView(), this.descriptor.source = void 0, this.useOutsideTexture = !0;
  }
  clone() {
    return new R(this.descriptor);
  }
  get sampledType() {
    return this.descriptor.sampledType;
  }
  set sampledType(e) {
    this.descriptor.sampledType = e;
  }
  get isRenderPass() {
    return !1;
  }
  initTextureIO(e) {
    this.gpuTextureIOs = e;
  }
  get texture() {
    return this.gpuResource;
  }
  getCurrentTexture() {
    return this.gpuResource;
  }
  createView(e) {
    if (this.useOutsideTexture) return null;
    let s = this.viewDescriptor;
    return e && (s = e), this.gpuResource.createView(s);
  }
  resize(e, s) {
    return this.useOutsideTexture ? null : (this.descriptor.size = [e, s], this.createGpuResource(), this);
  }
  get view() {
    return this._view || this.createGpuResource(), this._view;
  }
  get source() {
    return this.descriptor.source;
  }
  set source(e) {
    this.useOutsideTexture = e instanceof GPUTexture || e instanceof R && e.isRenderPass, this.useOutsideTexture ? e instanceof GPUTexture ? (this.gpuResource = e, this._view = this.gpuResource.createView()) : (this.renderPassTexture = e, this.renderPassTexture.clearEvents("RESOURCE_CHANGED"), this.renderPassTexture.addEventListener("RESOURCE_CHANGED", () => {
      this.initFromTexture(this.renderPassTexture.texture);
    }), this.gpuResource = e.texture, this._view = this.gpuResource.createView()) : this.mustBeTransfered = !0, this.descriptor.source = e;
  }
  update(e) {
    this.renderPassTexture && !this.renderPassTexture.mustUseCopyTextureToTexture && this.renderPassTexture.applyRenderPass(e), !this.useOutsideTexture && (this.gpuResource || this.createGpuResource(), this.descriptor.source && (this.descriptor.source.width !== this.gpuResource.width || this.descriptor.source.height !== this.gpuResource.height) && (this.descriptor.size = [this.descriptor.source.width, this.descriptor.source.height], this.createGpuResource(), this.mustBeTransfered = !0), this.mustBeTransfered && (this.mustBeTransfered = !1, m.device.queue.copyExternalImageToTexture(
      { source: this.descriptor.source, flipY: !0 },
      { texture: this.gpuResource },
      this.descriptor.size
    )));
  }
  createGpuResource() {
    if (this.useOutsideTexture && this.gpuResource && this.deviceId != m.deviceId) {
      const e = this.gpuResource.xgpuObject;
      e && (e.createGpuResource(), this.gpuResource = e.gpuResource, this._view = e.view);
    }
    this.deviceId = m.deviceId, !(this.useOutsideTexture || this.gpuTextureIOs) && (this.gpuResource && (this.gpuResource.xgpuObject = null, this.gpuResource.destroy()), this.gpuResource = m.device.createTexture(this.descriptor), this.gpuResource.xgpuObject = this, this._view = this.gpuResource.createView(), this.descriptor.source && (this.mustBeTransfered = !0));
  }
  destroyGpuResource() {
    if (!(this.time && (/* @__PURE__ */ new Date()).getTime() - this.time < 100 && m.loseDeviceRecently)) {
      if (this.time = (/* @__PURE__ */ new Date()).getTime(), this.io && m.loseDeviceRecently) {
        if (this.io === 1) {
          const s = this.resourceIO.textures;
          let i = s[0].gpuTextureIOs;
          s[0].gpuTextureIOs = null, s[0].createGpuResource(), s[0].gpuTextureIOs = i, i = s[1].gpuTextureIOs, s[1].gpuTextureIOs = null, s[1].createGpuResource(), s[1].gpuTextureIOs = i, s[0].gpuTextureIOs[0] = s[0].gpuResource, s[0].gpuTextureIOs[1] = s[1].gpuResource;
        }
        return;
      }
      this.resourceIO && this.resourceIO.destroy(), !(this.useOutsideTexture || this.gpuTextureIOs) && (this.gpuResource && (this.gpuResource.xgpuObject = null, this.gpuResource.destroy()), this._view = null, this.gpuResource = null, this.resourceIO = null);
    }
  }
  createDeclaration(e, s, i = 0) {
    return this.io != 2 ? "@binding(" + s + ") @group(" + i + ") var " + e + ":texture_2d<" + this.sampledType + `>;
` : " @binding(" + s + ") @group(" + i + ") var " + e + ` : texture_storage_2d<rgba8unorm, write>;
`;
  }
  get textureType() {
    return this._textureType;
  }
  set textureType(e) {
    this._textureType = e;
  }
  createBindGroupLayoutEntry(e) {
    let s = "float";
    return this.sampledType === "i32" ? s = "sint" : this.sampledType === "u32" && (s = "uint"), this.io != 2 ? {
      binding: e,
      visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
      ...this.textureType,
      texture: {
        sampleType: s,
        viewDimension: "2d",
        multisampled: !1
      }
    } : {
      binding: e,
      visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
      storageTexture: {
        access: "write-only",
        format: "rgba8unorm"
      }
    };
  }
  createBindGroupEntry(e) {
    return (!this.gpuResource || this.deviceId != m.deviceId) && this.createGpuResource(), {
      binding: e,
      resource: this._view
    };
  }
  setPipelineType(e) {
    e === "render" ? this.descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT : e === "compute_mixed" ? this.io === 1 ? this.descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST : this.io === 2 && (this.descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.STORAGE_BINDING) : e === "compute" && this.io !== 0 && (this.descriptor.usage = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING);
  }
}
class J extends R {
  constructor(e) {
    e = { ...e }, e.source && !e.size && (e.size = [e.source[0].width, e.source[0].height, e.source.length]), e.dimension || (e.dimension = "2d"), e.usage === void 0 && (e.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT);
    super(e);
    u(this, "_bitmaps", []);
    u(this, "mustUpdate", []);
    e.source && (this.bitmaps = e.source);
  }
  clone() {
    return this.descriptor.source || (this.descriptor.source = this._bitmaps), new J(this.descriptor);
  }
  set bitmaps(e) {
    for (let s = 0; s < e.length; s++)
      this._bitmaps[s] = e[s], this.mustUpdate[s] = !0;
    this.mustBeTransfered = !0, this.update();
  }
  get bitmaps() {
    return this._bitmaps;
  }
  setImageById(e, s) {
    this._bitmaps[s] = e, this.mustUpdate[s] = !0, this.mustBeTransfered = !0;
  }
  createGpuResource() {
    this.gpuResource && this.gpuResource.destroy(), this.gpuResource = m.device.createTexture(this.descriptor), this._view = this.gpuResource.createView({ dimension: "2d-array", arrayLayerCount: this._bitmaps.length });
    for (let e = 0; e < this.mustUpdate.length; e++) this.mustUpdate[e] = !0;
    this.mustBeTransfered = !0;
  }
  updateInnerGpuTextures(e) {
    let s;
    for (let i = 0; i < this._bitmaps.length; i++)
      s = this.bitmaps[i], s instanceof GPUTexture && e.copyTextureToTexture({ texture: s }, { texture: this.gpuResource }, [this.gpuResource.width, this.gpuResource.height, i]);
  }
  update() {
    if (this.mustBeTransfered) {
      this.gpuResource || this.createGpuResource();
      let e;
      for (let s = 0; s < this._bitmaps.length; s++)
        e = this.bitmaps[s], !(e instanceof GPUTexture) && this.mustUpdate[s] && (m.device.queue.copyExternalImageToTexture(
          { source: e },
          { texture: this.gpuResource, origin: [0, 0, s] },
          [e.width, e.height]
        ), this.mustUpdate[s] = !1);
      this.mustBeTransfered = !1;
    }
  }
  //-----
  createDeclaration(e, s, i = 0) {
    return "@binding(" + s + ") @group(" + i + ") var " + e + ":texture_2d_array<" + this.sampledType + `>;
`;
  }
  createBindGroupLayoutEntry(e) {
    let s = "float";
    return this.sampledType === "i32" ? s = "sint" : this.sampledType === "u32" && (s = "uint"), {
      binding: e,
      visibility: GPUShaderStage.FRAGMENT,
      texture: {
        sampleType: s,
        viewDimension: "2d-array",
        multisampled: !1
      }
    };
  }
  createBindGroupEntry(e) {
    return this.gpuResource || this.createGpuResource(), {
      binding: e,
      resource: this._view
    };
  }
}
class ve extends J {
  constructor(t) {
    t = { ...t }, t.dimension || (t.dimension = "2d"), t.usage === void 0 && (t.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT), super(t), t.source && (this.sides = t.source);
  }
  clone() {
    return this.descriptor.source || (this.descriptor.source = this._bitmaps), new ve(this.descriptor);
  }
  set right(t) {
    this._bitmaps[0] = t, this.mustBeTransfered = !0;
  }
  set left(t) {
    this.descriptor.source || (this.descriptor.source = {}), this._bitmaps[1] = t, this.mustBeTransfered = !0;
  }
  set bottom(t) {
    this.descriptor.source || (this.descriptor.source = {}), this._bitmaps[2] = t, this.mustBeTransfered = !0;
  }
  set top(t) {
    this.descriptor.source || (this.descriptor.source = {}), this._bitmaps[3] = t, this.mustBeTransfered = !0;
  }
  set back(t) {
    this.descriptor.source || (this.descriptor.source = {}), this._bitmaps[4] = t, this.mustBeTransfered = !0;
  }
  set front(t) {
    this.descriptor.source || (this.descriptor.source = {}), this._bitmaps[5] = t, this.mustBeTransfered = !0;
  }
  set sides(t) {
    for (let e = 0; e < 6; e++) this._bitmaps[e] = t[e];
    this.mustBeTransfered = !0, this.update();
  }
  get sides() {
    return this._bitmaps;
  }
  createGpuResource() {
    this.gpuResource && this.gpuResource.destroy(), this.gpuResource = m.device.createTexture(this.descriptor), this._view = this.gpuResource.createView({ dimension: "cube" });
    for (let t = 0; t < this.mustUpdate.length; t++) this.mustUpdate[t] = !0;
    this.mustBeTransfered = !0;
  }
  //-----
  createDeclaration(t, e, s = 0) {
    return "@binding(" + e + ") @group(" + s + ") var " + t + ":texture_cube<" + this.sampledType + `>;
`;
  }
  createBindGroupLayoutEntry(t) {
    let e = "float";
    return this.sampledType === "i32" ? e = "sint" : this.sampledType === "u32" && (e = "uint"), {
      binding: t,
      visibility: GPUShaderStage.FRAGMENT,
      texture: {
        sampleType: e,
        viewDimension: "cube",
        multisampled: !1
      }
    };
  }
  createBindGroupEntry(t) {
    return this.gpuResource || this.createGpuResource(), {
      binding: t,
      resource: this._view
    };
  }
  setPipelineType(t) {
  }
}
class ne {
  constructor(t) {
    u(this, "textures", []);
    u(this, "descriptor");
    u(this, "stagingBuffer");
    u(this, "canCallMapAsync", !0);
    u(this, "onOutputData");
    u(this, "outputBuffer");
    let e, s;
    if (t.source != null)
      e = t.source.width, s = t.source.height;
    else {
      if (!t.width || !t.height)
        throw new Error("ImageTextureIO width and/or height missing in descriptor");
      e = t.width, s = t.height;
    }
    this.descriptor = {
      size: [e, s],
      format: "rgba8unorm",
      usage: t.source instanceof GPUTexture ? t.source.usage : void 0
    }, t.format && (this.descriptor.format = t.format), this.textures[0] = new R(this.descriptor), this.textures[1] = new R(this.descriptor), this.textures[0].io = 1, this.textures[1].io = 2, this.textures[0].resourceIO = this, this.textures[1].resourceIO = this, t.source != null && (this.textures[0].source = t.source);
  }
  clone() {
    const t = {
      source: this.textures[0].gpuResource,
      width: this.descriptor.size[0],
      height: this.descriptor.size[1],
      format: this.descriptor.format
    };
    return new ne(t);
  }
  createDeclaration(t, e, s) {
    let i = "";
    const n = t.substring(0, 1).toLowerCase() + t.slice(1);
    return i += " @binding(" + e + ") @group(" + s + ") var " + n + ` : texture_2d<f32>;
`, i += " @binding(" + (e + 1) + ") @group(" + s + ") var " + n + `_out : texture_storage_2d<rgba8unorm, write>;
`, i;
  }
  destroy() {
    this.stagingBuffer && this.stagingBuffer.destroy(), this.textures = void 0, this.onOutputData = void 0;
  }
  async getOutputData() {
    if (!this.onOutputData || !this.canCallMapAsync) return;
    this.outputBuffer || (this.outputBuffer = m.device.createBuffer({
      size: this.width * this.height * 4 * 4,
      usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      mappedAtCreation: !1
    }), this.stagingBuffer = m.createStagingBuffer(this.outputBuffer.size));
    var t = this.textures[0].gpuResource;
    const e = m.device.createCommandEncoder(), s = this.stagingBuffer;
    e.copyTextureToBuffer({ texture: t }, { buffer: this.outputBuffer, bytesPerRow: Math.ceil(this.width * 4 / 256) * 256, rowsPerImage: this.height }, [this.width, this.height, 1]), e.copyBufferToBuffer(this.outputBuffer, 0, s, 0, s.size), m.device.queue.submit([e.finish()]), this.canCallMapAsync = !1, await this.stagingBuffer.mapAsync(GPUMapMode.READ, 0, s.size), this.canCallMapAsync = !0;
    const n = s.getMappedRange(0, s.size).slice(0);
    s.unmap(), this.onOutputData(new Uint32Array(n));
  }
  get width() {
    return this.textures[0].gpuResource.width;
  }
  get height() {
    return this.textures[0].gpuResource.height;
  }
  textureSize() {
    return this.descriptor.size;
  }
}
class he {
  constructor(t) {
    u(this, "mustBeTransfered", !1);
    // not applicable with sampler
    u(this, "gpuResource");
    u(this, "descriptor");
    //----------------------------
    u(this, "deviceId", 0);
    t || (t = {}), t.compare || (t = { ...t }, t.minFilter === void 0 && (t.minFilter = "linear"), t.magFilter === void 0 && (t.magFilter = "linear"), t.addressModeU === void 0 && (t.addressModeU = "clamp-to-edge"), t.addressModeV === void 0 && (t.addressModeV = "clamp-to-edge"), t.addressModeW === void 0 && (t.addressModeW = "clamp-to-edge"), t.mipmapFilter === void 0 && (t.mipmapFilter = "nearest"), t.lodMinClamp === void 0 && (t.lodMinClamp = 0), t.lodMaxClamp === void 0 && (t.lodMaxClamp = 32), t.maxAnisotropy === void 0 && (t.maxAnisotropy = 1)), t && (this.descriptor = t);
  }
  clone() {
    return new he(this.descriptor);
  }
  get isComparison() {
    return !!this.descriptor.compare;
  }
  get isFiltering() {
    return this.descriptor.minFilter === "linear" || this.descriptor.magFilter === "linear" || this.descriptor.mipmapFilter === "linear";
  }
  setAddressModes(t = "clamp-to-edge", e = "clamp-to-edge", s = "clamp-to-edge") {
    this.descriptor.addressModeU = t, this.descriptor.addressModeV = e, this.descriptor.addressModeW = s;
  }
  setFilterModes(t = "nearest", e = "nearest", s = "nearest") {
    this.descriptor.minFilter = t, this.descriptor.magFilter = e, this.descriptor.mipmapFilter = s;
  }
  setClamp(t = 0, e = 32) {
    this.descriptor.lodMinClamp = t, this.descriptor.lodMaxClamp = e;
  }
  setCompareFunction(t) {
    this.descriptor.compare = t;
  }
  setMaxAnisotropy(t) {
    t = Math.round(t), t < 1 && (t = 1), t > 16 && (t = 16), this.descriptor.maxAnisotropy = t;
  }
  createGpuResource() {
    this.gpuResource = m.device.createSampler(this.descriptor), this.deviceId = m.deviceId;
  }
  destroyGpuResource() {
    this.gpuResource = null;
  }
  update() {
  }
  createDeclaration(t, e, s = 0) {
    return this.isComparison ? "@binding(" + e + ") @group(" + s + ") var " + t + `:sampler_comparison;
` : "@binding(" + e + ") @group(" + s + ") var " + t + `:sampler;
`;
  }
  createBindGroupLayoutEntry(t) {
    let e = "comparison";
    return this.isComparison || (e = "filtering", this.isFiltering || (e = "non-filtering")), {
      binding: t,
      visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
      sampler: {
        type: e
      }
    };
  }
  createBindGroupEntry(t) {
    return (!this.gpuResource || this.deviceId != m.deviceId) && this.createGpuResource(), {
      binding: t,
      resource: this.gpuResource
    };
  }
  setPipelineType(t) {
  }
}
const j = class j extends Z {
  constructor() {
    super();
    u(this, "onOutputData", null);
    u(this, "stagingBuffer");
    u(this, "canCallMapAsync", !0);
    u(this, "onCanCallMapAsync", null);
  }
  get mustOutputData() {
    return !!this.onOutputData || this.hasEventListener(j.ON_OUTPUT_DATA);
  }
  async getOutputData(e) {
    if (!this.onOutputData && !this.hasEventListener(j.ON_OUTPUT_DATA) || !this.canCallMapAsync)
      return;
    this.dispatchEvent(j.ON_OUTPUT_PROCESS_START), this.canCallMapAsync = !1, (!this.stagingBuffer || e.size != this.stagingBuffer.size) && (this.stagingBuffer = m.createStagingBuffer(e.size));
    const s = m.device.createCommandEncoder(), i = this.stagingBuffer;
    s.copyBufferToBuffer(e, 0, i, 0, i.size), m.device.queue.submit([s.finish()]), await this.stagingBuffer.mapAsync(GPUMapMode.READ, 0, i.size);
    const r = i.getMappedRange(0, i.size).slice(0);
    i.unmap(), this.canCallMapAsync = !0, this.onCanCallMapAsync && this.onCanCallMapAsync(), this.dispatchEvent(j.ON_OUTPUT_DATA, r), this.onOutputData && this.onOutputData(r);
  }
};
u(j, "ON_OUTPUT_DATA", "ON_OUTPUT_DATA"), u(j, "ON_OUTPUT_PROCESS_START", "ON_OUTPUT_PROCESS_START");
let oe = j;
class V extends oe {
  constructor(e, s) {
    super();
    u(this, "gpuResource");
    u(this, "descriptor");
    u(this, "group");
    u(this, "cloned", !1);
    //------------------------------
    u(this, "_accessMode");
    u(this, "_bufferType");
    u(this, "time");
    //public get bufferType(): string { return "uniform"; }
    u(this, "_usage");
    u(this, "debug");
    u(this, "shaderVisibility");
    u(this, "pipelineType");
    this.descriptor = s ? { ...s } : {}, this.group = new re(e, this.descriptor.useLocalVariable, !0), this.group.uniformBuffer = this, s.accessMode && (this._accessMode = s.accessMode);
  }
  get mustBeTransfered() {
    return this.group.mustBeTransfered;
  }
  set mustBeTransfered(e) {
    this.group.mustBeTransfered = e;
  }
  clone(e) {
    const s = { ...this.group.unstackedItems };
    if (e)
      for (let n in s)
        e.indexOf(n) !== -1 && (s[n] = s[n].clone());
    else
      for (let n in s) s[n] = s[n].clone();
    const i = new V(s, this.descriptor);
    return i.cloned = !0, i.name = this.name, i;
  }
  add(e, s, i = !1) {
    return this.group.add(e, s, i);
  }
  remove(e) {
    return this.group.remove(e);
  }
  update() {
    this.gpuResource || this.createGpuResource(), this.group.update(this.gpuResource), this.mustBeTransfered = !1;
  }
  createStruct(e) {
    return this.group.getStruct(e);
  }
  createDeclaration(e, s, i = 0) {
    const n = e.substring(0, 1).toUpperCase() + e.slice(1), r = e.substring(0, 1).toLowerCase() + e.slice(1);
    return this.bufferType === "uniform" ? "@binding(" + s + ") @group(" + i + ") var<uniform> " + r + ":" + n + `;
` : "@binding(" + s + ") @group(" + i + ") var<storage, " + this._accessMode + "> " + r + ":" + n + `;
`;
  }
  getUniformById(e) {
    return this.group.items[e];
  }
  getUniformByName(e) {
    return this.group.getElementByName(e);
  }
  get accessMode() {
    return this._accessMode;
  }
  get bufferType() {
    return this._bufferType;
  }
  createGpuResource() {
    if (!this.gpuResource) {
      this.group.updateStartIdFromParentToChildren();
      const e = this.group.arrayStride * Float32Array.BYTES_PER_ELEMENT;
      let s = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
      (this.bufferType === "read-only-storage" || this.bufferType === "storage") && (s = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC), this.gpuResource = m.device.createBuffer({
        size: e,
        usage: s
      }), this.update();
    }
  }
  getItemsAsArray() {
    const e = [];
    for (let s = 0; s < this.itemNames.length; s++) e[s] = this.items[this.itemNames[s]];
    return e;
  }
  destroyGpuResource() {
    if (this.time && (/* @__PURE__ */ new Date()).getTime() - this.time < 100 && m.loseDeviceRecently && this.gpuResource) {
      this.group.updateStack();
      return;
    }
    this.time = (/* @__PURE__ */ new Date()).getTime(), this.gpuResource && (this.group.updateStack(), this.group.forceUpdate(), this.gpuResource.destroy()), this.gpuResource = null;
  }
  createBindGroupLayoutEntry(e) {
    let s = "uniform";
    return this.bufferType && (s = this.bufferType), {
      binding: e,
      visibility: this.descriptor.visibility,
      buffer: {
        type: s
      }
    };
  }
  createBindGroupEntry(e) {
    return this.gpuResource || this.createGpuResource(), {
      binding: e,
      resource: {
        buffer: this.gpuResource
      }
    };
  }
  get items() {
    return this.group.unstackedItems;
  }
  get itemNames() {
    return this.group.itemNames;
  }
  get nbComponent() {
    return this.group.arrayStride;
  }
  get nbUniforms() {
    return this.group.items.length;
  }
  setPipelineType(e) {
    this.pipelineType = e, e === "compute" || e === "compute_mixed" ? (this._bufferType || (this._bufferType = "storage"), this._accessMode || (this._accessMode = "read_write"), this._accessMode ? this._accessMode == "read" ? this._bufferType = "read-only-storage" : this._bufferType = "storage" : (this._bufferType = "storage", this._accessMode = "read_write"), this.descriptor.visibility = GPUShaderStage.COMPUTE) : (this.group.arrayStride * Float32Array.BYTES_PER_ELEMENT < 65536 ? this._bufferType = "uniform" : this._bufferType = "storage", this._accessMode = "read", this.descriptor.visibility = this.shaderVisibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX);
  }
}
class I {
  constructor(t, e, s) {
    u(this, "_name");
    u(this, "_dataType");
    u(this, "nbValues");
    u(this, "vertexType");
    u(this, "_data");
    u(this, "dataOffset");
    u(this, "mustBeTransfered", !1);
    u(this, "_vertexBuffer");
    u(this, "waitingVertexBuffer", !1);
    if (e = this.renameVertexDataType(e), this._name = t, this._dataType = e, this.dataOffset = s, I.types[e])
      this.vertexType = I.types[e], this.nbValues = this.vertexType.nbComponent;
    else {
      const i = new ie(e);
      this.nbValues = i.nbValues, this.vertexType = this.getVertexDataType(i.dataType);
    }
  }
  static Float(t, e) {
    return t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), { type: "float32", offset: e, datas: t };
  }
  static Vec2(t, e) {
    return t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), { type: "float32x2", offset: e, datas: t };
  }
  static Vec3(t, e) {
    return t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), { type: "float32x3", offset: e, datas: t };
  }
  static Vec4(t, e) {
    return t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), { type: "float32x4", offset: e, datas: t };
  }
  static Int(t, e) {
    return t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), { type: "sint32", offset: e, datas: t };
  }
  static IVec2(t, e) {
    return t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), { type: "sint32x2", offset: e, datas: t };
  }
  static IVec3(t, e) {
    return t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), { type: "sint32x3", offset: e, datas: t };
  }
  static IVec4(t, e) {
    return t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), { type: "sint32x4", offset: e, datas: t };
  }
  static Uint(t, e) {
    return t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), { type: "uint32", offset: e, datas: t };
  }
  static UVec2(t, e) {
    return t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), { type: "uint32x2", offset: e, datas: t };
  }
  static UVec3(t, e) {
    return t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), { type: "uint32x3", offset: e, datas: t };
  }
  static UVec4(t, e) {
    return t && !e && typeof t == "number" && (e = t, t = void 0), { type: "uint32x4", offset: e, datas: t };
  }
  static get types() {
    return {
      uint8x2: { nbComponent: 2, bytes: 2, varType: "vec2<u32>" },
      uint8x4: { nbComponent: 4, bytes: 4, varType: "vec4<u32>" },
      sint8x2: { nbComponent: 2, bytes: 2, varType: "vec2<i32>" },
      sint8x4: { nbComponent: 4, bytes: 4, varType: "vec4<i32>" },
      unorm8x2: { nbComponent: 2, bytes: 2, varType: "vec2<f32>" },
      unorm8x4: { nbComponent: 4, bytes: 4, varType: "vec4<f32>" },
      snorm8x2: { nbComponent: 2, bytes: 2, varType: "vec2<f32>" },
      snorm8x4: { nbComponent: 4, bytes: 4, varType: "vec4<f32>" },
      uint16x2: { nbComponent: 2, bytes: 4, varType: "vec2<u32>" },
      uint16x4: { nbComponent: 4, bytes: 8, varType: "vec4<u32>" },
      sint16x2: { nbComponent: 2, bytes: 4, varType: "vec2<i32>" },
      sint16x4: { nbComponent: 4, bytes: 8, varType: "vec4<i32>" },
      unorm16x2: { nbComponent: 2, bytes: 4, varType: "vec2<f32>" },
      unorm16x4: { nbComponent: 4, bytes: 8, varType: "vec4<f32>" },
      snorm16x2: { nbComponent: 2, bytes: 4, varType: "vec2<f32>" },
      snorm16x4: { nbComponent: 4, bytes: 8, varType: "vec4<f32>" },
      float16x2: { nbComponent: 2, bytes: 4, varType: "vec2<f16>" },
      float16x4: { nbComponent: 4, bytes: 8, varType: "vec4<f16>" },
      float32: { nbComponent: 1, bytes: 4, varType: "f32" },
      float32x2: { nbComponent: 2, bytes: 8, varType: "vec2<f32>" },
      float32x3: { nbComponent: 3, bytes: 12, varType: "vec3<f32>" },
      float32x4: { nbComponent: 4, bytes: 16, varType: "vec4<f32>" },
      uint32: { nbComponent: 1, bytes: 4, varType: "u32" },
      uint32x2: { nbComponent: 2, bytes: 8, varType: "vec2<u32>" },
      uint32x3: { nbComponent: 3, bytes: 12, varType: "vec3<u32>" },
      uint32x4: { nbComponent: 4, bytes: 16, varType: "vec4<u32>" },
      sint32: { nbComponent: 1, bytes: 4, varType: "i32" },
      sint32x2: { nbComponent: 2, bytes: 8, varType: "vec2<i32>" },
      sint32x3: { nbComponent: 3, bytes: 12, varType: "vec3<i32>" },
      sint32x4: { nbComponent: 4, bytes: 16, varType: "vec4<i32>" }
    };
  }
  get vertexBuffer() {
    return this._vertexBuffer;
  }
  set vertexBuffer(t) {
    this._vertexBuffer = t, this.waitingVertexBuffer && (this.waitingVertexBuffer = !0, this.vertexBuffer.attributeChanged = !0);
  }
  get datas() {
    return this._data;
  }
  set datas(t) {
    this._data != t && (this._data = t, this.vertexBuffer ? this.vertexBuffer.attributeChanged = !0 : this.waitingVertexBuffer = !0, this.mustBeTransfered = !0);
  }
  get useByVertexData() {
    return typeof this._data[0] != "number";
  }
  get format() {
    return this._dataType;
  }
  get type() {
    return this._dataType;
  }
  //---------------------------------------------------
  get bytePerElement() {
    return this.vertexType.bytes;
  }
  get varType() {
    return this.vertexType.varType;
  }
  get name() {
    return this._name;
  }
  get nbComponent() {
    return this.nbValues;
  }
  renameVertexDataType(t) {
    switch (t) {
      case "float":
        return "float32";
      case "vec2":
        return "float32x2";
      case "vec3":
        return "float32x3";
      case "vec4":
        return "float32x4";
      case "int":
        return "sint32";
      case "ivec2":
        return "sint32x2";
      case "ivec3":
        return "sint32x3";
      case "ivec4":
        return "sint32x4";
      case "uint":
        return "uint32";
      case "uvec2":
        return "uint32x2";
      case "uvec3":
        return "uint32x3";
      case "uvec4":
        return "uint32x4";
    }
    return t;
  }
  getVertexDataType(t) {
    switch (t) {
      case "u32":
        return { name: "uint32", nbComponent: 1, bytes: 4, varType: "u32" };
      case "vec2<u32>":
        return { name: "uint32x2", nbComponent: 2, bytes: 8, varType: "vec2<u32>" };
      case "vec3<u32>":
        return { name: "uint32x3", nbComponent: 3, bytes: 12, varType: "vec3<u32>" };
      case "vec4<u32>":
        return { name: "uint32x4", nbComponent: 4, bytes: 16, varType: "vec4<u32>" };
      case "i32":
        return { name: "sint32", nbComponent: 1, bytes: 4, varType: "i32" };
      case "vec2<i32>":
        return { name: "sint32x2", nbComponent: 2, bytes: 8, varType: "vec2<i32>" };
      case "vec3<i32>":
        return { name: "sint32x3", nbComponent: 3, bytes: 12, varType: "vec3<i32>" };
      case "vec4<i32>":
        return { name: "sint32x4", nbComponent: 4, bytes: 16, varType: "vec4<i32>" };
      case "f32":
        return { name: "float32", nbComponent: 1, bytes: 4, varType: "f32" };
      case "vec2<f32>":
        return { name: "float32x2", nbComponent: 2, bytes: 8, varType: "vec2<f32>" };
      case "vec3<f32>":
        return { name: "float32x3", nbComponent: 3, bytes: 12, varType: "vec3<f32>" };
      case "vec4<f32>":
        return { name: "float32x4", nbComponent: 4, bytes: 16, varType: "vec4<f32>" };
      case "vec2<f16>":
        return { name: "float16x2", nbComponent: 2, bytes: 4, varType: "vec2<f16>" };
      case "vec4<f16>":
        return { name: "float16x4", nbComponent: 4, bytes: 8, varType: "vec4<f16>" };
      default:
        throw new Error("GPUVertexAttribute.getVertexDataType error : dataInfo doesn't represent a correct VertexAttribute data-type");
    }
  }
}
class z {
  constructor(t, e) {
    u(this, "properties", []);
    u(this, "isShaderIO", !1);
    u(this, "name");
    if ((t === "Input" || t === "Output") && (this.isShaderIO = !0), this.name = t, e) {
      for (let s = 0; s < e.length; s++)
        e[s].builtin || (e[s].builtin = "");
      this.properties = e;
    }
  }
  clone(t) {
    let e = t || this.name;
    return new z(e, [...this.properties]);
  }
  addProperty(t) {
    return t.builtin || (t.builtin = ""), this.properties.push(t), this;
  }
  getComputeVariableDeclaration(t = 0) {
    let e, s = "", i = 0;
    for (let n = 0; n < this.properties.length; n++)
      e = this.properties[n], e.type.createDeclaration && (e.type instanceof E ? (e.type.name = e.name, s += e.type.createDeclaration(t + i++, 0, !e.isOutput)) : (s += e.type.createDeclaration(t + i++), e.type.createStruct && (s += e.type.createStruct().struct)));
    return s;
  }
  getFunctionParams() {
    let t = "", e;
    for (let s = 0; s < this.properties.length; s++)
      e = this.properties[s], t += e.builtin + " " + e.name + ":" + e.type, s != this.properties.length - 1 && (t += ", "), s != this.properties.length - 1 && (t += " ");
    return t;
  }
  getComputeFunctionParams() {
    let t = "", e, s = 0;
    for (let i = 0; i < this.properties.length; i++)
      e = this.properties[i], e.type.createDeclaration || (s++ !== 0 && (t += ", "), t += e.builtin + " " + e.name + ":" + e.type);
    return t;
  }
  getInputFromOutput() {
    return this.name != "Output" ? null : new z("Input", this.properties.slice(1));
  }
  get struct() {
    let t = "struct " + this.name + ` {
`, e;
    for (let s = 0; s < this.properties.length; s++)
      e = this.properties[s], this.isShaderIO ? (s > 0 && (e.builtin = "@location(" + (s - 1) + ")"), t += "   " + e.builtin + " " + e.name + ":" + e.type + `,
`) : e.size !== void 0 ? t += "    @size(" + e.size + ") @align(16) " + e.name + ":" + e.type + `,
` : t += "    " + e.name + ":" + e.type + `,
`;
    return t += `}

`, t;
  }
}
class E extends oe {
  constructor(e, s) {
    super();
    u(this, "bufferId");
    //the id used in renderPass.setVertexBuffer
    u(this, "io", 0);
    u(this, "resourceIO", null);
    u(this, "mustBeTransfered", !1);
    u(this, "vertexArrays", []);
    u(this, "attributes", {});
    u(this, "gpuResource");
    u(this, "descriptor");
    u(this, "_nbComponent", 0);
    u(this, "_datas");
    u(this, "nbComponentData");
    u(this, "attributeChanged", !1);
    u(this, "gpuBufferIOs");
    u(this, "gpuBufferIO_index", 1);
    u(this, "_byteCount", 0);
    u(this, "debug", !1);
    u(this, "pipelineType");
    u(this, "arrayStride");
    u(this, "layout");
    u(this, "lowLevelBuffer", !1);
    u(this, "_bufferSize");
    u(this, "deviceId");
    u(this, "time");
    u(this, "destroyed", !0);
    s ? s = { ...s } : s = {}, s.stepMode || (s.stepMode = "vertex"), this.descriptor = s;
    const i = e;
    let n, r, a, o, f = 0;
    for (let l in i)
      n = i[l], r = n.offset, a = n.datas, f += n.nbComponent, this.attributes[l] || (o = this.createArray(l, n.type, r), a && (o.datas = a));
    if (s.datas && (this.datas = s.datas), s.gpuUpdateMode == "manual") {
      const l = s.accessMode ? s.accessMode : "read";
      if (!s.usage)
        throw new Error("VertexBuffer constructor : you must set the property 'usage' in the descriptor if 'gpuUpdateMode' is set to 'manual' ");
      const h = s.usage;
      this.createLowLevelBuffer(f * 4, l, h);
    }
  }
  /*
      public pushDatas(datas: Float32Array | Int32Array | Uint32Array | Uint16Array) {
          this.mustBeTransfered = true;
  
          if (!extraBufferSize) extraBufferSize = 1000;
  
          //if (this.datas) console.log(this.datas.length + " VS " + (offset + len))
  
          if (!this._datas || this._datas.length < offset + len) {
  
  
             
  
  
              if (!this._datas) {
                  this._datas = datas;
                  this.createGpuResource();
              } else if ((offset + len) - this._datas.length >= extraBufferSize) {
                  this._datas = datas;
                  this.createGpuResource();
              } else {
  
                  //console.log("B")
  
                  if (indices instanceof Uint16Array) this._datas = new Uint16Array(this._datas.length + extraBufferSize);
                  else this._datas = new Uint32Array(this._datas.length + extraBufferSize);
                  this._datas.set(indices);
                  this.createGpuResource();
              }
          } else {
              //console.log("A ", indices.slice(offset, offset + len))
              if (offset && len) this._datas.set(indices.slice(offset, offset + len), offset)
              else this._datas.set(indices);
          }
  
          this.update();
      }
      */
  clone() {
    const e = new E(this.attributeDescriptor, this.descriptor);
    e.bufferId = this.bufferId;
    let s;
    return this.datas instanceof Float32Array ? s = new Float32Array(this.datas.length) : this.datas instanceof Int32Array ? s = new Int32Array(this.datas.length) : this.datas instanceof Uint32Array && (s = new Uint32Array(this.datas.length)), s.set(this.datas), e.datas = s, e;
  }
  initBufferIO(e) {
    this.gpuBufferIOs = e;
  }
  get buffer() {
    return this.gpuBufferIOs ? this.gpuBufferIOs[this.gpuBufferIO_index++ % 2] : this.gpuResource;
  }
  getCurrentBuffer() {
    return this.gpuBufferIOs ? this.gpuBufferIOs[(this.gpuBufferIO_index + 1) % 2] : (this.gpuResource || this.createGpuResource(), this.gpuResource);
  }
  get stepMode() {
    return this.descriptor.stepMode;
  }
  get length() {
    return this.vertexArrays.length;
  }
  get nbComponent() {
    return this._nbComponent;
  }
  get nbVertex() {
    return this.datas ? this.nbComponentData ? this.datas.length / this.nbComponentData : this.datas.length / this._nbComponent : 0;
  }
  get datas() {
    return this._datas;
  }
  set datas(e) {
    this._datas = e, this.mustBeTransfered = !0;
  }
  setComplexDatas(e, s) {
    this._nbComponent = s, this.datas = e;
  }
  get attributeDescriptor() {
    const e = {};
    let s;
    for (let i in this.attributes)
      s = this.attributes[i], e[i] = {
        type: s.format,
        offset: s.dataOffset
      };
    return e;
  }
  createArray(e, s, i) {
    if (this.attributes[e] && this.attributes[e].vertexBuffer)
      return this.attributes[e];
    let n = this.attributes[e];
    n || (n = this.attributes[e] = new I(e, s, i)), n.vertexBuffer = this;
    const r = n.nbComponent, a = n.dataOffset === void 0 ? 0 : n.dataOffset;
    return this._nbComponent += r, n.dataOffset === void 0 ? this._byteCount += r * new ie(n.varType).byteValue : this._byteCount = Math.max(this._byteCount, (a + n.nbComponent) * new ie(n.varType).byteValue), this.vertexArrays.push(n), n;
  }
  getAttributeByName(e) {
    return this.attributes[e];
  }
  //----------------------------- USED WITH COMPUTE PIPELINE ----------------------------------------
  createDeclaration(e, s, i = 0, n = !0) {
    this.stackAttributes();
    let r = e.substring(0, 1).toUpperCase() + e.slice(1);
    const a = e.substring(0, 1).toLowerCase() + e.slice(1);
    let o = "", f = "storage, read", l = "array<" + r + ">";
    if (this.descriptor.accessMode == "read") {
      o += "struct " + r + `{
`;
      let h;
      for (let c = 0; c < this.vertexArrays.length; c++)
        h = this.vertexArrays[c], o += "   " + h.name + ":" + h.varType + `,
`;
      o += `}

`, l = "array<" + r + ">";
    } else {
      if (f = "storage, read_write", this.io == 2)
        r = r.slice(0, r.length - 4);
      else {
        o += "struct " + r + `{
`;
        let h;
        for (let c = 0; c < this.vertexArrays.length; c++)
          h = this.vertexArrays[c], o += "   " + h.name + ":" + h.varType + `,
`;
        o += `}

`, l = "array<" + r + ">";
      }
      l = "array<" + r + ">";
    }
    return o += "@binding(" + s + ") @group(" + i + ") var<" + f + "> " + a + ":" + l + `;
`, o;
  }
  createBindGroupLayoutEntry(e) {
    return {
      binding: e,
      visibility: GPUShaderStage.COMPUTE,
      buffer: {
        type: this.descriptor.accessMode === "read" ? "read-only-storage" : "storage"
      }
    };
  }
  createBindGroupEntry(e) {
    this.gpuResource || this.createGpuResource();
    let s = 0;
    return this.datas && (s = this.datas.byteLength), this.lowLevelBuffer && (s = this._bufferSize), {
      binding: e,
      resource: {
        buffer: this.gpuResource,
        offset: 0,
        size: s
      }
    };
  }
  setPipelineType(e) {
    this.pipelineType || e == "compute" && this.lowLevelBuffer == !0 || (this.pipelineType = e, e === "render" ? (this.descriptor.accessMode || (this.descriptor.accessMode = "read"), this.descriptor.usage || (this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST)) : e === "compute_mixed" ? this.io === 1 || this.io === 0 ? (this.descriptor.usage || (this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC), this.descriptor.accessMode || (this.descriptor.accessMode = "read")) : this.io === 2 && (this.descriptor.usage || (this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC), this.descriptor.accessMode || (this.descriptor.accessMode = "read_write")) : e === "compute" && (this.io === 1 || this.io == 0 ? (this.descriptor.usage || (this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC), this.descriptor.accessMode || (this.descriptor.accessMode = "read")) : this.io === 2 && (this.descriptor.usage || (this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC), this.descriptor.accessMode || (this.descriptor.accessMode = "read_write"))));
  }
  //------------------------------------------------------------------------------------------------------
  createStruct(e) {
    const s = e.substring(0, 1).toUpperCase() + e.slice(1), i = [];
    let n;
    for (let r = 0; r < this.vertexArrays.length; r++)
      n = this.vertexArrays[r], i[r] = { name: n.name, type: n.varType, builtin: "" };
    return new z(s, i);
  }
  stackAttributes(e = 0) {
    const s = [];
    let i = 1;
    var n = [], r = [], a = [];
    let o, f = 0;
    for (let d = 0; d < this.vertexArrays.length; d++)
      o = this.vertexArrays[d], o.nbComponent === 1 ? n.push(o) : o.nbComponent === 2 ? (i < 2 && (i = 2), r.push(o)) : o.nbComponent === 3 ? (i = 4, a.push(o)) : o.nbComponent === 4 && (i = 4, o.dataOffset = f, f += 4, s.push(o));
    const l = () => {
      if (o = a.shift(), o.dataOffset = f, f += 3, s.push(o), n.length) {
        const d = n.shift();
        d.dataOffset = f, s.push(d);
      }
      f++;
    };
    let h = a.length;
    for (let d = 0; d < h; d++) l();
    h = r.length;
    for (let d = 0; d < h; d++)
      o = r.shift(), o.dataOffset = f, f += 2, s.push(o);
    h = n.length;
    for (let d = 0; d < h; d++)
      o = n.shift(), o.dataOffset = f, f++, s.push(o);
    f % i !== 0 && (f += i - f % i), this.vertexArrays = s;
    const c = [];
    for (let d = 0; d < s.length; d++)
      c[d] = {
        shaderLocation: e + d,
        offset: s[d].dataOffset * Float32Array.BYTES_PER_ELEMENT,
        format: this.vertexArrays[d].format
      };
    return this.arrayStride = f, {
      stepMode: this.descriptor.stepMode,
      arrayStride: Float32Array.BYTES_PER_ELEMENT * this.arrayStride,
      attributes: c
    };
  }
  addVertexInstance(e, s) {
    const i = e * this.arrayStride, n = this._datas;
    let r;
    for (let a in s)
      r = this.getAttributeByName(a), r && (n[i + r.dataOffset] = s[a]);
  }
  createVertexBufferLayout(e = 0) {
    if (this.gpuBufferIOs)
      return this.stackAttributes(e);
    let s = this._nbComponent;
    this.nbComponentData && (s = this.nbComponentData);
    const i = {
      stepMode: this.descriptor.stepMode,
      arrayStride: Float32Array.BYTES_PER_ELEMENT * s,
      attributes: []
    };
    let n = 0, r;
    for (let a = 0; a < this.vertexArrays.length; a++)
      r = n, this.vertexArrays[a].dataOffset !== void 0 && (r = n = this.vertexArrays[a].dataOffset), i.attributes[a] = {
        shaderLocation: e + a,
        offset: r * Float32Array.BYTES_PER_ELEMENT,
        format: this.vertexArrays[a].format
      }, n += this.vertexArrays[a].nbComponent;
    return i.arrayStride = Math.max(this._byteCount, s * Float32Array.BYTES_PER_ELEMENT), this.layout = i, i;
  }
  createLowLevelBuffer(e, s = "read", i = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST) {
    this.lowLevelBuffer = !0, this.gpuResource && this.gpuResource.destroy(), this.descriptor.usage = i, this.descriptor.accessMode = s, this.deviceId = m.deviceId, this._bufferSize = e, this.gpuResource = m.device.createBuffer({
      size: e,
      usage: this.descriptor.usage,
      mappedAtCreation: !1
    }), this.destroyed = !1, this.mustBeTransfered = !0;
  }
  resizeLowLevelBuffer(e, s = !1) {
    if (!this.lowLevelBuffer) return;
    const i = this.gpuResource;
    if (this._bufferSize = e, this.gpuResource = m.device.createBuffer({
      size: e,
      usage: this.descriptor.usage,
      mappedAtCreation: !1
    }), s) {
      const n = m.device.createCommandEncoder();
      n.copyBufferToBuffer(i, 0, this.gpuResource, 0, i.size);
      const r = n.finish();
      m.device.queue.submit([r]), m.device.queue.onSubmittedWorkDone().then(() => {
        i.destroy();
      });
    } else
      i.destroy();
  }
  updateLowLevelBuffer(e, s, i, n) {
    if (n == null && (n = e.byteLength), i == null && (i = 0), !this.gpuResource) throw new Error("you must create a GPUBuffer using VertexBuffer.createGPUResource(bufferSize)");
    if (i + n > e.byteLength) throw new Error("incorrect datas length");
    m.device.queue.writeBuffer(this.gpuResource, s, e, i, n);
  }
  get bufferSize() {
    return this._bufferSize;
  }
  createGpuResource() {
    if (this.lowLevelBuffer || (this.attributeChanged && this.updateAttributes(), !this.datas || this.gpuBufferIOs)) return;
    this.gpuResource && this.gpuResource.destroy();
    const e = this.datas.byteLength;
    this.deviceId = m.deviceId, this._bufferSize = e, this.gpuResource = m.device.createBuffer({
      size: e,
      usage: this.descriptor.usage,
      mappedAtCreation: !1
    }), this.destroyed = !1, this.mustBeTransfered = !0;
  }
  destroyGpuResource() {
    if (!this.destroyed && !(this.time && (/* @__PURE__ */ new Date()).getTime() - this.time < 100 && m.loseDeviceRecently)) {
      if (this.time = (/* @__PURE__ */ new Date()).getTime(), this.io && m.loseDeviceRecently) {
        if (this.io === 1) {
          const e = this.resourceIO, s = e.buffers;
          this.setPipelineType(this.pipelineType);
          const i = e.currentDatas ? e.currentDatas : s[0]._datas;
          s[0]._datas instanceof Float32Array ? s[0]._datas = s[1]._datas = new Float32Array(i) : s[0]._datas instanceof Int32Array ? s[0]._datas = s[1]._datas = new Int32Array(i) : s[0]._datas instanceof Uint32Array && (s[0]._datas = s[1]._datas = new Uint32Array(i));
          let n = s[0].gpuBufferIOs;
          s[0].gpuBufferIOs = null, s[0].createGpuResource(), s[0].gpuBufferIOs = n, n = s[1].gpuBufferIOs, s[1].gpuBufferIOs = null, s[1].createGpuResource(), s[1].gpuBufferIOs = n, s[0].gpuBufferIOs[0] = s[0].gpuResource, s[0].gpuBufferIOs[1] = s[1].gpuResource;
        }
        return;
      }
      this.destroyed = !0, this.resourceIO && (this.resourceIO.destroy(), this.resourceIO = null), this.gpuResource && (this.gpuResource.destroy(), this.gpuResource = null);
    }
  }
  updateBuffer() {
    this.lowLevelBuffer || this.datas && (this.gpuResource || this.createGpuResource(), this.datas.byteLength != this._bufferSize && this.createGpuResource(), m.device.queue.writeBuffer(this.gpuResource, 0, this.datas.buffer));
  }
  getVertexArrayById(e) {
    return this.vertexArrays[e];
  }
  updateAttributes() {
    let e;
    e = this.vertexArrays[0];
    const s = this.vertexArrays.length;
    let i = 0;
    if (this.vertexArrays[0] && this.vertexArrays[0].useByVertexData) {
      const n = e.datas.length;
      this._datas || (this._datas = new Float32Array(n * this.nbComponent));
      for (let r = 0; r < n; r++)
        for (let a = 0; a < s; a++)
          e = this.vertexArrays[a], e.mustBeTransfered && this._datas.set(e.datas[r], i), i += e.nbComponent;
    } else {
      const n = e.datas.length / e.nbComponent;
      this._datas || (this._datas = new Float32Array(n * this.nbComponent));
      for (let r = 0; r < s; r++)
        e = this.vertexArrays[r], e.mustBeTransfered && this._datas.set(e.datas, i), i += e.nbComponent;
    }
    for (let n = 0; n < s; n++) this.vertexArrays[n].mustBeTransfered = !1;
    this.attributeChanged = !1, this.mustBeTransfered = !0;
  }
  update() {
    return this.lowLevelBuffer ? !0 : this.vertexArrays.length === 0 ? !1 : (this.attributeChanged && this.updateAttributes(), this.mustBeTransfered && (this.mustBeTransfered = !1, this.updateBuffer()), !0);
  }
}
class H extends oe {
  constructor(e, s) {
    super();
    u(this, "buffers", []);
    u(this, "descriptor");
    //public onOutputData: (data: ArrayBuffer) => void;
    //protected stagingBuffer: GPUBuffer;
    //protected canCallMapAsync: boolean = true;
    u(this, "deviceId");
    u(this, "currentDatas");
    u(this, "view");
    u(this, "dataStructureChanged", !1);
    u(this, "nextDatas");
    u(this, "attributeDesc");
    s ? s = { ...s } : s = {}, this.descriptor = s, s.stepMode || (s.stepMode = "instance"), this.deviceId = m.deviceId, this.buffers[0] = new E(e, s), this.buffers[1] = new E(e, s), this.buffers[0].io = 1, this.buffers[1].io = 2, this.buffers[0].resourceIO = this, this.buffers[1].resourceIO = this;
  }
  get input() {
    return this.buffers[0];
  }
  get output() {
    return this.buffers[1];
  }
  destroy() {
    this.stagingBuffer && this.stagingBuffer.destroy(), this.buffers[0].destroyGpuResource(), this.buffers[1].destroyGpuResource(), this.buffers = void 0, this.onOutputData = void 0;
  }
  rebuildAfterDeviceLost() {
    this.deviceId != m.deviceId && (this.deviceId = m.deviceId, this.canCallMapAsync = !0, this.stagingBuffer = null, this.currentDatas = this.buffers[0].datas);
  }
  async getOutputData() {
    this.rebuildAfterDeviceLost();
    const e = this.buffers[0].buffer;
    if (!this.onOutputData) return null;
    if (!this.canCallMapAsync) return;
    this.canCallMapAsync = !1, this.stagingBuffer || (this.stagingBuffer = m.createStagingBuffer(this.bufferSize));
    const s = m.device.createCommandEncoder(), i = this.stagingBuffer;
    s.copyBufferToBuffer(e, 0, i, 0, i.size), m.device.queue.submit([s.finish()]), await this.stagingBuffer.mapAsync(GPUMapMode.READ, 0, i.size), this.canCallMapAsync = !0;
    const r = i.getMappedRange(0, i.size).slice(0);
    i.unmap(), this.currentDatas = r, this.onOutputData(r);
  }
  clone() {
    return new H(this.buffers[0].attributeDescriptor, this.descriptor);
  }
  createDeclaration(e, s, i) {
    const n = e.substring(0, 1).toUpperCase() + e.slice(1), r = e.substring(0, 1).toLowerCase() + e.slice(1);
    let a = "";
    a += "struct " + n + `{
`;
    let o;
    for (let f = 0; f < this.buffers[0].vertexArrays.length; f++)
      o = this.buffers[0].vertexArrays[f], a += "   " + o.name + ":" + o.varType + `,
`;
    return a += `}

`, a += "@binding(" + s + ") @group(" + i + ") var<storage, read> " + r + ":array<" + n + `>;
`, a += "@binding(" + (s + 1) + ") @group(" + i + ") var<storage, read_write> " + r + "_out:array<" + n + `>;
`, a + `
`;
  }
  createVertexInstances(e, s) {
    this.buffers[0].arrayStride == null && this.buffers[0].stackAttributes();
    const i = this.buffers[0].attributes, n = this.buffers[0].arrayStride;
    let r;
    for (let h in i) {
      r = i[h].format;
      break;
    }
    let a;
    r === "float32" || r === "float32x2" || r === "float32x3" || r === "float32x4" ? a = new Float32Array(n * e) : r == "sint32" || r == "sint32x2" || r == "sint32x3" || r == "sint32x4" ? a = new Int32Array(n * e) : (r == "uint32" || r == "uint32x2" || r == "uint32x3" || r == "uint32x4") && (a = new Uint32Array(n * e));
    let o, f, l;
    for (let h = 0; h < e; h++) {
      f = n * h, o = s(h);
      for (let c in o)
        l = i[c], l && a.set(o[c], f + l.dataOffset);
    }
    this.datas = a;
  }
  getVertexInstances(e, s) {
    const i = this.buffers[0].arrayStride ? this.buffers[0].arrayStride : this.buffers[1].arrayStride, n = this.buffers[0].attributes;
    if (!this.view) {
      this.view = {};
      for (let c in n) {
        const g = n[c];
        let d;
        g.nbComponent === 1 ? d = { x: 0, ___offset: g.dataOffset } : g.nbComponent === 2 ? d = { x: 0, y: 0, ___offset: g.dataOffset } : g.nbComponent === 3 ? d = { x: 0, y: 0, z: 0, ___offset: g.dataOffset } : g.nbComponent === 4 && (d = { x: 0, y: 0, z: 0, w: 0, ___offset: g.dataOffset }), this.view[c] = d;
      }
    }
    const r = this.view, a = this.buffers[0].datas.length / i;
    let o, f, l, h;
    for (let c = 0; c < a; c++) {
      o = c * i;
      for (let g in n)
        l = n[g].nbComponent, f = o + n[g].dataOffset, h = r[g], h.x = e[f], l >= 2 && (h.y = e[f + 1], l >= 3 && (h.z = e[f + 2], l == 4 && (h.w = e[f + 3])));
      s(r);
    }
  }
  set datas(e) {
    this.buffers[0].datas = e, this.buffers[1].datas = e;
  }
  get attributeDescriptor() {
    return this.attributeDesc || (this.attributeDesc = this.buffers[0].attributeDescriptor), this.attributeDesc;
  }
  update() {
    this.rebuildAfterDeviceLost(), this.buffers[0].update(), this.buffers[1].update();
  }
  get bufferSize() {
    return this.buffers[0].buffer.size;
  }
  get nbVertex() {
    return this.buffers[0].nbVertex;
  }
}
class Q {
  constructor(t) {
    u(this, "mustBeTransfered", !0);
    u(this, "descriptor");
    u(this, "useWebcodec", !1);
    //still in beta 
    u(this, "gpuResource");
    /*
    bindgroups: an array of bindgroup that contains the VideoTexture 
    => I need it to call its "build" function onVideoFrameCallback
    => a videoTexture can be contained in multiple bindgroups, that's why it's an array
    */
    u(this, "bindgroups", []);
    u(this, "deviceId");
    u(this, "videoFrame");
    t.format === void 0 && (t.format = "rgba8unorm"), t.usage === void 0 && (t.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT), t.mipLevelCount === void 0 && (t.mipLevelCount = 1), t.sampleCount === void 0 && (t.sampleCount = 1), t.dimension === void 0 && (t.dimension = "2d"), t.viewFormats === void 0 && (t.viewFormats = []), this.descriptor = t, t.source && (this.source = t.source);
  }
  addBindgroup(t) {
    this.bindgroups.indexOf(t) === -1 && this.bindgroups.push(t);
  }
  clone() {
    return new Q(this.descriptor);
  }
  set source(t) {
    this.gpuResource = t, this.descriptor.source = t, this.descriptor.size = [t.width, t.height];
    let e = 0;
    const s = () => {
      this.gpuResource && (m.device && this.deviceId === m.deviceId ? (this.bindgroups.forEach((i) => i.build()), e = 0) : e++, e < 30 ? t.requestVideoFrameCallback(s) : t.src = void 0);
    };
    t.requestVideoFrameCallback(s);
  }
  createDeclaration(t, e, s = 0) {
    return "@binding(" + e + ") @group(" + s + ") var " + t + `:texture_external;
`;
  }
  createBindGroupLayoutEntry(t) {
    return {
      binding: t,
      visibility: GPUShaderStage.FRAGMENT,
      externalTexture: {}
    };
  }
  createGpuResource() {
  }
  update() {
    this.deviceId = m.deviceId;
  }
  destroyGpuResource() {
    this.videoFrame && (this.videoFrame.close(), this.videoFrame = null);
  }
  createBindGroupEntry(t) {
    if (this.useWebcodec && (this.videoFrame && this.videoFrame.close(), this.videoFrame = new window.VideoFrame(this.gpuResource)), !this.gpuResource) throw new Error("gpuResource cannot be null. You must provide a HTMLVideoElement");
    return {
      binding: t,
      resource: m.device.importExternalTexture({
        source: this.useWebcodec ? this.videoFrame : this.gpuResource
      })
    };
  }
  setPipelineType(t) {
  }
}
const ge = class ge {
  constructor() {
    u(this, "targetIsBindgroup");
    u(this, "parseDebugValues", (t) => {
      let e, s = [], i = [], n = {}, r = 0;
      for (let a in t)
        e = t[a], e && e.__debug == !0 && (typeof e == "function" ? e = { name: a, id: r, ...e() } : (e.id = r, e.name = a), t[a] = void 0, s[r] = new Ce(e.vertexId, e.instanceId, 0, 0), n[a] = e, i[r] = e, r++);
      return {
        nb: r,
        indexs: s,
        objectByName: n,
        objectById: i
      };
    });
    u(this, "parseVertexShaderDebug", (t) => {
      typeof t.vertexShader == "string" && (t.vertexShader = { main: t.vertexShader });
      const e = (l) => {
        let h = l.split(`
`), c, g = "";
        for (let d = 0; d < h.length; d++)
          c = h[d], !c.includes("debug.") && (g += c + `
`);
        return g;
      }, s = t.vertexShader.main;
      t.vertexShader.main = e(s);
      const i = t.__DEBUG__.objectByName, n = (l) => {
        let h = "abcdefghijklmnopqrstuvwxyz/";
        h += h.toUpperCase();
        let c;
        for (let g = 0; g < l.length; g++)
          if (c = l[g], h.includes(c))
            return l.slice(g);
        return l;
      }, r = (l) => {
        let h = "abcdefghijklmnopqrstuvwxyz0123456789_";
        h += h.toUpperCase();
        let c, g = "";
        for (let d = 0; d < l.length; d++) {
          if (c = l[d], h.includes(c)) {
            g += c;
            continue;
          }
          if (c !== " ") {
            if (c != "=")
              throw new Error(`VERTEX SHADER ERROR on this line :"debug.${l} ". The keyword "debug" must only be used to store data. It can't be used in computations.`);
            return g;
          }
        }
        return g;
      }, a = (l) => {
        let h = l.split(`
`), c, g = ";", d = [], p = {}, y, T = [], B = 0;
        for (let S = 0; S < h.length; S++)
          if (c = n(h[S]), c.slice(0, 2) != "//") {
            if (c.includes("debug."))
              if (c.slice(0, 6) === "debug.")
                if (c.split("=").length == 2) {
                  const _ = r(c.slice(6)), K = i[_];
                  if (!i[_])
                    throw new Error(`VERTEX SHADER ERROR on this line :" ${c} ". The value "debug.${_}" is used in the vertexShader but not defined in RenderPipeline.initFromObject `);
                  d.includes(_) === !1 && d.push(_), isNaN(p[_]) ? p[_] = 0 : p[_]++, y = _ + "__" + p[_], K.newName = y, i[y] = T[B++] = { ...K }, c = c.replace("debug." + _, "debug." + y);
                } else
                  throw new Error(`VERTEX SHADER ERROR on this line :" ${c} ".`);
              else
                throw new Error(`VERTEX SHADER ERROR on this line :" ${c} ". The keyword "debug" must only be used to store data. It can't be used in computations.`);
            g += c + `
`;
          }
        t.__DEBUG__.objectById = T;
        for (let S = 0; S < d.length; S++)
          i[d[S]] = void 0, delete i[d[S]];
        return g;
      }, o = (l) => {
        let h = l.split(`
`);
        for (let c = 0; c < h.length; c++) h[c] = h[c].split("//")[0];
        return h.join(`
`);
      };
      return t.vertexShader.debugVersion = a(o(s)), (() => {
        const l = t.__DEBUG__.objectById, h = t.__DEBUG__.objectByName;
        let c, g, d, p, y = [];
        for (let T = 0; T < l.length; T++)
          if (c = { ...l[T] }, c.type == "mat4x4<f32>")
            g = c.newName, d = g + "_m4", c.isMatrix = !0, c.realType = c.type, c.type = "vec4<f32>", h[g] = void 0, delete h[g], p = d + "0", h[p] = { ...c, newName: p }, y.push(h[p]), p = d + "1", h[p] = { ...c, newName: p }, y.push(h[p]), p = d + "2", h[p] = { ...c, newName: p }, y.push(h[p]), p = d + "3", h[p] = { ...c, newName: p }, y.push(h[p]);
          else if (c.type == "mat3x3<f32>")
            g = c.newName, d = g + "_m3", c.isMatrix = !0, c.realType = c.type, c.type = "vec3<f32>", h[g] = void 0, delete h[g], p = d + "0", h[p] = { ...c, newName: p }, y.push(h[p]), p = d + "1", h[p] = { ...c, newName: p }, y.push(h[p]), p = d + "2", h[p] = { ...c, newName: p }, y.push(h[p]), p = d + "3", h[p] = { ...c, newName: p }, y.push(h[p]);
          else if (c.isArray) {
            const B = c.type.includes("mat"), S = c.len;
            if (g = c.newName, d = g + "_ar", c.isMatrix = !1, c.realType = c.type, c.type = "vec4<f32>", c.realType.includes("i32") ? c.type = "vec4<i32>" : c.realType.includes("u32") && (c.type = "vec4<u32>"), h[g] = void 0, delete h[g], B) {
              h[g] = void 0, delete h[g];
              for (let _ = 0; _ < S; _++)
                p = d + _ + "_m0", h[p] = { ...c, newName: p }, y.push(h[p]), p = d + _ + "_m1", h[p] = { ...c, newName: p }, y.push(h[p]), p = d + _ + "_m2", h[p] = { ...c, newName: p }, y.push(h[p]), p = d + _ + "_m3", h[p] = { ...c, newName: p }, y.push(h[p]);
            } else
              for (let _ = 0; _ < S; _++)
                p = d + _, h[p] = { ...c, newName: p }, y.push(h[p]);
          } else
            y.push(c);
        t.__DEBUG__.objectById = y;
      })(), t;
    });
  }
  parseShaderBuiltins(t) {
    const e = (p, y) => {
      if (typeof t.computeShader == "string") {
        const T = t.computeShader;
        t.computeShader = {
          main: T
        };
      }
      t.computeShader.inputs || (t.computeShader.inputs = {}), t.computeShader.inputs[p] = y;
    }, s = (p, y) => {
      for (let T in b.computeInputs)
        y === b.computeInputs[T] && e(p, y);
    }, i = (p, y) => {
      if (typeof t.computeShader == "string") {
        const T = t.computeShader;
        t.computeShader = {
          main: T
        };
      }
      t.computeShader.outputs || (t.computeShader.outputs = {}), t.computeShader.outputs[p] = y;
    }, n = (p, y) => {
      for (let T in b.computeOutputs)
        y === b.computeOutputs[T] && i(p, y);
    }, r = (p, y) => {
      if (typeof t.vertexShader == "string") {
        const T = t.vertexShader;
        t.vertexShader = {
          main: T
        };
      }
      t.vertexShader.inputs || (t.vertexShader.inputs = {}), t.vertexShader.inputs[p] = y;
    }, a = (p, y) => {
      for (let T in b.vertexInputs)
        y === b.vertexInputs[T] && r(p, y);
    }, o = (p, y) => {
      if (typeof t.vertexShader == "string") {
        const T = t.vertexShader;
        t.vertexShader = {
          main: T
        };
      }
      t.vertexShader.outputs || (t.vertexShader.outputs = {}), t.vertexShader.outputs[p] = y;
    }, f = (p, y) => {
      for (let T in b.vertexOutputs)
        y === b.vertexOutputs[T] && o(p, y);
    }, l = (p, y) => {
      if (typeof t.fragmentShader == "string") {
        const T = t.fragmentShader;
        t.fragmentShader = {
          main: T
        };
      }
      t.fragmentShader.inputs || (t.fragmentShader.inputs = {}), t.fragmentShader.inputs[p] = y;
    }, h = (p, y) => {
      for (let T in b.fragmentInputs)
        y === b.vertexInputs[T] && l(p, y);
    }, c = (p, y) => {
      if (typeof t.fragmentShader == "string") {
        const T = t.fragmentShader;
        t.fragmentShader = {
          main: T
        };
      }
      t.fragmentShader.outputs || (t.fragmentShader.outputs = {}), t.fragmentShader.outputs[p] = y;
    }, g = (p, y) => {
      for (let T in b.fragmentOutputs)
        y === b.fragmentOutputs[T] && c(p, y);
    };
    let d;
    for (let p in t)
      d = t[p], d && (a(p, d), f(p, d), h(p, d), g(p, d), s(p, d), n(p, d));
    return t;
  }
  parseVertexBufferIOs(t) {
    if (this.targetIsBindgroup) return t;
    const e = (n, r) => (t.bindgroups || (t.bindgroups = {}), t.bindgroups.io || (t.bindgroups.io = {}), t.bindgroups.io[n] = r, r), s = (n, r) => {
      r instanceof H && e(n, r);
    };
    let i;
    for (let n in t)
      i = t[n], i && s(n, i);
    return t;
  }
  parseImageTextureIOs(t) {
    if (this.targetIsBindgroup) return t;
    const e = (n, r) => (t.bindgroups || (t.bindgroups = {}), t.bindgroups.io || (t.bindgroups.io = {}), t.bindgroups.io[n] = r, r), s = (n, r) => {
      r instanceof ne && e(n, r);
    };
    let i;
    for (let n in t)
      i = t[n], i && s(n, i);
    return t;
  }
  parseVertexBuffers(t) {
    if (this.targetIsBindgroup) return t;
    const e = (n, r) => (t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {}), t.bindgroups.default[n] = r, r), s = (n, r) => {
      r instanceof E && e(n, r);
    };
    let i;
    for (let n in t)
      i = t[n], i && s(n, i);
    return t;
  }
  parseVertexAttributes(t) {
    const e = (n, r) => {
      let a = t;
      if (this.targetIsBindgroup || (t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {}), a = t.bindgroups.default), a.buffer) {
        let o = r.offset;
        r instanceof I && (o = r.dataOffset, a.buffer.attributes[r.name] = r);
        const f = a.buffer.createArray(n, r.type, o);
        r.datas && (f.datas = r.datas);
      } else {
        const o = {};
        o[n] = r, a.buffer = new E(o);
      }
    }, s = (n, r) => {
      r.type && I.types[r.type] ? e(n, r) : r instanceof I && e(n, {
        type: r.format,
        offset: r.dataOffset,
        datas: r.datas
      });
    };
    let i;
    for (let n in t)
      i = t[n], i && s(n, i);
    return t;
  }
  parseUniformBuffers(t) {
    if (this.targetIsBindgroup) return t;
    const e = (n, r) => (t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {}), t.bindgroups.default[n] = r, r), s = (n, r) => {
      r instanceof V && e(n, r);
    };
    let i;
    for (let n in t)
      i = t[n], i && s(n, i);
    return t;
  }
  parseUniform(t) {
    const e = (n, r) => {
      t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {});
      let a = t.bindgroups.default, o = "uniforms";
      if (this.targetIsBindgroup && (a = t, o = t.uniformBufferName ? t.uniformBufferName : "bindgroupUniforms"), r.name) {
        console.warn("parseUniform ", n);
        let f = r, l = r.clone();
        r.addEventListener("ON_CHANGE", () => {
          l.set(f);
        }), r = r.clone();
      }
      if (a[o])
        a[o].add(n, r);
      else {
        const f = {};
        f[n] = r, a[o] = new V(f, { useLocalVariable: !0 });
      }
    }, s = (n, r) => {
      (r instanceof O || r instanceof P || r instanceof D || r instanceof re || r instanceof U) && e(n, r);
    };
    let i;
    for (let n in t)
      i = t[n], i && s(n, i);
    return t;
  }
  parseImageTextureArray(t) {
    if (this.targetIsBindgroup) return t;
    const e = (n, r) => {
      t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {}), t.bindgroups.default[n] = r;
    }, s = (n, r) => {
      r instanceof J && e(n, r);
    };
    let i;
    for (let n in t)
      i = t[n], i && s(n, i);
    return t;
  }
  parseImageTexture(t) {
    if (this.targetIsBindgroup) return t;
    const e = (n, r) => {
      t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {}), t.bindgroups.default[n] = r;
    }, s = (n, r) => {
      r instanceof R && e(n, r);
    };
    let i;
    for (let n in t)
      i = t[n], i && s(n, i);
    return t;
  }
  parseTextureSampler(t) {
    if (this.targetIsBindgroup) return t;
    const e = (n, r) => {
      t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {}), t.bindgroups.default[n] = r;
    }, s = (n, r) => {
      r instanceof he && e(n, r);
    };
    let i;
    for (let n in t)
      i = t[n], i && s(n, i);
    return t;
  }
  parseVideoTexture(t) {
    if (this.targetIsBindgroup) return t;
    const e = (n, r) => {
      t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {}), t.bindgroups.default[n] = r;
    }, s = (n, r) => {
      r instanceof Q && e(n, r);
    };
    let i;
    for (let n in t)
      i = t[n], i && s(n, i);
    return t;
  }
  parseCubeMapTexture(t) {
    if (this.targetIsBindgroup) return t;
    const e = (n, r) => {
      t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {}), t.bindgroups.default[n] = r;
    }, s = (n, r) => {
      r instanceof ve && e(n, r);
    };
    let i;
    for (let n in t)
      i = t[n], i && s(n, i);
    return t;
  }
  parseDrawConfig(t, e) {
    if (t.vertexCount) {
      if (isNaN(t.vertexCount)) throw new Error("descriptor.vertexCount is a reserved keyword and must be a number");
      e.vertexCount = t.vertexCount;
    }
    if (t.instanceCount) {
      if (isNaN(t.instanceCount)) throw new Error("descriptor.instanceCount is a reserved keyword and must be a number");
      e.instanceCount = t.instanceCount;
    }
    if (t.firstVertexId) {
      if (isNaN(t.firstVertexId)) throw new Error("descriptor.firstVertexId is a reserved keyword and must be a number");
      e.firstVertexId = t.firstVertexId;
    }
    if (t.firstInstanceId) {
      if (isNaN(t.firstInstanceId)) throw new Error("descriptor.firstInstanceId is a reserved keyword and must be a number");
      e.firstInstanceId = t.firstInstanceId;
    }
    return t;
  }
  parseBindgroup(t) {
    for (let e in t)
      t[e] instanceof Y && (t.bindgroups || (t.bindgroups = {}), t.bindgroups[e] = t[e], delete t[e]);
    return t;
  }
  firstPass(t, e, s) {
    return t = this.parseBindgroup(t), t = this.parseVertexBuffers(t), t = this.parseVertexAttributes(t), t = this.parseUniformBuffers(t), t = this.parseUniform(t), t = this.parseImageTexture(t), t = this.parseImageTextureArray(t), t = this.parseTextureSampler(t), t = this.parseVideoTexture(t), t = this.parseCubeMapTexture(t), t = this.parseVertexBufferIOs(t), t = this.parseImageTextureIOs(t), (e === "render" || e === "compute") && (t = this.parseShaderBuiltins(t), e === "render" && (t = this.parseDrawConfig(t, s))), t;
  }
  //--------
  parseHighLevelObj(t) {
    const e = (r) => {
      for (let a in b.vertexInputs) if (b.vertexInputs[a] === r) return !0;
      for (let a in b.vertexOutputs) if (b.vertexOutputs[a] === r) return !0;
      for (let a in b.fragmentInputs) if (b.fragmentInputs[a] === r) return !0;
      for (let a in b.fragmentOutputs) if (b.fragmentOutputs[a] === r) return !0;
      for (let a in b.computeInputs) if (b.computeInputs[a] === r) return !0;
      return !1;
    }, s = (r) => {
      let a, o, f = [];
      for (let l in r)
        o = r[l], o && (a = o.constructor.name, a === "Object" && l !== "bindgroups" && l !== "vertexShader" && l !== "fragmentShader" && l !== "computeShader" && (e(o) || f.push({ name: a, resource: o })));
      return f;
    }, i = (r) => {
      const a = [], o = [], f = [];
      let l, h, c;
      for (let g = 0; g < r.length; g++) {
        c = r[g].name, l = r[g].resource;
        for (let d in l)
          h = l[d], h instanceof O || h instanceof P || h instanceof D ? a.push({ containerName: c, name: d, resource: h }) : h instanceof I ? o.push({ containerName: c, name: d, resource: h }) : f.push({ containerName: c, name: d, resource: h });
      }
      return { primitives: a, vertexAttributes: o, shaderResources: f };
    };
    let n = s(t);
    return n.length && (t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {}), i(n)), t;
  }
  //---
  findAndFixRepetitionInDataStructure(t) {
    let e, s, i = {}, n, r, a;
    for (let o in t.bindgroups) {
      n = t.bindgroups[o];
      for (let f in n) {
        if (r = n[f], r instanceof V) {
          a = !0;
          for (let l = r.itemNames.length - 1; l >= 0; l--)
            e = r.itemNames[l], s = r.items[e], i[e] ? (r.remove(e), r.itemNames.length === 0 && (a = !1)) : i[e] = s;
          a || (n[f] = void 0);
        }
        r = n[f];
      }
    }
    return t;
  }
  parseBindgroupEntries(t) {
    const e = t.uniformBufferName ? t.uniformBufferName : "bindgroupUniforms", s = (a, o) => {
      if (t[e])
        t[e].add(a, o);
      else {
        const f = {};
        f[a] = o, t[e] = new V(f, { useLocalVariable: !0 });
      }
    }, i = t.vertexBufferName ? t.vertexBufferName : "bindgroupVertexBuffer", n = (a, o) => {
      if (t[i]) {
        const f = t[i].createArray(a, o.type, o.dataOffset);
        o.datas && (f.datas = o.datas);
      } else {
        const f = {};
        f[a] = o, t[i] = new E(f);
      }
    };
    let r;
    for (let a in t)
      r = t[a], r && (r instanceof O || r instanceof P || r instanceof D ? s(a, r) : I.types[r.type] && n(a, r));
    return t;
  }
  parse(t, e, s) {
    if (this.targetIsBindgroup = e === "bindgroup", e === "bindgroup")
      t = this.parseBindgroupEntries(t);
    else {
      const i = this.parseDebugValues(t);
      t = this.firstPass(t, e, s), t = this.parseHighLevelObj(t), t = this.findAndFixRepetitionInDataStructure(t), i.nb != 0 && (t.__DEBUG__ = i, t = this.parseVertexShaderDebug(t));
    }
    return t;
  }
  static parse(t, e, s) {
    return this.instance || (this.instance = new ge()), this.instance.parse(t, e, s);
  }
};
u(ge, "instance", null);
let ue = ge;
class De {
  constructor(t) {
    u(this, "gpuResource");
    u(this, "descriptor");
    u(this, "mustUpdateData", !1);
    u(this, "_datas");
    t || (t = { nbPoint: 3 }), t.dataType === void 0 && (t.datas ? t.datas instanceof Uint16Array ? t.dataType = "uint16" : t.dataType = "uint32" : t.dataType = "uint16"), t.offset === void 0 && (t.offset = 0), this.descriptor = t, t.nbPoint && (this.nbPoint = t.nbPoint), t.datas === void 0 ? t.datas = new Uint32Array([0, 0, 0]) : this.datas = t.datas;
  }
  destroyGpuResource() {
    this.gpuResource && this.gpuResource.destroy(), this.gpuResource = null;
  }
  createGpuResource() {
    this._datas || console.warn("create index resource ", this.getBufferSize()), this.gpuResource && this.gpuResource.destroy(), this.gpuResource = m.device.createBuffer({
      size: this.getBufferSize(),
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: !1
    }), this.gpuResource.dataType = this.dataType, this.gpuResource.nbPoint = this.nbPoint, this._datas && (this.mustUpdateData = !0, this.update());
  }
  getBufferSize() {
    return this.dataType === "uint16" ? this.datas.length * Uint16Array.BYTES_PER_ELEMENT : this.datas.length * Uint32Array.BYTES_PER_ELEMENT;
  }
  get dataType() {
    return this.descriptor.dataType;
  }
  get nbPoint() {
    return this.descriptor.nbPoint;
  }
  set nbPoint(t) {
    this.descriptor.nbPoint = t;
  }
  get offset() {
    return this.descriptor.offset;
  }
  set offset(t) {
    this.descriptor.offset = t;
  }
  set datas(t) {
    this.mustUpdateData = !0, t instanceof Uint16Array ? this.descriptor.dataType = "uint16" : this.descriptor.dataType = "uint32", (!this._datas || t.length > this._datas.length || t != this._datas) && (this._datas = t, this.createGpuResource()), this.update();
  }
  updateDatas(t, e, s, i) {
    this.mustUpdateData = !0, i || (i = 1e3), !this._datas || this._datas.length < e + s ? (t instanceof Uint16Array ? this.descriptor.dataType = "uint16" : this.descriptor.dataType = "uint32", this._datas ? e + s - this._datas.length >= i ? (this._datas = t, this.createGpuResource()) : (t instanceof Uint16Array ? this._datas = new Uint16Array(this._datas.length + i) : this._datas = new Uint32Array(this._datas.length + i), this._datas.set(t), this.createGpuResource()) : (this._datas = t, this.createGpuResource())) : e && s ? this._datas.set(t.slice(e, e + s), e) : this._datas.set(t), this.update();
  }
  get datas() {
    return this._datas;
  }
  update() {
    this.mustUpdateData && (this.mustUpdateData = !1, m.device.queue.writeBuffer(this.gpuResource, 0, this._datas.buffer));
  }
  apply(t, e) {
    this.gpuResource || this.createGpuResource(), t.setIndexBuffer(this.gpuResource, this.dataType, this.offset, this.getBufferSize()), t.drawIndexed(this.nbPoint, e.instanceCount, e.firstVertexId, e.baseVertex, e.firstInstanceId);
  }
}
class Y {
  constructor(t) {
    u(this, "bindgroupId");
    //the id used in renderPass.setBindgroup
    u(this, "parent");
    u(this, "entries", []);
    u(this, "elements", []);
    u(this, "mustRefreshBindgroup", !1);
    u(this, "applyDraw", !1);
    u(this, "_layout");
    u(this, "_group");
    u(this, "name", "");
    u(this, "_pingPongBindgroup", null);
    //used in ComputePipeline and VertexBufferIO
    u(this, "vertexBufferIO");
    u(this, "textureIO");
    u(this, "resourcesIOs", []);
    u(this, "deviceId", 0);
    u(this, "setupApplyCompleted", !1);
    u(this, "indexBuffer");
    u(this, "vertexBuffers");
    u(this, "vertexBufferReferenceByName");
    u(this, "elementByName", {});
    u(this, "setupDrawCompleted", !1);
    u(this, "instances");
    u(this, "instanceResourcesArray");
    /*
        -------------OLD VERSION-----------
        public createPingPongBindgroup(resource1: IShaderResource, resource2: IShaderResource): Bindgroup {
            const group = new Bindgroup(this.name);
            group.mustRefreshBindgroup = this.mustRefreshBindgroup = true;
            group._layout = this.layout;
            group.elements = this.getSwappedElements(resource1, resource2);
            //console.log("=> group.elements ", group.elements)
    
    
    
            if (resource1 instanceof VertexBuffer) {
    
                const buffers = [resource1.buffer, (resource2 as VertexBuffer).buffer];
                (buffers[0] as any).debug = 1;
                (buffers[1] as any).debug = 2;
    
                resource1.initBufferIO(buffers);
            } else if (resource1 instanceof ImageTexture) {
    
                if (!resource1.gpuResource) resource1.createGpuResource();
                if (!resource2.gpuResource) resource2.createGpuResource();
    
                //console.log(resource1, resource2)
                //console.log(resource1.gpuResource === resource2.gpuResource)
    
                const textures = [resource1.gpuResource, resource2.gpuResource];
                try {
                    (textures[0] as any).debug = 1;
                    (textures[1] as any).debug = 2;
                } catch (e) {
    
                }
    
    
    
                resource1.initTextureIO(textures);
            }
    
            this.ioGroups = [this, group];
            //console.log(this.ioGroups)
            this.debug = 1;
            group.debug = 2;
    
            return group;
    
        }
        */
    u(this, "renderPipelineimageIO");
    u(this, "renderPipelineBufferIO");
    u(this, "ioGroups");
    u(this, "io_index", 0);
    u(this, "debug");
    t && this.initFromObject(t);
  }
  add(t, e) {
    return e instanceof Q ? this.mustRefreshBindgroup = !0 : e instanceof R && (e.source instanceof GPUTexture || !e.source) && (this.mustRefreshBindgroup = !0), e instanceof De ? (this.indexBuffer = e, this.elementByName[t] = e, e) : e instanceof H ? (this.resourcesIOs.push(e), this.mustRefreshBindgroup = !0, this.vertexBufferIO = e, this.elements.push({ name: t, resource: e.buffers[0] }), this.elements.push({ name: t + "_out", resource: e.buffers[1] }), this.parent && this.parent.add(this), e) : e instanceof ne ? (this.resourcesIOs.push(e), this.mustRefreshBindgroup = !0, this.textureIO = e, this.elements.push({ name: t, resource: e.textures[0] }), this.elements.push({ name: t + "_out", resource: e.textures[1] }), this.parent && this.parent.add(this), e) : (e instanceof Q && e.addBindgroup(this), this.elements.push({ name: t, resource: e }), this.parent && this.parent.add(this), e);
  }
  set(t, e) {
    for (let s = 0; s < this.elements.length; s++)
      this.elements[s].name === t && (this.elements[s].resource = e);
  }
  remove(t) {
    for (let e = 0; e < this.elements.length; e++)
      this.elements[e].name === t && this.elements.splice(e, 1);
  }
  getResourceName(t) {
    for (let e = 0; e < this.elements.length; e++)
      if (t === this.elements[e].resource)
        return this.elements[e].name;
    return null;
  }
  get(t) {
    for (let e = 0; e < this.elements.length; e++)
      if (this.elements[e].name === t) return this.elements[e].resource;
    for (let e = 0; e < this.elements.length; e++)
      if (this.elements[e].resource instanceof V && this.elements[e].resource.items[t])
        return this.elements[e].resource;
    return null;
  }
  initFromObject(t) {
    let e = t, s = !1;
    t instanceof Array && (s = !0, e = t[0]), ue.parse(e, "bindgroup");
    const i = [];
    let n = 0, r;
    for (let a in e)
      r = e[a], r && (r.createGpuResource || r instanceof H || r instanceof ne) && (i[n++] = this.add(a, r));
    if (s)
      for (let a = 0; a < t.length; a++)
        this.createInstance(t[a]);
    return i;
  }
  //---------------------------------------------------------------------------
  clearAfterDeviceLost() {
    this._layout = null, this._group = null, this.setupApplyCompleted = !1;
    for (let t = 0; t < this.elements.length; t++)
      this.elements[t].resource.destroyGpuResource();
    if (this.instances) {
      let t, e, s;
      for (let i = 0; i < this.instances.length; i++) {
        s = this.instances[i], s.group = void 0, t = s.elements, s.indexBuffer && s.indexBuffer.createGpuResource();
        for (let n = 0; n < t.length; n++)
          e = t[n].resource, e.gpuResource && e.destroyGpuResource();
      }
    }
  }
  buildLayout() {
    this.deviceId = m.deviceId, this.io_index = 0;
    const t = { entries: [] };
    let e = 0, s;
    for (let i = 0; i < this.elements.length; i++) {
      if (s = this.elements[i].resource, s instanceof E && !s.io && this.parent.pipeline.type != "compute") continue;
      let n = s.createBindGroupLayoutEntry(e++);
      t.entries.push(n);
    }
    this._layout = m.device.createBindGroupLayout(t);
  }
  build() {
    (!this._layout || this.deviceId != m.deviceId && this.ioGroups) && this.buildLayout(), this.deviceId = m.deviceId;
    let t = [], e = 0, s;
    for (let i = 0; i < this.elements.length; i++) {
      if (!this.elements[i] || (s = this.elements[i].resource, s.update(), s instanceof E && !s.io && this.parent.pipeline.type != "compute")) continue;
      let n = s.createBindGroupEntry(e++);
      t.push(n);
    }
    if (this._group = m.device.createBindGroup({ layout: this._layout, entries: t }), !this.setupApplyCompleted && this.parent && (this.setupApplyCompleted = !0, this.setupApply(), this.instanceResourcesArray)) {
      for (let i = 0; i < this.instanceResourcesArray.length; i++)
        this._createInstance(this.instanceResourcesArray[i]);
      this.instanceResourcesArray = void 0;
    }
    return this._group;
  }
  setupApply() {
    this.bindgroupId = this.parent.groups.indexOf(this);
    const t = this.parent.resources.types;
    if (!t) return;
    const e = t.vertexBuffers;
    if (!e) return;
    const s = (a) => {
      if (this.instances) {
        for (let o = 0; o < e.length; o++)
          if (e[o].resource.nane === a.name) return o;
      } else
        for (let o = 0; o < e.length; o++)
          if (e[o].resource === a) return o;
      return -1;
    };
    this.vertexBuffers = [], this.vertexBufferReferenceByName = {};
    let i = 0, n, r;
    for (let a = 0; a < this.elements.length; a++)
      if (n = this.elements[a], r = n.resource, r instanceof E) {
        if (!r.io) {
          r.bufferId = s(r), this.elementByName[n.name] = r, this.vertexBufferReferenceByName[n.name] = { bufferId: r.bufferId, resource: r }, this.vertexBuffers[i++] = r;
          continue;
        }
      } else
        this.elementByName[n.name] = r;
  }
  setupDraw(t = !1) {
    if (this.vertexBuffers)
      for (let e = 0; e < this.vertexBuffers.length; e++)
        this.vertexBuffers[e].gpuResource || this.vertexBuffers[e].createGpuResource();
    if (this.parent.drawConfig && (this.indexBuffer = this.parent.drawConfig.indexBuffer, t || !this.indexBuffer && this.parent.drawConfig.vertexCount <= 0)) {
      if (!t && !this.parent.resources.types.vertexBuffers)
        throw new Error("a renderPipeline require a vertexBuffer or a drawConfig object in order to draw. You must add a vertexBuffer or call RenderPipeline.setupDraw");
      const e = this.parent.resources.types.vertexBuffers;
      let s;
      for (let i = 0; i < e.length; i++)
        if (s = e[i].resource, s.descriptor.stepMode === "vertex") {
          this.parent.drawConfig.vertexCount = this.parent.resources.types.vertexBuffers[i].resource.nbVertex;
          break;
        }
    }
  }
  apply(t) {
    if (this.setupDrawCompleted || (this.setupDrawCompleted = !0, this.bindgroupId === void 0 && (this.bindgroupId = this.parent.groups.indexOf(this)), this.setupDraw()), t instanceof GPUComputePassEncoder) {
      this.update(this.parent.pipeline), t.setBindGroup(this.bindgroupId, this.group);
      return;
    }
    const e = this.instances ? this.instances : [{ group: this.group, update: () => {
    } }], s = this.applyDraw;
    for (let i = 0; i < e.length; i++) {
      if (e[i].update(), this.update(this.parent.pipeline), t.setBindGroup(this.bindgroupId, e[i].group), this.vertexBuffers) {
        let n;
        for (let r = 0; r < this.vertexBuffers.length; r++)
          n = this.vertexBuffers[r].getCurrentBuffer(), t.setVertexBuffer(this.vertexBuffers[r].bufferId, n);
      }
      s && this.parent.drawConfig.draw(t);
    }
  }
  get useInstances() {
    return !!this.instances || !!this.instanceResourcesArray;
  }
  createInstance(t) {
    this.instanceResourcesArray || (this.instanceResourcesArray = []), this.instanceResourcesArray.push(t);
  }
  _createInstance(t) {
    t = ue.parse(t, "bindgroup"), this.instances || (this.instances = []);
    let e, s = [], i = {
      elements: this.elements.concat()
    }, n, r;
    for (let a = 0; a < this.elements.length; a++) {
      n = this.elements[a];
      for (let o in t) {
        if (r = t[o], r instanceof De) {
          e = t[o];
          continue;
        }
        n.name === o && (r instanceof Q || r instanceof R || (r.descriptor = n.resource.descriptor), r.gpuResource || r.createGpuResource(), n.resource instanceof E && (r.bufferId = n.resource.bufferId, s.indexOf(r) === -1 && s.push(r)), i.elements[a] = { name: o, resource: r });
      }
    }
    e && (i.indexBuffer = e), i.update = () => {
      let a = !1;
      for (let o = 0; o < this.elements.length; o++)
        if (this.elements[o].resource.mustBeTransfered) {
          this.elements[o].resource.update(this.parent.pipeline), a = !0;
          break;
        }
      this.elements = i.elements, this.vertexBuffers = s, (a || !i.group) && (i.group = this.build()), i.indexBuffer && (this.parent.drawConfig.indexBuffer = i.indexBuffer);
    }, t._object = i, this.instances.push(i);
  }
  handleComputePipelineResourceIOs() {
    if (this.resourcesIOs.length) {
      let t = [], e = [];
      for (let s = 0; s < this.resourcesIOs.length; s++)
        this.resourcesIOs[s] instanceof H ? (t[s] = this.resourcesIOs[s].buffers[0], e[s] = this.resourcesIOs[s].buffers[1]) : (t[s] = this.resourcesIOs[s].textures[0], e[s] = this.resourcesIOs[s].textures[1]), t[s].createGpuResource(), e[s].createGpuResource();
      this.createPingPongBindgroup(t, e);
    }
  }
  swapElements() {
    let t = this.elements.concat(), e;
    for (let s = 0; s < this.elements.length; s += 2)
      e = t[s], t[s] = t[s + 1], t[s + 1] = e;
    return t;
  }
  createPingPongBindgroup(t, e) {
    const s = new Y();
    s.name = this.name, s.mustRefreshBindgroup = this.mustRefreshBindgroup = !0, s._layout = this.layout, s.elements = this.swapElements();
    let i, n;
    for (let r = 0; r < t.length; r++)
      if (i = t[r], n = e[r], i instanceof E) {
        const a = [i.buffer, n.buffer];
        a[0].debug = 1, a[1].debug = 2, i.initBufferIO(a);
      } else if (i instanceof R) {
        i.gpuResource || i.createGpuResource(), n.gpuResource || n.createGpuResource();
        const a = [i.gpuResource, n.gpuResource];
        try {
          a[0].debug = 1, a[1].debug = 2;
        } catch {
        }
        i.initTextureIO(a);
      }
    return this.ioGroups = [s, this], this.debug = 1, s.debug = 2, s;
  }
  handleRenderPipelineResourceIOs() {
    if (this.renderPipelineimageIO) {
      this.renderPipelineimageIO.initIO();
      return;
    } else if (this.renderPipelineBufferIO) {
      this.renderPipelineBufferIO.initIO();
      return;
    }
    let t, e, s = [], i = [], n = this.parent.resources, r = !1, a = !1;
    for (let o = 0; o < this.elements.length; o++)
      if (t = this.elements[o].resource, t instanceof E) {
        if (t.io === 1) {
          e = this.elements[o].name, n[e] = void 0, n[e + "_out"] = void 0, s.push(t), s.push(this.elements[o + 1].resource), this.elements.splice(o, 2), r = !0;
          break;
        }
      } else if (t instanceof R && t.io === 1) {
        e = this.elements[o].name, n[e] = void 0, n[e + "_out"] = void 0, i.push(t), i.push(this.elements[o + 1].resource), this.elements.splice(o, 2), a = !0;
        break;
      }
    if (r) {
      const o = s[0].attributeDescriptor, f = s[0].descriptor.stepMode, l = new E(o, { stepMode: f });
      this.elements.push({ name: e, resource: l });
      let h = n.types.vertexBuffers, c = [];
      for (let g = 0; g < h.length; g++)
        h[g].resource.io || c.push(h[g]);
      c.push({ name: e, resource: l }), n[e] = l, n.types.vertexBuffers = c, l.initIO = () => {
        l.initBufferIO([s[0].buffer, s[1].buffer]);
      }, l.initIO(), this.renderPipelineBufferIO = l;
    } else if (a) {
      const o = new R({ source: i[0].gpuResource });
      this.elements.push({ name: e, resource: o });
      let f = n.types.imageTextures, l = [];
      for (let h = 0; h < f.length; h++)
        f[h].resource.io || l.push(f[h]);
      l.push({ name: e, resource: o }), n[e] = o, n.types.imageTextures = f, o.initIO = () => {
        o.source = i[0].texture, o.initTextureIO([i[0].texture, i[1].texture]);
      }, o.initIO(), this.renderPipelineimageIO = o;
    }
  }
  get pingPongBindgroup() {
    return this._pingPongBindgroup;
  }
  get layout() {
    return this._layout || this.buildLayout(), this._layout;
  }
  get group() {
    if ((!this._group || this.mustRefreshBindgroup) && this.build(), this.ioGroups) {
      const t = this.ioGroups[this.io_index++ % 2];
      return t._group || t.build(), t._group;
    }
    return this._group;
  }
  update(t) {
    for (let e = 0; e < this.elements.length; e++)
      this.elements[e].resource.update(t);
  }
  destroy() {
    for (let t = 0; t < this.elements.length; t++)
      this.elements[t].resource.destroyGpuResource();
    this.elements = [];
  }
}
class pe {
  constructor(t = "", e = !1) {
    u(this, "enabled", !0);
    u(this, "executeSubNodeAfterCode", !0);
    u(this, "_text");
    u(this, "insideMainFunction");
    u(this, "_nodeByName", {});
    u(this, "subNodes");
    this.text = t, this.insideMainFunction = e;
  }
  get nodeByName() {
    return this._nodeByName;
  }
  get text() {
    return this._text;
  }
  set text(t) {
    const e = t.split(`
`);
    let s, i = 99999999;
    if (e.length > 1) {
      for (let n = 0; n < e.length; n++) {
        s = e[n];
        for (let r = 0; r < s.length; r++)
          if (s[r] !== `
` && s[r] !== " ") {
            i > r && (i = r);
            break;
          }
      }
      this.insideMainFunction && i >= 3 && (i -= 3);
      for (let n = 0; n < e.length; n++)
        e[n] = e[n].slice(i);
      t = e.join(`
`);
    }
    this._text = t;
  }
  replaceValues(t) {
    for (let e = 0; e < t.length; e++)
      this.replaceKeyWord(t[e].old, t[e].new);
  }
  replaceKeyWord(t, e) {
    const s = new RegExp(`(?<=[^\\w.])\\b${t}\\b`, "g");
    this._text = this._text.replace(s, e);
  }
  get value() {
    let t = "";
    if (this.executeSubNodeAfterCode && (t += this.text + `
`), this.subNodes)
      for (let e = 0; e < this.subNodes.length; e++)
        t += this.subNodes[e].value + `
`;
    return this.executeSubNodeAfterCode || (t += this.text + `
`), t;
  }
  createNode(t = "") {
    const e = new pe(t);
    return this.subNodes || (this.subNodes = []), this.subNodes.push(e), e;
  }
  addNode(t, e = "") {
    const s = this.createNode(e);
    return this._nodeByName[t] = s, s;
  }
}
class Oe {
  constructor(t) {
    u(this, "inputs", []);
    u(this, "outputs", []);
    u(this, "export", []);
    u(this, "require", []);
    u(this, "pipelineConstants", {});
    u(this, "constants");
    u(this, "main");
    u(this, "shaderType");
    u(this, "debugLogs", []);
    u(this, "debugRenders", []);
    u(this, "_shaderInfos");
    this.shaderType = t, this.constants = new pe(), this.main = new pe("", !0);
  }
  /*
      public extractDebugInfo(shaderCode: string): string {
          const { code, debugLogs, debugRenders } = ShaderStage.extractDebugInfo(shaderCode);
          this.debugLogs = debugLogs;
          this.debugRenders = debugRenders;
          return code;
      }
  
      public static extractDebugInfo(code: string): {
          code: string,
          debugLogs: any[],
          debugRenders: any[]
      } {
  
          const result: any = {};
          result.debugLogs = [];
          result.debugRenders = [];
  
          const cut = (s: string) => {
              let id;
              for (let i = s.length - 1; i > -1; i--) {
                  if (s[i] === ",") {
                      id = i;
                      break;
                  }
              }
  
              return {
                  label: s.slice(0, id),
                  val: s.slice(id + 1)
              }
  
          }
  
          const extractDebug = (line: string) => {
              let s: string = line.split("XGPU.debug(")[1].split(");")[0];
  
              //const { label, val } = cut(s);
              //console.log("A = ", label);
              //console.log("B = ", val);
              result.debugLogs.push(cut(s));
          }
          const extractDebugRender = (line: string) => {
              //XGPU.renderDebug("testC : ",output.position,vec4(0.0,0.0,1.0,1.0));
              let s: string = line.split("XGPU.renderDebug(")[1].split(");")[0];
              let t = s.split(",vec4")
              let color = "vec4" + t[1];
              s = t[0];
  
              //const { label, val } = cut(s);
              //console.log("A = ", label);
              //console.log("B = ", val);
              //console.log("C = ", color);
  
              result.debugRenders.push({
                  ...cut(s),
                  color
              })
  
          }
  
  
          const lines: string[] = code.split("\n");
          const newLines: string[] = [];
          for (let i = 0; i < lines.length; i++) {
              if (lines[i].includes("XGPU.debug")) {
                  extractDebug(lines[i])
              } else if (lines[i].includes("XGPU.renderDebug")) {
                  extractDebugRender(lines[i]);
              } else {
                  newLines.push(lines[i]);
              }
          }
  
          result.code = newLines.join("\n");
  
          return result;
  
  
      }*/
  unwrapVariableInMainFunction(t) {
    const e = t.split(`
`);
    let s, i = [];
    for (let a = 0; a < e.length; a++) {
      if (e[a] = s = e[a].split("	").join("").trim().slice(4), !s.length) continue;
      let o = s.split(" = "), f = o[0].split(":")[0], l = o[1].slice(0, o[1].length - 1);
      i.push({
        varName: f,
        otherName: l
      });
    }
    const n = (a, o, f) => {
      const l = new RegExp(`(?<=[^\\w.])\\b${o}\\b`, "g");
      return a.replace(l, f);
    };
    let r = this.main.value + "";
    for (let a = 0; a < i.length; a++)
      r = n(r, i[a].varName, i[a].otherName);
    return r;
  }
  unwrapVariableInWGSL(t, e) {
    const s = t.split(`
`);
    let i, n = [];
    for (let a = 0; a < s.length; a++) {
      if (s[a] = i = s[a].split("	").join("").trim().slice(4), !i.length) continue;
      let o = i.split(" = "), f = o[0].split(":")[0], l = o[1].slice(0, o[1].length - 1);
      n.push({
        varName: f,
        otherName: l
      });
    }
    const r = (a, o, f) => {
      const l = new RegExp(`(?<=[^\\w.])\\b${o}\\b`, "g");
      return a.replace(l, f);
    };
    for (let a = 0; a < n.length; a++)
      e = r(e, n[a].varName, n[a].otherName);
    return e;
  }
  addOutputVariable(t, e) {
    this.outputs.push({ name: t, type: e.type });
  }
  addInputVariable(t, e) {
    this.outputs.push({ name: t, type: e.type, builtin: e.builtin });
  }
  formatWGSLCode(t) {
    const e = t.split(`
`);
    let s = 0, i = [];
    for (let o = 0; o < 16; o++)
      o == 0 ? i[o] = "" : i[o] = i[o - 1] + "	";
    const n = [];
    var r, a = !0;
    for (let o = 0; o < e.length; o++)
      r = e[o].trim(), r.includes("}") && s--, (r != "" || !a) && (a = r == "", n.push(i[s] + r)), e[o].includes("{") && s++;
    return n.join(`
`);
  }
  get shaderInfos() {
    return this._shaderInfos;
  }
  build(t, e) {
    return this._shaderInfos ? this._shaderInfos : (this._shaderInfos = { code: "", output: null }, this._shaderInfos);
  }
}
class Be extends Oe {
  constructor() {
    super("fragment");
  }
  build(t, e) {
    if (this._shaderInfos) return this._shaderInfos;
    let s = "";
    const i = t.bindGroups.getVertexShaderDeclaration(!0);
    s += i.result;
    for (let o = 0; o < this.inputs.length; o++)
      e.addProperty(this.inputs[o]);
    this.outputs.length === 0 && (this.outputs[0] = { name: "color", ...b.fragmentOutputs.color });
    const n = new z("Output", this.outputs);
    s += n.struct + `
`;
    let r = this.unwrapVariableInWGSL(i.variables, this.constants.value);
    s += r + `

`;
    let a = this.unwrapVariableInWGSL(i.variables, this.main.value);
    return s += `@fragment
`, s += "fn main(" + e.getFunctionParams() + ") -> " + n.name + `{
`, s += `   var output:Output;
`, s += a, s += `   return output;
`, s += `}
`, s = this.formatWGSLCode(s), m.showFragmentShader && (console.log("------------- FRAGMENT SHADER --------------"), console.log(s), console.log("--------------------------------------------")), this._shaderInfos = { code: s, output: n }, this._shaderInfos;
  }
}
class Ie extends Oe {
  //public keepRendererAspectRatio: boolean = true;
  constructor() {
    super("vertex");
  }
  build(t, e) {
    let s = "";
    const i = t.bindGroups.getVertexShaderDeclaration();
    s += i.result, s += e.getComputeVariableDeclaration();
    let n = !1;
    for (let f = 0; f < this.outputs.length; f++)
      this.outputs[f].builtin === b.vertexOutputs.position.builtin && (n = !0);
    n || this.outputs.unshift({ name: "position", ...b.vertexOutputs.position });
    let r = new z("Output", [...this.outputs]);
    s += r.struct + `
`;
    let a = this.unwrapVariableInWGSL(i.variables, this.constants.value);
    s += a + `

`;
    let o = this.unwrapVariableInWGSL(i.variables, this.main.value);
    return s += `@vertex
`, s += "fn main(" + e.getFunctionParams() + ") -> " + r.name + `{
`, s += `   var output:Output;
`, s += o, s += `   return output;
`, s += `}
`, s = this.formatWGSLCode(s), m.showVertexShader && (console.log("------------- VERTEX SHADER --------------"), console.log(s), console.log("------------------------------------------")), this._shaderInfos = { code: s, output: r }, this._shaderInfos;
  }
}
class Se extends Z {
  constructor(e) {
    super();
    u(this, "descriptor");
    u(this, "gpuResource", null);
    u(this, "_view", null);
    u(this, "deviceId");
    u(this, "time");
    e.usage === void 0 && (e.usage = GPUTextureUsage.RENDER_ATTACHMENT), e.sampleCount === void 0 && e.format !== "depth32float" && (e.sampleCount = 1), e.label === void 0 && (e.label = "Texture"), this.descriptor = e;
  }
  get sampleCount() {
    return this.descriptor.sampleCount;
  }
  get format() {
    return this.descriptor.format;
  }
  get size() {
    return this.descriptor.size;
  }
  get usage() {
    return this.descriptor.usage;
  }
  get view() {
    return this._view || this.create(), this._view;
  }
  destroy() {
    this.gpuResource && (this.gpuResource.xgpuObject = null, this.gpuResource.destroy()), this.gpuResource = null, this._view = null;
  }
  create() {
    this.time = (/* @__PURE__ */ new Date()).getTime(), !(m.loseDeviceRecently && this.deviceId === m.deviceId) && (this.gpuResource && (this.gpuResource.xgpuObject = null, this.gpuResource.destroy()), this.deviceId = m.deviceId, this.gpuResource = m.device.createTexture(this.descriptor), this.gpuResource.xgpuObject = this, this.createView());
  }
  createGpuResource() {
    this.create();
  }
  update() {
    this.deviceId !== m.deviceId && this.create();
  }
  createView() {
    this.gpuResource || this.create(), this._view = this.gpuResource.createView();
  }
  resize(e, s) {
    this.descriptor.size = [e, s], this.create();
  }
}
class fe extends Se {
  constructor(e, s = null, i = null) {
    e.format === void 0 && (e.format = "depth24plus"), e.sampleCount === void 0 && (e.sampleCount = 1);
    super(e);
    /*
    When you apply a shadow to a renderPipeline , you actually create a ShadowPipeline that store information in the DepthStencilTexture.
    This texture is then used as IShaderResource in the renderPipeline. 
    Because it can be an IShaderResource , we must implement the IShaderResource interface
    */
    u(this, "_isDepthTexture", !1);
    u(this, "_description");
    u(this, "_attachment");
    //--------------------------------- IShaderResource ---------------------------------------------------------
    u(this, "mustBeTransfered", !1);
    u(this, "_visibility", GPUShaderStage.FRAGMENT);
    this.createGpuResource(), s || (s = {
      depthWriteEnabled: !0,
      depthCompare: "less",
      format: this.gpuResource.format
    }), this._description = { format: this.gpuResource.format, ...s }, this._attachment = {
      view: this._view,
      depthClearValue: 1,
      depthLoadOp: "clear",
      depthStoreOp: "store"
    }, e.format === "depth24plus-stencil8" ? (this._attachment.stencilClearValue = 0, this._attachment.stencilLoadOp = "clear", this._attachment.stencilStoreOp = "store") : e.format === "depth32float" && (this._isDepthTexture = !0);
    for (let n in i)
      this._attachment[n] = i[n];
  }
  get description() {
    return this._description;
  }
  get attachment() {
    return this._attachment;
  }
  get isDepthTexture() {
    return this._isDepthTexture;
  }
  setPipelineType(e) {
    e === "render" ? this._visibility = GPUShaderStage.FRAGMENT : e === "compute_mixed" ? this._visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE : e === "compute" && (this._visibility = GPUShaderStage.COMPUTE);
  }
  createBindGroupEntry(e) {
    return {
      binding: e,
      resource: this._view
    };
  }
  createBindGroupLayoutEntry(e) {
    return {
      binding: e,
      visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX,
      texture: {
        sampleType: "depth"
      }
    };
  }
  createDeclaration(e, s, i) {
    return "@binding(" + s + ") @group(" + i + ") var " + e + `:texture_depth_2d;
`;
  }
  createGpuResource() {
    this.create();
  }
  destroyGpuResource() {
    this.gpuResource && (this._view = null, this.gpuResource.destroy(), this.gpuResource = null, this.create());
  }
  resize(e, s) {
    super.resize(e, s), this._attachment.view = this._view;
  }
  clone() {
    return new fe(this.descriptor);
  }
}
class Re extends J {
  constructor(t) {
    if (t = { ...t }, t.source && (t.source.length === 0 || t.source.length % 6 !== 0))
      throw new Error("CubeMapTextureArray error : descriptor.source must contains an array of (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) with a length greater than 0 and multiple of 6.");
    t.dimension || (t.dimension = "2d"), t.usage === void 0 && (t.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT), super(t), t.source && (this.bitmaps = t.source);
  }
  clone() {
    return this.descriptor.source || (this.descriptor.source = this._bitmaps), new Re(this.descriptor);
  }
  set bitmaps(t) {
    if (t.length === 0 || t.length % 6 !== 0)
      throw new Error("CubeMapTextureArray error : descriptor.source must contains an array of (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) with a length greater than 0 and multiple of 6.");
    for (let e = 0; e < t.length; e++)
      this._bitmaps[e] = t[e], this.mustUpdate[e] = !0;
    this.mustBeTransfered = !0, this.update();
  }
  get bitmaps() {
    return this._bitmaps;
  }
  setCubeSideById(t, e, s) {
    this._bitmaps[t * 6 + e] instanceof ImageBitmap && this._bitmaps[t * 6 + e].close(), this._bitmaps[t * 6 + e] = s, this.mustUpdate[t * 6 + e] = !0, this.mustBeTransfered = !0;
  }
  createGpuResource() {
    this.gpuResource && this.gpuResource.destroy(), this.gpuResource = m.device.createTexture(this.descriptor), this._view = this.gpuResource.createView({ dimension: "cube-array", arrayLayerCount: this._bitmaps.length });
  }
  //-----
  createDeclaration(t, e, s = 0) {
    return "@binding(" + e + ") @group(" + s + ") var " + t + ":texture_cube_array<" + this.sampledType + `>;
`;
  }
  createBindGroupLayoutEntry(t) {
    let e = "float";
    return this.sampledType === "i32" ? e = "sint" : this.sampledType === "u32" && (e = "uint"), {
      binding: t,
      visibility: GPUShaderStage.FRAGMENT,
      texture: {
        sampleType: e,
        viewDimension: "cube-array",
        multisampled: !1
      }
    };
  }
  createBindGroupEntry(t) {
    return this.gpuResource || this.createGpuResource(), {
      binding: t,
      resource: this._view
    };
  }
  setPipelineType(t) {
  }
}
class st extends J {
  constructor(e, s = null) {
    if (e.format === void 0 && (e.format = "depth32float"), e.sampleCount === void 0 && (e.sampleCount = 1), e.source[0] instanceof fe)
      for (let i = 0; i < e.source.length; i++)
        e.source[i] = e.source[i].gpuResource;
    e.usage === void 0 && (e.usage = e.source[0].usage);
    super(e);
    u(this, "_description");
    u(this, "_attachment");
    u(this, "_visibility", GPUShaderStage.FRAGMENT);
    s || (s = {
      depthWriteEnabled: !0,
      depthCompare: "less",
      format: this.gpuResource.format
    }), this._description = { format: this.gpuResource.format, ...s };
  }
  get description() {
    return this._description;
  }
  get attachment() {
    return this._attachment;
  }
  setPipelineType(e) {
    e === "render" ? this._visibility = GPUShaderStage.FRAGMENT : e === "compute_mixed" ? this._visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE : e === "compute" && (this._visibility = GPUShaderStage.COMPUTE);
  }
  createBindGroupLayoutEntry(e) {
    let s = "float";
    return this.sampledType === "i32" ? s = "sint" : this.sampledType === "u32" && (s = "uint"), {
      binding: e,
      visibility: this._visibility,
      texture: {
        sampleType: s,
        viewDimension: "2d-array",
        multisampled: !1
      }
    };
  }
  get isDepthTexture() {
    return !0;
  }
  createDeclaration(e, s, i) {
    return "@binding(" + s + ") @group(" + i + ") var " + e + `:texture_depth_2d_array;
`;
  }
}
class le {
  constructor(t, e) {
    u(this, "pipeline");
    u(this, "parent");
    u(this, "groups", []);
    u(this, "_name");
    u(this, "temp");
    u(this, "_resources", {});
    this._name = e, this.pipeline = t;
  }
  get name() {
    return this._name;
  }
  clearAfterDeviceLost() {
    for (let t = 0; t < this.groups.length; t++)
      this.groups[t].clearAfterDeviceLost();
  }
  build(t = !1) {
    const e = {}, s = [], i = [];
    this.groups = this.groups.sort((o, f) => o.useInstances && !f.useInstances ? 1 : !o.useInstances && f.useInstances ? -1 : 0), this.groups.length ? this.groups[this.groups.length - 1].applyDraw = !0 : (this.groups[0] = new Y(), this.groups[0].parent = this, this.groups[0].applyDraw = !0);
    for (let o = 0; o < this.groups.length; o++)
      console.log(o, " group = ", this.groups[o]), t || (s[o] = this.groups[o].layout), i[o] = this.groups[o].group;
    t ? e.layout = "auto" : (console.log("pipelineLayout = ", s), e.layout = m.createPipelineLayout({ bindGroupLayouts: s }));
    const { vertexLayouts: n, buffers: r, nbVertex: a } = this.createVertexBufferLayout();
    return e.vertex = {
      buffers: n
    }, {
      description: e,
      bindgroups: i,
      buffers: r,
      nbVertex: a
    };
  }
  getBindgroupByResource(t) {
    let e, s;
    for (let i = 0; i < this.groups.length; i++) {
      e = this.groups[i];
      for (let n = 0; n < e.elements.length; n++)
        if (s = e.elements[n].resource, s === t) return e;
    }
    return null;
  }
  apply(t) {
    for (let e = 0; e < this.groups.length; e++)
      this.groups[e].apply(t);
  }
  update() {
    for (let t = 0; t < this.groups.length; t++)
      this.groups[t].update(this.pipeline);
  }
  getVertexShaderDeclaration(t = !1) {
    if (t) return this.temp;
    let e = "", s, i, n, r, a = 0;
    const o = { result: "", variables: "" };
    for (let f = 0; f < this.groups.length; f++) {
      s = this.groups[f], i = s.elements, a = 0;
      for (let l = 0; l < i.length; l++)
        if (n = i[l].resource, !(n instanceof E)) {
          if (r = i[l].name, n instanceof V) {
            const h = n.createStruct(r);
            o.variables += h.localVariables, e += h.struct;
          }
          e += n.createDeclaration(r, a++, f) + `
`;
        }
    }
    return o.result = e, this.temp = o, o;
  }
  getFragmentShaderDeclaration() {
    let t = "", e, s, i, n, r = 0;
    const a = { result: "", variables: "" };
    for (let o = 0; o < this.groups.length; o++) {
      e = this.groups[o], s = e.elements, r = 0;
      for (let f = 0; f < s.length; f++)
        if (i = s[f].resource, !(i instanceof E)) {
          if (n = s[f].name, i instanceof V) {
            let l;
            for (let h in i.items) {
              l = i.items[h];
              let c = n.substring(0, 1).toLowerCase() + n.slice(1);
              l.propertyNames && (t += l.createStruct() + `
`), l.createVariableInsideMain && (a.variables += l.createVariable(c) + `
`);
            }
            t += i.createStruct(n).struct + `
`;
          }
          t += i.createDeclaration(n, r++, o) + `
`;
        }
    }
    return a.result = t, a;
  }
  getComputeShaderDeclaration() {
    let t = "", e, s, i, n, r = 0;
    const a = { result: "", variables: "" };
    for (let o = 0; o < this.groups.length; o++) {
      e = this.groups[o], s = e.elements, r = 0;
      for (let f = 0; f < s.length; f++) {
        if (i = s[f].resource, n = s[f].name, !(i instanceof E)) {
          if (i instanceof V) {
            let h;
            for (let g in i.items) {
              h = i.items[g];
              let d = n.substring(0, 1).toLowerCase() + n.slice(1);
              h.createVariableInsideMain && (a.variables += h.createVariable(d) + `
`);
            }
            const c = i.createStruct(n).struct + `
`;
            t += c;
          }
        }
        const l = i.createDeclaration(n, r++, o) + `
`;
        t += l;
      }
    }
    return a.result = t, a;
  }
  createVertexBufferLayout() {
    const t = [], e = [];
    let s, i, n, r = 0, a = 0, o = 0;
    for (let f = 0; f < this.groups.length; f++) {
      s = this.groups[f], i = s.elements;
      for (let l = 0; l < i.length; l++)
        n = i[l].resource, n instanceof E && (o = Math.max(o, n.nbVertex), e[r] = n, t[r++] = n.createVertexBufferLayout(a), a += n.vertexArrays.length);
    }
    return {
      vertexLayouts: t,
      buffers: e,
      nbVertex: o
    };
  }
  handleRenderPipelineResourceIOs() {
    for (let t = 0; t < this.groups.length; t++)
      this.groups[t].handleRenderPipelineResourceIOs();
  }
  handleComputePipelineResourceIOs() {
    for (let t = 0; t < this.groups.length; t++)
      this.groups[t].handleComputePipelineResourceIOs();
  }
  get resources() {
    return this._resources;
  }
  add(t) {
    t.parent = this;
    let e = this._resources;
    this._resources.all || (this._resources.all = []), this._resources.types || (this._resources.types = {});
    const s = this._resources.types, i = (r, a) => {
      let o, f;
      for (let l = 0; l < a.length; l++)
        o = a[l], !r[o.name] && (f = o.resource, this._resources.all.indexOf(f) === -1 && this._resources.all.push(f), r[o.name] = o.resource, f instanceof st ? (s.depthTextureArrays || (s.depthTextureArrays = []), s.depthTextureArrays.indexOf(o) === -1 && s.depthTextureArrays.push(o)) : f instanceof Re ? (s.cubeMapTextureArrays || (s.cubeMapTextureArrays = []), s.cubeMapTextureArrays.indexOf(o) === -1 && s.cubeMapTextureArrays.push(o)) : f instanceof J ? (s.imageTextureArrays || (s.imageTextureArrays = []), s.imageTextureArrays.indexOf(o) === -1 && s.imageTextureArrays.push(o)) : f instanceof V ? (s.uniformBuffers || (s.uniformBuffers = []), s.uniformBuffers.indexOf(o) === -1 && s.uniformBuffers.push(o)) : f instanceof E ? (s.vertexBuffers || (s.vertexBuffers = []), s.vertexBuffers.indexOf(o) === -1 && s.vertexBuffers.push(o)) : f instanceof ve ? (s.cubeMapTexture || (s.cubeMapTexture = []), s.cubeMapTexture.indexOf(o) === -1 && s.cubeMapTexture.push(o)) : f instanceof R ? (s.imageTextures || (s.imageTextures = []), s.imageTextures.indexOf(o) === -1 && s.imageTextures.push(o)) : f instanceof Q ? (s.videoTexture || (s.videoTexture = []), s.videoTexture.indexOf(o) === -1 && s.videoTexture.push(o)) : f instanceof he ? (s.sampler || (s.sampler = []), s.sampler.indexOf(o) === -1 && s.sampler.push(o)) : f instanceof fe && (s.depthStencilTextures || (s.depthStencilTextures = []), s.depthStencilTextures.indexOf(o) === -1 && s.depthStencilTextures.push(o)));
    }, n = (r) => {
      const a = e[r.name] = {};
      a.types || (a.types = {}), i(a, r.elements), this.groups.push(r);
    };
    if (t instanceof Y)
      this.groups.indexOf(t) === -1 ? n(t) : i(e[t.name], t.elements);
    else {
      t.pipeline = this.pipeline, e = e[t.name] = {};
      let r;
      for (let a = 0; a < t.groups.length; a++)
        r = t.groups[a], this.groups.indexOf(r) === -1 && n(r);
    }
    return t;
  }
  copy(t) {
    const e = new le(this.pipeline, this._name), s = this.groups.concat();
    if (t)
      for (let i = 0; i < t.oldGroups.length; i++)
        s.splice(s.indexOf(t.oldGroups[i]), 1, t.replacedGroup[i]);
    return e.groups = s, e;
  }
  propertyNameIsUsed(t) {
    for (let e = 0; e < this.groups.length; e++)
      if (this.groups[e].get(t)) return !0;
    return !1;
  }
  get(t) {
    let e;
    for (let s = 0; s < this.groups.length; s++)
      if (e = this.groups[s].get(t), e) return e;
    return null;
  }
  getGroupByPropertyName(t) {
    let e;
    for (let s = 0; s < this.groups.length; s++)
      if (e = this.groups[s].get(t), e) return this.groups[s];
    return null;
  }
  getGroupByName(t) {
    for (let e = 0; e < this.groups.length; e++)
      if (this.groups[e].name === t) return this.groups[e];
    return null;
  }
  getNameByResource(t) {
    if (t instanceof O || t instanceof P || t instanceof D)
      return t.name;
    let e;
    for (let s = 0; s < this.groups.length; s++) {
      e = this.groups[s].elements;
      for (let i = 0; i < e.length; i++)
        if (e[i].resource === t)
          return e[i].name;
    }
    return null;
  }
  setupDraw(t = !1) {
    for (let e = 0; e < this.groups.length; e++)
      this.groups[e].setupDrawCompleted || this.groups[e].setupDraw(t);
  }
  get drawConfig() {
    return this.pipeline.drawConfig || null;
  }
  get current() {
    return this.groups[this.groups.length - 1];
  }
  destroy() {
    for (let t = 0; t < this.groups.length; t++)
      this.groups[t].destroy(), this.groups[t] = void 0;
    this.groups = [], this._resources = {};
  }
}
class ze extends Z {
  constructor() {
    super();
    u(this, "description", {});
    u(this, "nbVertex");
    u(this, "bindGroups");
    u(this, "vertexBuffers");
    u(this, "vertexShader");
    u(this, "fragmentShader");
    u(this, "vertexBufferLayouts");
    u(this, "gpuBindgroups", []);
    u(this, "gpuBindGroupLayouts", []);
    u(this, "gpuPipelineLayout");
    u(this, "type", null);
    u(this, "_resources");
    u(this, "debug");
    u(this, "pipelineCount", 1);
    this.bindGroups = new le(this, "pipeline");
  }
  get isComputePipeline() {
    return this.type === "compute" || this.type === "compute_mixed";
  }
  get isRenderPipeline() {
    return this.type === "render";
  }
  get isMixedPipeline() {
    return this.type === "compute_mixed";
  }
  get resources() {
    return this._resources;
  }
  clearAfterDeviceLostAndRebuild() {
    this.bindGroups.clearAfterDeviceLost(), this.vertexBufferLayouts = void 0, this.gpuPipelineLayout = void 0, this.gpuBindGroupLayouts = [], this.gpuBindgroups = [];
  }
  initFromObject(e) {
    this._resources = e;
  }
  static getResourceDefinition(e) {
    const s = {};
    let i;
    for (let n in e)
      i = e[n], s[i.name] = i;
    return s;
  }
  addBindgroup(e) {
    this.bindGroups.add(e);
  }
  createVertexBufferLayout() {
    this.vertexBufferLayouts = [], this.vertexBuffers = [];
    const e = this.bindGroups.groups;
    let s, i, n = 0, r = 0;
    for (let a = 0; a < e.length; a++) {
      s = e[a].elements;
      for (let o = 0; o < s.length; o++)
        i = s[o].resource, i instanceof E && (this.vertexBuffers[r] = i, this.vertexBufferLayouts[r++] = i.createVertexBufferLayout(n), n += i.vertexArrays.length);
    }
    return this.vertexBufferLayouts;
  }
  createShaderInput(e, s) {
    const i = new z("Input", e.inputs);
    if (s) {
      let n, r = 0;
      for (let a = 0; a < s.length; a++) {
        n = s[a].vertexArrays;
        for (let o = 0; o < n.length; o++)
          i.addProperty({ name: n[o].name, type: n[o].varType, builtin: "@location(" + r + ")" }), r++;
      }
    }
    return i;
  }
  createLayouts() {
    this.gpuBindGroupLayouts = [], this.gpuBindgroups = [], this.gpuPipelineLayout = null;
    const e = this.bindGroups.groups;
    let s, i, n, r, a, o = 0;
    for (let f = 0; f < e.length; f++) {
      s = e[f].elements, n = { entries: [] }, r = { entries: [], layout: null }, a = 0;
      for (let l = 0; l < s.length; l++)
        i = s[l].resource, (!(i instanceof E) || this.isComputePipeline) && (n.entries[a] = i.createBindGroupLayoutEntry(a), r.entries[a] = i.createBindGroupEntry(a), console.log(a, " AAAAA layout.entries ", n.entries[a]), console.log(a, " AAAAA group.entries ", r.entries[a]), a++);
      a > 0 && (console.log(f, " layout : ", n, r), r.layout = this.gpuBindGroupLayouts[o] = m.createBindgroupLayout(n), this.gpuBindgroups[o] = m.createBindgroup(r), o++);
    }
    this.gpuPipelineLayout = m.createPipelineLayout({ bindGroupLayouts: this.gpuBindGroupLayouts });
  }
  initPipelineResources(e) {
    const s = this.bindGroups.resources.all;
    if (s)
      for (let i = 0; i < s.length; i++) s[i].setPipelineType(e.type);
  }
  build() {
    this.createVertexBufferLayout(), this.createLayouts();
  }
  update(e) {
  }
  getResourceName(e) {
    if (e instanceof I)
      if (this.type !== "render") {
        const s = e.vertexBuffer;
        return this.bindGroups.getNameByResource(s) + "." + e.name;
      } else
        return e.name;
    else
      return e.uniformBuffer ? this.bindGroups.getNameByResource(e.uniformBuffer) + "." + e.name : this.bindGroups.getNameByResource(e);
  }
  createPipelineInstanceArray(e, s) {
    this.pipelineCount = s;
    const i = [];
    let n, r, a;
    const o = [], f = [], l = [];
    for (let h = 0; h < e.length; h++) {
      r = e[h];
      const c = this.bindGroups.getNameByResource(r), g = this.bindGroups.getGroupByPropertyName(c);
      g.mustRefreshBindgroup = !0, o[h] = c, f[h] = g, (r instanceof O || r instanceof P || r instanceof D) && (l[h] = g.getResourceName(r.uniformBuffer));
    }
    for (let h = 0; h < s; h++) {
      i[h] = n = {}, a = {};
      for (let g = 0; g < e.length; g++) {
        r = e[g], r.update();
        const d = o[g], p = f[g];
        if (r instanceof O || r instanceof P || r instanceof D) {
          const y = l[g];
          a[y] || (a[y] = r.uniformBuffer.clone(), a[y].name = y), n[y] = a[y], n[y].name = a[y].name, n[y].bindgroup = p, n[d] = a[y].getUniformByName(d);
        } else
          n[d] = r.clone(), n[d].bindgroup = p, n[d].name = d;
      }
      const c = [];
      for (let g in n)
        r = n[g], r instanceof O || r instanceof P || r instanceof D || (r.setPipelineType(this.type), r.createGpuResource(), c.push(r));
      n.deviceId = m.deviceId, n.apply = () => {
        let g = !1;
        m.deviceId != n.deviceId && (g = !0, n.deviceId = m.deviceId);
        let d;
        for (let p = 0; p < c.length; p++)
          d = c[p], g && (d.destroyGpuResource(), d.createGpuResource()), d.update(), d.bindgroup.set(d.name, d);
        this.update();
      };
    }
    return i;
  }
}
class it extends Se {
  constructor(e) {
    e.format === void 0 && (e.format = m.getPreferredCanvasFormat()), e.usage === void 0 && (e.usage = GPUTextureUsage.RENDER_ATTACHMENT), e.sampleCount === void 0 && (e.sampleCount = 4), e.alphaToCoverageEnabled === void 0 && (e.alphaToCoverageEnabled = !1), e.mask === void 0 && (e.mask = 4294967295), e.resolveTarget === void 0 && (e.resolveTarget = null);
    super(e);
    u(this, "_description");
    this._description = {
      count: e.sampleCount,
      mask: e.mask,
      alphaToCoverageEnabled: e.alphaToCoverageEnabled
    };
  }
  get description() {
    return this._description;
  }
  create() {
    super.create();
  }
  get resolveTarget() {
    return this.descriptor.resolveTarget;
  }
}
const me = class me extends R {
  constructor(e, s) {
    s || (e.renderer ? s = { size: [e.renderer.width, e.renderer.height] } : s = { size: [1, 1] }), s.format || (s.format = m.getPreferredCanvasFormat()), s.usage || (s.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT), s.mipLevelCount || (s.mipLevelCount = 1), s.sampleCount || (s.sampleCount = 1), s.dimension || (s.dimension = "2d"), s.viewFormats || (s.viewFormats = []), s.label || (s.label = "RenderPassTexture");
    super(s);
    u(this, "ready", !1);
    u(this, "renderPipeline");
    u(this, "_mustUseCopyTextureToTexture", !1);
    u(this, "frameId", -1);
    e.renderer ? this.ready = !0 : (this.ready = !1, e.addEventListener(F.ON_ADDED_TO_RENDERER, () => {
      this.ready = !0, this.resize(e.renderer.width, e.renderer.height);
    }, !0)), this.renderPipeline = e, this.createGpuResource();
  }
  get mustUseCopyTextureToTexture() {
    return this._mustUseCopyTextureToTexture;
  }
  applyRenderPass(e) {
    if (this.renderPipeline === e) {
      this._mustUseCopyTextureToTexture = !0;
      return;
    } else if (!this.ready)
      if (e instanceof F && e.renderer)
        this.renderPipeline.renderer = e.renderer, this.ready = !0;
      else
        return;
    if (e instanceof F && e.renderer && (this.renderPipeline.renderer = e.renderer), this.frameId != this.renderPipeline.renderer.frameId) {
      const s = this.renderPipeline.renderer.commandEncoder;
      if (s) {
        this.frameId = this.renderPipeline.renderer.frameId, this.renderPipeline.pipeline || this.renderPipeline.buildGpuPipeline(), this.renderPipeline.update();
        const i = this.renderPipeline.beginRenderPass(s, this.view, 0, !0);
        for (let n = 0; n < this.renderPipeline.pipelineCount; n++)
          this.renderPipeline.dispatchEvent(F.ON_DRAW, n), this.renderPipeline.draw(i);
        this.renderPipeline.end(s, i);
      }
    }
  }
  resize(e, s) {
    return this.descriptor.size = [e, s], this.createGpuResource(), this.dispatchEvent(me.RESOURCE_CHANGED), this;
  }
  createBindGroupEntry(e) {
    return this.deviceId !== m.deviceId && (this.deviceId = m.deviceId, this.gpuResource = m.device.createTexture(this.descriptor), this._view = this.gpuResource.createView()), super.createBindGroupEntry(e);
  }
  get width() {
    return this.descriptor.size[0];
  }
  get height() {
    return this.descriptor.size[1];
  }
  get isRenderPass() {
    return !0;
  }
  update() {
  }
  get source() {
    return null;
  }
  set source(e) {
  }
};
u(me, "RESOURCE_CHANGED", "RESOURCE_CHANGED");
let we = me;
class rt {
  constructor(t) {
    u(this, "vertexCount", -1);
    u(this, "instanceCount", 1);
    u(this, "firstVertexId", 0);
    u(this, "firstInstanceId", 0);
    u(this, "baseVertex", 0);
    u(this, "indexBuffer");
    u(this, "pipeline");
    u(this, "setupDrawCompleted", !1);
    this.pipeline = t;
  }
  draw(t) {
    this.indexBuffer ? (t.setIndexBuffer(this.indexBuffer.gpuResource, this.indexBuffer.dataType, this.indexBuffer.offset, this.indexBuffer.getBufferSize()), t.drawIndexed(this.indexBuffer.nbPoint, this.instanceCount, this.firstVertexId, this.baseVertex, this.firstInstanceId)) : t.draw(this.vertexCount, this.instanceCount, this.firstVertexId, this.firstInstanceId);
  }
}
class Ue extends Oe {
  constructor() {
    super("compute");
  }
  build(t, e) {
    if (this._shaderInfos) return this._shaderInfos;
    let s = "";
    const i = t.bindGroups.getComputeShaderDeclaration();
    s += i.result + `

`;
    const n = t.workgroups;
    let r = this.unwrapVariableInWGSL(i.variables, this.constants.value);
    s += r + `

`;
    let a = this.unwrapVariableInWGSL(i.variables, this.main.value);
    return s += "@compute @workgroup_size(" + n[0] + "," + n[1] + "," + n[2] + `)
`, s += "fn main(" + e.getFunctionParams() + `) {
`, s += a, s += `}
`, this._shaderInfos = { code: s, output: null }, m.showComputeShader && setTimeout(() => {
      console.log("------------- COMPUTE SHADER --------------"), console.log(this.formatWGSLCode(this._shaderInfos.code)), console.log("-------------------------------------------");
    }, 100), this._shaderInfos;
  }
  static removeStructDefinitionAndReplaceStructDeclarationName(t, e, s) {
    const i = new RegExp(`struct\\s+${e}\\s*\\{[^}]*\\}`, "g");
    t = t.replace(i, "");
    const n = new RegExp(`\\b${e}\\b`, "g");
    return t = t.replace(n, s), t;
  }
}
const C = class C extends ze {
  constructor() {
    super();
    u(this, "computeShader");
    //public onReceiveData: (datas: Float32Array) => void;
    u(this, "gpuComputePipeline");
    u(this, "workgroups");
    u(this, "dispatchWorkgroup");
    u(this, "bufferSize");
    u(this, "textureSize");
    // [width,height]
    u(this, "stagingBuffer");
    u(this, "bufferIOs");
    u(this, "textureIOs");
    u(this, "onComputeBegin");
    u(this, "onComputeEnd");
    u(this, "onShaderBuild");
    u(this, "vertexBufferIOs", []);
    u(this, "imageTextureIOs", []);
    u(this, "resourceIOs", []);
    u(this, "nbVertexMax", 0);
    u(this, "widthMax", 0);
    u(this, "heightMax", 0);
    u(this, "deviceId");
    u(this, "lastFrameTime", -1);
    u(this, "rebuildingAfterDeviceLost", !1);
    u(this, "firstFrame", !0);
    u(this, "processingFirstFrame", !1);
    u(this, "waitingFrame", !1);
    this.type = "compute";
  }
  set useRenderPipeline(e) {
    e ? this.type = "compute_mixed" : this.type = "compute";
  }
  initFromObject(e) {
    if (this._resources = {}, this.vertexShader = null, this.fragmentShader = null, this.bindGroups.destroy(), this.bindGroups = new le(this, "pipeline"), e = ue.parse(e, "compute"), super.initFromObject(e), e.bindgroups) {
      let n;
      for (let r in e.bindgroups)
        n = new Y(), n.name = r, n.initFromObject(e.bindgroups[r]), this.bindGroups.add(n);
      if (e.bindgroups.default && e.bindgroups.default.buffer) {
        const r = e.bindgroups.default.buffer.attributes;
        for (let a in r)
          e[a] && (e[a] = r[a]);
      }
    }
    const s = (n) => {
      const r = [];
      let a;
      for (let o in n)
        a = n[o], r.push({ name: o, ...a });
      return r;
    };
    this.computeShader = new Ue(), typeof e.computeShader == "string" ? this.computeShader.main.text = e.computeShader : (e.computeShader instanceof Ue ? this.computeShader = e.computeShader : (e.computeShader.constants && (this.computeShader.constants.text = e.computeShader.constants), this.computeShader.main.text = e.computeShader.main), this.computeShader.inputs = s(e.computeShader.inputs), this.computeShader.outputs = s(e.computeShader.outputs));
    let i = !0;
    for (let n in this.resources.bindgroups.io)
      this.resources.bindgroups.io[n].data || (i = !1);
    return i && this.nextFrame(), this.dispatchEvent(C.ON_INIT_FROM_OBJECT, e), e;
  }
  destroy() {
    this.bindGroups.destroy();
    for (let e in this.description) this.description[e] = null;
    for (let e in this) {
      try {
        this[e].destroy();
      } catch {
        try {
          this[e].destroyGpuResource();
        } catch {
        }
      }
      this[e] = null;
    }
    this.dispatchEvent(C.ON_DESTROY);
  }
  setWorkgroups(e, s = 1, i = 1) {
    this.workgroups = [e, s, i];
  }
  setDispatchWorkgroup(e = 1, s = 1, i = 1) {
    this.dispatchWorkgroup = [e, s, i];
  }
  initResourceIOs() {
    const e = this.bindGroups.resources.io;
    if (!e) return;
    let s, i;
    for (let n in e)
      s = e[n], i = s.resourceIO, i instanceof H ? this.vertexBufferIOs.indexOf(i) === -1 && (this.resourceIOs.push(i), i.nbVertex > this.nbVertexMax && (this.nbVertexMax = i.nbVertex), this.vertexBufferIOs.push(i)) : i instanceof ne && this.imageTextureIOs.indexOf(i) === -1 && (this.resourceIOs.push(i), i.width > this.widthMax && (this.widthMax = i.width), i.height > this.heightMax && (this.heightMax = i.height), this.imageTextureIOs.push(i));
  }
  update() {
    this.gpuComputePipeline && (this.deviceId !== m.deviceId && (this.deviceId = m.deviceId, this.dispatchEvent(C.ON_DEVICE_LOST), this.clearAfterDeviceLostAndRebuild(), (/* @__PURE__ */ new Date()).getTime() - this.lastFrameTime < 100 && this.nextFrame()), this.bindGroups.update(), this.lastFrameTime = (/* @__PURE__ */ new Date()).getTime());
  }
  setupDefaultWorkgroups() {
    if (this.vertexBufferIOs.length) {
      let e = 64;
      for (; this.nbVertexMax / e >= 65536; ) e *= 2;
      this.setWorkgroups(e), this.setDispatchWorkgroup(Math.ceil(this.nbVertexMax / e));
    } else
      this.setWorkgroups(1), this.setDispatchWorkgroup(this.widthMax, this.heightMax);
  }
  clearAfterDeviceLostAndRebuild() {
    console.warn("ComputePipeline.clearAfterDeviceLostAndRebuild()"), this.gpuComputePipeline = null, this.rebuildingAfterDeviceLost = !0, super.clearAfterDeviceLostAndRebuild();
  }
  buildGpuPipeline() {
    if (this.gpuComputePipeline) return this.gpuComputePipeline;
    this.initPipelineResources(this), this.createLayouts(), this.bindGroups.handleComputePipelineResourceIOs(), this.initResourceIOs(), this.workgroups || this.setupDefaultWorkgroups(), this.bindGroups.build();
    const e = this.computeShader.outputs, s = this.computeShader.inputs;
    for (let a = 0; a < e.length; a++)
      e[a].type.createGpuResource && (e[a].isOutput = !0, s.push(e[a]));
    let i = this.bindGroups.resources.types;
    for (let a in i)
      i[a].forEach((o) => {
        o.resource.gpuResource.label = o.name;
      });
    const n = new z("Input", [...s]), r = this.computeShader.build(this, n);
    return this.dispatchEvent(C.ON_COMPUTE_SHADER_CODE_BUILT, r), this.onShaderBuild && this.onShaderBuild(r), this.description.compute = {
      module: m.device.createShaderModule({ code: r.code }),
      entryPoint: "main"
    }, this.description.layout = this.gpuPipelineLayout, this.deviceId = m.deviceId, this.gpuComputePipeline = m.createComputePipeline(this.description), this.dispatchEvent(C.ON_GPU_PIPELINE_BUILT), this.gpuComputePipeline;
  }
  async nextFrame() {
    if (this.processingFirstFrame) {
      this.waitingFrame = !0;
      return;
    }
    this.dispatchEvent(C.ON_COMPUTE_BEGIN), this.onComputeBegin && this.onComputeBegin(), this.processingFirstFrame = this.firstFrame, this.update();
    const e = m.device.createCommandEncoder(), s = e.beginComputePass();
    s.setPipeline(this.buildGpuPipeline()), this.bindGroups.update(), this.bindGroups.apply(s), s.dispatchWorkgroups(this.dispatchWorkgroup[0], this.dispatchWorkgroup[1], this.dispatchWorkgroup[2]), s.end(), this.dispatchEvent(C.ON_SUBMIT_QUEUE), m.device.queue.submit([e.finish()]), this.firstFrame && await m.device.queue.onSubmittedWorkDone();
    for (let i = 0; i < this.resourceIOs.length; i++)
      this.resourceIOs[i].getOutputData();
    this.bindGroups.resources.all.forEach((i) => {
      i instanceof E ? i.resourceIO == null && i.getOutputData(i.gpuResource) : i.getOutputData && i.getOutputData(i.gpuResource);
    }), this.firstFrame = !1, this.processingFirstFrame = !1, this.dispatchEvent(C.ON_COMPUTE_END), this.onComputeEnd && this.onComputeEnd(), this.waitingFrame && (this.waitingFrame = !1, this.nextFrame());
  }
};
u(C, "ON_COMPUTE_SHADER_CODE_BUILT", "ON_COMPUTE_SHADER_CODE_BUILT"), u(C, "ON_COMPUTE_BEGIN", "ON_COMPUTE_BEGIN"), u(C, "ON_COMPUTE_END", "ON_COMPUTE_END"), u(C, "ON_GPU_PIPELINE_BUILT", "ON_GPU_PIPELINE_BUILT"), u(C, "ON_INIT_FROM_OBJECT", "ON_INIT_FROM_OBJECT"), u(C, "ON_DESTROY", "ON_DESTROY"), u(C, "ON_DEVICE_LOST", "ON_DEVICE_LOST"), u(C, "ON_UPDATE_RESOURCES", "ON_UPDATE_RESOURCES"), u(C, "ON_SUBMIT_QUEUE", "ON_SUBMIT_QUEUE");
let Ee = C;
class nt extends Ee {
  constructor() {
    super();
    u(this, "onLog");
    u(this, "config");
    u(this, "vertexShaderInputs");
    u(this, "renderPipeline");
    u(this, "computeShaderObj");
    u(this, "resourceByType");
    u(this, "indexBuffer");
    u(this, "results");
    u(this, "resultBufferStructure", {});
    u(this, "nbValueByFieldIndex", {});
    u(this, "nbValueByFieldName", {});
    u(this, "dataTypeByFieldname", {});
    u(this, "fieldNames", []);
    u(this, "fieldNewNames", []);
    u(this, "fieldIndexByName", {});
    u(this, "attributes", {});
    u(this, "vertexIdName");
    // = "vertexId";
    u(this, "instanceIdName");
    u(this, "renderUniformBuffers");
    u(this, "renderVertexBuffers");
    u(this, "bufferNameByAttributeName");
    u(this, "vertexBufferIO");
    u(this, "firstPass", !0);
    u(this, "temporaryIndex", 0);
  }
  initRenderPipeline(e) {
    this.renderPipeline = e, e.bindGroups.setupDraw(!0), this.resourceByType = e.bindGroups.resources.types, this.vertexShaderInputs = e.vertexShader.inputs, this.renderUniformBuffers = this.resourceByType.uniformBuffers;
  }
  setupIndexBuffer() {
    let e = null;
    this.renderPipeline.resources.indexBuffer && (e = this.renderPipeline.resources.indexBuffer, this.computeShaderObj.indexBuffer = new E({ id: I.Uint() }, {
      stepMode: "vertex",
      datas: e.datas
    }));
  }
  setupDataStructure() {
    this.results = {}, this.resultBufferStructure = {}, this.nbValueByFieldIndex = {}, this.nbValueByFieldName = {}, this.dataTypeByFieldname = {}, this.fieldNames = [], this.fieldNewNames = [], this.fieldIndexByName = {}, this.attributes = {};
    const e = this.renderPipeline.resources.__DEBUG__.objectById;
    let s, i, n;
    for (let r = 0; r < e.length; r++)
      n = e[r], i = n.name, s = this.getNbValueByType(n.type), this.fieldNames[r] = i, this.fieldNewNames[r] = n.newName, this.fieldIndexByName[i] = r, this.nbValueByFieldIndex[r] = n.nbValue, this.dataTypeByFieldname[i] = n.type, this.resultBufferStructure[i] = this.createEmptyArray(s), this.nbValueByFieldName[i] = s, this.attributes[n.newName] = this.getObjectByType(n.type);
  }
  // = "instanceId";
  //protected computeUniforms = {};
  setupVertexShaderBuiltIns() {
    let e;
    for (let s = 0; s < this.vertexShaderInputs.length; s++)
      e = this.vertexShaderInputs[s], e.builtin && (e.builtin === "@builtin(vertex_index)" ? this.vertexIdName = e.name : e.builtin === "@builtin(instance_index)" && (this.instanceIdName = e.name));
    this.vertexIdName || (this.vertexIdName = "VERTEX_ID"), this.instanceIdName || (this.instanceIdName = "INSTANCE_ID");
  }
  setupUniformBuffers() {
    let e;
    const s = (i) => {
      const n = {};
      for (let r = 0; r < i.itemNames.length; r++)
        n[i.itemNames[r]] = i.items[i.itemNames[r]].clone();
      return new V(n, { useLocalVariable: i.descriptor.useLocalVariable });
    };
    if (this.renderUniformBuffers)
      for (let i = 0; i < this.renderUniformBuffers.length; i++)
        e = this.renderUniformBuffers[i], this.computeShaderObj[e.name] = s(e.resource);
  }
  setupVertexBuffers() {
    this.renderVertexBuffers = this.resourceByType.vertexBuffers, this.bufferNameByAttributeName = [];
    let e, s;
    if (this.renderVertexBuffers)
      for (let i = 0; i < this.renderVertexBuffers.length; i++) {
        e = this.renderVertexBuffers[i], s = e.resource;
        let n = s.attributeDescriptor;
        for (let r in n)
          this.bufferNameByAttributeName[r] = e.name;
        this.computeShaderObj[e.name] = new E(s.attributeDescriptor, {
          stepMode: s.stepMode,
          datas: s.datas
        });
      }
  }
  setupComputeShaderVertexBufferIO() {
    this.vertexBufferIO = new H(this.attributes), this.vertexBufferIO.createVertexInstances(this.config.nbVertex, () => this.resultBufferStructure);
    let e;
    this.vertexBufferIO.onOutputData = (s) => {
      const i = new Float32Array(s);
      e = 0;
      let n = [];
      this.vertexBufferIO.getVertexInstances(i, (r) => {
        let a = {};
        for (let o in r) a[o] = { ...r[o] };
        n[e++] = a, this.onLog && e == this.config.nbVertex && this.onLog({
          config: this.config,
          results: n,
          nbValueByFieldName: this.nbValueByFieldName,
          renderPipeline: this.renderPipeline,
          dataTypeByFieldname: this.dataTypeByFieldname
        });
      });
    };
  }
  convertLetIntoVar(e) {
    let s = "", i = e.split(`
`), n, r = "abcdefghijklmnopqrstuvwxyz/";
    r += r.toUpperCase();
    const a = (o) => {
      for (let f = 0; f < o.length; f++)
        if (r.includes(o[f])) return f;
      return o.length - 1;
    };
    for (let o = 0; o < i.length; o++)
      n = i[o], n = n.slice(a(n)), n.slice(0, 4) === "let " && (n = "var " + n.slice(4)), s += " " + n + `
`;
    return s;
  }
  removeVar(e) {
    let s = "", i = e.split(`
`), n;
    for (let r = 0; r < i.length; r++)
      n = i[r], n.slice(0, 5) === " var " && (n = n.slice(5)), s += " " + n + `
`;
    return s;
  }
  writeComputeShader() {
    let e = "", s = this.renderPipeline.vertexShader.outputs;
    for (let o = 0; o < s.length; o++)
      e += `var output_${s[o].name} = ${this.getNewInstanceByType(s[o].type)};
`;
    let i = "";
    this.indexBuffer ? i += "let index:u32 = indexBuffer[global_id.x].id;" : i += "let index = global_id.x;", i += `
        ${e}
        let nbResult = arrayLength(&result);
        if(index >= nbResult){
            return;
        }

        var computeResult = result[index];
        var ${this.vertexIdName}:u32 = 0;
        var ${this.instanceIdName}:u32 = 0;
        `;
    let n;
    for (let o = 0; o < this.vertexShaderInputs.length; o++)
      n = this.vertexShaderInputs[o], n.builtin.slice(0, 8) != "@builtin" && (i += `var computed_vertex_${n.name}:${n.type};
`);
    let r = {};
    const a = this.renderPipeline.resources.__DEBUG__.objectById;
    for (let o = 0; o < a.length; o++)
      r[a[o].name] || (r[a[o].name] = !0, i += this.writeVertexShader(a[o]));
    return m.showVertexDebuggerShader && (console.log("------------- VERTEX DEBUGGER SHADER --------------"), console.log(i), console.log("---------------------------------------------------")), i;
  }
  writeVertexShader(e) {
    const { vertexId: s, instanceId: i, name: n } = e;
    let r = `
        ${this.vertexIdName} = ${s};
        ${this.instanceIdName} = ${i};

        `, a;
    for (let x = 0; x < this.vertexShaderInputs.length; x++)
      a = this.vertexShaderInputs[x], a.builtin.slice(0, 8) != "@builtin" && (r += `computed_vertex_${a.name} = ${this.bufferNameByAttributeName[a.name]}[${this.vertexIdName}+index].${a.name};
`);
    const o = (x, k, ce) => {
      const de = new RegExp(`(?<=[^\\w.])\\b${k}\\b`, "g");
      return x.replace(de, ce);
    };
    let f = [], l = this.renderPipeline.resources.vertexShader.debugVersion;
    for (let x = 0; x < this.vertexShaderInputs.length; x++)
      a = this.vertexShaderInputs[x], a.builtin.slice(0, 8) != "@builtin" && (f[this.fieldIndexByName[a.name]] = a.name, l = o(l, a.name, "computed_vertex_" + a.name));
    const h = l.split(`
`), c = "abcdefghijklmnopqrstuvwxyz/", g = {};
    for (let x = 0; x < c.length; x++)
      g[c[x]] = !0, g[c[x].toUpperCase()] = !0;
    const d = (x) => {
      for (let k = 0; k < x.length; k++)
        if (g[x[k]]) return k;
      return x.length - 1;
    };
    for (let x = 0; x < h.length; x++)
      h[x] = " " + h[x].slice(d(h[x]));
    l = h.join(`
`), l = o(l, "output.", "output_");
    let p = o(l, "debug", "computeResult");
    function y(x, k, ce) {
      const de = x.split(`
`);
      let xe = "", W, be = "abcdefghijklmnopqrstuvwxyz0123456789", Ae;
      be += be.toUpperCase();
      for (let Te = 0; Te < de.length; Te++)
        if (W = de[Te], W.includes(k)) {
          if (W.includes(ce)) {
            const Ne = W.split(ce);
            let Pe = !0;
            for (let _e = 0; _e < Ne.length; _e++)
              if (be.includes(Ne[_e][0])) {
                Pe = !1;
                break;
              }
            Pe && (xe += W + `
`);
          }
        } else
          Ae = W.trim(), Ae.length != 0 && (xe += W + `
`);
      return xe;
    }
    p = y(p, "computeResult.", "computeResult." + e.name), p = this.convertLetIntoVar(p), this.firstPass || (p = this.removeVar(p)), r += p + `
`;
    for (let x = 0; x < this.fieldNames.length; x++)
      this.fieldNewNames[x].includes(e.name) && (r += `result_out[index].${this.fieldNewNames[x]} =  computeResult.${this.fieldNewNames[x]};
`);
    const T = this.renderPipeline.resources.__DEBUG__.objectById;
    let B, S = {}, _, K;
    for (let x = 0; x < T.length; x++)
      B = T[x], B.name == n && (B.isMatrix ? (K = B.newName.includes("_m4"), K ? _ = B.newName.split("_m4")[0] : _ = B.newName.split("_m3")[0], S[_] || (S[_] = !0, r = this.writeMatrixTemplate(r, _, K))) : B.isArray && (_ = B.newName.split("_ar")[0], S[_] || (S[_] = !0, r = this.writeArrayTemplate(r, _, B.len, B.primitiveType))));
    return this.firstPass = !1, r;
  }
  writeArrayTemplate(e, s, i, n) {
    let r = "abcdefghijklmnopqrstuvwxyz0123456789";
    r += r.toUpperCase();
    let a = e.split(`
`), o;
    const f = (g) => {
      for (let d = 0; d < g.length; d++)
        if (!r.includes(g[d]))
          return !0;
      return !1;
    };
    let l;
    const h = (g, d) => {
      let p = "", y = i, T = n == "mat4";
      for (let B = 0; B < y; B++)
        T ? (p += `computeResult.${g}_ar${B}_m0 = ${d}[${B}][0];
`, p += `computeResult.${g}_ar${B}_m1 = ${d}[${B}][1];
`, p += `computeResult.${g}_ar${B}_m2 = ${d}[${B}][2];
`, p += `computeResult.${g}_ar${B}_m3 = ${d}[${B}][3];
`) : p += `computeResult.${g}_ar${B} = ${d}[${B}];
`;
      return p += `
`, p;
    };
    let c = "";
    for (let g = 0; g < a.length; g++)
      if (o = a[g], o.includes("computeResult." + s) == !0) {
        c = "";
        let d = o.split("=")[1].split(";")[0].trim(), p = g;
        if (f(d)) {
          if (o.includes(";") === !1)
            for (p = g + 1; p < a.length; p++)
              if (a[p].includes(";") == !1)
                d += a[p] + `
`, a[p] = "";
              else {
                d += a[p].split(";")[0] + "", a[p] = "";
                break;
              }
          l = "temporaryVariable_" + this.temporaryIndex++, n === "mat4" ? c = "let " + l + ":array<mat4x4<f32>," + i + "> = " + d + `;
` : c = "let " + l + ":array<vec4<" + n + "> = " + d + `;
`, d = l;
        }
        c += h(s, d), a[g] = c;
        break;
      }
    return a.join(`
`);
  }
  writeMatrixTemplate(e, s, i = !0) {
    let n = "abcdefghijklmnopqrstuvwxyz0123456789";
    n += n.toUpperCase();
    let r = e.split(`
`), a;
    const o = (c) => {
      for (let g = 0; g < c.length; g++)
        if (!n.includes(c[g]))
          return !0;
      return !1;
    };
    let f;
    const l = (c, g) => {
      let d = "", p = 4;
      i == !1 && (p = 3);
      for (let y = 0; y < p; y++)
        d += `computeResult.${c}_m${p}${y} = ${g}[${y}];
`;
      return d += `
`, d;
    };
    let h = "";
    for (let c = 0; c < r.length; c++)
      if (a = r[c], a.includes("computeResult." + s) == !0) {
        h = "";
        let g = a.split("=")[1].split(";")[0].trim(), d = c;
        if (o(g)) {
          if (a.includes(";") === !1)
            for (d = c + 1; d < r.length; d++)
              if (r[d].includes(";") == !1)
                g += r[d] + `
`, r[d] = "";
              else {
                g += r[d].split(";")[0] + "", r[d] = "";
                break;
              }
          f = "temporaryVariable_" + this.temporaryIndex++, i ? h = "let " + f + ":mat4x4<f32> = " + g + `;
` : h = "let " + f + ":mat3x3<f32> = " + g + `;
`, g = f;
        }
        h += l(s, g), r[c] = h;
        break;
      }
    return r.join(`
`);
  }
  buildComputeShader() {
    this.computeShaderObj.result = this.vertexBufferIO, this.computeShaderObj.global_id = b.computeInputs.globalInvocationId, this.computeShaderObj.computeShader = {
      constants: this.renderPipeline.vertexShader.constants.text,
      main: this.writeComputeShader()
    }, this.initFromObject(this.computeShaderObj);
    let e = this.bindGroups.groups;
    for (let s = 0; s < e.length; s++) e[s].mustRefreshBindgroup = !0;
  }
  copyUniformsFromRenderToCompute() {
    if (!this.renderUniformBuffers) return;
    let e, s;
    for (let i = 0; i < this.renderUniformBuffers.length; i++) {
      e = this.renderUniformBuffers[i], s = e.resource.itemNames;
      for (let n = 0; n < s.length; n++)
        this.computeShaderObj[e.name].items[s[n]].set(e.resource.items[s[n]]);
    }
  }
  init(e, s) {
    s || (s = 1), this.config = { nbVertex: s }, this.computeShaderObj = {
      bindgroups: {
        io: {}
        //computeShaders have a reserved bindgroup 'io' , dedicated to the ping-pong process 
      }
    }, this.initRenderPipeline(e), this.setupIndexBuffer(), this.setupDataStructure(), this.setupVertexShaderBuiltIns(), this.setupUniformBuffers(), this.setupVertexBuffers(), this.setupComputeShaderVertexBufferIO(), this.buildComputeShader(), this.onComputeBegin = () => {
      this.copyUniformsFromRenderToCompute();
    };
  }
  createEmptyArray(e) {
    const s = [];
    for (let i = 0; i < e; i++) s[i] = 0;
    return s;
  }
  getObjectByType(e) {
    return e === "f32" ? I.Float() : e === "vec2<f32>" ? I.Vec2() : e === "vec3<f32>" ? I.Vec3() : e === "vec4<f32>" ? I.Vec4() : null;
  }
  getNbValueByType(e) {
    return e === "f32" ? 1 : e === "vec2<f32>" ? 2 : e === "vec3<f32>" ? 3 : e === "vec4<f32>" ? 4 : 0;
  }
  getNewInstanceByType(e) {
    return e === "f32" ? "0.0" : e === "vec2<f32>" ? "vec2(0.0)" : e === "vec3<f32>" ? "vec3(0.0)" : e === "vec4<f32>" ? "vec4(0.0)" : "";
  }
}
const w = class w extends ze {
  constructor(e = { r: 0, g: 0, b: 0, a: 1 }) {
    super();
    u(this, "_renderer");
    u(this, "drawConfig");
    u(this, "multiSampleTextureDescriptor");
    u(this, "waitingMultisampleTexture", !1);
    u(this, "multisampleTexture");
    u(this, "waitingDepthStencilTexture", !1);
    u(this, "depthStencilTextureDescriptor");
    u(this, "_depthStencilTexture");
    u(this, "renderPassTexture");
    u(this, "outputColor");
    u(this, "renderPassDescriptor", { colorAttachments: [] });
    u(this, "vertexShaderDebuggerPipeline", null);
    u(this, "gpuPipeline");
    u(this, "debug", "renderPipeline");
    u(this, "_clearValue", null);
    u(this, "blendMode");
    u(this, "rebuildingAfterDeviceLost", !1);
    u(this, "onRebuildStartAfterDeviceLost");
    u(this, "buildingPipeline", !1);
    //-------------------------------------------
    u(this, "clearOpReady", !1);
    u(this, "rendererUseSinglePipeline", !0);
    this.type = "render", this.drawConfig = new rt(this), this.vertexShader = new Ie(), this.fragmentShader = new Be(), this.description.primitive = {
      topology: "triangle-list",
      cullMode: "none",
      frontFace: "ccw"
    }, e !== null && (this.outputColor = this.createColorAttachment(e));
  }
  get renderer() {
    return this._renderer;
  }
  set renderer(e) {
    this._renderer != e && (this._renderer = e, e ? (this.waitingMultisampleTexture && (this.setupMultiSampleView(this.multiSampleTextureDescriptor), this.waitingMultisampleTexture = !1), this.waitingDepthStencilTexture && (this.setupDepthStencilView(this.depthStencilTextureDescriptor), this.waitingDepthStencilTexture = !1), this.dispatchEvent(w.ON_ADDED_TO_RENDERER)) : this.dispatchEvent(w.ON_REMOVED_FROM_RENDERER));
  }
  /*
  public get canvas(): any {
      if (!this.renderer) return null;
      return this.renderer.canvas;
  }
  */
  get depthStencilTexture() {
    return this._depthStencilTexture;
  }
  destroy() {
    this.bindGroups.destroy(), this.multisampleTexture && this.multisampleTexture.destroy(), this.renderPassTexture && this.renderPassTexture.destroyGpuResource(), this.depthStencilTexture && this.depthStencilTexture.destroy();
    for (let e in this.description) this.description[e] = null;
    for (let e in this) {
      try {
        this[e].destroy();
      } catch {
        try {
          this[e].destroyGpuResource();
        } catch {
        }
      }
      this[e] = null;
    }
  }
  initFromObject(e) {
    if (this._resources = {}, this.vertexShader = null, this.fragmentShader = null, this.gpuPipeline = null, this.bindGroups.destroy(), this.bindGroups = new le(this, "pipeline"), e = ue.parse(e, "render", this.drawConfig), super.initFromObject(e), e.cullMode ? this.description.primitive.cullMode = e.cullMode : this.description.primitive.cullMode = "none", !e.topology) this.description.primitive.topology = "triangle-list";
    else if (this.description.primitive.topology = e.topology, e.topology === "line-strip" || e.topology === "triangle-strip")
      if (e.stripIndexFormat)
        this.description.primitive.stripIndexFormat = e.stripIndexFormat;
      else
        throw new Error("You must define a 'stripIndexFormat' in order to use a topology 'triangle-strip' or 'line-strip'. See https://www.w3.org/TR/webgpu/#enumdef-gpuindexformat for more details");
    if (e.frontFace ? this.description.primitive.frontFace = e.frontFace : this.description.primitive.frontFace = "ccw", e.indexBuffer && (this.drawConfig.indexBuffer = e.indexBuffer), this.outputColor && (e.clearColor ? this.outputColor.clearValue = e.clearColor : e.clearColor = this.outputColor.clearValue), e.blendMode && (this.blendMode = e.blendMode), e.antiAliasing && this.setupMultiSampleView(), e.useDepthTexture) {
      let i = 1024;
      e.depthTextureSize && (i = e.depthTextureSize), this.setupDepthStencilView({
        size: [i, i, 1],
        format: "depth32float",
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
      });
    } else e.depthTest && this.setupDepthStencilView();
    if (e.bindgroups) {
      let i;
      for (let n in e.bindgroups)
        if (e.bindgroups[n] instanceof Y) {
          const r = e.bindgroups[n].elements, a = [];
          for (let o = 0; o < r.length; o++)
            a[o] = r[o].resource;
          e.bindgroups[n].name = n, this.bindGroups.add(e.bindgroups[n]);
        } else
          i = new Y(), i.name = n, i.initFromObject(e.bindgroups[n]), this.bindGroups.add(i);
      if (e.bindgroups.default && e.bindgroups.default.buffer) {
        const n = e.bindgroups.default.buffer.attributes;
        for (let r in n)
          e[r] && (e[r] = n[r]);
      }
    }
    const s = (i) => {
      const n = [];
      let r;
      for (let a in i)
        r = i[a], n.push({ name: a, ...r });
      return n;
    };
    return this.vertexShader = new Ie(), typeof e.vertexShader == "string" ? this.vertexShader.main.text = e.vertexShader : (e.vertexShader instanceof Ie ? this.vertexShader = e.vertexShader : (e.vertexShader.constants && (this.vertexShader.constants.text = e.vertexShader.constants), this.vertexShader.main.text = e.vertexShader.main), this.vertexShader.inputs = s(e.vertexShader.inputs), this.vertexShader.outputs = s(e.vertexShader.outputs)), e.fragmentShader && (this.fragmentShader = new Be(), typeof e.fragmentShader == "string" ? this.fragmentShader.main.text = e.fragmentShader : (e.fragmentShader instanceof Be ? this.fragmentShader = e.fragmentShader : (e.fragmentShader.constants && (this.fragmentShader.constants.text = e.fragmentShader.constants), this.fragmentShader.main.text = e.fragmentShader.main), this.fragmentShader.inputs = s(e.fragmentShader.inputs), this.fragmentShader.outputs = s(e.fragmentShader.outputs))), this.dispatchEvent(w.ON_INIT_FROM_OBJECT, e), e;
  }
  get clearValue() {
    return this._clearValue;
  }
  createColorAttachment(e, s = void 0) {
    const i = {
      view: s,
      clearValue: e,
      loadOp: "clear",
      storeOp: "store"
    };
    return this.renderPassDescriptor.colorAttachments.push(i), i;
  }
  //-----------------
  setupDraw(e) {
    e.instanceCount !== void 0 && (this.drawConfig.instanceCount = e.instanceCount), e.vertexCount !== void 0 && (this.drawConfig.vertexCount = e.vertexCount), e.firstVertexId !== void 0 && (this.drawConfig.firstVertexId = e.firstVertexId), e.firstInstanceId !== void 0 && (this.drawConfig.firstInstanceId = e.firstInstanceId), e.indexBuffer !== void 0 && (this.drawConfig.indexBuffer = e.indexBuffer), e.baseVertex !== void 0 && (this.drawConfig.baseVertex = e.baseVertex);
  }
  get debugVertexCount() {
    return this.resources.debugVertexCount;
  }
  set debugVertexCount(e) {
    this.resources.debugVertexCount = e;
  }
  get vertexCount() {
    return this.drawConfig.vertexCount;
  }
  set vertexCount(e) {
    this.drawConfig.vertexCount = e;
  }
  get instanceCount() {
    return this.drawConfig.instanceCount;
  }
  set instanceCount(e) {
    this.drawConfig.instanceCount = e;
  }
  get firstVertexId() {
    return this.drawConfig.firstVertexId;
  }
  set firstVertexId(e) {
    this.drawConfig.firstVertexId = e;
  }
  get firstInstanceId() {
    return this.drawConfig.firstInstanceId;
  }
  set firstInstanceId(e) {
    this.drawConfig.firstInstanceId = e;
  }
  get baseVertex() {
    return this.drawConfig.baseVertex;
  }
  set baseVertex(e) {
    this.drawConfig.baseVertex = e;
  }
  //------------------------------------------------
  setupMultiSampleView(e) {
    if (!this.renderer) {
      this.waitingMultisampleTexture = !0, this.multiSampleTextureDescriptor = e;
      return;
    }
    this.multisampleTexture && this.multisampleTexture.destroy(), e || (e = {}), e.size || (e.size = [this.renderer.width, this.renderer.height]), this.multisampleTexture = new it(e), this.description.multisample = {
      count: this.multisampleTexture.description.count
    }, this._depthStencilTexture && (this.renderPassDescriptor.description.sampleCount = 4, this._depthStencilTexture.create());
  }
  //---------------------------
  setupDepthStencilView(e, s, i) {
    if (!this.renderer) {
      this.waitingDepthStencilTexture = !0, this.depthStencilTextureDescriptor = e;
      return;
    }
    i || (i = {}), e || (e = {}), e.size || (e.size = [this.renderer.width, this.renderer.height]), this.multisampleTexture ? e.sampleCount = 4 : e.sampleCount = 1, this._depthStencilTexture && this._depthStencilTexture.destroy(), this._depthStencilTexture = new fe(e, s, i), this.renderPassDescriptor.depthStencilAttachment = this.depthStencilTexture.attachment, this.description.depthStencil = this.depthStencilTexture.description;
  }
  //----------------------------------------
  get renderPassView() {
    return this.renderPass.view;
  }
  get renderPass() {
    return this.renderPassTexture || (this.renderPassTexture = new we(this)), this.renderPassTexture;
  }
  get useRenderPassTexture() {
    return !!this.renderPassTexture;
  }
  cleanInputs() {
    const e = [], s = this.vertexShader.inputs;
    for (let i in s) e.push({ name: i, ...s[i] });
    return this.vertexShader.inputs = e, e;
  }
  getFragmentShaderColorOptions() {
    const e = {
      format: m.getPreferredCanvasFormat()
    };
    return this.blendMode && (e.blend = this.blendMode), e;
  }
  clearAfterDeviceLostAndRebuild() {
    this.dispatchEvent(w.ON_DEVICE_LOST), this.onRebuildStartAfterDeviceLost && this.onRebuildStartAfterDeviceLost(), this.gpuPipeline = null, this.drawConfig.indexBuffer && this.drawConfig.indexBuffer.createGpuResource(), this.multisampleTexture && this.multisampleTexture.resize(this.renderer.width, this.renderer.height), this.depthStencilTexture && this.depthStencilTexture.resize(this.renderer.width, this.renderer.height), this.renderPassTexture && this.renderPassTexture.resize(this.renderer.width, this.renderer.height), this.rebuildingAfterDeviceLost = !0, super.clearAfterDeviceLostAndRebuild();
  }
  buildGpuPipeline() {
    if (this.gpuPipeline || this.buildingPipeline) return this.gpuPipeline;
    this.buildingPipeline = !0, this.bindGroups.handleRenderPipelineResourceIOs(), this.initPipelineResources(this);
    const e = this.bindGroups.build();
    if (e.description.layout ? this.description.layout = e.description.layout : this.description.layout = "auto", !this.rebuildingAfterDeviceLost) {
      const i = e.buffers;
      this.description.vertex = e.description.vertex;
      const n = new z("Input", this.cleanInputs());
      if (i.length) {
        let o, f, l = 0;
        for (let h = 0; h < i.length; h++) {
          o = i[h], f = o.vertexArrays;
          for (let c = 0; c < f.length; c++)
            n.addProperty({ name: f[c].name, type: f[c].varType, builtin: "@location(" + l + ")" }), l++;
        }
      }
      const r = this.vertexShader.build(this, n);
      this.dispatchEvent(w.ON_VERTEX_SHADER_CODE_BUILT, r);
      let a;
      this.fragmentShader && (a = this.fragmentShader.build(this, r.output.getInputFromOutput()), this.dispatchEvent(w.ON_FRAGMENT_SHADER_CODE_BUILT, a)), this.description.vertex = {
        code: r.code,
        entryPoint: "main",
        buffers: e.description.vertex.buffers
      }, this.fragmentShader && (this.description.fragment = {
        code: a.code,
        entryPoint: "main",
        targets: [
          this.getFragmentShaderColorOptions()
        ]
      });
    }
    this.description.vertex.module = m.device.createShaderModule({ code: this.description.vertex.code }), this.description.fragment && (this.description.fragment.module = m.device.createShaderModule({ code: this.description.fragment.code })), this.rebuildingAfterDeviceLost = !1, this.gpuPipeline = m.createRenderPipeline(this.description);
    let s = this.bindGroups.resources.types;
    for (let i in s)
      s[i].forEach((n) => {
        n.resource.gpuResource && (n.resource.gpuResource.label = n.name);
      });
    return this.resources.__DEBUG__ && (this.vertexShaderDebuggerPipeline = new nt(), this.vertexShaderDebuggerPipeline.init(this, this.debugVertexCount), this.vertexShaderDebuggerPipeline.onLog = (i) => {
      console.log(i), this.dispatchEvent(w.ON_LOG, i);
    }), this.buildingPipeline = !1, this.dispatchEvent(w.ON_GPU_PIPELINE_BUILT), this.gpuPipeline;
  }
  beginRenderPass(e, s, i, n = !1) {
    if (!this.resourceDefined) return null;
    if (this.vertexShaderDebuggerPipeline && this.vertexShaderDebuggerPipeline.nextFrame(), this.dispatchEvent(w.ON_DRAW_BEGIN), n)
      this.renderPassDescriptor.colorAttachments[0].loadOp = "clear";
    else {
      this.renderPassDescriptor.colorAttachments[0] && (this._clearValue = this.renderPassDescriptor.colorAttachments[0].clearValue);
      let r = this.renderer.renderPipelines.length == 1 && this.pipelineCount === 1;
      this.rendererUseSinglePipeline !== r && (this.clearOpReady = !1, this.rendererUseSinglePipeline = r), (this.clearOpReady === !1 && this.renderPassDescriptor.colorAttachments[0] || this.pipelineCount > 1) && (this.clearOpReady = !0, r && this.pipelineCount == 1 ? this.renderPassDescriptor.colorAttachments[0].loadOp = "clear" : this.pipelineCount === 1 ? this.renderer.renderPipelines[0] === this ? this.renderPassDescriptor.colorAttachments[0].loadOp = "clear" : this.renderPassDescriptor.colorAttachments[0].loadOp = "load" : (this.renderPassDescriptor.colorAttachments[0].loadOp = "clear", i === 0 || (this.renderPassDescriptor.colorAttachments[0].loadOp = "load")));
    }
    return this.gpuPipeline || this.buildGpuPipeline(), s && this.outputColor && this.handleOutputColor(s), e.beginRenderPass(this.renderPassDescriptor);
  }
  handleOutputColor(e) {
    this.outputColor && (this.multisampleTexture ? (this.multisampleTexture.view || this.multisampleTexture.create(), this.outputColor.view = this.multisampleTexture.view, this.multisampleTexture.resolveTarget ? this.outputColor.resolveTarget = this.multisampleTexture.resolveTarget : this.outputColor.resolveTarget = e) : this.outputColor.view = e);
  }
  //----------------------------------------------------------------------
  update() {
    this.gpuPipeline && (this.renderPassTexture && this.renderPassTexture.update(), this.bindGroups.update(), this.dispatchEvent(w.ON_UPDATE_RESOURCES));
  }
  draw(e) {
    this.resourceDefined && (e.setPipeline(this.gpuPipeline), this.bindGroups.apply(e));
  }
  //-------------------------------
  end(e, s) {
    if (!this.resourceDefined) return;
    s.end();
    const i = this.bindGroups.resources.types;
    if (i) {
      if (!i.textureArrays) {
        let a = [];
        i.imageTextureArrays && (a = a.concat(i.imageTextureArrays)), i.cubeMapTextureArrays && (a = a.concat(i.cubeMapTextureArrays)), i.cubeMapTexture && (a = a.concat(i.cubeMapTexture)), i.textureArrays = a;
      }
      for (let a = 0; a < i.textureArrays.length; a++)
        i.textureArrays[a].resource.updateInnerGpuTextures(e);
    }
    const { width: n, height: r } = this.renderer;
    this.renderer.resized && (this.multisampleTexture && this.multisampleTexture.resize(n, r), this.depthStencilTexture && this.depthStencilTexture.resize(n, r), this.renderPassTexture && this.renderPassTexture.resize(n, r)), this.renderPassTexture && this.renderPassTexture.mustUseCopyTextureToTexture && (this.renderPassTexture.gpuResource || this.renderPassTexture.createGpuResource(), e.copyTextureToTexture({ texture: this.renderer.texture }, { texture: this.renderPassTexture.gpuResource }, [n, r])), this.multisampleTexture && this.multisampleTexture.update(), this.depthStencilTexture && this.depthStencilTexture.update(), this.renderPassTexture && this.renderPassTexture.update(), this.dispatchEvent(w.ON_DRAW_END);
  }
  get resourceDefined() {
    return !this.bindGroups.resources.all ? this.drawConfig.vertexCount > 0 && this.vertexShader.main.text != "" && this.fragmentShader.main.text != "" : !0;
  }
  get pipeline() {
    return this.gpuPipeline;
  }
  get cullMode() {
    return this.description.primitive.cullMode;
  }
  set cullMode(e) {
    this.description.primitive.cullMode = e;
  }
  get topology() {
    return this.description.primitive.topology;
  }
  set topology(e) {
    this.description.primitive.topology = e;
  }
  get frontFace() {
    return this.description.primitive.frontFace;
  }
  set frontFace(e) {
    this.description.primitive.frontFace = e;
  }
  get stripIndexFormat() {
    return this.description.primitive.stripIndexFormat;
  }
  set stripIndexFormat(e) {
    this.description.primitive.stripIndexFormat = e;
  }
};
u(w, "ON_ADDED_TO_RENDERER", "ON_ADDED_TO_RENDERER"), u(w, "ON_REMOVED_FROM_RENDERER", "ON_REMOVED_FROM_RENDERER"), u(w, "ON_DRAW_BEGIN", "ON_DRAW_BEGIN"), u(w, "ON_DRAW_END", "ON_DRAW_END"), u(w, "ON_DRAW", "ON_DRAW"), u(w, "ON_GPU_PIPELINE_BUILT", "ON_GPU_PIPELINE_BUILT"), u(w, "ON_LOG", "ON_LOG"), u(w, "ON_VERTEX_SHADER_CODE_BUILT", "ON_VERTEX_SHADER_CODE_BUILT"), u(w, "ON_FRAGMENT_SHADER_CODE_BUILT", "ON_FRAGMENT_SHADER_CODE_BUILT"), u(w, "ON_INIT_FROM_OBJECT", "ON_INIT_FROM_OBJECT"), u(w, "ON_DEVICE_LOST", "ON_DEVICE_LOST"), u(w, "ON_UPDATE_RESOURCES", "ON_UPDATE_RESOURCES");
let F = w;
const L = class L extends Z {
  constructor() {
    super();
    u(this, "domElement");
    u(this, "canvasView");
    u(this, "ctx");
    u(this, "currentWidth");
    u(this, "currentHeight");
    u(this, "dimensionChanged", !1);
    u(this, "deviceId");
    u(this, "frameId", 0);
    u(this, "nbColorAttachment", 0);
    u(this, "renderPipelines", []);
    u(this, "texturedQuadPipeline");
    u(this, "gpuCtxConfiguration");
    u(this, "commandEncoder", null);
    L.texturedQuadPipeline || (L.texturedQuadPipeline = new F(), L.texturedQuadPipeline.initFromObject({
      vertexCount: 6,
      vertexId: b.vertexInputs.vertexIndex,
      image: new R({ source: null }),
      imgSampler: new he(),
      uv: b.vertexOutputs.Vec2,
      vertexShader: {
        constants: `
                    const pos = array<vec2<f32>([
                        vec2(-0.5,-0.5),
                        vec2(+0.5,-0.5),
                        vec2(-0.5,+0.5),
                        vec2(+0.5,-0.5),
                        vec2(+0.5,+0.5),
                        vec2(-0.5,+0.5),
                    ]);
                    `,
        main: `
                    output.position = vec4(pos[vertexId],0.0,1.0);
                    output.uv = 0.5 + output.position.xy;
                    `
      },
      fragmentShader: `
                    output.color = textureSample(image,imgSampler,uv);
                `
    })), this.texturedQuadPipeline = L.texturedQuadPipeline;
  }
  resize(e, s) {
    this.domElement.width = e, this.domElement.height = s, this.dimensionChanged = !0;
  }
  destroy() {
    for (let e = 0; e < this.renderPipelines.length; e++)
      this.renderPipelines[e].destroy();
    this.renderPipelines = [];
    for (let e in this)
      this[e] = null;
  }
  initCanvas(e, s = "opaque") {
    return this.domElement = e, new Promise(async (i, n) => {
      if (await m.init(), this.deviceId = m.deviceId, this.domElement != null) {
        this.currentWidth = this.domElement.width, this.currentHeight = this.domElement.height;
        try {
          this.gpuCtxConfiguration = {
            device: m.device,
            format: m.getPreferredCanvasFormat(),
            alphaMode: s,
            colorSpace: "srgb",
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING
          }, this.ctx = this.domElement.getContext("webgpu"), this.ctx.configure(this.gpuCtxConfiguration), i(e);
        } catch (r) {
          n(r);
        }
      }
    });
  }
  get resized() {
    return this.dimensionChanged;
  }
  get firstPipeline() {
    return this.renderPipelines[0];
  }
  get texture() {
    return this.ctx.getCurrentTexture();
  }
  get view() {
    return this.ctx.getCurrentTexture().createView();
  }
  get width() {
    return this.domElement.width;
  }
  get height() {
    return this.domElement.height;
  }
  get canvas() {
    return this.domElement;
  }
  addPipeline(e, s = null) {
    return e.renderer = this, e.renderPassDescriptor.colorAttachments[0] && this.nbColorAttachment++, s === null ? this.renderPipelines.push(e) : this.renderPipelines.splice(s, 0, e), e;
  }
  removePipeline(e) {
    e.renderPassDescriptor.colorAttachments[0] && this.nbColorAttachment--;
    const s = this.renderPipelines.indexOf(e);
    return s != -1 && this.renderPipelines.splice(s, 1), e.renderer = null, e;
  }
  get nbPipeline() {
    return this.renderPipelines.length;
  }
  get useSinglePipeline() {
    return this.nbColorAttachment === 1;
  }
  configure(e = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING, s = "opaque") {
    this.gpuCtxConfiguration = {
      device: m.device,
      format: m.getPreferredCanvasFormat(),
      alphaMode: s,
      colorSpace: "srgb",
      usage: e
    }, this.ctx.configure(this.gpuCtxConfiguration);
  }
  async update() {
    if (!this.ctx || !m.ready || this.renderPipelines.length === 0 || this.deviceId === void 0) return;
    if (m.deviceId != this.deviceId && this.ctx.configure({ ...this.gpuCtxConfiguration, device: m.device }), (this.canvas.width != this.currentWidth || this.canvas.height != this.currentHeight) && (this.currentWidth = this.canvas.width, this.currentHeight = this.canvas.height, this.dimensionChanged = !0), m.deviceId != this.deviceId) {
      this.deviceId = m.deviceId;
      for (let r = 0; r < this.renderPipelines.length; r++)
        this.renderPipelines[r].clearAfterDeviceLostAndRebuild();
    }
    this.commandEncoder = m.device.createCommandEncoder();
    let s, i;
    for (let r = 0; r < this.renderPipelines.length; r++) {
      s = this.renderPipelines[r], s.update(), i = s.beginRenderPass(this.commandEncoder, this.view, 0);
      for (let a = 0; a < s.pipelineCount; a++)
        s.dispatchEvent(F.ON_DRAW, a), s.draw(i);
      s.end(this.commandEncoder, i);
    }
    const n = this.commandEncoder.finish();
    this.commandEncoder = null, m.device.queue.submit([n]), this.dimensionChanged = !1, this.dispatchEvent(L.ON_DRAW_END), this.frameId++;
  }
};
u(L, "ON_DRAW_END", "ON_DRAW_END"), u(L, "texturedQuadPipeline");
let Ge = L;
class ht {
  constructor(t = !1) {
    u(this, "textureObj");
    u(this, "dimensionChanged", !1);
    u(this, "currentWidth");
    u(this, "currentHeight");
    u(this, "renderPipelines", []);
    u(this, "useTextureInComputeShader");
    u(this, "frameId", -1);
    u(this, "deviceId");
    //public get firstPipeline(): RenderPipeline { return this.renderPipelines[0]; }
    u(this, "nbColorAttachment", 0);
    u(this, "commandEncoder", null);
    this.useTextureInComputeShader = t;
  }
  init(t, e, s, i) {
    return this.currentWidth = t, this.currentHeight = e, new Promise((n) => {
      m.init().then(() => {
        this.deviceId = m.deviceId, s || (s = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC);
        let r = "bgra8unorm";
        this.useTextureInComputeShader && (r = "rgba8unorm", s += GPUTextureUsage.STORAGE_BINDING), this.textureObj = new Se({
          size: [t, e],
          format: r,
          usage: s,
          sampleCount: i
        }), this.textureObj.create(), n(this);
      });
    });
  }
  addPipeline(t, e = null) {
    return t.renderer = this, t.renderPassDescriptor.colorAttachments[0] && this.nbColorAttachment++, e === null ? this.renderPipelines.push(t) : this.renderPipelines.splice(e, 0, t), t;
  }
  removePipeline(t) {
    t.renderPassDescriptor.colorAttachments[0] && this.nbColorAttachment--;
    const e = this.renderPipelines.indexOf(t);
    return e != -1 && this.renderPipelines.splice(e, 1), t.renderer = null, t;
  }
  //public get nbPipeline(): number { return this.renderPipelines.length }
  //public get useSinglePipeline(): boolean { return this.nbColorAttachment === 1 }
  resize(t, e) {
    this.currentWidth = t, this.currentHeight = e, this.dimensionChanged = !0, this.textureObj && this.textureObj.resize(t, e);
  }
  destroy() {
    for (let t = 0; t < this.renderPipelines.length; t++)
      this.renderPipelines[t].destroy();
    this.renderPipelines = [];
    for (let t in this)
      this[t] = null;
  }
  async update() {
    if (!m.ready || this.renderPipelines.length === 0 || this.deviceId === void 0) return;
    if (m.deviceId != this.deviceId) {
      this.textureObj && this.textureObj.create(), this.deviceId = m.deviceId;
      for (let n = 0; n < this.renderPipelines.length; n++)
        this.renderPipelines[n].clearAfterDeviceLostAndRebuild();
    }
    this.commandEncoder = m.device.createCommandEncoder();
    let e, s;
    for (let n = 0; n < this.renderPipelines.length; n++) {
      e = this.renderPipelines[n], e.update();
      for (let r = 0; r < e.pipelineCount; r++)
        s = e.beginRenderPass(this.commandEncoder, this.view, r), e.dispatchEvent(F.ON_DRAW, r), e.draw(s), e.end(this.commandEncoder, s);
    }
    const i = this.commandEncoder.finish();
    this.commandEncoder = null, m.device.queue.submit([i]), this.dimensionChanged = !1;
  }
  get resized() {
    return this.dimensionChanged;
  }
  get canvas() {
    return null;
  }
  get width() {
    return this.currentWidth;
  }
  get height() {
    return this.currentHeight;
  }
  get texture() {
    if (!this.textureObj) throw new Error("TextureRenderer is not initialized yet. You must Use TextureRenderer.init in order to initialize it");
    return this.textureObj.gpuResource;
  }
  get view() {
    if (!this.textureObj) throw new Error("TextureRenderer is not initialized yet. You must Use TextureRenderer.init in order to initialize it");
    return this.textureObj.view;
  }
}
class ut {
  constructor() {
    u(this, "color", { operation: "add", srcFactor: "one", dstFactor: "zero" });
    u(this, "alpha", { operation: "add", srcFactor: "one", dstFactor: "zero" });
  }
}
class ft extends ut {
  constructor() {
    super(), this.color.operation = "add", this.color.srcFactor = "src-alpha", this.color.dstFactor = "one-minus-src-alpha", this.alpha.operation = "add", this.alpha.srcFactor = "src-alpha", this.alpha.dstFactor = "one-minus-src-alpha";
  }
}
class lt {
  constructor(t, e) {
    u(this, "target");
    u(this, "requiredNames");
    u(this, "bindgroupResources", {});
    u(this, "vertexShader", {});
    u(this, "fragmentShader", {});
    if (this.target = t, e) {
      this.requiredNames = {};
      for (let s in e)
        this.requiredNames[s] = t.getResourceName(e[s]);
    }
  }
  apply(t = null, e = null) {
    let s;
    for (let r in this.target.resources.bindgroups) {
      s = this.target.resources.bindgroups[r];
      break;
    }
    for (let r in this.bindgroupResources) s[r] = this.bindgroupResources[r];
    let i = this.target.resources.vertexShader;
    if (typeof i == "string" && (i = { main: i }), this.vertexShader.outputs) {
      i.outputs || (i.outputs = {});
      for (let r in this.vertexShader.outputs)
        i.outputs[r] = this.vertexShader.outputs[r];
    }
    if (this.vertexShader.inputs) {
      i.inputs || (i.inputs = {});
      for (let r in this.vertexShader.inputs)
        i.inputs[r] = this.vertexShader.inputs[r];
    }
    if (this.vertexShader.constants && (i.constants || (i.constants = ""), i.constants += this.vertexShader.constants), this.vertexShader.main) {
      let r;
      typeof this.vertexShader.main == "string" ? r = this.vertexShader.main : r = this.vertexShader.main.join(`
`), t ? t.text = r : (i.main || (i.main = ""), i.main += r);
    }
    this.target.resources.vertexShader = i;
    let n = this.target.resources.fragmentShader;
    if (typeof n == "string" && (n = { main: n }), this.fragmentShader.outputs) {
      n.outputs || (n.outputs = {});
      for (let r in this.fragmentShader.outputs)
        n.outputs[r] = this.fragmentShader.outputs[r];
    }
    if (this.fragmentShader.inputs) {
      n.inputs || (n.inputs = {});
      for (let r in this.fragmentShader.inputs)
        n.inputs[r] = this.fragmentShader.inputs[r];
    }
    if (this.fragmentShader.constants && (n.constants || (n.constants = ""), n.constants += this.fragmentShader.constants), this.fragmentShader.main) {
      let r;
      typeof this.fragmentShader.main == "string" ? r = this.fragmentShader.main : r = this.fragmentShader.main.join(`
`), e ? e.text = r : (n.main || (n.main = ""), n.main += r);
    }
    return this.target.resources.fragmentShader = n, this.target.initFromObject(this.target.resources), this;
  }
}
class G {
}
u(G, "Float", { type: "f32" }), u(G, "Vec2", { type: "vec2<f32>" }), u(G, "Vec3", { type: "vec3<f32>" }), u(G, "Vec4", { type: "vec4<f32>" }), u(G, "Int", { type: "i32" }), u(G, "IVec2", { type: "vec2<i32>" }), u(G, "IVec3", { type: "vec3<i32>" }), u(G, "IVec4", { type: "vec4<i32>" }), u(G, "Uint", { type: "u32" }), u(G, "UVec2", { type: "vec2<u32>" }), u(G, "UVec3", { type: "vec3<u32>" }), u(G, "UVec4", { type: "vec4<u32>" });
class ct extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "float32", e), typeof t != "number" && (this.datas = t);
  }
}
class dt extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "float32x2", e), typeof t != "number" && (this.datas = t);
  }
}
class pt extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "float32x3", e), typeof t != "number" && (this.datas = t);
  }
}
class gt extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "float32x4", e), typeof t != "number" && (this.datas = t);
  }
}
class mt extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "sint32", e), typeof t != "number" && (this.datas = t);
  }
}
class yt extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "sint32x2", e), typeof t != "number" && (this.datas = t);
  }
}
class vt extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "sint32x3", e), typeof t != "number" && (this.datas = t);
  }
}
class xt extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "sint32x4", e), typeof t != "number" && (this.datas = t);
  }
}
class bt extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "uint32", e), typeof t != "number" && (this.datas = t);
  }
}
class Tt extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "uint32x2", e), typeof t != "number" && (this.datas = t);
  }
}
class _t extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "uint32x3", e), typeof t != "number" && (this.datas = t);
  }
}
class Bt extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "uint32x4", e), typeof t != "number" && (this.datas = t);
  }
}
export {
  ft as AlphaBlendMode,
  Y as Bindgroup,
  le as Bindgroups,
  ut as BlendMode,
  b as BuiltIns,
  Ee as ComputePipeline,
  Ue as ComputeShader,
  ve as CubeMapTexture,
  fe as DepthStencilTexture,
  st as DepthTextureArray,
  Z as EventDispatcher,
  Ve as Float,
  ct as FloatBuffer,
  Be as FragmentShader,
  Ge as GPURenderer,
  ie as GPUType,
  ue as HighLevelParser,
  $e as IVec2,
  yt as IVec2Buffer,
  qe as IVec3,
  vt as IVec3Buffer,
  Me as IVec4,
  Je as IVec4Array,
  xt as IVec4Buffer,
  R as ImageTexture,
  J as ImageTextureArray,
  ne as ImageTextureIO,
  De as IndexBuffer,
  We as Int,
  mt as IntBuffer,
  et as Matrix3x3,
  ye as Matrix4x4,
  tt as Matrix4x4Array,
  it as MultiSampleTexture,
  ze as Pipeline,
  lt as PipelinePlugin,
  O as PrimitiveFloatUniform,
  P as PrimitiveIntUniform,
  D as PrimitiveUintUniform,
  we as RenderPassTexture,
  F as RenderPipeline,
  pe as ShaderNode,
  Oe as ShaderStage,
  z as ShaderStruct,
  G as ShaderType,
  Se as Texture,
  ht as TextureRenderer,
  he as TextureSampler,
  Qe as UVec2,
  Tt as UVec2Buffer,
  Ze as UVec3,
  _t as UVec3Buffer,
  Le as UVec4,
  Ke as UVec4Array,
  Bt as UVec4Buffer,
  Xe as Uint,
  bt as UintBuffer,
  V as UniformBuffer,
  re as UniformGroup,
  U as UniformGroupArray,
  He as Vec2,
  dt as Vec2Buffer,
  Ye as Vec3,
  pt as Vec3Buffer,
  Ce as Vec4,
  Fe as Vec4Array,
  gt as Vec4Buffer,
  I as VertexAttribute,
  E as VertexBuffer,
  H as VertexBufferIO,
  Ie as VertexShader,
  nt as VertexShaderDebuggerPipeline,
  Q as VideoTexture,
  m as XGPU
};
