var Pe = Object.defineProperty;
var De = (b, t, e) => t in b ? Pe(b, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : b[t] = e;
var u = (b, t, e) => (De(b, typeof t != "symbol" ? t + "" : t, e), e);
import { mat4 as q, vec3 as Q } from "gl-matrix";
class v {
  static __initDebug() {
    let t;
    for (let e in this.vertexDebug)
      t = this.vertexDebug[e](), this.vertexDebug[e].isArray = !!t.isArray, this.vertexDebug[e].len = t.len, this.vertexDebug[e].primitiveType = t.primitiveType, this.vertexDebug[e].type = t.type, this.vertexDebug[e].__debug = !0;
  }
}
u(v, "vertexInputs", {
  vertexIndex: { builtin: "@builtin(vertex_index)", type: "u32" },
  instanceIndex: { builtin: "@builtin(instance_index)", type: "u32" }
}), u(v, "vertexOutputs", {
  position: { builtin: "@builtin(position)", type: "vec4<f32>" },
  Float: { type: "f32", vsOut: !0 },
  Vec2: { type: "vec2<f32>", vsOut: !0 },
  Vec3: { type: "vec3<f32>", vsOut: !0 },
  Vec4: { type: "vec4<f32>", vsOut: !0 }
}), u(v, "vertexDebug", {
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
u(v, "fragmentInputs", {
  frontFacing: { builtin: "@builtin(front_facing)", type: "bool" },
  fragDepth: { builtin: "@builtin(frag_depth)", type: "f32" },
  sampleIndex: { builtin: "@builtin(sample_index)", type: "u32" },
  sampleMask: { builtin: "@builtin(sample_mask)", type: "u32" }
}), u(v, "fragmentOutputs", {
  color: { builtin: "@location(0)", type: "vec4<f32>" }
}), //----
u(v, "computeInputs", {
  localInvocationId: { builtin: "@builtin(local_invocation_id)", type: "vec3<u32>" },
  localInvocationIndex: { builtin: "@builtin(local_invocation_index)", type: "u32" },
  globalInvocationId: { builtin: "@builtin(global_invocation_id)", type: "vec3<u32>" },
  workgroupId: { builtin: "@builtin(workgroup_id)", type: "vec3<u32>" },
  numWorkgroup: { builtin: "@builtin(num_workgroup)", type: "vec3<u32>" }
}), u(v, "computeOutputs", {
  result: { builtin: "@location(0)", type: "???" }
});
const K = class {
  static build(t, e, s) {
    let i = {}, r = /* @__PURE__ */ new Set(), n = [{ id: e, names: s }];
    for (; n.length > 0; ) {
      let a = n.pop(), o = a.id, l = a.names;
      if (!r.has(o)) {
        for (let f in t) {
          let c = t[f], h = o | c, d = [...new Set(l.concat(f))];
          h in i ? i[h] = [...new Set(i[h].concat(d))] : (i[h] = d, n.push({ id: h, names: d }));
        }
        r.add(o);
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
    return this._instance || new K(), new Promise(async (t) => {
      this.ready || (this.bufferUsage = await this.getResult(GPUBufferUsage), this.shaderStage = await this.getResult(GPUShaderStage), this.textureUsage = await this.getResult(GPUTextureUsage), this.ready = !0), t();
    });
  }
  constructor() {
    if (K._instance)
      throw new Error("WebGPUProperties is not instanciable");
    K._instance = this;
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
let V = K;
u(V, "ready", !1), u(V, "textureUsage"), u(V, "bufferUsage"), u(V, "shaderStage"), u(V, "_instance");
const ye = class {
  static get ready() {
    return this._ready;
  }
  static debugUsage(t) {
    return V.getBufferUsageById(t);
  }
  static debugTextureUsage(t) {
    return V.getTextureUsageById(t);
  }
  static debugShaderStage(t) {
    return V.getShaderStageById(t);
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
  static init(t) {
    return this.requestAdapterOptions = t, v.__initDebug(), new Promise(async (e, s) => {
      if (this.gpuDevice) {
        e(this);
        return;
      }
      const i = await navigator.gpu.requestAdapter(t);
      i ? (this.gpuDevice = await i.requestDevice(), this.deviceId++, this.deviceLost = !1, this.gpuDevice.lost.then((r) => {
        console.clear(), console.error(`WebGPU device was lost: ${r.message}`), this.gpuDevice = null, this._ready = !1, this.deviceLost = !0, this.deviceLostTime = (/* @__PURE__ */ new Date()).getTime(), (this.losingDevice || r.reason != "destroyed") && (this.losingDevice = !1, ye.init(this.requestAdapterOptions));
      }), await V.init(), this.debugUsage(172), this._ready = !0, e(this)) : s();
    });
  }
  static get device() {
    if (this.deviceLost)
      return null;
    if (!this.gpuDevice && !this.ready)
      throw new Error("you must use XGPU.init() to get the reference of the gpuDevice");
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
let g = ye;
u(g, "showVertexShader", !1), u(g, "showFragmentShader", !1), u(g, "showComputeShader", !1), u(g, "showVertexDebuggerShader", !1), u(g, "_ready", !1), u(g, "gpuDevice"), u(g, "requestAdapterOptions"), u(g, "losingDevice", !1), u(g, "deviceLost", !1), u(g, "deviceLostTime"), u(g, "deviceId", -1), u(g, "_preferedCanvasFormat");
class fe {
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
      i(this, e), i.removeAfter && this.removeEventListener(t, i);
    });
  }
}
class X {
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
          else
            throw new Error("invalid primitive type");
          break;
        case "v":
          if (t.substring(e, e + 3) === "vec") {
            this._isVector = !0;
            const r = Number(t.substring(e + 3, e + 4));
            if (r >= 2 && r <= 4)
              this._vecType = r, this.getPrimitiveDataType(t, e + 5), this._primitive === "f16" ? (this._sizeOf = 2 * r, r === 2 ? this._alignOf = 4 : r === 3 ? this._alignOf = 8 : r === 4 && (this._alignOf = 8)) : (this._sizeOf = 4 * r, r === 2 ? this._alignOf = 8 : r === 3 ? this._alignOf = 16 : r === 4 && (this._alignOf = 16));
            else
              throw new Error("invalid vec type");
          } else
            throw new Error("invalid primitive type");
          break;
        case "a":
          if (t.substring(e, e + 5) === "array") {
            this._isArray = !0;
            let r = 15;
            if (t.substring(6, 7) === "m" ? r = 17 : (t.substring(6, 7) === "f" || t.substring(6, 7) === "i" || t.substring(6, 7) === "u") && (r = 9), t.substring(e + r, e + r + 1) === ",") {
              let n;
              r++;
              for (let a = 1; a < 16; a++) {
                let o = t.substring(r, r + a);
                if (isNaN(Number(o)))
                  break;
                n = o;
              }
              this._arrayLen = Number(n);
            }
            this.getPrimitiveDataType(t, e + 6), this.arrayLength && (this._sizeOf *= this._arrayLen);
          } else
            throw new Error("invalid primitive type");
          break;
        case "m":
          if (t.substring(e, e + 3) === "mat") {
            this._isMatrix = !0;
            const r = Number(t.substring(e + 3, e + 4)), n = Number(t.substring(e + 5, e + 6));
            if (!isNaN(r) && !isNaN(n))
              if (this._matrixColumns = r, this._matrixRows = n, this.getPrimitiveDataType(t, e + 7), this._primitive === "f16" || this._primitive === "f32")
                this.getMatrixBytesStructure(r, n, this._primitive);
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
    const i = "mat" + t + "x" + e + "<" + s + ">", n = {
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
    this._alignOf = n[0], this._sizeOf = n[1];
  }
}
const ae = class extends Float32Array {
  constructor(e, s, i = !1) {
    super(s);
    //public uniform: Uniform;
    u(this, "name");
    u(this, "type");
    u(this, "startId", 0);
    u(this, "onChange");
    u(this, "_mustBeTransfered", !0);
    u(this, "uniformBuffer");
    u(this, "propertyNames");
    u(this, "createVariableInsideMain", !1);
    u(this, "className");
    //--------- EVENT DISPATCHER CLASS (that I can't extends because we already extends Float32Array)----
    u(this, "eventListeners", {});
    this.type = new X(e), this.createVariableInsideMain = i, this.className = this.constructor.name;
  }
  get mustBeTransfered() {
    return this._mustBeTransfered;
  }
  set mustBeTransfered(e) {
    e != this._mustBeTransfered && (e || this.dispatchEvent(ae.ON_CHANGED), this._mustBeTransfered = e);
  }
  clone() {
    const e = new ae(this.type.rawType, this, this.createVariableInsideMain);
    return e.propertyNames = this.propertyNames, e.className = this.className, e.name = this.name, e.startId = this.startId, e;
  }
  initStruct(e, s = !1) {
    if (this.type.isArray || this.type.isMatrix)
      throw new Error("initStruct doesn't accept array or matrix");
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
    if (!this.createVariableInsideMain)
      return "";
    s || (s = this.name);
    let i = this.className;
    return i === "Float" && (i = "f32"), i === "Vec2" && (i = "vec2<f32>"), i === "Vec3" && (i = "vec3<f32>"), i === "Vec4" && (i = "vec4<f32>"), "   var " + s + ":" + i + " = " + e + "." + s + `;
`;
  }
  /*
  public feedbackVertexId: number = 0;
  public feedbackInstanceId: number = 0;
  public setFeedback(vertexId: number, instanceId: number): PrimitiveFloatUniform {
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
};
let R = ae;
u(R, "ON_CHANGED", "ON_CHANGED");
const oe = class extends Int32Array {
  constructor(e, s, i = !1) {
    super(s);
    u(this, "name");
    u(this, "type");
    u(this, "startId", 0);
    u(this, "onChange");
    u(this, "_mustBeTransfered", !0);
    u(this, "uniformBuffer");
    u(this, "propertyNames");
    u(this, "createVariableInsideMain", !1);
    u(this, "className");
    //--------- EVENT DISPATCHER CLASS (that I can't extends because we already extends Int32Array)----
    u(this, "eventListeners", {});
    this.type = new X(e), this.createVariableInsideMain = i, this.className = this.constructor.name;
  }
  get mustBeTransfered() {
    return this._mustBeTransfered;
  }
  set mustBeTransfered(e) {
    e != this._mustBeTransfered && (e || this.dispatchEvent(oe.ON_CHANGED), this._mustBeTransfered = e);
  }
  clone() {
    return new oe(this.type.rawType, this, this.createVariableInsideMain);
  }
  initStruct(e, s = !1) {
    if (this.type.isArray || this.type.isMatrix)
      throw new Error("initStruct doesn't accept array or matrix");
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
  createVariable(e) {
    if (!this.createVariableInsideMain)
      return "";
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
};
let E = oe;
u(E, "ON_CHANGED", "ON_CHANGED");
const he = class extends Uint32Array {
  constructor(e, s, i = !1) {
    super(s);
    u(this, "name");
    u(this, "type");
    u(this, "startId", 0);
    u(this, "uniformBuffer");
    u(this, "onChange");
    u(this, "_mustBeTransfered", !0);
    u(this, "propertyNames");
    u(this, "createVariableInsideMain", !1);
    u(this, "className");
    //--------- EVENT DISPATCHER CLASS (that I can't extends because we already extends Uint32Array)----
    u(this, "eventListeners", {});
    this.type = new X(e), this.createVariableInsideMain = i, this.className = this.constructor.name;
  }
  get mustBeTransfered() {
    return this._mustBeTransfered;
  }
  set mustBeTransfered(e) {
    e != this._mustBeTransfered && (e || this.dispatchEvent(he.ON_CHANGED), this._mustBeTransfered = e);
  }
  clone() {
    return new he(this.type.rawType, this, this.createVariableInsideMain);
  }
  initStruct(e, s = !1) {
    if (this.type.isArray || this.type.isMatrix)
      throw new Error("initStruct doesn't accept array or matrix");
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
  createVariable(e) {
    if (!this.createVariableInsideMain)
      return "";
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
};
let P = he;
u(P, "ON_CHANGED", "ON_CHANGED");
class ke extends R {
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
class je extends R {
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
class Ye extends R {
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
class Ae extends R {
  constructor(t = 0, e = 0, s = 0, i = 0, r = !1) {
    super("vec4<f32>", [t, e, s, i], r);
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
class We extends E {
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
class $e extends E {
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
class He extends E {
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
class qe extends E {
  constructor(t = 0, e = 0, s = 0, i = 0, r = !1) {
    super("vec4<i32>", [t, e, s, i], r);
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
class Xe extends P {
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
class Ze extends P {
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
class Qe extends P {
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
class Ke extends P {
  constructor(t = 0, e = 0, s = 0, i = 0, r = !1) {
    super("vec4<u32>", [t, e, s, i], r);
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
class Je extends R {
  constructor(e) {
    let s = new Float32Array(e.length * 4);
    for (let r = 0; r < e.length; r++)
      s.set(e[r], r * 4);
    let i = "array<vec4<f32>," + e.length + ">";
    super("array<vec4<f32>," + e.length + ">", s);
    u(this, "vec4Array");
    this.className = i, this.vec4Array = e;
  }
  update() {
    let e = !1, s;
    for (let i = 0; i < this.vec4Array.length; i++)
      s = this.vec4Array[i], s.update(), s.mustBeTransfered && (e = !0, this.set(s, i * 4), s.mustBeTransfered = !1);
    this.mustBeTransfered = e;
  }
}
class et extends E {
  constructor(e) {
    let s = new Int32Array(e.length * 4);
    for (let r = 0; r < e.length; r++)
      s.set(e[r], r * 4);
    let i = "array<vec4<i32>," + e.length + ">";
    super(i, s);
    u(this, "ivec4Array");
    this.className = i, this.ivec4Array = e;
  }
  update() {
    let e = !1, s;
    for (let i = 0; i < this.ivec4Array.length; i++)
      s = this.ivec4Array[i], s.update(), s.mustBeTransfered && (e = !0, this.set(s, i * 4), s.mustBeTransfered = !1);
    this.mustBeTransfered = e;
  }
}
class tt extends P {
  constructor(e) {
    let s = new Uint32Array(e.length * 4);
    for (let r = 0; r < e.length; r++)
      s.set(e[r], r * 4);
    let i = "array<vec4<u32>," + e.length + ">";
    super(i, s);
    u(this, "uvec4Array");
    this.className = i, this.uvec4Array = e;
  }
  update() {
    let e = !1, s;
    for (let i = 0; i < this.uvec4Array.length; i++)
      s = this.uvec4Array[i], s.update(), s.mustBeTransfered && (e = !0, this.set(s, i * 4), s.mustBeTransfered = !1);
    this.mustBeTransfered = e;
  }
}
class st extends R {
  constructor() {
    super("mat3x3<f32>", new Float32Array([
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
      0
    ]));
  }
}
class Oe extends R {
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
    const e = new Oe(this);
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
    this.disableUpdate || this.mustBeTransfered && (q.identity(this), q.rotate(this, this, this._rx, Q.fromValues(1, 0, 0)), q.rotate(this, this, this._ry, Q.fromValues(0, 1, 0)), q.rotate(this, this, this._rz, Q.fromValues(0, 0, 1)), q.translate(this, this, Q.fromValues(this._x, this._y, this._z)), q.scale(this, this, Q.fromValues(this._sx, this._sy, this._sz)));
  }
}
class it extends R {
  constructor(e) {
    let s = new Float32Array(e.length * 16);
    for (let i = 0; i < e.length; i++)
      s.set(e[i], i * 16);
    super("array<mat4x4<f32>," + e.length + ">", s);
    u(this, "matrixs");
    this.matrixs = e, this.mustBeTransfered = !0, this.className = "array<mat4x4<f32>," + e.length + ">";
  }
  update() {
    let e = !1, s;
    for (let i = 0; i < this.matrixs.length; i++)
      s = this.matrixs[i], s.update(), s.mustBeTransfered && (e = !0, this.set(s, i * 16), s.mustBeTransfered = !1);
    this.mustBeTransfered = e;
  }
}
class O extends fe {
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
    e = { ...e }, this.descriptor = e, e.sampledType === void 0 && (e.sampledType = "f32"), e.usage === void 0 && (e.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT), e.format === void 0 && (e.format = "rgba8unorm"), e.label === void 0 && (e.label = "ImageTexture"), e.size === void 0 && (e.source ? (e.size = [e.source.width, e.source.height], e.source instanceof GPUTexture ? this.initFromTexture(e.source) : e.source instanceof O && e.source.isRenderPass && (this.renderPassTexture = e.source, this.renderPassTexture.addEventListener("RESOURCE_CHANGED", () => {
      this.initFromTexture(this.renderPassTexture.texture);
    }), this.initFromTexture(e.source.texture))) : e.size = [1, 1]), e.source && (this.mustBeTransfered = !0);
  }
  initFromTexture(e) {
    this.gpuResource = e, this.descriptor.format = e.format, this.descriptor.usage = e.usage, this._view = this.gpuResource.createView(), this.descriptor.source = void 0, this.useOutsideTexture = !0;
  }
  clone() {
    return new O(this.descriptor);
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
    if (this.useOutsideTexture)
      return null;
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
    this.useOutsideTexture = e instanceof GPUTexture || e instanceof O && e.isRenderPass, this.useOutsideTexture ? e instanceof GPUTexture ? (this.gpuResource = e, this._view = this.gpuResource.createView()) : (this.renderPassTexture = e, this.renderPassTexture.clearEvents("RESOURCE_CHANGED"), this.renderPassTexture.addEventListener("RESOURCE_CHANGED", () => {
      this.initFromTexture(this.renderPassTexture.texture);
    }), this.gpuResource = e.texture, this._view = this.gpuResource.createView()) : this.mustBeTransfered = !0, this.descriptor.source = e;
  }
  update(e) {
    this.renderPassTexture && !this.renderPassTexture.mustUseCopyTextureToTexture && this.renderPassTexture.applyRenderPass(e), !this.useOutsideTexture && (this.gpuResource || this.createGpuResource(), this.descriptor.source && (this.descriptor.source.width !== this.gpuResource.width || this.descriptor.source.height !== this.gpuResource.height) && (this.descriptor.size = [this.descriptor.source.width, this.descriptor.source.height], this.createGpuResource(), this.mustBeTransfered = !0), this.mustBeTransfered && (this.mustBeTransfered = !1, g.device.queue.copyExternalImageToTexture(
      { source: this.descriptor.source, flipY: !0 },
      { texture: this.gpuResource },
      this.descriptor.size
    )));
  }
  createGpuResource() {
    if (this.useOutsideTexture && this.gpuResource && this.deviceId != g.deviceId) {
      const e = this.gpuResource.xgpuObject;
      e && (e.createGpuResource(), this.gpuResource = e.gpuResource, this._view = e.view);
    }
    this.deviceId = g.deviceId, !(this.useOutsideTexture || this.gpuTextureIOs) && (this.gpuResource && (this.gpuResource.xgpuObject = null, this.gpuResource.destroy()), this.gpuResource = g.device.createTexture(this.descriptor), this.gpuResource.xgpuObject = this, this._view = this.gpuResource.createView(), this.descriptor.source && (this.mustBeTransfered = !0));
  }
  destroyGpuResource() {
    if (!(this.time && (/* @__PURE__ */ new Date()).getTime() - this.time < 100 && g.loseDeviceRecently)) {
      if (this.time = (/* @__PURE__ */ new Date()).getTime(), this.io && g.loseDeviceRecently) {
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
    return (!this.gpuResource || this.deviceId != g.deviceId) && this.createGpuResource(), {
      binding: e,
      resource: this._view
    };
  }
  setPipelineType(e) {
    e === "render" ? this.descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT : e === "compute_mixed" ? this.io === 1 ? this.descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST : this.io === 2 && (this.descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.STORAGE_BINDING) : e === "compute" && this.io !== 0 && (this.descriptor.usage = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING);
  }
}
class $ extends O {
  constructor(e) {
    e = { ...e }, e.source && !e.size && (e.size = [e.source[0].width, e.source[0].height, e.source.length]), e.dimension || (e.dimension = "2d"), e.usage === void 0 && (e.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT);
    super(e);
    u(this, "_bitmaps", []);
    u(this, "mustUpdate", []);
    e.source && (this.bitmaps = e.source);
  }
  clone() {
    return this.descriptor.source || (this.descriptor.source = this._bitmaps), new $(this.descriptor);
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
    this.gpuResource && this.gpuResource.destroy(), this.gpuResource = g.device.createTexture(this.descriptor), this._view = this.gpuResource.createView({ dimension: "2d-array", arrayLayerCount: this._bitmaps.length });
    for (let e = 0; e < this.mustUpdate.length; e++)
      this.mustUpdate[e] = !0;
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
        e = this.bitmaps[s], !(e instanceof GPUTexture) && this.mustUpdate[s] && (g.device.queue.copyExternalImageToTexture(
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
class le extends $ {
  constructor(t) {
    t = { ...t }, t.dimension || (t.dimension = "2d"), t.usage === void 0 && (t.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT), super(t), t.source && (this.sides = t.source);
  }
  clone() {
    return this.descriptor.source || (this.descriptor.source = this._bitmaps), new le(this.descriptor);
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
    for (let e = 0; e < 6; e++)
      this._bitmaps[e] = t[e];
    this.mustBeTransfered = !0, this.update();
  }
  get sides() {
    return this._bitmaps;
  }
  createGpuResource() {
    this.gpuResource && this.gpuResource.destroy(), this.gpuResource = g.device.createTexture(this.descriptor), this._view = this.gpuResource.createView({ dimension: "cube" });
    for (let t = 0; t < this.mustUpdate.length; t++)
      this.mustUpdate[t] = !0;
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
class Z {
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
    }, t.format && (this.descriptor.format = t.format), this.textures[0] = new O(this.descriptor), this.textures[1] = new O(this.descriptor), this.textures[0].io = 1, this.textures[1].io = 2, this.textures[0].resourceIO = this, this.textures[1].resourceIO = this, t.source != null && (this.textures[0].source = t.source);
  }
  clone() {
    const t = {
      source: this.textures[0].gpuResource,
      width: this.descriptor.size[0],
      height: this.descriptor.size[1],
      format: this.descriptor.format
    };
    return new Z(t);
  }
  createDeclaration(t, e, s) {
    let i = "";
    const r = t.substring(0, 1).toLowerCase() + t.slice(1);
    return i += " @binding(" + e + ") @group(" + s + ") var " + r + ` : texture_2d<f32>;
`, i += " @binding(" + (e + 1) + ") @group(" + s + ") var " + r + `_out : texture_storage_2d<rgba8unorm, write>;
`, i;
  }
  destroy() {
    this.stagingBuffer && this.stagingBuffer.destroy(), this.textures = void 0, this.onOutputData = void 0;
  }
  async getOutputData() {
    if (!this.onOutputData || !this.canCallMapAsync)
      return;
    this.outputBuffer || (this.outputBuffer = g.device.createBuffer({
      size: this.width * this.height * 4 * 4,
      usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      mappedAtCreation: !1
    }), this.stagingBuffer = g.createStagingBuffer(this.outputBuffer.size));
    var t = this.textures[0].gpuResource;
    const e = g.device.createCommandEncoder(), s = this.stagingBuffer;
    e.copyTextureToBuffer({ texture: t }, { buffer: this.outputBuffer, bytesPerRow: Math.ceil(this.width * 4 / 256) * 256, rowsPerImage: this.height }, [this.width, this.height, 1]), e.copyBufferToBuffer(this.outputBuffer, 0, s, 0, s.size), g.device.queue.submit([e.finish()]), this.canCallMapAsync = !1, await this.stagingBuffer.mapAsync(GPUMapMode.READ, 0, s.size), this.canCallMapAsync = !0;
    const r = s.getMappedRange(0, s.size).slice(0);
    s.unmap(), this.onOutputData(new Uint32Array(r));
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
class J {
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
    return new J(this.descriptor);
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
    this.gpuResource = g.device.createSampler(this.descriptor), this.deviceId = g.deviceId;
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
    return (!this.gpuResource || this.deviceId != g.deviceId) && this.createGpuResource(), {
      binding: t,
      resource: this.gpuResource
    };
  }
  setPipelineType(t) {
  }
}
class U {
  constructor(t, e = !1) {
    u(this, "groups");
    u(this, "startId", 0);
    u(this, "createVariableInsideMain", !1);
    u(this, "mustBeTransfered", !0);
    u(this, "name");
    u(this, "buffer", null);
    this.groups = t, this.createVariableInsideMain = e;
  }
  get uniformBuffer() {
    return this.buffer;
  }
  set uniformBuffer(t) {
    this.buffer = t, t && (t.mustBeTransfered = !0);
    for (let e = 0; e < this.groups.length; e++)
      this.groups[e].uniformBuffer = t;
  }
  clone() {
    const t = [...this.groups];
    for (let s = 0; s < t.length; s++)
      t[s] = t[s].clone();
    const e = new U(t, this.createVariableInsideMain);
    return e.startId = this.startId, e.name = this.name, e;
  }
  get type() {
    return { nbComponent: this.arrayStride, isUniformGroup: !0, isArray: !0 };
  }
  copyIntoDataView(t, e) {
    let s;
    for (let i = 0; i < this.groups.length; i++)
      s = this.groups[i], s.copyIntoDataView(t, e), e += s.arrayStride;
  }
  getStructName(t) {
    return t ? t[0].toUpperCase() + t.slice(1) : null;
  }
  getVarName(t) {
    return t ? t[0].toLowerCase() + t.slice(1) : null;
  }
  createVariable(t) {
    if (!this.createVariableInsideMain)
      return "";
    const e = this.getVarName(this.name);
    return "   var " + e + ":array<" + this.getStructName(this.name) + "," + this.length + "> = " + this.getVarName(t) + "." + e + `;
`;
  }
  update(t, e = !1) {
    for (let s = 0; s < this.groups.length; s++)
      this.groups[s].update(t, !1);
  }
  forceUpdate() {
    for (let t = 0; t < this.groups.length; t++)
      this.groups[t].forceUpdate();
  }
  getElementById(t) {
    return this.groups[t];
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
}
class N {
  constructor(t, e) {
    u(this, "unstackedItems", {});
    u(this, "items");
    u(this, "itemNames", []);
    u(this, "arrayStride", 0);
    u(this, "startId", 0);
    u(this, "createVariableInsideMain", !1);
    u(this, "mustBeTransfered", !0);
    u(this, "_name");
    u(this, "wgsl");
    u(this, "wgslStructNames", []);
    /*an uniformGroup can be used multiple times, not necessarily in an array so we must 
    so we must store the name we use when we build the 'struct' in order to write a 'struct' 
    for every properties while being sure we don't have two sames structs*/
    u(this, "datas");
    u(this, "dataView");
    u(this, "buffer", null);
    this.createVariableInsideMain = !!e;
    let s;
    for (let i in t) {
      if (s = t[i], !(s instanceof R || s instanceof E || s instanceof P || s instanceof N || s instanceof U))
        throw new Error("UniformGroup accept only PrimitiveFloatUniform, PrimitiveIntUniform, PrimitiveUintUniform, UniformGroup and UniformGroupArray");
      this.add(i, s, this.createVariableInsideMain, !1);
    }
    this.items = this.stackItems(t);
  }
  set(t) {
    this.datas = t, this.dataView = new DataView(t, 0, t.byteLength), this.mustBeTransfered = !0;
  }
  get uniformBuffer() {
    return this.buffer;
  }
  set uniformBuffer(t) {
    this.buffer = t, t && (t.mustBeTransfered = !0);
    for (let e = 0; e < this.items.length; e++)
      this.items[e].uniformBuffer = t;
  }
  destroy() {
    console.warn("uniformGroup.destroy"), this.unstackedItems = {}, this.items = [], this.itemNames = [], this.arrayStride = 0, this.startId = 0, this.mustBeTransfered = !0, this.datas = null, this.buffer = null, this.wgsl = null, this._name = null, this.uniformBuffer = null;
  }
  get name() {
    return this._name;
  }
  set name(t) {
    this._name = this.getStructName(t);
  }
  clone(t) {
    const e = { ...this.unstackedItems };
    if (t)
      for (let i = 0; i < t.length; i++)
        e[t[i]] = e[t[i]].clone();
    else
      for (let i in e)
        e[i] = e[i].clone();
    const s = new N(e);
    return s.name = this.name, s;
  }
  remove(t) {
    for (let e = 0; e < this.items.length; e++)
      if (this.items[e].name === t) {
        const s = this.items.splice(e, 1)[0];
        return this.itemNames.splice(this.itemNames.indexOf(t), 1), s;
      }
    return null;
  }
  add(t, e, s = !1, i = !0) {
    e.uniformBuffer = this.uniformBuffer, e.name = t, e.mustBeTransfered = !0, (this.uniformBuffer && this.uniformBuffer.descriptor.useLocalVariable || s) && (e.createVariableInsideMain = !0);
    const r = !!this.unstackedItems[t];
    if (this.unstackedItems[t] = e, r) {
      for (let n = 0; n < this.items.length; n++)
        if (this.items[n].name === t) {
          this.items[n] = e;
          break;
        }
    } else
      this.itemNames.push(t);
    return i && (this.items = this.stackItems(this.unstackedItems)), this.wgsl && (this.wgsl = this.getStruct(this.name)), this.uniformBuffer && (this.uniformBuffer.mustBeTransfered = !0), e;
  }
  getElementByName(t) {
    for (let e = 0; e < this.items.length; e++)
      if (this.items[e].name === t)
        return this.items[e];
    return null;
  }
  getStructName(t) {
    return t ? t[0].toUpperCase() + t.slice(1) : null;
  }
  getVarName(t) {
    return t ? t[0].toLowerCase() + t.slice(1) : null;
  }
  createVariable(t) {
    if (!this.createVariableInsideMain)
      return "";
    const e = this.getVarName(this.name);
    return "   var " + e + ":" + this.getStructName(this.name) + " = " + this.getVarName(t) + "." + e + `;
`;
  }
  updateStack() {
    this.items = this.stackItems(this.items);
  }
  forceUpdate() {
    for (let t = 0; t < this.items.length; t++)
      (this.items[t] instanceof N || this.items[t] instanceof U) && this.items[t].forceUpdate(), this.items[t].mustBeTransfered = !0;
  }
  get type() {
    return {
      nbComponent: this.arrayStride,
      isUniformGroup: !0,
      isArray: !1
    };
  }
  setDatas(t, e = null, s = 0) {
    e || (e = this.dataView);
    const i = t.startId + s, r = t.type;
    switch (r.primitive) {
      case "f32":
        for (let a = 0; a < r.nbValues; a++)
          e.setFloat32((i + a) * 4, t[a], !0);
        break;
      case "i32":
        for (let a = 0; a < r.nbValues; a++)
          e.setInt32((i + a) * 4, t[a], !0);
        break;
      case "u32":
        for (let a = 0; a < r.nbValues; a++)
          e.setUint32((i + a) * 4, t[a], !0);
        break;
    }
  }
  copyIntoDataView(t, e) {
    let s;
    for (let i = 0; i < this.items.length; i++)
      s = this.items[i], s instanceof N || s instanceof U ? s.copyIntoDataView(t, e + s.startId) : this.setDatas(s, t, e);
  }
  async update(t, e = !1) {
    if (e === !1) {
      g.device.queue.writeBuffer(
        t,
        this.startId,
        this.datas,
        0,
        this.arrayStride * Float32Array.BYTES_PER_ELEMENT
      );
      return;
    }
    let s;
    for (let i = 0; i < this.items.length; i++)
      s = this.items[i], s.type.isUniformGroup || s.update(), s.mustBeTransfered && (s instanceof N || s instanceof U ? s.update(t, !1) : (this.setDatas(s), g.device.queue.writeBuffer(
        t,
        s.startId * Float32Array.BYTES_PER_ELEMENT,
        s.buffer,
        s.byteOffset,
        s.byteLength
      )), s.mustBeTransfered = !1);
  }
  getStruct(t) {
    this.name = t;
    let e = "struct " + this.name + ` {
`, s, i = "", r = "", n = "", a;
    for (let o = 0; o < this.items.length; o++)
      if (s = this.items[o], s instanceof N || s instanceof U)
        s instanceof N ? (s.wgsl || (a = s.getStruct(s.name), i += a.localVariables + `
`, s.wgslStructNames.push(s.name)), r.indexOf(s.wgsl.struct) === -1 && (r = s.wgsl.struct + r), e += "    " + this.getVarName(s.name) + ":" + s.name + `,
`, i += s.createVariable(this.name)) : (t = s.name, s.groups[0].wgsl || (a = s.groups[0].getStruct(s.name), i += a.localVariables), r.indexOf(s.groups[0].wgsl.struct) === -1 && (r = s.groups[0].wgsl.struct + r), e += "    " + t + ":array<" + this.getStructName(t) + "," + s.length + `>,
`, i += s.createVariable(this.name));
      else {
        let l = s;
        if (l.propertyNames) {
          let f = l.createStruct();
          n.indexOf(f) === -1 && r.indexOf(f) === -1 && e.indexOf(f) === -1 && (n += f + `
`), e += "     @size(16) " + l.name + ":" + l.className + `,
`;
        } else if (l.type.isArray)
          if (l.type.isArrayOfMatrixs) {
            let f = l.type.matrixColumns, c = 4;
            l.type.matrixRows === 2 && (c = 2), e += "    @size(" + l.type.arrayLength * f * c * 4 + ") " + l.name + ":" + l.type.dataType + `,
`;
          } else
            e += "    @size(" + l.type.arrayLength * 16 + ") " + l.name + ":" + l.type.dataType + `,
`;
        else
          e += "    " + l.name + ":" + l.type.dataType + `,
`;
        l.createVariableInsideMain && (i += l.createVariable(this.getVarName(this.name)));
      }
    return e += `}

`, e = n + r + e, this.wgsl = {
      struct: e,
      localVariables: i
    }, this.wgsl;
  }
  stackItems(t) {
    const e = [];
    let s = 1;
    var i = [], r = [], n = [];
    let a, o, l, f = 0;
    for (let d in t)
      if (a = t[d], a.name = d, o = a.type, a instanceof U)
        a.startId = f, f += a.arrayStride, e.push(a);
      else if (o.isArray)
        a.startId = f, o.isArrayOfMatrixs ? f += o.matrixRows * 4 * o.arrayLength : f += 4 * o.arrayLength, s = 4, e.push(a);
      else if (o.isMatrix) {
        a.startId = f;
        let m = o.matrixColumns, p = 4;
        o.matrixRows === 2 && (p = 2), f += m * p, s = p, e.push(a);
      } else
        o.isUniformGroup ? o.nbComponent >= 4 && (s = 4, a.startId = f, f += Math.ceil(o.nbComponent / 4) * 4, e.push(a)) : a.propertyNames ? (s = 4, a.startId = f, f += 4, e.push(a)) : (l = o.nbValues, l === 1 ? i.push(a) : l === 2 ? (s < 2 && (s = 2), r.push(a)) : l === 3 ? (s = 4, n.push(a)) : l >= 4 && (s = 4, a.startId = f, f += l, e.push(a)));
    const c = () => {
      if (a = n.shift(), a.startId = f, f += 3, e.push(a), i.length) {
        const d = i.shift();
        d.startId = f, e.push(d);
      }
      f++;
    };
    let h = n.length;
    for (let d = 0; d < h; d++)
      c();
    h = r.length;
    for (let d = 0; d < h; d++)
      a = r.shift(), a.startId = f, f += 2, e.push(a);
    h = i.length;
    for (let d = 0; d < h; d++)
      a = i.shift(), a.startId = f, f++, e.push(a);
    return f % s !== 0 && (f += s - f % s), this.arrayStride = f, this.datas = new ArrayBuffer(f * 4), this.dataView = new DataView(this.datas, 0, this.datas.byteLength), this.items = e, this.copyIntoDataView(this.dataView, 0), e;
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
}
class A {
  constructor(t, e) {
    u(this, "gpuResource");
    u(this, "descriptor");
    u(this, "group");
    u(this, "cloned", !1);
    //------------------------------
    u(this, "_bufferType");
    u(this, "time");
    //public get bufferType(): string { return "uniform"; }
    u(this, "_usage");
    u(this, "debug");
    u(this, "shaderVisibility");
    u(this, "pipelineType");
    this.descriptor = e ? { ...e } : {}, this.group = new N(t, this.descriptor.useLocalVariable), this.group.uniformBuffer = this;
  }
  get mustBeTransfered() {
    return this.group.mustBeTransfered;
  }
  set mustBeTransfered(t) {
    this.group.mustBeTransfered = t;
  }
  clone(t) {
    const e = { ...this.group.unstackedItems };
    if (t)
      for (let i in e)
        t.indexOf(i) !== -1 && (e[i] = e[i].clone());
    else
      for (let i in e)
        e[i] = e[i].clone();
    const s = new A(e, this.descriptor);
    return s.cloned = !0, s.name = this.name, s;
  }
  add(t, e, s = !1) {
    return this.group.add(t, e, s);
  }
  remove(t) {
    return this.group.remove(t);
  }
  update() {
    this.gpuResource || this.createGpuResource(), this.group.update(this.gpuResource, !0), this.mustBeTransfered = !1;
  }
  createStruct(t) {
    return this.group.getStruct(t);
  }
  createDeclaration(t, e, s = 0) {
    const i = t.substring(0, 1).toUpperCase() + t.slice(1), r = t.substring(0, 1).toLowerCase() + t.slice(1);
    return this.bufferType === "uniform" ? "@binding(" + e + ") @group(" + s + ") var<uniform> " + r + ":" + i + `;
` : "@binding(" + e + ") @group(" + s + ") var<storage, read> " + r + ":" + i + `;
`;
  }
  getUniformById(t) {
    return this.group.items[t];
  }
  getUniformByName(t) {
    return this.group.getElementByName(t);
  }
  get bufferType() {
    return this._bufferType;
  }
  createGpuResource() {
    if (!this.gpuResource) {
      const t = this.group.arrayStride * Float32Array.BYTES_PER_ELEMENT;
      let e = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
      this.bufferType === "read-only-storage" && (e = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST), this.gpuResource = g.device.createBuffer({
        size: t,
        usage: e
      }), this.update();
    }
  }
  getItemsAsArray() {
    const t = [];
    for (let e = 0; e < this.itemNames.length; e++)
      t[e] = this.items[this.itemNames[e]];
    return t;
  }
  destroyGpuResource() {
    if (this.time && (/* @__PURE__ */ new Date()).getTime() - this.time < 100 && g.loseDeviceRecently && this.gpuResource) {
      this.group.updateStack();
      return;
    }
    this.time = (/* @__PURE__ */ new Date()).getTime(), this.gpuResource && (this.group.updateStack(), this.group.forceUpdate(), this.gpuResource.destroy()), this.gpuResource = null;
  }
  createBindGroupLayoutEntry(t) {
    let e = "uniform";
    return this.bufferType && (e = this.bufferType), {
      binding: t,
      visibility: this.descriptor.visibility,
      buffer: {
        type: e
      }
    };
  }
  createBindGroupEntry(t) {
    return this.gpuResource || this.createGpuResource(), {
      binding: t,
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
  setPipelineType(t) {
    this.pipelineType = t, t === "compute" || t === "compute_mixed" ? (this._bufferType = "read-only-storage", this.descriptor.visibility = GPUShaderStage.COMPUTE) : (this.group.arrayStride * Float32Array.BYTES_PER_ELEMENT < 65536 ? this._bufferType = "uniform" : this._bufferType = "uniform", this.descriptor.visibility = this.shaderVisibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX);
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
      const i = new X(e);
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
class G {
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
    return new G(e, [...this.properties]);
  }
  addProperty(t) {
    return t.builtin || (t.builtin = ""), this.properties.push(t), this;
  }
  getComputeVariableDeclaration(t = 0) {
    let e, s = "", i = 0;
    for (let r = 0; r < this.properties.length; r++)
      e = this.properties[r], e.type.createDeclaration && (e.type instanceof w ? (e.type.name = e.name, s += e.type.createDeclaration(t + i++, 0, !e.isOutput)) : (s += e.type.createDeclaration(t + i++), e.type.createStruct && (s += e.type.createStruct().struct)));
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
    return this.name != "Output" ? null : new G("Input", this.properties.slice(1));
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
class w {
  constructor(t, e) {
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
    u(this, "pipelineType");
    u(this, "arrayStride");
    u(this, "layout");
    u(this, "_bufferSize");
    u(this, "deviceId");
    u(this, "time");
    u(this, "destroyed", !0);
    e ? e = { ...e } : e = {}, e.stepMode || (e.stepMode = "vertex"), this.descriptor = e;
    const s = t;
    let i, r, n, a;
    for (let o in s)
      i = s[o], r = i.offset, n = i.datas, this.attributes[o] || (a = this.createArray(o, i.type, r), n && (a.datas = n));
    e.datas && (this.datas = e.datas);
  }
  clone() {
    const t = new w(this.attributeDescriptor, this.descriptor);
    t.bufferId = this.bufferId;
    let e;
    return this.datas instanceof Float32Array ? e = new Float32Array(this.datas.length) : this.datas instanceof Int32Array ? e = new Int32Array(this.datas.length) : this.datas instanceof Uint32Array && (e = new Uint32Array(this.datas.length)), e.set(this.datas), t.datas = e, t;
  }
  initBufferIO(t) {
    this.gpuBufferIOs = t;
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
  set datas(t) {
    this._datas = t, this.mustBeTransfered = !0;
  }
  setComplexDatas(t, e) {
    this._nbComponent = e, this.datas = t;
  }
  get attributeDescriptor() {
    const t = {};
    let e;
    for (let s in this.attributes)
      e = this.attributes[s], t[s] = {
        type: e.format,
        offset: e.dataOffset
      };
    return t;
  }
  createArray(t, e, s) {
    if (this.attributes[t] && this.attributes[t].vertexBuffer)
      return this.attributes[t];
    let i = this.attributes[t];
    i || (i = this.attributes[t] = new I(t, e, s)), i.vertexBuffer = this;
    const r = i.nbComponent, n = i.dataOffset === void 0 ? 0 : i.dataOffset;
    return this._nbComponent += r, i.dataOffset === void 0 ? this._byteCount += r * new X(i.varType).byteValue : this._byteCount = Math.max(this._byteCount, (n + i.nbComponent) * new X(i.varType).byteValue), this.vertexArrays.push(i), i;
  }
  getAttributeByName(t) {
    return this.attributes[t];
  }
  //----------------------------- USED WITH COMPUTE PIPELINE ----------------------------------------
  createDeclaration(t, e, s = 0, i = !0) {
    this.stackAttributes();
    let r = t.substring(0, 1).toUpperCase() + t.slice(1);
    const n = t.substring(0, 1).toLowerCase() + t.slice(1);
    let a = "", o = "storage, read", l = "array<" + r + ">";
    if (this.io === 1 || this.io === 0) {
      a += "struct " + r + `{
`;
      let f;
      for (let c = 0; c < this.vertexArrays.length; c++)
        f = this.vertexArrays[c], a += "   " + f.name + ":" + f.varType + `,
`;
      a += `}

`, l = "array<" + r + ">";
    } else
      o = "storage, read_write", r = r.slice(0, r.length - 4), l = "array<" + r + ">";
    return a += "@binding(" + e + ") @group(" + s + ") var<" + o + "> " + n + ":" + l + `;
`, a;
  }
  createBindGroupLayoutEntry(t) {
    return {
      binding: t,
      visibility: GPUShaderStage.COMPUTE,
      buffer: {
        type: this.descriptor.accessMode === "read" ? "read-only-storage" : "storage"
      }
    };
  }
  createBindGroupEntry(t) {
    this.gpuResource || this.createGpuResource();
    let e = 0;
    return this.datas && (e = this.datas.byteLength), {
      binding: t,
      resource: {
        buffer: this.gpuResource,
        offset: 0,
        size: e
      }
    };
  }
  setPipelineType(t) {
    this.pipelineType || (this.pipelineType = t, t === "render" ? (this.descriptor.accessMode || (this.descriptor.accessMode = "read"), this.descriptor.usage || (this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST)) : t === "compute_mixed" ? this.io === 1 || this.io === 0 ? (this.descriptor.usage || (this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC), this.descriptor.accessMode || (this.descriptor.accessMode = "read")) : this.io === 2 && (this.descriptor.usage || (this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC), this.descriptor.accessMode || (this.descriptor.accessMode = "read_write")) : t === "compute" && (this.io === 1 || this.io == 0 ? (this.descriptor.usage || (this.descriptor.usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC), this.descriptor.accessMode || (this.descriptor.accessMode = "read")) : this.io === 2 && (this.descriptor.usage || (this.descriptor.usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC), this.descriptor.accessMode || (this.descriptor.accessMode = "read_write"))));
  }
  //------------------------------------------------------------------------------------------------------
  createStruct(t) {
    const e = t.substring(0, 1).toUpperCase() + t.slice(1), s = [];
    let i;
    for (let r = 0; r < this.vertexArrays.length; r++)
      i = this.vertexArrays[r], s[r] = { name: i.name, type: i.varType, builtin: "" };
    return new G(e, s);
  }
  stackAttributes(t = 0) {
    const e = [];
    let s = 1;
    var i = [], r = [], n = [];
    let a, o = 0;
    for (let h = 0; h < this.vertexArrays.length; h++)
      a = this.vertexArrays[h], a.nbComponent === 1 ? i.push(a) : a.nbComponent === 2 ? (s < 2 && (s = 2), r.push(a)) : a.nbComponent === 3 ? (s = 4, n.push(a)) : a.nbComponent === 4 && (s = 4, a.dataOffset = o, o += 4, e.push(a));
    const l = () => {
      if (a = n.shift(), a.dataOffset = o, o += 3, e.push(a), i.length) {
        const h = i.shift();
        h.dataOffset = o, e.push(h);
      }
      o++;
    };
    let f = n.length;
    for (let h = 0; h < f; h++)
      l();
    f = r.length;
    for (let h = 0; h < f; h++)
      a = r.shift(), a.dataOffset = o, o += 2, e.push(a);
    f = i.length;
    for (let h = 0; h < f; h++)
      a = i.shift(), a.dataOffset = o, o++, e.push(a);
    o % s !== 0 && (o += s - o % s), this.vertexArrays = e;
    const c = [];
    for (let h = 0; h < e.length; h++)
      c[h] = {
        shaderLocation: t + h,
        offset: e[h].dataOffset * Float32Array.BYTES_PER_ELEMENT,
        format: this.vertexArrays[h].format
      };
    return this.arrayStride = o, {
      stepMode: this.descriptor.stepMode,
      arrayStride: Float32Array.BYTES_PER_ELEMENT * this.arrayStride,
      attributes: c
    };
  }
  addVertexInstance(t, e) {
    const s = t * this.arrayStride, i = this._datas;
    let r;
    for (let n in e)
      r = this.getAttributeByName(n), r && (i[s + r.dataOffset] = e[n]);
  }
  createVertexBufferLayout(t = 0) {
    if (this.gpuBufferIOs)
      return this.stackAttributes(t);
    let e = this._nbComponent;
    this.nbComponentData && (e = this.nbComponentData);
    const s = {
      stepMode: this.descriptor.stepMode,
      arrayStride: Float32Array.BYTES_PER_ELEMENT * e,
      attributes: []
    };
    let i = 0, r;
    for (let n = 0; n < this.vertexArrays.length; n++)
      r = i, this.vertexArrays[n].dataOffset !== void 0 && (r = i = this.vertexArrays[n].dataOffset), s.attributes[n] = {
        shaderLocation: t + n,
        offset: r * Float32Array.BYTES_PER_ELEMENT,
        format: this.vertexArrays[n].format
      }, i += this.vertexArrays[n].nbComponent;
    return s.arrayStride = Math.max(this._byteCount, e * Float32Array.BYTES_PER_ELEMENT), this.layout = s, s;
  }
  get bufferSize() {
    return this._bufferSize;
  }
  createGpuResource() {
    this.attributeChanged && this.updateAttributes(), !(!this.datas || this.gpuBufferIOs) && (this.gpuResource && this.gpuResource.destroy(), this.deviceId = g.deviceId, this._bufferSize = this.datas.byteLength, this.gpuResource = g.device.createBuffer({
      size: this.datas.byteLength,
      usage: this.descriptor.usage,
      mappedAtCreation: !1
    }), this.destroyed = !1, this.mustBeTransfered = !0);
  }
  destroyGpuResource() {
    if (!this.destroyed && !(this.time && (/* @__PURE__ */ new Date()).getTime() - this.time < 100 && g.loseDeviceRecently)) {
      if (this.time = (/* @__PURE__ */ new Date()).getTime(), this.io && g.loseDeviceRecently) {
        if (this.io === 1) {
          const t = this.resourceIO, e = t.buffers;
          this.setPipelineType(this.pipelineType);
          const s = t.currentDatas ? t.currentDatas : e[0]._datas;
          e[0]._datas instanceof Float32Array ? e[0]._datas = e[1]._datas = new Float32Array(s) : e[0]._datas instanceof Int32Array ? e[0]._datas = e[1]._datas = new Int32Array(s) : e[0]._datas instanceof Uint32Array && (e[0]._datas = e[1]._datas = new Uint32Array(s));
          let i = e[0].gpuBufferIOs;
          e[0].gpuBufferIOs = null, e[0].createGpuResource(), e[0].gpuBufferIOs = i, i = e[1].gpuBufferIOs, e[1].gpuBufferIOs = null, e[1].createGpuResource(), e[1].gpuBufferIOs = i, e[0].gpuBufferIOs[0] = e[0].gpuResource, e[0].gpuBufferIOs[1] = e[1].gpuResource;
        }
        return;
      }
      this.destroyed = !0, this.resourceIO && (this.resourceIO.destroy(), this.resourceIO = null), this.gpuResource && (this.gpuResource.destroy(), this.gpuResource = null);
    }
  }
  updateBuffer() {
    this.datas && (this.gpuResource || this.createGpuResource(), this.datas.byteLength != this._bufferSize && this.createGpuResource(), g.device.queue.writeBuffer(this.gpuResource, 0, this.datas.buffer));
  }
  getVertexArrayById(t) {
    return this.vertexArrays[t];
  }
  updateAttributes() {
    let t;
    t = this.vertexArrays[0];
    const e = this.vertexArrays.length;
    let s = 0;
    if (this.vertexArrays[0] && this.vertexArrays[0].useByVertexData) {
      const i = t.datas.length;
      this._datas || (this._datas = new Float32Array(i * this.nbComponent));
      for (let r = 0; r < i; r++)
        for (let n = 0; n < e; n++)
          t = this.vertexArrays[n], t.mustBeTransfered && this._datas.set(t.datas[r], s), s += t.nbComponent;
    } else {
      const i = t.datas.length / t.nbComponent;
      this._datas || (this._datas = new Float32Array(i * this.nbComponent));
      for (let r = 0; r < e; r++)
        t = this.vertexArrays[r], t.mustBeTransfered && this._datas.set(t.datas, s), s += t.nbComponent;
    }
    for (let i = 0; i < e; i++)
      this.vertexArrays[i].mustBeTransfered = !1;
    this.attributeChanged = !1, this.mustBeTransfered = !0;
  }
  update() {
    return this.vertexArrays.length === 0 ? !1 : (this.attributeChanged && this.updateAttributes(), this.mustBeTransfered && (this.mustBeTransfered = !1, this.updateBuffer()), !0);
  }
}
class z {
  constructor(t, e) {
    u(this, "buffers", []);
    u(this, "descriptor");
    u(this, "onOutputData");
    u(this, "stagingBuffer");
    u(this, "canCallMapAsync", !0);
    u(this, "deviceId");
    u(this, "currentDatas");
    u(this, "view");
    u(this, "dataStructureChanged", !1);
    u(this, "nextDatas");
    u(this, "attributeDesc");
    e ? e = { ...e } : e = {}, this.descriptor = e, e.stepMode || (e.stepMode = "instance"), this.deviceId = g.deviceId, this.buffers[0] = new w(t, e), this.buffers[1] = new w(t, e), this.buffers[0].io = 1, this.buffers[1].io = 2, this.buffers[0].resourceIO = this, this.buffers[1].resourceIO = this;
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
    this.deviceId != g.deviceId && (this.deviceId = g.deviceId, this.canCallMapAsync = !0, this.stagingBuffer = null, this.currentDatas = this.buffers[0].datas);
  }
  async getOutputData() {
    this.rebuildAfterDeviceLost();
    const t = this.buffers[0].buffer;
    if (!this.onOutputData)
      return null;
    if (!this.canCallMapAsync)
      return;
    this.canCallMapAsync = !1, this.stagingBuffer || (this.stagingBuffer = g.createStagingBuffer(this.bufferSize));
    const e = g.device.createCommandEncoder(), s = this.stagingBuffer;
    e.copyBufferToBuffer(t, 0, s, 0, s.size), g.device.queue.submit([e.finish()]), await this.stagingBuffer.mapAsync(GPUMapMode.READ, 0, s.size), this.canCallMapAsync = !0;
    const r = s.getMappedRange(0, s.size).slice(0);
    s.unmap(), this.currentDatas = r, this.onOutputData(r);
  }
  clone() {
    return new z(this.buffers[0].attributeDescriptor, this.descriptor);
  }
  createDeclaration(t, e, s) {
    const i = t.substring(0, 1).toUpperCase() + t.slice(1), r = t.substring(0, 1).toLowerCase() + t.slice(1);
    let n = "";
    n += "struct " + i + `{
`;
    let a;
    for (let o = 0; o < this.buffers[0].vertexArrays.length; o++)
      a = this.buffers[0].vertexArrays[o], n += "   " + a.name + ":" + a.varType + `,
`;
    return n += `}

`, n += "@binding(" + e + ") @group(" + s + ") var<storage, read> " + r + ":array<" + i + `>;
`, n += "@binding(" + (e + 1) + ") @group(" + s + ") var<storage, read_write> " + r + "_out:array<" + i + `>;
`, n + `
`;
  }
  createVertexInstances(t, e) {
    this.buffers[0].arrayStride == null && this.buffers[0].stackAttributes();
    const s = this.buffers[0].attributes, i = this.buffers[0].arrayStride;
    let r;
    for (let f in s) {
      r = s[f].format;
      break;
    }
    let n;
    r === "float32" || r === "float32x2" || r === "float32x3" || r === "float32x4" ? n = new Float32Array(i * t) : r == "sint32" || r == "sint32x2" || r == "sint32x3" || r == "sint32x4" ? n = new Int32Array(i * t) : (r == "uint32" || r == "uint32x2" || r == "uint32x3" || r == "uint32x4") && (n = new Uint32Array(i * t));
    let a, o, l;
    for (let f = 0; f < t; f++) {
      o = i * f, a = e(f);
      for (let c in a)
        l = s[c], l && n.set(a[c], o + l.dataOffset);
    }
    this.datas = n;
  }
  getVertexInstances(t, e) {
    const s = this.buffers[0].arrayStride ? this.buffers[0].arrayStride : this.buffers[1].arrayStride, i = this.buffers[0].attributes;
    if (!this.view) {
      this.view = {};
      for (let c in i) {
        const h = i[c];
        let d;
        h.nbComponent === 1 ? d = { x: 0, ___offset: h.dataOffset } : h.nbComponent === 2 ? d = { x: 0, y: 0, ___offset: h.dataOffset } : h.nbComponent === 3 ? d = { x: 0, y: 0, z: 0, ___offset: h.dataOffset } : h.nbComponent === 4 && (d = { x: 0, y: 0, z: 0, w: 0, ___offset: h.dataOffset }), this.view[c] = d;
      }
    }
    const r = this.view, n = this.buffers[0].datas.length / s;
    let a, o, l, f;
    for (let c = 0; c < n; c++) {
      a = c * s;
      for (let h in i)
        l = i[h].nbComponent, o = a + i[h].dataOffset, f = r[h], f.x = t[o], l >= 2 && (f.y = t[o + 1], l >= 3 && (f.z = t[o + 2], l == 4 && (f.w = t[o + 3])));
      e(r);
    }
  }
  set datas(t) {
    this.buffers[0].datas = t, this.buffers[1].datas = t;
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
class Y {
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
    return new Y(this.descriptor);
  }
  set source(t) {
    this.gpuResource = t, this.descriptor.source = t, this.descriptor.size = [t.width, t.height];
    let e = 0;
    const s = () => {
      this.gpuResource && (g.device && this.deviceId === g.deviceId ? (this.bindgroups.forEach((i) => i.build()), e = 0) : e++, e < 30 ? t.requestVideoFrameCallback(s) : t.src = void 0);
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
    this.deviceId = g.deviceId;
  }
  destroyGpuResource() {
    this.videoFrame && (this.videoFrame.close(), this.videoFrame = null);
  }
  createBindGroupEntry(t) {
    if (this.useWebcodec && (this.videoFrame && this.videoFrame.close(), this.videoFrame = new window.VideoFrame(this.gpuResource)), !this.gpuResource)
      throw new Error("gpuResource cannot be null. You must provide a HTMLVideoElement");
    return {
      binding: t,
      resource: g.device.importExternalTexture({
        source: this.useWebcodec ? this.videoFrame : this.gpuResource
      })
    };
  }
  setPipelineType(t) {
  }
}
const ve = class {
  constructor() {
    u(this, "targetIsBindgroup");
    u(this, "parseDebugValues", (t) => {
      let e, s = [], i = [], r = {}, n = 0;
      for (let a in t)
        e = t[a], e && e.__debug == !0 && (typeof e == "function" ? e = { name: a, id: n, ...e() } : (e.id = n, e.name = a), t[a] = void 0, s[n] = new Ae(e.vertexId, e.instanceId, 0, 0), r[a] = e, i[n] = e, n++);
      return {
        nb: n,
        indexs: s,
        objectByName: r,
        objectById: i
      };
    });
    u(this, "parseVertexShaderDebug", (t) => {
      typeof t.vertexShader == "string" && (t.vertexShader = { main: t.vertexShader });
      const e = (f) => {
        let c = f.split(`
`), h, d = "";
        for (let m = 0; m < c.length; m++)
          h = c[m], !h.includes("debug.") && (d += h + `
`);
        return d;
      }, s = t.vertexShader.main;
      t.vertexShader.main = e(s);
      const i = t.__DEBUG__.objectByName, r = (f) => {
        let c = "abcdefghijklmnopqrstuvwxyz/";
        c += c.toUpperCase();
        let h;
        for (let d = 0; d < f.length; d++)
          if (h = f[d], c.includes(h))
            return f.slice(d);
        return f;
      }, n = (f) => {
        let c = "abcdefghijklmnopqrstuvwxyz0123456789_";
        c += c.toUpperCase();
        let h, d = "";
        for (let m = 0; m < f.length; m++) {
          if (h = f[m], c.includes(h)) {
            d += h;
            continue;
          }
          if (h !== " ") {
            if (h != "=")
              throw new Error(`VERTEX SHADER ERROR on this line :"debug.${f} ". The keyword "debug" must only be used to store data. It can't be used in computations.`);
            return d;
          }
        }
        return d;
      }, a = (f) => {
        let c = f.split(`
`), h, d = ";", m = [], p = {}, x, T = [], B = 0;
        for (let C = 0; C < c.length; C++)
          if (h = r(c[C]), h.slice(0, 2) != "//") {
            if (h.includes("debug."))
              if (h.slice(0, 6) === "debug.")
                if (h.split("=").length == 2) {
                  const _ = n(h.slice(6)), H = i[_];
                  if (!i[_])
                    throw new Error(`VERTEX SHADER ERROR on this line :" ${h} ". The value "debug.${_}" is used in the vertexShader but not defined in RenderPipeline.initFromObject `);
                  m.includes(_) === !1 && m.push(_), isNaN(p[_]) ? p[_] = 0 : p[_]++, x = _ + "__" + p[_], H.newName = x, i[x] = T[B++] = { ...H }, h = h.replace("debug." + _, "debug." + x);
                } else
                  throw new Error(`VERTEX SHADER ERROR on this line :" ${h} ".`);
              else
                throw new Error(`VERTEX SHADER ERROR on this line :" ${h} ". The keyword "debug" must only be used to store data. It can't be used in computations.`);
            d += h + `
`;
          }
        t.__DEBUG__.objectById = T;
        for (let C = 0; C < m.length; C++)
          i[m[C]] = void 0, delete i[m[C]];
        return d;
      }, o = (f) => {
        let c = f.split(`
`);
        for (let h = 0; h < c.length; h++)
          c[h] = c[h].split("//")[0];
        return c.join(`
`);
      };
      return t.vertexShader.debugVersion = a(o(s)), (() => {
        const f = t.__DEBUG__.objectById, c = t.__DEBUG__.objectByName;
        let h, d, m, p, x = [];
        for (let T = 0; T < f.length; T++)
          if (h = { ...f[T] }, h.type == "mat4x4<f32>")
            d = h.newName, m = d + "_m4", h.isMatrix = !0, h.realType = h.type, h.type = "vec4<f32>", c[d] = void 0, delete c[d], p = m + "0", c[p] = { ...h, newName: p }, x.push(c[p]), p = m + "1", c[p] = { ...h, newName: p }, x.push(c[p]), p = m + "2", c[p] = { ...h, newName: p }, x.push(c[p]), p = m + "3", c[p] = { ...h, newName: p }, x.push(c[p]);
          else if (h.type == "mat3x3<f32>")
            d = h.newName, m = d + "_m3", h.isMatrix = !0, h.realType = h.type, h.type = "vec3<f32>", c[d] = void 0, delete c[d], p = m + "0", c[p] = { ...h, newName: p }, x.push(c[p]), p = m + "1", c[p] = { ...h, newName: p }, x.push(c[p]), p = m + "2", c[p] = { ...h, newName: p }, x.push(c[p]), p = m + "3", c[p] = { ...h, newName: p }, x.push(c[p]);
          else if (h.isArray) {
            const B = h.type.includes("mat"), C = h.len;
            if (d = h.newName, m = d + "_ar", h.isMatrix = !1, h.realType = h.type, h.type = "vec4<f32>", h.realType.includes("i32") ? h.type = "vec4<i32>" : h.realType.includes("u32") && (h.type = "vec4<u32>"), c[d] = void 0, delete c[d], B) {
              c[d] = void 0, delete c[d];
              for (let _ = 0; _ < C; _++)
                p = m + _ + "_m0", c[p] = { ...h, newName: p }, x.push(c[p]), p = m + _ + "_m1", c[p] = { ...h, newName: p }, x.push(c[p]), p = m + _ + "_m2", c[p] = { ...h, newName: p }, x.push(c[p]), p = m + _ + "_m3", c[p] = { ...h, newName: p }, x.push(c[p]);
            } else
              for (let _ = 0; _ < C; _++)
                p = m + _, c[p] = { ...h, newName: p }, x.push(c[p]);
          } else
            x.push(h);
        t.__DEBUG__.objectById = x;
      })(), t;
    });
  }
  parseShaderBuiltins(t) {
    const e = (p, x) => {
      if (typeof t.computeShader == "string") {
        const T = t.computeShader;
        t.computeShader = {
          main: T
        };
      }
      t.computeShader.inputs || (t.computeShader.inputs = {}), t.computeShader.inputs[p] = x;
    }, s = (p, x) => {
      for (let T in v.computeInputs)
        x === v.computeInputs[T] && e(p, x);
    }, i = (p, x) => {
      if (typeof t.computeShader == "string") {
        const T = t.computeShader;
        t.computeShader = {
          main: T
        };
      }
      t.computeShader.outputs || (t.computeShader.outputs = {}), t.computeShader.outputs[p] = x;
    }, r = (p, x) => {
      for (let T in v.computeOutputs)
        x === v.computeOutputs[T] && i(p, x);
    }, n = (p, x) => {
      if (typeof t.vertexShader == "string") {
        const T = t.vertexShader;
        t.vertexShader = {
          main: T
        };
      }
      t.vertexShader.inputs || (t.vertexShader.inputs = {}), t.vertexShader.inputs[p] = x;
    }, a = (p, x) => {
      for (let T in v.vertexInputs)
        x === v.vertexInputs[T] && n(p, x);
    }, o = (p, x) => {
      if (typeof t.vertexShader == "string") {
        const T = t.vertexShader;
        t.vertexShader = {
          main: T
        };
      }
      t.vertexShader.outputs || (t.vertexShader.outputs = {}), t.vertexShader.outputs[p] = x;
    }, l = (p, x) => {
      for (let T in v.vertexOutputs)
        x === v.vertexOutputs[T] && o(p, x);
    }, f = (p, x) => {
      if (typeof t.fragmentShader == "string") {
        const T = t.fragmentShader;
        t.fragmentShader = {
          main: T
        };
      }
      t.fragmentShader.inputs || (t.fragmentShader.inputs = {}), t.fragmentShader.inputs[p] = x;
    }, c = (p, x) => {
      for (let T in v.fragmentInputs)
        x === v.vertexInputs[T] && f(p, x);
    }, h = (p, x) => {
      if (typeof t.fragmentShader == "string") {
        const T = t.fragmentShader;
        t.fragmentShader = {
          main: T
        };
      }
      t.fragmentShader.outputs || (t.fragmentShader.outputs = {}), t.fragmentShader.outputs[p] = x;
    }, d = (p, x) => {
      for (let T in v.fragmentOutputs)
        x === v.fragmentOutputs[T] && h(p, x);
    };
    let m;
    for (let p in t)
      m = t[p], m && (a(p, m), l(p, m), c(p, m), d(p, m), s(p, m), r(p, m));
    return t;
  }
  parseVertexBufferIOs(t) {
    if (this.targetIsBindgroup)
      return t;
    const e = (r, n) => (t.bindgroups || (t.bindgroups = {}), t.bindgroups.io || (t.bindgroups.io = {}), t.bindgroups.io[r] = n, n), s = (r, n) => {
      n instanceof z && e(r, n);
    };
    let i;
    for (let r in t)
      i = t[r], i && s(r, i);
    return t;
  }
  parseImageTextureIOs(t) {
    if (this.targetIsBindgroup)
      return t;
    const e = (r, n) => (t.bindgroups || (t.bindgroups = {}), t.bindgroups.io || (t.bindgroups.io = {}), t.bindgroups.io[r] = n, n), s = (r, n) => {
      n instanceof Z && e(r, n);
    };
    let i;
    for (let r in t)
      i = t[r], i && s(r, i);
    return t;
  }
  parseVertexBuffers(t) {
    if (this.targetIsBindgroup)
      return t;
    const e = (r, n) => (t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {}), t.bindgroups.default[r] = n, n), s = (r, n) => {
      n instanceof w && e(r, n);
    };
    let i;
    for (let r in t)
      i = t[r], i && s(r, i);
    return t;
  }
  parseVertexAttributes(t) {
    const e = (r, n) => {
      let a = t;
      if (this.targetIsBindgroup || (t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {}), a = t.bindgroups.default), a.buffer) {
        let o = n.offset;
        n instanceof I && (o = n.dataOffset, a.buffer.attributes[n.name] = n);
        const l = a.buffer.createArray(r, n.type, o);
        n.datas && (l.datas = n.datas);
      } else {
        const o = {};
        o[r] = n, a.buffer = new w(o);
      }
    }, s = (r, n) => {
      n.type && I.types[n.type] ? e(r, n) : n instanceof I && e(r, {
        type: n.format,
        offset: n.dataOffset,
        datas: n.datas
      });
    };
    let i;
    for (let r in t)
      i = t[r], i && s(r, i);
    return t;
  }
  parseUniformBuffers(t) {
    if (this.targetIsBindgroup)
      return t;
    const e = (r, n) => (t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {}), t.bindgroups.default[r] = n, n), s = (r, n) => {
      n instanceof A && e(r, n);
    };
    let i;
    for (let r in t)
      i = t[r], i && s(r, i);
    return t;
  }
  parseUniform(t) {
    const e = (r, n) => {
      t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {});
      let a = t.bindgroups.default, o = "uniforms";
      if (this.targetIsBindgroup && (a = t, o = t.uniformBufferName ? t.uniformBufferName : "bindgroupUniforms"), a[o])
        a[o].add(r, n);
      else {
        const l = {};
        l[r] = n, a[o] = new A(l, { useLocalVariable: !0 });
      }
    }, s = (r, n) => {
      (n instanceof R || n instanceof E || n instanceof P || n instanceof N || n instanceof U) && e(r, n);
    };
    let i;
    for (let r in t)
      i = t[r], i && s(r, i);
    return t;
  }
  parseImageTextureArray(t) {
    if (this.targetIsBindgroup)
      return t;
    const e = (r, n) => {
      t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {}), t.bindgroups.default[r] = n;
    }, s = (r, n) => {
      n instanceof $ && e(r, n);
    };
    let i;
    for (let r in t)
      i = t[r], i && s(r, i);
    return t;
  }
  parseImageTexture(t) {
    if (this.targetIsBindgroup)
      return t;
    const e = (r, n) => {
      t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {}), t.bindgroups.default[r] = n;
    }, s = (r, n) => {
      n instanceof O && e(r, n);
    };
    let i;
    for (let r in t)
      i = t[r], i && s(r, i);
    return t;
  }
  parseTextureSampler(t) {
    if (this.targetIsBindgroup)
      return t;
    const e = (r, n) => {
      t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {}), t.bindgroups.default[r] = n;
    }, s = (r, n) => {
      n instanceof J && e(r, n);
    };
    let i;
    for (let r in t)
      i = t[r], i && s(r, i);
    return t;
  }
  parseVideoTexture(t) {
    if (this.targetIsBindgroup)
      return t;
    const e = (r, n) => {
      t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {}), t.bindgroups.default[r] = n;
    }, s = (r, n) => {
      n instanceof Y && e(r, n);
    };
    let i;
    for (let r in t)
      i = t[r], i && s(r, i);
    return t;
  }
  parseCubeMapTexture(t) {
    if (this.targetIsBindgroup)
      return t;
    const e = (r, n) => {
      t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {}), t.bindgroups.default[r] = n;
    }, s = (r, n) => {
      n instanceof le && e(r, n);
    };
    let i;
    for (let r in t)
      i = t[r], i && s(r, i);
    return t;
  }
  parseDrawConfig(t, e) {
    if (t.vertexCount) {
      if (isNaN(t.vertexCount))
        throw new Error("descriptor.vertexCount is a reserved keyword and must be a number");
      e.vertexCount = t.vertexCount;
    }
    if (t.instanceCount) {
      if (isNaN(t.instanceCount))
        throw new Error("descriptor.instanceCount is a reserved keyword and must be a number");
      e.instanceCount = t.instanceCount;
    }
    if (t.firstVertexId) {
      if (isNaN(t.firstVertexId))
        throw new Error("descriptor.firstVertexId is a reserved keyword and must be a number");
      e.firstVertexId = t.firstVertexId;
    }
    if (t.firstInstanceId) {
      if (isNaN(t.firstInstanceId))
        throw new Error("descriptor.firstInstanceId is a reserved keyword and must be a number");
      e.firstInstanceId = t.firstInstanceId;
    }
    return t;
  }
  parseBindgroup(t) {
    for (let e in t)
      t[e] instanceof F && (t.bindgroups || (t.bindgroups = {}), t.bindgroups[e] = t[e], delete t[e]);
    return t;
  }
  firstPass(t, e, s) {
    return t = this.parseBindgroup(t), t = this.parseVertexBuffers(t), t = this.parseVertexAttributes(t), t = this.parseUniformBuffers(t), t = this.parseUniform(t), t = this.parseImageTexture(t), t = this.parseImageTextureArray(t), t = this.parseTextureSampler(t), t = this.parseVideoTexture(t), t = this.parseCubeMapTexture(t), t = this.parseVertexBufferIOs(t), t = this.parseImageTextureIOs(t), (e === "render" || e === "compute") && (t = this.parseShaderBuiltins(t), e === "render" && (t = this.parseDrawConfig(t, s))), t;
  }
  //--------
  parseHighLevelObj(t) {
    const e = (n) => {
      for (let a in v.vertexInputs)
        if (v.vertexInputs[a] === n)
          return !0;
      for (let a in v.vertexOutputs)
        if (v.vertexOutputs[a] === n)
          return !0;
      for (let a in v.fragmentInputs)
        if (v.fragmentInputs[a] === n)
          return !0;
      for (let a in v.fragmentOutputs)
        if (v.fragmentOutputs[a] === n)
          return !0;
      for (let a in v.computeInputs)
        if (v.computeInputs[a] === n)
          return !0;
      return !1;
    }, s = (n) => {
      let a, o, l = [];
      for (let f in n)
        o = n[f], o && (a = o.constructor.name, a === "Object" && f !== "bindgroups" && f !== "vertexShader" && f !== "fragmentShader" && f !== "computeShader" && (e(o) || l.push({ name: a, resource: o })));
      return l;
    }, i = (n) => {
      const a = [], o = [], l = [];
      let f, c, h;
      for (let d = 0; d < n.length; d++) {
        h = n[d].name, f = n[d].resource;
        for (let m in f)
          c = f[m], c instanceof R || c instanceof E || c instanceof P ? a.push({ containerName: h, name: m, resource: c }) : c instanceof I ? o.push({ containerName: h, name: m, resource: c }) : l.push({ containerName: h, name: m, resource: c });
      }
      return { primitives: a, vertexAttributes: o, shaderResources: l };
    };
    let r = s(t);
    return r.length && (t.bindgroups || (t.bindgroups = {}), t.bindgroups.default || (t.bindgroups.default = {}), i(r)), t;
  }
  //---
  findAndFixRepetitionInDataStructure(t) {
    let e, s, i = {}, r, n, a;
    for (let o in t.bindgroups) {
      r = t.bindgroups[o];
      for (let l in r) {
        if (n = r[l], n instanceof A) {
          a = !0;
          for (let f = n.itemNames.length - 1; f >= 0; f--)
            e = n.itemNames[f], s = n.items[e], i[e] ? (n.remove(e), n.itemNames.length === 0 && (a = !1)) : i[e] = s;
          a || (r[l] = void 0);
        }
        n = r[l];
      }
    }
    return t;
  }
  parseBindgroupEntries(t) {
    const e = t.uniformBufferName ? t.uniformBufferName : "bindgroupUniforms", s = (a, o) => {
      if (t[e])
        t[e].add(a, o);
      else {
        const l = {};
        l[a] = o, t[e] = new A(l, { useLocalVariable: !0 });
      }
    }, i = t.vertexBufferName ? t.vertexBufferName : "bindgroupVertexBuffer", r = (a, o) => {
      if (t[i]) {
        const l = t[i].createArray(a, o.type, o.dataOffset);
        o.datas && (l.datas = o.datas);
      } else {
        const l = {};
        l[a] = o, t[i] = new w(l);
      }
    };
    let n;
    for (let a in t)
      n = t[a], n && (n instanceof R || n instanceof E || n instanceof P ? s(a, n) : I.types[n.type] && r(a, n));
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
    return this.instance || (this.instance = new ve()), this.instance.parse(t, e, s);
  }
};
let W = ve;
u(W, "instance", null);
class we {
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
    this._datas || console.warn("create index resource ", this.getBufferSize()), this.gpuResource && this.gpuResource.destroy(), this.gpuResource = g.device.createBuffer({
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
    this.mustUpdateData && (this.mustUpdateData = !1, g.device.queue.writeBuffer(this.gpuResource, 0, this._datas.buffer));
  }
  apply(t, e) {
    this.gpuResource || this.createGpuResource(), t.setIndexBuffer(this.gpuResource, this.dataType, this.offset, this.getBufferSize()), t.drawIndexed(this.nbPoint, e.instanceCount, e.firstVertexId, e.baseVertex, e.firstInstanceId);
  }
}
class F {
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
    return e instanceof Y ? this.mustRefreshBindgroup = !0 : e instanceof O && (e.source instanceof GPUTexture || !e.source) && (this.mustRefreshBindgroup = !0), e instanceof we ? (this.indexBuffer = e, this.elementByName[t] = e, e) : e instanceof z ? (this.resourcesIOs.push(e), this.mustRefreshBindgroup = !0, this.vertexBufferIO = e, this.elements.push({ name: t, resource: e.buffers[0] }), this.elements.push({ name: t + "_out", resource: e.buffers[1] }), this.parent && this.parent.add(this), e) : e instanceof Z ? (this.resourcesIOs.push(e), this.mustRefreshBindgroup = !0, this.textureIO = e, this.elements.push({ name: t, resource: e.textures[0] }), this.elements.push({ name: t + "_out", resource: e.textures[1] }), this.parent && this.parent.add(this), e) : (e instanceof Y && e.addBindgroup(this), this.elements.push({ name: t, resource: e }), this.parent && this.parent.add(this), e);
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
      if (this.elements[e].name === t)
        return this.elements[e].resource;
    for (let e = 0; e < this.elements.length; e++)
      if (this.elements[e].resource instanceof A && this.elements[e].resource.items[t])
        return this.elements[e].resource;
    return null;
  }
  initFromObject(t) {
    let e = t, s = !1;
    t instanceof Array && (s = !0, e = t[0]), W.parse(e, "bindgroup");
    const i = [];
    let r = 0, n;
    for (let a in e)
      n = e[a], n && (n.createGpuResource || n instanceof z || n instanceof Z) && (i[r++] = this.add(a, n));
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
        for (let r = 0; r < t.length; r++)
          e = t[r].resource, e.gpuResource && e.destroyGpuResource();
      }
    }
  }
  buildLayout() {
    this.deviceId = g.deviceId, this.io_index = 0;
    const t = { entries: [] };
    let e = 0, s;
    for (let i = 0; i < this.elements.length; i++) {
      if (s = this.elements[i].resource, s instanceof w && !s.io && this.parent.pipeline.type != "compute")
        continue;
      let r = s.createBindGroupLayoutEntry(e++);
      t.entries.push(r);
    }
    this._layout = g.device.createBindGroupLayout(t);
  }
  build() {
    (!this._layout || this.deviceId != g.deviceId && this.ioGroups) && this.buildLayout(), this.deviceId = g.deviceId;
    let t = [], e = 0, s;
    for (let i = 0; i < this.elements.length; i++) {
      if (!this.elements[i] || (s = this.elements[i].resource, s.update(), s instanceof w && !s.io && this.parent.pipeline.type != "compute"))
        continue;
      let r = s.createBindGroupEntry(e++);
      t.push(r);
    }
    if (this._group = g.device.createBindGroup({ layout: this._layout, entries: t }), !this.setupApplyCompleted && this.parent && (this.setupApplyCompleted = !0, this.setupApply(), this.instanceResourcesArray)) {
      for (let i = 0; i < this.instanceResourcesArray.length; i++)
        this._createInstance(this.instanceResourcesArray[i]);
      this.instanceResourcesArray = void 0;
    }
    return this._group;
  }
  setupApply() {
    this.bindgroupId = this.parent.groups.indexOf(this);
    const t = this.parent.resources.types;
    if (!t)
      return;
    const e = t.vertexBuffers;
    if (!e)
      return;
    const s = (a) => {
      if (this.instances) {
        for (let o = 0; o < e.length; o++)
          if (e[o].resource.nane === a.name)
            return o;
      } else
        for (let o = 0; o < e.length; o++)
          if (e[o].resource === a)
            return o;
      return -1;
    };
    this.vertexBuffers = [], this.vertexBufferReferenceByName = {};
    let i = 0, r, n;
    for (let a = 0; a < this.elements.length; a++)
      if (r = this.elements[a], n = r.resource, n instanceof w) {
        if (!n.io) {
          n.bufferId = s(n), this.elementByName[r.name] = n, this.vertexBufferReferenceByName[r.name] = { bufferId: n.bufferId, resource: n }, this.vertexBuffers[i++] = n;
          continue;
        }
      } else
        this.elementByName[r.name] = n;
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
        let r;
        for (let n = 0; n < this.vertexBuffers.length; n++)
          r = this.vertexBuffers[n].getCurrentBuffer(), t.setVertexBuffer(this.vertexBuffers[n].bufferId, r);
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
    t = W.parse(t, "bindgroup"), this.instances || (this.instances = []);
    let e, s = [], i = {
      elements: this.elements.concat()
    }, r, n;
    for (let a = 0; a < this.elements.length; a++) {
      r = this.elements[a];
      for (let o in t) {
        if (n = t[o], n instanceof we) {
          e = t[o];
          continue;
        }
        r.name === o && (n instanceof Y || n instanceof O || (n.descriptor = r.resource.descriptor), n.gpuResource || n.createGpuResource(), r.resource instanceof w && (n.bufferId = r.resource.bufferId, s.indexOf(n) === -1 && s.push(n)), i.elements[a] = { name: o, resource: n });
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
        this.resourcesIOs[s] instanceof z ? (t[s] = this.resourcesIOs[s].buffers[0], e[s] = this.resourcesIOs[s].buffers[1]) : (t[s] = this.resourcesIOs[s].textures[0], e[s] = this.resourcesIOs[s].textures[1]), t[s].createGpuResource(), e[s].createGpuResource();
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
    const s = new F();
    s.name = this.name, s.mustRefreshBindgroup = this.mustRefreshBindgroup = !0, s._layout = this.layout, s.elements = this.swapElements();
    let i, r;
    for (let n = 0; n < t.length; n++)
      if (i = t[n], r = e[n], i instanceof w) {
        const a = [i.buffer, r.buffer];
        a[0].debug = 1, a[1].debug = 2, i.initBufferIO(a);
      } else if (i instanceof O) {
        i.gpuResource || i.createGpuResource(), r.gpuResource || r.createGpuResource();
        const a = [i.gpuResource, r.gpuResource];
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
    let t, e, s = [], i = [], r = this.parent.resources, n = !1, a = !1;
    for (let o = 0; o < this.elements.length; o++)
      if (t = this.elements[o].resource, t instanceof w) {
        if (t.io === 1) {
          e = this.elements[o].name, r[e] = void 0, r[e + "_out"] = void 0, s.push(t), s.push(this.elements[o + 1].resource), this.elements.splice(o, 2), n = !0;
          break;
        }
      } else if (t instanceof O && t.io === 1) {
        e = this.elements[o].name, r[e] = void 0, r[e + "_out"] = void 0, i.push(t), i.push(this.elements[o + 1].resource), this.elements.splice(o, 2), a = !0;
        break;
      }
    if (n) {
      const o = s[0].attributeDescriptor, l = s[0].descriptor.stepMode, f = new w(o, { stepMode: l });
      this.elements.push({ name: e, resource: f });
      let c = r.types.vertexBuffers, h = [];
      for (let d = 0; d < c.length; d++)
        c[d].resource.io || h.push(c[d]);
      h.push({ name: e, resource: f }), r[e] = f, r.types.vertexBuffers = h, f.initIO = () => {
        f.initBufferIO([s[0].buffer, s[1].buffer]);
      }, f.initIO(), this.renderPipelineBufferIO = f;
    } else if (a) {
      const o = new O({ source: i[0].gpuResource });
      this.elements.push({ name: e, resource: o });
      let l = r.types.imageTextures, f = [];
      for (let c = 0; c < l.length; c++)
        l[c].resource.io || f.push(l[c]);
      f.push({ name: e, resource: o }), r[e] = o, r.types.imageTextures = l, o.initIO = () => {
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
class ue {
  constructor(t = "", e = !1) {
    u(this, "enabled", !0);
    u(this, "executeSubNodeAfterCode", !0);
    u(this, "_text");
    u(this, "insideMainFunction");
    u(this, "subNodes");
    this.text = t, this.insideMainFunction = e;
  }
  get text() {
    return this._text;
  }
  set text(t) {
    const e = t.split(`
`);
    let s, i = 99999999;
    if (e.length > 1) {
      for (let r = 0; r < e.length; r++) {
        s = e[r];
        for (let n = 0; n < s.length; n++)
          if (s[n] !== `
` && s[n] !== " ") {
            i > n && (i = n);
            break;
          }
      }
      this.insideMainFunction && i >= 3 && (i -= 3);
      for (let r = 0; r < e.length; r++)
        e[r] = e[r].slice(i);
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
    const e = new ue(t);
    return this.subNodes || (this.subNodes = []), this.subNodes.push(e), e;
  }
}
class me {
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
    this.shaderType = t, this.constants = new ue(), this.main = new ue("", !0);
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
      if (e[a] = s = e[a].split("	").join("").trim().slice(4), !s.length)
        continue;
      let o = s.split(" = "), l = o[0].split(":")[0], f = o[1].slice(0, o[1].length - 1);
      i.push({
        varName: l,
        otherName: f
      });
    }
    const r = (a, o, l) => {
      const f = new RegExp(`(?<=[^\\w.])\\b${o}\\b`, "g");
      return a.replace(f, l);
    };
    let n = this.main.value + "";
    for (let a = 0; a < i.length; a++)
      n = r(n, i[a].varName, i[a].otherName);
    return n;
  }
  unwrapVariableInWGSL(t, e) {
    const s = t.split(`
`);
    let i, r = [];
    for (let a = 0; a < s.length; a++) {
      if (s[a] = i = s[a].split("	").join("").trim().slice(4), !i.length)
        continue;
      let o = i.split(" = "), l = o[0].split(":")[0], f = o[1].slice(0, o[1].length - 1);
      r.push({
        varName: l,
        otherName: f
      });
    }
    const n = (a, o, l) => {
      const f = new RegExp(`(?<=[^\\w.])\\b${o}\\b`, "g");
      return a.replace(f, l);
    };
    for (let a = 0; a < r.length; a++)
      e = n(e, r[a].varName, r[a].otherName);
    return e;
  }
  addOutputVariable(t, e) {
    this.outputs.push({ name: t, type: e.type });
  }
  addInputVariable(t, e) {
    this.outputs.push({ name: t, type: e.type, builtin: e.builtin });
  }
  formatWGSLCode(t) {
    const e = t.replace(/\n+/g, `
`).split(`
`);
    let s = "", i = 0;
    for (const r of e) {
      const n = r.trim();
      n.startsWith("}") && i--;
      const a = "   ".repeat(i) + n;
      n.endsWith("{") && i++, s += a + `
`;
    }
    return s;
  }
  get shaderInfos() {
    return this._shaderInfos;
  }
  build(t, e) {
    return this._shaderInfos ? this._shaderInfos : (this._shaderInfos = { code: "", output: null }, this._shaderInfos);
  }
}
class Re extends me {
  constructor() {
    super("fragment");
  }
  build(t, e) {
    if (this._shaderInfos)
      return this._shaderInfos;
    let s = "";
    const i = t.bindGroups.getVertexShaderDeclaration(!0);
    s += i.result;
    for (let o = 0; o < this.inputs.length; o++)
      e.addProperty(this.inputs[o]);
    this.outputs.length === 0 && (this.outputs[0] = { name: "color", ...v.fragmentOutputs.color });
    const r = new G("Output", this.outputs);
    s += r.struct + `
`;
    let n = this.unwrapVariableInWGSL(i.variables, this.constants.value);
    s += n + `

`;
    let a = this.unwrapVariableInWGSL(i.variables, this.main.value);
    return s += `@fragment
`, s += "fn main(" + e.getFunctionParams() + ") -> " + r.name + `{
`, s += `   var output:Output;
`, s += a, s += `   return output;
`, s += `}
`, s = this.formatWGSLCode(s), g.showFragmentShader && (console.log("------------- FRAGMENT SHADER --------------"), console.log(s), console.log("--------------------------------------------")), this._shaderInfos = { code: s, output: r }, this._shaderInfos;
  }
}
class Ce extends me {
  //public keepRendererAspectRatio: boolean = true;
  constructor() {
    super("vertex");
  }
  build(t, e) {
    let s = "";
    const i = t.bindGroups.getVertexShaderDeclaration();
    s += i.result, s += e.getComputeVariableDeclaration();
    let r = !1;
    for (let l = 0; l < this.outputs.length; l++)
      this.outputs[l].builtin === v.vertexOutputs.position.builtin && (r = !0);
    r || this.outputs.unshift({ name: "position", ...v.vertexOutputs.position });
    let n = new G("Output", [...this.outputs]);
    s += n.struct + `
`;
    let a = this.unwrapVariableInWGSL(i.variables, this.constants.value);
    s += a + `

`;
    let o = this.unwrapVariableInWGSL(i.variables, this.main.value);
    return s += `@vertex
`, s += "fn main(" + e.getFunctionParams() + ") -> " + n.name + `{
`, s += `   var output:Output;
`, s += o, s += `   return output;
`, s += `}
`, s = this.formatWGSLCode(s), g.showVertexShader && (console.log("------------- VERTEX SHADER --------------"), console.log(s), console.log("------------------------------------------")), { code: s, output: n };
  }
}
class xe extends fe {
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
    this.time = (/* @__PURE__ */ new Date()).getTime(), !(g.loseDeviceRecently && this.deviceId === g.deviceId) && (this.gpuResource && (this.gpuResource.xgpuObject = null, this.gpuResource.destroy()), this.deviceId = g.deviceId, this.gpuResource = g.device.createTexture(this.descriptor), this.gpuResource.xgpuObject = this, this.createView());
  }
  createGpuResource() {
    this.create();
  }
  update() {
    this.deviceId !== g.deviceId && this.create();
  }
  createView() {
    this.gpuResource || this.create(), this._view = this.gpuResource.createView();
  }
  resize(e, s) {
    this.descriptor.size = [e, s], this.create();
  }
}
class ee extends xe {
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
    for (let r in i)
      this._attachment[r] = i[r];
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
    return new ee(this.descriptor);
  }
}
class be extends $ {
  constructor(t) {
    if (t = { ...t }, t.source && (t.source.length === 0 || t.source.length % 6 !== 0))
      throw new Error("CubeMapTextureArray error : descriptor.source must contains an array of (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) with a length greater than 0 and multiple of 6.");
    t.dimension || (t.dimension = "2d"), t.usage === void 0 && (t.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT), super(t), t.source && (this.bitmaps = t.source);
  }
  clone() {
    return this.descriptor.source || (this.descriptor.source = this._bitmaps), new be(this.descriptor);
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
    this.gpuResource && this.gpuResource.destroy(), this.gpuResource = g.device.createTexture(this.descriptor), this._view = this.gpuResource.createView({ dimension: "cube-array", arrayLayerCount: this._bitmaps.length });
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
class Ve extends $ {
  constructor(e, s = null) {
    if (e.format === void 0 && (e.format = "depth32float"), e.sampleCount === void 0 && (e.sampleCount = 1), e.source[0] instanceof ee)
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
class te {
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
    this.groups = this.groups.sort((o, l) => o.useInstances && !l.useInstances ? 1 : !o.useInstances && l.useInstances ? -1 : 0), this.groups.length ? this.groups[this.groups.length - 1].applyDraw = !0 : (this.groups[0] = new F(), this.groups[0].parent = this, this.groups[0].applyDraw = !0);
    for (let o = 0; o < this.groups.length; o++)
      t || (s[o] = this.groups[o].layout), i[o] = this.groups[o].group;
    t ? e.layout = "auto" : e.layout = g.createPipelineLayout({ bindGroupLayouts: s });
    const { vertexLayouts: r, buffers: n, nbVertex: a } = this.createVertexBufferLayout();
    return e.vertex = {
      buffers: r
    }, {
      description: e,
      bindgroups: i,
      buffers: n,
      nbVertex: a
    };
  }
  getBindgroupByResource(t) {
    let e, s;
    for (let i = 0; i < this.groups.length; i++) {
      e = this.groups[i];
      for (let r = 0; r < e.elements.length; r++)
        if (s = e.elements[r].resource, s === t)
          return e;
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
    if (t)
      return this.temp;
    let e = "", s, i, r, n, a = 0;
    const o = { result: "", variables: "" };
    for (let l = 0; l < this.groups.length; l++) {
      s = this.groups[l], i = s.elements, a = 0;
      for (let f = 0; f < i.length; f++)
        if (r = i[f].resource, !(r instanceof w)) {
          if (n = i[f].name, r instanceof A) {
            const c = r.createStruct(n);
            o.variables += c.localVariables, e += c.struct;
          }
          e += r.createDeclaration(n, a++, l) + `
`;
        }
    }
    return o.result = e, this.temp = o, o;
  }
  getFragmentShaderDeclaration() {
    let t = "", e, s, i, r, n = 0;
    const a = { result: "", variables: "" };
    for (let o = 0; o < this.groups.length; o++) {
      e = this.groups[o], s = e.elements, n = 0;
      for (let l = 0; l < s.length; l++)
        if (i = s[l].resource, !(i instanceof w)) {
          if (r = s[l].name, i instanceof A) {
            let f;
            for (let c in i.items) {
              f = i.items[c];
              let h = r.substring(0, 1).toLowerCase() + r.slice(1);
              f.propertyNames && (t += f.createStruct() + `
`), f.createVariableInsideMain && (a.variables += f.createVariable(h) + `
`);
            }
            t += i.createStruct(r).struct + `
`;
          }
          t += i.createDeclaration(r, n++, o) + `
`;
        }
    }
    return a.result = t, a;
  }
  getComputeShaderDeclaration() {
    let t = "", e, s, i, r, n = 0;
    const a = { result: "", variables: "" };
    for (let o = 0; o < this.groups.length; o++) {
      e = this.groups[o], s = e.elements, n = 0;
      for (let l = 0; l < s.length; l++) {
        if (i = s[l].resource, r = s[l].name, !(i instanceof w)) {
          if (i instanceof A) {
            let c;
            for (let d in i.items) {
              c = i.items[d];
              let m = r.substring(0, 1).toLowerCase() + r.slice(1);
              c.createVariableInsideMain && (a.variables += c.createVariable(m) + `
`);
            }
            const h = i.createStruct(r).struct + `
`;
            t += h;
          }
        }
        const f = i.createDeclaration(r, n++, o) + `
`;
        t += f;
      }
    }
    return a.result = t, a;
  }
  createVertexBufferLayout() {
    const t = [], e = [];
    let s, i, r, n = 0, a = 0, o = 0;
    for (let l = 0; l < this.groups.length; l++) {
      s = this.groups[l], i = s.elements;
      for (let f = 0; f < i.length; f++)
        r = i[f].resource, r instanceof w && (o = Math.max(o, r.nbVertex), e[n] = r, t[n++] = r.createVertexBufferLayout(a), a += r.vertexArrays.length);
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
    const s = this._resources.types, i = (n, a) => {
      let o, l;
      for (let f = 0; f < a.length; f++)
        o = a[f], !n[o.name] && (l = o.resource, this._resources.all.indexOf(l) === -1 && this._resources.all.push(l), n[o.name] = o.resource, l instanceof Ve ? (s.depthTextureArrays || (s.depthTextureArrays = []), s.depthTextureArrays.indexOf(o) === -1 && s.depthTextureArrays.push(o)) : l instanceof be ? (s.cubeMapTextureArrays || (s.cubeMapTextureArrays = []), s.cubeMapTextureArrays.indexOf(o) === -1 && s.cubeMapTextureArrays.push(o)) : l instanceof $ ? (s.imageTextureArrays || (s.imageTextureArrays = []), s.imageTextureArrays.indexOf(o) === -1 && s.imageTextureArrays.push(o)) : l instanceof A ? (s.uniformBuffers || (s.uniformBuffers = []), s.uniformBuffers.indexOf(o) === -1 && s.uniformBuffers.push(o)) : l instanceof w ? (s.vertexBuffers || (s.vertexBuffers = []), s.vertexBuffers.indexOf(o) === -1 && s.vertexBuffers.push(o)) : l instanceof le ? (s.cubeMapTexture || (s.cubeMapTexture = []), s.cubeMapTexture.indexOf(o) === -1 && s.cubeMapTexture.push(o)) : l instanceof O ? (s.imageTextures || (s.imageTextures = []), s.imageTextures.indexOf(o) === -1 && s.imageTextures.push(o)) : l instanceof Y ? (s.videoTexture || (s.videoTexture = []), s.videoTexture.indexOf(o) === -1 && s.videoTexture.push(o)) : l instanceof J ? (s.sampler || (s.sampler = []), s.sampler.indexOf(o) === -1 && s.sampler.push(o)) : l instanceof ee && (s.depthStencilTextures || (s.depthStencilTextures = []), s.depthStencilTextures.indexOf(o) === -1 && s.depthStencilTextures.push(o)));
    }, r = (n) => {
      const a = e[n.name] = {};
      a.types || (a.types = {}), i(a, n.elements), this.groups.push(n);
    };
    if (t instanceof F)
      this.groups.indexOf(t) === -1 ? r(t) : i(e[t.name], t.elements);
    else {
      t.pipeline = this.pipeline, e = e[t.name] = {};
      let n;
      for (let a = 0; a < t.groups.length; a++)
        n = t.groups[a], this.groups.indexOf(n) === -1 && r(n);
    }
    return t;
  }
  copy(t) {
    const e = new te(this.pipeline, this._name), s = this.groups.concat();
    if (t)
      for (let i = 0; i < t.oldGroups.length; i++)
        s.splice(s.indexOf(t.oldGroups[i]), 1, t.replacedGroup[i]);
    return e.groups = s, e;
  }
  propertyNameIsUsed(t) {
    for (let e = 0; e < this.groups.length; e++)
      if (this.groups[e].get(t))
        return !0;
    return !1;
  }
  get(t) {
    let e;
    for (let s = 0; s < this.groups.length; s++)
      if (e = this.groups[s].get(t), e)
        return e;
    return null;
  }
  getGroupByPropertyName(t) {
    let e;
    for (let s = 0; s < this.groups.length; s++)
      if (e = this.groups[s].get(t), e)
        return this.groups[s];
    return null;
  }
  getGroupByName(t) {
    for (let e = 0; e < this.groups.length; e++)
      if (this.groups[e].name === t)
        return this.groups[e];
    return null;
  }
  getNameByResource(t) {
    if (t instanceof R || t instanceof E || t instanceof P)
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
class Ee extends fe {
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
    this.bindGroups = new te(this, "pipeline");
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
    for (let r in e)
      i = e[r], s[i.name] = i;
    return s;
  }
  addBindgroup(e) {
    this.bindGroups.add(e);
  }
  createVertexBufferLayout() {
    this.vertexBufferLayouts = [], this.vertexBuffers = [];
    const e = this.bindGroups.groups;
    let s, i, r = 0, n = 0;
    for (let a = 0; a < e.length; a++) {
      s = e[a].elements;
      for (let o = 0; o < s.length; o++)
        i = s[o].resource, i instanceof w && (this.vertexBuffers[n] = i, this.vertexBufferLayouts[n++] = i.createVertexBufferLayout(r), r += i.vertexArrays.length);
    }
    return this.vertexBufferLayouts;
  }
  createShaderInput(e, s) {
    const i = new G("Input", e.inputs);
    if (s) {
      let r, n = 0;
      for (let a = 0; a < s.length; a++) {
        r = s[a].vertexArrays;
        for (let o = 0; o < r.length; o++)
          i.addProperty({ name: r[o].name, type: r[o].varType, builtin: "@location(" + n + ")" }), n++;
      }
    }
    return i;
  }
  createLayouts() {
    this.gpuBindGroupLayouts = [], this.gpuBindgroups = [], this.gpuPipelineLayout = null;
    const e = this.bindGroups.groups;
    let s, i, r, n, a, o = 0;
    for (let l = 0; l < e.length; l++) {
      s = e[l].elements, r = { entries: [] }, n = { entries: [], layout: null }, a = 0;
      for (let f = 0; f < s.length; f++)
        i = s[f].resource, (!(i instanceof w) || this.isComputePipeline) && (r.entries[a] = i.createBindGroupLayoutEntry(a), n.entries[a] = i.createBindGroupEntry(a), a++);
      a > 0 && (n.layout = this.gpuBindGroupLayouts[o] = g.createBindgroupLayout(r), this.gpuBindgroups[o] = g.createBindgroup(n), o++);
    }
    this.gpuPipelineLayout = g.createPipelineLayout({ bindGroupLayouts: this.gpuBindGroupLayouts });
  }
  initPipelineResources(e) {
    const s = this.bindGroups.resources.all;
    if (s)
      for (let i = 0; i < s.length; i++)
        s[i].setPipelineType(e.type);
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
    let r, n, a;
    const o = [], l = [], f = [];
    for (let c = 0; c < e.length; c++) {
      n = e[c];
      const h = this.bindGroups.getNameByResource(n), d = this.bindGroups.getGroupByPropertyName(h);
      d.mustRefreshBindgroup = !0, o[c] = h, l[c] = d, (n instanceof R || n instanceof E || n instanceof P) && (f[c] = d.getResourceName(n.uniformBuffer));
    }
    for (let c = 0; c < s; c++) {
      i[c] = r = {}, a = {};
      for (let d = 0; d < e.length; d++) {
        n = e[d], n.update();
        const m = o[d], p = l[d];
        if (n instanceof R || n instanceof E || n instanceof P) {
          const x = f[d];
          a[x] || (a[x] = n.uniformBuffer.clone(), a[x].name = x), r[x] = a[x], r[x].name = a[x].name, r[x].bindgroup = p, r[m] = a[x].getUniformByName(m);
        } else
          r[m] = n.clone(), r[m].bindgroup = p, r[m].name = m;
      }
      const h = [];
      for (let d in r)
        n = r[d], n instanceof R || n instanceof E || n instanceof P || (n.setPipelineType(this.type), n.createGpuResource(), h.push(n));
      r.deviceId = g.deviceId, r.apply = () => {
        let d = !1;
        g.deviceId != r.deviceId && (d = !0, r.deviceId = g.deviceId);
        let m;
        for (let p = 0; p < h.length; p++)
          m = h[p], d && (m.destroyGpuResource(), m.createGpuResource()), m.update(), m.bindgroup.set(m.name, m);
        this.update();
      };
    }
    return i;
  }
}
class Ne extends xe {
  constructor(e) {
    e.format === void 0 && (e.format = g.getPreferredCanvasFormat()), e.usage === void 0 && (e.usage = GPUTextureUsage.RENDER_ATTACHMENT), e.sampleCount === void 0 && (e.sampleCount = 4), e.alphaToCoverageEnabled === void 0 && (e.alphaToCoverageEnabled = !1), e.mask === void 0 && (e.mask = 4294967295), e.resolveTarget === void 0 && (e.resolveTarget = null);
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
const Te = class extends O {
  constructor(e, s) {
    s || (e.renderer ? s = { size: [e.renderer.width, e.renderer.height] } : s = { size: [1, 1] }), s.format || (s.format = g.getPreferredCanvasFormat()), s.usage || (s.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT), s.mipLevelCount || (s.mipLevelCount = 1), s.sampleCount || (s.sampleCount = 1), s.dimension || (s.dimension = "2d"), s.viewFormats || (s.viewFormats = []), s.label || (s.label = "RenderPassTexture");
    super(s);
    u(this, "ready", !1);
    u(this, "renderPipeline");
    u(this, "_mustUseCopyTextureToTexture", !1);
    u(this, "frameId", -1);
    e.renderer ? this.ready = !0 : (this.ready = !1, e.addEventListener(S.ON_ADDED_TO_RENDERER, () => {
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
      if (e instanceof S && e.renderer)
        this.renderPipeline.renderer = e.renderer, this.ready = !0;
      else
        return;
    if (e instanceof S && e.renderer && (this.renderPipeline.renderer = e.renderer), this.frameId != this.renderPipeline.renderer.frameId) {
      const s = this.renderPipeline.renderer.commandEncoder;
      if (s) {
        this.frameId = this.renderPipeline.renderer.frameId, this.renderPipeline.pipeline || this.renderPipeline.buildGpuPipeline(), this.renderPipeline.update();
        const i = this.renderPipeline.beginRenderPass(s, this.view, 0, !0);
        for (let r = 0; r < this.renderPipeline.pipelineCount; r++)
          this.renderPipeline.dispatchEvent(S.ON_DRAW, r), this.renderPipeline.draw(i);
        this.renderPipeline.end(s, i);
      }
    }
  }
  resize(e, s) {
    return this.descriptor.size = [e, s], this.createGpuResource(), this.dispatchEvent(Te.RESOURCE_CHANGED), this;
  }
  createBindGroupEntry(e) {
    return this.deviceId !== g.deviceId && (this.deviceId = g.deviceId, this.gpuResource = g.device.createTexture(this.descriptor), this._view = this.gpuResource.createView()), super.createBindGroupEntry(e);
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
let ne = Te;
u(ne, "RESOURCE_CHANGED", "RESOURCE_CHANGED");
class Ue {
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
class Se extends me {
  constructor() {
    super("compute");
  }
  build(t, e) {
    if (this._shaderInfos)
      return this._shaderInfos;
    let s = "";
    const i = t.bindGroups.getComputeShaderDeclaration();
    s += i.result + `

`;
    const r = t.workgroups;
    let n = this.unwrapVariableInWGSL(i.variables, this.constants.value);
    s += n + `

`;
    let a = this.unwrapVariableInWGSL(i.variables, this.main.value);
    return s += "@compute @workgroup_size(" + r[0] + "," + r[1] + "," + r[2] + `)
`, s += "fn main(" + e.getFunctionParams() + `) {
`, s += a, s += `}
`, g.showComputeShader && (console.log("------------- COMPUTE SHADER --------------"), console.log(s), console.log("-------------------------------------------")), this._shaderInfos = { code: s, output: null }, this._shaderInfos;
  }
}
class Ge extends Ee {
  constructor() {
    super();
    u(this, "computeShader");
    u(this, "onReceiveData");
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
    this.computeShader = new Se(), this.type = "compute";
  }
  set useRenderPipeline(e) {
    e ? this.type = "compute_mixed" : this.type = "compute";
  }
  initFromObject(e) {
    if (this._resources = {}, this.vertexShader = null, this.fragmentShader = null, this.bindGroups.destroy(), this.bindGroups = new te(this, "pipeline"), e = W.parse(e, "compute"), super.initFromObject(e), e.bindgroups) {
      let r;
      for (let n in e.bindgroups)
        r = new F(), r.name = n, r.initFromObject(e.bindgroups[n]), this.bindGroups.add(r);
      if (e.bindgroups.default && e.bindgroups.default.buffer) {
        const n = e.bindgroups.default.buffer.attributes;
        for (let a in n)
          e[a] && (e[a] = n[a]);
      }
    }
    const s = (r) => {
      const n = [];
      let a;
      for (let o in r)
        a = r[o], n.push({ name: o, ...a });
      return n;
    };
    this.computeShader = new Se(), typeof e.computeShader == "string" ? this.computeShader.main.text = e.computeShader : (this.computeShader.inputs = s(e.computeShader.inputs), this.computeShader.outputs = s(e.computeShader.outputs), e.computeShader.constants && (this.computeShader.constants.text = e.computeShader.constants), this.computeShader.main.text = e.computeShader.main);
    let i = !0;
    for (let r in this.resources.bindgroups.io)
      this.resources.bindgroups.io[r].data || (i = !1);
    return i && this.nextFrame(), e;
  }
  destroy() {
    this.bindGroups.destroy();
    for (let e in this.description)
      this.description[e] = null;
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
  setWorkgroups(e, s = 1, i = 1) {
    this.workgroups = [e, s, i];
  }
  setDispatchWorkgroup(e = 1, s = 1, i = 1) {
    this.dispatchWorkgroup = [e, s, i];
  }
  initResourceIOs() {
    const e = this.bindGroups.resources.io;
    if (!e)
      return;
    let s, i;
    for (let r in e)
      s = e[r], i = s.resourceIO, i instanceof z ? this.vertexBufferIOs.indexOf(i) === -1 && (this.resourceIOs.push(i), i.nbVertex > this.nbVertexMax && (this.nbVertexMax = i.nbVertex), this.vertexBufferIOs.push(i)) : i instanceof Z && this.imageTextureIOs.indexOf(i) === -1 && (this.resourceIOs.push(i), i.width > this.widthMax && (this.widthMax = i.width), i.height > this.heightMax && (this.heightMax = i.height), this.imageTextureIOs.push(i));
  }
  update() {
    this.gpuComputePipeline && (this.deviceId !== g.deviceId && (this.deviceId = g.deviceId, this.clearAfterDeviceLostAndRebuild(), (/* @__PURE__ */ new Date()).getTime() - this.lastFrameTime < 100 && this.nextFrame()), this.bindGroups.update(), this.lastFrameTime = (/* @__PURE__ */ new Date()).getTime());
  }
  setupDefaultWorkgroups() {
    if (this.vertexBufferIOs.length) {
      let e = 64;
      for (; this.nbVertexMax / e >= 65536; )
        e *= 2;
      this.setWorkgroups(e), this.setDispatchWorkgroup(Math.ceil(this.nbVertexMax / e));
    } else
      this.setWorkgroups(1), this.setDispatchWorkgroup(this.widthMax, this.heightMax);
  }
  clearAfterDeviceLostAndRebuild() {
    console.warn("ComputePipeline.clearAfterDeviceLostAndRebuild()"), this.gpuComputePipeline = null, this.rebuildingAfterDeviceLost = !0, super.clearAfterDeviceLostAndRebuild();
  }
  buildGpuPipeline() {
    if (this.gpuComputePipeline)
      return this.gpuComputePipeline;
    this.initPipelineResources(this), this.createLayouts(), this.bindGroups.handleComputePipelineResourceIOs(), this.initResourceIOs(), this.workgroups || this.setupDefaultWorkgroups(), this.bindGroups.build();
    const e = this.computeShader.outputs, s = this.computeShader.inputs;
    for (let n = 0; n < e.length; n++)
      e[n].type.createGpuResource && (e[n].isOutput = !0, s.push(e[n]));
    const i = new G("Input", [...s]), { code: r } = this.computeShader.build(this, i);
    return this.description.compute = {
      module: g.device.createShaderModule({ code: r }),
      entryPoint: "main"
    }, this.description.layout = this.gpuPipelineLayout, this.deviceId = g.deviceId, this.gpuComputePipeline = g.createComputePipeline(this.description), this.gpuComputePipeline;
  }
  async nextFrame() {
    if (this.processingFirstFrame) {
      this.waitingFrame = !0;
      return;
    }
    this.onComputeBegin && this.onComputeBegin(), this.processingFirstFrame = this.firstFrame, this.update();
    const e = g.device.createCommandEncoder(), s = e.beginComputePass();
    s.setPipeline(this.buildGpuPipeline()), this.bindGroups.update(), this.bindGroups.apply(s), s.dispatchWorkgroups(this.dispatchWorkgroup[0], this.dispatchWorkgroup[1], this.dispatchWorkgroup[2]), s.end(), g.device.queue.submit([e.finish()]), this.firstFrame && await g.device.queue.onSubmittedWorkDone();
    for (let i = 0; i < this.resourceIOs.length; i++)
      this.resourceIOs[i].getOutputData();
    this.firstFrame = !1, this.processingFirstFrame = !1, this.onComputeEnd && this.onComputeEnd(), this.waitingFrame && (this.waitingFrame = !1, this.nextFrame());
  }
}
class Me extends Ge {
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
    this.renderPipeline.resources.indexBuffer && (e = this.renderPipeline.resources.indexBuffer, this.computeShaderObj.indexBuffer = new w({ id: I.Uint() }, {
      stepMode: "vertex",
      datas: e.datas
    }));
  }
  setupDataStructure() {
    this.results = {}, this.resultBufferStructure = {}, this.nbValueByFieldIndex = {}, this.nbValueByFieldName = {}, this.dataTypeByFieldname = {}, this.fieldNames = [], this.fieldNewNames = [], this.fieldIndexByName = {}, this.attributes = {};
    const e = this.renderPipeline.resources.__DEBUG__.objectById;
    let s, i, r;
    for (let n = 0; n < e.length; n++)
      r = e[n], i = r.name, s = this.getNbValueByType(r.type), this.fieldNames[n] = i, this.fieldNewNames[n] = r.newName, this.fieldIndexByName[i] = n, this.nbValueByFieldIndex[n] = r.nbValue, this.dataTypeByFieldname[i] = r.type, this.resultBufferStructure[i] = this.createEmptyArray(s), this.nbValueByFieldName[i] = s, this.attributes[r.newName] = this.getObjectByType(r.type);
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
      const r = {};
      for (let n = 0; n < i.itemNames.length; n++)
        r[i.itemNames[n]] = i.items[i.itemNames[n]].clone();
      return new A(r, { useLocalVariable: i.descriptor.useLocalVariable });
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
        let r = s.attributeDescriptor;
        for (let n in r)
          this.bufferNameByAttributeName[n] = e.name;
        this.computeShaderObj[e.name] = new w(s.attributeDescriptor, {
          stepMode: s.stepMode,
          datas: s.datas
        });
      }
  }
  setupComputeShaderVertexBufferIO() {
    this.vertexBufferIO = new z(this.attributes), this.vertexBufferIO.createVertexInstances(this.config.nbVertex, () => this.resultBufferStructure);
    let e;
    this.vertexBufferIO.onOutputData = (s) => {
      const i = new Float32Array(s);
      e = 0;
      let r = [];
      this.vertexBufferIO.getVertexInstances(i, (n) => {
        let a = {};
        for (let o in n)
          a[o] = { ...n[o] };
        r[e++] = a, this.onLog && e == this.config.nbVertex && this.onLog({
          config: this.config,
          results: r,
          nbValueByFieldName: this.nbValueByFieldName,
          renderPipeline: this.renderPipeline,
          dataTypeByFieldname: this.dataTypeByFieldname
        });
      });
    };
  }
  convertLetIntoVar(e) {
    let s = "", i = e.split(`
`), r, n = "abcdefghijklmnopqrstuvwxyz/";
    n += n.toUpperCase();
    const a = (o) => {
      for (let l = 0; l < o.length; l++)
        if (n.includes(o[l]))
          return l;
      return o.length - 1;
    };
    for (let o = 0; o < i.length; o++)
      r = i[o], r = r.slice(a(r)), r.slice(0, 4) === "let " && (r = "var " + r.slice(4)), s += " " + r + `
`;
    return s;
  }
  removeVar(e) {
    let s = "", i = e.split(`
`), r;
    for (let n = 0; n < i.length; n++)
      r = i[n], r.slice(0, 5) === " var " && (r = r.slice(5)), s += " " + r + `
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
    let r;
    for (let o = 0; o < this.vertexShaderInputs.length; o++)
      r = this.vertexShaderInputs[o], r.builtin.slice(0, 8) != "@builtin" && (i += `var computed_vertex_${r.name}:${r.type};
`);
    let n = {};
    const a = this.renderPipeline.resources.__DEBUG__.objectById;
    for (let o = 0; o < a.length; o++)
      n[a[o].name] || (n[a[o].name] = !0, i += this.writeVertexShader(a[o]));
    return g.showVertexDebuggerShader && (console.log("------------- VERTEX DEBUGGER SHADER --------------"), console.log(i), console.log("---------------------------------------------------")), i;
  }
  writeVertexShader(e) {
    const { vertexId: s, instanceId: i, name: r } = e;
    let n = `
        ${this.vertexIdName} = ${s};
        ${this.instanceIdName} = ${i};

        `, a;
    for (let y = 0; y < this.vertexShaderInputs.length; y++)
      a = this.vertexShaderInputs[y], a.builtin.slice(0, 8) != "@builtin" && (n += `computed_vertex_${a.name} = ${this.bufferNameByAttributeName[a.name]}[${this.vertexIdName}+index].${a.name};
`);
    const o = (y, M, se) => {
      const ie = new RegExp(`(?<=[^\\w.])\\b${M}\\b`, "g");
      return y.replace(ie, se);
    };
    let l = [], f = this.renderPipeline.resources.vertexShader.debugVersion;
    for (let y = 0; y < this.vertexShaderInputs.length; y++)
      a = this.vertexShaderInputs[y], a.builtin.slice(0, 8) != "@builtin" && (l[this.fieldIndexByName[a.name]] = a.name, f = o(f, a.name, "computed_vertex_" + a.name));
    const c = f.split(`
`), h = "abcdefghijklmnopqrstuvwxyz/", d = {};
    for (let y = 0; y < h.length; y++)
      d[h[y]] = !0, d[h[y].toUpperCase()] = !0;
    const m = (y) => {
      for (let M = 0; M < y.length; M++)
        if (d[y[M]])
          return M;
      return y.length - 1;
    };
    for (let y = 0; y < c.length; y++)
      c[y] = " " + c[y].slice(m(c[y]));
    f = c.join(`
`), f = o(f, "output.", "output_");
    let p = o(f, "debug", "computeResult");
    function x(y, M, se) {
      const ie = y.split(`
`);
      let ce = "", k, pe = "abcdefghijklmnopqrstuvwxyz0123456789", _e;
      pe += pe.toUpperCase();
      for (let de = 0; de < ie.length; de++)
        if (k = ie[de], k.includes(M)) {
          if (k.includes(se)) {
            const Be = k.split(se);
            let Ie = !0;
            for (let ge = 0; ge < Be.length; ge++)
              if (pe.includes(Be[ge][0])) {
                Ie = !1;
                break;
              }
            Ie && (ce += k + `
`);
          }
        } else
          _e = k.trim(), _e.length != 0 && (ce += k + `
`);
      return ce;
    }
    p = x(p, "computeResult.", "computeResult." + e.name), p = this.convertLetIntoVar(p), this.firstPass || (p = this.removeVar(p)), n += p + `
`;
    for (let y = 0; y < this.fieldNames.length; y++)
      this.fieldNewNames[y].includes(e.name) && (n += `result_out[index].${this.fieldNewNames[y]} =  computeResult.${this.fieldNewNames[y]};
`);
    const T = this.renderPipeline.resources.__DEBUG__.objectById;
    let B, C = {}, _, H;
    for (let y = 0; y < T.length; y++)
      B = T[y], B.name == r && (B.isMatrix ? (H = B.newName.includes("_m4"), H ? _ = B.newName.split("_m4")[0] : _ = B.newName.split("_m3")[0], C[_] || (C[_] = !0, n = this.writeMatrixTemplate(n, _, H))) : B.isArray && (_ = B.newName.split("_ar")[0], C[_] || (C[_] = !0, n = this.writeArrayTemplate(n, _, B.len, B.primitiveType))));
    return this.firstPass = !1, n;
  }
  writeArrayTemplate(e, s, i, r) {
    let n = "abcdefghijklmnopqrstuvwxyz0123456789";
    n += n.toUpperCase();
    let a = e.split(`
`), o;
    const l = (d) => {
      for (let m = 0; m < d.length; m++)
        if (!n.includes(d[m]))
          return !0;
      return !1;
    };
    let f;
    const c = (d, m) => {
      let p = "", x = i, T = r == "mat4";
      for (let B = 0; B < x; B++)
        T ? (p += `computeResult.${d}_ar${B}_m0 = ${m}[${B}][0];
`, p += `computeResult.${d}_ar${B}_m1 = ${m}[${B}][1];
`, p += `computeResult.${d}_ar${B}_m2 = ${m}[${B}][2];
`, p += `computeResult.${d}_ar${B}_m3 = ${m}[${B}][3];
`) : p += `computeResult.${d}_ar${B} = ${m}[${B}];
`;
      return p += `
`, p;
    };
    let h = "";
    for (let d = 0; d < a.length; d++)
      if (o = a[d], o.includes("computeResult." + s) == !0) {
        h = "";
        let m = o.split("=")[1].split(";")[0].trim(), p = d;
        if (l(m)) {
          if (o.includes(";") === !1)
            for (p = d + 1; p < a.length; p++)
              if (a[p].includes(";") == !1)
                m += a[p] + `
`, a[p] = "";
              else {
                m += a[p].split(";")[0] + "", a[p] = "";
                break;
              }
          f = "temporaryVariable_" + this.temporaryIndex++, r === "mat4" ? h = "let " + f + ":array<mat4x4<f32>," + i + "> = " + m + `;
` : h = "let " + f + ":array<vec4<" + r + "> = " + m + `;
`, m = f;
        }
        h += c(s, m), a[d] = h;
        break;
      }
    return a.join(`
`);
  }
  writeMatrixTemplate(e, s, i = !0) {
    let r = "abcdefghijklmnopqrstuvwxyz0123456789";
    r += r.toUpperCase();
    let n = e.split(`
`), a;
    const o = (h) => {
      for (let d = 0; d < h.length; d++)
        if (!r.includes(h[d]))
          return !0;
      return !1;
    };
    let l;
    const f = (h, d) => {
      let m = "", p = 4;
      i == !1 && (p = 3);
      for (let x = 0; x < p; x++)
        m += `computeResult.${h}_m${p}${x} = ${d}[${x}];
`;
      return m += `
`, m;
    };
    let c = "";
    for (let h = 0; h < n.length; h++)
      if (a = n[h], a.includes("computeResult." + s) == !0) {
        c = "";
        let d = a.split("=")[1].split(";")[0].trim(), m = h;
        if (o(d)) {
          if (a.includes(";") === !1)
            for (m = h + 1; m < n.length; m++)
              if (n[m].includes(";") == !1)
                d += n[m] + `
`, n[m] = "";
              else {
                d += n[m].split(";")[0] + "", n[m] = "";
                break;
              }
          l = "temporaryVariable_" + this.temporaryIndex++, i ? c = "let " + l + ":mat4x4<f32> = " + d + `;
` : c = "let " + l + ":mat3x3<f32> = " + d + `;
`, d = l;
        }
        c += f(s, d), n[h] = c;
        break;
      }
    return n.join(`
`);
  }
  buildComputeShader() {
    this.computeShaderObj.result = this.vertexBufferIO, this.computeShaderObj.global_id = v.computeInputs.globalInvocationId, this.computeShaderObj.computeShader = {
      constants: this.renderPipeline.vertexShader.constants.text,
      main: this.writeComputeShader()
    }, this.initFromObject(this.computeShaderObj);
    let e = this.bindGroups.groups;
    for (let s = 0; s < e.length; s++)
      e[s].mustRefreshBindgroup = !0;
  }
  copyUniformsFromRenderToCompute() {
    if (!this.renderUniformBuffers)
      return;
    let e, s;
    for (let i = 0; i < this.renderUniformBuffers.length; i++) {
      e = this.renderUniformBuffers[i], s = e.resource.itemNames;
      for (let r = 0; r < s.length; r++)
        this.computeShaderObj[e.name].items[s[r]].set(e.resource.items[s[r]]);
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
    for (let i = 0; i < e; i++)
      s[i] = 0;
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
const L = class extends Ee {
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
    this.type = "render", this.drawConfig = new Ue(this), this.vertexShader = new Ce(), this.fragmentShader = new Re(), this.description.primitive = {
      topology: "triangle-list",
      cullMode: "none",
      frontFace: "ccw"
    }, e !== null && (this.outputColor = this.createColorAttachment(e));
  }
  get renderer() {
    return this._renderer;
  }
  set renderer(e) {
    this._renderer != e && (this._renderer = e, e ? (this.waitingMultisampleTexture && (this.setupMultiSampleView(this.multiSampleTextureDescriptor), this.waitingMultisampleTexture = !1), this.waitingDepthStencilTexture && (this.setupDepthStencilView(this.depthStencilTextureDescriptor), this.waitingDepthStencilTexture = !1), this.dispatchEvent(L.ON_ADDED_TO_RENDERER)) : this.dispatchEvent(L.ON_REMOVED_FROM_RENDERER));
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
    for (let e in this.description)
      this.description[e] = null;
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
    if (this._resources = {}, this.vertexShader = null, this.fragmentShader = null, this.gpuPipeline = null, this.bindGroups.destroy(), this.bindGroups = new te(this, "pipeline"), e = W.parse(e, "render", this.drawConfig), super.initFromObject(e), e.cullMode ? this.description.primitive.cullMode = e.cullMode : this.description.primitive.cullMode = "none", !e.topology)
      this.description.primitive.topology = "triangle-list";
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
    } else
      e.depthTest && this.setupDepthStencilView();
    if (e.bindgroups) {
      let i;
      for (let r in e.bindgroups)
        if (e.bindgroups[r] instanceof F) {
          const n = e.bindgroups[r].elements, a = [];
          for (let o = 0; o < n.length; o++)
            a[o] = n[o].resource;
          e.bindgroups[r].name = r, this.bindGroups.add(e.bindgroups[r]);
        } else
          i = new F(), i.name = r, i.initFromObject(e.bindgroups[r]), this.bindGroups.add(i);
      if (e.bindgroups.default && e.bindgroups.default.buffer) {
        const r = e.bindgroups.default.buffer.attributes;
        for (let n in r)
          e[n] && (e[n] = r[n]);
      }
    }
    const s = (i) => {
      const r = [];
      let n;
      for (let a in i)
        n = i[a], r.push({ name: a, ...n });
      return r;
    };
    return this.vertexShader = new Ce(), typeof e.vertexShader == "string" ? this.vertexShader.main.text = e.vertexShader : (this.vertexShader.inputs = s(e.vertexShader.inputs), this.vertexShader.outputs = s(e.vertexShader.outputs), e.vertexShader.constants && (this.vertexShader.constants.text = e.vertexShader.constants), this.vertexShader.main.text = e.vertexShader.main), e.fragmentShader && (this.fragmentShader = new Re(), typeof e.fragmentShader == "string" ? this.fragmentShader.main.text = e.fragmentShader : (this.fragmentShader.inputs = s(e.fragmentShader.inputs), this.fragmentShader.outputs = s(e.fragmentShader.outputs), e.fragmentShader.constants && (this.fragmentShader.constants.text = e.fragmentShader.constants), this.fragmentShader.main.text = e.fragmentShader.main)), e;
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
    this.multisampleTexture && this.multisampleTexture.destroy(), e || (e = {}), e.size || (e.size = [this.renderer.width, this.renderer.height]), this.multisampleTexture = new Ne(e), this.description.multisample = {
      count: this.multisampleTexture.description.count
    }, this._depthStencilTexture && (this.renderPassDescriptor.description.sampleCount = 4, this._depthStencilTexture.create());
  }
  //---------------------------
  setupDepthStencilView(e, s, i) {
    if (!this.renderer) {
      this.waitingDepthStencilTexture = !0, this.depthStencilTextureDescriptor = e;
      return;
    }
    i || (i = {}), e || (e = {}), e.size || (e.size = [this.renderer.width, this.renderer.height]), this.multisampleTexture ? e.sampleCount = 4 : e.sampleCount = 1, this._depthStencilTexture && this._depthStencilTexture.destroy(), this._depthStencilTexture = new ee(e, s, i), this.renderPassDescriptor.depthStencilAttachment = this.depthStencilTexture.attachment, this.description.depthStencil = this.depthStencilTexture.description;
  }
  //----------------------------------------
  get renderPassView() {
    return this.renderPass.view;
  }
  get renderPass() {
    return this.renderPassTexture || (this.renderPassTexture = new ne(this)), this.renderPassTexture;
  }
  get useRenderPassTexture() {
    return !!this.renderPassTexture;
  }
  cleanInputs() {
    const e = [], s = this.vertexShader.inputs;
    for (let i in s)
      e.push({ name: i, ...s[i] });
    return this.vertexShader.inputs = e, e;
  }
  getFragmentShaderColorOptions() {
    const e = {
      format: g.getPreferredCanvasFormat()
    };
    return this.blendMode && (e.blend = this.blendMode), e;
  }
  clearAfterDeviceLostAndRebuild() {
    this.onRebuildStartAfterDeviceLost && this.onRebuildStartAfterDeviceLost(), this.gpuPipeline = null, this.drawConfig.indexBuffer && this.drawConfig.indexBuffer.createGpuResource(), this.multisampleTexture && this.multisampleTexture.resize(this.renderer.width, this.renderer.height), this.depthStencilTexture && this.depthStencilTexture.resize(this.renderer.width, this.renderer.height), this.renderPassTexture && this.renderPassTexture.resize(this.renderer.width, this.renderer.height), this.rebuildingAfterDeviceLost = !0, super.clearAfterDeviceLostAndRebuild();
  }
  buildGpuPipeline() {
    if (this.gpuPipeline || this.buildingPipeline)
      return this.gpuPipeline;
    this.buildingPipeline = !0, this.bindGroups.handleRenderPipelineResourceIOs(), this.initPipelineResources(this);
    const e = this.bindGroups.build();
    if (e.description.layout ? this.description.layout = e.description.layout : this.description.layout = "auto", !this.rebuildingAfterDeviceLost) {
      const s = e.buffers;
      this.description.vertex = e.description.vertex;
      const i = new G("Input", this.cleanInputs());
      if (s.length) {
        let a, o, l = 0;
        for (let f = 0; f < s.length; f++) {
          a = s[f], o = a.vertexArrays;
          for (let c = 0; c < o.length; c++)
            i.addProperty({ name: o[c].name, type: o[c].varType, builtin: "@location(" + l + ")" }), l++;
        }
      }
      const r = this.vertexShader.build(this, i);
      let n;
      this.fragmentShader && (n = this.fragmentShader.build(this, r.output.getInputFromOutput())), this.description.vertex = {
        code: r.code,
        entryPoint: "main",
        buffers: e.description.vertex.buffers
      }, this.fragmentShader && (this.description.fragment = {
        code: n.code,
        entryPoint: "main",
        targets: [
          this.getFragmentShaderColorOptions()
        ]
      });
    }
    return this.description.vertex.module = g.device.createShaderModule({ code: this.description.vertex.code }), this.description.fragment && (this.description.fragment.module = g.device.createShaderModule({ code: this.description.fragment.code })), this.rebuildingAfterDeviceLost = !1, this.gpuPipeline = g.createRenderPipeline(this.description), this.resources.__DEBUG__ && (this.vertexShaderDebuggerPipeline = new Me(), this.vertexShaderDebuggerPipeline.init(this, this.debugVertexCount), this.vertexShaderDebuggerPipeline.onLog = (s) => {
      this.dispatchEvent(L.ON_LOG, s);
    }), this.buildingPipeline = !1, this.dispatchEvent(L.ON_GPU_PIPELINE_BUILT), this.gpuPipeline;
  }
  beginRenderPass(e, s, i, r = !1) {
    if (!this.resourceDefined)
      return null;
    if (this.vertexShaderDebuggerPipeline && this.vertexShaderDebuggerPipeline.nextFrame(), this.dispatchEvent(L.ON_DRAW_BEGIN), r)
      this.renderPassDescriptor.colorAttachments[0].loadOp = "clear";
    else {
      this.renderPassDescriptor.colorAttachments[0] && (this._clearValue = this.renderPassDescriptor.colorAttachments[0].clearValue);
      let n = this.renderer.renderPipelines.length == 1 && this.pipelineCount === 1;
      this.rendererUseSinglePipeline !== n && (this.clearOpReady = !1, this.rendererUseSinglePipeline = n), (this.clearOpReady === !1 && this.renderPassDescriptor.colorAttachments[0] || this.pipelineCount > 1) && (this.clearOpReady = !0, n && this.pipelineCount == 1 ? this.renderPassDescriptor.colorAttachments[0].loadOp = "clear" : this.pipelineCount === 1 ? this.renderer.renderPipelines[0] === this ? this.renderPassDescriptor.colorAttachments[0].loadOp = "clear" : this.renderPassDescriptor.colorAttachments[0].loadOp = "load" : (this.renderPassDescriptor.colorAttachments[0].loadOp = "clear", i === 0 || (this.renderPassDescriptor.colorAttachments[0].loadOp = "load")));
    }
    return this.gpuPipeline || this.buildGpuPipeline(), s && this.outputColor && this.handleOutputColor(s), e.beginRenderPass(this.renderPassDescriptor);
  }
  handleOutputColor(e) {
    this.outputColor && (this.multisampleTexture ? (this.multisampleTexture.view || this.multisampleTexture.create(), this.outputColor.view = this.multisampleTexture.view, this.multisampleTexture.resolveTarget ? this.outputColor.resolveTarget = this.multisampleTexture.resolveTarget : this.outputColor.resolveTarget = e) : this.outputColor.view = e);
  }
  //----------------------------------------------------------------------
  update() {
    this.gpuPipeline && (this.renderPassTexture && this.renderPassTexture.update(), this.bindGroups.update());
  }
  draw(e) {
    this.resourceDefined && (e.setPipeline(this.gpuPipeline), this.bindGroups.apply(e));
  }
  //-------------------------------
  end(e, s) {
    if (!this.resourceDefined)
      return;
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
    const { width: r, height: n } = this.renderer;
    this.renderer.resized && (this.multisampleTexture && this.multisampleTexture.resize(r, n), this.depthStencilTexture && this.depthStencilTexture.resize(r, n), this.renderPassTexture && this.renderPassTexture.resize(r, n)), this.renderPassTexture && this.renderPassTexture.mustUseCopyTextureToTexture && (this.renderPassTexture.gpuResource || this.renderPassTexture.createGpuResource(), e.copyTextureToTexture({ texture: this.renderer.texture }, { texture: this.renderPassTexture.gpuResource }, [r, n])), this.multisampleTexture && this.multisampleTexture.update(), this.depthStencilTexture && this.depthStencilTexture.update(), this.renderPassTexture && this.renderPassTexture.update(), this.dispatchEvent(L.ON_DRAW_END);
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
let S = L;
u(S, "ON_ADDED_TO_RENDERER", "ON_ADDED_TO_RENDERER"), u(S, "ON_REMOVED_FROM_RENDERER", "ON_REMOVED_FROM_RENDERER"), u(S, "ON_DRAW_BEGIN", "ON_DRAW_BEGIN"), u(S, "ON_DRAW_END", "ON_DRAW_END"), u(S, "ON_DRAW", "ON_DRAW"), u(S, "ON_GPU_PIPELINE_BUILT", "ON_GPU_PIPELINE_BUILT"), u(S, "ON_LOG", "ON_LOG");
const j = class extends fe {
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
    j.texturedQuadPipeline || (j.texturedQuadPipeline = new S(), j.texturedQuadPipeline.initFromObject({
      vertexCount: 6,
      vertexId: v.vertexInputs.vertexIndex,
      image: new O({ source: null }),
      imgSampler: new J(),
      uv: v.vertexOutputs.Vec2,
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
    })), this.texturedQuadPipeline = j.texturedQuadPipeline;
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
    return this.domElement = e, new Promise(async (i, r) => {
      if (await g.init(), this.deviceId = g.deviceId, this.domElement != null) {
        this.currentWidth = this.domElement.width, this.currentHeight = this.domElement.height;
        try {
          this.gpuCtxConfiguration = {
            device: g.device,
            format: g.getPreferredCanvasFormat(),
            alphaMode: s,
            colorSpace: "srgb",
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING
          }, this.ctx = this.domElement.getContext("webgpu"), this.ctx.configure(this.gpuCtxConfiguration), i(e);
        } catch (n) {
          r(n);
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
      device: g.device,
      format: g.getPreferredCanvasFormat(),
      alphaMode: s,
      colorSpace: "srgb",
      usage: e
    }, this.ctx.configure(this.gpuCtxConfiguration);
  }
  async update() {
    if (!this.ctx || !g.ready || this.renderPipelines.length === 0 || this.deviceId === void 0)
      return;
    if (g.deviceId != this.deviceId && this.ctx.configure({ ...this.gpuCtxConfiguration, device: g.device }), (this.canvas.width != this.currentWidth || this.canvas.height != this.currentHeight) && (this.currentWidth = this.canvas.width, this.currentHeight = this.canvas.height, this.dimensionChanged = !0), g.deviceId != this.deviceId) {
      this.deviceId = g.deviceId;
      for (let n = 0; n < this.renderPipelines.length; n++)
        this.renderPipelines[n].clearAfterDeviceLostAndRebuild();
    }
    this.commandEncoder = g.device.createCommandEncoder();
    let s, i;
    for (let n = 0; n < this.renderPipelines.length; n++) {
      s = this.renderPipelines[n], s.update(), i = s.beginRenderPass(this.commandEncoder, this.view, 0);
      for (let a = 0; a < s.pipelineCount; a++)
        s.dispatchEvent(S.ON_DRAW, a), s.draw(i);
      s.end(this.commandEncoder, i);
    }
    const r = this.commandEncoder.finish();
    this.commandEncoder = null, g.device.queue.submit([r]), this.dimensionChanged = !1, this.dispatchEvent(j.ON_DRAW_END), this.frameId++;
  }
};
let re = j;
u(re, "ON_DRAW_END", "ON_DRAW_END"), u(re, "texturedQuadPipeline");
class rt {
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
    return this.currentWidth = t, this.currentHeight = e, new Promise((r) => {
      g.init().then(() => {
        this.deviceId = g.deviceId, s || (s = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC);
        let n = "bgra8unorm";
        this.useTextureInComputeShader && (n = "rgba8unorm", s += GPUTextureUsage.STORAGE_BINDING), this.textureObj = new xe({
          size: [t, e],
          format: n,
          usage: s,
          sampleCount: i
        }), this.textureObj.create(), r(this);
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
    if (!g.ready || this.renderPipelines.length === 0 || this.deviceId === void 0)
      return;
    if (g.deviceId != this.deviceId) {
      this.textureObj && this.textureObj.create(), this.deviceId = g.deviceId;
      for (let r = 0; r < this.renderPipelines.length; r++)
        this.renderPipelines[r].clearAfterDeviceLostAndRebuild();
    }
    this.commandEncoder = g.device.createCommandEncoder();
    let e, s;
    for (let r = 0; r < this.renderPipelines.length; r++) {
      e = this.renderPipelines[r], e.update();
      for (let n = 0; n < e.pipelineCount; n++)
        s = e.beginRenderPass(this.commandEncoder, this.view, n), e.dispatchEvent(S.ON_DRAW, n), e.draw(s), e.end(this.commandEncoder, s);
    }
    const i = this.commandEncoder.finish();
    this.commandEncoder = null, g.device.queue.submit([i]), this.dimensionChanged = !1;
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
    if (!this.textureObj)
      throw new Error("TextureRenderer is not initialized yet. You must Use TextureRenderer.init in order to initialize it");
    return this.textureObj.gpuResource;
  }
  get view() {
    if (!this.textureObj)
      throw new Error("TextureRenderer is not initialized yet. You must Use TextureRenderer.init in order to initialize it");
    return this.textureObj.view;
  }
}
class Le {
  constructor() {
    u(this, "color", { operation: "add", srcFactor: "one", dstFactor: "zero" });
    u(this, "alpha", { operation: "add", srcFactor: "one", dstFactor: "zero" });
  }
}
class nt extends Le {
  constructor() {
    super(), this.color.operation = "add", this.color.srcFactor = "src-alpha", this.color.dstFactor = "one-minus-src-alpha", this.alpha.operation = "add", this.alpha.srcFactor = "src-alpha", this.alpha.dstFactor = "one-minus-src-alpha";
  }
}
class ut {
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
    for (let n in this.target.resources.bindgroups) {
      s = this.target.resources.bindgroups[n];
      break;
    }
    for (let n in this.bindgroupResources)
      s[n] = this.bindgroupResources[n];
    let i = this.target.resources.vertexShader;
    if (typeof i == "string" && (i = { main: i }), this.vertexShader.outputs) {
      i.outputs || (i.outputs = {});
      for (let n in this.vertexShader.outputs)
        i.outputs[n] = this.vertexShader.outputs[n];
    }
    if (this.vertexShader.inputs) {
      i.inputs || (i.inputs = {});
      for (let n in this.vertexShader.inputs)
        i.inputs[n] = this.vertexShader.inputs[n];
    }
    if (this.vertexShader.constants && (i.constants || (i.constants = ""), i.constants += this.vertexShader.constants), this.vertexShader.main) {
      let n;
      typeof this.vertexShader.main == "string" ? n = this.vertexShader.main : n = this.vertexShader.main.join(`
`), t ? t.text = n : (i.main || (i.main = ""), i.main += n);
    }
    this.target.resources.vertexShader = i;
    let r = this.target.resources.fragmentShader;
    if (typeof r == "string" && (r = { main: r }), this.fragmentShader.outputs) {
      r.outputs || (r.outputs = {});
      for (let n in this.fragmentShader.outputs)
        r.outputs[n] = this.fragmentShader.outputs[n];
    }
    if (this.fragmentShader.inputs) {
      r.inputs || (r.inputs = {});
      for (let n in this.fragmentShader.inputs)
        r.inputs[n] = this.fragmentShader.inputs[n];
    }
    if (this.fragmentShader.constants && (r.constants || (r.constants = ""), r.constants += this.fragmentShader.constants), this.fragmentShader.main) {
      let n;
      typeof this.fragmentShader.main == "string" ? n = this.fragmentShader.main : n = this.fragmentShader.main.join(`
`), e ? e.text = n : (r.main || (r.main = ""), r.main += n);
    }
    return this.target.resources.fragmentShader = r, this.target.initFromObject(this.target.resources), this;
  }
}
class D {
}
u(D, "Float", { type: "f32" }), u(D, "Vec2", { type: "vec2<f32>" }), u(D, "Vec3", { type: "vec3<f32>" }), u(D, "Vec4", { type: "vec4<f32>" }), u(D, "Int", { type: "i32" }), u(D, "IVec2", { type: "vec2<i32>" }), u(D, "IVec3", { type: "vec3<i32>" }), u(D, "IVec4", { type: "vec4<i32>" }), u(D, "Uint", { type: "u32" }), u(D, "UVec2", { type: "vec2<u32>" }), u(D, "UVec3", { type: "vec3<u32>" }), u(D, "UVec4", { type: "vec4<u32>" });
class at extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "float32", e), typeof t != "number" && (this.datas = t);
  }
}
class ot extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "float32x2", e), typeof t != "number" && (this.datas = t);
  }
}
class ht extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "float32x3", e), typeof t != "number" && (this.datas = t);
  }
}
class ft extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "float32x4", e), typeof t != "number" && (this.datas = t);
  }
}
class lt extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "sint32", e), typeof t != "number" && (this.datas = t);
  }
}
class ct extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "sint32x2", e), typeof t != "number" && (this.datas = t);
  }
}
class pt extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "sint32x3", e), typeof t != "number" && (this.datas = t);
  }
}
class dt extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "sint32x4", e), typeof t != "number" && (this.datas = t);
  }
}
class gt extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "uint32", e), typeof t != "number" && (this.datas = t);
  }
}
class mt extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "uint32x2", e), typeof t != "number" && (this.datas = t);
  }
}
class xt extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "uint32x3", e), typeof t != "number" && (this.datas = t);
  }
}
class bt extends I {
  constructor(t, e) {
    t != null && e === void 0 && typeof t == "number" && (e = t, t = void 0), super("", "uint32x4", e), typeof t != "number" && (this.datas = t);
  }
}
export {
  nt as AlphaBlendMode,
  F as Bindgroup,
  te as Bindgroups,
  Le as BlendMode,
  v as BuiltIns,
  Ge as ComputePipeline,
  Se as ComputeShader,
  le as CubeMapTexture,
  ee as DepthStencilTexture,
  Ve as DepthTextureArray,
  fe as EventDispatcher,
  ke as Float,
  at as FloatBuffer,
  Re as FragmentShader,
  re as GPURenderer,
  X as GPUType,
  W as HighLevelParser,
  $e as IVec2,
  ct as IVec2Buffer,
  He as IVec3,
  pt as IVec3Buffer,
  qe as IVec4,
  et as IVec4Array,
  dt as IVec4Buffer,
  O as ImageTexture,
  $ as ImageTextureArray,
  Z as ImageTextureIO,
  we as IndexBuffer,
  We as Int,
  lt as IntBuffer,
  st as Matrix3x3,
  Oe as Matrix4x4,
  it as Matrix4x4Array,
  Ne as MultiSampleTexture,
  Ee as Pipeline,
  ut as PipelinePlugin,
  R as PrimitiveFloatUniform,
  E as PrimitiveIntUniform,
  P as PrimitiveUintUniform,
  ne as RenderPassTexture,
  S as RenderPipeline,
  ue as ShaderNode,
  me as ShaderStage,
  G as ShaderStruct,
  D as ShaderType,
  xe as Texture,
  rt as TextureRenderer,
  J as TextureSampler,
  Ze as UVec2,
  mt as UVec2Buffer,
  Qe as UVec3,
  xt as UVec3Buffer,
  Ke as UVec4,
  tt as UVec4Array,
  bt as UVec4Buffer,
  Xe as Uint,
  gt as UintBuffer,
  A as UniformBuffer,
  N as UniformGroup,
  U as UniformGroupArray,
  je as Vec2,
  ot as Vec2Buffer,
  Ye as Vec3,
  ht as Vec3Buffer,
  Ae as Vec4,
  Je as Vec4Array,
  ft as Vec4Buffer,
  I as VertexAttribute,
  w as VertexBuffer,
  z as VertexBufferIO,
  Ce as VertexShader,
  Me as VertexShaderDebuggerPipeline,
  Y as VideoTexture,
  g as XGPU
};
