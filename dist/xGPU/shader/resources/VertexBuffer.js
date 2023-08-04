// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { XGPU } from "../../XGPU";
import { GPUType } from "../../GPUType";
import { ShaderStruct } from "../shaderParts/ShaderStruct";
import { VertexAttribute } from "./VertexAttribute";
export class VertexBuffer {
    bufferId; //the id used in renderPass.setVertexBuffer
    io = 0;
    resourceIO = null;
    mustBeTransfered = false;
    vertexArrays = [];
    attributes = {};
    gpuResource;
    descriptor;
    _nbComponent = 0;
    _datas;
    nbComponentData;
    attributeChanged = false;
    constructor(attributes, descriptor) {
        //console.log("VERTEX BUFFER ", attributes)
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
            //console.log("=> ", name, offset)
            if (!this.attributes[name]) {
                attribute = this.createArray(name, buffer.type, offset);
                //console.log(name, offset)
                if (datas)
                    attribute.datas = datas;
            }
            else {
                //console.log(this.attributes[name])
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
        //const data = new Float32Array(this.datas.length);
        datas.set(this.datas);
        vb.datas = datas;
        //console.log("clone")
        return vb;
    }
    gpuBufferIOs;
    gpuBufferIO_index = 1;
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
    get length() { return this.vertexArrays.length; }
    get nbComponent() { return this._nbComponent; }
    get nbVertex() {
        if (!this.datas)
            return 0;
        if (this.nbComponentData)
            return this.datas.length / this.nbComponentData;
        return this.datas.length / this._nbComponent;
    }
    get datas() { return this._datas; }
    set datas(f) {
        this._datas = f;
        this.mustBeTransfered = true;
        //console.warn("VB set datas = ", f);
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
    _byteCount = 0;
    createArray(name, dataType, offset) {
        //console.log("new VertexAttribute ", name, dataType, offset)
        if (this.attributes[name]) {
            return this.attributes[name];
        }
        const v = this.attributes[name] = new VertexAttribute(name, dataType, offset);
        v.vertexBuffer = this;
        const nbCompo = v.nbComponent;
        const _offset = v.dataOffset === undefined ? 0 : v.dataOffset;
        this._nbComponent += nbCompo;
        if (v.dataOffset === undefined)
            this._byteCount += nbCompo * new GPUType(v.varType).byteValue;
        else
            this._byteCount = Math.max(this._byteCount, (_offset + v.nbComponent) * new GPUType(v.varType).byteValue);
        //console.log("byteCount = ", v.nbComponent + " * " + new GPUType(v.varType).byteValue)
        //console.log("createArray ", name, this._byteCount, (_offset + v.nbComponent) * new GPUType(v.varType).byteValue);
        this.vertexArrays.push(v);
        return v;
    }
    getAttributeByName(name) {
        return this.attributes[name];
    }
    //----------------------------- USED WITH COMPUTE PIPELINE ----------------------------------------
    createDeclaration(vertexBufferName, bindingId, groupId = 0, isInput = true) {
        //console.warn("VB.createDeclaration ", vertexBufferName, isInput)
        if (isInput) { }
        this.stackAttributes();
        let structName = vertexBufferName.substring(0, 1).toUpperCase() + vertexBufferName.slice(1);
        const varName = vertexBufferName.substring(0, 1).toLowerCase() + vertexBufferName.slice(1);
        let result = "";
        let type = "storage, read";
        if (this.io === 1) {
            result += "struct " + structName + "{\n";
            let a;
            for (let i = 0; i < this.vertexArrays.length; i++) {
                a = this.vertexArrays[i];
                result += "   " + a.name + ":" + a.varType + ",\n";
            }
            result += "}\n\n";
        }
        else {
            type = "storage, read_write";
            structName = structName.slice(0, structName.length - 4);
        }
        result += "@binding(" + bindingId + ") @group(" + groupId + ") var<" + type + "> " + varName + ":array<" + structName + ">;\n"; //+ "_Array;\n\n";
        return result;
    }
    createBindGroupLayoutEntry(bindingId) {
        //console.warn("VB accessMode = ", this.descriptor.accessMode)
        return {
            binding: bindingId,
            visibility: GPUShaderStage.COMPUTE,
            buffer: {
                type: this.descriptor.accessMode === "read" ? "read-only-storage" : "storage"
            },
        };
    }
    createBindGroupEntry(bindingId) {
        if (!this.gpuResource)
            this.createGpuResource();
        //console.log("VertexBuffer.createBindgroupEntry size = ", this.datas.byteLength)
        return {
            binding: bindingId,
            resource: {
                buffer: this.gpuResource,
                offset: 0,
                size: this.datas.byteLength
            }
        };
    }
    canRefactorData = true;
    pipelineType;
    setPipelineType(pipelineType) {
        if (this.pipelineType)
            return;
        this.pipelineType = pipelineType;
        //use to handle particular cases in descriptor relative to the nature of pipeline
        if (pipelineType === "render") {
            this.descriptor.accessMode = "read";
            this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;
            this.canRefactorData = false;
        }
        else if (pipelineType === "compute_mixed") {
            //console.warn("setPipelineType computeMixed")
            //i use accessMode = "read_write" for both here because we will apply a ping-pong structure: 
            //the computeShader result will be used as input of the computeShader itself for the next frame. 
            //=> to render the first frame we will use buffers[0]  
            // to render the second frame we will use buffers[1]
            // to render the third frame we will use buffers[0]
            // ... 
            //we can swap the bindgroup entry that contains the reference of the buffer , 
            //but we can't swap bindgroupLayout that define the accessMode
            //that's why I forced to use "read_write" for both in that scenario
            //console.log("---compute mixed")
            if (this.io === 1) {
                this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE;
                this.descriptor.accessMode = "read";
            }
            else if (this.io === 2) {
                this.descriptor.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_SRC | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST;
                this.descriptor.accessMode = "read_write";
            }
        }
        else if (pipelineType === "compute") {
            //this case is a bit different because a computePipeline alone must return a result shaped into a Float32Array
            //
            //a final step is applyed to get back the gpu buffers into the cpu context 
            //because we do that, we can use these output-data as input-data of the compute shader 
            //with no need to alternate the bindgroup.
            //that's why I use one buffer with "read" accessMode and a second one with "read_write"
            //console.log("---compute")
            this.canRefactorData = true;
            if (this.io === 1) {
                this.descriptor.usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC;
                this.descriptor.accessMode = "read";
            }
            else if (this.io === 2) {
                this.descriptor.usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC;
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
    arrayStride;
    stackAttributes(builtinOffset = 0) {
        //console.log("---------- STACK ATTRIBUTES ------------");
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
            }
            else if (v.nbComponent === 3) {
                bound = 4;
                vec3s.push(v);
            }
            else if (v.nbComponent === 4) {
                bound = 4;
                v.dataOffset = offset;
                offset += 4;
                result.push(v);
            }
        }
        //------------------------
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
        //--------------------------
        nb = vec2s.length;
        for (let i = 0; i < nb; i++) {
            v = vec2s.shift();
            v.dataOffset = offset;
            offset += 2;
            result.push(v);
        }
        //--------------------------
        nb = floats.length;
        for (let i = 0; i < nb; i++) {
            v = floats.shift();
            v.dataOffset = offset;
            offset++;
            result.push(v);
        }
        //--------------------------
        if (offset % bound !== 0) {
            offset += bound - (offset % bound);
        }
        //--------------------------
        this.vertexArrays = result;
        const attributes = [];
        for (let i = 0; i < result.length; i++) {
            attributes[i] = {
                shaderLocation: builtinOffset + i,
                offset: result[i].dataOffset * Float32Array.BYTES_PER_ELEMENT,
                format: this.vertexArrays[i].format
            };
        }
        //-----------------
        this.arrayStride = offset;
        //console.log("this.arrayStride = ", offset);
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
    layout;
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
            if (this.vertexArrays[i].dataOffset !== undefined)
                offset = componentId = this.vertexArrays[i].dataOffset;
            obj.attributes[i] = {
                shaderLocation: builtinOffset + i,
                offset: offset * Float32Array.BYTES_PER_ELEMENT,
                format: this.vertexArrays[i].format
            };
            componentId += this.vertexArrays[i].nbComponent;
        }
        //console.log("IO:", this.gpuBufferIOs, " | ", this._byteCount + " VS " + (nb * Float32Array.BYTES_PER_ELEMENT))
        obj.arrayStride = Math.max(this._byteCount, nb * Float32Array.BYTES_PER_ELEMENT);
        this.layout = obj;
        return obj;
    }
    _bufferSize;
    deviceId;
    get bufferSize() { return this._bufferSize; }
    createGpuResource() {
        if (this.attributeChanged)
            this.updateAttributes();
        if (!this.datas || this.gpuBufferIOs)
            return;
        if (this.gpuResource)
            this.gpuResource.destroy();
        //console.warn("VB.createGPUResource ", this.pipelineType, XGPU.debugUsage(this.descriptor.usage))
        this.deviceId = XGPU.deviceId;
        this._bufferSize = this.datas.byteLength;
        this.gpuResource = XGPU.device.createBuffer({
            size: this.datas.byteLength,
            usage: this.descriptor.usage,
            mappedAtCreation: false,
        });
        this.mustBeTransfered = true;
    }
    time;
    destroyGpuResource() {
        //console.log("destroy vertexbuffer")
        if (this.time && new Date().getTime() - this.time < 100 && XGPU.loseDeviceRecently) {
            return;
        }
        this.time = new Date().getTime();
        if (this.io && XGPU.loseDeviceRecently) {
            if (this.io === 1) {
                const vbio = this.resourceIO;
                const vbs = vbio.buffers;
                //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA  ", this.pipelineType)
                this.setPipelineType(this.pipelineType);
                const currentDatas = vbio.currentDatas ? vbio.currentDatas : vbs[0]._datas;
                if (vbs[0]._datas instanceof Float32Array)
                    vbs[0]._datas = vbs[1]._datas = new Float32Array(currentDatas);
                else if (vbs[0]._datas instanceof Int32Array)
                    vbs[0]._datas = vbs[1]._datas = new Int32Array(currentDatas);
                else if (vbs[0]._datas instanceof Uint32Array)
                    vbs[0]._datas = vbs[1]._datas = new Uint32Array(currentDatas);
                //vbs[0]._datas = 
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
    }
    updateBuffer() {
        if (!this.datas)
            return;
        if (!this.gpuResource) {
            this.createGpuResource();
        }
        //console.log("updateBuffer ", this.datas.length, this.datas.byteLength + " vs " + this._bufferSize)
        if (this.datas.byteLength != this._bufferSize)
            this.createGpuResource();
        //console.warn("vb gpuResource = ", this.gpuResource)
        XGPU.device.queue.writeBuffer(this.gpuResource, 0, this.datas.buffer);
    }
    getVertexArrayById(id) { return this.vertexArrays[id]; }
    updateAttributes() {
        let attribute;
        attribute = this.vertexArrays[0];
        const nbAttributes = this.vertexArrays.length;
        //const nbVertex = attribute.datas.length;// this.nbComponent;
        let offset = 0;
        //console.log("this._datas = ", nbVertex, this.nbComponent, this.layout.arrayStride);
        //console.log("arrayStride = ", this.la)
        if (this.vertexArrays[0] && this.vertexArrays[0].useByVertexData) {
            const nbVertex = attribute.datas.length;
            if (!this._datas)
                this._datas = new Float32Array(nbVertex * this.nbComponent);
            for (let i = 0; i < nbVertex; i++) {
                for (let j = 0; j < nbAttributes; j++) {
                    attribute = this.vertexArrays[j];
                    if (attribute.mustBeTransfered) {
                        //console.log(nbVertex, nbAttributes, offset, attribute)
                        this._datas.set(attribute.datas[i], offset);
                    }
                    offset += attribute.nbComponent;
                }
            }
        }
        else {
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
