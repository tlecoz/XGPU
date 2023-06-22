// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.



//NEW VERSION------

import { XGPU } from "../../XGPU";
import { PrimitiveType } from "../PrimitiveType";
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


        this.descriptor = descriptor ? { ...descriptor } : {};
        this.group = new UniformGroup(items, this.descriptor.useLocalVariable);
        this.group.uniformBuffer = this;


    }


    public clone(propertyNames?: string[]): UniformBuffer {
        //if propertyNames exists, it will clone only these properties and copy the others
        //if propertyNames is undefined, it will clone every properties 

        const items = { ...this.group.unstackedItems };

        for (let z in items) items[z] = items[z].clone();

        const buffer = new UniformBuffer(items, this.descriptor);

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


    public get bufferType(): "read-only-storage" | "uniform" {
        if (this.group.arrayStride * Float32Array.BYTES_PER_ELEMENT < 65536) return "uniform";
        return "read-only-storage";
    }

    public createGpuResource(): any {

        if (!this.gpuResource) {

            const size = this.group.arrayStride * Float32Array.BYTES_PER_ELEMENT;
            let usage: GPUBufferUsageFlags = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;

            if (this.bufferType === "read-only-storage") usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST

            //console.log("uniformBuffer createGouResource size = ", size);
            this.gpuResource = XGPU.device.createBuffer({
                size,
                usage
            })

            this.update();
        }
    }

    public destroyGpuResource() {
        if (this.gpuResource) {
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
        return {
            binding: bindingId,
            visibility: this.descriptor.visibility,
            buffer: {
                type,
            },
        }
    }


    public createBindGroupEntry(bindingId: number): { binding: number, resource: { buffer: GPUBuffer } } {
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

    public setPipelineType(pipelineType: "compute" | "render" | "compute_mixed") {

        //use to handle particular cases in descriptor relative to the nature of pipeline
        if (pipelineType === "compute" || pipelineType === "compute_mixed") this.descriptor.visibility = GPUShaderStage.COMPUTE;
        else {
            this.descriptor.visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX;
        }
    }
}

