// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
//NEW VERSION------
import { XGPU } from "../../XGPU";
import { UniformGroup } from "./UniformGroup";
import { StageableBuffer } from "./StageableBuffer";
export class UniformBuffer extends StageableBuffer {
    gpuResource;
    descriptor;
    group;
    get mustBeTransfered() { return this.group.mustBeTransfered; }
    set mustBeTransfered(b) {
        this.group.mustBeTransfered = b;
    }
    constructor(items, descriptor) {
        super();
        this.descriptor = descriptor ? { ...descriptor } : {};
        this.group = new UniformGroup(items, this.descriptor.useLocalVariable, true);
        this.group.uniformBuffer = this;
        if (descriptor.accessMode)
            this._accessMode = descriptor.accessMode;
    }
    cloned = false;
    clone(propertyNames) {
        //if propertyNames exists, it will clone only these properties and copy the others
        //if propertyNames is undefined, it will clone every properties 
        const items = { ...this.group.unstackedItems };
        if (propertyNames) {
            for (let z in items) {
                if (propertyNames.indexOf(z) !== -1)
                    items[z] = items[z].clone();
            }
        }
        else {
            for (let z in items)
                items[z] = items[z].clone();
        }
        //console.log(this.descriptor, this.shaderVisibility)
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
        //if (!this._data) this._data = new Float32Array(new ArrayBuffer(this.byteSize))
        if (!this.gpuResource)
            this.createGpuResource();
        this.group.update(this.gpuResource);
        this.mustBeTransfered = false;
    }
    createStruct(uniformName) {
        //console.warn("RESOURCE NAME = ", this.group.name)
        const o = this.group.getStruct(uniformName);
        return o;
    }
    createDeclaration(uniformName, bindingId, groupId = 0) {
        const structName = uniformName.substring(0, 1).toUpperCase() + uniformName.slice(1);
        const varName = uniformName.substring(0, 1).toLowerCase() + uniformName.slice(1);
        if (this.bufferType === "uniform")
            return "@binding(" + bindingId + ") @group(" + groupId + ") var<uniform> " + varName + ":" + structName + ";\n";
        else {
            //before 08/11/2024-------
            //return "@binding(" + bindingId + ") @group(" + groupId + ") var<storage, read> " + varName + ":" + structName + ";\n";
            //update 08/11/2024:
            return "@binding(" + bindingId + ") @group(" + groupId + ") var<storage, " + this._accessMode + "> " + varName + ":" + structName + ";\n";
        }
    }
    getUniformById(id) { return this.group.items[id]; }
    getUniformByName(name) { return this.group.getElementByName(name); }
    //------------------------------
    _accessMode;
    get accessMode() { return this._accessMode; }
    _bufferType;
    get bufferType() {
        return this._bufferType;
    }
    createGpuResource() {
        if (!this.gpuResource) {
            //console.time("createGpuUniformBuffer")
            this.group.updateStartIdFromParentToChildren();
            const size = this.group.arrayStride * Float32Array.BYTES_PER_ELEMENT;
            let usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
            if (this.bufferType === "read-only-storage" || this.bufferType === "storage")
                usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC;
            //console.log("uniformBuffer createGpuResource size = ", size, this.group.arrayStride);
            this.gpuResource = XGPU.device.createBuffer({
                size,
                usage,
            });
            this.update();
            //console.timeEnd("createGpuUniformBuffer")
            //console.log(this.gpuResource)
        }
    }
    getItemsAsArray() {
        const result = [];
        for (let i = 0; i < this.itemNames.length; i++)
            result[i] = this.items[this.itemNames[i]];
        return result;
    }
    time;
    destroyGpuResource() {
        if (this.time && new Date().getTime() - this.time < 100 && XGPU.loseDeviceRecently) {
            if (this.gpuResource) {
                this.group.updateStack();
                return;
            }
        }
        this.time = new Date().getTime();
        if (this.gpuResource) {
            this.group.updateStack();
            this.group.forceUpdate();
            this.gpuResource.destroy();
        }
        //this.group.destroy();
        this.gpuResource = null;
    }
    createBindGroupLayoutEntry(bindingId) {
        let type = "uniform";
        if (this.bufferType)
            type = this.bufferType;
        //console.log("bufferType = ", this.bufferType);
        //console.log("createBindGroupLayoutEntry ", this.descriptor.visibility)
        //console.log("UniformBuffer.createBindGroupLayoutEntry ", this.shaderVisibility, this.debug, this.cloned)
        return {
            binding: bindingId,
            visibility: this.descriptor.visibility,
            buffer: {
                type,
            },
        };
    }
    createBindGroupEntry(bindingId) {
        //console.log("UniformBuffer.createBindgroupEntry ", this.items);
        if (!this.gpuResource)
            this.createGpuResource();
        return {
            binding: bindingId,
            resource: {
                buffer: this.gpuResource
            }
        };
    }
    get items() { return this.group.unstackedItems; }
    get itemNames() { return this.group.itemNames; }
    get nbComponent() { return this.group.arrayStride; }
    get nbUniforms() { return this.group.items.length; }
    //public get bufferType(): string { return "uniform"; }
    _usage;
    debug;
    shaderVisibility;
    pipelineType;
    setPipelineType(pipelineType) {
        /*
        if (this.group.arrayStride * Float32Array.BYTES_PER_ELEMENT < 65536 && this.pipelineType == "render") return "uniform";
        return "read-only-storage";
        */
        /*
        let usage: GPUBufferUsageFlags = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;

        if (this.bufferType === "read-only-storage") usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        */
        this.pipelineType = pipelineType;
        //console.warn("setPipelineType ", pipelineType)
        //use to handle particular cases in descriptor relative to the nature of pipeline
        if (pipelineType === "compute" || pipelineType === "compute_mixed") {
            if (!this._bufferType)
                this._bufferType = "storage";
            if (!this._accessMode)
                this._accessMode = "read_write";
            if (this._accessMode) {
                if (this._accessMode == "read") {
                    this._bufferType = "read-only-storage";
                }
                else {
                    this._bufferType = "storage";
                }
            }
            else {
                this._bufferType = "storage";
                this._accessMode = "read_write";
            }
            this.descriptor.visibility = GPUShaderStage.COMPUTE;
        }
        else {
            if (this.group.arrayStride * Float32Array.BYTES_PER_ELEMENT < 65536)
                this._bufferType = "uniform";
            else
                this._bufferType = "storage";
            this._accessMode = "read";
            this.descriptor.visibility = this.shaderVisibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX;
        }
    }
}
