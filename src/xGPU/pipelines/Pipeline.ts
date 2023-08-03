// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "../XGPU";
import { Bindgroup } from "../shader/Bindgroup";
import { Bindgroups } from "../shader/Bindgroups";
import { FragmentShader } from "../shader/FragmentShader";
import { IShaderResource } from "../shader/resources/IShaderResource";
import { VertexAttribute } from "../shader/resources/VertexAttribute";
import { VertexBuffer } from "../shader/resources/VertexBuffer";
import { ShaderStruct } from "../shader/shaderParts/ShaderStruct";
import { VertexShader } from "../shader/VertexShader";
import { PrimitiveFloatUniform, PrimitiveIntUniform, PrimitiveUintUniform } from "../shader/PrimitiveType";


export class Pipeline {

    public description: any = {};
    public nbVertex: number;
    public bindGroups: Bindgroups;
    public vertexBuffers: VertexBuffer[];

    public vertexShader: VertexShader;
    public fragmentShader: FragmentShader;

    protected vertexBufferLayouts: Iterable<GPUVertexBufferLayout>;
    protected gpuBindgroups: GPUBindGroup[] = [];
    protected gpuBindGroupLayouts: GPUBindGroupLayout[] = [];
    protected gpuPipelineLayout: GPUPipelineLayout;
    public type: "compute" | "compute_mixed" | "render" = null;

    constructor() {
        this.bindGroups = new Bindgroups(this, "pipeline");

    }
    public get isComputePipeline(): boolean { return this.type === "compute" || this.type === "compute_mixed"; }
    public get isRenderPipeline(): boolean { return this.type === "render"; }
    public get isMixedPipeline(): boolean { return this.type === "compute_mixed"; }


    protected _resources: any;
    public get resources(): any { return this._resources; }


    public debug: string;

    public clearAfterDeviceLostAndRebuild() {

        this.bindGroups.clearAfterDeviceLost()
        this.vertexBufferLayouts = undefined;
        this.gpuPipelineLayout = undefined;
        this.gpuBindGroupLayouts = [];
        this.gpuBindgroups = [];

        //this.build();

    }




    public initFromObject(obj: any) {

        this._resources = obj;
    }

    public pipelineCount: number = 1;





    public static getResourceDefinition(resources: any): any {
        const result: any = {};
        let o: any;
        for (let z in resources) {
            o = resources[z];
            result[o.name] = o;
        }
        return result;
    }

    public addBindgroup(group: Bindgroup) {
        this.bindGroups.add(group);
    }



