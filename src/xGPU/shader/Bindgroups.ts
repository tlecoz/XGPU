// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { PrimitiveFloatUniform, PrimitiveIntUniform, PrimitiveUintUniform } from "./PrimitiveType";
import { DepthStencilTexture } from "../pipelines/resources/textures/DepthStencilTexture";
import { XGPU } from "../XGPU";
import { Bindgroup } from "./Bindgroup";
import { CubeMapTexture } from "./resources/CubeMapTexture";
import { ImageTexture } from "./resources/ImageTexture";
import { IShaderResource } from "./resources/IShaderResource";
import { TextureSampler } from "./resources/TextureSampler";
import { UniformBuffer } from "./resources/UniformBuffer";
import { VertexBuffer } from "./resources/VertexBuffer";
import { VideoTexture } from "./resources/VideoTexture";
import { ImageTextureArray } from "./resources/ImageTextureArray";
import { CubeMapTextureArray } from "./resources/CubeMapTextureArray";
import { DepthTextureArray } from "../pipelines/resources/textures/DepthTextureArray";

export class Bindgroups {



    public parent: Bindgroups;
    public groups: Bindgroup[] = [];
    private _name: string;



    constructor(name: string) {
        this._name = name;

    }


    public get name(): string { return this._name; }


    public build(autoLayout: boolean = false) {

        const description: any = {};
        const layouts: GPUBindGroupLayout[] = [];
        const bindgroups: GPUBindGroup[] = [];



        for (let i = 0; i < this.groups.length; i++) {

            if (!autoLayout) layouts[i] = this.groups[i].layout;
            bindgroups[i] = this.groups[i].group;
        }

        if (autoLayout) description.layout = "auto";
        else {
            //console.log("pipelineLayout = ", layouts)
            description.layout = XGPU.createPipelineLayout({ bindGroupLayouts: layouts });
        }


        const { vertexLayouts, buffers, nbVertex } = this.createVertexBufferLayout();

        description.vertex = {
            buffers: vertexLayouts
        }

        return {
            description,
            bindgroups,
            buffers,
            nbVertex
        }

    }

    public getBindgroupByResource(resource: IShaderResource): Bindgroup {
        let group: Bindgroup, element: IShaderResource;
        for (let i = 0; i < this.groups.length; i++) {
            group = this.groups[i];
            for (let j = 0; j < group.elements.length; j++) {
                element = group.elements[j].resource;
                if (element === resource) return group;
            }
        }
        return null;
    }


    public apply(passEncoder: GPURenderPassEncoder | GPUComputePassEncoder): void {
        for (let i = 0; i < this.groups.length; i++) {
            //console.log("setBindgroup ", i, this.groups[i])
            passEncoder.setBindGroup(i, this.groups[i].group);
        }
    }

    public update(): void {
        for (let i = 0; i < this.groups.length; i++) {
            this.groups[i].update();
        }
    }

    public getVertexShaderDeclaration(): { result: string, variables: string } {
        //console.log("getVertexShaderDeclaration")
        let result: string = "";
        let group: Bindgroup;
        let resources: { name: string, resource: IShaderResource }[];
        let resource: IShaderResource;
        let name: string;
        let k: number = 0;

        const obj = { result: "", variables: "" };

        /*
        const structNames: string[] = [];
        const removeAlreadyDefinedStruct = (source: string) => {
            let lines: string[] = source.split("\n");
            let result: string = "";
            let openStruct: boolean = false;
            let canWrite: boolean = true;
            let line: string;
            let delay: number = 0;

            for (let i = 0; i < lines.length; i++) {
                line = lines[i].trim();

                if (line.substring(0, "struct ".length) === "struct ") {
                    const name = line.split(" ")[1].split("{")[0];
                    openStruct = true;
                    if (structNames.indexOf(name) === -1) {
                        structNames.push(name);
                        canWrite = true;
                    } else {
                        canWrite = false;
                    }
                } else {
                    if (openStruct && line.indexOf("}") !== -1) {
                        openStruct = false;
                        if (!canWrite) delay = 1;
                        canWrite = true;
                    }
                }

                if (canWrite && delay-- <= 0) result += lines[i] + "\n";
            }

            return result;
        }
        */
        //---------------

        for (let i = 0; i < this.groups.length; i++) {
            group = this.groups[i];
            resources = group.elements;
            k = 0;
            for (let j = 0; j < resources.length; j++) {
                resource = resources[j].resource;
                if (resource instanceof VertexBuffer) continue;
                name = resources[j].name;


                if (resource instanceof UniformBuffer) {
                    console.log("=====> ", name, resource)
                    /*if (resource.group.name) {
                        resource.group = resource.group.clone();
                        resource.group.name = undefined;
                    }*/

                    const s: { struct: string, localVariables: string } = resource.createStruct(name);
                    obj.variables += s.localVariables;
                    //result += removeAlreadyDefinedStruct(s.struct);
                    result += s.struct;

                }

                result += resource.createDeclaration(name, k++, i) + "\n";




            }

        }
        obj.result = result;
        return obj;
    }

