// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { XGPU } from "../XGPU";
import { Bindgroups } from "../shader/Bindgroups";
import { VertexAttribute } from "../shader/resources/VertexAttribute";
import { VertexBuffer } from "../shader/resources/VertexBuffer";
import { ShaderStruct } from "../shader/shaderParts/ShaderStruct";
import { PrimitiveFloatUniform, PrimitiveIntUniform, PrimitiveUintUniform } from "../PrimitiveType";
import { EventDispatcher } from "../EventDispatcher";
export class Pipeline extends EventDispatcher {
    description = {};
    nbVertex;
    bindGroups;
    vertexBuffers;
    vertexShader;
    fragmentShader;
    vertexBufferLayouts;
    gpuBindgroups = [];
    gpuBindGroupLayouts = [];
    gpuPipelineLayout;
    type = null;
    constructor() {
        super();
        this.bindGroups = new Bindgroups(this, "pipeline");
    }
    get isComputePipeline() { return this.type === "compute" || this.type === "compute_mixed"; }
    get isRenderPipeline() { return this.type === "render"; }
    get isMixedPipeline() { return this.type === "compute_mixed"; }
    _resources;
    get resources() { return this._resources; }
    debug;
    clearAfterDeviceLostAndRebuild() {
        this.bindGroups.clearAfterDeviceLost();
        this.vertexBufferLayouts = undefined;
        this.gpuPipelineLayout = undefined;
        this.gpuBindGroupLayouts = [];
        this.gpuBindgroups = [];
        //this.build();
    }
    initFromObject(obj) {
        this._resources = obj;
    }
    pipelineCount = 1;
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
        ;
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
                    group.entries[k] = resource.createBindGroupEntry(k);
                    //console.log(k, " AAAAA layout.entries ", layout.entries[k]);
                    //console.log(k, " AAAAA group.entries ", group.entries[k]);
                    k++;
                }
            }
            if (k > 0) {
                //console.log(i, " layout : ", layout);
                group.layout = this.gpuBindGroupLayouts[n] = XGPU.createBindgroupLayout(layout);
                //console.log(i, " group : ", group);
                this.gpuBindgroups[n] = XGPU.createBindgroup(group);
                n++;
                //console.log("-----")
                //console.log(layout);
                //console.log(group)
            }
        }
        //console.log("this.gpuBindGroupLayouts", this.gpuBindGroupLayouts)
        this.gpuPipelineLayout = XGPU.createPipelineLayout({ bindGroupLayouts: this.gpuBindGroupLayouts });
    }
    initPipelineResources(pipeline) {
        const resources = this.bindGroups.resources.all;
        //console.log("all = ", resources)
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
        if (o) {
        }
        //must be overided
    }
    getResourceName(resource) {
        if (resource instanceof VertexAttribute) {
            if (this.type !== "render") {
                const buffer = resource.vertexBuffer;
                const bufferName = this.bindGroups.getNameByResource(buffer);
                return bufferName + "." + resource.name;
            }
            else {
                return resource.name;
            }
        }
        else {
            if (resource.uniformBuffer) {
                const bufferName = this.bindGroups.getNameByResource(resource.uniformBuffer);
                return bufferName + "." + resource.name;
            }
            else {
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
                //console.log("resource = ", resource)
                if (resource instanceof PrimitiveFloatUniform || resource instanceof PrimitiveIntUniform || resource instanceof PrimitiveUintUniform) {
                    const uniformBufferName = resourceUniformBufferName[i]; //bindgroup.getResourceName(resource.uniformBuffer);
                    //console.log("uniformBufferName = ", uniformBufferName, name)
                    if (!clonedUniformBuffers[uniformBufferName]) {
                        clonedUniformBuffers[uniformBufferName] = resource.uniformBuffer.clone();
                        clonedUniformBuffers[uniformBufferName].name = uniformBufferName;
                        //console.log("cloned uniformBuffer = ", clonedUniformBuffers[uniformBufferName])
                    }
                    //console.log("===>>> uniformBufferName = ", bindgroup.getResourceName(resource.uniformBuffer))
                    instance[uniformBufferName] = clonedUniformBuffers[uniformBufferName];
                    instance[uniformBufferName].name = clonedUniformBuffers[uniformBufferName].name;
                    instance[uniformBufferName].bindgroup = bindgroup;
                    instance[name] = clonedUniformBuffers[uniformBufferName].getUniformByName(name);
                }
                else {
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
