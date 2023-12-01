var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { mat4, vec3 } from "gl-matrix";
class BuiltIns {
  static __initDebug() {
    let o;
    for (let z in this.vertexDebug) {
      o = this.vertexDebug[z]();
      this.vertexDebug[z].isArray = !!o.isArray;
      this.vertexDebug[z].len = o.len;
      this.vertexDebug[z].primitiveType = o.primitiveType;
      this.vertexDebug[z].type = o.type;
      this.vertexDebug[z].__debug = true;
    }
  }
}
__publicField(BuiltIns, "vertexInputs", {
  vertexIndex: { builtin: "@builtin(vertex_index)", type: "u32" },
  instanceIndex: { builtin: "@builtin(instance_index)", type: "u32" }
});
__publicField(BuiltIns, "vertexOutputs", {
  position: { builtin: "@builtin(position)", type: "vec4<f32>" },
  Float: { type: "f32", vsOut: true },
  Vec2: { type: "vec2<f32>", vsOut: true },
  Vec3: { type: "vec3<f32>", vsOut: true },
  Vec4: { type: "vec4<f32>", vsOut: true }
});
__publicField(BuiltIns, "vertexDebug", {
  Float: (instanceId = 0, vertexId = 0) => {
    return { vertexId, instanceId, type: "f32", __debug: true };
  },
  Vec2: (instanceId = 0, vertexId = 0) => {
    return { vertexId, instanceId, type: "vec2<f32>", __debug: true };
  },
  Vec3: (instanceId = 0, vertexId = 0) => {
    return { vertexId, instanceId, type: "vec3<f32>", __debug: true };
  },
  Vec4: (instanceId = 0, vertexId = 0) => {
    return { vertexId, instanceId, type: "vec4<f32>", __debug: true };
  },
  Int: (instanceId = 0, vertexId = 0) => {
    return { vertexId, instanceId, type: "i32", __debug: true };
  },
  IVec2: (instanceId = 0, vertexId = 0) => {
    return { vertexId, instanceId, type: "vec2<i32>", __debug: true };
  },
  IVec3: (instanceId = 0, vertexId = 0) => {
    return { vertexId, instanceId, type: "vec3<i32>", __debug: true };
  },
  IVec4: (instanceId = 0, vertexId = 0) => {
    return { vertexId, instanceId, type: "vec4<i32>", __debug: true };
  },
  Uint: (instanceId = 0, vertexId = 0) => {
    return { vertexId, instanceId, type: "uint", __debug: true };
  },
  UVec2: (instanceId = 0, vertexId = 0) => {
    return { vertexId, instanceId, type: "vec2<u32>", __debug: true };
  },
  UVec3: (instanceId = 0, vertexId = 0) => {
    return { vertexId, instanceId, type: "vec3<u32>", __debug: true };
  },
  UVec4: (instanceId = 0, vertexId = 0) => {
    return { vertexId, instanceId, type: "vec4<uf32>", __debug: true };
  },
  Matrix3x3: (instanceId = 0, vertexId = 0) => {
    return { vertexId, instanceId, type: "mat3x3<f32>", __debug: true };
  },
  Matrix4x4: (instanceId = 0, vertexId = 0) => {
    return { vertexId, instanceId, type: "mat4x4<f32>", __debug: true };
  },
  Vec4Array: (len = 1, instanceId = 0, vertexId = 0) => {
    return { vertexId, instanceId, type: "array<vec4<f32>," + len + ">", __debug: true, len, isArray: true, primitiveType: "f32" };
  },
  IVec4Array: (len = 1, instanceId = 0, vertexId = 0) => {
    return { vertexId, instanceId, type: "array<vec4<i32>," + len + ">", __debug: true, len, isArray: true, primitiveType: "i32" };
  },
  UVec4Array: (len = 1, instanceId = 0, vertexId = 0) => {
    return { vertexId, instanceId, type: "array<vec4<u32>," + len + ">", __debug: true, len, isArray: true, primitiveType: "u32" };
  },
  Matrix4x4Array: (len = 1, instanceId = 0, vertexId = 0) => {
    return { vertexId, instanceId, type: "array<mat4x4<f32>," + len + ">", __debug: true, len, isArray: true, primitiveType: "mat4" };
  }
});
//----
__publicField(BuiltIns, "fragmentInputs", {
  frontFacing: { builtin: "@builtin(front_facing)", type: "bool" },
  fragDepth: { builtin: "@builtin(frag_depth)", type: "f32" },
  sampleIndex: { builtin: "@builtin(sample_index)", type: "u32" },
  sampleMask: { builtin: "@builtin(sample_mask)", type: "u32" }
});
__publicField(BuiltIns, "fragmentOutputs", {
  color: { builtin: "@location(0)", type: "vec4<f32>" }
});
//----
__publicField(BuiltIns, "computeInputs", {
  localInvocationId: { builtin: "@builtin(local_invocation_id)", type: "vec3<u32>" },
  localInvocationIndex: { builtin: "@builtin(local_invocation_index)", type: "u32" },
  globalInvocationId: { builtin: "@builtin(global_invocation_id)", type: "vec3<u32>" },
  workgroupId: { builtin: "@builtin(workgroup_id)", type: "vec3<u32>" },
  numWorkgroup: { builtin: "@builtin(num_workgroup)", type: "vec3<u32>" }
});
__publicField(BuiltIns, "computeOutputs", {
  result: { builtin: "@location(0)", type: "???" }
});
const _WebGPUProperties = class {
  static build(obj, currentId, currentNames) {
    let infoById = {};
    let processedIds = /* @__PURE__ */ new Set();
    let stack = [{ id: currentId, names: currentNames }];
    while (stack.length > 0) {
      let current = stack.pop();
      let currentId2 = current.id;
      let currentNames2 = current.names;
      if (processedIds.has(currentId2))
        continue;
      for (let name in obj) {
        let id = obj[name];
        let combinedId = currentId2 | id;
        let combinedNames = [...new Set(currentNames2.concat(name))];
        if (!(combinedId in infoById)) {
          infoById[combinedId] = combinedNames;
          stack.push({ id: combinedId, names: combinedNames });
        } else {
          infoById[combinedId] = [...new Set(infoById[combinedId].concat(combinedNames))];
        }
      }
      processedIds.add(currentId2);
    }
    return infoById;
  }
  static resolve(obj, id) {
    if (id in obj)
      return obj[id].join("|");
    return "undefined";
  }
  static async getResult(WebGpuObject) {
    return new Promise((resolve) => {
      const result = this.build(WebGpuObject, 0, []);
      setTimeout(() => {
        resolve(result);
      }, 1);
    });
  }
  static async init() {
    if (!this._instance)
      new _WebGPUProperties();
    return new Promise(async (resolve) => {
      if (this.ready)
        resolve();
      else {
        this.bufferUsage = await this.getResult(GPUBufferUsage);
        this.shaderStage = await this.getResult(GPUShaderStage);
        this.textureUsage = await this.getResult(GPUTextureUsage);
        this.ready = true;
        resolve();
      }
    });
  }
  constructor() {
    if (_WebGPUProperties._instance) {
      throw new Error("WebGPUProperties is not instanciable");
    }
    _WebGPUProperties._instance = this;
  }
  static getTextureUsageById(id) {
    return this.resolve(this.textureUsage, id);
  }
  static getBufferUsageById(id) {
    return this.resolve(this.bufferUsage, id);
  }
  static getShaderStageById(id) {
    return this.resolve(this.shaderStage, id);
  }
};
let WebGPUProperties = _WebGPUProperties;
__publicField(WebGPUProperties, "ready", false);
__publicField(WebGPUProperties, "textureUsage");
__publicField(WebGPUProperties, "bufferUsage");
__publicField(WebGPUProperties, "shaderStage");
__publicField(WebGPUProperties, "_instance");
const _XGPU = class {
  static get ready() {
    return this._ready;
  }
  static debugUsage(usage) {
    return WebGPUProperties.getBufferUsageById(usage);
  }
  static debugTextureUsage(usage) {
    return WebGPUProperties.getTextureUsageById(usage);
  }
  static debugShaderStage(n) {
    return WebGPUProperties.getShaderStageById(n);
  }
  constructor() {
    throw new Error("GPU is static and can't be instanciated");
  }
  static loseDevice() {
    this.losingDevice = true;
    this.gpuDevice.destroy();
  }
  static clear() {
    this.gpuDevice.destroy();
  }
  static get loseDeviceRecently() {
    return (/* @__PURE__ */ new Date()).getTime() - this.deviceLostTime <= 3e3;
  }
  static init(options) {
    this.requestAdapterOptions = options;
    BuiltIns.__initDebug();
    return new Promise(async (resolve, error) => {
      if (this.gpuDevice) {
        resolve(this);
        return;
      }
      const adapter = await navigator.gpu.requestAdapter(options);
      if (adapter) {
        this.gpuDevice = await adapter.requestDevice();
        this.deviceId++;
        this.deviceLost = false;
        this.gpuDevice.lost.then((info) => {
          console.clear();
          console.error(`WebGPU device was lost: ${info.message}`);
          this.gpuDevice = null;
          this._ready = false;
          this.deviceLost = true;
          this.deviceLostTime = (/* @__PURE__ */ new Date()).getTime();
          if (this.losingDevice || info.reason != "destroyed") {
            this.losingDevice = false;
            _XGPU.init(this.requestAdapterOptions);
          }
        });
        await WebGPUProperties.init();
        this.debugUsage(172);
        this._ready = true;
        resolve(this);
      } else {
        error();
      }
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
    if (!this._preferedCanvasFormat)
      this._preferedCanvasFormat = navigator.gpu.getPreferredCanvasFormat();
    return this._preferedCanvasFormat;
  }
  static setPreferredCanvasFormat(format) {
    this._preferedCanvasFormat = format;
  }
  static destroy() {
    if (this.gpuDevice) {
      this.gpuDevice.destroy();
      this.gpuDevice = null;
      this._ready = false;
    }
  }
  static createBindgroup(o) {
    return this.device.createBindGroup(o);
  }
  static createBindgroupLayout(o) {
    return this.device.createBindGroupLayout(o);
  }
  static createPipelineLayout(o) {
    return this.device.createPipelineLayout(o);
  }
  static createRenderPipeline(o) {
    return this.device.createRenderPipeline(o);
  }
  static createComputePipeline(o) {
    return this.device.createComputePipeline(o);
  }
  static createStagingBuffer(size) {
    return this.device.createBuffer({
      size,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
      mappedAtCreation: false
    });
  }
};
let XGPU = _XGPU;
__publicField(XGPU, "showVertexShader", false);
__publicField(XGPU, "showFragmentShader", false);
__publicField(XGPU, "showComputeShader", false);
__publicField(XGPU, "showVertexDebuggerShader", false);
__publicField(XGPU, "_ready", false);
__publicField(XGPU, "gpuDevice");
__publicField(XGPU, "requestAdapterOptions");
__publicField(XGPU, "losingDevice", false);
__publicField(XGPU, "deviceLost", false);
__publicField(XGPU, "deviceLostTime");
__publicField(XGPU, "deviceId", -1);
__publicField(XGPU, "_preferedCanvasFormat");
class EventDispatcher {
  constructor() {
    __publicField(this, "eventListeners", {});
  }
  addEventListener(eventName, callback, removeListenerAfterDispatch = false) {
    if (!this.eventListeners[eventName])
      this.eventListeners[eventName] = [];
    if (removeListenerAfterDispatch)
      callback.removeAfter = true;
    this.eventListeners[eventName].push(callback);
  }
  removeEventListener(eventName, callback) {
    if (this.eventListeners[eventName]) {
      const id = this.eventListeners[eventName].indexOf(callback);
      if (id != -1) {
        this.eventListeners[eventName].splice(id, 1);
      }
    }
  }
  clearEvents(eventName) {
    this.addEventListener[eventName] = [];
  }
  hasEventListener(eventName) {
    return !!this.eventListeners[eventName];
  }
  dispatchEvent(eventName, eventData) {
    if (this.eventListeners[eventName]) {
      const t = [...this.eventListeners[eventName]];
      t.forEach((callback) => {
        callback(this, eventData);
        if (callback.removeAfter)
          this.removeEventListener(eventName, callback);
      });
    }
  }
}
class GPUType {
  //https://www.w3.org/TR/WGSL/#alignment-and-size
  constructor(dataType) {
    __publicField(this, "_isVector", false);
    __publicField(this, "_isMatrix", false);
    __publicField(this, "_isArray", false);
    __publicField(this, "_vecType", 1);
    __publicField(this, "_arrayLen");
    __publicField(this, "_primitive");
    __publicField(this, "_matrixColumns", 1);
    __publicField(this, "_matrixRows", 1);
    __publicField(this, "_alignOf");
    __publicField(this, "_sizeOf");
    __publicField(this, "_dataType");
    __publicField(this, "_rawType");
    __publicField(this, "getPrimitiveDataType", (dataType, start) => {
      const first = dataType.substring(start, start + 1);
      switch (first) {
        case "u":
          this._primitive = "u32";
          this._alignOf = 4;
          this._sizeOf = 4;
          break;
        case "i":
          this._primitive = "i32";
          this._alignOf = 4;
          this._sizeOf = 4;
          break;
        case "f":
          const val = dataType.substring(start, start + 3);
          if (val === "f32" || val == "flo") {
            this._primitive = "f32";
            this._alignOf = 4;
            this._sizeOf = 4;
          } else if (val === "f16") {
            this._primitive = val;
            this._alignOf = 2;
            this._sizeOf = 2;
          } else
            throw new Error("invalid primitive type");
          break;
        case "v":
          if (dataType.substring(start, start + 3) === "vec") {
            this._isVector = true;
            const type = Number(dataType.substring(start + 3, start + 4));
            if (type >= 2 && type <= 4) {
              this._vecType = type;
              this.getPrimitiveDataType(dataType, start + 5);
              if (this._primitive === "f16") {
                this._sizeOf = 2 * type;
                if (type === 2)
                  this._alignOf = 4;
                else if (type === 3)
                  this._alignOf = 8;
                else if (type === 4)
                  this._alignOf = 8;
              } else {
                this._sizeOf = 4 * type;
                if (type === 2)
                  this._alignOf = 8;
                else if (type === 3)
                  this._alignOf = 16;
                else if (type === 4)
                  this._alignOf = 16;
              }
            } else {
              throw new Error("invalid vec type");
            }
          } else {
            throw new Error("invalid primitive type");
          }
          break;
        case "a":
          if (dataType.substring(start, start + 5) === "array") {
            this._isArray = true;
            let temp = 15;
            if (dataType.substring(6, 7) === "m") {
              temp = 17;
            } else if (dataType.substring(6, 7) === "f" || dataType.substring(6, 7) === "i" || dataType.substring(6, 7) === "u") {
              temp = 9;
            }
            if (dataType.substring(start + temp, start + temp + 1) === ",") {
              let num;
              temp++;
              for (let i = 1; i < 16; i++) {
                let n = dataType.substring(temp, temp + i);
                if (isNaN(Number(n)))
                  break;
                num = n;
              }
              this._arrayLen = Number(num);
            }
            this.getPrimitiveDataType(dataType, start + 6);
            if (this.arrayLength)
              this._sizeOf *= this._arrayLen;
          } else {
            throw new Error("invalid primitive type");
          }
          break;
        case "m":
          if (dataType.substring(start, start + 3) === "mat") {
            this._isMatrix = true;
            const col = Number(dataType.substring(start + 3, start + 4));
            const row = Number(dataType.substring(start + 5, start + 6));
            if (!isNaN(col) && !isNaN(row)) {
              this._matrixColumns = col;
              this._matrixRows = row;
              this.getPrimitiveDataType(dataType, start + 7);
              if (this._primitive === "f16" || this._primitive === "f32") {
                this.getMatrixBytesStructure(col, row, this._primitive);
              } else {
                throw new Error("Matrix values must be f32 or f16");
              }
            } else {
              throw new Error("invalid matrix type");
            }
          } else {
            throw new Error("invalid primitive type");
          }
          break;
      }
    });
    this._rawType = dataType;
    dataType = this.renameDataType(dataType);
    this._dataType = dataType;
    this.getPrimitiveDataType(dataType, 0);
  }
  renameDataType(type) {
    switch (type) {
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
    return type;
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
  set byteAlign(n) {
    this._alignOf = n;
  }
  get dataType() {
    return this._dataType;
  }
  get rawType() {
    return this._rawType;
  }
  get byteValue() {
    if (this._primitive === "f16")
      return 2;
    return 4;
  }
  getMatrixBytesStructure(col, row, primitive) {
    const type = "mat" + col + "x" + row + "<" + primitive + ">";
    const dataInfos = {
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
    };
    const o = dataInfos[type];
    this._alignOf = o[0];
    this._sizeOf = o[1];
  }
}
const _PrimitiveFloatUniform = class extends Float32Array {
  constructor(type, val, createLocalVariable = false) {
    super(val);
    //public uniform: Uniform;
    __publicField(this, "name");
    __publicField(this, "type");
    __publicField(this, "startId", 0);
    __publicField(this, "onChange");
    __publicField(this, "_mustBeTransfered", true);
    __publicField(this, "uniformBuffer");
    __publicField(this, "propertyNames");
    __publicField(this, "createVariableInsideMain", false);
    __publicField(this, "className");
    __publicField(this, "feedbackVertexId", 0);
    __publicField(this, "feedbackInstanceId", 0);
    //--------- EVENT DISPATCHER CLASS (that I can't extends because we already extends Float32Array)----
    __publicField(this, "eventListeners", {});
    this.type = new GPUType(type);
    this.createVariableInsideMain = createLocalVariable;
    this.className = this.constructor.name;
  }
  get mustBeTransfered() {
    return this._mustBeTransfered;
  }
  set mustBeTransfered(b) {
    if (b != this._mustBeTransfered) {
      if (!b)
        this.dispatchEvent(_PrimitiveFloatUniform.ON_CHANGED);
      this._mustBeTransfered = b;
    }
  }
  clone() {
    const o = new _PrimitiveFloatUniform(this.type.rawType, this, this.createVariableInsideMain);
    o.propertyNames = this.propertyNames;
    o.className = this.className;
    o.name = this.name;
    o.startId = this.startId;
    return o;
  }
  initStruct(propertyNames, createVariableInsideMain = false) {
    if (this.type.isArray || this.type.isMatrix)
      throw new Error("initStruct doesn't accept array or matrix");
    this.propertyNames = propertyNames;
    this.createVariableInsideMain = createVariableInsideMain;
  }
  createStruct() {
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
    return res;
  }
  setFeedback(vertexId, instanceId) {
    this.feedbackVertexId = vertexId;
    this.feedbackInstanceId = instanceId;
    return this;
  }
  update() {
  }
  addEventListener(eventName, callback) {
    if (!this.eventListeners[eventName])
      this.eventListeners[eventName] = [];
    this.eventListeners[eventName].push(callback);
  }
  removeEventListener(eventName, callback) {
    if (this.eventListeners[eventName]) {
      const id = this.eventListeners[eventName].indexOf(callback);
      if (id != -1) {
        this.eventListeners[eventName].splice(id, 1);
      }
    }
  }
  dispatchEvent(eventName, eventData) {
    if (this.eventListeners[eventName]) {
      this.eventListeners[eventName].forEach((callback) => {
        callback(this, eventData);
      });
    }
  }
  //---------------------------------------------------------------------------------------------
};
let PrimitiveFloatUniform = _PrimitiveFloatUniform;
__publicField(PrimitiveFloatUniform, "ON_CHANGED", "ON_CHANGED");
const _PrimitiveIntUniform = class extends Int32Array {
  constructor(type, val, createLocalVariable = false) {
    super(val);
    __publicField(this, "name");
    __publicField(this, "type");
    __publicField(this, "startId", 0);
    __publicField(this, "onChange");
    __publicField(this, "_mustBeTransfered", true);
    __publicField(this, "uniformBuffer");
    __publicField(this, "propertyNames");
    __publicField(this, "createVariableInsideMain", false);
    __publicField(this, "className");
    __publicField(this, "feedbackVertexId", 0);
    __publicField(this, "feedbackInstanceId", 0);
    //--------- EVENT DISPATCHER CLASS (that I can't extends because we already extends Int32Array)----
    __publicField(this, "eventListeners", {});
    this.type = new GPUType(type);
    this.createVariableInsideMain = createLocalVariable;
    this.className = this.constructor.name;
  }
  get mustBeTransfered() {
    return this._mustBeTransfered;
  }
  set mustBeTransfered(b) {
    if (b != this._mustBeTransfered) {
      if (!b)
        this.dispatchEvent(_PrimitiveIntUniform.ON_CHANGED);
      this._mustBeTransfered = b;
    }
  }
  clone() {
    return new _PrimitiveIntUniform(this.type.rawType, this, this.createVariableInsideMain);
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
  setFeedback(vertexId, instanceId) {
    this.feedbackVertexId = vertexId;
    this.feedbackInstanceId = instanceId;
    return this;
  }
  update() {
  }
  addEventListener(eventName, callback) {
    if (!this.eventListeners[eventName])
      this.eventListeners[eventName] = [];
    this.eventListeners[eventName].push(callback);
  }
  removeEventListener(eventName, callback) {
    if (this.eventListeners[eventName]) {
      const id = this.eventListeners[eventName].indexOf(callback);
      if (id != -1) {
        this.eventListeners[eventName].splice(id, 1);
      }
    }
  }
  dispatchEvent(eventName, eventData) {
    if (this.eventListeners[eventName]) {
      this.eventListeners[eventName].forEach((callback) => {
        callback(this, eventData);
      });
    }
  }
  //---------------------------------------------------------------------------------------------
};
let PrimitiveIntUniform = _PrimitiveIntUniform;
__publicField(PrimitiveIntUniform, "ON_CHANGED", "ON_CHANGED");
const _PrimitiveUintUniform = class extends Uint32Array {
  constructor(type, val, createLocalVariable = false) {
    super(val);
    __publicField(this, "name");
    __publicField(this, "type");
    __publicField(this, "startId", 0);
    __publicField(this, "uniformBuffer");
    __publicField(this, "onChange");
    __publicField(this, "_mustBeTransfered", true);
    __publicField(this, "propertyNames");
    __publicField(this, "createVariableInsideMain", false);
    __publicField(this, "className");
    __publicField(this, "feedbackVertexId", 0);
    __publicField(this, "feedbackInstanceId", 0);
    //--------- EVENT DISPATCHER CLASS (that I can't extends because we already extends Uint32Array)----
    __publicField(this, "eventListeners", {});
    this.type = new GPUType(type);
    this.createVariableInsideMain = createLocalVariable;
    this.className = this.constructor.name;
  }
  get mustBeTransfered() {
    return this._mustBeTransfered;
  }
  set mustBeTransfered(b) {
    if (b != this._mustBeTransfered) {
      if (!b)
        this.dispatchEvent(_PrimitiveUintUniform.ON_CHANGED);
      this._mustBeTransfered = b;
    }
  }
  clone() {
    return new _PrimitiveUintUniform(this.type.rawType, this, this.createVariableInsideMain);
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
  setFeedback(vertexId, instanceId) {
    this.feedbackVertexId = vertexId;
    this.feedbackInstanceId = instanceId;
    return this;
  }
  update() {
  }
  addEventListener(eventName, callback) {
    if (!this.eventListeners[eventName])
      this.eventListeners[eventName] = [];
    this.eventListeners[eventName].push(callback);
  }
  removeEventListener(eventName, callback) {
    if (this.eventListeners[eventName]) {
      const id = this.eventListeners[eventName].indexOf(callback);
      if (id != -1) {
        this.eventListeners[eventName].splice(id, 1);
      }
    }
  }
  dispatchEvent(eventName, eventData) {
    if (this.eventListeners[eventName]) {
      this.eventListeners[eventName].forEach((callback) => {
        callback(this, eventData);
      });
    }
  }
  //---------------------------------------------------------------------------------------------
};
let PrimitiveUintUniform = _PrimitiveUintUniform;
__publicField(PrimitiveUintUniform, "ON_CHANGED", "ON_CHANGED");
class Float extends PrimitiveFloatUniform {
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
class Vec2 extends PrimitiveFloatUniform {
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
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
}
class Vec3 extends PrimitiveFloatUniform {
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
class Vec4 extends PrimitiveFloatUniform {
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
class Int extends PrimitiveIntUniform {
  constructor(x = 0, createLocalVariable = false) {
    super("i32", [x], createLocalVariable);
  }
  set x(n) {
    this[0] = n;
    this.mustBeTransfered = true;
  }
  get x() {
    return this[0];
  }
}
class IVec2 extends PrimitiveIntUniform {
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
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
}
class IVec3 extends PrimitiveIntUniform {
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
class IVec4 extends PrimitiveIntUniform {
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
class Uint extends PrimitiveUintUniform {
  constructor(x = 0, createLocalVariable = false) {
    super("u32", [x], createLocalVariable);
  }
  set x(n) {
    this[0] = n;
    this.mustBeTransfered = true;
  }
  get x() {
    return this[0];
  }
}
class UVec2 extends PrimitiveUintUniform {
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
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
}
class UVec3 extends PrimitiveUintUniform {
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
class UVec4 extends PrimitiveUintUniform {
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
class Vec4Array extends PrimitiveFloatUniform {
  constructor(vec4Array) {
    let buf = new Float32Array(vec4Array.length * 4);
    for (let i = 0; i < vec4Array.length; i++)
      buf.set(vec4Array[i], i * 4);
    let type = "array<vec4<f32>," + vec4Array.length + ">";
    super("array<vec4<f32>," + vec4Array.length + ">", buf);
    __publicField(this, "vec4Array");
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
class IVec4Array extends PrimitiveIntUniform {
  constructor(ivec4Array) {
    let buf = new Int32Array(ivec4Array.length * 4);
    for (let i = 0; i < ivec4Array.length; i++)
      buf.set(ivec4Array[i], i * 4);
    let type = "array<vec4<i32>," + ivec4Array.length + ">";
    super(type, buf);
    __publicField(this, "ivec4Array");
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
class UVec4Array extends PrimitiveUintUniform {
  constructor(uvec4Array) {
    let buf = new Uint32Array(uvec4Array.length * 4);
    for (let i = 0; i < uvec4Array.length; i++)
      buf.set(uvec4Array[i], i * 4);
    let type = "array<vec4<u32>," + uvec4Array.length + ">";
    super(type, buf);
    __publicField(this, "uvec4Array");
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
class Matrix3x3 extends PrimitiveFloatUniform {
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
class Matrix4x4 extends PrimitiveFloatUniform {
  constructor(floatArray = null) {
    const disableUpdate = !!floatArray;
    if (!floatArray)
      floatArray = new Float32Array([
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
      ]);
    super("mat4x4<f32>", floatArray);
    __publicField(this, "_x", 0);
    __publicField(this, "_y", 0);
    __publicField(this, "_z", 0);
    __publicField(this, "_sx", 1);
    __publicField(this, "_sy", 1);
    __publicField(this, "_sz", 1);
    __publicField(this, "_rx", 0);
    __publicField(this, "_ry", 0);
    __publicField(this, "_rz", 0);
    __publicField(this, "disableUpdate");
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
    this.scaleX = this.scaleY = this.scaleZ = n;
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
class Matrix4x4Array extends PrimitiveFloatUniform {
  constructor(mat4x4Array) {
    let buf = new Float32Array(mat4x4Array.length * 16);
    for (let i = 0; i < mat4x4Array.length; i++)
      buf.set(mat4x4Array[i], i * 16);
    super("array<mat4x4<f32>," + mat4x4Array.length + ">", buf);
    __publicField(this, "matrixs");
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
class ImageTexture extends EventDispatcher {
  constructor(descriptor) {
    super();
    __publicField(this, "resourceIO");
    __publicField(this, "io", 0);
    __publicField(this, "mustBeTransfered", false);
    __publicField(this, "descriptor");
    __publicField(this, "gpuResource");
    __publicField(this, "_view");
    __publicField(this, "viewDescriptor");
    __publicField(this, "useOutsideTexture", false);
    __publicField(this, "renderPassTexture");
    __publicField(this, "gpuTextureIOs");
    __publicField(this, "gpuTextureIO_index", 1);
    __publicField(this, "deviceId");
    __publicField(this, "time");
    __publicField(this, "_textureType");
    descriptor = { ...descriptor };
    this.descriptor = descriptor;
    if (void 0 === descriptor.sampledType)
      descriptor.sampledType = "f32";
    if (void 0 === descriptor.usage)
      descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT;
    if (void 0 === descriptor.format)
      descriptor.format = "rgba8unorm";
    if (void 0 === descriptor.label)
      descriptor.label = "ImageTexture";
    if (void 0 === descriptor.size) {
      if (descriptor.source) {
        descriptor.size = [descriptor.source.width, descriptor.source.height];
        if (descriptor.source instanceof GPUTexture) {
          this.initFromTexture(descriptor.source);
        } else if (descriptor.source instanceof ImageTexture && descriptor.source.isRenderPass) {
          this.renderPassTexture = descriptor.source;
          this.renderPassTexture.addEventListener("RESOURCE_CHANGED", () => {
            this.initFromTexture(this.renderPassTexture.texture);
          });
          this.initFromTexture(descriptor.source.texture);
        }
      } else
        descriptor.size = [1, 1];
    }
    if (descriptor.source)
      this.mustBeTransfered = true;
  }
  initFromTexture(tex) {
    this.gpuResource = tex;
    this.descriptor.format = tex.format;
    this.descriptor.usage = tex.usage;
    this._view = this.gpuResource.createView();
    this.descriptor.source = void 0;
    this.useOutsideTexture = true;
  }
  clone() {
    return new ImageTexture(this.descriptor);
  }
  get sampledType() {
    return this.descriptor.sampledType;
  }
  set sampledType(type) {
    this.descriptor.sampledType = type;
  }
  get isRenderPass() {
    return false;
  }
  initTextureIO(textures) {
    this.gpuTextureIOs = textures;
  }
  get texture() {
    return this.gpuResource;
  }
  getCurrentTexture() {
    return this.gpuResource;
  }
  createView(viewDescriptor) {
    if (this.useOutsideTexture)
      return null;
    let desc = this.viewDescriptor;
    if (viewDescriptor)
      desc = viewDescriptor;
    return this.gpuResource.createView(desc);
  }
  resize(w, h) {
    if (this.useOutsideTexture)
      return null;
    this.descriptor.size = [w, h];
    this.createGpuResource();
    return this;
  }
  get view() {
    if (!this._view)
      this.createGpuResource();
    return this._view;
  }
  get source() {
    return this.descriptor.source;
  }
  set source(bmp) {
    this.useOutsideTexture = bmp instanceof GPUTexture || bmp instanceof ImageTexture && bmp.isRenderPass;
    if (this.useOutsideTexture) {
      if (bmp instanceof GPUTexture) {
        this.gpuResource = bmp;
        this._view = this.gpuResource.createView();
      } else {
        this.renderPassTexture = bmp;
        this.renderPassTexture.clearEvents("RESOURCE_CHANGED");
        this.renderPassTexture.addEventListener("RESOURCE_CHANGED", () => {
          this.initFromTexture(this.renderPassTexture.texture);
        });
        this.gpuResource = bmp.texture;
        this._view = this.gpuResource.createView();
      }
    } else
      this.mustBeTransfered = true;
    this.descriptor.source = bmp;
  }
  update(pipeline) {
    if (this.renderPassTexture && !this.renderPassTexture.mustUseCopyTextureToTexture)
      this.renderPassTexture.applyRenderPass(pipeline);
    if (this.useOutsideTexture)
      return;
    if (!this.gpuResource)
      this.createGpuResource();
    if (this.descriptor.source) {
      if (this.descriptor.source.width !== this.gpuResource.width || this.descriptor.source.height !== this.gpuResource.height) {
        this.descriptor.size = [this.descriptor.source.width, this.descriptor.source.height];
        this.createGpuResource();
        this.mustBeTransfered = true;
      }
    }
    if (this.mustBeTransfered) {
      this.mustBeTransfered = false;
      XGPU.device.queue.copyExternalImageToTexture(
        { source: this.descriptor.source, flipY: true },
        { texture: this.gpuResource },
        this.descriptor.size
      );
    }
  }
  createGpuResource() {
    if (this.useOutsideTexture && this.gpuResource) {
      if (this.deviceId != XGPU.deviceId) {
        const o = this.gpuResource.xgpuObject;
        if (o) {
          o.createGpuResource();
          this.gpuResource = o.gpuResource;
          this._view = o.view;
        }
      }
    }
    this.deviceId = XGPU.deviceId;
    if (this.useOutsideTexture || this.gpuTextureIOs)
      return;
    if (this.gpuResource) {
      this.gpuResource.xgpuObject = null;
      this.gpuResource.destroy();
    }
    this.gpuResource = XGPU.device.createTexture(this.descriptor);
    this.gpuResource.xgpuObject = this;
    this._view = this.gpuResource.createView();
    if (this.descriptor.source)
      this.mustBeTransfered = true;
  }
  destroyGpuResource() {
    if (this.time && (/* @__PURE__ */ new Date()).getTime() - this.time < 100 && XGPU.loseDeviceRecently) {
      return;
    }
    this.time = (/* @__PURE__ */ new Date()).getTime();
    if (this.io && XGPU.loseDeviceRecently) {
      if (this.io === 1) {
        const vbio = this.resourceIO;
        const vbs = vbio.textures;
        let temp = vbs[0].gpuTextureIOs;
        vbs[0].gpuTextureIOs = null;
        vbs[0].createGpuResource();
        vbs[0].gpuTextureIOs = temp;
        temp = vbs[1].gpuTextureIOs;
        vbs[1].gpuTextureIOs = null;
        vbs[1].createGpuResource();
        vbs[1].gpuTextureIOs = temp;
        vbs[0].gpuTextureIOs[0] = vbs[0].gpuResource;
        vbs[0].gpuTextureIOs[1] = vbs[1].gpuResource;
      }
      return;
    }
    if (this.resourceIO)
      this.resourceIO.destroy();
    if (this.useOutsideTexture || this.gpuTextureIOs)
      return;
    if (this.gpuResource) {
      this.gpuResource.xgpuObject = null;
      this.gpuResource.destroy();
    }
    this._view = null;
    this.gpuResource = null;
    this.resourceIO = null;
  }
  createDeclaration(varName, bindingId, groupId = 0) {
    if (this.io != 2)
      return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_2d<" + this.sampledType + ">;\n";
    return " @binding(" + bindingId + ") @group(" + groupId + ") var " + varName + " : texture_storage_2d<rgba8unorm, write>;\n";
  }
  get textureType() {
    return this._textureType;
  }
  set textureType(o) {
    this._textureType = o;
  }
  createBindGroupLayoutEntry(bindingId) {
    let sampleType = "float";
    if (this.sampledType === "i32")
      sampleType = "sint";
    else if (this.sampledType === "u32")
      sampleType = "uint";
    if (this.io != 2)
      return {
        binding: bindingId,
        visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
        ...this.textureType,
        texture: {
          sampleType,
          viewDimension: "2d",
          multisampled: false
        }
      };
    return {
      binding: bindingId,
      visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
      storageTexture: {
        access: "write-only",
        format: "rgba8unorm"
      }
    };
  }
  createBindGroupEntry(bindingId) {
    if (!this.gpuResource || this.deviceId != XGPU.deviceId)
      this.createGpuResource();
    return {
      binding: bindingId,
      resource: this._view
    };
  }
  setPipelineType(pipelineType) {
    if (pipelineType === "render") {
      this.descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT;
    } else if (pipelineType === "compute_mixed") {
      if (this.io === 1) {
        this.descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST;
      } else if (this.io === 2) {
        this.descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.STORAGE_BINDING;
      }
    } else if (pipelineType === "compute") {
      if (this.io !== 0) {
        this.descriptor.usage = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING;
      }
    }
  }
}
class ImageTextureArray extends ImageTexture {
  constructor(descriptor) {
    descriptor = { ...descriptor };
    if (descriptor.source && !descriptor.size) {
      descriptor.size = [descriptor.source[0].width, descriptor.source[0].height, descriptor.source.length];
    }
    if (!descriptor.dimension)
      descriptor.dimension = "2d";
    if (void 0 === descriptor.usage)
      descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;
    super(descriptor);
    __publicField(this, "_bitmaps", []);
    __publicField(this, "mustUpdate", []);
    if (descriptor.source)
      this.bitmaps = descriptor.source;
  }
  clone() {
    if (!this.descriptor.source)
      this.descriptor.source = this._bitmaps;
    return new ImageTextureArray(this.descriptor);
  }
  set bitmaps(images) {
    for (let i = 0; i < images.length; i++) {
      this._bitmaps[i] = images[i];
      this.mustUpdate[i] = true;
    }
    this.mustBeTransfered = true;
    this.update();
  }
  get bitmaps() {
    return this._bitmaps;
  }
  setImageById(image, id) {
    this._bitmaps[id] = image;
    this.mustUpdate[id] = true;
    this.mustBeTransfered = true;
  }
  createGpuResource() {
    if (this.gpuResource)
      this.gpuResource.destroy();
    this.gpuResource = XGPU.device.createTexture(this.descriptor);
    this._view = this.gpuResource.createView({ dimension: "2d-array", arrayLayerCount: this._bitmaps.length });
    for (let i = 0; i < this.mustUpdate.length; i++)
      this.mustUpdate[i] = true;
    this.mustBeTransfered = true;
  }
  updateInnerGpuTextures(commandEncoder) {
    let bmp;
    for (let i = 0; i < this._bitmaps.length; i++) {
      bmp = this.bitmaps[i];
      if (bmp instanceof GPUTexture) {
        commandEncoder.copyTextureToTexture({ texture: bmp }, { texture: this.gpuResource }, [this.gpuResource.width, this.gpuResource.height, i]);
      }
    }
  }
  update() {
    if (this.mustBeTransfered) {
      if (!this.gpuResource)
        this.createGpuResource();
      let bmp;
      for (let i = 0; i < this._bitmaps.length; i++) {
        bmp = this.bitmaps[i];
        if (!(bmp instanceof GPUTexture) && this.mustUpdate[i]) {
          XGPU.device.queue.copyExternalImageToTexture(
            { source: bmp },
            { texture: this.gpuResource, origin: [0, 0, i] },
            [bmp.width, bmp.height]
          );
          this.mustUpdate[i] = false;
        }
      }
      this.mustBeTransfered = false;
    }
  }
  //-----
  createDeclaration(varName, bindingId, groupId = 0) {
    return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_2d_array<" + this.sampledType + ">;\n";
  }
  createBindGroupLayoutEntry(bindingId) {
    let sampleType = "float";
    if (this.sampledType === "i32")
      sampleType = "sint";
    else if (this.sampledType === "u32")
      sampleType = "uint";
    return {
      binding: bindingId,
      visibility: GPUShaderStage.FRAGMENT,
      texture: {
        sampleType,
        viewDimension: "2d-array",
        multisampled: false
      }
    };
  }
  createBindGroupEntry(bindingId) {
    if (!this.gpuResource)
      this.createGpuResource();
    return {
      binding: bindingId,
      resource: this._view
    };
  }
}
class CubeMapTexture extends ImageTextureArray {
  constructor(descriptor) {
    descriptor = { ...descriptor };
    if (!descriptor.dimension)
      descriptor.dimension = "2d";
    if (void 0 === descriptor.usage)
      descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;
    super(descriptor);
    if (descriptor.source)
      this.sides = descriptor.source;
  }
  clone() {
    if (!this.descriptor.source)
      this.descriptor.source = this._bitmaps;
    return new CubeMapTexture(this.descriptor);
  }
  set right(bmp) {
    this._bitmaps[0] = bmp;
    this.mustBeTransfered = true;
  }
  set left(bmp) {
    if (!this.descriptor.source)
      this.descriptor.source = {};
    this._bitmaps[1] = bmp;
    this.mustBeTransfered = true;
  }
  set bottom(bmp) {
    if (!this.descriptor.source)
      this.descriptor.source = {};
    this._bitmaps[2] = bmp;
    this.mustBeTransfered = true;
  }
  set top(bmp) {
    if (!this.descriptor.source)
      this.descriptor.source = {};
    this._bitmaps[3] = bmp;
    this.mustBeTransfered = true;
  }
  set back(bmp) {
    if (!this.descriptor.source)
      this.descriptor.source = {};
    this._bitmaps[4] = bmp;
    this.mustBeTransfered = true;
  }
  set front(bmp) {
    if (!this.descriptor.source)
      this.descriptor.source = {};
    this._bitmaps[5] = bmp;
    this.mustBeTransfered = true;
  }
  set sides(images) {
    for (let i = 0; i < 6; i++)
      this._bitmaps[i] = images[i];
    this.mustBeTransfered = true;
    this.update();
  }
  get sides() {
    return this._bitmaps;
  }
  createGpuResource() {
    if (this.gpuResource)
      this.gpuResource.destroy();
    this.gpuResource = XGPU.device.createTexture(this.descriptor);
    this._view = this.gpuResource.createView({ dimension: "cube" });
    for (let i = 0; i < this.mustUpdate.length; i++)
      this.mustUpdate[i] = true;
    this.mustBeTransfered = true;
  }
  //-----
  createDeclaration(varName, bindingId, groupId = 0) {
    return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_cube<" + this.sampledType + ">;\n";
  }
  createBindGroupLayoutEntry(bindingId) {
    let sampleType = "float";
    if (this.sampledType === "i32")
      sampleType = "sint";
    else if (this.sampledType === "u32")
      sampleType = "uint";
    return {
      binding: bindingId,
      visibility: GPUShaderStage.FRAGMENT,
      texture: {
        sampleType,
        viewDimension: "cube",
        multisampled: false
      }
    };
  }
  createBindGroupEntry(bindingId) {
    if (!this.gpuResource)
      this.createGpuResource();
    return {
      binding: bindingId,
      resource: this._view
    };
  }
  setPipelineType(pipelineType) {
  }
}
class ImageTextureIO {
  constructor(descriptor) {
    __publicField(this, "textures", []);
    __publicField(this, "descriptor");
    __publicField(this, "stagingBuffer");
    __publicField(this, "canCallMapAsync", true);
    __publicField(this, "onOutputData");
    __publicField(this, "outputBuffer");
    let w, h;
    if (descriptor.source != null) {
      w = descriptor.source.width;
      h = descriptor.source.height;
    } else {
      if (!descriptor.width || !descriptor.height) {
        throw new Error("ImageTextureIO width and/or height missing in descriptor");
      }
      w = descriptor.width;
      h = descriptor.height;
    }
    this.descriptor = {
      size: [w, h],
      format: "rgba8unorm",
      usage: descriptor.source instanceof GPUTexture ? descriptor.source.usage : void 0
    };
    if (descriptor.format)
      this.descriptor.format = descriptor.format;
    this.textures[0] = new ImageTexture(this.descriptor);
    this.textures[1] = new ImageTexture(this.descriptor);
    this.textures[0].io = 1;
    this.textures[1].io = 2;
    this.textures[0].resourceIO = this;
    this.textures[1].resourceIO = this;
    if (descriptor.source != null)
      this.textures[0].source = descriptor.source;
  }
  clone() {
    const obj = {
      source: this.textures[0].gpuResource,
      width: this.descriptor.size[0],
      height: this.descriptor.size[1],
      format: this.descriptor.format
    };
    return new ImageTextureIO(obj);
  }
  createDeclaration(name, bindingId, groupId) {
    let result = "";
    const varName = name.substring(0, 1).toLowerCase() + name.slice(1);
    result += " @binding(" + bindingId + ") @group(" + groupId + ") var " + varName + " : texture_2d<f32>;\n";
    result += " @binding(" + (bindingId + 1) + ") @group(" + groupId + ") var " + varName + "_out : texture_storage_2d<rgba8unorm, write>;\n";
    return result;
  }
  destroy() {
    if (this.stagingBuffer)
      this.stagingBuffer.destroy();
    this.textures = void 0;
    this.onOutputData = void 0;
  }
  async getOutputData() {
    if (!this.onOutputData || !this.canCallMapAsync)
      return;
    if (!this.outputBuffer) {
      this.outputBuffer = XGPU.device.createBuffer({
        size: this.width * this.height * 4 * 4,
        usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        mappedAtCreation: false
      });
      this.stagingBuffer = XGPU.createStagingBuffer(this.outputBuffer.size);
    }
    var texture = this.textures[0].gpuResource;
    const copyEncoder = XGPU.device.createCommandEncoder();
    const stage = this.stagingBuffer;
    copyEncoder.copyTextureToBuffer({ texture }, { buffer: this.outputBuffer, bytesPerRow: Math.ceil(this.width * 4 / 256) * 256, rowsPerImage: this.height }, [this.width, this.height, 1]);
    copyEncoder.copyBufferToBuffer(this.outputBuffer, 0, stage, 0, stage.size);
    XGPU.device.queue.submit([copyEncoder.finish()]);
    this.canCallMapAsync = false;
    await this.stagingBuffer.mapAsync(GPUMapMode.READ, 0, stage.size);
    this.canCallMapAsync = true;
    const copyArray = stage.getMappedRange(0, stage.size);
    const data = copyArray.slice(0);
    stage.unmap();
    this.onOutputData(new Uint32Array(data));
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
class TextureSampler {
  constructor(descriptor) {
    __publicField(this, "mustBeTransfered", false);
    // not applicable with sampler
    __publicField(this, "gpuResource");
    __publicField(this, "descriptor");
    //----------------------------
    __publicField(this, "deviceId", 0);
    if (!descriptor)
      descriptor = {};
    if (!descriptor.compare) {
      descriptor = { ...descriptor };
      if (void 0 === descriptor.minFilter)
        descriptor.minFilter = "linear";
      if (void 0 === descriptor.magFilter)
        descriptor.magFilter = "linear";
      if (void 0 === descriptor.addressModeU)
        descriptor.addressModeU = "clamp-to-edge";
      if (void 0 === descriptor.addressModeV)
        descriptor.addressModeV = "clamp-to-edge";
      if (void 0 === descriptor.addressModeW)
        descriptor.addressModeW = "clamp-to-edge";
      if (void 0 === descriptor.mipmapFilter)
        descriptor.mipmapFilter = "nearest";
      if (void 0 === descriptor.lodMinClamp)
        descriptor.lodMinClamp = 0;
      if (void 0 === descriptor.lodMaxClamp)
        descriptor.lodMaxClamp = 32;
      if (void 0 === descriptor.maxAnisotropy)
        descriptor.maxAnisotropy = 1;
    }
    if (descriptor)
      this.descriptor = descriptor;
  }
  clone() {
    return new TextureSampler(this.descriptor);
  }
  get isComparison() {
    return !!this.descriptor.compare;
  }
  get isFiltering() {
    return this.descriptor.minFilter === "linear" || this.descriptor.magFilter === "linear" || this.descriptor.mipmapFilter === "linear";
  }
  setAddressModes(u = "clamp-to-edge", v = "clamp-to-edge", w = "clamp-to-edge") {
    this.descriptor.addressModeU = u;
    this.descriptor.addressModeV = v;
    this.descriptor.addressModeW = w;
  }
  setFilterModes(min = "nearest", mag = "nearest", mipmap = "nearest") {
    this.descriptor.minFilter = min;
    this.descriptor.magFilter = mag;
    this.descriptor.mipmapFilter = mipmap;
  }
  setClamp(min = 0, max = 32) {
    this.descriptor.lodMinClamp = min;
    this.descriptor.lodMaxClamp = max;
  }
  setCompareFunction(compareType) {
    this.descriptor.compare = compareType;
  }
  setMaxAnisotropy(n) {
    n = Math.round(n);
    if (n < 1)
      n = 1;
    if (n > 16)
      n = 16;
    this.descriptor.maxAnisotropy = n;
  }
  createGpuResource() {
    this.gpuResource = XGPU.device.createSampler(this.descriptor);
    this.deviceId = XGPU.deviceId;
  }
  destroyGpuResource() {
    this.gpuResource = null;
  }
  update() {
  }
  createDeclaration(varName, bindingId, groupId = 0) {
    if (this.isComparison)
      return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":sampler_comparison;\n";
    return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":sampler;\n";
  }
  createBindGroupLayoutEntry(bindingId) {
    let type = "comparison";
    if (!this.isComparison) {
      type = "filtering";
      if (!this.isFiltering) {
        type = "non-filtering";
      }
    }
    return {
      binding: bindingId,
      visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
      sampler: {
        type
      }
    };
  }
  createBindGroupEntry(bindingId) {
    if (!this.gpuResource || this.deviceId != XGPU.deviceId)
      this.createGpuResource();
    return {
      binding: bindingId,
      resource: this.gpuResource
    };
  }
  setPipelineType(pipelineType) {
  }
}
class UniformGroupArray {
  constructor(groups, createLocalVariable = false) {
    __publicField(this, "groups");
    __publicField(this, "startId", 0);
    __publicField(this, "createVariableInsideMain", false);
    __publicField(this, "mustBeTransfered", true);
    __publicField(this, "name");
    __publicField(this, "buffer", null);
    this.groups = groups;
    this.createVariableInsideMain = createLocalVariable;
  }
  get uniformBuffer() {
    return this.buffer;
  }
  set uniformBuffer(buffer) {
    this.buffer = buffer;
    if (buffer)
      buffer.mustBeTransfered = true;
    for (let i = 0; i < this.groups.length; i++) {
      this.groups[i].uniformBuffer = buffer;
    }
  }
  clone() {
    const t = [...this.groups];
    for (let i = 0; i < t.length; i++) {
      t[i] = t[i].clone();
    }
    const group = new UniformGroupArray(t, this.createVariableInsideMain);
    group.startId = this.startId;
    group.name = this.name;
    return group;
  }
  get type() {
    return { nbComponent: this.arrayStride, isUniformGroup: true, isArray: true };
  }
  getStructName(name) {
    if (!name)
      return null;
    return name[0].toUpperCase() + name.slice(1);
  }
  getVarName(name) {
    if (!name)
      return null;
    return name[0].toLowerCase() + name.slice(1);
  }
  createVariable(uniformBufferName) {
    if (!this.createVariableInsideMain)
      return "";
    const varName = this.getVarName(this.name);
    return "   var " + varName + ":array<" + this.getStructName(this.name) + "," + this.length + "> = " + this.getVarName(uniformBufferName) + "." + varName + ";\n";
  }
  update(gpuResource, fromUniformBuffer = false) {
    for (let i = 0; i < this.groups.length; i++) {
      this.groups[i].update(gpuResource, false);
    }
  }
  forceUpdate() {
    for (let i = 0; i < this.groups.length; i++) {
      this.groups[i].forceUpdate();
    }
  }
  getElementById(id) {
    return this.groups[id];
  }
  get length() {
    return this.groups.length;
  }
  get arrayStride() {
    return this.groups[0].arrayStride * this.groups.length;
  }
  get isArray() {
    return true;
  }
  get isUniformGroup() {
    return true;
  }
}
class UniformGroup {
  constructor(items, useLocalVariable) {
    __publicField(this, "unstackedItems", {});
    __publicField(this, "items");
    __publicField(this, "itemNames", []);
    __publicField(this, "arrayStride", 0);
    __publicField(this, "startId", 0);
    __publicField(this, "createVariableInsideMain", false);
    __publicField(this, "mustBeTransfered", true);
    __publicField(this, "_name");
    __publicField(this, "wgsl");
    __publicField(this, "wgslStructNames", []);
    /*an uniformGroup can be used multiple times, not necessarily in an array so we must 
    so we must store the name we use when we build the 'struct' in order to write a 'struct' 
    for every properties while being sure we don't have two sames structs*/
    __publicField(this, "datas");
    __publicField(this, "buffer", null);
    this.createVariableInsideMain = !!useLocalVariable;
    let o;
    for (let z in items) {
      o = items[z];
      if (o instanceof PrimitiveFloatUniform || o instanceof PrimitiveIntUniform || o instanceof PrimitiveUintUniform || o instanceof UniformGroup || o instanceof UniformGroupArray)
        ;
      else {
        throw new Error("UniformGroup accept only PrimitiveFloatUniform, PrimitiveIntUniform, PrimitiveUintUniform, UniformGroup and UniformGroupArray");
      }
      this.add(z, o, this.createVariableInsideMain, false);
    }
    this.items = this.stackItems(items);
  }
  set(datas) {
    this.datas = datas;
    this.mustBeTransfered = true;
  }
  get uniformBuffer() {
    return this.buffer;
  }
  set uniformBuffer(buffer) {
    this.buffer = buffer;
    if (buffer) {
      buffer.mustBeTransfered = true;
    }
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].uniformBuffer = buffer;
    }
  }
  destroy() {
    console.warn("uniformGroup.destroy");
    this.unstackedItems = {};
    this.items = [];
    this.itemNames = [];
    this.arrayStride = 0;
    this.startId = 0;
    this.mustBeTransfered = true;
    this.datas = null;
    this.buffer = null;
    this.wgsl = null;
    this._name = null;
    this.uniformBuffer = null;
  }
  get name() {
    return this._name;
  }
  set name(s) {
    this._name = this.getStructName(s);
  }
  clone(propertyNames) {
    const items = { ...this.unstackedItems };
    if (propertyNames) {
      for (let i = 0; i < propertyNames.length; i++) {
        items[propertyNames[i]] = items[propertyNames[i]].clone();
      }
    } else {
      for (let z in items) {
        items[z] = items[z].clone();
      }
    }
    const group = new UniformGroup(items);
    group.name = this.name;
    return group;
  }
  remove(name) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === name) {
        const o = this.items.splice(i, 1)[0];
        this.itemNames.splice(this.itemNames.indexOf(name), 1);
        return o;
      }
    }
    return null;
  }
  add(name, data, useLocalVariable = false, stackItems = true) {
    data.uniformBuffer = this.uniformBuffer;
    data.name = name;
    data.mustBeTransfered = true;
    if (this.uniformBuffer && this.uniformBuffer.descriptor.useLocalVariable || useLocalVariable) {
      data.createVariableInsideMain = true;
    }
    const alreadyDefined = !!this.unstackedItems[name];
    this.unstackedItems[name] = data;
    if (alreadyDefined) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].name === name) {
          this.items[i] = data;
          break;
        }
      }
    } else {
      this.itemNames.push(name);
    }
    if (stackItems)
      this.items = this.stackItems(this.unstackedItems);
    if (this.wgsl)
      this.wgsl = this.getStruct(this.name);
    if (this.uniformBuffer)
      this.uniformBuffer.mustBeTransfered = true;
    return data;
  }
  getElementByName(name) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === name) {
        return this.items[i];
      }
    }
    return null;
  }
  get type() {
    return { nbComponent: this.arrayStride, isUniformGroup: true, isArray: false };
  }
  getStructName(name) {
    if (!name)
      return null;
    return name[0].toUpperCase() + name.slice(1);
  }
  getVarName(name) {
    if (!name)
      return null;
    return name[0].toLowerCase() + name.slice(1);
  }
  createVariable(uniformBufferName) {
    if (!this.createVariableInsideMain)
      return "";
    const varName = this.getVarName(this.name);
    return "   var " + varName + ":" + this.getStructName(this.name) + " = " + this.getVarName(uniformBufferName) + "." + varName + ";\n";
  }
  updateStack() {
    this.items = this.stackItems(this.items);
  }
  forceUpdate() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i] instanceof UniformGroup || this.items[i] instanceof UniformGroupArray)
        this.items[i].forceUpdate();
      this.items[i].mustBeTransfered = true;
    }
  }
  async update(gpuResource, fromUniformBuffer = false) {
    if (fromUniformBuffer === false) {
      XGPU.device.queue.writeBuffer(
        gpuResource,
        this.startId,
        this.datas.buffer,
        0,
        this.arrayStride * Float32Array.BYTES_PER_ELEMENT
      );
      return;
    }
    let item;
    for (let i = 0; i < this.items.length; i++) {
      item = this.items[i];
      if (!item.type.isUniformGroup)
        item.update();
      if (item.mustBeTransfered) {
        if (item instanceof UniformGroup || item instanceof UniformGroupArray) {
          item.update(gpuResource, false);
        } else {
          this.datas.set(item, item.startId);
          XGPU.device.queue.writeBuffer(
            gpuResource,
            item.startId * Float32Array.BYTES_PER_ELEMENT,
            item.buffer,
            item.byteOffset,
            item.byteLength
          );
        }
        item.mustBeTransfered = false;
      }
    }
  }
  getStruct(name) {
    this.name = name;
    let struct = "struct " + this.name + " {\n";
    let item;
    let localVariables = "";
    let otherStructs = "";
    let primitiveStructs = "";
    let o;
    for (let i = 0; i < this.items.length; i++) {
      item = this.items[i];
      if (item instanceof UniformGroup || item instanceof UniformGroupArray) {
        if (item instanceof UniformGroup) {
          if (!item.wgsl) {
            o = item.getStruct(item.name);
            localVariables += o.localVariables + "\n";
            item.wgslStructNames.push(item.name);
          }
          if (otherStructs.indexOf(item.wgsl.struct) === -1) {
            otherStructs = item.wgsl.struct + otherStructs;
          }
          struct += "    " + this.getVarName(item.name) + ":" + item.name + ",\n";
          localVariables += item.createVariable(this.name);
        } else {
          name = item.name;
          if (!item.groups[0].wgsl) {
            o = item.groups[0].getStruct(item.name);
            localVariables += o.localVariables;
          }
          if (otherStructs.indexOf(item.groups[0].wgsl.struct) === -1) {
            otherStructs = item.groups[0].wgsl.struct + otherStructs;
          }
          struct += "    " + name + ":array<" + this.getStructName(name) + "," + item.length + ">,\n";
          localVariables += item.createVariable(this.name);
        }
      } else {
        let o2 = item;
        if (o2.propertyNames) {
          let s = o2.createStruct();
          if (primitiveStructs.indexOf(s) === -1 && otherStructs.indexOf(s) === -1 && struct.indexOf(s) === -1) {
            primitiveStructs += s + "\n";
          }
          struct += "     @size(16) " + o2.name + ":" + o2.className + ",\n";
        } else {
          if (o2.type.isArray) {
            if (o2.type.isArrayOfMatrixs) {
              let col = o2.type.matrixColumns;
              let row = 4;
              if (o2.type.matrixRows === 2)
                row = 2;
              struct += "    @size(" + o2.type.arrayLength * col * row * 4 + ") " + o2.name + ":" + o2.type.dataType + ",\n";
            } else {
              struct += "    @size(" + o2.type.arrayLength * 16 + ") " + o2.name + ":" + o2.type.dataType + ",\n";
            }
          } else {
            struct += "    " + o2.name + ":" + o2.type.dataType + ",\n";
          }
        }
        if (o2.createVariableInsideMain)
          localVariables += o2.createVariable(this.getVarName(this.name));
      }
    }
    struct += "}\n\n";
    struct = primitiveStructs + otherStructs + struct;
    this.wgsl = {
      struct,
      localVariables
    };
    return this.wgsl;
  }
  stackItems(items) {
    const result = [];
    let bound = 1;
    var floats = [];
    var vec2s = [];
    var vec3s = [];
    let v, type, nbComponent;
    let offset = 0;
    for (let z in items) {
      v = items[z];
      v.name = z;
      type = v.type;
      if (v instanceof UniformGroupArray) {
        v.startId = offset;
        offset += v.arrayStride;
        result.push(v);
      } else {
        if (type.isArray) {
          v.startId = offset;
          if (type.isArrayOfMatrixs) {
            offset += type.matrixRows * 4 * type.arrayLength;
          } else {
            offset += 4 * type.arrayLength;
          }
          bound = 4;
          result.push(v);
        } else if (type.isMatrix) {
          v.startId = offset;
          let col = type.matrixColumns;
          let row = 4;
          if (type.matrixRows === 2)
            row = 2;
          offset += col * row;
          bound = row;
          result.push(v);
        } else if (type.isUniformGroup) {
          if (type.nbComponent >= 4) {
            bound = 4;
            v.startId = offset;
            offset += Math.ceil(type.nbComponent / 4) * 4;
            result.push(v);
          }
        } else if (v.propertyNames) {
          bound = 4;
          v.startId = offset;
          offset += 4;
          result.push(v);
        } else {
          nbComponent = type.nbValues;
          if (nbComponent === 1)
            floats.push(v);
          else if (nbComponent === 2) {
            if (bound < 2)
              bound = 2;
            vec2s.push(v);
          } else if (nbComponent === 3) {
            bound = 4;
            vec3s.push(v);
          } else if (nbComponent >= 4) {
            bound = 4;
            v.startId = offset;
            offset += nbComponent;
            result.push(v);
          }
        }
      }
    }
    const addVec3 = () => {
      v = vec3s.shift();
      v.startId = offset;
      offset += 3;
      result.push(v);
      if (floats.length) {
        const f = floats.shift();
        f.startId = offset;
        result.push(f);
      }
      offset++;
    };
    let nb = vec3s.length;
    for (let i = 0; i < nb; i++)
      addVec3();
    nb = vec2s.length;
    for (let i = 0; i < nb; i++) {
      v = vec2s.shift();
      v.startId = offset;
      offset += 2;
      result.push(v);
    }
    nb = floats.length;
    for (let i = 0; i < nb; i++) {
      v = floats.shift();
      v.startId = offset;
      offset++;
      result.push(v);
    }
    if (offset % bound !== 0) {
      offset += bound - offset % bound;
    }
    this.arrayStride = offset;
    this.datas = new Float32Array(offset);
    let o;
    for (let i = 0; i < result.length; i++) {
      o = result[i];
      if (o instanceof UniformGroup || o instanceof UniformGroupArray) {
        if (o instanceof UniformGroup) {
          this.datas.set(o.datas, o.startId);
        } else {
          let start = o.startId;
          for (let j = 0; j < o.length; j++) {
            this.datas.set(o.groups[j].datas, start);
            start += o.groups[j].arrayStride;
          }
        }
      } else {
        this.datas.set(o, o.startId);
      }
    }
    return result;
  }
}
class UniformBuffer {
  constructor(items, descriptor) {
    __publicField(this, "gpuResource");
    __publicField(this, "descriptor");
    __publicField(this, "group");
    __publicField(this, "cloned", false);
    __publicField(this, "time");
    //public get bufferType(): string { return "uniform"; }
    __publicField(this, "debug");
    __publicField(this, "shaderVisibility");
    this.descriptor = descriptor ? { ...descriptor } : {};
    this.group = new UniformGroup(items, this.descriptor.useLocalVariable);
    this.group.uniformBuffer = this;
  }
  get mustBeTransfered() {
    return this.group.mustBeTransfered;
  }
  set mustBeTransfered(b) {
    this.group.mustBeTransfered = b;
  }
  clone(propertyNames) {
    const items = { ...this.group.unstackedItems };
    if (propertyNames) {
      for (let z in items) {
        if (propertyNames.indexOf(z) !== -1)
          items[z] = items[z].clone();
      }
    } else {
      for (let z in items)
        items[z] = items[z].clone();
    }
    const buffer = new UniformBuffer(items, this.descriptor);
    buffer.cloned = true;
    buffer.name = this.name;
    return buffer;
  }
  add(name, data, useLocalVariable = false) {
    return this.group.add(name, data, useLocalVariable);
  }
  remove(name) {
    return this.group.remove(name);
  }
  update() {
    if (!this.gpuResource)
      this.createGpuResource();
    this.group.update(this.gpuResource, true);
    this.mustBeTransfered = false;
  }
  createStruct(uniformName) {
    const o = this.group.getStruct(uniformName);
    return o;
  }
  createDeclaration(uniformName, bindingId, groupId = 0) {
    const structName = uniformName.substring(0, 1).toUpperCase() + uniformName.slice(1);
    const varName = uniformName.substring(0, 1).toLowerCase() + uniformName.slice(1);
    if (this.bufferType === "uniform")
      return "@binding(" + bindingId + ") @group(" + groupId + ") var<uniform> " + varName + ":" + structName + ";\n";
    else
      return "@binding(" + bindingId + ") @group(" + groupId + ") var<storage, read> " + varName + ":" + structName + ";\n";
  }
  getUniformById(id) {
    return this.group.items[id];
  }
  getUniformByName(name) {
    return this.group.getElementByName(name);
  }
  //------------------------------
  get bufferType() {
    if (this.group.arrayStride * Float32Array.BYTES_PER_ELEMENT < 65536)
      return "uniform";
    return "read-only-storage";
  }
  createGpuResource() {
    if (!this.gpuResource) {
      const size = this.group.arrayStride * Float32Array.BYTES_PER_ELEMENT;
      let usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
      if (this.bufferType === "read-only-storage")
        usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST;
      this.gpuResource = XGPU.device.createBuffer({
        size,
        usage
      });
      this.update();
    }
  }
  getItemsAsArray() {
    const result = [];
    for (let i = 0; i < this.itemNames.length; i++)
      result[i] = this.items[this.itemNames[i]];
    return result;
  }
  destroyGpuResource() {
    if (this.time && (/* @__PURE__ */ new Date()).getTime() - this.time < 100 && XGPU.loseDeviceRecently) {
      if (this.gpuResource) {
        this.group.updateStack();
        return;
      }
    }
    this.time = (/* @__PURE__ */ new Date()).getTime();
    if (this.gpuResource) {
      this.group.updateStack();
      this.group.forceUpdate();
      this.gpuResource.destroy();
    }
    this.gpuResource = null;
  }
  createBindGroupLayoutEntry(bindingId) {
    let type = "uniform";
    if (this.bufferType)
      type = this.bufferType;
    return {
      binding: bindingId,
      visibility: this.descriptor.visibility,
      buffer: {
        type
      }
    };
  }
  createBindGroupEntry(bindingId) {
    if (!this.gpuResource)
      this.createGpuResource();
    return {
      binding: bindingId,
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
  setPipelineType(pipelineType) {
    if (pipelineType === "compute" || pipelineType === "compute_mixed")
      this.descriptor.visibility = GPUShaderStage.COMPUTE;
    else {
      this.descriptor.visibility = this.shaderVisibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX;
    }
  }
}
class VertexAttribute {
  constructor(name, dataType, offset) {
    __publicField(this, "_name");
    __publicField(this, "_dataType");
    __publicField(this, "nbValues");
    __publicField(this, "vertexType");
    __publicField(this, "_data");
    __publicField(this, "dataOffset");
    __publicField(this, "mustBeTransfered", false);
    __publicField(this, "_vertexBuffer");
    __publicField(this, "waitingVertexBuffer", false);
    dataType = this.renameVertexDataType(dataType);
    this._name = name;
    this._dataType = dataType;
    this.dataOffset = offset;
    if (VertexAttribute.types[dataType]) {
      this.vertexType = VertexAttribute.types[dataType];
      this.nbValues = this.vertexType.nbComponent;
    } else {
      const infos = new GPUType(dataType);
      this.nbValues = infos.nbValues;
      this.vertexType = this.getVertexDataType(infos.dataType);
    }
  }
  static Float(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    return { type: "float32", offset, datas };
  }
  static Vec2(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    return { type: "float32x2", offset, datas };
  }
  static Vec3(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    return { type: "float32x3", offset, datas };
  }
  static Vec4(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    return { type: "float32x4", offset, datas };
  }
  static Int(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    return { type: "sint32", offset, datas };
  }
  static IVec2(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    return { type: "sint32x2", offset, datas };
  }
  static IVec3(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    return { type: "sint32x3", offset, datas };
  }
  static IVec4(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    return { type: "sint32x4", offset, datas };
  }
  static Uint(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    return { type: "uint32", offset, datas };
  }
  static UVec2(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    return { type: "uint32x2", offset, datas };
  }
  static UVec3(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    return { type: "uint32x3", offset, datas };
  }
  static UVec4(datas, offset) {
    if (datas && !offset) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    return { type: "uint32x4", offset, datas };
  }
  static get types() {
    return {
      "uint8x2": { nbComponent: 2, bytes: 2, varType: "vec2<u32>" },
      "uint8x4": { nbComponent: 4, bytes: 4, varType: "vec4<u32>" },
      "sint8x2": { nbComponent: 2, bytes: 2, varType: "vec2<i32>" },
      "sint8x4": { nbComponent: 4, bytes: 4, varType: "vec4<i32>" },
      "unorm8x2": { nbComponent: 2, bytes: 2, varType: "vec2<f32>" },
      "unorm8x4": { nbComponent: 4, bytes: 4, varType: "vec4<f32>" },
      "snorm8x2": { nbComponent: 2, bytes: 2, varType: "vec2<f32>" },
      "snorm8x4": { nbComponent: 4, bytes: 4, varType: "vec4<f32>" },
      "uint16x2": { nbComponent: 2, bytes: 4, varType: "vec2<u32>" },
      "uint16x4": { nbComponent: 4, bytes: 8, varType: "vec4<u32>" },
      "sint16x2": { nbComponent: 2, bytes: 4, varType: "vec2<i32>" },
      "sint16x4": { nbComponent: 4, bytes: 8, varType: "vec4<i32>" },
      "unorm16x2": { nbComponent: 2, bytes: 4, varType: "vec2<f32>" },
      "unorm16x4": { nbComponent: 4, bytes: 8, varType: "vec4<f32>" },
      "snorm16x2": { nbComponent: 2, bytes: 4, varType: "vec2<f32>" },
      "snorm16x4": { nbComponent: 4, bytes: 8, varType: "vec4<f32>" },
      "float16x2": { nbComponent: 2, bytes: 4, varType: "vec2<f16>" },
      "float16x4": { nbComponent: 4, bytes: 8, varType: "vec4<f16>" },
      "float32": { nbComponent: 1, bytes: 4, varType: "f32" },
      "float32x2": { nbComponent: 2, bytes: 8, varType: "vec2<f32>" },
      "float32x3": { nbComponent: 3, bytes: 12, varType: "vec3<f32>" },
      "float32x4": { nbComponent: 4, bytes: 16, varType: "vec4<f32>" },
      "uint32": { nbComponent: 1, bytes: 4, varType: "u32" },
      "uint32x2": { nbComponent: 2, bytes: 8, varType: "vec2<u32>" },
      "uint32x3": { nbComponent: 3, bytes: 12, varType: "vec3<u32>" },
      "uint32x4": { nbComponent: 4, bytes: 16, varType: "vec4<u32>" },
      "sint32": { nbComponent: 1, bytes: 4, varType: "i32" },
      "sint32x2": { nbComponent: 2, bytes: 8, varType: "vec2<i32>" },
      "sint32x3": { nbComponent: 3, bytes: 12, varType: "vec3<i32>" },
      "sint32x4": { nbComponent: 4, bytes: 16, varType: "vec4<i32>" }
    };
  }
  get vertexBuffer() {
    return this._vertexBuffer;
  }
  set vertexBuffer(vb) {
    this._vertexBuffer = vb;
    if (this.waitingVertexBuffer) {
      this.waitingVertexBuffer = true;
      this.vertexBuffer.attributeChanged = true;
    }
  }
  get datas() {
    return this._data;
  }
  set datas(n) {
    if (this._data != n) {
      this._data = n;
      if (this.vertexBuffer)
        this.vertexBuffer.attributeChanged = true;
      else
        this.waitingVertexBuffer = true;
      this.mustBeTransfered = true;
    }
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
  renameVertexDataType(type) {
    switch (type) {
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
    return type;
  }
  getVertexDataType(dataType) {
    switch (dataType) {
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
class ShaderStruct {
  constructor(name, properties) {
    __publicField(this, "properties", []);
    __publicField(this, "isShaderIO", false);
    __publicField(this, "name");
    if (name === "Input" || name === "Output") {
      this.isShaderIO = true;
    }
    this.name = name;
    if (properties) {
      for (let i = 0; i < properties.length; i++) {
        if (!properties[i].builtin)
          properties[i].builtin = "";
      }
      this.properties = properties;
    }
  }
  clone(name) {
    let n = name ? name : this.name;
    return new ShaderStruct(n, [...this.properties]);
  }
  addProperty(o) {
    if (!o.builtin)
      o.builtin = "";
    this.properties.push(o);
    return this;
  }
  getComputeVariableDeclaration(offset = 0) {
    let o;
    let result = "";
    let k = 0;
    for (let i = 0; i < this.properties.length; i++) {
      o = this.properties[i];
      if (o.type.createDeclaration) {
        if (o.type instanceof VertexBuffer) {
          o.type.name = o.name;
          result += o.type.createDeclaration(offset + k++, 0, !o.isOutput);
        } else {
          result += o.type.createDeclaration(offset + k++);
          if (o.type.createStruct)
            result += o.type.createStruct().struct;
        }
      }
    }
    return result;
  }
  getFunctionParams() {
    let result = "";
    let o;
    for (let i = 0; i < this.properties.length; i++) {
      o = this.properties[i];
      result += o.builtin + " " + o.name + ":" + o.type;
      if (i != this.properties.length - 1)
        result += ", ";
      if (i != this.properties.length - 1)
        result += " ";
    }
    return result;
  }
  getComputeFunctionParams() {
    let result = "";
    let o;
    let k = 0;
    for (let i = 0; i < this.properties.length; i++) {
      o = this.properties[i];
      if (!o.type.createDeclaration) {
        if (k++ !== 0)
          result += ", ";
        result += o.builtin + " " + o.name + ":" + o.type;
      }
    }
    return result;
  }
  getInputFromOutput() {
    if (this.name != "Output")
      return null;
    return new ShaderStruct("Input", this.properties.slice(1));
  }
  get struct() {
    let result = "struct " + this.name + " {\n";
    let o;
    for (let i = 0; i < this.properties.length; i++) {
      o = this.properties[i];
      if (this.isShaderIO) {
        if (i > 0)
          o.builtin = "@location(" + (i - 1) + ")";
        result += "   " + o.builtin + " " + o.name + ":" + o.type + ",\n";
      } else {
        if (void 0 !== o.size)
          result += "    @size(" + o.size + ") @align(16) " + o.name + ":" + o.type + ",\n";
        else
          result += "    " + o.name + ":" + o.type + ",\n";
      }
    }
    result += "}\n\n";
    return result;
  }
}
class VertexBuffer {
  constructor(attributes, descriptor) {
    __publicField(this, "bufferId");
    //the id used in renderPass.setVertexBuffer
    __publicField(this, "io", 0);
    __publicField(this, "resourceIO", null);
    __publicField(this, "mustBeTransfered", false);
    __publicField(this, "vertexArrays", []);
    __publicField(this, "attributes", {});
    __publicField(this, "gpuResource");
    __publicField(this, "descriptor");
    __publicField(this, "_nbComponent", 0);
    __publicField(this, "_datas");
    __publicField(this, "nbComponentData");
    __publicField(this, "attributeChanged", false);
    __publicField(this, "gpuBufferIOs");
    __publicField(this, "gpuBufferIO_index", 1);
    __publicField(this, "_byteCount", 0);
    __publicField(this, "pipelineType");
    __publicField(this, "arrayStride");
    __publicField(this, "layout");
    __publicField(this, "_bufferSize");
    __publicField(this, "deviceId");
    __publicField(this, "time");
    __publicField(this, "destroyed", true);
    if (!descriptor)
      descriptor = {};
    else
      descriptor = { ...descriptor };
    if (!descriptor.stepMode)
      descriptor.stepMode = "vertex";
    this.descriptor = descriptor;
    const items = attributes;
    let buffer, offset, datas;
    let attribute;
    for (let name in items) {
      buffer = items[name];
      offset = buffer.offset;
      datas = buffer.datas;
      if (!this.attributes[name]) {
        attribute = this.createArray(name, buffer.type, offset);
        if (datas)
          attribute.datas = datas;
      }
    }
    if (descriptor.datas)
      this.datas = descriptor.datas;
  }
  clone() {
    const vb = new VertexBuffer(this.attributeDescriptor, this.descriptor);
    vb.bufferId = this.bufferId;
    let datas;
    if (this.datas instanceof Float32Array)
      datas = new Float32Array(this.datas.length);
    else if (this.datas instanceof Int32Array)
      datas = new Int32Array(this.datas.length);
    else if (this.datas instanceof Uint32Array)
      datas = new Uint32Array(this.datas.length);
    datas.set(this.datas);
    vb.datas = datas;
    return vb;
  }
  initBufferIO(buffers) {
    this.gpuBufferIOs = buffers;
  }
  get buffer() {
    if (this.gpuBufferIOs) {
      const buf = this.gpuBufferIOs[this.gpuBufferIO_index++ % 2];
      return buf;
    }
    return this.gpuResource;
  }
  getCurrentBuffer() {
    if (this.gpuBufferIOs)
      return this.gpuBufferIOs[(this.gpuBufferIO_index + 1) % 2];
    if (!this.gpuResource)
      this.createGpuResource();
    return this.gpuResource;
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
    if (!this.datas)
      return 0;
    if (this.nbComponentData)
      return this.datas.length / this.nbComponentData;
    return this.datas.length / this._nbComponent;
  }
  get datas() {
    return this._datas;
  }
  set datas(f) {
    this._datas = f;
    this.mustBeTransfered = true;
  }
  setComplexDatas(datas, nbComponentTotal) {
    this._nbComponent = nbComponentTotal;
    this.datas = datas;
  }
  get attributeDescriptor() {
    const result = {};
    let o;
    for (let name in this.attributes) {
      o = this.attributes[name];
      result[name] = {
        type: o.format,
        offset: o.dataOffset
      };
    }
    return result;
  }
  createArray(name, dataType, offset) {
    if (this.attributes[name] && this.attributes[name].vertexBuffer) {
      return this.attributes[name];
    }
    let v = this.attributes[name];
    if (!v)
      v = this.attributes[name] = new VertexAttribute(name, dataType, offset);
    v.vertexBuffer = this;
    const nbCompo = v.nbComponent;
    const _offset = v.dataOffset === void 0 ? 0 : v.dataOffset;
    this._nbComponent += nbCompo;
    if (v.dataOffset === void 0)
      this._byteCount += nbCompo * new GPUType(v.varType).byteValue;
    else
      this._byteCount = Math.max(this._byteCount, (_offset + v.nbComponent) * new GPUType(v.varType).byteValue);
    this.vertexArrays.push(v);
    return v;
  }
  getAttributeByName(name) {
    return this.attributes[name];
  }
  //----------------------------- USED WITH COMPUTE PIPELINE ----------------------------------------
  createDeclaration(vertexBufferName, bindingId, groupId = 0, isInput = true) {
    this.stackAttributes();
    let structName = vertexBufferName.substring(0, 1).toUpperCase() + vertexBufferName.slice(1);
    const varName = vertexBufferName.substring(0, 1).toLowerCase() + vertexBufferName.slice(1);
    let result = "";
    let type = "storage, read";
    let structType = "array<" + structName + ">";
    if (this.io === 1 || this.io === 0) {
      result += "struct " + structName + "{\n";
      let a;
      for (let i = 0; i < this.vertexArrays.length; i++) {
        a = this.vertexArrays[i];
        result += "   " + a.name + ":" + a.varType + ",\n";
      }
      result += "}\n\n";
      structType = "array<" + structName + ">";
    } else {
      type = "storage, read_write";
      structName = structName.slice(0, structName.length - 4);
      structType = "array<" + structName + ">";
    }
    result += "@binding(" + bindingId + ") @group(" + groupId + ") var<" + type + "> " + varName + ":" + structType + ";\n";
    return result;
  }
  createBindGroupLayoutEntry(bindingId) {
    return {
      binding: bindingId,
      visibility: GPUShaderStage.COMPUTE,
      buffer: {
        type: this.descriptor.accessMode === "read" ? "read-only-storage" : "storage"
      }
    };
  }
  createBindGroupEntry(bindingId) {
    if (!this.gpuResource)
      this.createGpuResource();
    let size = 0;
    if (this.datas)
      size = this.datas.byteLength;
    return {
      binding: bindingId,
      resource: {
        buffer: this.gpuResource,
        offset: 0,
        size
      }
    };
  }
  setPipelineType(pipelineType) {
    if (this.pipelineType)
      return;
    this.pipelineType = pipelineType;
    if (pipelineType === "render") {
      if (!this.descriptor.accessMode)
        this.descriptor.accessMode = "read";
      if (!this.descriptor.usage)
        this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;
    } else if (pipelineType === "compute_mixed") {
      if (this.io === 1 || this.io === 0) {
        if (!this.descriptor.usage)
          this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC;
        if (!this.descriptor.accessMode)
          this.descriptor.accessMode = "read";
      } else if (this.io === 2) {
        if (!this.descriptor.usage)
          this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC;
        if (!this.descriptor.accessMode)
          this.descriptor.accessMode = "read_write";
      }
    } else if (pipelineType === "compute") {
      if (this.io === 1 || this.io == 0) {
        if (!this.descriptor.usage)
          this.descriptor.usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC;
        if (!this.descriptor.accessMode)
          this.descriptor.accessMode = "read";
      } else if (this.io === 2) {
        if (!this.descriptor.usage)
          this.descriptor.usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC;
        if (!this.descriptor.accessMode)
          this.descriptor.accessMode = "read_write";
      }
    }
  }
  //------------------------------------------------------------------------------------------------------
  createStruct(name) {
    const structName = name.substring(0, 1).toUpperCase() + name.slice(1);
    const properties = [];
    let a;
    for (let i = 0; i < this.vertexArrays.length; i++) {
      a = this.vertexArrays[i];
      properties[i] = { name: a.name, type: a.varType, builtin: "" };
    }
    return new ShaderStruct(structName, properties);
  }
  stackAttributes(builtinOffset = 0) {
    const result = [];
    let bound = 1;
    var floats = [];
    var vec2s = [];
    var vec3s = [];
    let v;
    let offset = 0;
    for (let i = 0; i < this.vertexArrays.length; i++) {
      v = this.vertexArrays[i];
      if (v.nbComponent === 1)
        floats.push(v);
      else if (v.nbComponent === 2) {
        if (bound < 2)
          bound = 2;
        vec2s.push(v);
      } else if (v.nbComponent === 3) {
        bound = 4;
        vec3s.push(v);
      } else if (v.nbComponent === 4) {
        bound = 4;
        v.dataOffset = offset;
        offset += 4;
        result.push(v);
      }
    }
    const addVec3 = () => {
      v = vec3s.shift();
      v.dataOffset = offset;
      offset += 3;
      result.push(v);
      if (floats.length) {
        const f = floats.shift();
        f.dataOffset = offset;
        result.push(f);
      }
      offset++;
    };
    let nb = vec3s.length;
    for (let i = 0; i < nb; i++)
      addVec3();
    nb = vec2s.length;
    for (let i = 0; i < nb; i++) {
      v = vec2s.shift();
      v.dataOffset = offset;
      offset += 2;
      result.push(v);
    }
    nb = floats.length;
    for (let i = 0; i < nb; i++) {
      v = floats.shift();
      v.dataOffset = offset;
      offset++;
      result.push(v);
    }
    if (offset % bound !== 0) {
      offset += bound - offset % bound;
    }
    this.vertexArrays = result;
    const attributes = [];
    for (let i = 0; i < result.length; i++) {
      attributes[i] = {
        shaderLocation: builtinOffset + i,
        offset: result[i].dataOffset * Float32Array.BYTES_PER_ELEMENT,
        format: this.vertexArrays[i].format
      };
    }
    this.arrayStride = offset;
    return {
      stepMode: this.descriptor.stepMode,
      arrayStride: Float32Array.BYTES_PER_ELEMENT * this.arrayStride,
      attributes
    };
  }
  addVertexInstance(instanceId, o) {
    const start = instanceId * this.arrayStride;
    const datas = this._datas;
    let attribute;
    for (let z in o) {
      attribute = this.getAttributeByName(z);
      if (attribute) {
        datas[start + attribute.dataOffset] = o[z];
      }
    }
  }
  createVertexBufferLayout(builtinOffset = 0) {
    if (this.gpuBufferIOs) {
      return this.stackAttributes(builtinOffset);
    }
    let nb = this._nbComponent;
    if (this.nbComponentData)
      nb = this.nbComponentData;
    const obj = {
      stepMode: this.descriptor.stepMode,
      arrayStride: Float32Array.BYTES_PER_ELEMENT * nb,
      attributes: []
    };
    let componentId = 0;
    let offset;
    for (let i = 0; i < this.vertexArrays.length; i++) {
      offset = componentId;
      if (this.vertexArrays[i].dataOffset !== void 0)
        offset = componentId = this.vertexArrays[i].dataOffset;
      obj.attributes[i] = {
        shaderLocation: builtinOffset + i,
        offset: offset * Float32Array.BYTES_PER_ELEMENT,
        format: this.vertexArrays[i].format
      };
      componentId += this.vertexArrays[i].nbComponent;
    }
    obj.arrayStride = Math.max(this._byteCount, nb * Float32Array.BYTES_PER_ELEMENT);
    this.layout = obj;
    return obj;
  }
  get bufferSize() {
    return this._bufferSize;
  }
  createGpuResource() {
    if (this.attributeChanged)
      this.updateAttributes();
    if (!this.datas || this.gpuBufferIOs)
      return;
    if (this.gpuResource)
      this.gpuResource.destroy();
    this.deviceId = XGPU.deviceId;
    this._bufferSize = this.datas.byteLength;
    this.gpuResource = XGPU.device.createBuffer({
      size: this.datas.byteLength,
      usage: this.descriptor.usage,
      mappedAtCreation: false
    });
    this.destroyed = false;
    this.mustBeTransfered = true;
  }
  destroyGpuResource() {
    if (this.destroyed)
      return;
    if (this.time && (/* @__PURE__ */ new Date()).getTime() - this.time < 100 && XGPU.loseDeviceRecently) {
      return;
    }
    this.time = (/* @__PURE__ */ new Date()).getTime();
    if (this.io && XGPU.loseDeviceRecently) {
      if (this.io === 1) {
        const vbio = this.resourceIO;
        const vbs = vbio.buffers;
        this.setPipelineType(this.pipelineType);
        const currentDatas = vbio.currentDatas ? vbio.currentDatas : vbs[0]._datas;
        if (vbs[0]._datas instanceof Float32Array)
          vbs[0]._datas = vbs[1]._datas = new Float32Array(currentDatas);
        else if (vbs[0]._datas instanceof Int32Array)
          vbs[0]._datas = vbs[1]._datas = new Int32Array(currentDatas);
        else if (vbs[0]._datas instanceof Uint32Array)
          vbs[0]._datas = vbs[1]._datas = new Uint32Array(currentDatas);
        let temp = vbs[0].gpuBufferIOs;
        vbs[0].gpuBufferIOs = null;
        vbs[0].createGpuResource();
        vbs[0].gpuBufferIOs = temp;
        temp = vbs[1].gpuBufferIOs;
        vbs[1].gpuBufferIOs = null;
        vbs[1].createGpuResource();
        vbs[1].gpuBufferIOs = temp;
        vbs[0].gpuBufferIOs[0] = vbs[0].gpuResource;
        vbs[0].gpuBufferIOs[1] = vbs[1].gpuResource;
      }
      return;
    }
    if (this.resourceIO) {
      this.resourceIO.destroy();
      this.resourceIO = null;
    }
    if (this.gpuResource) {
      this.gpuResource.destroy();
      this.gpuResource = null;
    }
    this.destroyed = true;
  }
  updateBuffer() {
    if (!this.datas)
      return;
    if (!this.gpuResource)
      this.createGpuResource();
    if (this.datas.byteLength != this._bufferSize)
      this.createGpuResource();
    XGPU.device.queue.writeBuffer(this.gpuResource, 0, this.datas.buffer);
  }
  getVertexArrayById(id) {
    return this.vertexArrays[id];
  }
  updateAttributes() {
    let attribute;
    attribute = this.vertexArrays[0];
    const nbAttributes = this.vertexArrays.length;
    let offset = 0;
    if (this.vertexArrays[0] && this.vertexArrays[0].useByVertexData) {
      const nbVertex = attribute.datas.length;
      if (!this._datas)
        this._datas = new Float32Array(nbVertex * this.nbComponent);
      for (let i = 0; i < nbVertex; i++) {
        for (let j = 0; j < nbAttributes; j++) {
          attribute = this.vertexArrays[j];
          if (attribute.mustBeTransfered) {
            this._datas.set(attribute.datas[i], offset);
          }
          offset += attribute.nbComponent;
        }
      }
    } else {
      const nbVertex = attribute.datas.length / attribute.nbComponent;
      if (!this._datas)
        this._datas = new Float32Array(nbVertex * this.nbComponent);
      for (let j = 0; j < nbAttributes; j++) {
        attribute = this.vertexArrays[j];
        if (attribute.mustBeTransfered) {
          this._datas.set(attribute.datas, offset);
        }
        offset += attribute.nbComponent;
      }
    }
    for (let j = 0; j < nbAttributes; j++)
      this.vertexArrays[j].mustBeTransfered = false;
    this.attributeChanged = false;
    this.mustBeTransfered = true;
  }
  update() {
    if (this.vertexArrays.length === 0)
      return false;
    if (this.attributeChanged)
      this.updateAttributes();
    if (this.mustBeTransfered) {
      this.mustBeTransfered = false;
      this.updateBuffer();
    }
    return true;
  }
}
class VertexBufferIO {
  constructor(attributes, descriptor) {
    __publicField(this, "buffers", []);
    __publicField(this, "descriptor");
    __publicField(this, "onOutputData");
    __publicField(this, "stagingBuffer");
    __publicField(this, "canCallMapAsync", true);
    __publicField(this, "deviceId");
    __publicField(this, "currentDatas");
    __publicField(this, "view");
    __publicField(this, "attributeDesc");
    if (!descriptor)
      descriptor = {};
    else
      descriptor = { ...descriptor };
    this.descriptor = descriptor;
    if (!descriptor.stepMode)
      descriptor.stepMode = "instance";
    this.deviceId = XGPU.deviceId;
    this.buffers[0] = new VertexBuffer(attributes, descriptor);
    this.buffers[1] = new VertexBuffer(attributes, descriptor);
    this.buffers[0].io = 1;
    this.buffers[1].io = 2;
    this.buffers[0].resourceIO = this;
    this.buffers[1].resourceIO = this;
  }
  get input() {
    return this.buffers[0];
  }
  get output() {
    return this.buffers[1];
  }
  destroy() {
    if (this.stagingBuffer)
      this.stagingBuffer.destroy();
    this.buffers[0].destroyGpuResource();
    this.buffers[1].destroyGpuResource();
    this.buffers = void 0;
    this.onOutputData = void 0;
  }
  rebuildAfterDeviceLost() {
    if (this.deviceId != XGPU.deviceId) {
      this.deviceId = XGPU.deviceId;
      this.canCallMapAsync = true;
      this.stagingBuffer = null;
      this.currentDatas = this.buffers[0].datas;
    }
  }
  async getOutputData() {
    this.rebuildAfterDeviceLost();
    const buffer = this.buffers[0].buffer;
    if (!this.onOutputData)
      return null;
    if (!this.canCallMapAsync)
      return;
    this.canCallMapAsync = false;
    if (!this.stagingBuffer)
      this.stagingBuffer = XGPU.createStagingBuffer(this.bufferSize);
    const copyEncoder = XGPU.device.createCommandEncoder();
    const stage = this.stagingBuffer;
    copyEncoder.copyBufferToBuffer(buffer, 0, stage, 0, stage.size);
    XGPU.device.queue.submit([copyEncoder.finish()]);
    await this.stagingBuffer.mapAsync(GPUMapMode.READ, 0, stage.size);
    this.canCallMapAsync = true;
    const copyArray = stage.getMappedRange(0, stage.size);
    const data = copyArray.slice(0);
    stage.unmap();
    this.currentDatas = data;
    this.onOutputData(data);
  }
  clone() {
    return new VertexBufferIO(this.buffers[0].attributeDescriptor, this.descriptor);
  }
  createDeclaration(name, bindingId, groupId) {
    const structName = name.substring(0, 1).toUpperCase() + name.slice(1);
    const varName = name.substring(0, 1).toLowerCase() + name.slice(1);
    let result = "";
    result += "struct " + structName + "{\n";
    let a;
    for (let i = 0; i < this.buffers[0].vertexArrays.length; i++) {
      a = this.buffers[0].vertexArrays[i];
      result += "   " + a.name + ":" + a.varType + ",\n";
    }
    result += "}\n\n";
    result += "@binding(" + bindingId + ") @group(" + groupId + ") var<storage, read> " + varName + ":array<" + structName + ">;\n";
    result += "@binding(" + (bindingId + 1) + ") @group(" + groupId + ") var<storage, read_write> " + varName + "_out:array<" + structName + ">;\n";
    return result + "\n";
  }
  createVertexInstances(nbInstance, createInstance) {
    if (void 0 == this.buffers[0].arrayStride) {
      this.buffers[0].stackAttributes();
    }
    const attributes = this.buffers[0].attributes;
    const arrayStride = this.buffers[0].arrayStride;
    const datas = new Float32Array(arrayStride * nbInstance);
    let o;
    let start;
    let attribute;
    for (let i = 0; i < nbInstance; i++) {
      start = arrayStride * i;
      o = createInstance(i);
      for (let z in o) {
        attribute = attributes[z];
        if (attribute) {
          datas.set(o[z], start + attribute.dataOffset);
        }
      }
    }
    this.datas = datas;
  }
  getVertexInstances(datas, onGetInstance) {
    const arrayStride = this.buffers[0].arrayStride ? this.buffers[0].arrayStride : this.buffers[1].arrayStride;
    const attributes = this.buffers[0].attributes;
    if (!this.view) {
      this.view = {};
      for (let z in attributes) {
        const a = attributes[z];
        let val;
        if (a.nbComponent === 1)
          val = { x: 0, ___offset: a.dataOffset };
        else if (a.nbComponent === 2)
          val = { x: 0, y: 0, ___offset: a.dataOffset };
        else if (a.nbComponent === 3)
          val = { x: 0, y: 0, z: 0, ___offset: a.dataOffset };
        else if (a.nbComponent === 4)
          val = { x: 0, y: 0, z: 0, w: 0, ___offset: a.dataOffset };
        this.view[z] = val;
      }
    }
    const view = this.view;
    const nb = this.buffers[0].datas.length / arrayStride;
    let start, s, nbCompo;
    let v;
    for (let i = 0; i < nb; i++) {
      start = i * arrayStride;
      for (let z in attributes) {
        nbCompo = attributes[z].nbComponent;
        s = start + attributes[z].dataOffset;
        v = view[z];
        v.x = datas[s];
        if (nbCompo >= 2) {
          v.y = datas[s + 1];
          if (nbCompo >= 3) {
            v.z = datas[s + 2];
            if (nbCompo == 4)
              v.w = datas[s + 3];
          }
        }
      }
      onGetInstance(view);
    }
  }
  set datas(v) {
    this.buffers[0].datas = v;
    this.buffers[1].datas = v;
  }
  get attributeDescriptor() {
    if (!this.attributeDesc)
      this.attributeDesc = this.buffers[0].attributeDescriptor;
    return this.attributeDesc;
  }
  update() {
    this.rebuildAfterDeviceLost();
    this.buffers[0].update();
    this.buffers[1].update();
  }
  get bufferSize() {
    return this.buffers[0].buffer.size;
  }
  get nbVertex() {
    return this.buffers[0].nbVertex;
  }
}
class VideoTexture {
  constructor(descriptor) {
    __publicField(this, "mustBeTransfered", true);
    __publicField(this, "descriptor");
    __publicField(this, "useWebcodec", false);
    //still in beta 
    __publicField(this, "gpuResource");
    /*
    bindgroups: an array of bindgroup that contains the VideoTexture 
    => I need it to call its "build" function onVideoFrameCallback
    => a videoTexture can be contained in multiple bindgroups, that's why it's an array
    */
    __publicField(this, "bindgroups", []);
    __publicField(this, "deviceId");
    __publicField(this, "videoFrame");
    if (void 0 === descriptor.format)
      descriptor.format = "rgba8unorm";
    if (void 0 === descriptor.usage)
      descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;
    if (void 0 === descriptor.mipLevelCount)
      descriptor.mipLevelCount = 1;
    if (void 0 === descriptor.sampleCount)
      descriptor.sampleCount = 1;
    if (void 0 === descriptor.dimension)
      descriptor.dimension = "2d";
    if (void 0 === descriptor.viewFormats)
      descriptor.viewFormats = [];
    this.descriptor = descriptor;
    if (descriptor.source)
      this.source = descriptor.source;
  }
  addBindgroup(bindgroup) {
    if (this.bindgroups.indexOf(bindgroup) === -1) {
      this.bindgroups.push(bindgroup);
    }
  }
  clone() {
    return new VideoTexture(this.descriptor);
  }
  set source(video) {
    this.gpuResource = video;
    this.descriptor.source = video;
    this.descriptor.size = [video.width, video.height];
    let nbError = 0;
    const frame = () => {
      if (!this.gpuResource)
        return;
      if (XGPU.device && this.deviceId === XGPU.deviceId) {
        this.bindgroups.forEach((b) => b.build());
        nbError = 0;
      } else {
        nbError++;
      }
      if (nbError < 30) {
        video.requestVideoFrameCallback(frame);
      } else {
        video.src = void 0;
      }
    };
    video.requestVideoFrameCallback(frame);
  }
  createDeclaration(varName, bindingId, groupId = 0) {
    return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_external;\n";
  }
  createBindGroupLayoutEntry(bindingId) {
    return {
      binding: bindingId,
      visibility: GPUShaderStage.FRAGMENT,
      externalTexture: {}
    };
  }
  createGpuResource() {
  }
  update() {
    this.deviceId = XGPU.deviceId;
  }
  destroyGpuResource() {
    if (this.videoFrame) {
      this.videoFrame.close();
      this.videoFrame = null;
    }
  }
  createBindGroupEntry(bindingId) {
    if (this.useWebcodec) {
      if (this.videoFrame)
        this.videoFrame.close();
      this.videoFrame = new window["VideoFrame"](this.gpuResource);
    }
    if (!this.gpuResource)
      throw new Error("gpuResource cannot be null. You must provide a HTMLVideoElement");
    return {
      binding: bindingId,
      resource: XGPU.device.importExternalTexture({
        source: this.useWebcodec ? this.videoFrame : this.gpuResource
      })
    };
  }
  setPipelineType(pipelineType) {
  }
}
const _HighLevelParser = class {
  constructor() {
    __publicField(this, "targetIsBindgroup");
    __publicField(this, "parseDebugValues", (descriptor) => {
      let o;
      let indexs = [];
      let objectById = [];
      let objectByName = {};
      let nb = 0;
      for (let name in descriptor) {
        o = descriptor[name];
        if (o && o.__debug == true) {
          if (typeof o === "function") {
            o = { name, id: nb, ...o() };
          } else {
            o.id = nb;
            o.name = name;
          }
          descriptor[name] = void 0;
          indexs[nb] = new Vec4(o.vertexId, o.instanceId, 0, 0);
          objectByName[name] = o;
          objectById[nb] = o;
          nb++;
        }
      }
      return {
        nb,
        indexs,
        objectByName,
        objectById
      };
    });
    __publicField(this, "parseVertexShaderDebug", (descriptor) => {
      if (typeof descriptor.vertexShader === "string") {
        descriptor.vertexShader = { main: descriptor.vertexShader };
      }
      const clearDebug = (shader2) => {
        let lines = shader2.split("\n");
        let line;
        let result = "";
        for (let i = 0; i < lines.length; i++) {
          line = lines[i];
          if (line.includes("debug."))
            continue;
          result += line + "\n";
        }
        return result;
      };
      const shader = descriptor.vertexShader.main;
      descriptor.vertexShader.main = clearDebug(shader);
      const debugByName = descriptor.__DEBUG__.objectByName;
      const removeEmptySpaceAtStart = (line) => {
        let abc = "abcdefghijklmnopqrstuvwxyz/";
        abc += abc.toUpperCase();
        let char;
        for (let i = 0; i < line.length; i++) {
          char = line[i];
          if (abc.includes(char)) {
            return line.slice(i);
          }
        }
        return line;
      };
      const extractDebugName = (line) => {
        let abc = "abcdefghijklmnopqrstuvwxyz0123456789_";
        abc += abc.toUpperCase();
        let char;
        let name = "";
        for (let i = 0; i < line.length; i++) {
          char = line[i];
          if (abc.includes(char)) {
            name += char;
            continue;
          }
          if (char === " ")
            continue;
          if (char != "=") {
            throw new Error(`VERTEX SHADER ERROR on this line :"debug.${line} ". The keyword "debug" must only be used to store data. It can't be used in computations.`);
          }
          return name;
        }
        return name;
      };
      const analyseAndRewriteDebug = (shader2) => {
        let lines = shader2.split("\n");
        let line;
        let result = ";";
        let names = [];
        let nbUsedByName = {};
        let newName;
        let objById = [];
        let count = 0;
        for (let i = 0; i < lines.length; i++) {
          line = removeEmptySpaceAtStart(lines[i]);
          if (line.slice(0, 2) == "//")
            continue;
          if (line.includes("debug.")) {
            if (line.slice(0, "debug.".length) === "debug.") {
              if (line.split("=").length == 2) {
                const dName = extractDebugName(line.slice("debug.".length));
                const o = debugByName[dName];
                if (!debugByName[dName]) {
                  throw new Error(`VERTEX SHADER ERROR on this line :" ${line} ". The value "debug.${dName}" is used in the vertexShader but not defined in RenderPipeline.initFromObject `);
                }
                if (names.includes(dName) === false)
                  names.push(dName);
                if (isNaN(nbUsedByName[dName])) {
                  nbUsedByName[dName] = 0;
                } else
                  nbUsedByName[dName]++;
                newName = dName + "__" + nbUsedByName[dName];
                o.newName = newName;
                debugByName[newName] = objById[count++] = { ...o };
                line = line.replace("debug." + dName, "debug." + newName);
              } else {
                throw new Error(`VERTEX SHADER ERROR on this line :" ${line} ".`);
              }
            } else {
              throw new Error(`VERTEX SHADER ERROR on this line :" ${line} ". The keyword "debug" must only be used to store data. It can't be used in computations.`);
            }
          }
          result += line + "\n";
        }
        descriptor.__DEBUG__.objectById = objById;
        for (let i = 0; i < names.length; i++) {
          debugByName[names[i]] = void 0;
          delete debugByName[names[i]];
        }
        return result;
      };
      const clearComments = (shader2) => {
        let lines = shader2.split("\n");
        for (let i = 0; i < lines.length; i++)
          lines[i] = lines[i].split("//")[0];
        return lines.join("\n");
      };
      descriptor.vertexShader.debugVersion = analyseAndRewriteDebug(clearComments(shader));
      const simplifyComplexData = () => {
        const objById = descriptor.__DEBUG__.objectById;
        const objByName = descriptor.__DEBUG__.objectByName;
        let o, name, newName, n;
        let result = [];
        for (let i = 0; i < objById.length; i++) {
          o = { ...objById[i] };
          if (o.type == "mat4x4<f32>") {
            name = o.newName;
            newName = name + "_m4";
            o.isMatrix = true;
            o.realType = o.type;
            o.type = "vec4<f32>";
            objByName[name] = void 0;
            delete objByName[name];
            n = newName + "0";
            objByName[n] = { ...o, newName: n };
            result.push(objByName[n]);
            n = newName + "1";
            objByName[n] = { ...o, newName: n };
            result.push(objByName[n]);
            n = newName + "2";
            objByName[n] = { ...o, newName: n };
            result.push(objByName[n]);
            n = newName + "3";
            objByName[n] = { ...o, newName: n };
            result.push(objByName[n]);
          } else if (o.type == "mat3x3<f32>") {
            name = o.newName;
            newName = name + "_m3";
            o.isMatrix = true;
            o.realType = o.type;
            o.type = "vec3<f32>";
            objByName[name] = void 0;
            delete objByName[name];
            n = newName + "0";
            objByName[n] = { ...o, newName: n };
            result.push(objByName[n]);
            n = newName + "1";
            objByName[n] = { ...o, newName: n };
            result.push(objByName[n]);
            n = newName + "2";
            objByName[n] = { ...o, newName: n };
            result.push(objByName[n]);
            n = newName + "3";
            objByName[n] = { ...o, newName: n };
            result.push(objByName[n]);
          } else if (o.isArray) {
            const arrayOfMatrix = o.type.includes("mat");
            const len = o.len;
            name = o.newName;
            newName = name + "_ar";
            o.isMatrix = false;
            o.realType = o.type;
            o.type = "vec4<f32>";
            if (o.realType.includes("i32"))
              o.type = "vec4<i32>";
            else if (o.realType.includes("u32"))
              o.type = "vec4<u32>";
            objByName[name] = void 0;
            delete objByName[name];
            if (arrayOfMatrix) {
              objByName[name] = void 0;
              delete objByName[name];
              for (let j = 0; j < len; j++) {
                n = newName + j + "_m0";
                objByName[n] = { ...o, newName: n };
                result.push(objByName[n]);
                n = newName + j + "_m1";
                objByName[n] = { ...o, newName: n };
                result.push(objByName[n]);
                n = newName + j + "_m2";
                objByName[n] = { ...o, newName: n };
                result.push(objByName[n]);
                n = newName + j + "_m3";
                objByName[n] = { ...o, newName: n };
                result.push(objByName[n]);
              }
            } else {
              for (let i2 = 0; i2 < len; i2++) {
                n = newName + i2;
                objByName[n] = { ...o, newName: n };
                result.push(objByName[n]);
              }
            }
          } else {
            result.push(o);
          }
        }
        descriptor.__DEBUG__.objectById = result;
      };
      simplifyComplexData();
      return descriptor;
    });
  }
  parseShaderBuiltins(descriptor) {
    const addComputeInput = (name, val) => {
      if (typeof descriptor.computeShader === "string") {
        const main = descriptor.computeShader;
        descriptor.computeShader = {
          main
        };
      }
      if (!descriptor.computeShader.inputs)
        descriptor.computeShader.inputs = {};
      descriptor.computeShader.inputs[name] = val;
    };
    const checkComputeInputBuiltIns = (name, o2) => {
      for (let z in BuiltIns.computeInputs) {
        if (o2 === BuiltIns.computeInputs[z]) {
          addComputeInput(name, o2);
        }
      }
    };
    const addComputeOutput = (name, val) => {
      if (typeof descriptor.computeShader === "string") {
        const main = descriptor.computeShader;
        descriptor.computeShader = {
          main
        };
      }
      if (!descriptor.computeShader.outputs)
        descriptor.computeShader.outputs = {};
      descriptor.computeShader.outputs[name] = val;
    };
    const checkComputeOutputBuiltIns = (name, o2) => {
      for (let z in BuiltIns.computeOutputs) {
        if (o2 === BuiltIns.computeOutputs[z]) {
          addComputeOutput(name, o2);
        }
      }
    };
    const addVertexInput = (name, val) => {
      if (typeof descriptor.vertexShader === "string") {
        const main = descriptor.vertexShader;
        descriptor.vertexShader = {
          main
        };
      }
      if (!descriptor.vertexShader.inputs)
        descriptor.vertexShader.inputs = {};
      descriptor.vertexShader.inputs[name] = val;
    };
    const checkVertexInputBuiltIns = (name, o2) => {
      for (let z in BuiltIns.vertexInputs) {
        if (o2 === BuiltIns.vertexInputs[z]) {
          addVertexInput(name, o2);
        }
      }
    };
    const addVertexOutput = (name, val) => {
      if (typeof descriptor.vertexShader === "string") {
        const main = descriptor.vertexShader;
        descriptor.vertexShader = {
          main
        };
      }
      if (!descriptor.vertexShader.outputs)
        descriptor.vertexShader.outputs = {};
      descriptor.vertexShader.outputs[name] = val;
    };
    const checkVertexOutputBuiltIns = (name, o2) => {
      for (let z in BuiltIns.vertexOutputs) {
        if (o2 === BuiltIns.vertexOutputs[z]) {
          addVertexOutput(name, o2);
        }
      }
    };
    const addFragmentInput = (name, val) => {
      if (typeof descriptor.fragmentShader === "string") {
        const main = descriptor.fragmentShader;
        descriptor.fragmentShader = {
          main
        };
      }
      if (!descriptor.fragmentShader.inputs)
        descriptor.fragmentShader.inputs = {};
      descriptor.fragmentShader.inputs[name] = val;
    };
    const checkFragmentInputBuiltIns = (name, o2) => {
      for (let z in BuiltIns.fragmentInputs) {
        if (o2 === BuiltIns.vertexInputs[z]) {
          addFragmentInput(name, o2);
        }
      }
    };
    const addFragmentOutput = (name, val) => {
      if (typeof descriptor.fragmentShader === "string") {
        const main = descriptor.fragmentShader;
        descriptor.fragmentShader = {
          main
        };
      }
      if (!descriptor.fragmentShader.outputs)
        descriptor.fragmentShader.outputs = {};
      descriptor.fragmentShader.outputs[name] = val;
    };
    const checkFragmentOutputBuiltIns = (name, o2) => {
      for (let z in BuiltIns.fragmentOutputs) {
        if (o2 === BuiltIns.fragmentOutputs[z]) {
          addFragmentOutput(name, o2);
        }
      }
    };
    let o;
    for (let z in descriptor) {
      o = descriptor[z];
      if (o) {
        checkVertexInputBuiltIns(z, o);
        checkVertexOutputBuiltIns(z, o);
        checkFragmentInputBuiltIns(z, o);
        checkFragmentOutputBuiltIns(z, o);
        checkComputeInputBuiltIns(z, o);
        checkComputeOutputBuiltIns(z, o);
      }
    }
    return descriptor;
  }
  parseVertexBufferIOs(descriptor) {
    if (this.targetIsBindgroup)
      return descriptor;
    const addVertexBufferIO = (name, o2) => {
      if (!descriptor.bindgroups)
        descriptor.bindgroups = {};
      if (!descriptor.bindgroups.io)
        descriptor.bindgroups.io = {};
      descriptor.bindgroups.io[name] = o2;
      return o2;
    };
    const checkVertexBufferIO = (name, o2) => {
      if (o2 instanceof VertexBufferIO) {
        addVertexBufferIO(name, o2);
      }
    };
    let o;
    for (let z in descriptor) {
      o = descriptor[z];
      if (o)
        checkVertexBufferIO(z, o);
    }
    return descriptor;
  }
  parseImageTextureIOs(descriptor) {
    if (this.targetIsBindgroup)
      return descriptor;
    const addTextureIO = (name, o2) => {
      if (!descriptor.bindgroups)
        descriptor.bindgroups = {};
      if (!descriptor.bindgroups.io)
        descriptor.bindgroups.io = {};
      descriptor.bindgroups.io[name] = o2;
      return o2;
    };
    const checkTextureIO = (name, o2) => {
      if (o2 instanceof ImageTextureIO) {
        addTextureIO(name, o2);
      }
    };
    let o;
    for (let z in descriptor) {
      o = descriptor[z];
      if (o)
        checkTextureIO(z, o);
    }
    return descriptor;
  }
  parseVertexBuffers(descriptor) {
    if (this.targetIsBindgroup)
      return descriptor;
    const addVertexBuffer = (name, o2) => {
      if (!descriptor.bindgroups)
        descriptor.bindgroups = {};
      if (!descriptor.bindgroups.default)
        descriptor.bindgroups.default = {};
      descriptor.bindgroups.default[name] = o2;
      return o2;
    };
    const checkVertexBuffer = (name, o2) => {
      if (o2 instanceof VertexBuffer) {
        addVertexBuffer(name, o2);
      }
    };
    let o;
    for (let z in descriptor) {
      o = descriptor[z];
      if (o)
        checkVertexBuffer(z, o);
    }
    return descriptor;
  }
  parseVertexAttributes(descriptor) {
    const addVertexAttribute = (name, o2) => {
      let bindgroup = descriptor;
      if (!this.targetIsBindgroup) {
        if (!descriptor.bindgroups)
          descriptor.bindgroups = {};
        if (!descriptor.bindgroups.default)
          descriptor.bindgroups.default = {};
        bindgroup = descriptor.bindgroups.default;
      }
      if (!bindgroup.buffer) {
        const attributes = {};
        attributes[name] = o2;
        bindgroup.buffer = new VertexBuffer(attributes);
      } else {
        const attribute = bindgroup.buffer.createArray(name, o2.type, o2.offset);
        if (o2.datas)
          attribute.datas = o2.datas;
      }
    };
    const checkVertexAttribute = (name, o2) => {
      if (o2.type && VertexAttribute.types[o2.type]) {
        addVertexAttribute(name, o2);
      } else if (o2 instanceof VertexAttribute) {
        addVertexAttribute(name, {
          type: o2.format,
          offset: o2.dataOffset,
          datas: o2.datas
        });
      }
    };
    let o;
    for (let z in descriptor) {
      o = descriptor[z];
      if (o)
        checkVertexAttribute(z, o);
    }
    return descriptor;
  }
  parseUniformBuffers(descriptor) {
    if (this.targetIsBindgroup)
      return descriptor;
    const addUniformBuffer = (name, o2) => {
      if (!descriptor.bindgroups)
        descriptor.bindgroups = {};
      if (!descriptor.bindgroups.default)
        descriptor.bindgroups.default = {};
      descriptor.bindgroups.default[name] = o2;
      return o2;
    };
    const checkUniformBuffer = (name, o2) => {
      if (o2 instanceof UniformBuffer) {
        addUniformBuffer(name, o2);
      }
    };
    let o;
    for (let z in descriptor) {
      o = descriptor[z];
      if (o)
        checkUniformBuffer(z, o);
    }
    return descriptor;
  }
  parseUniform(descriptor) {
    const addUniform = (name, o2) => {
      if (!descriptor.bindgroups)
        descriptor.bindgroups = {};
      if (!descriptor.bindgroups.default)
        descriptor.bindgroups.default = {};
      let bindgroup = descriptor.bindgroups.default;
      let uniformBufferName = "uniforms";
      if (this.targetIsBindgroup) {
        bindgroup = descriptor;
        uniformBufferName = descriptor.uniformBufferName ? descriptor.uniformBufferName : "bindgroupUniforms";
      }
      if (!bindgroup[uniformBufferName]) {
        const uniforms = {};
        uniforms[name] = o2;
        bindgroup[uniformBufferName] = new UniformBuffer(uniforms, { useLocalVariable: true });
      } else {
        bindgroup[uniformBufferName].add(name, o2);
      }
    };
    const checkUniform = (name, o2) => {
      if (o2 instanceof PrimitiveFloatUniform || o2 instanceof PrimitiveIntUniform || o2 instanceof PrimitiveUintUniform || o2 instanceof UniformGroup || o2 instanceof UniformGroupArray) {
        addUniform(name, o2);
      }
    };
    let o;
    for (let z in descriptor) {
      o = descriptor[z];
      if (o)
        checkUniform(z, o);
    }
    return descriptor;
  }
  parseImageTextureArray(descriptor) {
    if (this.targetIsBindgroup)
      return descriptor;
    const addImageTextureArray = (name, o2) => {
      if (!descriptor.bindgroups)
        descriptor.bindgroups = {};
      if (!descriptor.bindgroups.default)
        descriptor.bindgroups.default = {};
      descriptor.bindgroups.default[name] = o2;
    };
    const checkImageTextureArray = (name, o2) => {
      if (o2 instanceof ImageTextureArray) {
        addImageTextureArray(name, o2);
      }
    };
    let o;
    for (let z in descriptor) {
      o = descriptor[z];
      if (o)
        checkImageTextureArray(z, o);
    }
    return descriptor;
  }
  parseImageTexture(descriptor) {
    if (this.targetIsBindgroup)
      return descriptor;
    const addImageTexture = (name, o2) => {
      if (!descriptor.bindgroups)
        descriptor.bindgroups = {};
      if (!descriptor.bindgroups.default)
        descriptor.bindgroups.default = {};
      descriptor.bindgroups.default[name] = o2;
    };
    const checkImageTexture = (name, o2) => {
      if (o2 instanceof ImageTexture) {
        addImageTexture(name, o2);
      }
    };
    let o;
    for (let z in descriptor) {
      o = descriptor[z];
      if (o)
        checkImageTexture(z, o);
    }
    return descriptor;
  }
  parseTextureSampler(descriptor) {
    if (this.targetIsBindgroup)
      return descriptor;
    const addTextureSampler = (name, o2) => {
      if (!descriptor.bindgroups)
        descriptor.bindgroups = {};
      if (!descriptor.bindgroups.default)
        descriptor.bindgroups.default = {};
      descriptor.bindgroups.default[name] = o2;
    };
    const checkTextureSampler = (name, o2) => {
      if (o2 instanceof TextureSampler) {
        addTextureSampler(name, o2);
      }
    };
    let o;
    for (let z in descriptor) {
      o = descriptor[z];
      if (o)
        checkTextureSampler(z, o);
    }
    return descriptor;
  }
  parseVideoTexture(descriptor) {
    if (this.targetIsBindgroup)
      return descriptor;
    const addVideoTexture = (name, o2) => {
      if (!descriptor.bindgroups)
        descriptor.bindgroups = {};
      if (!descriptor.bindgroups.default)
        descriptor.bindgroups.default = {};
      descriptor.bindgroups.default[name] = o2;
    };
    const checkVideoTexture = (name, o2) => {
      if (o2 instanceof VideoTexture) {
        addVideoTexture(name, o2);
      }
    };
    let o;
    for (let z in descriptor) {
      o = descriptor[z];
      if (o)
        checkVideoTexture(z, o);
    }
    return descriptor;
  }
  parseCubeMapTexture(descriptor) {
    if (this.targetIsBindgroup)
      return descriptor;
    const addCubeMapTexture = (name, o2) => {
      if (!descriptor.bindgroups)
        descriptor.bindgroups = {};
      if (!descriptor.bindgroups.default)
        descriptor.bindgroups.default = {};
      descriptor.bindgroups.default[name] = o2;
    };
    const checkCubeMapTexture = (name, o2) => {
      if (o2 instanceof CubeMapTexture) {
        addCubeMapTexture(name, o2);
      }
    };
    let o;
    for (let z in descriptor) {
      o = descriptor[z];
      if (o)
        checkCubeMapTexture(z, o);
    }
    return descriptor;
  }
  parseDrawConfig(descriptor, drawConfig) {
    if (descriptor.vertexCount) {
      if (isNaN(descriptor.vertexCount))
        throw new Error("descriptor.vertexCount is a reserved keyword and must be a number");
      drawConfig.vertexCount = descriptor.vertexCount;
    }
    if (descriptor.instanceCount) {
      if (isNaN(descriptor.instanceCount))
        throw new Error("descriptor.instanceCount is a reserved keyword and must be a number");
      drawConfig.instanceCount = descriptor.instanceCount;
    }
    if (descriptor.firstVertexId) {
      if (isNaN(descriptor.firstVertexId))
        throw new Error("descriptor.firstVertexId is a reserved keyword and must be a number");
      drawConfig.firstVertexId = descriptor.firstVertexId;
    }
    if (descriptor.firstInstanceId) {
      if (isNaN(descriptor.firstInstanceId))
        throw new Error("descriptor.firstInstanceId is a reserved keyword and must be a number");
      drawConfig.firstInstanceId = descriptor.firstInstanceId;
    }
    return descriptor;
  }
  parseBindgroup(descriptor) {
    for (let z in descriptor) {
      if (descriptor[z] instanceof Bindgroup) {
        if (!descriptor.bindgroups)
          descriptor.bindgroups = {};
        descriptor.bindgroups[z] = descriptor[z];
        delete descriptor[z];
      }
    }
    return descriptor;
  }
  firstPass(descriptor, target, drawConfig) {
    descriptor = this.parseBindgroup(descriptor);
    descriptor = this.parseVertexBuffers(descriptor);
    descriptor = this.parseVertexAttributes(descriptor);
    descriptor = this.parseUniformBuffers(descriptor);
    descriptor = this.parseUniform(descriptor);
    descriptor = this.parseImageTexture(descriptor);
    descriptor = this.parseImageTextureArray(descriptor);
    descriptor = this.parseTextureSampler(descriptor);
    descriptor = this.parseVideoTexture(descriptor);
    descriptor = this.parseCubeMapTexture(descriptor);
    descriptor = this.parseVertexBufferIOs(descriptor);
    descriptor = this.parseImageTextureIOs(descriptor);
    if (target === "render" || target === "compute") {
      descriptor = this.parseShaderBuiltins(descriptor);
      if (target === "render") {
        descriptor = this.parseDrawConfig(descriptor, drawConfig);
      }
    }
    return descriptor;
  }
  //--------
  parseHighLevelObj(descriptor) {
    const isBuiltIn = (obj) => {
      for (let z in BuiltIns.vertexInputs)
        if (BuiltIns.vertexInputs[z] === obj)
          return true;
      for (let z in BuiltIns.vertexOutputs)
        if (BuiltIns.vertexOutputs[z] === obj)
          return true;
      for (let z in BuiltIns.fragmentInputs)
        if (BuiltIns.fragmentInputs[z] === obj)
          return true;
      for (let z in BuiltIns.fragmentOutputs)
        if (BuiltIns.fragmentOutputs[z] === obj)
          return true;
      for (let z in BuiltIns.computeInputs)
        if (BuiltIns.computeInputs[z] === obj)
          return true;
      return false;
    };
    const searchComplexObject = (o) => {
      let name;
      let obj;
      let objs = [];
      for (let z in o) {
        obj = o[z];
        if (!obj)
          continue;
        name = obj.constructor.name;
        if (name === "Object") {
          if (z !== "bindgroups" && z !== "vertexShader" && z !== "fragmentShader" && z !== "computeShader") {
            if (!isBuiltIn(obj)) {
              objs.push({ name, resource: obj });
            }
          }
        }
      }
      return objs;
    };
    const analyseObjects = (objs) => {
      const primitives = [];
      const vertexAttributes = [];
      const shaderResources = [];
      let o;
      let resource;
      let containerName;
      for (let i = 0; i < objs.length; i++) {
        containerName = objs[i].name;
        o = objs[i].resource;
        for (let name in o) {
          resource = o[name];
          if (resource instanceof PrimitiveFloatUniform || resource instanceof PrimitiveIntUniform || resource instanceof PrimitiveUintUniform) {
            primitives.push({ containerName, name, resource });
          } else if (resource instanceof VertexAttribute) {
            vertexAttributes.push({ containerName, name, resource });
          } else {
            shaderResources.push({ containerName, name, resource });
          }
        }
      }
      return { primitives, vertexAttributes, shaderResources };
    };
    let objects = searchComplexObject(descriptor);
    if (objects.length) {
      if (!descriptor.bindgroups)
        descriptor.bindgroups = {};
      if (!descriptor.bindgroups.default)
        descriptor.bindgroups.default = {};
      analyseObjects(objects);
    }
    return descriptor;
  }
  //---
  findAndFixRepetitionInDataStructure(o) {
    let name;
    let obj;
    let exist = {};
    let bindgroup;
    let resource;
    let bool;
    for (let z in o.bindgroups) {
      bindgroup = o.bindgroups[z];
      for (let a in bindgroup) {
        resource = bindgroup[a];
        if (resource instanceof UniformBuffer) {
          bool = true;
          for (let i = resource.itemNames.length - 1; i >= 0; i--) {
            name = resource.itemNames[i];
            obj = resource.items[name];
            if (!exist[name]) {
              exist[name] = obj;
            } else {
              resource.remove(name);
              if (resource.itemNames.length === 0) {
                bool = false;
              }
            }
          }
          if (bool)
            ;
          else {
            bindgroup[a] = void 0;
          }
        }
        resource = bindgroup[a];
      }
    }
    return o;
  }
  parseBindgroupEntries(descriptor) {
    const uniformBufferName = descriptor.uniformBufferName ? descriptor.uniformBufferName : "bindgroupUniforms";
    const addUniform = (name, resource2) => {
      if (!descriptor[uniformBufferName]) {
        const uniforms = {};
        uniforms[name] = resource2;
        descriptor[uniformBufferName] = new UniformBuffer(uniforms, { useLocalVariable: true });
      } else {
        descriptor[uniformBufferName].add(name, resource2);
      }
    };
    const vertexBufferName = descriptor.vertexBufferName ? descriptor.vertexBufferName : "bindgroupVertexBuffer";
    const addVertexAttribute = (name, resource2) => {
      if (!descriptor[vertexBufferName]) {
        const attributes = {};
        attributes[name] = resource2;
        descriptor[vertexBufferName] = new VertexBuffer(attributes);
      } else {
        const attribute = descriptor[vertexBufferName].createArray(name, resource2.type, resource2.dataOffset);
        if (resource2.datas)
          attribute.datas = resource2.datas;
      }
    };
    let resource;
    for (let z in descriptor) {
      resource = descriptor[z];
      if (!resource)
        continue;
      if (resource instanceof PrimitiveFloatUniform || resource instanceof PrimitiveIntUniform || resource instanceof PrimitiveUintUniform) {
        addUniform(z, resource);
      } else if (VertexAttribute.types[resource.type]) {
        addVertexAttribute(z, resource);
      }
    }
    return descriptor;
  }
  parse(descriptor, target, drawConfig) {
    this.targetIsBindgroup = target === "bindgroup";
    if (target === "bindgroup") {
      descriptor = this.parseBindgroupEntries(descriptor);
    } else {
      const debug = this.parseDebugValues(descriptor);
      descriptor = this.firstPass(descriptor, target, drawConfig);
      descriptor = this.parseHighLevelObj(descriptor);
      descriptor = this.findAndFixRepetitionInDataStructure(descriptor);
      if (debug.nb != 0) {
        descriptor.__DEBUG__ = debug;
        descriptor = this.parseVertexShaderDebug(descriptor);
      }
    }
    return descriptor;
  }
  static parse(descriptor, target, drawConfig) {
    if (!this.instance)
      this.instance = new _HighLevelParser();
    return this.instance.parse(descriptor, target, drawConfig);
  }
};
let HighLevelParser = _HighLevelParser;
__publicField(HighLevelParser, "instance", null);
class IndexBuffer {
  constructor(descriptor) {
    __publicField(this, "gpuResource");
    __publicField(this, "descriptor");
    __publicField(this, "mustUpdateData", false);
    __publicField(this, "_datas");
    if (!descriptor)
      descriptor = { nbPoint: 3 };
    if (void 0 === descriptor.dataType) {
      if (descriptor.datas) {
        if (descriptor.datas instanceof Uint16Array)
          descriptor.dataType = "uint16";
        else
          descriptor.dataType = "uint32";
      } else {
        descriptor.dataType = "uint16";
      }
    }
    if (void 0 === descriptor.offset)
      descriptor.offset = 0;
    this.descriptor = descriptor;
    if (descriptor.nbPoint)
      this.nbPoint = descriptor.nbPoint;
    if (void 0 === descriptor.datas)
      descriptor.datas = new Uint32Array([0, 0, 0]);
    else
      this.datas = descriptor.datas;
  }
  destroyGpuResource() {
    if (this.gpuResource)
      this.gpuResource.destroy();
    this.gpuResource = null;
  }
  createGpuResource() {
    if (!this._datas)
      console.warn("create index resource ", this.getBufferSize());
    if (this.gpuResource)
      this.gpuResource.destroy();
    this.gpuResource = XGPU.device.createBuffer({
      size: this.getBufferSize(),
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: false
    });
    this.gpuResource.dataType = this.dataType;
    this.gpuResource.nbPoint = this.nbPoint;
    if (this._datas) {
      this.mustUpdateData = true;
      this.update();
    }
  }
  getBufferSize() {
    if (this.dataType === "uint16")
      return this.datas.length * Uint16Array.BYTES_PER_ELEMENT;
    return this.datas.length * Uint32Array.BYTES_PER_ELEMENT;
  }
  get dataType() {
    return this.descriptor.dataType;
  }
  get nbPoint() {
    return this.descriptor.nbPoint;
  }
  set nbPoint(n) {
    this.descriptor.nbPoint = n;
  }
  get offset() {
    return this.descriptor.offset;
  }
  set offset(n) {
    this.descriptor.offset = n;
  }
  set datas(indices) {
    this.mustUpdateData = true;
    if (indices instanceof Uint16Array)
      this.descriptor.dataType = "uint16";
    else
      this.descriptor.dataType = "uint32";
    if (!this._datas || indices.length > this._datas.length || indices != this._datas) {
      this._datas = indices;
      this.createGpuResource();
    }
    this.update();
  }
  updateDatas(indices, offset, len, extraBufferSize) {
    this.mustUpdateData = true;
    if (!extraBufferSize)
      extraBufferSize = 1e3;
    if (!this._datas || this._datas.length < offset + len) {
      if (indices instanceof Uint16Array)
        this.descriptor.dataType = "uint16";
      else
        this.descriptor.dataType = "uint32";
      if (!this._datas) {
        this._datas = indices;
        this.createGpuResource();
      } else if (offset + len - this._datas.length >= extraBufferSize) {
        this._datas = indices;
        this.createGpuResource();
      } else {
        if (indices instanceof Uint16Array)
          this._datas = new Uint16Array(this._datas.length + extraBufferSize);
        else
          this._datas = new Uint32Array(this._datas.length + extraBufferSize);
        this._datas.set(indices);
        this.createGpuResource();
      }
    } else {
      if (offset && len)
        this._datas.set(indices.slice(offset, offset + len), offset);
      else
        this._datas.set(indices);
    }
    this.update();
  }
  get datas() {
    return this._datas;
  }
  update() {
    if (this.mustUpdateData) {
      this.mustUpdateData = false;
      XGPU.device.queue.writeBuffer(this.gpuResource, 0, this._datas.buffer);
    }
  }
  apply(renderPass, drawConfig) {
    if (!this.gpuResource)
      this.createGpuResource();
    renderPass.setIndexBuffer(this.gpuResource, this.dataType, this.offset, this.getBufferSize());
    renderPass.drawIndexed(this.nbPoint, drawConfig.instanceCount, drawConfig.firstVertexId, drawConfig.baseVertex, drawConfig.firstInstanceId);
  }
}
class Bindgroup {
  constructor(descriptor) {
    __publicField(this, "bindgroupId");
    //the id used in renderPass.setBindgroup
    __publicField(this, "parent");
    __publicField(this, "entries", []);
    __publicField(this, "elements", []);
    __publicField(this, "mustRefreshBindgroup", false);
    __publicField(this, "applyDraw", false);
    __publicField(this, "_layout");
    __publicField(this, "_group");
    __publicField(this, "name", "");
    __publicField(this, "_pingPongBindgroup", null);
    //used in ComputePipeline and VertexBufferIO
    __publicField(this, "vertexBufferIO");
    __publicField(this, "textureIO");
    __publicField(this, "resourcesIOs", []);
    __publicField(this, "deviceId", 0);
    __publicField(this, "setupApplyCompleted", false);
    __publicField(this, "indexBuffer");
    __publicField(this, "vertexBuffers");
    __publicField(this, "vertexBufferReferenceByName");
    __publicField(this, "elementByName", {});
    __publicField(this, "setupDrawCompleted", false);
    __publicField(this, "instances");
    __publicField(this, "instanceResourcesArray");
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
    __publicField(this, "renderPipelineimageIO");
    __publicField(this, "renderPipelineBufferIO");
    __publicField(this, "ioGroups");
    __publicField(this, "io_index", 0);
    __publicField(this, "debug");
    if (descriptor)
      this.initFromObject(descriptor);
  }
  add(name, resource) {
    if (resource instanceof VideoTexture)
      this.mustRefreshBindgroup = true;
    else if (resource instanceof ImageTexture && (resource.source instanceof GPUTexture || !resource.source)) {
      this.mustRefreshBindgroup = true;
    }
    if (resource instanceof IndexBuffer) {
      this.indexBuffer = resource;
      this.elementByName[name] = resource;
      return resource;
    }
    if (resource instanceof VertexBufferIO) {
      this.resourcesIOs.push(resource);
      this.mustRefreshBindgroup = true;
      this.vertexBufferIO = resource;
      this.elements.push({ name, resource: resource.buffers[0] });
      this.elements.push({ name: name + "_out", resource: resource.buffers[1] });
      if (this.parent)
        this.parent.add(this);
      return resource;
    }
    if (resource instanceof ImageTextureIO) {
      this.resourcesIOs.push(resource);
      this.mustRefreshBindgroup = true;
      this.textureIO = resource;
      this.elements.push({ name, resource: resource.textures[0] });
      this.elements.push({ name: name + "_out", resource: resource.textures[1] });
      if (this.parent)
        this.parent.add(this);
      return resource;
    }
    if (resource instanceof VideoTexture) {
      resource.addBindgroup(this);
    }
    this.elements.push({ name, resource });
    if (this.parent)
      this.parent.add(this);
    return resource;
  }
  set(name, resource) {
    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i].name === name) {
        this.elements[i].resource = resource;
      }
    }
  }
  remove(name) {
    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i].name === name) {
        this.elements.splice(i, 1);
      }
    }
  }
  getResourceName(resource) {
    for (let i = 0; i < this.elements.length; i++) {
      if (resource === this.elements[i].resource) {
        return this.elements[i].name;
      }
    }
    return null;
  }
  get(name) {
    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i].name === name)
        return this.elements[i].resource;
    }
    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i].resource instanceof UniformBuffer) {
        if (this.elements[i].resource.items[name]) {
          return this.elements[i].resource;
        }
      }
    }
    return null;
  }
  initFromObject(descriptor) {
    let object = descriptor;
    let isArray = false;
    if (descriptor instanceof Array) {
      isArray = true;
      object = descriptor[0];
    }
    HighLevelParser.parse(object, "bindgroup");
    const result = [];
    let k = 0;
    let o;
    for (let z in object) {
      o = object[z];
      if (!o)
        continue;
      if (o.createGpuResource || o instanceof VertexBufferIO || o instanceof ImageTextureIO) {
        result[k++] = this.add(z, o);
      }
    }
    if (isArray) {
      for (let i = 0; i < descriptor.length; i++) {
        this.createInstance(descriptor[i]);
      }
    }
    return result;
  }
  //---------------------------------------------------------------------------
  clearAfterDeviceLost() {
    this._layout = null;
    this._group = null;
    this.setupApplyCompleted = false;
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].resource.destroyGpuResource();
    }
    if (this.instances) {
      let elements, resource;
      let instance;
      for (let i = 0; i < this.instances.length; i++) {
        instance = this.instances[i];
        instance.group = void 0;
        elements = instance.elements;
        if (instance.indexBuffer)
          instance.indexBuffer.createGpuResource();
        for (let j = 0; j < elements.length; j++) {
          resource = elements[j].resource;
          if (resource.gpuResource) {
            resource.destroyGpuResource();
          }
        }
      }
    }
  }
  buildLayout() {
    this.deviceId = XGPU.deviceId;
    this.io_index = 0;
    const layout = { entries: [] };
    let bindingId = 0;
    let resource;
    for (let i = 0; i < this.elements.length; i++) {
      resource = this.elements[i].resource;
      if (resource instanceof VertexBuffer && !resource.io && this.parent.pipeline.type != "compute")
        continue;
      let bgl = resource.createBindGroupLayoutEntry(bindingId++);
      layout.entries.push(bgl);
    }
    this._layout = XGPU.device.createBindGroupLayout(layout);
  }
  build() {
    if (!this._layout || this.deviceId != XGPU.deviceId && this.ioGroups)
      this.buildLayout();
    this.deviceId = XGPU.deviceId;
    let entries = [];
    let bindingId = 0;
    let resource;
    for (let i = 0; i < this.elements.length; i++) {
      if (!this.elements[i])
        continue;
      resource = this.elements[i].resource;
      resource.update();
      if (resource instanceof VertexBuffer && !resource.io && this.parent.pipeline.type != "compute")
        continue;
      let entry = resource.createBindGroupEntry(bindingId++);
      entries.push(entry);
    }
    this._group = XGPU.device.createBindGroup({ layout: this._layout, entries });
    if (!this.setupApplyCompleted && this.parent) {
      this.setupApplyCompleted = true;
      this.setupApply();
      if (this.instanceResourcesArray) {
        for (let i = 0; i < this.instanceResourcesArray.length; i++) {
          this._createInstance(this.instanceResourcesArray[i]);
        }
        this.instanceResourcesArray = void 0;
      }
    }
    return this._group;
  }
  setupApply() {
    this.bindgroupId = this.parent.groups.indexOf(this);
    const types = this.parent.resources.types;
    if (!types)
      return;
    const allVertexBuffers = types.vertexBuffers;
    if (!allVertexBuffers)
      return;
    const getBufferId = (o) => {
      if (!this.instances) {
        for (let i = 0; i < allVertexBuffers.length; i++) {
          if (allVertexBuffers[i].resource === o)
            return i;
        }
      } else {
        for (let i = 0; i < allVertexBuffers.length; i++) {
          if (allVertexBuffers[i].resource.nane === o.name)
            return i;
        }
      }
      return -1;
    };
    this.vertexBuffers = [];
    this.vertexBufferReferenceByName = {};
    let k = 0;
    let element;
    let resource;
    for (let i = 0; i < this.elements.length; i++) {
      element = this.elements[i];
      resource = element.resource;
      if (resource instanceof VertexBuffer) {
        if (!resource.io) {
          resource.bufferId = getBufferId(resource);
          this.elementByName[element.name] = resource;
          this.vertexBufferReferenceByName[element.name] = { bufferId: resource.bufferId, resource };
          this.vertexBuffers[k++] = resource;
          continue;
        }
      } else {
        this.elementByName[element.name] = resource;
      }
    }
  }
  setupDraw(force = false) {
    if (this.vertexBuffers) {
      for (let i = 0; i < this.vertexBuffers.length; i++) {
        if (!this.vertexBuffers[i].gpuResource) {
          this.vertexBuffers[i].createGpuResource();
        }
      }
    }
    if (this.parent.drawConfig) {
      this.indexBuffer = this.parent.drawConfig.indexBuffer;
      if (force || !this.indexBuffer && this.parent.drawConfig.vertexCount <= 0) {
        if (!force && !this.parent.resources.types.vertexBuffers) {
          throw new Error("a renderPipeline require a vertexBuffer or a drawConfig object in order to draw. You must add a vertexBuffer or call RenderPipeline.setupDraw");
        }
        const buffers = this.parent.resources.types.vertexBuffers;
        let buf;
        for (let i = 0; i < buffers.length; i++) {
          buf = buffers[i].resource;
          if (buf.descriptor.stepMode === "vertex") {
            this.parent.drawConfig.vertexCount = this.parent.resources.types.vertexBuffers[i].resource.nbVertex;
            break;
          }
        }
      }
    }
  }
  apply(renderPass) {
    if (!this.setupDrawCompleted) {
      this.setupDrawCompleted = true;
      if (void 0 === this.bindgroupId) {
        this.bindgroupId = this.parent.groups.indexOf(this);
      }
      this.setupDraw();
    }
    if (renderPass instanceof GPUComputePassEncoder) {
      this.update(this.parent.pipeline);
      renderPass.setBindGroup(this.bindgroupId, this.group);
      return;
    }
    const instances = this.instances ? this.instances : [{ group: this.group, update: () => {
    } }];
    const applyDraw = this.applyDraw;
    for (let i = 0; i < instances.length; i++) {
      instances[i].update();
      this.update(this.parent.pipeline);
      renderPass.setBindGroup(this.bindgroupId, instances[i].group);
      if (this.vertexBuffers) {
        let buf;
        for (let j = 0; j < this.vertexBuffers.length; j++) {
          buf = this.vertexBuffers[j].getCurrentBuffer();
          renderPass.setVertexBuffer(this.vertexBuffers[j].bufferId, buf);
        }
      }
      if (applyDraw) {
        this.parent.drawConfig.draw(renderPass);
      }
    }
  }
  get useInstances() {
    return !!this.instances || !!this.instanceResourcesArray;
  }
  createInstance(instanceResources) {
    if (!this.instanceResourcesArray)
      this.instanceResourcesArray = [];
    this.instanceResourcesArray.push(instanceResources);
  }
  _createInstance(resourcePerInstance) {
    resourcePerInstance = HighLevelParser.parse(resourcePerInstance, "bindgroup");
    if (!this.instances)
      this.instances = [];
    let indexBuffer;
    let vertexBuffers = [];
    let result = {
      elements: this.elements.concat()
    };
    let element, resource;
    for (let i = 0; i < this.elements.length; i++) {
      element = this.elements[i];
      for (let z in resourcePerInstance) {
        resource = resourcePerInstance[z];
        if (resource instanceof IndexBuffer) {
          indexBuffer = resourcePerInstance[z];
          continue;
        }
        if (element.name === z) {
          if (resource instanceof VideoTexture || resource instanceof ImageTexture)
            ;
          else {
            resource.descriptor = element.resource.descriptor;
          }
          if (!resource.gpuResource) {
            resource.createGpuResource();
          }
          if (element.resource instanceof VertexBuffer) {
            resource.bufferId = element.resource.bufferId;
            if (vertexBuffers.indexOf(resource) === -1) {
              vertexBuffers.push(resource);
            }
          }
          result.elements[i] = { name: z, resource };
        }
      }
    }
    if (indexBuffer)
      result.indexBuffer = indexBuffer;
    result.update = () => {
      let bool = false;
      for (let i = 0; i < this.elements.length; i++) {
        if (this.elements[i].resource.mustBeTransfered) {
          this.elements[i].resource.update(this.parent.pipeline);
          bool = true;
          break;
        }
      }
      this.elements = result.elements;
      this.vertexBuffers = vertexBuffers;
      if (bool || !result.group) {
        result.group = this.build();
      }
      if (result.indexBuffer)
        this.parent.drawConfig.indexBuffer = result.indexBuffer;
    };
    resourcePerInstance._object = result;
    this.instances.push(result);
  }
  handleComputePipelineResourceIOs() {
    if (this.resourcesIOs.length) {
      let buf0 = [];
      let buf1 = [];
      for (let i = 0; i < this.resourcesIOs.length; i++) {
        if (this.resourcesIOs[i] instanceof VertexBufferIO) {
          buf0[i] = this.resourcesIOs[i].buffers[0];
          buf1[i] = this.resourcesIOs[i].buffers[1];
        } else {
          buf0[i] = this.resourcesIOs[i].textures[0];
          buf1[i] = this.resourcesIOs[i].textures[1];
        }
        buf0[i].createGpuResource();
        buf1[i].createGpuResource();
      }
      this.createPingPongBindgroup(buf0, buf1);
    }
  }
  swapElements() {
    let result = this.elements.concat();
    let temp;
    for (let i = 0; i < this.elements.length; i += 2) {
      temp = result[i];
      result[i] = result[i + 1];
      result[i + 1] = temp;
    }
    return result;
  }
  createPingPongBindgroup(resource1, resource2) {
    const group = new Bindgroup();
    group.name = this.name;
    group.mustRefreshBindgroup = this.mustRefreshBindgroup = true;
    group._layout = this.layout;
    group.elements = this.swapElements();
    let res1, res2;
    for (let i = 0; i < resource1.length; i++) {
      res1 = resource1[i];
      res2 = resource2[i];
      if (res1 instanceof VertexBuffer) {
        const buffers = [res1.buffer, res2.buffer];
        buffers[0].debug = 1;
        buffers[1].debug = 2;
        res1.initBufferIO(buffers);
      } else if (res1 instanceof ImageTexture) {
        if (!res1.gpuResource)
          res1.createGpuResource();
        if (!res2.gpuResource)
          res2.createGpuResource();
        const textures = [res1.gpuResource, res2.gpuResource];
        try {
          textures[0].debug = 1;
          textures[1].debug = 2;
        } catch (e) {
        }
        res1.initTextureIO(textures);
      }
    }
    this.ioGroups = [group, this];
    this.debug = 1;
    group.debug = 2;
    return group;
  }
  handleRenderPipelineResourceIOs() {
    if (this.renderPipelineimageIO) {
      this.renderPipelineimageIO.initIO();
      return;
    } else if (this.renderPipelineBufferIO) {
      this.renderPipelineBufferIO.initIO();
      return;
    }
    let resource;
    let name;
    let bufferIOs = [];
    let textureIOs = [];
    let parentResources = this.parent.resources;
    let foundVertexIO = false;
    let foundTextureIO = false;
    for (let i = 0; i < this.elements.length; i++) {
      resource = this.elements[i].resource;
      if (resource instanceof VertexBuffer) {
        if (resource.io === 1) {
          name = this.elements[i].name;
          parentResources[name] = void 0;
          parentResources[name + "_out"] = void 0;
          bufferIOs.push(resource);
          bufferIOs.push(this.elements[i + 1].resource);
          this.elements.splice(i, 2);
          foundVertexIO = true;
          break;
        }
      } else if (resource instanceof ImageTexture) {
        if (resource.io === 1) {
          name = this.elements[i].name;
          parentResources[name] = void 0;
          parentResources[name + "_out"] = void 0;
          textureIOs.push(resource);
          textureIOs.push(this.elements[i + 1].resource);
          this.elements.splice(i, 2);
          foundTextureIO = true;
          break;
        }
      }
    }
    if (foundVertexIO) {
      const attributes = bufferIOs[0].attributeDescriptor;
      const stepMode = bufferIOs[0].descriptor.stepMode;
      const vb = new VertexBuffer(attributes, { stepMode });
      this.elements.push({ name, resource: vb });
      let vertexBuffers = parentResources.types.vertexBuffers;
      let buffers = [];
      for (let i = 0; i < vertexBuffers.length; i++) {
        if (!vertexBuffers[i].resource.io) {
          buffers.push(vertexBuffers[i]);
        }
      }
      buffers.push({ name, resource: vb });
      parentResources[name] = vb;
      parentResources.types.vertexBuffers = buffers;
      vb.initIO = () => {
        vb.initBufferIO([bufferIOs[0].buffer, bufferIOs[1].buffer]);
      };
      vb.initIO();
      this.renderPipelineBufferIO = vb;
    } else if (foundTextureIO) {
      const img = new ImageTexture({ source: textureIOs[0].gpuResource });
      this.elements.push({ name, resource: img });
      let images = parentResources.types.imageTextures;
      let textures = [];
      for (let i = 0; i < images.length; i++) {
        if (!images[i].resource.io) {
          textures.push(images[i]);
        }
      }
      textures.push({ name, resource: img });
      parentResources[name] = img;
      parentResources.types.imageTextures = images;
      img.initIO = () => {
        img.source = textureIOs[0].texture;
        img.initTextureIO([textureIOs[0].texture, textureIOs[1].texture]);
      };
      img.initIO();
      this.renderPipelineimageIO = img;
    }
  }
  get pingPongBindgroup() {
    return this._pingPongBindgroup;
  }
  get layout() {
    if (!this._layout)
      this.buildLayout();
    return this._layout;
  }
  get group() {
    if (!this._group || this.mustRefreshBindgroup) {
      this.build();
    }
    if (this.ioGroups) {
      const group = this.ioGroups[this.io_index++ % 2];
      if (!group._group)
        group.build();
      return group._group;
    }
    return this._group;
  }
  update(pipeline) {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].resource.update(pipeline);
    }
  }
  destroy() {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].resource.destroyGpuResource();
    }
    this.elements = [];
  }
}
class ShaderNode {
  constructor(code = "", insideMainFunction = false) {
    __publicField(this, "enabled", true);
    __publicField(this, "executeSubNodeAfterCode", true);
    __publicField(this, "_text");
    __publicField(this, "insideMainFunction");
    __publicField(this, "subNodes");
    this.text = code;
    this.insideMainFunction = insideMainFunction;
  }
  get text() {
    return this._text;
  }
  set text(s) {
    const lines = s.split("\n");
    let line;
    let nbTabMin = 99999999;
    if (lines.length > 1) {
      for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        for (let j = 0; j < line.length; j++) {
          if (line[j] === "\n")
            continue;
          if (line[j] !== " ") {
            if (nbTabMin > j)
              nbTabMin = j;
            break;
          }
        }
      }
      if (this.insideMainFunction && nbTabMin >= 3)
        nbTabMin -= 3;
      for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].slice(nbTabMin);
      }
      s = lines.join("\n");
    }
    this._text = s;
  }
  replaceValues(values) {
    for (let i = 0; i < values.length; i++) {
      this.replaceKeyWord(values[i].old, values[i].new);
    }
  }
  replaceKeyWord(wordToReplace, replacement) {
    const regex = new RegExp(`(?<=[^\\w.])\\b${wordToReplace}\\b`, "g");
    this._text = this._text.replace(regex, replacement);
  }
  get value() {
    let result = "";
    if (this.executeSubNodeAfterCode) {
      result += this.text + "\n";
    }
    if (this.subNodes) {
      for (let i = 0; i < this.subNodes.length; i++) {
        result += this.subNodes[i].value + "\n";
      }
    }
    if (!this.executeSubNodeAfterCode)
      result += this.text + "\n";
    return result;
  }
  createNode(code = "") {
    const node = new ShaderNode(code);
    if (!this.subNodes)
      this.subNodes = [];
    this.subNodes.push(node);
    return node;
  }
}
class ShaderStage {
  constructor(shaderType) {
    __publicField(this, "inputs", []);
    __publicField(this, "outputs", []);
    __publicField(this, "export", []);
    __publicField(this, "require", []);
    __publicField(this, "pipelineConstants", {});
    __publicField(this, "constants");
    __publicField(this, "main");
    __publicField(this, "shaderType");
    __publicField(this, "debugLogs", []);
    __publicField(this, "debugRenders", []);
    __publicField(this, "_shaderInfos");
    this.shaderType = shaderType;
    this.constants = new ShaderNode();
    this.main = new ShaderNode("", true);
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
  unwrapVariableInMainFunction(shaderVariables) {
    const variables = shaderVariables.split("\n");
    let s;
    let objs = [];
    for (let i = 0; i < variables.length; i++) {
      variables[i] = s = variables[i].split("	").join("").trim().slice(4);
      if (!s.length)
        continue;
      let t = s.split(" = ");
      let varName = t[0].split(":")[0];
      let otherName = t[1].slice(0, t[1].length - 1);
      objs.push({
        varName,
        otherName
      });
    }
    const searchAndReplace = (shaderCode, wordToReplace, replacement) => {
      const regex = new RegExp(`(?<=[^\\w.])\\b${wordToReplace}\\b`, "g");
      return shaderCode.replace(regex, replacement);
    };
    let shader = this.main.value + "";
    for (let i = 0; i < objs.length; i++) {
      shader = searchAndReplace(shader, objs[i].varName, objs[i].otherName);
    }
    return shader;
  }
  addOutputVariable(name, shaderType) {
    this.outputs.push({ name, type: shaderType.type });
  }
  addInputVariable(name, shaderTypeOrBuiltIn) {
    this.outputs.push({ name, type: shaderTypeOrBuiltIn.type, builtin: shaderTypeOrBuiltIn.builtin });
  }
  formatWGSLCode(code) {
    const lines = code.replace(/\n+/g, "\n").split("\n");
    let formattedCode = "";
    let indentLevel = 0;
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("}")) {
        indentLevel--;
      }
      const indentedLine = "   ".repeat(indentLevel) + trimmedLine;
      if (trimmedLine.endsWith("{")) {
        indentLevel++;
      }
      formattedCode += indentedLine + "\n";
    }
    return formattedCode;
  }
  get shaderInfos() {
    return this._shaderInfos;
  }
  build(shaderPipeline, input) {
    if (this._shaderInfos)
      return this._shaderInfos;
    this._shaderInfos = { code: "", output: null };
    return this._shaderInfos;
  }
}
class FragmentShader extends ShaderStage {
  constructor() {
    super("fragment");
  }
  build(shaderPipeline, inputs) {
    if (this._shaderInfos)
      return this._shaderInfos;
    let result = this.constants.value + "\n\n";
    const obj = shaderPipeline.bindGroups.getVertexShaderDeclaration(true);
    result += obj.result;
    for (let i = 0; i < this.inputs.length; i++) {
      inputs.addProperty(this.inputs[i]);
    }
    if (this.outputs.length === 0) {
      this.outputs[0] = { name: "color", ...BuiltIns.fragmentOutputs.color };
    }
    const output = new ShaderStruct("Output", this.outputs);
    result += output.struct + "\n";
    const mainFunc = this.unwrapVariableInMainFunction(obj.variables);
    result += "@fragment\n";
    result += "fn main(" + inputs.getFunctionParams() + ") -> " + output.name + "{\n";
    result += "   var output:Output;\n";
    result += mainFunc;
    result += "   return output;\n";
    result += "}\n";
    result = this.formatWGSLCode(result);
    if (XGPU.showFragmentShader) {
      console.log("------------- FRAGMENT SHADER --------------");
      console.log(result);
      console.log("--------------------------------------------");
    }
    this._shaderInfos = { code: result, output };
    return this._shaderInfos;
  }
}
class VertexShader extends ShaderStage {
  //public keepRendererAspectRatio: boolean = true;
  constructor() {
    super("vertex");
  }
  build(pipeline, input) {
    let result = this.constants.value + "\n\n";
    const obj = pipeline.bindGroups.getVertexShaderDeclaration();
    result += obj.result;
    result += input.getComputeVariableDeclaration();
    let bool = false;
    for (let i = 0; i < this.outputs.length; i++) {
      if (this.outputs[i].builtin === BuiltIns.vertexOutputs.position.builtin) {
        bool = true;
      }
    }
    if (!bool) {
      this.outputs.unshift({ name: "position", ...BuiltIns.vertexOutputs.position });
    }
    let output = new ShaderStruct("Output", [...this.outputs]);
    result += output.struct + "\n";
    let mainFunc = this.unwrapVariableInMainFunction(obj.variables);
    result += "@vertex\n";
    result += "fn main(" + input.getFunctionParams() + ") -> " + output.name + "{\n";
    result += "   var output:Output;\n";
    result += mainFunc;
    result += "   return output;\n";
    result += "}\n";
    result = this.formatWGSLCode(result);
    if (XGPU.showVertexShader) {
      console.log("------------- VERTEX SHADER --------------");
      console.log(result);
      console.log("------------------------------------------");
    }
    return { code: result, output };
  }
}
class Texture extends EventDispatcher {
  constructor(descriptor) {
    super();
    __publicField(this, "descriptor");
    __publicField(this, "gpuResource", null);
    __publicField(this, "_view", null);
    __publicField(this, "deviceId");
    __publicField(this, "time");
    if (void 0 === descriptor.usage)
      descriptor.usage = GPUTextureUsage.RENDER_ATTACHMENT;
    if (void 0 === descriptor.sampleCount && descriptor.format !== "depth32float")
      descriptor.sampleCount = 1;
    if (void 0 === descriptor.label)
      descriptor.label = "Texture";
    this.descriptor = descriptor;
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
    if (!this._view)
      this.create();
    return this._view;
  }
  destroy() {
    if (this.gpuResource) {
      this.gpuResource.xgpuObject = null;
      this.gpuResource.destroy();
    }
    this.gpuResource = null;
    this._view = null;
  }
  create() {
    this.time = (/* @__PURE__ */ new Date()).getTime();
    if (XGPU.loseDeviceRecently && this.deviceId === XGPU.deviceId)
      return;
    if (this.gpuResource) {
      this.gpuResource.xgpuObject = null;
      this.gpuResource.destroy();
    }
    this.deviceId = XGPU.deviceId;
    this.gpuResource = XGPU.device.createTexture(this.descriptor);
    this.gpuResource.xgpuObject = this;
    this.createView();
  }
  createGpuResource() {
    this.create();
  }
  update() {
    if (this.deviceId !== XGPU.deviceId) {
      this.create();
    }
  }
  createView() {
    if (!this.gpuResource)
      this.create();
    this._view = this.gpuResource.createView();
  }
  resize(width, height) {
    this.descriptor.size = [width, height];
    this.create();
  }
}
class DepthStencilTexture extends Texture {
  constructor(descriptor, depthStencilDescription = null, depthStencilAttachmentOptions = null) {
    if (void 0 === descriptor.format)
      descriptor.format = "depth24plus";
    if (void 0 === descriptor.sampleCount)
      descriptor.sampleCount = 1;
    super(descriptor);
    /*
    When you apply a shadow to a renderPipeline , you actually create a ShadowPipeline that store information in the DepthStencilTexture.
    This texture is then used as IShaderResource in the renderPipeline. 
    Because it can be an IShaderResource , we must implement the IShaderResource interface
    */
    __publicField(this, "_isDepthTexture", false);
    __publicField(this, "_description");
    __publicField(this, "_attachment");
    //--------------------------------- IShaderResource ---------------------------------------------------------
    __publicField(this, "mustBeTransfered", false);
    __publicField(this, "_visibility", GPUShaderStage.FRAGMENT);
    this.createGpuResource();
    if (!depthStencilDescription) {
      depthStencilDescription = {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: this.gpuResource.format
      };
    }
    this._description = { format: this.gpuResource.format, ...depthStencilDescription };
    this._attachment = {
      view: this._view,
      depthClearValue: 1,
      depthLoadOp: "clear",
      depthStoreOp: "store"
    };
    if (descriptor.format === "depth24plus-stencil8") {
      this._attachment.stencilClearValue = 0;
      this._attachment.stencilLoadOp = "clear";
      this._attachment.stencilStoreOp = "store";
    } else if (descriptor.format === "depth32float") {
      this._isDepthTexture = true;
    }
    for (let z in depthStencilAttachmentOptions) {
      this._attachment[z] = depthStencilAttachmentOptions[z];
    }
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
  setPipelineType(pipelineType) {
    if (pipelineType === "render")
      this._visibility = GPUShaderStage.FRAGMENT;
    else if (pipelineType === "compute_mixed")
      this._visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE;
    else if (pipelineType === "compute")
      this._visibility = GPUShaderStage.COMPUTE;
  }
  createBindGroupEntry(bindingId) {
    return {
      binding: bindingId,
      resource: this._view
    };
  }
  createBindGroupLayoutEntry(bindingId) {
    return {
      binding: bindingId,
      visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX,
      texture: {
        sampleType: "depth"
      }
    };
  }
  createDeclaration(varName, bindingId, groupId) {
    return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_depth_2d;\n";
  }
  createGpuResource() {
    this.create();
  }
  destroyGpuResource() {
    if (this.gpuResource) {
      this._view = null;
      this.gpuResource.destroy();
      this.gpuResource = null;
      this.create();
    }
  }
  resize(width, height) {
    super.resize(width, height);
    this._attachment.view = this._view;
  }
  clone() {
    return new DepthStencilTexture(this.descriptor);
  }
}
class CubeMapTextureArray extends ImageTextureArray {
  constructor(descriptor) {
    descriptor = { ...descriptor };
    if (descriptor.source) {
      if (descriptor.source.length === 0 || descriptor.source.length % 6 !== 0) {
        throw new Error("CubeMapTextureArray error : descriptor.source must contains an array of (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) with a length greater than 0 and multiple of 6.");
      }
    }
    if (!descriptor.dimension)
      descriptor.dimension = "2d";
    if (void 0 === descriptor.usage)
      descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;
    super(descriptor);
    if (descriptor.source)
      this.bitmaps = descriptor.source;
  }
  clone() {
    if (!this.descriptor.source)
      this.descriptor.source = this._bitmaps;
    return new CubeMapTextureArray(this.descriptor);
  }
  set bitmaps(images) {
    if (images.length === 0 || images.length % 6 !== 0) {
      throw new Error("CubeMapTextureArray error : descriptor.source must contains an array of (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) with a length greater than 0 and multiple of 6.");
    }
    for (let i = 0; i < images.length; i++) {
      this._bitmaps[i] = images[i];
      this.mustUpdate[i] = true;
    }
    this.mustBeTransfered = true;
    this.update();
  }
  get bitmaps() {
    return this._bitmaps;
  }
  setCubeSideById(cubeid, sideId, image) {
    if (this._bitmaps[cubeid * 6 + sideId] instanceof ImageBitmap)
      this._bitmaps[cubeid * 6 + sideId].close();
    this._bitmaps[cubeid * 6 + sideId] = image;
    this.mustUpdate[cubeid * 6 + sideId] = true;
    this.mustBeTransfered = true;
  }
  createGpuResource() {
    if (this.gpuResource)
      this.gpuResource.destroy();
    this.gpuResource = XGPU.device.createTexture(this.descriptor);
    this._view = this.gpuResource.createView({ dimension: "cube-array", arrayLayerCount: this._bitmaps.length });
  }
  //-----
  createDeclaration(varName, bindingId, groupId = 0) {
    return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_cube_array<" + this.sampledType + ">;\n";
  }
  createBindGroupLayoutEntry(bindingId) {
    let sampleType = "float";
    if (this.sampledType === "i32")
      sampleType = "sint";
    else if (this.sampledType === "u32")
      sampleType = "uint";
    return {
      binding: bindingId,
      visibility: GPUShaderStage.FRAGMENT,
      texture: {
        sampleType,
        viewDimension: "cube-array",
        multisampled: false
      }
    };
  }
  createBindGroupEntry(bindingId) {
    if (!this.gpuResource)
      this.createGpuResource();
    return {
      binding: bindingId,
      resource: this._view
    };
  }
  setPipelineType(pipelineType) {
  }
}
class DepthTextureArray extends ImageTextureArray {
  constructor(descriptor, depthStencilDescription = null) {
    if (void 0 === descriptor.format)
      descriptor.format = "depth32float";
    if (void 0 === descriptor.sampleCount)
      descriptor.sampleCount = 1;
    if (descriptor.source[0] instanceof DepthStencilTexture) {
      for (let i = 0; i < descriptor.source.length; i++) {
        descriptor.source[i] = descriptor.source[i].gpuResource;
      }
    }
    if (void 0 === descriptor.usage) {
      descriptor.usage = descriptor.source[0].usage;
    }
    super(descriptor);
    __publicField(this, "_description");
    __publicField(this, "_attachment");
    __publicField(this, "_visibility", GPUShaderStage.FRAGMENT);
    if (!depthStencilDescription) {
      depthStencilDescription = {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: this.gpuResource.format
      };
    }
    this._description = { format: this.gpuResource.format, ...depthStencilDescription };
  }
  get description() {
    return this._description;
  }
  get attachment() {
    return this._attachment;
  }
  setPipelineType(pipelineType) {
    if (pipelineType === "render")
      this._visibility = GPUShaderStage.FRAGMENT;
    else if (pipelineType === "compute_mixed")
      this._visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE;
    else if (pipelineType === "compute")
      this._visibility = GPUShaderStage.COMPUTE;
  }
  createBindGroupLayoutEntry(bindingId) {
    let sampleType = "float";
    if (this.sampledType === "i32")
      sampleType = "sint";
    else if (this.sampledType === "u32")
      sampleType = "uint";
    return {
      binding: bindingId,
      visibility: this._visibility,
      texture: {
        sampleType,
        viewDimension: "2d-array",
        multisampled: false
      }
    };
  }
  get isDepthTexture() {
    return true;
  }
  createDeclaration(varName, bindingId, groupId) {
    return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_depth_2d_array;\n";
  }
}
class Bindgroups {
  constructor(pipeline, name) {
    __publicField(this, "pipeline");
    __publicField(this, "parent");
    __publicField(this, "groups", []);
    __publicField(this, "_name");
    __publicField(this, "temp");
    __publicField(this, "_resources", {});
    this._name = name;
    this.pipeline = pipeline;
  }
  get name() {
    return this._name;
  }
  clearAfterDeviceLost() {
    for (let i = 0; i < this.groups.length; i++) {
      this.groups[i].clearAfterDeviceLost();
    }
  }
  build(autoLayout = false) {
    const description = {};
    const layouts = [];
    const bindgroups = [];
    this.groups = this.groups.sort((a, b) => {
      if (a.useInstances && !b.useInstances)
        return 1;
      if (!a.useInstances && b.useInstances)
        return -1;
      return 0;
    });
    if (this.groups.length) {
      this.groups[this.groups.length - 1].applyDraw = true;
    } else {
      this.groups[0] = new Bindgroup();
      this.groups[0].parent = this;
      this.groups[0].applyDraw = true;
    }
    for (let i = 0; i < this.groups.length; i++) {
      if (!autoLayout)
        layouts[i] = this.groups[i].layout;
      bindgroups[i] = this.groups[i].group;
    }
    if (autoLayout)
      description.layout = "auto";
    else {
      description.layout = XGPU.createPipelineLayout({ bindGroupLayouts: layouts });
    }
    const { vertexLayouts, buffers, nbVertex } = this.createVertexBufferLayout();
    description.vertex = {
      buffers: vertexLayouts
    };
    return {
      description,
      bindgroups,
      buffers,
      nbVertex
    };
  }
  getBindgroupByResource(resource) {
    let group, element;
    for (let i = 0; i < this.groups.length; i++) {
      group = this.groups[i];
      for (let j = 0; j < group.elements.length; j++) {
        element = group.elements[j].resource;
        if (element === resource)
          return group;
      }
    }
    return null;
  }
  apply(passEncoder) {
    for (let i = 0; i < this.groups.length; i++) {
      this.groups[i].apply(passEncoder);
    }
  }
  update() {
    for (let i = 0; i < this.groups.length; i++) {
      this.groups[i].update(this.pipeline);
    }
  }
  getVertexShaderDeclaration(fromFragmentShader = false) {
    if (fromFragmentShader)
      return this.temp;
    let result = "";
    let group;
    let resources;
    let resource;
    let name;
    let k = 0;
    const obj = { result: "", variables: "" };
    for (let i = 0; i < this.groups.length; i++) {
      group = this.groups[i];
      resources = group.elements;
      k = 0;
      for (let j = 0; j < resources.length; j++) {
        resource = resources[j].resource;
        if (resource instanceof VertexBuffer)
          continue;
        name = resources[j].name;
        if (resource instanceof UniformBuffer) {
          const s = resource.createStruct(name);
          obj.variables += s.localVariables;
          result += s.struct;
        }
        result += resource.createDeclaration(name, k++, i) + "\n";
      }
    }
    obj.result = result;
    this.temp = obj;
    return obj;
  }
  getFragmentShaderDeclaration() {
    let result = "";
    let group;
    let resources;
    let resource;
    let name;
    let k = 0;
    const obj = { result: "", variables: "" };
    for (let i = 0; i < this.groups.length; i++) {
      group = this.groups[i];
      resources = group.elements;
      k = 0;
      for (let j = 0; j < resources.length; j++) {
        resource = resources[j].resource;
        if (resource instanceof VertexBuffer)
          continue;
        name = resources[j].name;
        if (resource instanceof UniformBuffer) {
          let item;
          for (let z in resource.items) {
            item = resource.items[z];
            let _name = name.substring(0, 1).toLowerCase() + name.slice(1);
            if (item.propertyNames)
              result += item.createStruct() + "\n";
            if (item.createVariableInsideMain)
              obj.variables += item.createVariable(_name) + "\n";
          }
          result += resource.createStruct(name).struct + "\n";
        }
        result += resource.createDeclaration(name, k++, i) + "\n";
      }
    }
    obj.result = result;
    return obj;
  }
  getComputeShaderDeclaration() {
    let result = "";
    let group;
    let resources;
    let resource;
    let name;
    let k = 0;
    const obj = { result: "", variables: "" };
    for (let i = 0; i < this.groups.length; i++) {
      group = this.groups[i];
      resources = group.elements;
      k = 0;
      for (let j = 0; j < resources.length; j++) {
        resource = resources[j].resource;
        name = resources[j].name;
        if (resource instanceof VertexBuffer)
          ;
        else if (resource instanceof UniformBuffer) {
          let item;
          for (let z in resource.items) {
            item = resource.items[z];
            let _name = name.substring(0, 1).toLowerCase() + name.slice(1);
            if (item.createVariableInsideMain)
              obj.variables += item.createVariable(_name) + "\n";
          }
          const struct = resource.createStruct(name).struct + "\n";
          result += struct;
        }
        const declaration = resource.createDeclaration(name, k++, i) + "\n";
        result += declaration;
      }
    }
    obj.result = result;
    return obj;
  }
  createVertexBufferLayout() {
    const vertexLayouts = [];
    const buffers = [];
    let group;
    let resources;
    let resource;
    let k = 0;
    let builtin = 0;
    let nbVertex = 0;
    for (let j = 0; j < this.groups.length; j++) {
      group = this.groups[j];
      resources = group.elements;
      for (let i = 0; i < resources.length; i++) {
        resource = resources[i].resource;
        if (resource instanceof VertexBuffer) {
          nbVertex = Math.max(nbVertex, resource.nbVertex);
          buffers[k] = resource;
          vertexLayouts[k++] = resource.createVertexBufferLayout(builtin);
          builtin += resource.vertexArrays.length;
        }
      }
    }
    return {
      vertexLayouts,
      buffers,
      nbVertex
    };
  }
  handleRenderPipelineResourceIOs() {
    for (let i = 0; i < this.groups.length; i++) {
      this.groups[i].handleRenderPipelineResourceIOs();
    }
  }
  handleComputePipelineResourceIOs() {
    for (let i = 0; i < this.groups.length; i++) {
      this.groups[i].handleComputePipelineResourceIOs();
    }
  }
  get resources() {
    return this._resources;
  }
  add(bindgroup) {
    bindgroup.parent = this;
    let resource = this._resources;
    if (!this._resources.all)
      this._resources.all = [];
    if (!this._resources.types)
      this._resources.types = {};
    const types = this._resources.types;
    const addResources = (res, elements) => {
      let element;
      let r;
      for (let i = 0; i < elements.length; i++) {
        element = elements[i];
        if (res[element.name])
          continue;
        r = element.resource;
        if (this._resources.all.indexOf(r) === -1)
          this._resources.all.push(r);
        res[element.name] = element.resource;
        if (r instanceof DepthTextureArray) {
          if (!types.depthTextureArrays)
            types.depthTextureArrays = [];
          if (types.depthTextureArrays.indexOf(element) === -1)
            types.depthTextureArrays.push(element);
        } else if (r instanceof CubeMapTextureArray) {
          if (!types.cubeMapTextureArrays)
            types.cubeMapTextureArrays = [];
          if (types.cubeMapTextureArrays.indexOf(element) === -1)
            types.cubeMapTextureArrays.push(element);
        } else if (r instanceof ImageTextureArray) {
          if (!types.imageTextureArrays)
            types.imageTextureArrays = [];
          if (types.imageTextureArrays.indexOf(element) === -1)
            types.imageTextureArrays.push(element);
        } else if (r instanceof UniformBuffer) {
          if (!types.uniformBuffers)
            types.uniformBuffers = [];
          if (types.uniformBuffers.indexOf(element) === -1)
            types.uniformBuffers.push(element);
        } else if (r instanceof VertexBuffer) {
          if (!types.vertexBuffers)
            types.vertexBuffers = [];
          if (types.vertexBuffers.indexOf(element) === -1)
            types.vertexBuffers.push(element);
        } else if (r instanceof CubeMapTexture) {
          if (!types.cubeMapTexture)
            types.cubeMapTexture = [];
          if (types.cubeMapTexture.indexOf(element) === -1)
            types.cubeMapTexture.push(element);
        } else if (r instanceof ImageTexture) {
          if (!types.imageTextures)
            types.imageTextures = [];
          if (types.imageTextures.indexOf(element) === -1)
            types.imageTextures.push(element);
        } else if (r instanceof VideoTexture) {
          if (!types.videoTexture)
            types.videoTexture = [];
          if (types.videoTexture.indexOf(element) === -1)
            types.videoTexture.push(element);
        } else if (r instanceof TextureSampler) {
          if (!types.sampler)
            types.sampler = [];
          if (types.sampler.indexOf(element) === -1)
            types.sampler.push(element);
        } else if (r instanceof DepthStencilTexture) {
          if (!types.depthStencilTextures)
            types.depthStencilTextures = [];
          if (types.depthStencilTextures.indexOf(element) === -1)
            types.depthStencilTextures.push(element);
        }
      }
    };
    const addGroup = (o) => {
      const res = resource[o.name] = {};
      if (!res.types)
        res.types = {};
      addResources(res, o.elements);
      this.groups.push(o);
    };
    if (bindgroup instanceof Bindgroup) {
      if (this.groups.indexOf(bindgroup) === -1)
        addGroup(bindgroup);
      else {
        addResources(resource[bindgroup.name], bindgroup.elements);
      }
    } else {
      bindgroup.pipeline = this.pipeline;
      resource = resource[bindgroup.name] = {};
      let o;
      for (let i = 0; i < bindgroup.groups.length; i++) {
        o = bindgroup.groups[i];
        if (this.groups.indexOf(o) === -1)
          addGroup(o);
      }
    }
    return bindgroup;
  }
  copy(options) {
    const obj = new Bindgroups(this.pipeline, this._name);
    const groups = this.groups.concat();
    if (options) {
      for (let i = 0; i < options.oldGroups.length; i++) {
        groups.splice(groups.indexOf(options.oldGroups[i]), 1, options.replacedGroup[i]);
      }
    }
    obj.groups = groups;
    return obj;
  }
  propertyNameIsUsed(propertyName) {
    for (let i = 0; i < this.groups.length; i++) {
      if (this.groups[i].get(propertyName))
        return true;
    }
    return false;
  }
  get(propertyName) {
    let o;
    for (let i = 0; i < this.groups.length; i++) {
      o = this.groups[i].get(propertyName);
      if (o)
        return o;
    }
    return null;
  }
  getGroupByPropertyName(name) {
    let o;
    for (let i = 0; i < this.groups.length; i++) {
      o = this.groups[i].get(name);
      if (o)
        return this.groups[i];
    }
    return null;
  }
  getGroupByName(name) {
    for (let i = 0; i < this.groups.length; i++) {
      if (this.groups[i].name === name)
        return this.groups[i];
    }
    return null;
  }
  getNameByResource(resource) {
    if (resource instanceof PrimitiveFloatUniform || resource instanceof PrimitiveIntUniform || resource instanceof PrimitiveUintUniform) {
      return resource.name;
    }
    let elements;
    for (let i = 0; i < this.groups.length; i++) {
      elements = this.groups[i].elements;
      for (let j = 0; j < elements.length; j++) {
        if (elements[j].resource === resource) {
          return elements[j].name;
        }
      }
    }
    return null;
  }
  setupDraw(force = false) {
    for (let i = 0; i < this.groups.length; i++) {
      if (!this.groups[i].setupDrawCompleted) {
        this.groups[i].setupDraw(force);
      }
    }
  }
  get drawConfig() {
    return this.pipeline.drawConfig || null;
  }
  get current() {
    return this.groups[this.groups.length - 1];
  }
  destroy() {
    for (let i = 0; i < this.groups.length; i++) {
      this.groups[i].destroy();
      this.groups[i] = void 0;
    }
    this.groups = [];
    this._resources = {};
  }
}
class Pipeline extends EventDispatcher {
  constructor() {
    super();
    __publicField(this, "description", {});
    __publicField(this, "nbVertex");
    __publicField(this, "bindGroups");
    __publicField(this, "vertexBuffers");
    __publicField(this, "vertexShader");
    __publicField(this, "fragmentShader");
    __publicField(this, "vertexBufferLayouts");
    __publicField(this, "gpuBindgroups", []);
    __publicField(this, "gpuBindGroupLayouts", []);
    __publicField(this, "gpuPipelineLayout");
    __publicField(this, "type", null);
    __publicField(this, "_resources");
    __publicField(this, "debug");
    __publicField(this, "pipelineCount", 1);
    this.bindGroups = new Bindgroups(this, "pipeline");
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
    this.bindGroups.clearAfterDeviceLost();
    this.vertexBufferLayouts = void 0;
    this.gpuPipelineLayout = void 0;
    this.gpuBindGroupLayouts = [];
    this.gpuBindgroups = [];
  }
  initFromObject(obj) {
    this._resources = obj;
  }
  static getResourceDefinition(resources) {
    const result = {};
    let o;
    for (let z in resources) {
      o = resources[z];
      result[o.name] = o;
    }
    return result;
  }
  addBindgroup(group) {
    this.bindGroups.add(group);
  }
  createVertexBufferLayout() {
    this.vertexBufferLayouts = [];
    this.vertexBuffers = [];
    const groups = this.bindGroups.groups;
    let elements;
    let resource;
    let builtin = 0;
    let k = 0;
    for (let i = 0; i < groups.length; i++) {
      elements = groups[i].elements;
      for (let j = 0; j < elements.length; j++) {
        resource = elements[j].resource;
        if (resource instanceof VertexBuffer) {
          this.vertexBuffers[k] = resource;
          this.vertexBufferLayouts[k++] = resource.createVertexBufferLayout(builtin);
          builtin += resource.vertexArrays.length;
        }
      }
    }
    return this.vertexBufferLayouts;
  }
  createShaderInput(shader, buffers) {
    const vertexInput = new ShaderStruct("Input", shader.inputs);
    if (buffers) {
      let arrays;
      let builtin = 0;
      for (let i = 0; i < buffers.length; i++) {
        arrays = buffers[i].vertexArrays;
        for (let j = 0; j < arrays.length; j++) {
          vertexInput.addProperty({ name: arrays[j].name, type: arrays[j].varType, builtin: "@location(" + builtin + ")" });
          builtin++;
        }
      }
    }
    return vertexInput;
  }
  createLayouts() {
    this.gpuBindGroupLayouts = [];
    this.gpuBindgroups = [];
    this.gpuPipelineLayout = null;
    const groups = this.bindGroups.groups;
    let elements;
    let resource;
    let layout, group;
    let k, n = 0;
    for (let i = 0; i < groups.length; i++) {
      elements = groups[i].elements;
      layout = { entries: [] };
      group = { entries: [], layout: null };
      k = 0;
      for (let j = 0; j < elements.length; j++) {
        resource = elements[j].resource;
        if (!(resource instanceof VertexBuffer) || this.isComputePipeline) {
          layout.entries[k] = resource.createBindGroupLayoutEntry(k);
          group.entries[k] = resource.createBindGroupEntry(k);
          k++;
        }
      }
      if (k > 0) {
        group.layout = this.gpuBindGroupLayouts[n] = XGPU.createBindgroupLayout(layout);
        this.gpuBindgroups[n] = XGPU.createBindgroup(group);
        n++;
      }
    }
    this.gpuPipelineLayout = XGPU.createPipelineLayout({ bindGroupLayouts: this.gpuBindGroupLayouts });
  }
  initPipelineResources(pipeline) {
    const resources = this.bindGroups.resources.all;
    if (!resources)
      return;
    for (let i = 0; i < resources.length; i++)
      resources[i].setPipelineType(pipeline.type);
  }
  build() {
    this.createVertexBufferLayout();
    this.createLayouts();
  }
  update(o) {
  }
  getResourceName(resource) {
    if (resource instanceof VertexAttribute) {
      if (this.type !== "render") {
        const buffer = resource.vertexBuffer;
        const bufferName = this.bindGroups.getNameByResource(buffer);
        return bufferName + "." + resource.name;
      } else {
        return resource.name;
      }
    } else {
      if (resource.uniformBuffer) {
        const bufferName = this.bindGroups.getNameByResource(resource.uniformBuffer);
        return bufferName + "." + resource.name;
      } else {
        return this.bindGroups.getNameByResource(resource);
      }
    }
  }
  createPipelineInstanceArray(resources, nbInstance) {
    this.pipelineCount = nbInstance;
    const result = [];
    let instance;
    let resource;
    let clonedUniformBuffers;
    const resourceNames = [];
    const resourceBindgroup = [];
    const resourceUniformBufferName = [];
    for (let i = 0; i < resources.length; i++) {
      resource = resources[i];
      const name = this.bindGroups.getNameByResource(resource);
      const bindgroup = this.bindGroups.getGroupByPropertyName(name);
      bindgroup.mustRefreshBindgroup = true;
      resourceNames[i] = name;
      resourceBindgroup[i] = bindgroup;
      if (resource instanceof PrimitiveFloatUniform || resource instanceof PrimitiveIntUniform || resource instanceof PrimitiveUintUniform) {
        resourceUniformBufferName[i] = bindgroup.getResourceName(resource.uniformBuffer);
      }
    }
    for (let k = 0; k < nbInstance; k++) {
      result[k] = instance = {};
      clonedUniformBuffers = {};
      for (let i = 0; i < resources.length; i++) {
        resource = resources[i];
        resource.update();
        const name = resourceNames[i];
        const bindgroup = resourceBindgroup[i];
        if (resource instanceof PrimitiveFloatUniform || resource instanceof PrimitiveIntUniform || resource instanceof PrimitiveUintUniform) {
          const uniformBufferName = resourceUniformBufferName[i];
          if (!clonedUniformBuffers[uniformBufferName]) {
            clonedUniformBuffers[uniformBufferName] = resource.uniformBuffer.clone();
            clonedUniformBuffers[uniformBufferName].name = uniformBufferName;
          }
          instance[uniformBufferName] = clonedUniformBuffers[uniformBufferName];
          instance[uniformBufferName].name = clonedUniformBuffers[uniformBufferName].name;
          instance[uniformBufferName].bindgroup = bindgroup;
          instance[name] = clonedUniformBuffers[uniformBufferName].getUniformByName(name);
        } else {
          instance[name] = resource.clone();
          instance[name].bindgroup = bindgroup;
          instance[name].name = name;
        }
      }
      const shaderResources = [];
      for (let z in instance) {
        resource = instance[z];
        if (!(resource instanceof PrimitiveFloatUniform || resource instanceof PrimitiveIntUniform || resource instanceof PrimitiveUintUniform)) {
          resource.setPipelineType(this.type);
          resource.createGpuResource();
          shaderResources.push(resource);
        }
      }
      instance.deviceId = XGPU.deviceId;
      instance.apply = () => {
        let rebuild = false;
        if (XGPU.deviceId != instance.deviceId) {
          rebuild = true;
          instance.deviceId = XGPU.deviceId;
        }
        let o;
        for (let i = 0; i < shaderResources.length; i++) {
          o = shaderResources[i];
          if (rebuild) {
            o.destroyGpuResource();
            o.createGpuResource();
          }
          o.update();
          o.bindgroup.set(o.name, o);
        }
        this.update();
      };
    }
    return result;
  }
}
class MultiSampleTexture extends Texture {
  constructor(descriptor) {
    if (void 0 === descriptor.format)
      descriptor.format = XGPU.getPreferredCanvasFormat();
    if (void 0 === descriptor.usage)
      descriptor.usage = GPUTextureUsage.RENDER_ATTACHMENT;
    if (void 0 === descriptor.sampleCount)
      descriptor.sampleCount = 4;
    if (void 0 === descriptor.alphaToCoverageEnabled)
      descriptor.alphaToCoverageEnabled = false;
    if (void 0 === descriptor.mask)
      descriptor.mask = 4294967295;
    if (void 0 === descriptor.resolveTarget)
      descriptor.resolveTarget = null;
    super(descriptor);
    __publicField(this, "_description");
    this._description = {
      count: descriptor.sampleCount,
      mask: descriptor.mask,
      alphaToCoverageEnabled: descriptor.alphaToCoverageEnabled
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
const _RenderPassTexture = class extends ImageTexture {
  constructor(pipeline, descriptor) {
    if (!descriptor) {
      if (pipeline.renderer)
        descriptor = { size: [pipeline.renderer.width, pipeline.renderer.height] };
      else
        descriptor = { size: [1, 1] };
    }
    if (!descriptor.format)
      descriptor.format = XGPU.getPreferredCanvasFormat();
    if (!descriptor.usage)
      descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT;
    if (!descriptor.mipLevelCount)
      descriptor.mipLevelCount = 1;
    if (!descriptor.sampleCount)
      descriptor.sampleCount = 1;
    if (!descriptor.dimension)
      descriptor.dimension = "2d";
    if (!descriptor.viewFormats)
      descriptor.viewFormats = [];
    if (!descriptor.label)
      descriptor.label = "RenderPassTexture";
    super(descriptor);
    __publicField(this, "ready", false);
    __publicField(this, "renderPipeline");
    __publicField(this, "_mustUseCopyTextureToTexture", false);
    __publicField(this, "frameId", -1);
    if (!pipeline.renderer) {
      this.ready = false;
      pipeline.addEventListener(RenderPipeline.ON_ADDED_TO_RENDERER, () => {
        this.ready = true;
        this.resize(pipeline.renderer.width, pipeline.renderer.height);
      }, true);
    } else {
      this.ready = true;
    }
    this.renderPipeline = pipeline;
    this.createGpuResource();
  }
  get mustUseCopyTextureToTexture() {
    return this._mustUseCopyTextureToTexture;
  }
  applyRenderPass(pipeline) {
    if (this.renderPipeline === pipeline) {
      this._mustUseCopyTextureToTexture = true;
      return;
    } else {
      if (!this.ready) {
        if (pipeline instanceof RenderPipeline && pipeline.renderer) {
          this.renderPipeline.renderer = pipeline.renderer;
          this.ready = true;
        } else {
          return;
        }
      }
    }
    if (pipeline instanceof RenderPipeline && pipeline.renderer) {
      this.renderPipeline.renderer = pipeline.renderer;
    }
    if (this.frameId != this.renderPipeline.renderer.frameId) {
      const commandEncoder = this.renderPipeline.renderer.commandEncoder;
      if (commandEncoder) {
        this.frameId = this.renderPipeline.renderer.frameId;
        if (!this.renderPipeline.pipeline) {
          this.renderPipeline.buildGpuPipeline();
        }
        this.renderPipeline.update();
        const renderPass = this.renderPipeline.beginRenderPass(commandEncoder, this.view, 0, true);
        for (let j = 0; j < this.renderPipeline.pipelineCount; j++) {
          this.renderPipeline.dispatchEvent(RenderPipeline.ON_DRAW, j);
          this.renderPipeline.draw(renderPass);
        }
        this.renderPipeline.end(commandEncoder, renderPass);
      }
    }
  }
  resize(w, h) {
    this.descriptor.size = [w, h];
    this.createGpuResource();
    this.dispatchEvent(_RenderPassTexture.RESOURCE_CHANGED);
    return this;
  }
  createBindGroupEntry(bindingId) {
    if (this.deviceId !== XGPU.deviceId) {
      this.deviceId = XGPU.deviceId;
      this.gpuResource = XGPU.device.createTexture(this.descriptor);
      this._view = this.gpuResource.createView();
    }
    return super.createBindGroupEntry(bindingId);
  }
  get width() {
    return this.descriptor.size[0];
  }
  get height() {
    return this.descriptor.size[1];
  }
  get isRenderPass() {
    return true;
  }
  update() {
  }
  get source() {
    return null;
  }
  set source(bmp) {
    if (bmp)
      return;
  }
};
let RenderPassTexture = _RenderPassTexture;
__publicField(RenderPassTexture, "RESOURCE_CHANGED", "RESOURCE_CHANGED");
class DrawConfig {
  constructor(renderPipeline) {
    __publicField(this, "vertexCount", -1);
    __publicField(this, "instanceCount", 1);
    __publicField(this, "firstVertexId", 0);
    __publicField(this, "firstInstanceId", 0);
    __publicField(this, "baseVertex", 0);
    __publicField(this, "indexBuffer");
    __publicField(this, "pipeline");
    __publicField(this, "setupDrawCompleted", false);
    this.pipeline = renderPipeline;
  }
  draw(renderPass) {
    if (this.indexBuffer) {
      renderPass.setIndexBuffer(this.indexBuffer.gpuResource, this.indexBuffer.dataType, this.indexBuffer.offset, this.indexBuffer.getBufferSize());
      renderPass.drawIndexed(this.indexBuffer.nbPoint, this.instanceCount, this.firstVertexId, this.baseVertex, this.firstInstanceId);
    } else {
      renderPass.draw(this.vertexCount, this.instanceCount, this.firstVertexId, this.firstInstanceId);
    }
  }
}
class ComputeShader extends ShaderStage {
  constructor() {
    super("compute");
  }
  build(shaderPipeline, inputs) {
    if (this._shaderInfos)
      return this._shaderInfos;
    let result = "";
    const obj = shaderPipeline.bindGroups.getComputeShaderDeclaration();
    result += obj.result + "\n\n";
    result += this.constants.value + "\n\n";
    const w = shaderPipeline.workgroups;
    let mainFunc = this.unwrapVariableInMainFunction(obj.variables);
    result += "@compute @workgroup_size(" + w[0] + "," + w[1] + "," + w[2] + ")\n";
    result += "fn main(" + inputs.getFunctionParams() + ") {\n";
    result += mainFunc;
    result += "}\n";
    if (XGPU.showComputeShader) {
      console.log("------------- COMPUTE SHADER --------------");
      console.log(result);
      console.log("-------------------------------------------");
    }
    this._shaderInfos = { code: result, output: null };
    return this._shaderInfos;
  }
}
class ComputePipeline extends Pipeline {
  constructor() {
    super();
    __publicField(this, "computeShader");
    __publicField(this, "onReceiveData");
    __publicField(this, "gpuComputePipeline");
    __publicField(this, "workgroups");
    __publicField(this, "dispatchWorkgroup");
    __publicField(this, "bufferSize");
    __publicField(this, "textureSize");
    // [width,height]
    __publicField(this, "stagingBuffer");
    __publicField(this, "bufferIOs");
    __publicField(this, "textureIOs");
    __publicField(this, "onComputeBegin");
    __publicField(this, "onComputeEnd");
    __publicField(this, "vertexBufferIOs", []);
    __publicField(this, "imageTextureIOs", []);
    __publicField(this, "resourceIOs", []);
    __publicField(this, "nbVertexMax", 0);
    __publicField(this, "widthMax", 0);
    __publicField(this, "heightMax", 0);
    __publicField(this, "deviceId");
    __publicField(this, "lastFrameTime", -1);
    __publicField(this, "rebuildingAfterDeviceLost", false);
    __publicField(this, "firstFrame", true);
    __publicField(this, "processingFirstFrame", false);
    __publicField(this, "waitingFrame", false);
    this.computeShader = new ComputeShader();
    this.type = "compute";
  }
  set useRenderPipeline(b) {
    if (b)
      this.type = "compute_mixed";
    else
      this.type = "compute";
  }
  initFromObject(descriptor) {
    this._resources = {};
    this.vertexShader = null;
    this.fragmentShader = null;
    this.bindGroups.destroy();
    this.bindGroups = new Bindgroups(this, "pipeline");
    descriptor = HighLevelParser.parse(descriptor, "compute");
    super.initFromObject(descriptor);
    if (descriptor.bindgroups) {
      let group;
      for (let z in descriptor.bindgroups) {
        group = new Bindgroup();
        group.name = z;
        group.initFromObject(descriptor.bindgroups[z]);
        this.bindGroups.add(group);
      }
      if (descriptor.bindgroups.default) {
        if (descriptor.bindgroups.default.buffer) {
          const attributes = descriptor.bindgroups.default.buffer.attributes;
          for (let z in attributes) {
            if (descriptor[z])
              descriptor[z] = attributes[z];
          }
        }
      }
    }
    const createArrayOfObjects = (obj) => {
      const result = [];
      let o;
      for (let z in obj) {
        o = obj[z];
        result.push({ name: z, ...o });
      }
      return result;
    };
    this.computeShader = new ComputeShader();
    if (typeof descriptor.computeShader === "string") {
      this.computeShader.main.text = descriptor.computeShader;
    } else {
      this.computeShader.inputs = createArrayOfObjects(descriptor.computeShader.inputs);
      this.computeShader.outputs = createArrayOfObjects(descriptor.computeShader.outputs);
      if (descriptor.computeShader.constants)
        this.computeShader.constants.text = descriptor.computeShader.constants;
      this.computeShader.main.text = descriptor.computeShader.main;
    }
    let vertexBufferReadyToUse = true;
    for (let bufferName in this.resources.bindgroups.io) {
      if (!this.resources.bindgroups.io[bufferName].data) {
        vertexBufferReadyToUse = false;
      }
    }
    if (vertexBufferReadyToUse)
      this.nextFrame();
    return descriptor;
  }
  destroy() {
    this.bindGroups.destroy();
    for (let z in this.description)
      this.description[z] = null;
    for (let z in this) {
      try {
        this[z].destroy();
      } catch (e) {
        try {
          this[z].destroyGpuResource();
        } catch (e2) {
        }
      }
      this[z] = null;
    }
  }
  setWorkgroups(x, y = 1, z = 1) {
    this.workgroups = [x, y, z];
  }
  setDispatchWorkgroup(x = 1, y = 1, z = 1) {
    this.dispatchWorkgroup = [x, y, z];
  }
  initResourceIOs() {
    const resources = this.bindGroups.resources.io;
    if (!resources)
      return;
    let res;
    let io;
    for (let z in resources) {
      res = resources[z];
      io = res.resourceIO;
      if (io instanceof VertexBufferIO) {
        if (this.vertexBufferIOs.indexOf(io) === -1) {
          this.resourceIOs.push(io);
          if (io.nbVertex > this.nbVertexMax)
            this.nbVertexMax = io.nbVertex;
          this.vertexBufferIOs.push(io);
        }
      } else if (io instanceof ImageTextureIO) {
        if (this.imageTextureIOs.indexOf(io) === -1) {
          this.resourceIOs.push(io);
          if (io.width > this.widthMax)
            this.widthMax = io.width;
          if (io.height > this.heightMax)
            this.heightMax = io.height;
          this.imageTextureIOs.push(io);
        }
      } else
        ;
    }
  }
  update() {
    if (!this.gpuComputePipeline)
      return;
    if (this.deviceId !== XGPU.deviceId) {
      this.deviceId = XGPU.deviceId;
      this.clearAfterDeviceLostAndRebuild();
      if ((/* @__PURE__ */ new Date()).getTime() - this.lastFrameTime < 100) {
        this.nextFrame();
      }
    }
    this.bindGroups.update();
    this.lastFrameTime = (/* @__PURE__ */ new Date()).getTime();
  }
  setupDefaultWorkgroups() {
    if (this.vertexBufferIOs.length) {
      let n = 64;
      while (this.nbVertexMax / n >= 65536)
        n *= 2;
      this.setWorkgroups(n);
      this.setDispatchWorkgroup(Math.ceil(this.nbVertexMax / n));
    } else {
      this.setWorkgroups(1);
      this.setDispatchWorkgroup(this.widthMax, this.heightMax);
    }
  }
  clearAfterDeviceLostAndRebuild() {
    console.warn("ComputePipeline.clearAfterDeviceLostAndRebuild()");
    this.gpuComputePipeline = null;
    this.rebuildingAfterDeviceLost = true;
    super.clearAfterDeviceLostAndRebuild();
  }
  buildGpuPipeline() {
    if (this.gpuComputePipeline)
      return this.gpuComputePipeline;
    this.initPipelineResources(this);
    this.createLayouts();
    this.bindGroups.handleComputePipelineResourceIOs();
    this.initResourceIOs();
    if (!this.workgroups)
      this.setupDefaultWorkgroups();
    this.bindGroups.build();
    const outputs = this.computeShader.outputs;
    const inputs = this.computeShader.inputs;
    for (let i = 0; i < outputs.length; i++) {
      if (outputs[i].type.createGpuResource) {
        outputs[i].isOutput = true;
        inputs.push(outputs[i]);
      }
    }
    const inputStruct = new ShaderStruct("Input", [...inputs]);
    const { code } = this.computeShader.build(this, inputStruct);
    this.description.compute = {
      module: XGPU.device.createShaderModule({ code }),
      entryPoint: "main"
    };
    this.description.layout = this.gpuPipelineLayout;
    this.deviceId = XGPU.deviceId;
    this.gpuComputePipeline = XGPU.createComputePipeline(this.description);
    return this.gpuComputePipeline;
  }
  async nextFrame() {
    if (this.processingFirstFrame) {
      this.waitingFrame = true;
      return;
    }
    if (this.onComputeBegin)
      this.onComputeBegin();
    this.processingFirstFrame = this.firstFrame;
    this.update();
    const commandEncoder = XGPU.device.createCommandEncoder();
    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(this.buildGpuPipeline());
    this.bindGroups.update();
    this.bindGroups.apply(computePass);
    computePass.dispatchWorkgroups(this.dispatchWorkgroup[0], this.dispatchWorkgroup[1], this.dispatchWorkgroup[2]);
    computePass.end();
    XGPU.device.queue.submit([commandEncoder.finish()]);
    if (this.firstFrame) {
      await XGPU.device.queue.onSubmittedWorkDone();
    }
    for (let i = 0; i < this.resourceIOs.length; i++) {
      this.resourceIOs[i].getOutputData();
    }
    this.firstFrame = false;
    this.processingFirstFrame = false;
    if (this.onComputeEnd)
      this.onComputeEnd();
    if (this.waitingFrame) {
      this.waitingFrame = false;
      this.nextFrame();
    }
  }
}
class VertexShaderDebuggerPipeline extends ComputePipeline {
  constructor() {
    super();
    __publicField(this, "onLog");
    __publicField(this, "config");
    __publicField(this, "vertexShaderInputs");
    __publicField(this, "renderPipeline");
    __publicField(this, "computeShaderObj");
    __publicField(this, "resourceByType");
    __publicField(this, "indexBuffer");
    __publicField(this, "results");
    __publicField(this, "resultBufferStructure", {});
    __publicField(this, "nbValueByFieldIndex", {});
    __publicField(this, "nbValueByFieldName", {});
    __publicField(this, "dataTypeByFieldname", {});
    __publicField(this, "fieldNames", []);
    __publicField(this, "fieldNewNames", []);
    __publicField(this, "fieldIndexByName", {});
    __publicField(this, "attributes", {});
    __publicField(this, "vertexIdName");
    // = "vertexId";
    __publicField(this, "instanceIdName");
    __publicField(this, "renderUniformBuffers");
    __publicField(this, "renderVertexBuffers");
    __publicField(this, "bufferNameByAttributeName");
    __publicField(this, "vertexBufferIO");
    __publicField(this, "firstPass", true);
    __publicField(this, "temporaryIndex", 0);
  }
  initRenderPipeline(renderPipeline) {
    this.renderPipeline = renderPipeline;
    renderPipeline.bindGroups.setupDraw(true);
    this.resourceByType = renderPipeline.bindGroups.resources.types;
    this.vertexShaderInputs = renderPipeline.vertexShader.inputs;
    this.renderUniformBuffers = this.resourceByType.uniformBuffers;
  }
  setupIndexBuffer() {
    let indexBuffer = null;
    if (this.renderPipeline.resources.indexBuffer) {
      indexBuffer = this.renderPipeline.resources.indexBuffer;
      this.computeShaderObj["indexBuffer"] = new VertexBuffer({ id: VertexAttribute.Uint() }, {
        stepMode: "vertex",
        datas: indexBuffer.datas
      });
    }
  }
  setupDataStructure() {
    this.results = {};
    this.resultBufferStructure = {};
    this.nbValueByFieldIndex = {};
    this.nbValueByFieldName = {};
    this.dataTypeByFieldname = {};
    this.fieldNames = [];
    this.fieldNewNames = [];
    this.fieldIndexByName = {};
    this.attributes = {};
    const vertexShaderDebugs = this.renderPipeline.resources.__DEBUG__.objectById;
    let nb, name;
    let debug;
    for (let i = 0; i < vertexShaderDebugs.length; i++) {
      debug = vertexShaderDebugs[i];
      name = debug.name;
      nb = this.getNbValueByType(debug.type);
      this.fieldNames[i] = name;
      this.fieldNewNames[i] = debug.newName;
      this.fieldIndexByName[name] = i;
      this.nbValueByFieldIndex[i] = debug.nbValue;
      this.dataTypeByFieldname[name] = debug.type;
      this.resultBufferStructure[name] = this.createEmptyArray(nb);
      this.nbValueByFieldName[name] = nb;
      this.attributes[debug.newName] = this.getObjectByType(debug.type);
    }
  }
  // = "instanceId";
  //protected computeUniforms = {};
  setupVertexShaderBuiltIns() {
    let input;
    for (let i = 0; i < this.vertexShaderInputs.length; i++) {
      input = this.vertexShaderInputs[i];
      if (input.builtin) {
        if (input.builtin === "@builtin(vertex_index)") {
          this.vertexIdName = input.name;
        } else if (input.builtin === "@builtin(instance_index)") {
          this.instanceIdName = input.name;
        }
      }
    }
    if (!this.vertexIdName) {
      this.vertexIdName = "VERTEX_ID";
    }
    if (!this.instanceIdName) {
      this.instanceIdName = "INSTANCE_ID";
    }
  }
  setupUniformBuffers() {
    let ub;
    const cloneUniformBuffer = (buf) => {
      const result = {};
      for (let i = 0; i < buf.itemNames.length; i++) {
        result[buf.itemNames[i]] = buf.items[buf.itemNames[i]].clone();
      }
      return new UniformBuffer(result, { useLocalVariable: buf.descriptor.useLocalVariable });
    };
    if (this.renderUniformBuffers) {
      for (let i = 0; i < this.renderUniformBuffers.length; i++) {
        ub = this.renderUniformBuffers[i];
        this.computeShaderObj[ub.name] = cloneUniformBuffer(ub.resource);
      }
    }
  }
  setupVertexBuffers() {
    this.renderVertexBuffers = this.resourceByType.vertexBuffers;
    this.bufferNameByAttributeName = [];
    let vb;
    let vBuffer;
    if (this.renderVertexBuffers) {
      for (let i = 0; i < this.renderVertexBuffers.length; i++) {
        vb = this.renderVertexBuffers[i];
        vBuffer = vb.resource;
        let attributes = vBuffer.attributeDescriptor;
        for (let z in attributes) {
          this.bufferNameByAttributeName[z] = vb.name;
        }
        this.computeShaderObj[vb.name] = new VertexBuffer(vBuffer.attributeDescriptor, {
          stepMode: vBuffer.stepMode,
          datas: vBuffer.datas
        });
      }
    }
  }
  setupComputeShaderVertexBufferIO() {
    this.vertexBufferIO = new VertexBufferIO(this.attributes);
    this.vertexBufferIO.createVertexInstances(this.config.nbVertex, () => {
      return this.resultBufferStructure;
    });
    let outputResultId;
    this.vertexBufferIO.onOutputData = (data) => {
      const result = new Float32Array(data);
      outputResultId = 0;
      let outputResults = [];
      this.vertexBufferIO.getVertexInstances(result, (o) => {
        let result2 = {};
        for (let z in o)
          result2[z] = { ...o[z] };
        outputResults[outputResultId++] = result2;
        if (this.onLog && outputResultId == this.config.nbVertex) {
          this.onLog({
            config: this.config,
            results: outputResults,
            nbValueByFieldName: this.nbValueByFieldName,
            renderPipeline: this.renderPipeline,
            dataTypeByFieldname: this.dataTypeByFieldname
          });
        }
      });
    };
  }
  convertLetIntoVar(shader) {
    let result = "";
    let lines = shader.split("\n");
    let line;
    let chars = "abcdefghijklmnopqrstuvwxyz/";
    chars += chars.toUpperCase();
    const getFirstCharId = (line2) => {
      for (let i = 0; i < line2.length; i++) {
        if (chars.includes(line2[i]))
          return i;
      }
      return line2.length - 1;
    };
    for (let i = 0; i < lines.length; i++) {
      line = lines[i];
      line = line.slice(getFirstCharId(line));
      if (line.slice(0, 4) === "let ") {
        line = "var " + line.slice(4);
      }
      result += " " + line + "\n";
    }
    return result;
  }
  removeVar(shader) {
    let result = "";
    let lines = shader.split("\n");
    let line;
    for (let i = 0; i < lines.length; i++) {
      line = lines[i];
      if (line.slice(0, 5) === " var ")
        line = line.slice(5);
      result += " " + line + "\n";
    }
    return result;
  }
  writeComputeShader() {
    let outputVariables = "";
    let outputs = this.renderPipeline.vertexShader.outputs;
    for (let i = 0; i < outputs.length; i++) {
      outputVariables += `var output_${outputs[i].name} = ${this.getNewInstanceByType(outputs[i].type)};
`;
    }
    let computeShader = ``;
    if (this.indexBuffer)
      computeShader += `let index:u32 = indexBuffer[global_id.x].id;`;
    else
      computeShader += `let index = global_id.x;`;
    computeShader += `
        ${outputVariables}
        let nbResult = arrayLength(&result);
        if(index >= nbResult){
            return;
        }

        var computeResult = result[index];
        var ${this.vertexIdName}:u32 = 0;
        var ${this.instanceIdName}:u32 = 0;
        `;
    let input;
    for (let i = 0; i < this.vertexShaderInputs.length; i++) {
      input = this.vertexShaderInputs[i];
      if (input.builtin.slice(0, 8) != "@builtin") {
        computeShader += `var computed_vertex_${input.name}:${input.type};
`;
      }
    }
    let usedNames = {};
    const vertexShaderDebugs = this.renderPipeline.resources.__DEBUG__.objectById;
    for (let i = 0; i < vertexShaderDebugs.length; i++) {
      if (!usedNames[vertexShaderDebugs[i].name]) {
        usedNames[vertexShaderDebugs[i].name] = true;
        computeShader += this.writeVertexShader(vertexShaderDebugs[i]);
      }
    }
    if (XGPU.showVertexDebuggerShader) {
      console.log("------------- VERTEX DEBUGGER SHADER --------------");
      console.log(computeShader);
      console.log("---------------------------------------------------");
    }
    return computeShader;
  }
  writeVertexShader(debugObject) {
    const { vertexId, instanceId, name } = debugObject;
    let mainCode = `
        ${this.vertexIdName} = ${vertexId};
        ${this.instanceIdName} = ${instanceId};

        `;
    let input;
    for (let i = 0; i < this.vertexShaderInputs.length; i++) {
      input = this.vertexShaderInputs[i];
      if (input.builtin.slice(0, 8) != "@builtin") {
        mainCode += `computed_vertex_${input.name} = ${this.bufferNameByAttributeName[input.name]}[${this.vertexIdName}+index].${input.name};
`;
      }
    }
    const searchAndReplace = (shaderCode, wordToReplace, replacement) => {
      const regex = new RegExp(`(?<=[^\\w.])\\b${wordToReplace}\\b`, "g");
      return shaderCode.replace(regex, replacement);
    };
    let attributeNames = [];
    let vertexShaderText = this.renderPipeline.resources.vertexShader.debugVersion;
    for (let i = 0; i < this.vertexShaderInputs.length; i++) {
      input = this.vertexShaderInputs[i];
      if (input.builtin.slice(0, 8) != "@builtin") {
        attributeNames[this.fieldIndexByName[input.name]] = input.name;
        vertexShaderText = searchAndReplace(vertexShaderText, input.name, "computed_vertex_" + input.name);
      }
    }
    const lines = vertexShaderText.split("\n");
    const chars = "abcdefghijklmnopqrstuvwxyz/";
    const isChars = {};
    for (let i = 0; i < chars.length; i++) {
      isChars[chars[i]] = true;
      isChars[chars[i].toUpperCase()] = true;
    }
    const getFirstCharId = (line) => {
      for (let i = 0; i < line.length; i++) {
        if (isChars[line[i]])
          return i;
      }
      return line.length - 1;
    };
    for (let i = 0; i < lines.length; i++) {
      lines[i] = " " + lines[i].slice(getFirstCharId(lines[i]));
    }
    vertexShaderText = lines.join("\n");
    vertexShaderText = searchAndReplace(vertexShaderText, "output.", "output_");
    let vertexResultText = searchAndReplace(vertexShaderText, "debug", "computeResult");
    function keepCurrentResourceDeclarationOnly(code, searchBase, search) {
      const lines2 = code.split("\n");
      let result = "";
      let line;
      let alphaNumeric = "abcdefghijklmnopqrstuvwxyz0123456789";
      let trimLine;
      alphaNumeric += alphaNumeric.toUpperCase();
      for (let i = 0; i < lines2.length; i++) {
        line = lines2[i];
        if (line.includes(searchBase)) {
          if (line.includes(search)) {
            const array = line.split(search);
            let bool = true;
            for (let j = 0; j < array.length; j++) {
              if (alphaNumeric.includes(array[j][0])) {
                bool = false;
                break;
              }
            }
            if (bool)
              result += line + "\n";
          }
        } else {
          trimLine = line.trim();
          if (trimLine.length != 0) {
            result += line + "\n";
          }
        }
      }
      return result;
    }
    vertexResultText = keepCurrentResourceDeclarationOnly(vertexResultText, "computeResult.", "computeResult." + debugObject.name);
    vertexResultText = this.convertLetIntoVar(vertexResultText);
    if (!this.firstPass)
      vertexResultText = this.removeVar(vertexResultText);
    mainCode += vertexResultText + "\n";
    for (let i = 0; i < this.fieldNames.length; i++) {
      if (this.fieldNewNames[i].includes(debugObject.name)) {
        mainCode += `result_out[index].${this.fieldNewNames[i]} =  computeResult.${this.fieldNewNames[i]};
`;
      }
    }
    const debugById = this.renderPipeline.resources.__DEBUG__.objectById;
    let debug;
    let alreadyDefined = {};
    let temp;
    let isMatrix4x4;
    for (let i = 0; i < debugById.length; i++) {
      debug = debugById[i];
      if (debug.name != name)
        continue;
      if (debug.isMatrix) {
        isMatrix4x4 = debug.newName.includes("_m4");
        if (isMatrix4x4)
          temp = debug.newName.split("_m4")[0];
        else
          temp = debug.newName.split("_m3")[0];
        if (!alreadyDefined[temp]) {
          alreadyDefined[temp] = true;
          mainCode = this.writeMatrixTemplate(mainCode, temp, isMatrix4x4);
        }
      } else if (debug.isArray) {
        temp = debug.newName.split("_ar")[0];
        if (!alreadyDefined[temp]) {
          alreadyDefined[temp] = true;
          mainCode = this.writeArrayTemplate(mainCode, temp, debug.len, debug.primitiveType);
        }
      }
    }
    this.firstPass = false;
    return mainCode;
  }
  writeArrayTemplate(shader, computeMatrixName, arrayLen, primitiveType) {
    let abc = "abcdefghijklmnopqrstuvwxyz0123456789";
    abc += abc.toUpperCase();
    let lines = shader.split("\n");
    let line;
    const isComplexVal = (val) => {
      for (let i = 0; i < val.length; i++) {
        if (abc.includes(val[i]))
          continue;
        else
          return true;
      }
      return false;
    };
    let tempName;
    const writeTemplate = (computeName, matrixName) => {
      let result = "";
      let nb = arrayLen;
      let isArrayMatrix = primitiveType == "mat4";
      for (let i = 0; i < nb; i++) {
        if (!isArrayMatrix)
          result += `computeResult.${computeName}_ar${i} = ${matrixName}[${i}];
`;
        else {
          result += `computeResult.${computeName}_ar${i}_m0 = ${matrixName}[${i}][0];
`;
          result += `computeResult.${computeName}_ar${i}_m1 = ${matrixName}[${i}][1];
`;
          result += `computeResult.${computeName}_ar${i}_m2 = ${matrixName}[${i}][2];
`;
          result += `computeResult.${computeName}_ar${i}_m3 = ${matrixName}[${i}][3];
`;
        }
      }
      result += "\n";
      return result;
    };
    let newLine = "";
    for (let i = 0; i < lines.length; i++) {
      line = lines[i];
      if (line.includes("computeResult." + computeMatrixName) == true) {
        newLine = "";
        let val = line.split("=")[1].split(";")[0].trim();
        let j = i;
        if (isComplexVal(val)) {
          if (line.includes(";") === false) {
            for (j = i + 1; j < lines.length; j++) {
              if (lines[j].includes(";") == false) {
                val += lines[j] + "\n";
                lines[j] = "";
              } else {
                val += lines[j].split(";")[0] + "";
                lines[j] = "";
                break;
              }
            }
          }
          tempName = "temporaryVariable_" + this.temporaryIndex++;
          if (primitiveType === "mat4")
            newLine = "let " + tempName + ":array<mat4x4<f32>," + arrayLen + "> = " + val + ";\n";
          else
            newLine = "let " + tempName + ":array<vec4<" + primitiveType + "> = " + val + ";\n";
          val = tempName;
        }
        newLine += writeTemplate(computeMatrixName, val);
        lines[i] = newLine;
        break;
      }
    }
    return lines.join("\n");
  }
  writeMatrixTemplate(shader, computeMatrixName, mat4x4 = true) {
    let abc = "abcdefghijklmnopqrstuvwxyz0123456789";
    abc += abc.toUpperCase();
    let lines = shader.split("\n");
    let line;
    const isComplexVal = (val) => {
      for (let i = 0; i < val.length; i++) {
        if (abc.includes(val[i]))
          continue;
        else
          return true;
      }
      return false;
    };
    let tempName;
    const writeTemplate = (computeName, matrixName) => {
      let result = "";
      let nb = 4;
      if (mat4x4 == false)
        nb = 3;
      for (let i = 0; i < nb; i++) {
        result += `computeResult.${computeName}_m${nb}${i} = ${matrixName}[${i}];
`;
      }
      result += "\n";
      return result;
    };
    let newLine = "";
    for (let i = 0; i < lines.length; i++) {
      line = lines[i];
      if (line.includes("computeResult." + computeMatrixName) == true) {
        newLine = "";
        let val = line.split("=")[1].split(";")[0].trim();
        let j = i;
        if (isComplexVal(val)) {
          if (line.includes(";") === false) {
            for (j = i + 1; j < lines.length; j++) {
              if (lines[j].includes(";") == false) {
                val += lines[j] + "\n";
                lines[j] = "";
              } else {
                val += lines[j].split(";")[0] + "";
                lines[j] = "";
                break;
              }
            }
          }
          tempName = "temporaryVariable_" + this.temporaryIndex++;
          if (mat4x4)
            newLine = "let " + tempName + ":mat4x4<f32> = " + val + ";\n";
          else
            newLine = "let " + tempName + ":mat3x3<f32> = " + val + ";\n";
          val = tempName;
        }
        newLine += writeTemplate(computeMatrixName, val);
        lines[i] = newLine;
        break;
      }
    }
    return lines.join("\n");
  }
  buildComputeShader() {
    this.computeShaderObj.result = this.vertexBufferIO;
    this.computeShaderObj.global_id = BuiltIns.computeInputs.globalInvocationId;
    this.computeShaderObj.computeShader = {
      constants: this.renderPipeline.vertexShader.constants.text,
      main: this.writeComputeShader()
    };
    this.initFromObject(this.computeShaderObj);
    let groups = this.bindGroups.groups;
    for (let i = 0; i < groups.length; i++)
      groups[i].mustRefreshBindgroup = true;
  }
  copyUniformsFromRenderToCompute() {
    if (!this.renderUniformBuffers)
      return;
    let ub;
    let itemNames;
    for (let i = 0; i < this.renderUniformBuffers.length; i++) {
      ub = this.renderUniformBuffers[i];
      itemNames = ub.resource.itemNames;
      for (let j = 0; j < itemNames.length; j++) {
        this.computeShaderObj[ub.name].items[itemNames[j]].set(ub.resource.items[itemNames[j]]);
      }
    }
  }
  init(renderPipeline, nbVertex) {
    if (!nbVertex)
      nbVertex = 1;
    this.config = { nbVertex };
    this.computeShaderObj = {
      bindgroups: {
        io: {}
        //computeShaders have a reserved bindgroup 'io' , dedicated to the ping-pong process 
      }
    };
    this.initRenderPipeline(renderPipeline);
    this.setupIndexBuffer();
    this.setupDataStructure();
    this.setupVertexShaderBuiltIns();
    this.setupUniformBuffers();
    this.setupVertexBuffers();
    this.setupComputeShaderVertexBufferIO();
    this.buildComputeShader();
    this.onComputeBegin = () => {
      this.copyUniformsFromRenderToCompute();
    };
  }
  createEmptyArray(len) {
    const arr = [];
    for (let i = 0; i < len; i++)
      arr[i] = 0;
    return arr;
  }
  getObjectByType(type) {
    if (type === "f32")
      return VertexAttribute.Float();
    if (type === "vec2<f32>")
      return VertexAttribute.Vec2();
    if (type === "vec3<f32>")
      return VertexAttribute.Vec3();
    if (type === "vec4<f32>")
      return VertexAttribute.Vec4();
    return null;
  }
  getNbValueByType(type) {
    if (type === "f32")
      return 1;
    if (type === "vec2<f32>")
      return 2;
    if (type === "vec3<f32>")
      return 3;
    if (type === "vec4<f32>")
      return 4;
    return 0;
  }
  getNewInstanceByType(type) {
    if (type === "f32")
      return "0.0";
    if (type === "vec2<f32>")
      return "vec2(0.0)";
    if (type === "vec3<f32>")
      return "vec3(0.0)";
    if (type === "vec4<f32>")
      return "vec4(0.0)";
    return "";
  }
}
const _RenderPipeline = class extends Pipeline {
  constructor(bgColor = { r: 0, g: 0, b: 0, a: 1 }) {
    super();
    __publicField(this, "_renderer");
    __publicField(this, "drawConfig");
    __publicField(this, "multiSampleTextureDescriptor");
    __publicField(this, "waitingMultisampleTexture", false);
    __publicField(this, "multisampleTexture");
    __publicField(this, "waitingDepthStencilTexture", false);
    __publicField(this, "depthStencilTextureDescriptor");
    __publicField(this, "_depthStencilTexture");
    __publicField(this, "renderPassTexture");
    __publicField(this, "outputColor");
    __publicField(this, "renderPassDescriptor", { colorAttachments: [] });
    __publicField(this, "vertexShaderDebuggerPipeline", null);
    __publicField(this, "gpuPipeline");
    __publicField(this, "debug", "renderPipeline");
    __publicField(this, "_clearValue", null);
    __publicField(this, "blendMode");
    __publicField(this, "rebuildingAfterDeviceLost", false);
    __publicField(this, "onRebuildStartAfterDeviceLost");
    __publicField(this, "buildingPipeline", false);
    //-------------------------------------------
    __publicField(this, "clearOpReady", false);
    __publicField(this, "rendererUseSinglePipeline", true);
    this.type = "render";
    this.drawConfig = new DrawConfig(this);
    this.vertexShader = new VertexShader();
    this.fragmentShader = new FragmentShader();
    this.description.primitive = {
      topology: "triangle-list",
      cullMode: "none",
      frontFace: "ccw"
    };
    if (bgColor !== null) {
      this.outputColor = this.createColorAttachment(bgColor);
    }
  }
  get renderer() {
    return this._renderer;
  }
  set renderer(renderer) {
    if (this._renderer != renderer) {
      this._renderer = renderer;
      if (renderer) {
        if (this.waitingMultisampleTexture) {
          this.setupMultiSampleView(this.multiSampleTextureDescriptor);
          this.waitingMultisampleTexture = false;
        }
        if (this.waitingDepthStencilTexture) {
          this.setupDepthStencilView(this.depthStencilTextureDescriptor);
          this.waitingDepthStencilTexture = false;
        }
        this.dispatchEvent(_RenderPipeline.ON_ADDED_TO_RENDERER);
      } else {
        this.dispatchEvent(_RenderPipeline.ON_REMOVED_FROM_RENDERER);
      }
    }
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
    this.bindGroups.destroy();
    if (this.multisampleTexture)
      this.multisampleTexture.destroy();
    if (this.renderPassTexture)
      this.renderPassTexture.destroyGpuResource();
    if (this.depthStencilTexture)
      this.depthStencilTexture.destroy();
    for (let z in this.description)
      this.description[z] = null;
    for (let z in this) {
      try {
        this[z].destroy();
      } catch (e) {
        try {
          this[z].destroyGpuResource();
        } catch (e2) {
        }
      }
      this[z] = null;
    }
  }
  initFromObject(descriptor) {
    this._resources = {};
    this.vertexShader = null;
    this.fragmentShader = null;
    this.gpuPipeline = null;
    this.bindGroups.destroy();
    this.bindGroups = new Bindgroups(this, "pipeline");
    descriptor = HighLevelParser.parse(descriptor, "render", this.drawConfig);
    super.initFromObject(descriptor);
    if (!descriptor.cullMode)
      this.description.primitive.cullMode = "none";
    else
      this.description.primitive.cullMode = descriptor.cullMode;
    if (!descriptor.topology)
      this.description.primitive.topology = "triangle-list";
    else {
      this.description.primitive.topology = descriptor.topology;
      if (descriptor.topology === "line-strip" || descriptor.topology === "triangle-strip") {
        if (!descriptor.stripIndexFormat) {
          throw new Error("You must define a 'stripIndexFormat' in order to use a topology 'triangle-strip' or 'line-strip'. See https://www.w3.org/TR/webgpu/#enumdef-gpuindexformat for more details");
        } else {
          this.description.primitive.stripIndexFormat = descriptor.stripIndexFormat;
        }
      }
    }
    if (!descriptor.frontFace)
      this.description.primitive.frontFace = "ccw";
    else
      this.description.primitive.frontFace = descriptor.frontFace;
    if (descriptor.indexBuffer) {
      this.drawConfig.indexBuffer = descriptor.indexBuffer;
    }
    if (this.outputColor) {
      if (descriptor.clearColor)
        this.outputColor.clearValue = descriptor.clearColor;
      else
        descriptor.clearColor = this.outputColor.clearValue;
    }
    if (descriptor.blendMode)
      this.blendMode = descriptor.blendMode;
    if (descriptor.antiAliasing)
      this.setupMultiSampleView();
    if (descriptor.useDepthTexture) {
      let depthTextureSize = 1024;
      if (descriptor.depthTextureSize)
        depthTextureSize = descriptor.depthTextureSize;
      this.setupDepthStencilView({
        size: [depthTextureSize, depthTextureSize, 1],
        format: "depth32float",
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
      });
    } else if (descriptor.depthTest)
      this.setupDepthStencilView();
    if (descriptor.bindgroups) {
      let group;
      for (let z in descriptor.bindgroups) {
        if (descriptor.bindgroups[z] instanceof Bindgroup) {
          const elements = descriptor.bindgroups[z].elements;
          const resources = [];
          for (let i = 0; i < elements.length; i++) {
            resources[i] = elements[i].resource;
          }
          descriptor.bindgroups[z].name = z;
          this.bindGroups.add(descriptor.bindgroups[z]);
        } else {
          group = new Bindgroup();
          group.name = z;
          group.initFromObject(descriptor.bindgroups[z]);
          this.bindGroups.add(group);
        }
      }
      if (descriptor.bindgroups.default) {
        if (descriptor.bindgroups.default.buffer) {
          const attributes = descriptor.bindgroups.default.buffer.attributes;
          for (let z in attributes) {
            if (descriptor[z])
              descriptor[z] = attributes[z];
          }
        }
      }
    }
    const createArrayOfObjects = (obj) => {
      const result = [];
      let o;
      for (let z in obj) {
        o = obj[z];
        result.push({ name: z, ...o });
      }
      return result;
    };
    this.vertexShader = new VertexShader();
    if (typeof descriptor.vertexShader === "string") {
      this.vertexShader.main.text = descriptor.vertexShader;
    } else {
      this.vertexShader.inputs = createArrayOfObjects(descriptor.vertexShader.inputs);
      this.vertexShader.outputs = createArrayOfObjects(descriptor.vertexShader.outputs);
      if (descriptor.vertexShader.constants)
        this.vertexShader.constants.text = descriptor.vertexShader.constants;
      this.vertexShader.main.text = descriptor.vertexShader.main;
    }
    if (descriptor.fragmentShader) {
      this.fragmentShader = new FragmentShader();
      if (typeof descriptor.fragmentShader === "string") {
        this.fragmentShader.main.text = descriptor.fragmentShader;
      } else {
        this.fragmentShader.inputs = createArrayOfObjects(descriptor.fragmentShader.inputs);
        this.fragmentShader.outputs = createArrayOfObjects(descriptor.fragmentShader.outputs);
        if (descriptor.fragmentShader.constants)
          this.fragmentShader.constants.text = descriptor.fragmentShader.constants;
        this.fragmentShader.main.text = descriptor.fragmentShader.main;
      }
    }
    return descriptor;
  }
  get clearValue() {
    return this._clearValue;
  }
  createColorAttachment(rgba, view = void 0) {
    const colorAttachment = {
      view,
      clearValue: rgba,
      loadOp: "clear",
      storeOp: "store"
    };
    this.renderPassDescriptor.colorAttachments.push(colorAttachment);
    return colorAttachment;
  }
  //-----------------
  setupDraw(o) {
    if (o.instanceCount !== void 0)
      this.drawConfig.instanceCount = o.instanceCount;
    if (o.vertexCount !== void 0)
      this.drawConfig.vertexCount = o.vertexCount;
    if (o.firstVertexId !== void 0)
      this.drawConfig.firstVertexId = o.firstVertexId;
    if (o.firstInstanceId !== void 0)
      this.drawConfig.firstInstanceId = o.firstInstanceId;
    if (o.indexBuffer !== void 0)
      this.drawConfig.indexBuffer = o.indexBuffer;
    if (o.baseVertex !== void 0)
      this.drawConfig.baseVertex = o.baseVertex;
  }
  get debugVertexCount() {
    return this.resources.debugVertexCount;
  }
  set debugVertexCount(n) {
    this.resources.debugVertexCount = n;
  }
  get vertexCount() {
    return this.drawConfig.vertexCount;
  }
  set vertexCount(n) {
    this.drawConfig.vertexCount = n;
  }
  get instanceCount() {
    return this.drawConfig.instanceCount;
  }
  set instanceCount(n) {
    this.drawConfig.instanceCount = n;
  }
  get firstVertexId() {
    return this.drawConfig.firstVertexId;
  }
  set firstVertexId(n) {
    this.drawConfig.firstVertexId = n;
  }
  get firstInstanceId() {
    return this.drawConfig.firstInstanceId;
  }
  set firstInstanceId(n) {
    this.drawConfig.firstInstanceId = n;
  }
  get baseVertex() {
    return this.drawConfig.baseVertex;
  }
  set baseVertex(n) {
    this.drawConfig.baseVertex = n;
  }
  //------------------------------------------------
  setupMultiSampleView(descriptor) {
    if (!this.renderer) {
      this.waitingMultisampleTexture = true;
      this.multiSampleTextureDescriptor = descriptor;
      return;
    }
    if (this.multisampleTexture)
      this.multisampleTexture.destroy();
    if (!descriptor)
      descriptor = {};
    if (!descriptor.size)
      descriptor.size = [this.renderer.width, this.renderer.height];
    this.multisampleTexture = new MultiSampleTexture(descriptor);
    this.description.multisample = {
      count: this.multisampleTexture.description.count
    };
    if (this._depthStencilTexture) {
      this.renderPassDescriptor.description.sampleCount = 4;
      this._depthStencilTexture.create();
    }
  }
  //---------------------------
  setupDepthStencilView(descriptor, depthStencilDescription, depthStencilAttachmentOptions) {
    if (!this.renderer) {
      this.waitingDepthStencilTexture = true;
      this.depthStencilTextureDescriptor = descriptor;
      return;
    }
    if (!depthStencilAttachmentOptions)
      depthStencilAttachmentOptions = {};
    if (!descriptor)
      descriptor = {};
    if (!descriptor.size)
      descriptor.size = [this.renderer.width, this.renderer.height];
    if (this.multisampleTexture)
      descriptor.sampleCount = 4;
    else
      descriptor.sampleCount = 1;
    if (this._depthStencilTexture)
      this._depthStencilTexture.destroy();
    this._depthStencilTexture = new DepthStencilTexture(descriptor, depthStencilDescription, depthStencilAttachmentOptions);
    this.renderPassDescriptor.depthStencilAttachment = this.depthStencilTexture.attachment;
    this.description.depthStencil = this.depthStencilTexture.description;
  }
  //----------------------------------------
  get renderPassView() {
    return this.renderPass.view;
  }
  get renderPass() {
    if (!this.renderPassTexture) {
      this.renderPassTexture = new RenderPassTexture(this);
    }
    return this.renderPassTexture;
  }
  get useRenderPassTexture() {
    return !!this.renderPassTexture;
  }
  cleanInputs() {
    const _inputs = [];
    const t = this.vertexShader.inputs;
    for (let z in t)
      _inputs.push({ name: z, ...t[z] });
    this.vertexShader.inputs = _inputs;
    return _inputs;
  }
  getFragmentShaderColorOptions() {
    const o = {
      format: XGPU.getPreferredCanvasFormat()
    };
    if (this.blendMode)
      o.blend = this.blendMode;
    return o;
  }
  clearAfterDeviceLostAndRebuild() {
    if (this.onRebuildStartAfterDeviceLost)
      this.onRebuildStartAfterDeviceLost();
    this.gpuPipeline = null;
    if (this.drawConfig.indexBuffer)
      this.drawConfig.indexBuffer.createGpuResource();
    if (this.multisampleTexture)
      this.multisampleTexture.resize(this.renderer.width, this.renderer.height);
    if (this.depthStencilTexture)
      this.depthStencilTexture.resize(this.renderer.width, this.renderer.height);
    if (this.renderPassTexture)
      this.renderPassTexture.resize(this.renderer.width, this.renderer.height);
    this.rebuildingAfterDeviceLost = true;
    super.clearAfterDeviceLostAndRebuild();
  }
  buildGpuPipeline() {
    if (this.gpuPipeline || this.buildingPipeline)
      return this.gpuPipeline;
    this.buildingPipeline = true;
    this.bindGroups.handleRenderPipelineResourceIOs();
    this.initPipelineResources(this);
    const o = this.bindGroups.build();
    if (o.description.layout)
      this.description.layout = o.description.layout;
    else
      this.description.layout = "auto";
    if (!this.rebuildingAfterDeviceLost) {
      const buffers = o.buffers;
      this.description.vertex = o.description.vertex;
      const vertexInput = new ShaderStruct("Input", this.cleanInputs());
      if (buffers.length) {
        let buffer;
        let arrays;
        let builtin = 0;
        for (let i = 0; i < buffers.length; i++) {
          buffer = buffers[i];
          arrays = buffer.vertexArrays;
          for (let j = 0; j < arrays.length; j++) {
            vertexInput.addProperty({ name: arrays[j].name, type: arrays[j].varType, builtin: "@location(" + builtin + ")" });
            builtin++;
          }
        }
      }
      const vertexShader = this.vertexShader.build(this, vertexInput);
      let fragmentShader;
      if (this.fragmentShader) {
        fragmentShader = this.fragmentShader.build(this, vertexShader.output.getInputFromOutput());
      }
      this.description.vertex = {
        code: vertexShader.code,
        entryPoint: "main",
        buffers: o.description.vertex.buffers
      };
      if (this.fragmentShader) {
        this.description.fragment = {
          code: fragmentShader.code,
          entryPoint: "main",
          targets: [
            this.getFragmentShaderColorOptions()
          ]
        };
      }
    }
    this.description.vertex.module = XGPU.device.createShaderModule({ code: this.description.vertex.code });
    if (this.description.fragment) {
      this.description.fragment.module = XGPU.device.createShaderModule({ code: this.description.fragment.code });
    }
    this.rebuildingAfterDeviceLost = false;
    this.gpuPipeline = XGPU.createRenderPipeline(this.description);
    if (this.resources.__DEBUG__) {
      this.vertexShaderDebuggerPipeline = new VertexShaderDebuggerPipeline();
      this.vertexShaderDebuggerPipeline.init(this, this.debugVertexCount);
      this.vertexShaderDebuggerPipeline.onLog = (o2) => {
        this.dispatchEvent(_RenderPipeline.ON_LOG, o2);
      };
    }
    this.buildingPipeline = false;
    this.dispatchEvent(_RenderPipeline.ON_GPU_PIPELINE_BUILT);
    return this.gpuPipeline;
  }
  beginRenderPass(commandEncoder, outputView, drawCallId, usingRenderPassTexture = false) {
    if (!this.resourceDefined)
      return null;
    if (this.vertexShaderDebuggerPipeline)
      this.vertexShaderDebuggerPipeline.nextFrame();
    this.dispatchEvent(_RenderPipeline.ON_DRAW_BEGIN);
    if (usingRenderPassTexture) {
      this.renderPassDescriptor.colorAttachments[0].loadOp = "clear";
    } else {
      if (this.renderPassDescriptor.colorAttachments[0]) {
        this._clearValue = this.renderPassDescriptor.colorAttachments[0].clearValue;
      }
      let rendererUseSinglePipeline = this.renderer.renderPipelines.length == 1 && this.pipelineCount === 1;
      if (this.rendererUseSinglePipeline !== rendererUseSinglePipeline) {
        this.clearOpReady = false;
        this.rendererUseSinglePipeline = rendererUseSinglePipeline;
      }
      if (this.clearOpReady === false && this.renderPassDescriptor.colorAttachments[0] || this.pipelineCount > 1) {
        this.clearOpReady = true;
        if (rendererUseSinglePipeline && this.pipelineCount == 1)
          this.renderPassDescriptor.colorAttachments[0].loadOp = "clear";
        else {
          if (this.pipelineCount === 1) {
            if (this.renderer.renderPipelines[0] === this)
              this.renderPassDescriptor.colorAttachments[0].loadOp = "clear";
            else
              this.renderPassDescriptor.colorAttachments[0].loadOp = "load";
          } else {
            this.renderPassDescriptor.colorAttachments[0].loadOp = "clear";
            if (drawCallId === 0)
              ;
            else
              this.renderPassDescriptor.colorAttachments[0].loadOp = "load";
          }
        }
      }
    }
    if (!this.gpuPipeline)
      this.buildGpuPipeline();
    if (outputView && this.outputColor)
      this.handleOutputColor(outputView);
    return commandEncoder.beginRenderPass(this.renderPassDescriptor);
  }
  handleOutputColor(outputView) {
    if (this.outputColor) {
      if (this.multisampleTexture) {
        if (!this.multisampleTexture.view)
          this.multisampleTexture.create();
        this.outputColor.view = this.multisampleTexture.view;
        if (this.multisampleTexture.resolveTarget)
          this.outputColor.resolveTarget = this.multisampleTexture.resolveTarget;
        else
          this.outputColor.resolveTarget = outputView;
      } else {
        this.outputColor.view = outputView;
      }
    }
  }
  //----------------------------------------------------------------------
  update() {
    if (!this.gpuPipeline)
      return;
    if (this.renderPassTexture)
      this.renderPassTexture.update();
    this.bindGroups.update();
  }
  draw(renderPass) {
    if (!this.resourceDefined)
      return;
    renderPass.setPipeline(this.gpuPipeline);
    this.bindGroups.apply(renderPass);
  }
  //-------------------------------
  end(commandEncoder, renderPass) {
    if (!this.resourceDefined)
      return;
    renderPass.end();
    const types = this.bindGroups.resources.types;
    if (types) {
      if (!types.textureArrays) {
        let textureArrays = [];
        if (types.imageTextureArrays)
          textureArrays = textureArrays.concat(types.imageTextureArrays);
        if (types.cubeMapTextureArrays)
          textureArrays = textureArrays.concat(types.cubeMapTextureArrays);
        if (types.cubeMapTexture)
          textureArrays = textureArrays.concat(types.cubeMapTexture);
        types.textureArrays = textureArrays;
      }
      for (let i = 0; i < types.textureArrays.length; i++) {
        types.textureArrays[i].resource.updateInnerGpuTextures(commandEncoder);
      }
    }
    const { width, height } = this.renderer;
    if (this.renderer.resized) {
      if (this.multisampleTexture) {
        this.multisampleTexture.resize(width, height);
      }
      if (this.depthStencilTexture) {
        this.depthStencilTexture.resize(width, height);
      }
      if (this.renderPassTexture) {
        this.renderPassTexture.resize(width, height);
      }
    }
    if (this.renderPassTexture && this.renderPassTexture.mustUseCopyTextureToTexture) {
      if (!this.renderPassTexture.gpuResource)
        this.renderPassTexture.createGpuResource();
      commandEncoder.copyTextureToTexture({ texture: this.renderer.texture }, { texture: this.renderPassTexture.gpuResource }, [width, height]);
    }
    if (this.multisampleTexture)
      this.multisampleTexture.update();
    if (this.depthStencilTexture)
      this.depthStencilTexture.update();
    if (this.renderPassTexture)
      this.renderPassTexture.update();
    this.dispatchEvent(_RenderPipeline.ON_DRAW_END);
  }
  get resourceDefined() {
    const bool = !!this.bindGroups.resources.all;
    if (!bool) {
      if (this.drawConfig.vertexCount > 0) {
        if (this.vertexShader.main.text != "" && this.fragmentShader.main.text != "") {
          return true;
        }
      }
      return false;
    }
    return true;
  }
  get pipeline() {
    return this.gpuPipeline;
  }
  get cullMode() {
    return this.description.primitive.cullMode;
  }
  set cullMode(s) {
    this.description.primitive.cullMode = s;
  }
  get topology() {
    return this.description.primitive.topology;
  }
  set topology(s) {
    this.description.primitive.topology = s;
  }
  get frontFace() {
    return this.description.primitive.frontFace;
  }
  set frontFace(s) {
    this.description.primitive.frontFace = s;
  }
  get stripIndexFormat() {
    return this.description.primitive.stripIndexFormat;
  }
  set stripIndexFormat(s) {
    this.description.primitive.stripIndexFormat = s;
  }
};
let RenderPipeline = _RenderPipeline;
__publicField(RenderPipeline, "ON_ADDED_TO_RENDERER", "ON_ADDED_TO_RENDERER");
__publicField(RenderPipeline, "ON_REMOVED_FROM_RENDERER", "ON_REMOVED_FROM_RENDERER");
__publicField(RenderPipeline, "ON_DRAW_BEGIN", "ON_DRAW_BEGIN");
__publicField(RenderPipeline, "ON_DRAW_END", "ON_DRAW_END");
__publicField(RenderPipeline, "ON_DRAW", "ON_DRAW");
__publicField(RenderPipeline, "ON_GPU_PIPELINE_BUILT", "ON_GPU_PIPELINE_BUILT");
__publicField(RenderPipeline, "ON_LOG", "ON_LOG");
const _GPURenderer = class extends EventDispatcher {
  constructor() {
    super();
    __publicField(this, "domElement");
    __publicField(this, "canvasView");
    __publicField(this, "ctx");
    __publicField(this, "currentWidth");
    __publicField(this, "currentHeight");
    __publicField(this, "dimensionChanged", false);
    __publicField(this, "deviceId");
    __publicField(this, "frameId", 0);
    __publicField(this, "nbColorAttachment", 0);
    __publicField(this, "renderPipelines", []);
    __publicField(this, "texturedQuadPipeline");
    __publicField(this, "gpuCtxConfiguration");
    __publicField(this, "commandEncoder", null);
    if (!_GPURenderer.texturedQuadPipeline) {
      _GPURenderer.texturedQuadPipeline = new RenderPipeline();
      _GPURenderer.texturedQuadPipeline.initFromObject({
        vertexCount: 6,
        vertexId: BuiltIns.vertexInputs.vertexIndex,
        image: new ImageTexture({ source: null }),
        imgSampler: new TextureSampler(),
        uv: BuiltIns.vertexOutputs.Vec2,
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
      });
    }
    this.texturedQuadPipeline = _GPURenderer.texturedQuadPipeline;
  }
  resize(w, h) {
    this.domElement.width = w;
    this.domElement.height = h;
    this.dimensionChanged = true;
  }
  destroy() {
    for (let i = 0; i < this.renderPipelines.length; i++) {
      this.renderPipelines[i].destroy();
    }
    this.renderPipelines = [];
    for (let z in this) {
      this[z] = null;
    }
  }
  initCanvas(canvas, alphaMode = "opaque") {
    this.domElement = canvas;
    return new Promise(async (resolve, error) => {
      await XGPU.init();
      this.deviceId = XGPU.deviceId;
      if (this.domElement == null)
        return;
      this.currentWidth = this.domElement.width;
      this.currentHeight = this.domElement.height;
      try {
        this.gpuCtxConfiguration = {
          device: XGPU.device,
          format: XGPU.getPreferredCanvasFormat(),
          alphaMode,
          colorSpace: "srgb",
          usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING
        };
        this.ctx = this.domElement.getContext("webgpu");
        this.ctx.configure(this.gpuCtxConfiguration);
        resolve(canvas);
      } catch (e) {
        error(e);
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
  addPipeline(pipeline, offset = null) {
    pipeline.renderer = this;
    if (pipeline.renderPassDescriptor.colorAttachments[0])
      this.nbColorAttachment++;
    if (offset === null)
      this.renderPipelines.push(pipeline);
    else
      this.renderPipelines.splice(offset, 0, pipeline);
    return pipeline;
  }
  removePipeline(pipeline) {
    if (pipeline.renderPassDescriptor.colorAttachments[0])
      this.nbColorAttachment--;
    const id = this.renderPipelines.indexOf(pipeline);
    if (id != -1) {
      this.renderPipelines.splice(id, 1);
    }
    pipeline.renderer = null;
    return pipeline;
  }
  get nbPipeline() {
    return this.renderPipelines.length;
  }
  get useSinglePipeline() {
    return this.nbColorAttachment === 1;
  }
  configure(textureUsage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING, alphaMode = "opaque") {
    this.gpuCtxConfiguration = {
      device: XGPU.device,
      format: XGPU.getPreferredCanvasFormat(),
      alphaMode,
      colorSpace: "srgb",
      usage: textureUsage
    };
    this.ctx.configure(this.gpuCtxConfiguration);
  }
  async update() {
    if (!this.ctx)
      return;
    if (!XGPU.ready || this.renderPipelines.length === 0 || this.deviceId === void 0)
      return;
    if (XGPU.deviceId != this.deviceId) {
      this.ctx.configure({ ...this.gpuCtxConfiguration, device: XGPU.device });
    }
    if (this.canvas.width != this.currentWidth || this.canvas.height != this.currentHeight) {
      this.currentWidth = this.canvas.width;
      this.currentHeight = this.canvas.height;
      this.dimensionChanged = true;
    }
    let deviceChanged = XGPU.deviceId != this.deviceId;
    if (deviceChanged) {
      this.deviceId = XGPU.deviceId;
      for (let i = 0; i < this.renderPipelines.length; i++) {
        this.renderPipelines[i].clearAfterDeviceLostAndRebuild();
      }
    }
    this.commandEncoder = XGPU.device.createCommandEncoder();
    let pipeline, renderPass;
    for (let i = 0; i < this.renderPipelines.length; i++) {
      pipeline = this.renderPipelines[i];
      pipeline.update();
      renderPass = pipeline.beginRenderPass(this.commandEncoder, this.view, 0);
      for (let j = 0; j < pipeline.pipelineCount; j++) {
        pipeline.dispatchEvent(RenderPipeline.ON_DRAW, j);
        pipeline.draw(renderPass);
      }
      pipeline.end(this.commandEncoder, renderPass);
    }
    const commandBuffer = this.commandEncoder.finish();
    this.commandEncoder = null;
    XGPU.device.queue.submit([commandBuffer]);
    this.dimensionChanged = false;
    this.dispatchEvent(_GPURenderer.ON_DRAW_END);
    this.frameId++;
  }
};
let GPURenderer = _GPURenderer;
__publicField(GPURenderer, "ON_DRAW_END", "ON_DRAW_END");
__publicField(GPURenderer, "texturedQuadPipeline");
class TextureRenderer {
  constructor(useTextureInComputeShader = false) {
    __publicField(this, "textureObj");
    __publicField(this, "dimensionChanged", false);
    __publicField(this, "currentWidth");
    __publicField(this, "currentHeight");
    __publicField(this, "renderPipelines", []);
    __publicField(this, "useTextureInComputeShader");
    __publicField(this, "frameId", -1);
    __publicField(this, "deviceId");
    //public get firstPipeline(): RenderPipeline { return this.renderPipelines[0]; }
    __publicField(this, "nbColorAttachment", 0);
    __publicField(this, "commandEncoder", null);
    this.useTextureInComputeShader = useTextureInComputeShader;
  }
  init(w, h, usage, sampleCount) {
    this.currentWidth = w;
    this.currentHeight = h;
    return new Promise((onResolve) => {
      XGPU.init().then(() => {
        this.deviceId = XGPU.deviceId;
        if (!usage)
          usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC;
        let format = "bgra8unorm";
        if (this.useTextureInComputeShader) {
          format = "rgba8unorm";
          usage += GPUTextureUsage.STORAGE_BINDING;
        }
        this.textureObj = new Texture({
          size: [w, h],
          format,
          usage,
          sampleCount
        });
        this.textureObj.create();
        onResolve(this);
      });
    });
  }
  addPipeline(pipeline, offset = null) {
    pipeline.renderer = this;
    if (pipeline.renderPassDescriptor.colorAttachments[0])
      this.nbColorAttachment++;
    if (offset === null)
      this.renderPipelines.push(pipeline);
    else
      this.renderPipelines.splice(offset, 0, pipeline);
    return pipeline;
  }
  removePipeline(pipeline) {
    if (pipeline.renderPassDescriptor.colorAttachments[0])
      this.nbColorAttachment--;
    const id = this.renderPipelines.indexOf(pipeline);
    if (id != -1) {
      this.renderPipelines.splice(id, 1);
    }
    pipeline.renderer = null;
    return pipeline;
  }
  //public get nbPipeline(): number { return this.renderPipelines.length }
  //public get useSinglePipeline(): boolean { return this.nbColorAttachment === 1 }
  resize(w, h) {
    this.currentWidth = w;
    this.currentHeight = h;
    this.dimensionChanged = true;
    if (this.textureObj)
      this.textureObj.resize(w, h);
  }
  destroy() {
    for (let i = 0; i < this.renderPipelines.length; i++) {
      this.renderPipelines[i].destroy();
    }
    this.renderPipelines = [];
    for (let z in this) {
      this[z] = null;
    }
  }
  async update() {
    if (!XGPU.ready || this.renderPipelines.length === 0 || this.deviceId === void 0)
      return;
    let deviceChanged = XGPU.deviceId != this.deviceId;
    if (deviceChanged) {
      if (this.textureObj)
        this.textureObj.create();
      this.deviceId = XGPU.deviceId;
      for (let i = 0; i < this.renderPipelines.length; i++) {
        this.renderPipelines[i].clearAfterDeviceLostAndRebuild();
      }
    }
    this.commandEncoder = XGPU.device.createCommandEncoder();
    let pipeline, renderPass;
    for (let i = 0; i < this.renderPipelines.length; i++) {
      pipeline = this.renderPipelines[i];
      pipeline.update();
      for (let j = 0; j < pipeline.pipelineCount; j++) {
        renderPass = pipeline.beginRenderPass(this.commandEncoder, this.view, j);
        pipeline.dispatchEvent(RenderPipeline.ON_DRAW, j);
        pipeline.draw(renderPass);
        pipeline.end(this.commandEncoder, renderPass);
      }
    }
    const commandBuffer = this.commandEncoder.finish();
    this.commandEncoder = null;
    XGPU.device.queue.submit([commandBuffer]);
    this.dimensionChanged = false;
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
class BlendMode {
  constructor() {
    __publicField(this, "color", { operation: "add", srcFactor: "one", dstFactor: "zero" });
    __publicField(this, "alpha", { operation: "add", srcFactor: "one", dstFactor: "zero" });
  }
}
class AlphaBlendMode extends BlendMode {
  constructor() {
    super();
    this.color.operation = "add";
    this.color.srcFactor = "src-alpha";
    this.color.dstFactor = "one-minus-src-alpha";
    this.alpha.operation = "add";
    this.alpha.srcFactor = "src-alpha";
    this.alpha.dstFactor = "one-minus-src-alpha";
  }
}
class PipelinePlugin {
  constructor(target, required) {
    __publicField(this, "target");
    __publicField(this, "requiredNames");
    __publicField(this, "bindgroupResources", {});
    __publicField(this, "vertexShader", {});
    __publicField(this, "fragmentShader", {});
    this.target = target;
    if (required) {
      this.requiredNames = {};
      for (let z in required) {
        this.requiredNames[z] = target.getResourceName(required[z]);
      }
    }
  }
  apply(vertexShaderNode = null, fragmentShaderNode = null) {
    let plugins;
    for (let z in this.target.resources.bindgroups) {
      plugins = this.target.resources.bindgroups[z];
      break;
    }
    for (let z in this.bindgroupResources)
      plugins[z] = this.bindgroupResources[z];
    let vs = this.target.resources.vertexShader;
    if (typeof vs === "string")
      vs = { main: vs };
    if (this.vertexShader.outputs) {
      if (!vs.outputs)
        vs.outputs = {};
      for (let z in this.vertexShader.outputs) {
        vs.outputs[z] = this.vertexShader.outputs[z];
      }
    }
    if (this.vertexShader.inputs) {
      if (!vs.inputs)
        vs.inputs = {};
      for (let z in this.vertexShader.inputs) {
        vs.inputs[z] = this.vertexShader.inputs[z];
      }
    }
    if (this.vertexShader.constants) {
      if (!vs.constants)
        vs.constants = "";
      vs.constants += this.vertexShader.constants;
    }
    if (this.vertexShader.main) {
      let main;
      if (typeof this.vertexShader.main === "string")
        main = this.vertexShader.main;
      else
        main = this.vertexShader.main.join("\n");
      if (vertexShaderNode)
        vertexShaderNode.text = main;
      else {
        if (!vs.main)
          vs.main = "";
        vs.main += main;
      }
    }
    this.target.resources.vertexShader = vs;
    let fs = this.target.resources.fragmentShader;
    if (typeof fs === "string")
      fs = { main: fs };
    if (this.fragmentShader.outputs) {
      if (!fs.outputs)
        fs.outputs = {};
      for (let z in this.fragmentShader.outputs) {
        fs.outputs[z] = this.fragmentShader.outputs[z];
      }
    }
    if (this.fragmentShader.inputs) {
      if (!fs.inputs)
        fs.inputs = {};
      for (let z in this.fragmentShader.inputs) {
        fs.inputs[z] = this.fragmentShader.inputs[z];
      }
    }
    if (this.fragmentShader.constants) {
      if (!fs.constants)
        fs.constants = "";
      fs.constants += this.fragmentShader.constants;
    }
    if (this.fragmentShader.main) {
      let main;
      if (typeof this.fragmentShader.main === "string")
        main = this.fragmentShader.main;
      else
        main = this.fragmentShader.main.join("\n");
      if (fragmentShaderNode)
        fragmentShaderNode.text = main;
      else {
        if (!fs.main)
          fs.main = "";
        fs.main += main;
      }
    }
    this.target.resources.fragmentShader = fs;
    this.target.initFromObject(this.target.resources);
    return this;
  }
}
class ShaderType {
}
__publicField(ShaderType, "Float", { type: "f32" });
__publicField(ShaderType, "Vec2", { type: "vec2<f32>" });
__publicField(ShaderType, "Vec3", { type: "vec3<f32>" });
__publicField(ShaderType, "Vec4", { type: "vec4<f32>" });
__publicField(ShaderType, "Int", { type: "i32" });
__publicField(ShaderType, "IVec2", { type: "vec2<i32>" });
__publicField(ShaderType, "IVec3", { type: "vec3<i32>" });
__publicField(ShaderType, "IVec4", { type: "vec4<i32>" });
__publicField(ShaderType, "Uint", { type: "u32" });
__publicField(ShaderType, "UVec2", { type: "vec2<u32>" });
__publicField(ShaderType, "UVec3", { type: "vec3<u32>" });
__publicField(ShaderType, "UVec4", { type: "vec4<u32>" });
class FloatBuffer extends VertexAttribute {
  constructor(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    super("", "float32", offset);
    if (typeof datas != "number")
      this.datas = datas;
  }
}
class Vec2Buffer extends VertexAttribute {
  constructor(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    super("", "float32x2", offset);
    if (typeof datas != "number") {
      this.datas = datas;
    }
  }
}
class Vec3Buffer extends VertexAttribute {
  constructor(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    super("", "float32x3", offset);
    if (typeof datas != "number") {
      this.datas = datas;
    }
  }
}
class Vec4Buffer extends VertexAttribute {
  constructor(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    super("", "float32x4", offset);
    if (typeof datas != "number") {
      this.datas = datas;
    }
  }
}
class IntBuffer extends VertexAttribute {
  constructor(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    super("", "sint32", offset);
    if (typeof datas != "number")
      this.datas = datas;
  }
}
class IVec2Buffer extends VertexAttribute {
  constructor(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    super("", "sint32x2", offset);
    if (typeof datas != "number")
      this.datas = datas;
  }
}
class IVec3Buffer extends VertexAttribute {
  constructor(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    super("", "sint32x3", offset);
    if (typeof datas != "number")
      this.datas = datas;
  }
}
class IVec4Buffer extends VertexAttribute {
  constructor(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    super("", "sint32x4", offset);
    if (typeof datas != "number")
      this.datas = datas;
  }
}
class UintBuffer extends VertexAttribute {
  constructor(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    super("", "uint32", offset);
    if (typeof datas != "number")
      this.datas = datas;
  }
}
class UVec2Buffer extends VertexAttribute {
  constructor(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    super("", "uint32x2", offset);
    if (typeof datas != "number")
      this.datas = datas;
  }
}
class UVec3Buffer extends VertexAttribute {
  constructor(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    super("", "uint32x3", offset);
    if (typeof datas != "number")
      this.datas = datas;
  }
}
class UVec4Buffer extends VertexAttribute {
  constructor(datas, offset) {
    if (datas != void 0 && offset === void 0) {
      if (typeof datas === "number") {
        offset = datas;
        datas = void 0;
      }
    }
    super("", "uint32x4", offset);
    if (typeof datas != "number")
      this.datas = datas;
  }
}
export {
  AlphaBlendMode,
  Bindgroup,
  Bindgroups,
  BlendMode,
  BuiltIns,
  ComputePipeline,
  ComputeShader,
  CubeMapTexture,
  DepthStencilTexture,
  DepthTextureArray,
  EventDispatcher,
  Float,
  FloatBuffer,
  FragmentShader,
  GPURenderer,
  GPUType,
  HighLevelParser,
  IVec2,
  IVec2Buffer,
  IVec3,
  IVec3Buffer,
  IVec4,
  IVec4Array,
  IVec4Buffer,
  ImageTexture,
  ImageTextureArray,
  ImageTextureIO,
  IndexBuffer,
  Int,
  IntBuffer,
  Matrix3x3,
  Matrix4x4,
  Matrix4x4Array,
  MultiSampleTexture,
  Pipeline,
  PipelinePlugin,
  PrimitiveFloatUniform,
  PrimitiveIntUniform,
  PrimitiveUintUniform,
  RenderPassTexture,
  RenderPipeline,
  ShaderNode,
  ShaderStage,
  ShaderStruct,
  ShaderType,
  Texture,
  TextureRenderer,
  TextureSampler,
  UVec2,
  UVec2Buffer,
  UVec3,
  UVec3Buffer,
  UVec4,
  UVec4Array,
  UVec4Buffer,
  Uint,
  UintBuffer,
  UniformBuffer,
  UniformGroup,
  UniformGroupArray,
  Vec2,
  Vec2Buffer,
  Vec3,
  Vec3Buffer,
  Vec4,
  Vec4Array,
  Vec4Buffer,
  VertexAttribute,
  VertexBuffer,
  VertexBufferIO,
  VertexShader,
  VertexShaderDebuggerPipeline,
  VideoTexture,
  XGPU
};
