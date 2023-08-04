// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "../../XGPU";
import { DrawConfig } from "./DrawConfig";


export type IndexBufferDescriptor = {
    nbPoint?: number,
    dataType?: "uint16" | "uint32",
    datas?: Uint16Array | Uint32Array,
    offset?: number
}

export class IndexBuffer {

    public gpuResource: GPUBuffer;
    public descriptor: IndexBufferDescriptor;

    public mustUpdateData: boolean = false;

    constructor(descriptor?: {
        nbPoint?: number,
        dataType?: "uint16" | "uint32",
        datas?: Uint16Array | Uint32Array,
        offset?: number
    }) {
        if (!descriptor) descriptor = { nbPoint: 3 } as any;
        if (undefined === descriptor.dataType) {
            if (descriptor.datas) {
                if (descriptor.datas instanceof Uint16Array) descriptor.dataType = "uint16";
                else descriptor.dataType = "uint32";
            } else {
                descriptor.dataType = "uint16";
            }
        }



        if (undefined === descriptor.offset) descriptor.offset = 0;
        this.descriptor = descriptor;

        if (descriptor.nbPoint) this.nbPoint = descriptor.nbPoint;

        if (undefined === descriptor.datas) descriptor.datas = new Uint32Array([0, 0, 0]);
        else this.datas = descriptor.datas;


    }


    public destroyGpuResource(): void {
        if (this.gpuResource) this.gpuResource.destroy();
        this.gpuResource = null;
    }
    public createGpuResource(): void {
        if (!this._datas) console.warn("create index resource ", this.getBufferSize())

        if (this.gpuResource) this.gpuResource.destroy();
        this.gpuResource = XGPU.device.createBuffer({
            size: this.getBufferSize(),
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: false
        });
        (this.gpuResource as any).dataType = this.dataType;
        (this.gpuResource as any).nbPoint = this.nbPoint;

        if (this._datas) {
            this.mustUpdateData = true;
            this.update();
        }

    }

    public getBufferSize(): number {


        if (this.dataType === "uint16") return this.datas.length * Uint16Array.BYTES_PER_ELEMENT;
        return this.datas.length * Uint32Array.BYTES_PER_ELEMENT;



    }

    public get dataType(): GPUIndexFormat { return this.descriptor.dataType; }

    public get nbPoint(): number { return this.descriptor.nbPoint; }
    public set nbPoint(n: number) { this.descriptor.nbPoint = n; }

    public get offset(): number { return this.descriptor.offset; }
    public set offset(n: number) { this.descriptor.offset = n; }

    private _datas: Uint32Array | Uint16Array;
    public set datas(indices: Uint32Array | Uint16Array) {
        this.mustUpdateData = true;

        if (indices instanceof Uint16Array) this.descriptor.dataType = "uint16";
        else this.descriptor.dataType = "uint32";

        if (!this._datas || indices.length > this._datas.length || indices != this._datas) {
            this._datas = indices;
            this.createGpuResource();
        }
        this.update();

    }

    public updateDatas(indices: Uint32Array | Uint16Array, offset: number, len: number, extraBufferSize?: number) {
        this.mustUpdateData = true;

        if (!extraBufferSize) extraBufferSize = 1000;

        if (this.datas) console.log(this.datas.length + " VS " + (offset + len))

        if (!this._datas || this._datas.length < offset + len) {


            if (indices instanceof Uint16Array) this.descriptor.dataType = "uint16";
            else this.descriptor.dataType = "uint32";



            if (!this._datas) {
                this._datas = indices;
                this.createGpuResource();
            } else if ((offset + len) - this._datas.length >= extraBufferSize) {
                this._datas = indices;
                this.createGpuResource();
            } else {

                console.log("B")

                if (indices instanceof Uint16Array) this._datas = new Uint16Array(this._datas.length + extraBufferSize);
                else this._datas = new Uint32Array(this._datas.length + extraBufferSize);
                this._datas.set(indices);
                this.createGpuResource();
            }
        } else {
            console.log("A ", indices.slice(offset, offset + len))
            if (offset && len) this._datas.set(indices.slice(offset, offset + len), offset)
            else this._datas.set(indices);
        }

        this.update();
    }

    public get datas(): Uint32Array | Uint16Array { return this._datas }

    public update(): void {
        if (this.mustUpdateData) {
            this.mustUpdateData = false;
            //console.log("write indexBuffer")
            XGPU.device.queue.writeBuffer(this.gpuResource, 0, this._datas.buffer)
        }
    }

    public apply(renderPass: GPURenderPassEncoder, drawConfig: DrawConfig): void {
        if (!this.gpuResource) this.createGpuResource();
        renderPass.setIndexBuffer(this.gpuResource, this.dataType, this.offset, this.getBufferSize());
        renderPass.drawIndexed(this.nbPoint, drawConfig.instanceCount, drawConfig.firstVertexId, drawConfig.baseVertex, drawConfig.firstInstanceId);
    }

}