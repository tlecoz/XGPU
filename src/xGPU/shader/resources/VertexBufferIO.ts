// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "../../XGPU";
import { VertexAttribute } from "./VertexAttribute";
import { VertexBuffer } from "./VertexBuffer";



export class VertexBufferIO {

    public buffers: VertexBuffer[] = [];
    public descriptor: any;
    public onOutputData: (data: ArrayBuffer) => void;

    protected stagingBuffer: GPUBuffer;
    protected canCallMapAsync: boolean = true;

    protected deviceId: number;

    constructor(attributes: any, descriptor?: any) {

        if (!descriptor) descriptor = {};
        else descriptor = { ...descriptor };

        this.descriptor = descriptor;
        if (!descriptor.stepMode) descriptor.stepMode = "instance";

        this.deviceId = XGPU.deviceId;
        this.buffers[0] = new VertexBuffer(attributes, descriptor);
        this.buffers[1] = new VertexBuffer(attributes, descriptor);

        this.buffers[0].io = 1;
        this.buffers[1].io = 2;

        this.buffers[0].resourceIO = this;
        this.buffers[1].resourceIO = this;

    }

    public get input(): VertexBuffer { return this.buffers[0] }
    public get output(): VertexBuffer { return this.buffers[1] }


    public destroy() {
        if (this.stagingBuffer) this.stagingBuffer.destroy();
        this.buffers = undefined;
        this.onOutputData = undefined;

    }


    private rebuildAfterDeviceLost() {
        if (this.deviceId != XGPU.deviceId) {
            console.log("VertexBufferIO. REBUILD AFTER LOST")
            this.deviceId = XGPU.deviceId;
            this.canCallMapAsync = true;
            this.stagingBuffer = null;
            this.currentDatas = this.buffers[0].datas
        }
    }



    public currentDatas: ArrayBuffer;

    public async getOutputData() {


        this.rebuildAfterDeviceLost()


        //------------------------------------------
        // getting this value change the reference of the GPUBuffer and create the "ping pong"
        // That's why it must be the first line, before the exceptions

        const buffer = this.buffers[0].buffer;
        //-------------------------------------------

        //console.log("getOutputData ", this.onOutputData, this.canCallMapAsync)

        if (!this.onOutputData) return null;
        if (!this.canCallMapAsync) return;



        if (!this.stagingBuffer) this.stagingBuffer = XGPU.createStagingBuffer(this.bufferSize);
        const copyEncoder = XGPU.device.createCommandEncoder();
        const stage = this.stagingBuffer;

        copyEncoder.copyBufferToBuffer(buffer, 0, stage, 0, stage.size);

        XGPU.device.queue.submit([copyEncoder.finish()]);

        this.canCallMapAsync = false;
        await this.stagingBuffer.mapAsync(GPUMapMode.READ, 0, stage.size)
        this.canCallMapAsync = true;

        const copyArray = stage.getMappedRange(0, stage.size);
        const data = copyArray.slice(0);
        stage.unmap();

        this.currentDatas = data;
        this.onOutputData(data);

    }







    public clone(): VertexBufferIO {
        return new VertexBufferIO(this.buffers[0].attributeDescriptor, this.descriptor);
    }

    public createDeclaration(name: string, bindingId: number, groupId: number): string {
        const structName = name.substring(0, 1).toUpperCase() + name.slice(1);
        const varName = name.substring(0, 1).toLowerCase() + name.slice(1);

        let result = "";
        result += "struct " + structName + "{\n";
        let a: VertexAttribute;
        for (let i = 0; i < this.buffers[0].vertexArrays.length; i++) {
            a = this.buffers[0].vertexArrays[i];
            result += "   " + a.name + ":" + a.varType + ",\n";
        }
        result += "}\n\n";

        result += "@binding(" + bindingId + ") @group(" + groupId + ") var<storage, read> " + varName + ":array<" + structName + ">;\n";//"_Array;\n";
        result += "@binding(" + (bindingId + 1) + ") @group(" + groupId + ") var<storage, read_write> " + varName + "_out:array<" + structName + ">;\n";// + "_Array;\n";
        return result + "\n";
    }





    public createVertexInstances(nbInstance: number, createInstance: (instanceId: number) => any) {

        if (undefined == this.buffers[0].arrayStride) {
            this.buffers[0].stackAttributes();
        }

        const attributes = this.buffers[0].attributes;
        const arrayStride = this.buffers[0].arrayStride;
        const datas = new Float32Array(arrayStride * nbInstance);

        //console.log("==> ", arrayStride)

        let o: any;
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


    protected view: any;
    public getVertexInstances(datas: Float32Array, onGetInstance: (o: any) => void) {
        const arrayStride = this.buffers[0].arrayStride ? this.buffers[0].arrayStride : this.buffers[1].arrayStride;
        const attributes = this.buffers[0].attributes;

        if (!this.view) {
            this.view = {};
            for (let z in attributes) {
                const a = attributes[z];
                let val;
                if (a.nbComponent === 1) val = { x: 0, ___offset: a.dataOffset };//new Float();
                else if (a.nbComponent === 2) val = { x: 0, y: 0, ___offset: a.dataOffset };//new Vec2();
                else if (a.nbComponent === 3) val = { x: 0, y: 0, z: 0, ___offset: a.dataOffset };//new Vec3();
                else if (a.nbComponent === 4) val = { x: 0, y: 0, z: 0, w: 0, ___offset: a.dataOffset };//new Vec4();
                this.view[z] = val;
            }
        }


        const view: any = this.view;



        const nb = this.buffers[0].datas.length / arrayStride;
        let start: number, s: number, nbCompo;
        let v: any;

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
                        if (nbCompo == 4) v.w = datas[s + 3];
                    }
                }
            }
            onGetInstance(view);
        }

    }



    public set datas(v: Float32Array) {
        this.buffers[0].datas = v;
        this.buffers[1].datas = v;
    }

    protected attributeDesc: any;
    public get attributeDescriptor(): any {
        if (!this.attributeDesc) this.attributeDesc = this.buffers[0].attributeDescriptor;
        return this.attributeDesc;
    }




    public update() {

        this.rebuildAfterDeviceLost()


        this.buffers[0].update();
        this.buffers[1].update();
    }

    public get bufferSize(): number { return this.buffers[0].buffer.size; }

    public get nbVertex(): number { return this.buffers[0].nbVertex }


}