    protected createVertexBufferLayout(): any {



        this.vertexBufferLayouts = [];
        this.vertexBuffers = [];

        const groups: Bindgroup[] = this.bindGroups.groups;
        let elements: { name: string, resource: IShaderResource }[];
        let resource: IShaderResource;
        let builtin: number = 0;
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

    protected createShaderInput(shader: VertexShader, buffers: VertexBuffer[]): ShaderStruct {
        const vertexInput: ShaderStruct = new ShaderStruct("Input", shader.inputs);;

        if (buffers) {
            let arrays: VertexAttribute[];
            let builtin: number = 0;
            for (let i = 0; i < buffers.length; i++) {
                arrays = buffers[i].vertexArrays;
                for (let j = 0; j < arrays.length; j++) {
                    vertexInput.addProperty({ name: arrays[j].name, type: arrays[j].varType, builtin: "@location(" + builtin + ")" })
                    builtin++;
                }
            }
        }

        return vertexInput;
    }





    protected createLayouts(): void {




        this.gpuBindGroupLayouts = [];
        this.gpuBindgroups = [];
        this.gpuPipelineLayout = null;


        const groups: Bindgroup[] = this.bindGroups.groups;
        let elements: { name: string, resource: IShaderResource }[];
        let resource: IShaderResource;
        let layout, group;
        let layouts = [];
        let k, n = 0;
        for (let i = 0; i < groups.length; i++) {
            elements = groups[i].elements;
            layout = layouts[i] = { entries: [] };
            group = { entries: [], layout: null };
            k = 0;

            for (let j = 0; j < elements.length; j++) {
                resource = elements[j].resource;
                if (!(resource instanceof VertexBuffer) || this.isComputePipeline) {
                    layout.entries[k] = resource.createBindGroupLayoutEntry(k);
                    group.entries[k] = resource.createBindGroupEntry(k)
                    k++;
                }
            }

            if (k > 0) {
                group.layout = this.gpuBindGroupLayouts[n] = XGPU.createBindgroupLayout(layout)
                this.gpuBindgroups[n] = XGPU.createBindgroup(group)
                n++;

                //console.log("-----")
                //console.log(layout);
                //console.log(group)
            }


        }
        //console.log("this.gpuBindGroupLayouts", this.gpuBindGroupLayouts)

        this.gpuPipelineLayout = XGPU.createPipelineLayout({ bindGroupLayouts: this.gpuBindGroupLayouts })
    }


    protected initPipelineResources(pipeline: Pipeline) {
        const resources: IShaderResource[] = this.bindGroups.resources.all;
        //console.log("all = ", resources)
        if (!resources) return;
        for (let i = 0; i < resources.length; i++) resources[i].setPipelineType(pipeline.type);
    }


    protected build() {

        this.createVertexBufferLayout();
        this.createLayouts();

    }


    public update(o?: any) {
        if (o) {

        }
        //must be overided
    }


    public getResourceName(resource: any) {

        if (resource instanceof VertexAttribute) {
            if (this.type !== "render") {
                const buffer: VertexBuffer = resource.vertexBuffer;
                const bufferName: string = this.bindGroups.getNameByResource(buffer);
                return bufferName + "." + resource.name;
            } else {
                return resource.name;
            }
        } else {

            if (resource.uniformBuffer) {
                const bufferName: string = this.bindGroups.getNameByResource(resource.uniformBuffer);
                return bufferName + "." + resource.name;
            } else {
                return this.bindGroups.getNameByResource(resource);
            }
        }
    }



    public createPipelineInstanceArray(resources: (PrimitiveFloatUniform | PrimitiveIntUniform | PrimitiveUintUniform | IShaderResource)[], nbInstance: number): any[] {
        this.pipelineCount = nbInstance;

        const result: any[] = [];

        let instance: any;
        let resource: any
        let clonedUniformBuffers: any;


        const resourceNames: string[] = [];
        const resourceBindgroup: Bindgroup[] = [];
        const resourceUniformBufferName: string[] = [];
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

                //console.log("resource = ", resource)


                if (resource instanceof PrimitiveFloatUniform || resource instanceof PrimitiveIntUniform || resource instanceof PrimitiveUintUniform) {
                    const uniformBufferName = resourceUniformBufferName[i];//bindgroup.getResourceName(resource.uniformBuffer);
                    //console.log("uniformBufferName = ", uniformBufferName, name)
                    if (!clonedUniformBuffers[uniformBufferName]) {
                        clonedUniformBuffers[uniformBufferName] = resource.uniformBuffer.clone();
                        clonedUniformBuffers[uniformBufferName].name = uniformBufferName;

                        //console.log("cloned uniformBuffer = ", clonedUniformBuffers[uniformBufferName])
                    }
                    //console.log("===>>> uniformBufferName = ", bindgroup.getResourceName(resource.uniformBuffer))
                    instance[uniformBufferName] = clonedUniformBuffers[uniformBufferName];
                    (instance[uniformBufferName] as any).name = clonedUniformBuffers[uniformBufferName].name;
                    (instance[uniformBufferName] as any).bindgroup = bindgroup;
                    instance[name] = clonedUniformBuffers[uniformBufferName].getUniformByName(name);


                } else {
                    instance[name] = resource.clone();
                    (instance[name] as any).bindgroup = bindgroup;
                    (instance[name] as any).name = name;
                }
            }

            const shaderResources: IShaderResource[] = [];

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

                let rebuild: boolean = false;
                if (XGPU.deviceId != instance.deviceId) {
                    rebuild = true;
                    instance.deviceId = XGPU.deviceId;
                }


                let o: any;
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
            }
        }

        return result;
    }
}
