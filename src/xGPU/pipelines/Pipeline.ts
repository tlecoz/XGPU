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
import { BuiltIns } from "../BuiltIns";
import { UniformBuffer } from "../shader/resources/UniformBuffer";
import { PrimitiveFloatUniform, PrimitiveIntUniform, PrimitiveType, PrimitiveUintUniform } from "../shader/PrimitiveType";
import { ImageTexture } from "../shader/resources/ImageTexture";
import { TextureSampler } from "../shader/resources/TextureSampler";
import { VideoTexture } from "../shader/resources/VideoTexture";
import { CubeMapTexture } from "../shader/resources/CubeMapTexture";
import { VertexBufferIO } from "../shader/resources/VertexBufferIO";
import { ImageTextureIO } from "../shader/resources/ImageTextureIO";
import { UniformGroup } from "../shader/resources/UniformGroup";
import { UniformGroupArray } from "../shader/resources/UniformGroupArray";
import { ImageTextureArray } from "../shader/resources/ImageTextureArray";


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







    public initFromObject(obj: any) {

        this._resources = obj;
    }

    public pipelineCount: number = 1;

    //=============================== HIGH LEVEL PARSING ================================================================

    protected parseShaderBuiltins(descriptor: any) {

        //------------- COMPUTE INPUTS -----------------

        const addComputeInput = (name: string, val: any) => {
            if (typeof descriptor.computeShader === "string") {
                const main: string = descriptor.computeShader;
                descriptor.computeShader = {
                    main
                }
            }
            if (!descriptor.computeShader.inputs) descriptor.computeShader.inputs = {};
            descriptor.computeShader.inputs[name] = val;
        }
        const checkComputeInputBuiltIns = (name: string, o: any) => {

            for (let z in BuiltIns.computeInputs) {
                if (o === BuiltIns.computeInputs[z]) {
                    addComputeInput(name, o);
                }
            }
        }

        //-------------- COMPUTE OUTPUTS ------------
        const addComputeOutput = (name: string, val: any) => {
            if (typeof descriptor.computeShader === "string") {
                const main: string = descriptor.computeShader;
                descriptor.computeShader = {
                    main
                }
            }
            if (!descriptor.computeShader.outputs) descriptor.computeShader.outputs = {};
            descriptor.computeShader.outputs[name] = val;
        }
        const checkComputeOutputBuiltIns = (name: string, o: any) => {
            for (let z in BuiltIns.computeOutputs) {
                if (o === BuiltIns.computeOutputs[z]) {
                    addComputeOutput(name, o);
                }
            }
        }



        //------------- VERTEX INPUTS -----------------

        const addVertexInput = (name: string, val: any) => {
            if (typeof descriptor.vertexShader === "string") {
                const main: string = descriptor.vertexShader;
                descriptor.vertexShader = {
                    main
                }
            }
            if (!descriptor.vertexShader.inputs) descriptor.vertexShader.inputs = {};
            descriptor.vertexShader.inputs[name] = val;
        }
        const checkVertexInputBuiltIns = (name: string, o: any) => {

            for (let z in BuiltIns.vertexInputs) {
                if (o === BuiltIns.vertexInputs[z]) {
                    addVertexInput(name, o);
                }
            }
        }

        //-------------- VERTEX OUTPUTS ------------
        const addVertexOutput = (name: string, val: any) => {
            if (typeof descriptor.vertexShader === "string") {
                const main: string = descriptor.vertexShader;
                descriptor.vertexShader = {
                    main
                }
            }
            if (!descriptor.vertexShader.outputs) descriptor.vertexShader.outputs = {};
            descriptor.vertexShader.outputs[name] = val;
        }
        const checkVertexOutputBuiltIns = (name: string, o: any) => {
            for (let z in BuiltIns.vertexOutputs) {
                if (o === BuiltIns.vertexOutputs[z]) {
                    addVertexOutput(name, o);
                }
            }
        }

        //------------- FRAGMENT INPUTS -----------------

        const addFragmentInput = (name: string, val: any) => {
            if (typeof descriptor.fragmentShader === "string") {
                const main: string = descriptor.fragmentShader;
                descriptor.fragmentShader = {
                    main
                }
            }
            if (!descriptor.fragmentShader.inputs) descriptor.fragmentShader.inputs = {};
            descriptor.fragmentShader.inputs[name] = val;
        }
        const checkFragmentInputBuiltIns = (name: string, o: any) => {

            for (let z in BuiltIns.fragmentInputs) {
                if (o === BuiltIns.vertexInputs[z]) {
                    addFragmentInput(name, o);
                }
            }
        }

        //-------------- FRAGMENT OUTPUTS ------------
        const addFragmentOutput = (name: string, val: any) => {
            if (typeof descriptor.fragmentShader === "string") {
                const main: string = descriptor.fragmentShader;
                descriptor.fragmentShader = {
                    main
                }
            }
            if (!descriptor.fragmentShader.outputs) descriptor.fragmentShader.outputs = {};
            descriptor.fragmentShader.outputs[name] = val;
        }
        const checkFragmentOutputBuiltIns = (name: string, o: any) => {
            for (let z in BuiltIns.fragmentOutputs) {
                if (o === BuiltIns.fragmentOutputs[z]) {
                    addFragmentOutput(name, o);
                }
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) {
                checkVertexInputBuiltIns(z, o);
                checkVertexOutputBuiltIns(z, o);
                checkFragmentInputBuiltIns(z, o);
                checkFragmentOutputBuiltIns(z, o);
                checkComputeInputBuiltIns(z, o);
                checkComputeOutputBuiltIns(z, o);
            }
        }

        return descriptor;
    }

    protected parseVertexBufferIOs(descriptor: any) {

        const addVertexBufferIO = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.io) descriptor.bindgroups.io = {};
            descriptor.bindgroups.io[name] = o;
            return o;
        }

        const checkVertexBufferIO = (name: string, o: any) => {
            if (o instanceof VertexBufferIO) {
                addVertexBufferIO(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkVertexBufferIO(z, o);
        }

        return descriptor;
    }

    protected parseImageTextureIOs(descriptor: any) {

        const addTextureIO = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.io) descriptor.bindgroups.io = {};
            descriptor.bindgroups.io[name] = o;
            return o;
        }

        const checkTextureIO = (name: string, o: any) => {
            if (o instanceof ImageTextureIO) {
                addTextureIO(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkTextureIO(z, o);
        }

        return descriptor;
    }



    protected parseVertexBuffers(descriptor: any) {

        const addVertexBuffer = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
            descriptor.bindgroups.default[name] = o;
            return o;
        }

        const checkVertexBuffer = (name: string, o: any) => {
            if (o instanceof VertexBuffer) {
                addVertexBuffer(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkVertexBuffer(z, o);
        }

        return descriptor;
    }


    protected parseVertexAttributes(descriptor: any) {

        const addVertexAttribute = (name: string, o: any) => {



            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};


            if (!descriptor.bindgroups.default.buffer) {

                const attributes: any = {};
                attributes[name] = o;
                descriptor.bindgroups.default.buffer = new VertexBuffer(attributes);

            } else {
                const attribute = (descriptor.bindgroups.default.buffer as VertexBuffer).createArray(name, o.type, o.offset);
                if (o.datas) attribute.datas = o.datas;
            }

            //console.log("addVertexAttribute ", name, "buffer = ", descriptor.bindgroups.default.buffer)
        }

        const checkVertexAttribute = (name: string, o: any) => {
            if (o.type && VertexAttribute.types[o.type]) {
                addVertexAttribute(name, o);
            } else if (o instanceof VertexAttribute) {

                addVertexAttribute(name, {
                    type: o.format,
                    offset: o.dataOffset,
                    datas: o.datas
                })
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkVertexAttribute(z, o);
        }

        return descriptor;
    }






    protected parseUniformBuffers(descriptor: any) {

        const addUniformBuffer = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
            descriptor.bindgroups.default[name] = o;
            return o;
        }

        const checkUniformBuffer = (name: string, o: any) => {
            if (o instanceof UniformBuffer) {
                addUniformBuffer(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkUniformBuffer(z, o);
        }

        return descriptor;
    }

    protected parseUniform(descriptor: any) {

        const addUniform = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};



            if (!descriptor.bindgroups.default.uniforms) {
                const uniforms: any = {};
                uniforms[name] = o;
                descriptor.bindgroups.default.uniforms = new UniformBuffer(uniforms, { useLocalVariable: true });
            } else {
                (descriptor.bindgroups.default.uniforms as UniformBuffer).add(name, o);
            }

            //console.log("addUniform ", name, " vertexBuffer = ", descriptor.bindgroups.default.buffer)
        }

        const checkUniform = (name: string, o: any) => {
            if (o instanceof PrimitiveFloatUniform || o instanceof PrimitiveIntUniform || o instanceof PrimitiveUintUniform || o instanceof UniformGroup || o instanceof UniformGroupArray) {
                addUniform(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkUniform(z, o);
        }

        return descriptor;
    }







    protected parseImageTextureArray(descriptor: any) {

        const addImageTextureArray = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
            descriptor.bindgroups.default[name] = o;
        }

        const checkImageTextureArray = (name: string, o: any) => {
            if (o instanceof ImageTextureArray) {
                addImageTextureArray(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkImageTextureArray(z, o);
        }

        return descriptor;
    }

    protected parseImageTexture(descriptor: any) {

        const addImageTexture = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
            descriptor.bindgroups.default[name] = o;
        }

        const checkImageTexture = (name: string, o: any) => {
            if (o instanceof ImageTexture) {
                addImageTexture(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkImageTexture(z, o);
        }

        return descriptor;
    }


    protected parseTextureSampler(descriptor: any) {

        const addTextureSampler = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
            descriptor.bindgroups.default[name] = o;
        }

        const checkTextureSampler = (name: string, o: any) => {
            if (o instanceof TextureSampler) {
                addTextureSampler(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkTextureSampler(z, o);
        }

        return descriptor;
    }

    protected parseVideoTexture(descriptor: any) {

        const addVideoTexture = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
            descriptor.bindgroups.default[name] = o;
        }

        const checkVideoTexture = (name: string, o: any) => {
            if (o instanceof VideoTexture) {
                addVideoTexture(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkVideoTexture(z, o);
        }

        return descriptor;
    }

    protected parseCubeMapTexture(descriptor: any) {

        const addCubeMapTexture = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
            descriptor.bindgroups.default[name] = o;
        }

        const checkCubeMapTexture = (name: string, o: any) => {
            if (o instanceof CubeMapTexture) {
                addCubeMapTexture(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkCubeMapTexture(z, o);
        }

        return descriptor;
    }




    protected highLevelParse(descriptor: any) {

        descriptor = this.parseShaderBuiltins(descriptor);
        descriptor = this.parseVertexBuffers(descriptor);
        descriptor = this.parseVertexAttributes(descriptor);
        descriptor = this.parseUniformBuffers(descriptor);
        descriptor = this.parseUniform(descriptor);
        descriptor = this.parseImageTexture(descriptor);
        descriptor = this.parseImageTextureArray(descriptor);
        descriptor = this.parseTextureSampler(descriptor);
        descriptor = this.parseVideoTexture(descriptor);
        descriptor = this.parseCubeMapTexture(descriptor);
        descriptor = this.parseVertexBufferIOs(descriptor);
        descriptor = this.parseImageTextureIOs(descriptor);
        //console.log("descriptor = ", descriptor)
        return descriptor;
    }



    private static DEFAULT_VERTEX_BUFFER_ID: number = 2;
    private parseHighLevelObj(descriptor: any) {

        const isBuiltIn = (obj) => {
            for (let z in BuiltIns.vertexInputs) if (BuiltIns.vertexInputs[z] === obj) return true;
            for (let z in BuiltIns.vertexOutputs) if (BuiltIns.vertexOutputs[z] === obj) return true;
            for (let z in BuiltIns.fragmentInputs) if (BuiltIns.fragmentInputs[z] === obj) return true;
            for (let z in BuiltIns.fragmentOutputs) if (BuiltIns.fragmentOutputs[z] === obj) return true;
            for (let z in BuiltIns.computeInputs) if (BuiltIns.computeInputs[z] === obj) return true;
            return false;
        }

        const searchComplexObject = (o: any): any[] => {
            let name: string;
            let obj;
            let objs: any[] = [];
            for (let z in o) {
                //console.log("=> ", z, o[z])
                obj = o[z];
                //if (!obj) continue;
                name = obj.constructor.name;
                if (name === "Object") {
                    if (z !== "bindgroups" && z !== "vertexShader" && z !== "fragmentShader" && z !== "computeShader") {
                        if (!isBuiltIn(obj)) {
                            objs.push({ name, resource: obj });
                            //console.log("######## ", z)
                        }
                    }
                }
            }
            return objs;
        }

        const analyseObjects = (objs: any[]): { primitives: { name: string, containerName: string, resource: PrimitiveType }[], vertexAttributes: { name: string, containerName: string, resource: VertexAttribute }[], shaderResources: { name: string, containerName: string, resource: IShaderResource }[] } => {

            const primitives: { name: string, resource: PrimitiveType, containerName: string }[] = [];
            const vertexAttributes: { name: string, resource: VertexAttribute, containerName: string }[] = [];
            const shaderResources: { name: string, resource: IShaderResource, containerName: string }[] = [];

            let o: any;
            let resource: PrimitiveType | IShaderResource;
            let containerName: string;
            for (let i = 0; i < objs.length; i++) {
                containerName = objs[i].name;
                o = objs[i].resource;

                for (let name in o) {
                    resource = o[name];

                    if (resource instanceof PrimitiveFloatUniform || resource instanceof PrimitiveIntUniform || resource instanceof PrimitiveUintUniform) {
                        primitives.push({ containerName, name, resource });
                    } else if (resource instanceof VertexAttribute) {
                        vertexAttributes.push({ containerName, name, resource });
                    } else {
                        shaderResources.push({ containerName, name, resource });
                    }

                }
            }

            return { primitives, vertexAttributes, shaderResources };
        }

        let objects: any = searchComplexObject(descriptor);
        if (objects.length) {

            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};

            const { primitives, vertexAttributes, shaderResources } = analyseObjects(objects);

            if (primitives.length) {




            }
            //descriptor.bindgroup.default[]

        }


        //descriptor.bindgroups.default.buffer = new VertexBuffer(attributes);



        return descriptor;
    }


    public findAndFixRepetitionInDataStructure(o: any): any {


        this.parseHighLevelObj(o);

        let name: string;
        let obj;
        let exist = {};
        let bindgroup;
        let resource;
        let uniformBuffers: UniformBuffer[] = [];
        let bool;


        for (let z in o.bindgroups) {
            bindgroup = o.bindgroups[z];

            for (let a in bindgroup) {

                resource = bindgroup[a];

                if (resource instanceof UniformBuffer) {
                    bool = true;


                    for (let i = resource.itemNames.length - 1; i >= 0; i--) {
                        name = resource.itemNames[i];
                        obj = resource.items[name];

                        if (!exist[name]) {
                            exist[name] = obj;
                        } else {

                            resource.remove(name);

                            if (resource.itemNames.length === 0) {
                                bool = false;
                            }
                        }
                    }

                    if (bool) uniformBuffers.push(resource);
                    else {
                        bindgroup[a] = undefined;
                    }
                }
                resource = bindgroup[a];
            }
        }








        return o;
    }



    //==============================================================================================================




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

    protected mergeBindgroupShaders(): void {
        /*
        this.vertexShader = new VertexShader();
        this.fragmentShader = new FragmentShader();

        const groups = this.bindGroups.groups;
        let group: Bindgroup;
        let vertex: string = "";
        let fragment: string = "";
        let vertexInputs = [];
        let fragmentInputs = [];
        let vertexOutputs = [];
        let fragmentOutputs = [];


        for (let i = 0; i < groups.length; i++) {
            group = groups[i];
            vertex += group.vertexShader.main.text + "\n";
            fragment += group.fragmentShader.main.text + "\n";

            vertexInputs = vertexInputs.concat(group.vertexShader.inputs);
            vertexOutputs = vertexOutputs.concat(group.vertexShader.outputs);

            fragmentInputs = fragmentInputs.concat(group.fragmentShader.inputs);
            fragmentOutputs = fragmentOutputs.concat(group.fragmentShader.outputs);
        }


        this.vertexShader.main.text = vertex;
        this.vertexShader.inputs = vertexInputs;
        this.vertexShader.outputs = vertexOutputs;

        this.fragmentShader.main.text = fragment;
        this.fragmentShader.inputs = fragmentInputs;
        this.fragmentShader.outputs = fragmentOutputs;
        */
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
                    instance[name].debug = "azerty";
                    console.log("instance[name] = ", instance[name])

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

                    resource.createGpuResource();
                    shaderResources.push(resource);
                }
            }

            instance.apply = () => {
                let o: any;
                for (let i = 0; i < shaderResources.length; i++) {
                    o = shaderResources[i];

                    o.update();
                    //console.log(i, o.name, o)
                    o.bindgroup.set(o.name, o);
                }
                this.update();
            }
        }

        return result;
    }
}
