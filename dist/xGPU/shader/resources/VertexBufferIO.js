// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { XGPU } from "../../XGPU";
import { VertexBuffer } from "./VertexBuffer";
export class VertexBufferIO {
    buffers = [];
    descriptor;
    onOutputData;
    stagingBuffer;
    canCallMapAsync = true;
    deviceId;
    constructor(attributes, descriptor) {
        if (!descriptor)
            descriptor = {};
        else
            descriptor = { ...descriptor };
        this.descriptor = descriptor;
        if (!descriptor.stepMode)
            descriptor.stepMode = "instance";
        //console.log(descriptor.stepMode)
        this.deviceId = XGPU.deviceId;
        this.buffers[0] = new VertexBuffer(attributes, descriptor);
        this.buffers[1] = new VertexBuffer(attributes, descriptor);
        this.buffers[0].io = 1;
        this.buffers[1].io = 2;
        this.buffers[0].resourceIO = this;
        this.buffers[1].resourceIO = this;
    }
    get input() { return this.buffers[0]; }
    get output() { return this.buffers[1]; }
    destroy() {
        if (this.stagingBuffer)
            this.stagingBuffer.destroy();
        this.buffers[0].destroyGpuResource();
        this.buffers[1].destroyGpuResource();
        this.buffers = undefined;
        this.onOutputData = undefined;
    }
    rebuildAfterDeviceLost() {
        if (this.deviceId != XGPU.deviceId) {
            //console.log("VertexBufferIO. REBUILD AFTER LOST")
            this.deviceId = XGPU.deviceId;
            this.canCallMapAsync = true;
            this.stagingBuffer = null;
            this.currentDatas = this.buffers[0].datas;
        }
    }
    currentDatas;
    async getOutputData() {
        this.rebuildAfterDeviceLost();
        //------------------------------------------
        // getting this value change the reference of the GPUBuffer and create the "ping pong"
        // That's why it must be the first line, before the exceptions
        const buffer = this.buffers[0].buffer;
        //-------------------------------------------
        //console.log("getOutputData ", this.onOutputData, this.canCallMapAsync)
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
        result += "@binding(" + bindingId + ") @group(" + groupId + ") var<storage, read> " + varName + ":array<" + structName + ">;\n"; //"_Array;\n";
        result += "@binding(" + (bindingId + 1) + ") @group(" + groupId + ") var<storage, read_write> " + varName + "_out:array<" + structName + ">;\n"; // + "_Array;\n";
        return result + "\n";
    }
    createVertexInstances(nbInstance, createInstance) {
        if (undefined == this.buffers[0].arrayStride) {
            this.buffers[0].stackAttributes();
        }
        const attributes = this.buffers[0].attributes;
        const arrayStride = this.buffers[0].arrayStride;
        let type;
        for (let z in attributes) {
            type = attributes[z].format;
            break;
        }
        let datas;
        //console.log("createVertexInstances type = ", type)
        if (type === "float32" || type === "float32x2" || type === "float32x3" || type === "float32x4")
            datas = new Float32Array(arrayStride * nbInstance);
        else if (type == "sint32" || type == "sint32x2" || type == "sint32x3" || type == "sint32x4")
            datas = new Int32Array(arrayStride * nbInstance);
        else if (type == "uint32" || type == "uint32x2" || type == "uint32x3" || type == "uint32x4")
            datas = new Uint32Array(arrayStride * nbInstance);
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
    view;
    getVertexInstances(datas, onGetInstance) {
        const arrayStride = this.buffers[0].arrayStride ? this.buffers[0].arrayStride : this.buffers[1].arrayStride;
        const attributes = this.buffers[0].attributes;
        if (!this.view) {
            this.view = {};
            for (let z in attributes) {
                const a = attributes[z];
                let val;
                if (a.nbComponent === 1)
                    val = { x: 0, ___offset: a.dataOffset }; //new Float();
                else if (a.nbComponent === 2)
                    val = { x: 0, y: 0, ___offset: a.dataOffset }; //new Vec2();
                else if (a.nbComponent === 3)
                    val = { x: 0, y: 0, z: 0, ___offset: a.dataOffset }; //new Vec3();
                else if (a.nbComponent === 4)
                    val = { x: 0, y: 0, z: 0, w: 0, ___offset: a.dataOffset }; //new Vec4();
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
    dataStructureChanged = false;
    nextDatas;
    set datas(v) {
        this.buffers[0].datas = v;
        this.buffers[1].datas = v;
    }
    attributeDesc;
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
    get bufferSize() { return this.buffers[0].buffer.size; }
    get nbVertex() { return this.buffers[0].nbVertex; }
}