    public getFragmentShaderDeclaration(): { result: string, variables: string } {
        let result: string = "";
        let group: Bindgroup;
        let resources: { name: string, resource: IShaderResource }[];
        let resource: IShaderResource;
        let name: string;
        let k: number = 0;

        const obj = { result: "", variables: "" };

        for (let i = 0; i < this.groups.length; i++) {
            group = this.groups[i];
            resources = group.elements;
            k = 0;
            for (let j = 0; j < resources.length; j++) {
                resource = resources[j].resource;
                if (resource instanceof VertexBuffer) continue;
                name = resources[j].name;
                if (resource instanceof UniformBuffer) {
                    let item;
                    for (let z in resource.items) {
                        item = resource.items[z];
                        let _name = name.substring(0, 1).toLowerCase() + name.slice(1);
                        if (item.propertyNames) result += item.createStruct() + "\n";
                        if (item.createVariableInsideMain) obj.variables += item.createVariable(_name) + "\n"
                    }
                    result += resource.createStruct(name).struct + "\n";

                }
                result += resource.createDeclaration(name, k++, i) + "\n";
            }
        }
        obj.result = result;
        return obj;
    }

    public getComputeShaderDeclaration(): { result: string, variables: string } {
        let result: string = "";
        let group: Bindgroup;
        let resources: { name: string, resource: IShaderResource }[];
        let resource: IShaderResource;
        let name: string;
        let k: number = 0;

        const obj = { result: "", variables: "" };

        for (let i = 0; i < this.groups.length; i++) {
            group = this.groups[i];
            resources = group.elements;
            k = 0;
            for (let j = 0; j < resources.length; j++) {
                resource = resources[j].resource;
                name = resources[j].name;

                if (resource instanceof VertexBuffer) {




                } else if (resource instanceof UniformBuffer) {

                    let item;
                    for (let z in resource.items) {
                        item = resource.items[z];
                        let _name = name.substring(0, 1).toLowerCase() + name.slice(1);
                        if (item.propertyNames) result += item.createStruct() + "\n";
                        if (item.createVariableInsideMain) obj.variables += item.createVariable(_name) + "\n"
                    }
                    result += resource.createStruct(name).struct + "\n";
                }
                result += resource.createDeclaration(name, k++, i) + "\n";
            }
        }
        obj.result = result;
        return obj;
    }


    protected createVertexBufferLayout(): { vertexLayouts: Iterable<GPUVertexBufferLayout>, buffers: VertexBuffer[], nbVertex: number } {
        const vertexLayouts: Iterable<GPUVertexBufferLayout> = [];
        const buffers: VertexBuffer[] = [];

        let group: Bindgroup;
        let resources: { name: string, resource: IShaderResource }[];
        let resource: IShaderResource;

        let k: number = 0;
        let builtin: number = 0;
        let nbVertex: number = 0;
        for (let j = 0; j < this.groups.length; j++) {
            group = this.groups[j];
            resources = group.elements;


            for (let i = 0; i < resources.length; i++) {

                resource = resources[i].resource;
                if (resource instanceof VertexBuffer) {

                    nbVertex = Math.max(nbVertex, resource.nbVertex)
                    buffers[k] = resource;
                    vertexLayouts[k++] = resource.createVertexBufferLayout(builtin);

                    builtin += resource.vertexArrays.length;
                }
            }
        }


        return {
            vertexLayouts,
            buffers,
            nbVertex
        }
    }



    public handleRenderPipelineResourceIOs() {
        for (let i = 0; i < this.groups.length; i++) {
            this.groups[i].handleRenderPipelineResourceIOs();
        }
    }

    public handleComputePipelineResourceIOs() {
        for (let i = 0; i < this.groups.length; i++) {
            //console.log(i, this.groups[i])
            this.groups[i].handleComputePipelineResourceIOs();
        }
    }


    protected _resources: any = {};
    public get resources(): any { return this._resources }

