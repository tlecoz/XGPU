// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.



//NEW VERSION------

import { XGPU } from "../../XGPU";
import { PrimitiveType } from "../../PrimitiveType";
import { IShaderResource } from "./IShaderResource";
import { UniformGroup, Uniformable } from "./UniformGroup";


export type UniformBufferDescriptor = {
    useLocalVariable?: boolean;
    visibility?: GPUShaderStageFlags;
}

export class UniformBuffer implements IShaderResource {


    public gpuResource: GPUBuffer;
    public descriptor: UniformBufferDescriptor;





    public group: UniformGroup;


    public get mustBeTransfered(): boolean { return this.group.mustBeTransfered; }
    public set mustBeTransfered(b: boolean) {
        this.group.mustBeTransfered = b;
    }


    constructor(items: any, descriptor?: {
        useLocalVariable?: boolean;
        visibility?: GPUShaderStageFlags;
    }) {

        //console.warn("new UniformBuffer ")
        this.descriptor = descriptor ? { ...descriptor } : {};
        this.group = new UniformGroup(items, this.descriptor.useLocalVariable);
        this.group.uniformBuffer = this;


    }

    public cloned: boolean = false;
    public clone(propertyNames?: string[]): UniformBuffer {
        //if propertyNames exists, it will clone only these properties and copy the others
        //if propertyNames is undefined, it will clone every properties 

        const items = { ...this.group.unstackedItems };

        if (propertyNames) {
            for (let z in items) {
                if (propertyNames.indexOf(z) !== -1) items[z] = items[z].clone();
            }
        } else {
            for (let z in items) items[z] = items[z].clone();
        }



        //console.log(this.descriptor, this.shaderVisibility)
        const buffer = new UniformBuffer(items, this.descriptor);
        buffer.cloned = true;

        (buffer as any).name = (this as any).name;
        return buffer;

    }


    public add(name: string, data: PrimitiveType, useLocalVariable: boolean = false): Uniformable {
        return this.group.add(name, data, useLocalVariable);
    }

    public remove(name: string): Uniformable {
        return this.group.remove(name);
    }




    public update(): void {


        //if (!this._data) this._data = new Float32Array(new ArrayBuffer(this.byteSize))
        if (!this.gpuResource) this.createGpuResource();

        this.group.update(this.gpuResource, true);
        this.mustBeTransfered = false;
    }

    public createStruct(uniformName: string): { struct: string, localVariables: string } {


        //console.warn("RESOURCE NAME = ", this.group.name)

        const o = this.group.getStruct(uniformName);



        return o;
    }

    public createDeclaration(uniformName: string, bindingId: number, groupId: number = 0): string {

        const structName = uniformName.substring(0, 1).toUpperCase() + uniformName.slice(1);
        const varName = uniformName.substring(0, 1).toLowerCase() + uniformName.slice(1);

        if (this.bufferType === "uniform") return "@binding(" + bindingId + ") @group(" + groupId + ") var<uniform> " + varName + ":" + structName + ";\n";
        else return "@binding(" + bindingId + ") @group(" + groupId + ") var<storage, read> " + varName + ":" + structName + ";\n";
    }

    public getUniformById(id: number) { return this.group.items[id]; }
    public getUniformByName(name: string) { return this.group.getElementByName(name); }

    //------------------------------


    protected _bufferType: "read-only-storage" | "uniform";
    public get bufferType(): "read-only-storage" | "uniform" {
        return this._bufferType;
    }

    public createGpuResource(): any {



        if (!this.gpuResource) {

            //console.time("createGpuUniformBuffer")

            const size = this.group.arrayStride * Float32Array.BYTES_PER_ELEMENT;
            let usage: GPUBufferUsageFlags = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;

            if (this.bufferType === "read-only-storage") usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST

            //console.log("uniformBuffer createGpuResource size = ", size, this.group.arrayStride);
            this.gpuResource = XGPU.device.createBuffer({

                size,
                usage,

            })

            this.update();

            //console.timeEnd("createGpuUniformBuffer")
            //console.log(this.gpuResource)

        }
    }

    public getItemsAsArray(): any[] {
        const result = [];
        for (let i = 0; i < this.itemNames.length; i++) result[i] = this.items[this.itemNames[i]];
        return result;
    }


    public time: number;
    public destroyGpuResource() {
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


    public createBindGroupLayoutEntry(bindingId: number): { binding: number, visibility: number, buffer: { type: string } } {

        let type: string = "uniform";
        if (this.bufferType) type = this.bufferType;
        //console.log("bufferType = ", this.bufferType);

        //console.log("createBindGroupLayoutEntry ", this.descriptor.visibility)
        //console.log("UniformBuffer.createBindGroupLayoutEntry ", this.shaderVisibility, this.debug, this.cloned)

        return {
            binding: bindingId,
            visibility: this.descriptor.visibility,
            buffer: {
                type,
            },
        }
    }


    public createBindGroupEntry(bindingId: number): { binding: number, resource: { buffer: GPUBuffer } } {
        //console.log("UniformBuffer.createBindgroupEntry ", this.items);
        if (!this.gpuResource) this.createGpuResource();



        return {
            binding: bindingId,
            resource: {
                buffer: this.gpuResource
            }
        }
    }

    public get items(): any { return this.group.unstackedItems; }
    public get itemNames(): string[] { return this.group.itemNames; }
    public get nbComponent(): number { return this.group.arrayStride; }
    public get nbUniforms(): number { return this.group.items.length; }

    //public get bufferType(): string { return "uniform"; }



    protected _usage: number;

    protected debug: string;
    protected shaderVisibility: GPUShaderStageFlags;
    protected pipelineType: "compute" | "render" | "compute_mixed";
    public setPipelineType(pipelineType: "compute" | "render" | "compute_mixed") {

        /*
        if (this.group.arrayStride * Float32Array.BYTES_PER_ELEMENT < 65536 && this.pipelineType == "render") return "uniform";
        return "read-only-storage";
        */

        let usage: GPUBufferUsageFlags = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;

        if (this.bufferType === "read-only-storage") usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST


        this.pipelineType = pipelineType;




        //console.warn("setPipelineType ", pipelineType)
        //use to handle particular cases in descriptor relative to the nature of pipeline
        if (pipelineType === "compute" || pipelineType === "compute_mixed") {
            this._bufferType = "read-only-storage";
            this.descriptor.visibility = GPUShaderStage.COMPUTE;
        } else {
            if (this.group.arrayStride * Float32Array.BYTES_PER_ELEMENT < 65536) this._bufferType = "uniform";
            else this._bufferType = "uniform";
            this.descriptor.visibility = this.shaderVisibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX;
        }
    }
}

