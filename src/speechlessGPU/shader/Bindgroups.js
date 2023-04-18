import { DepthStencilTexture } from "../pipelines/resources/textures/DepthStencilTexture";
import { SLGPU } from "../SLGPU";
import { Bindgroup } from "./Bindgroup";
import { CubeMapTexture } from "./resources/CubeMapTexture";
import { ImageTexture } from "./resources/ImageTexture";
import { TextureSampler } from "./resources/TextureSampler";
import { UniformBuffer } from "./resources/UniformBuffer";
import { VertexBuffer } from "./resources/VertexBuffer";
import { VideoTexture } from "./resources/VideoTexture";
export class Bindgroups {
    parent;
    groups = [];
    _name;
    constructor(name) {
        this._name = name;
    }
    get name() { return this._name; }
    build(autoLayout = false) {
        const description = {};
        const layouts = [];
        const bindgroups = [];
        for (let i = 0; i < this.groups.length; i++) {
            if (!autoLayout)
                layouts[i] = this.groups[i].layout;
            bindgroups[i] = this.groups[i].group;
        }
        if (autoLayout)
            description.layout = "auto";
        else {
            //console.log("pipelineLayout = ", layouts)
            description.layout = SLGPU.createPipelineLayout({ bindGroupLayouts: layouts });
        }
        const { vertexLayouts, buffers, nbVertex } = this.createVertexBufferLayout();
        description.vertex = {
            buffers: vertexLayouts
        };
        return {
            description,
            bindgroups,
            buffers,
            nbVertex
        };
    }
    getBindgroupByResource(resource) {
        let group, element;
        for (let i = 0; i < this.groups.length; i++) {
            group = this.groups[i];
            for (let j = 0; j < group.elements.length; j++) {
                element = group.elements[j].resource;
                if (element === resource)
                    return group;
            }
        }
        return null;
    }
    apply(passEncoder) {
        for (let i = 0; i < this.groups.length; i++) {
            //console.log("setBindgroup ", i, this.groups[i])
            passEncoder.setBindGroup(i, this.groups[i].group);
        }
    }
    update() {
        for (let i = 0; i < this.groups.length; i++) {
            this.groups[i].update();
        }
    }
    getVertexShaderDeclaration() {
        //console.log("getVertexShaderDeclaration")
        let result = "";
        let group;
        let resources;
        let resource;
        let name;
        let k = 0;
        const obj = { result: "", variables: "" };
        for (let i = 0; i < this.groups.length; i++) {
            group = this.groups[i];
            resources = group.elements;
            k = 0;
            for (let j = 0; j < resources.length; j++) {
                resource = resources[j].resource;
                if (resource instanceof VertexBuffer)
                    continue;
                name = resources[j].name;
                //console.log("=====> ", resource, resource instanceof VertexBuffer)
                if (resource instanceof UniformBuffer) {
                    let item;
                    //console.log("uniforms = ", resource.items)
                    for (let z in resource.items) {
                        item = resource.items[z];
                        let _name = name.substring(0, 1).toLowerCase() + name.slice(1);
                        if (item.propertyNames)
                            result += item.createStruct() + "\n";
                        if (item.createVariableInsideMain)
                            obj.variables += item.createVariable(_name) + "\n";
                    }
                    result += resource.createStruct(name).struct + "\n";
                }
                result += resource.createDeclaration(name, k++, i) + "\n";
            }
        }
        obj.result = result;
        return obj;
    }
    getFragmentShaderDeclaration() {
        let result = "";
        let group;
        let resources;
        let resource;
        let name;
        let k = 0;
        const obj = { result: "", variables: "" };
        for (let i = 0; i < this.groups.length; i++) {
            group = this.groups[i];
            resources = group.elements;
            k = 0;
            for (let j = 0; j < resources.length; j++) {
                resource = resources[j].resource;
                if (resource instanceof VertexBuffer)
                    continue;
                name = resources[j].name;
                if (resource instanceof UniformBuffer) {
                    let item;
                    for (let z in resource.items) {
                        item = resource.items[z];
                        let _name = name.substring(0, 1).toLowerCase() + name.slice(1);
                        if (item.propertyNames)
                            result += item.createStruct() + "\n";
                        if (item.createVariableInsideMain)
                            obj.variables += item.createVariable(_name) + "\n";
                    }
                    result += resource.createStruct(name).struct + "\n";
                }
                result += resource.createDeclaration(name, k++, i) + "\n";
            }
        }
        obj.result = result;
        return obj;
    }
    getComputeShaderDeclaration() {
        let result = "";
        let group;
        let resources;
        let resource;
        let name;
        let k = 0;
        const obj = { result: "", variables: "" };
        for (let i = 0; i < this.groups.length; i++) {
            group = this.groups[i];
            resources = group.elements;
            k = 0;
            for (let j = 0; j < resources.length; j++) {
                resource = resources[j].resource;
                name = resources[j].name;
                if (resource instanceof VertexBuffer) {
                }
                else if (resource instanceof UniformBuffer) {
                    let item;
                    for (let z in resource.items) {
                        item = resource.items[z];
                        let _name = name.substring(0, 1).toLowerCase() + name.slice(1);
                        if (item.propertyNames)
                            result += item.createStruct() + "\n";
                        if (item.createVariableInsideMain)
                            obj.variables += item.createVariable(_name) + "\n";
                    }
                    result += resource.createStruct(name).struct + "\n";
                }
                result += resource.createDeclaration(name, k++, i) + "\n";
            }
        }
        obj.result = result;
        return obj;
    }
    createVertexBufferLayout() {
        const vertexLayouts = [];
        const buffers = [];
        let group;
        let resources;
        let resource;
        let k = 0;
        let builtin = 0;
        let nbVertex = 0;
        for (let j = 0; j < this.groups.length; j++) {
            group = this.groups[j];
            resources = group.elements;
            for (let i = 0; i < resources.length; i++) {
                resource = resources[i].resource;
                if (resource instanceof VertexBuffer) {
                    nbVertex = Math.max(nbVertex, resource.nbVertex);
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
        };
    }
    handleRenderPipelineResourceIOs() {
        for (let i = 0; i < this.groups.length; i++) {
            this.groups[i].handleRenderPipelineResourceIOs();
        }
    }
    handleComputePipelineResourceIOs() {
        for (let i = 0; i < this.groups.length; i++) {
            //console.log(i, this.groups[i])
            this.groups[i].handleComputePipelineResourceIOs();
        }
    }
    _resources = {};
    get resources() { return this._resources; }
    add(bindgroup) {
        bindgroup.parent = this;
        let resource = this._resources;
        if (!this._resources.all)
            this._resources.all = [];
        if (!this._resources.types)
            this._resources.types = {};
        const types = this._resources.types;
        const addResources = (res, elements) => {
            //console.log("call addResource ", elements)
            let element;
            let r;
            for (let i = 0; i < elements.length; i++) {
                element = elements[i];
                //console.log(element.name)
                if (res[element.name])
                    continue;
                //console.log("addResources ", i, element)
                r = element.resource;
                if (this._resources.all.indexOf(r) === -1)
                    this._resources.all.push(r);
                res[element.name] = element.resource;
                if (r instanceof UniformBuffer) {
                    if (!types.uniformBuffers)
                        types.uniformBuffers = [];
                    if (types.uniformBuffers.indexOf(element) === -1)
                        types.uniformBuffers.push(element);
                }
                else if (r instanceof VertexBuffer) {
                    if (!types.vertexBuffers)
                        types.vertexBuffers = [];
                    if (types.vertexBuffers.indexOf(element) === -1)
                        types.vertexBuffers.push(element);
                }
                else if (r instanceof ImageTexture) {
                    if (!types.imageTextures)
                        types.imageTextures = [];
                    if (types.imageTextures.indexOf(element) === -1)
                        types.imageTextures.push(element);
                }
                else if (r instanceof VideoTexture) {
                    if (!types.videoTexture)
                        types.videoTexture = [];
                    if (types.videoTexture.indexOf(element) === -1)
                        types.videoTexture.push(element);
                }
                else if (r instanceof CubeMapTexture) {
                    if (!types.cubeMapTexture)
                        types.cubeMapTexture = [];
                    if (types.cubeMapTexture.indexOf(element) === -1)
                        types.cubeMapTexture.push(element);
                }
                else if (r instanceof TextureSampler) {
                    if (!types.sampler)
                        types.sampler = [];
                    if (types.sampler.indexOf(element) === -1)
                        types.sampler.push(element);
                }
                else if (r instanceof DepthStencilTexture) {
                    if (!types.depthStencilTextures)
                        types.depthStencilTextures = [];
                    if (types.depthStencilTextures.indexOf(element) === -1)
                        types.depthStencilTextures.push(element);
                }
            }
            //console.log("this.resources = ", this.resources.all.length)
        };
        const addGroup = (o) => {
            //console.log("addGroup ", o.name, o.elements)
            const res = resource[o.name] = {};
            if (!res.types)
                res.types = {};
            addResources(res, o.elements);
            this.groups.push(o);
        };
        if (bindgroup instanceof Bindgroup) {
            if (this.groups.indexOf(bindgroup) === -1)
                addGroup(bindgroup);
            else {
                //console.log("=> ", bindgroup.name)
                addResources(resource[bindgroup.name], bindgroup.elements);
            }
        }
        else {
            resource = resource[bindgroup.name] = {};
            let o;
            for (let i = 0; i < bindgroup.groups.length; i++) {
                o = bindgroup.groups[i];
                if (this.groups.indexOf(o) === -1)
                    addGroup(o);
            }
        }
        return bindgroup;
    }
    copy(options) {
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
    propertyNameIsUsed(propertyName) {
        for (let i = 0; i < this.groups.length; i++) {
            if (this.groups[i].get(propertyName))
                return true;
        }
        return false;
    }
    get(propertyName) {
        let o;
        for (let i = 0; i < this.groups.length; i++) {
            o = this.groups[i].get(propertyName);
            if (o)
                return o;
        }
        return null;
    }
    getNameByResource(resource) {
        let elements;
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
    get current() {
        return this.groups[this.groups.length - 1];
    }
    destroy() {
        for (let i = 0; i < this.groups.length; i++) {
            this.groups[i].destroy();
            this.groups[i] = undefined;
        }
        this.groups = [];
    }
}
