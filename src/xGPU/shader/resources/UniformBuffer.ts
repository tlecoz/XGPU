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
    }

    public createStruct(uniformName: string): { struct: string, localVariables: string } {




        const o = this.group.getStruct(uniformName);



        return o;
    }

    public createDeclaration(uniformName: string, bindingId: number, groupId: number = 0): string {

        const structName = uniformName.substring(0, 1).toUpperCase() + uniformName.slice(1);
        const varName = uniformName.substring(0, 1).toLowerCase() + uniformName.slice(1);

        return "@binding(" + bindingId + ") @group(" + groupId + ") var<uniform> " + varName + ":" + structName + ";\n";
    }

    public getUniformById(id: number) { return this.group.items[id]; }
    public getUniformByName(name: string) { return this.group.getElementByName(name); }

    //------------------------------

    public createGpuResource(): any {

        if (!this.gpuResource) {

            this.gpuResource = XGPU.device.createBuffer({
                size: this.group.arrayStride * Float32Array.BYTES_PER_ELEMENT,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            })

            this.update();
        }
    }

    public destroyGpuResource() {
        if (this.gpuResource) this.gpuResource.destroy();
        this.group.destroy();
        this.gpuResource = null;
    }


    public createBindGroupLayoutEntry(bindingId: number): { binding: number, visibility: number, buffer: { type: string } } {

        return {
            binding: bindingId,
            visibility: this.descriptor.visibility,
            buffer: {
                type: "uniform",
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

        else this.descriptor.visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX;
    }
}




/*

============================ OLD VERSION =========================================



import { XGPU } from "../../XGPU";
import { GPUType } from "../../GPUType";
import { PrimitiveType } from "../PrimitiveType";
import { ShaderStruct } from "../shaderParts/ShaderStruct";
import { IShaderResource } from "./IShaderResource";


export type UniformBufferDescriptor = {
    useLocalVariable?: boolean;
    visibility?: GPUShaderStageFlags;
}

export class UniformBuffer implements IShaderResource {

    public mustBeTransfered: boolean = false;
    public gpuResource: GPUBuffer;
    public descriptor: UniformBufferDescriptor;

    protected uniforms: PrimitiveType[] = [];
    protected byteSize: number = 0;
    protected _nbComponent: number = 0;
    protected _data: Float32Array;
    protected _items: any = {};
    protected _itemNames: string[] = [];

    protected uniformAlignmentReady: boolean = false;

    constructor(items: any, descriptor?: {
        useLocalVariable?: boolean;
        visibility?: GPUShaderStageFlags;
    }) {


        if (!descriptor) descriptor = {}
        else descriptor = { ...descriptor };

        this.descriptor = descriptor;


        for (let name in items) {
            this.add(name, items[name])
        }
    }


    public clone(propertyNames?: string[]): UniformBuffer {
        const items = { ...this.items };
        if (propertyNames) {
            for (let i = 0; i < propertyNames.length; i++) {
                items[propertyNames[i]] = items[propertyNames[i]].clone();
            }
        }

        const buffer = new UniformBuffer(items, this.descriptor);
        (buffer as any).name = (this as any).name;
        for (let z in items) {
            items[z] = items[z].clone();
            items[z].uniformBuffer = buffer;
        }

        return buffer;
    }



    public add(name: string, data: PrimitiveType, useLocalVariable: boolean = false) {

        data.uniformBuffer = this;
        data.name = name;

        if (this.descriptor.useLocalVariable || useLocalVariable) data.createVariableInsideMain = true;


        const alreadyDefined: boolean = !!this._items[name];
        this._items[name] = data;

        if (!alreadyDefined) {
            this._itemNames.push(name);
            data.startId = this.byteSize;
            this._nbComponent += data.length;
            this.uniforms.push(data)
        }
        this.mustBeTransfered = data.mustBeTransfered = true;

        return data;
    }





    private setupUniformAlignment() {



        this.uniforms = this.uniforms.sort((a: PrimitiveType, b: PrimitiveType) => {
            if (a.type.byteAlign > b.type.byteAlign) return 1;
            if (a.type.byteAlign < b.type.byteAlign) return -1
            return 0;
        })


        let offset = 0;
        let type: GPUType;
        let uniform: PrimitiveType;
        let oldType = "f32";
        for (let i = 0; i < this.uniforms.length; i++) {
            uniform = this.uniforms[i];
            type = uniform.type;


            //console.log("#0 ", offset)
            if (type.dataType != oldType && offset > 0) {



                if (type.dataType === "vec2<f32>") {
                    if (offset > 8) {
                        offset += 16 - (offset % 16);
                    }
                } else {


                    if (offset % 16 != 0) {
                        //console.log("=> ", offset, " +=  16 - ", (offset % 16))
                        offset += 16 - (offset % 16);
                    }
                }



                //console.log("======+>>>>> ", offset % 16)


            }

            oldType = type.dataType;

            uniform.startId = offset;

            //console.log(uniform.name, offset);

            if (type.isArray) {

                if (type.isArrayOfVectors) offset += 16 * type.arrayLength;
                else offset += 4 * type.nbValues;
            } else if (type.isMatrix) {
                //console.log("nbValue = ", offset, type.nbValues)
                offset += type.nbValues * 4
                //console.log("=> ", offset)
            } else {

                if (type.dataType === "f32") {
                    offset += 4;
                } else if (type.dataType === "vec2<f32>") {
                    offset += 8;
                } else {
                    offset += 16;
                }

                //console.log("type = ", type, offset);
                //offset += 16;
            }

        }
        this.byteSize = offset;
        //console.log("byteSize = ", this.byteSize)
    }


    public update(): void {


        if (!this._data) this._data = new Float32Array(new ArrayBuffer(this.byteSize))
        if (!this.gpuResource) this.createGpuResource();



        let uniform: PrimitiveType;
        for (let i = 0; i < this.uniforms.length; i++) {
            uniform = this.uniforms[i];
            uniform.update();
            if (uniform.mustBeTransfered) {
                //console.log("update uniform ", uniform.startId, new Float32Array(uniform.buffer))
                uniform.mustBeTransfered = false;
                XGPU.device.queue.writeBuffer(
                    this.gpuResource,
                    uniform.startId,
                    uniform.buffer,
                    0,
                    uniform.byteLength
                )

            }
        }
    }

    public createStruct(uniformName: string): ShaderStruct {

        const structName = uniformName.substring(0, 1).toUpperCase() + uniformName.slice(1);
        const struct = new ShaderStruct(structName);
        //console.warn("---------------- createStruct-----------------")
        let o: PrimitiveType;
        for (let i = 0; i < this.uniforms.length; i++) {
            o = this.uniforms[i];
            //console.log(i, o)
            if ((o as any).propertyNames) {
                struct.addProperty({ name: o.name, type: o.constructor.name, builtin: "", size: o.byteLength, obj: o })
            } else {
                struct.addProperty({ name: o.name, type: o.type.dataType, builtin: "" })
            }


            //struct.addProperty({ name: o.name, type: o.type.dataType, builtin: "" })

        }


        return struct;
    }

    public createDeclaration(uniformName: string, bindingId: number, groupId: number = 0): string {

        const structName = uniformName.substring(0, 1).toUpperCase() + uniformName.slice(1);
        const varName = uniformName.substring(0, 1).toLowerCase() + uniformName.slice(1);

        return "@binding(" + bindingId + ") @group(" + groupId + ") var<uniform> " + varName + ":" + structName + ";\n";
    }

    public getUniformById(id: number) { return this.uniforms[id]; }
    public getUniformByName(name: string) {
        for (let i = 0; i < this.uniforms.length; i++) {
            if (this.uniforms[i].name === name) return this.uniforms[i];
        }
        return null;
    }

    //------------------------------

    public createGpuResource(): any {

        if (!this.gpuResource) {

            if (!this.uniformAlignmentReady) {
                this.uniformAlignmentReady = true;
                this.setupUniformAlignment();
            }

            this.gpuResource = XGPU.device.createBuffer({
                size: this.byteSize,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            })

            this.update();
        }
    }

    public destroyGpuResource() {
        if (this.gpuResource) this.gpuResource.destroy();
        this.gpuResource = null;
    }


    public createBindGroupLayoutEntry(bindingId: number): { binding: number, visibility: number, buffer: { type: string } } {

        return {
            binding: bindingId,
            visibility: this.descriptor.visibility,
            buffer: {
                type: "uniform",
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

    public get items(): any { return this._items; }
    public get itemNames(): string[] { return this._itemNames; }
    public get nbComponent(): number { return this._nbComponent; }
    public get nbUniforms(): number { return this.uniforms.length; }

    //public get bufferType(): string { return "uniform"; }

    public setPipelineType(pipelineType: "compute" | "render" | "compute_mixed") {

        //use to handle particular cases in descriptor relative to the nature of pipeline
        if (pipelineType === "compute" || pipelineType === "compute_mixed") this.descriptor.visibility = GPUShaderStage.COMPUTE;

        else this.descriptor.visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX;
    }
}

*/