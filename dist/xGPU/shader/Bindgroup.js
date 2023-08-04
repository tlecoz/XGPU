// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { HighLevelParser } from "../HighLevelParser";
import { IndexBuffer } from "../pipelines/resources/IndexBuffer";
import { XGPU } from "../XGPU";
import { ImageTexture } from "./resources/ImageTexture";
import { ImageTextureIO } from "./resources/ImageTextureIO";
import { UniformBuffer } from "./resources/UniformBuffer";
import { VertexBuffer } from "./resources/VertexBuffer";
import { VertexBufferIO } from "./resources/VertexBufferIO";
import { VideoTexture } from "./resources/VideoTexture";
export class Bindgroup {
    bindgroupId; //the id used in renderPass.setBindgroup
    parent;
    entries = [];
    elements = [];
    mustRefreshBindgroup = false;
    applyDraw = false;
    _layout;
    _group;
    name = "";
    _pingPongBindgroup = null; //used in ComputePipeline and VertexBufferIO
    vertexBufferIO;
    textureIO;
    resourcesIOs = [];
    constructor(descriptor) {
        if (descriptor)
            this.initFromObject(descriptor);
    }
    add(name, resource) {
        if (resource instanceof VideoTexture)
            this.mustRefreshBindgroup = true;
        else if (resource instanceof ImageTexture && (resource.source instanceof GPUTexture || !resource.source)) {
            this.mustRefreshBindgroup = true;
        }
        if (resource instanceof IndexBuffer) {
            this.indexBuffer = resource;
            this.elementByName[name] = resource;
            return resource;
        }
        //console.log("bindgroup.add ", resource)
        if (resource instanceof VertexBufferIO) {
            this.resourcesIOs.push(resource);
            this.mustRefreshBindgroup = true;
            this.vertexBufferIO = resource;
            //console.log("group vertexBufferIO ", this.vertexBufferIO)
            this.elements.push({ name: name, resource: resource.buffers[0] });
            this.elements.push({ name: name + "_out", resource: resource.buffers[1] });
            if (this.parent)
                this.parent.add(this);
            return resource;
        }
        if (resource instanceof ImageTextureIO) {
            this.resourcesIOs.push(resource);
            this.mustRefreshBindgroup = true;
            this.textureIO = resource;
            this.elements.push({ name: name, resource: resource.textures[0] });
            this.elements.push({ name: name + "_out", resource: resource.textures[1] });
            if (this.parent)
                this.parent.add(this);
            return resource;
        }
        if (resource instanceof VideoTexture) {
            resource.addBindgroup(this);
        }
        this.elements.push({ name, resource });
        if (this.parent)
            this.parent.add(this);
        return resource;
    }
    set(name, resource) {
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].name === name) {
                this.elements[i].resource = resource;
            }
        }
    }
    remove(name) {
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].name === name) {
                this.elements.splice(i, 1);
            }
        }
    }
    getResourceName(resource) {
        for (let i = 0; i < this.elements.length; i++) {
            if (resource === this.elements[i].resource) {
                return this.elements[i].name;
            }
        }
        return null;
    }
    get(name) {
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].name === name)
                return this.elements[i].resource;
        }
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].resource instanceof UniformBuffer) {
                if (this.elements[i].resource.items[name]) {
                    return this.elements[i].resource;
                }
            }
        }
        return null;
    }
    initFromObject(descriptor) {
        //console.log("group.initFromObject ", object)
        let object = descriptor;
        let isArray = false;
        if (descriptor instanceof Array) {
            isArray = true;
            object = descriptor[0];
        }
        HighLevelParser.parse(object, "bindgroup");
        const result = [];
        let k = 0;
        let o;
        for (let z in object) {
            o = object[z];
            if (!o)
                continue;
            //console.log(z + " : " + o.create)
            if (o.createGpuResource || o instanceof VertexBufferIO || o instanceof ImageTextureIO) { //if it's a shader resource 
                result[k++] = this.add(z, o);
            }
        }
        //console.log("object = ", object)
        if (isArray) {
            for (let i = 0; i < descriptor.length; i++) {
                this.createInstance(descriptor[i]);
            }
        }
        //console.warn("bindgroup.initFromObject result = ", result)
        return result;
    }
    //---------------------------------------------------------------------------
    clearAfterDeviceLost() {
        this._layout = null;
        this._group = null;
        this.setupApplyCompleted = false;
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].resource.destroyGpuResource();
        }
        if (this.instances) {
            let elements, resource;
            let instance;
            for (let i = 0; i < this.instances.length; i++) {
                instance = this.instances[i];
                instance.group = undefined;
                elements = instance.elements;
                if (instance.indexBuffer)
                    instance.indexBuffer.createGpuResource();
                for (let j = 0; j < elements.length; j++) {
                    resource = elements[j].resource;
                    //console.log(j, resource)
                    if (resource.gpuResource) {
                        resource.destroyGpuResource();
                    }
                }
            }
        }
    }
    ;
    deviceId = 0;
    buildLayout() {
        this.deviceId = XGPU.deviceId;
        this.io_index = 0;
        const layout = { entries: [] };
        let bindingId = 0;
        //console.warn(this.elements)
        let resource;
        for (let i = 0; i < this.elements.length; i++) {
            resource = this.elements[i].resource;
            //console.log(i, resource)
            if (resource instanceof VertexBuffer && !resource.io)
                continue;
            let bgl = resource.createBindGroupLayoutEntry(bindingId++);
            //console.log("bindgroupLayout entry ", (bindingId - 1), bgl);
            layout.entries.push(bgl);
        }
        //console.log("BINDGROUP LAYOUT ENTRIES ", layout)
        this._layout = XGPU.device.createBindGroupLayout(layout);
    }
    setupApplyCompleted = false;
    build() {
        //console.log(this.ioGroups)
        if (!this._layout || (this.deviceId != XGPU.deviceId && this.ioGroups))
            this.buildLayout();
        this.deviceId = XGPU.deviceId;
        let entries = [];
        let bindingId = 0;
        let resource;
        for (let i = 0; i < this.elements.length; i++) {
            resource = this.elements[i].resource;
            //if (!resource.gpuResource) {
            resource.update();
            //}
            if (resource instanceof VertexBuffer && !resource.io)
                continue;
            let entry = resource.createBindGroupEntry(bindingId++);
            //console.log("bindgroup entry ", this.elements[i].name, (bindingId - 1), entry);
            entries.push(entry);
        }
        this._group = XGPU.device.createBindGroup({ layout: this._layout, entries });
        if (!this.setupApplyCompleted && this.parent) {
            this.setupApplyCompleted = true;
            this.setupApply();
            if (this.instanceResourcesArray) {
                for (let i = 0; i < this.instanceResourcesArray.length; i++) {
                    this._createInstance(this.instanceResourcesArray[i]);
                }
                this.instanceResourcesArray = undefined;
            }
        }
        return this._group;
    }
    indexBuffer;
    vertexBuffers;
    vertexBufferReferenceByName;
    elementByName = {};
    setupApply() {
        this.bindgroupId = this.parent.groups.indexOf(this);
        //this.indexBuffer = this.parent.drawConfig ? this.parent.drawConfig.indexBuffer : undefined;
        const allVertexBuffers = this.parent.resources.types.vertexBuffers;
        if (!allVertexBuffers)
            return;
        //console.log("SETUP APPLY  id = ", this.bindgroupId, allVertexBuffers, this.elements)
        const getBufferId = (o) => {
            //const name = this.getResourceName(o);
            if (!this.instances) {
                for (let i = 0; i < allVertexBuffers.length; i++) {
                    //console.log("allVertexBuffers[i].resource.nane = ", allVertexBuffers[i].resource.nane)
                    //if (allVertexBuffers[i].resource.nane === o.name) return i;
                    if (allVertexBuffers[i].resource === o)
                        return i;
                }
            }
            else {
                for (let i = 0; i < allVertexBuffers.length; i++) {
                    //console.log("allVertexBuffers[i].resource.nane = ", allVertexBuffers[i].resource.nane)
                    if (allVertexBuffers[i].resource.nane === o.name)
                        return i;
                }
            }
            //console.warn("GET BUFFER ID = -1  ", allVertexBuffers.length)
            return -1;
        };
        this.vertexBuffers = [];
        this.vertexBufferReferenceByName = {};
        let k = 0;
        let element;
        let resource;
        for (let i = 0; i < this.elements.length; i++) {
            element = this.elements[i];
            resource = element.resource;
            //console.log("A ", element.name)
            if (resource instanceof VertexBuffer) {
                //console.log("B");
                if (!resource.io) {
                    resource.bufferId = getBufferId(resource);
                    this.elementByName[element.name] = resource;
                    this.vertexBufferReferenceByName[element.name] = { bufferId: resource.bufferId, resource };
                    this.vertexBuffers[k++] = resource;
                    continue;
                }
            }
            else {
                this.elementByName[element.name] = resource;
            }
        }
    }
    setupDrawCompleted = false;
    setupDraw() {
        if (this.vertexBuffers) {
            for (let i = 0; i < this.vertexBuffers.length; i++) {
                if (!this.vertexBuffers[i].gpuResource) {
                    this.vertexBuffers[i].createGpuResource();
                    //console.log("buffer resource = ", this.vertexBuffers[i].gpuResource);
                }
            }
        }
        if (this.parent.drawConfig) { //may be undefined with a computePipeline
            this.indexBuffer = this.parent.drawConfig.indexBuffer;
            if (!this.indexBuffer && this.parent.drawConfig.vertexCount <= 0) {
                if (!this.parent.resources.types.vertexBuffers) {
                    throw new Error("a renderPipeline require a vertexBuffer or a drawConfig object in order to draw. You must add a vertexBuffer or call RenderPipeline.setupDraw");
                }
                const buffers = this.parent.resources.types.vertexBuffers;
                let buf;
                for (let i = 0; i < buffers.length; i++) {
                    buf = buffers[i].resource;
                    if (buf.descriptor.stepMode === "vertex") {
                        this.parent.drawConfig.vertexCount = this.parent.resources.types.vertexBuffers[i].resource.nbVertex;
                        break;
                    }
                }
            }
        }
    }
    apply(renderPass) {
        if (!this.setupDrawCompleted) {
            this.setupDrawCompleted = true;
            if (undefined === this.bindgroupId) {
                this.bindgroupId = this.parent.groups.indexOf(this);
            }
            this.setupDraw();
        }
        if (renderPass instanceof GPUComputePassEncoder) {
            this.update();
            renderPass.setBindGroup(this.bindgroupId, this.group);
            return;
        }
        const instances = this.instances ? this.instances : [{ group: this.group, update: () => { } }];
        const applyDraw = this.applyDraw;
        for (let i = 0; i < instances.length; i++) {
            instances[i].update();
            this.update();
            renderPass.setBindGroup(this.bindgroupId, instances[i].group);
            //renderPass.setBindGroup(this.bindgroupId, this.group);
            if (this.vertexBuffers) {
                //console.log("vertexBuffers = ", this.vertexBuffers)
                let buf;
                for (let j = 0; j < this.vertexBuffers.length; j++) {
                    buf = this.vertexBuffers[j].getCurrentBuffer();
                    //console.log(this.vertexBuffers[j], this.vertexBuffers[j].bufferId, buf, this.vertexBuffers.indexOf(buf))
                    renderPass.setVertexBuffer(this.vertexBuffers[j].bufferId, buf);
                }
            }
            if (applyDraw) {
                this.parent.drawConfig.draw(renderPass);
            }
        }
    }
    instances;
    instanceResourcesArray;
    get useInstances() { return !!this.instances || !!this.instanceResourcesArray; }
    ;
    createInstance(instanceResources) {
        if (!this.instanceResourcesArray)
            this.instanceResourcesArray = [];
        this.instanceResourcesArray.push(instanceResources);
    }
    _createInstance(resourcePerInstance) {
        resourcePerInstance = HighLevelParser.parse(resourcePerInstance, "bindgroup");
        if (!this.instances)
            this.instances = [];
        let indexBuffer;
        let vertexBuffers = [];
        let result = {
            elements: this.elements.concat()
        };
        let element, resource;
        //console.log("---- ", vertexBuffers.length)
        for (let i = 0; i < this.elements.length; i++) {
            element = this.elements[i];
            for (let z in resourcePerInstance) {
                resource = resourcePerInstance[z];
                if (resource instanceof IndexBuffer) {
                    indexBuffer = resourcePerInstance[z];
                    continue;
                }
                if (element.name === z) {
                    if (resource instanceof VideoTexture || resource instanceof ImageTexture) {
                        //keep source descriptor (the "source" option in the descriptor refeer to the media, we)
                    }
                    else {
                        //use "model" descriptor (some config options are applyed on VertexBuffer/UniformBuffer/...  and we want to keep it for all the instances)
                        //(whzt I call "model" is the source bindgroup used to call 'createInstance')
                        resource.descriptor = element.resource.descriptor;
                    }
                    if (!resource.gpuResource) {
                        resource.createGpuResource();
                    }
                    if (element.resource instanceof VertexBuffer) {
                        resource.bufferId = element.resource.bufferId;
                        if (vertexBuffers.indexOf(resource) === -1) {
                            vertexBuffers.push(resource);
                        }
                    }
                    result.elements[i] = { name: z, resource: resource };
                }
            }
        }
        //let id = this.instances.length;
        if (indexBuffer)
            result.indexBuffer = indexBuffer;
        result.update = () => {
            let bool = false;
            for (let i = 0; i < this.elements.length; i++) {
                if (this.elements[i].resource.mustBeTransfered) {
                    this.elements[i].resource.update();
                    bool = true;
                    break;
                }
            }
            this.elements = result.elements;
            this.vertexBuffers = vertexBuffers;
            if (bool || !result.group) {
                result.group = this.build();
            }
            if (result.indexBuffer)
                this.parent.drawConfig.indexBuffer = result.indexBuffer;
        };
        resourcePerInstance._object = result;
        this.instances.push(result);
    }
    handleComputePipelineResourceIOs() {
        //console.warn("handleComputePipelineResourceIOs ", this.resourcesIOs)
        if (this.resourcesIOs.length) {
            let buf0 = [];
            let buf1 = [];
            for (let i = 0; i < this.resourcesIOs.length; i++) {
                if (this.resourcesIOs[i] instanceof VertexBufferIO) {
                    buf0[i] = this.resourcesIOs[i].buffers[0];
                    buf1[i] = this.resourcesIOs[i].buffers[1];
                }
                else {
                    buf0[i] = this.resourcesIOs[i].textures[0];
                    buf1[i] = this.resourcesIOs[i].textures[1];
                    buf0[i].createGpuResource();
                    buf1[i].createGpuResource();
                }
            }
            this.createPingPongBindgroup(buf0, buf1);
        }
    }
    swapElements() {
        let result = this.elements.concat();
        let temp;
        for (let i = 0; i < this.elements.length; i += 2) {
            temp = result[i];
            result[i] = result[i + 1];
            result[i + 1] = temp;
        }
        return result;
    }
    createPingPongBindgroup(resource1, resource2) {
        const group = new Bindgroup();
        group.name = this.name;
        group.mustRefreshBindgroup = this.mustRefreshBindgroup = true;
        group._layout = this.layout;
        group.elements = this.swapElements();
        let res1, res2;
        for (let i = 0; i < resource1.length; i++) {
            res1 = resource1[i];
            res2 = resource2[i];
            //group.elements = this.getSwappedElements(res1, res2);
            //console.log("=> group.elements ", group.elements[0].name, group.elements[1].name, group.elements[2].name, group.elements[3].name)
            if (res1 instanceof VertexBuffer) {
                const buffers = [res1.buffer, res2.buffer];
                buffers[0].debug = 1;
                buffers[1].debug = 2;
                res1.initBufferIO(buffers);
            }
            else if (res1 instanceof ImageTexture) {
                if (!res1.gpuResource)
                    res1.createGpuResource();
                if (!res2.gpuResource)
                    res2.createGpuResource();
                //console.log(resource1.gpuResource === resource2.gpuResource)
                const textures = [res1.gpuResource, res2.gpuResource];
                try {
                    textures[0].debug = 1;
                    textures[1].debug = 2;
                }
                catch (e) {
                }
                res1.initTextureIO(textures);
            }
        }
        this.ioGroups = [this, group];
        //console.log(this.ioGroups)
        this.debug = 1;
        group.debug = 2;
        return group;
    }
    /*
    -------------OLD VERSION-----------
    public createPingPongBindgroup(resource1: IShaderResource, resource2: IShaderResource): Bindgroup {
        const group = new Bindgroup(this.name);
        group.mustRefreshBindgroup = this.mustRefreshBindgroup = true;
        group._layout = this.layout;
        group.elements = this.getSwappedElements(resource1, resource2);
        //console.log("=> group.elements ", group.elements)



        if (resource1 instanceof VertexBuffer) {

            const buffers = [resource1.buffer, (resource2 as VertexBuffer).buffer];
            (buffers[0] as any).debug = 1;
            (buffers[1] as any).debug = 2;

            resource1.initBufferIO(buffers);
        } else if (resource1 instanceof ImageTexture) {

            if (!resource1.gpuResource) resource1.createGpuResource();
            if (!resource2.gpuResource) resource2.createGpuResource();

            console.log(resource1, resource2)
            //console.log(resource1.gpuResource === resource2.gpuResource)

            const textures = [resource1.gpuResource, resource2.gpuResource];
            try {
                (textures[0] as any).debug = 1;
                (textures[1] as any).debug = 2;
            } catch (e) {

            }



            resource1.initTextureIO(textures);
        }

        this.ioGroups = [this, group];
        //console.log(this.ioGroups)
        this.debug = 1;
        group.debug = 2;

        return group;

    }
    */
    renderPipelineimageIO;
    renderPipelineBufferIO;
    handleRenderPipelineResourceIOs() {
        //console.warn("handleRenderPipelineResourceIOs ", this.elements.length, this.textureIO)
        if (this.renderPipelineimageIO) {
            this.renderPipelineimageIO.initIO();
            return;
        }
        else if (this.renderPipelineBufferIO) {
            this.renderPipelineBufferIO.initIO();
            return;
        }
        //a vertexBufferIO uses 2 vertexBuffers in a computePipeline 
        //but a single one is required in a renderPipeline (same for textures)   
        let resource;
        let name;
        let bufferIOs = [];
        let textureIOs = [];
        let parentResources = this.parent.resources;
        let foundVertexIO = false;
        let foundTextureIO = false;
        for (let i = 0; i < this.elements.length; i++) {
            //console.log(i, this.elements[i], this.parent.pipeline);
            resource = this.elements[i].resource;
            if (resource instanceof VertexBuffer) {
                if (resource.io === 1) {
                    name = this.elements[i].name;
                    parentResources[name] = undefined;
                    parentResources[name + "_out"] = undefined;
                    bufferIOs.push(resource);
                    bufferIOs.push(this.elements[i + 1].resource);
                    this.elements.splice(i, 2);
                    foundVertexIO = true;
                    break;
                }
            }
            else if (resource instanceof ImageTexture) {
                if (resource.io === 1) {
                    name = this.elements[i].name;
                    parentResources[name] = undefined;
                    parentResources[name + "_out"] = undefined;
                    //console.log("this.elements[i + 1] = ", this.elements[i + 1])
                    textureIOs.push(resource);
                    textureIOs.push(this.elements[i + 1].resource);
                    this.elements.splice(i, 2);
                    foundTextureIO = true;
                    break;
                }
            }
        }
        if (foundVertexIO) {
            //console.log("foundVertexIO")
            //console.log("bufferIOs = ", bufferIOs)
            const attributes = bufferIOs[0].attributeDescriptor;
            const stepMode = bufferIOs[0].descriptor.stepMode;
            const vb = new VertexBuffer(attributes, { stepMode });
            this.elements.push({ name, resource: vb });
            let vertexBuffers = parentResources.types.vertexBuffers;
            let buffers = [];
            for (let i = 0; i < vertexBuffers.length; i++) {
                if (!vertexBuffers[i].resource.io) {
                    buffers.push(vertexBuffers[i]);
                }
            }
            buffers.push({ name, resource: vb });
            parentResources[name] = vb;
            parentResources.types.vertexBuffers = buffers;
            vb.initIO = () => {
                vb.initBufferIO([bufferIOs[0].buffer, bufferIOs[1].buffer]);
            };
            vb.initIO();
            this.renderPipelineBufferIO = vb;
        }
        else if (foundTextureIO) {
            //console.log("foundTextureIO")
            const img = new ImageTexture({ source: textureIOs[0].gpuResource });
            this.elements.push({ name, resource: img });
            let images = parentResources.types.imageTextures;
            let textures = [];
            for (let i = 0; i < images.length; i++) {
                if (!images[i].resource.io) {
                    textures.push(images[i]);
                }
            }
            textures.push({ name, resource: img });
            parentResources[name] = img;
            parentResources.types.imageTextures = images;
            img.initIO = () => {
                //console.log("initIO ", textureIOs[0].deviceId, textureIOs[1].deviceId)
                img.source = textureIOs[0].texture;
                img.initTextureIO([textureIOs[0].texture, textureIOs[1].texture]);
            };
            img.initIO();
            this.renderPipelineimageIO = img;
        }
    }
    ioGroups;
    io_index = 0;
    debug;
    get pingPongBindgroup() {
        return this._pingPongBindgroup;
    }
    get layout() {
        if (!this._layout)
            this.buildLayout();
        return this._layout;
    }
    get group() {
        if (!this._group || this.mustRefreshBindgroup) {
            this.build();
        }
        if (this.ioGroups) {
            const group = this.ioGroups[this.io_index++ % 2];
            if (!group._group)
                group.build();
            //console.warn("group ", group.debug);
            return group._group;
        }
        return this._group;
    }
    update() {
        // console.log(this.elements)
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].resource.update();
        }
    }
    destroy() {
        //console.log("bindgroup.destroy")
        for (let i = 0; i < this.elements.length; i++) {
            //console.log("this.elements[i] = ", this.elements[i].resource)
            this.elements[i].resource.destroyGpuResource();
        }
        this.elements = [];
    }
}