    public add(bindgroup: Bindgroup | Bindgroups): (Bindgroup | Bindgroups) {

        bindgroup.parent = this;
        let resource = this._resources
        if (!this._resources.all) this._resources.all = [];
        if (!this._resources.types) this._resources.types = {};

        const types = this._resources.types;




        const addResources = (res: any, elements: { name: string, resource: IShaderResource }[]) => {
            //console.log("call addResource ", elements)
            let element: { name: string, resource: IShaderResource };
            let r: IShaderResource;
            for (let i = 0; i < elements.length; i++) {
                element = elements[i];
                //console.log(element.name)
                if (res[element.name]) continue;
                //console.log("addResources ", i, element)
                r = element.resource;
                if (this._resources.all.indexOf(r) === -1) this._resources.all.push(r);
                res[element.name] = element.resource;

                if (r instanceof DepthTextureArray) {
                    if (!types.depthTextureArrays) types.depthTextureArrays = [];
                    if (types.depthTextureArrays.indexOf(element) === -1) types.depthTextureArrays.push(element);
                } else if (r instanceof CubeMapTextureArray) {
                    if (!types.cubeMapTextureArrays) types.cubeMapTextureArrays = [];
                    if (types.cubeMapTextureArrays.indexOf(element) === -1) types.cubeMapTextureArrays.push(element);
                } else if (r instanceof ImageTextureArray) {
                    if (!types.imageTextureArrays) types.imageTextureArrays = [];
                    if (types.imageTextureArrays.indexOf(element) === -1) types.imageTextureArrays.push(element);
                } else if (r instanceof UniformBuffer) {
                    if (!types.uniformBuffers) types.uniformBuffers = [];
                    if (types.uniformBuffers.indexOf(element) === -1) types.uniformBuffers.push(element);
                } else if (r instanceof VertexBuffer) {
                    if (!types.vertexBuffers) types.vertexBuffers = [];
                    if (types.vertexBuffers.indexOf(element) === -1) types.vertexBuffers.push(element);
                } else if (r instanceof CubeMapTexture) {
                    if (!types.cubeMapTexture) types.cubeMapTexture = [];
                    if (types.cubeMapTexture.indexOf(element) === -1) types.cubeMapTexture.push(element);
                } else if (r instanceof ImageTexture) {
                    if (!types.imageTextures) types.imageTextures = [];
                    if (types.imageTextures.indexOf(element) === -1) types.imageTextures.push(element);
                } else if (r instanceof VideoTexture) {
                    if (!types.videoTexture) types.videoTexture = [];
                    if (types.videoTexture.indexOf(element) === -1) types.videoTexture.push(element);
                } else if (r instanceof TextureSampler) {
                    if (!types.sampler) types.sampler = [];
                    if (types.sampler.indexOf(element) === -1) types.sampler.push(element);
                } else if (r instanceof DepthStencilTexture) {
                    if (!types.depthStencilTextures) types.depthStencilTextures = [];
                    if (types.depthStencilTextures.indexOf(element) === -1) types.depthStencilTextures.push(element);
                }

            }

            //console.log("this.resources = ", this.resources.all.length)
        }


        const addGroup = (o: Bindgroup) => {
            //console.log("addGroup ", o.name, o.elements)
            const res: any = resource[o.name] = {};
            if (!res.types) res.types = {};

            addResources(res, o.elements)

            this.groups.push(o);
        }


        if (bindgroup instanceof Bindgroup) {
            if (this.groups.indexOf(bindgroup) === -1) addGroup(bindgroup);
            else {
                //console.log("=> ", bindgroup.name)
                addResources(resource[bindgroup.name], bindgroup.elements)
            }
        } else {
            resource = resource[bindgroup.name] = {};
            let o;
            for (let i = 0; i < bindgroup.groups.length; i++) {
                o = bindgroup.groups[i];
                if (this.groups.indexOf(o) === -1) addGroup(o);
            }
        }

        return bindgroup;
    }

    public copy(options?: { oldGroups: Bindgroup[], replacedGroup: Bindgroup[] }): Bindgroups {
        const obj = new Bindgroups(this._name);
        const groups = this.groups.concat();
        if (options) {
            for (let i = 0; i < options.oldGroups.length; i++) {
                groups.splice(groups.indexOf(options.oldGroups[i]), 1, options.replacedGroup[i]);
            }
        }

        obj.groups = groups;
        return obj;
    }


    public propertyNameIsUsed(propertyName: string): boolean {
        for (let i = 0; i < this.groups.length; i++) {
            if (this.groups[i].get(propertyName)) return true
        }
        return false;
    }
    public get(propertyName: string): IShaderResource {
        let o: IShaderResource;
        for (let i = 0; i < this.groups.length; i++) {
            o = this.groups[i].get(propertyName);
            if (o) return o;
        }
        return null;
    }

    public getGroupByPropertyName(name: string): Bindgroup {
        let o: IShaderResource;
        for (let i = 0; i < this.groups.length; i++) {
            o = this.groups[i].get(name);
            if (o) return this.groups[i];
        }
        return null;
    }

    public getGroupByName(name: string): Bindgroup {
        for (let i = 0; i < this.groups.length; i++) {
            if (this.groups[i].name === name) return this.groups[i];
        }
        return null;
    }

    public getNameByResource(resource: IShaderResource | PrimitiveFloatUniform | PrimitiveIntUniform | PrimitiveUintUniform): string {

        if (resource instanceof PrimitiveFloatUniform || resource instanceof PrimitiveIntUniform || resource instanceof PrimitiveUintUniform) {
            return resource.name;
        }


        let elements: { name: string, resource: IShaderResource }[];

        for (let i = 0; i < this.groups.length; i++) {
            elements = this.groups[i].elements;
            for (let j = 0; j < elements.length; j++) {
                if (elements[j].resource === resource) {
                    return elements[j].name;
                }
            }
        }




        return null;
    }

    public get current(): Bindgroup {
        return this.groups[this.groups.length - 1]
    }


    public destroy() {
        for (let i = 0; i < this.groups.length; i++) {
            this.groups[i].destroy();
            this.groups[i] = undefined;
        }
        this.groups = [];
    }
}