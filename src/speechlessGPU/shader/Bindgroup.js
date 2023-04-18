import { SLGPU } from "../SLGPU";
import { ImageTexture } from "./resources/ImageTexture";
import { ImageTextureIO } from "./resources/ImageTextureIO";
import { VertexBuffer } from "./resources/VertexBuffer";
import { VertexBufferIO } from "./resources/VertexBufferIO";
import { VideoTexture } from "./resources/VideoTexture";
export class Bindgroup {
    parent;
    entries = [];
    elements = [];
    mustRefreshBindgroup = false;
    _layout;
    _group;
    _name;
    _pingPongBindgroup = null; //used in ComputePipeline and VertexBufferIO
    vertexBufferIO;
    textureIO;
    constructor(name) {
        this._name = name;
    }
    get name() { return this._name; }
    add(name, resource) {
        if (resource instanceof VideoTexture)
            this.mustRefreshBindgroup = true;
        //console.log("bindgroup.add ", resource)
        if (resource instanceof VertexBufferIO) {
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
            this.mustRefreshBindgroup = true;
            this.textureIO = resource;
            this.elements.push({ name: name, resource: resource.textures[0] });
            this.elements.push({ name: name + "_out", resource: resource.textures[1] });
            if (this.parent)
                this.parent.add(this);
            return resource;
        }
        this.elements.push({ name, resource });
        if (this.parent)
            this.parent.add(this);
        return resource;
    }
    getSwappedElements(resource1, resource2) {
        let id1, id2;
        let element;
        for (let i = 0; i < this.elements.length; i++) {
            element = this.elements[i].resource;
            if (element === resource1)
                id1 = i;
            else if (element === resource2)
                id2 = i;
        }
        const result = this.elements.concat();
        const temp = result[id1];
        result[id1] = result[id2];
        result[id2] = temp;
        return result;
    }
    get(name) {
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].name === name)
                return this.elements[i].resource;
        }
        return null;
    }
    initFromObject(object) {
        //console.log("group.initFromObject ", object)
        let o;
        for (let z in object) {
            o = object[z];
            //console.log(z + " : " + object[z])
            if (o.createGpuResource || o instanceof VertexBufferIO || o instanceof ImageTextureIO) { //if it's a shader resource 
                this.add(z, o);
            }
        }
    }
    //---------------------------------------------------------------------------
    buildLayout() {
        const layout = { entries: [] };
        let bindingId = 0;
        //console.warn(this.elements)
        let resource;
        for (let i = 0; i < this.elements.length; i++) {
            resource = this.elements[i].resource;
            if (resource instanceof VertexBuffer && !resource.io)
                continue;
            layout.entries.push(resource.createBindGroupLayoutEntry(bindingId++));
        }
        //console.log("BINDGROUP LAYOUT ENTRIES ", layout)
        this._layout = SLGPU.device.createBindGroupLayout(layout);
    }
    build() {
        if (!this._layout)
            this.buildLayout();
        let entries = [];
        let bindingId = 0;
        let resource;
        for (let i = 0; i < this.elements.length; i++) {
            resource = this.elements[i].resource;
            if (resource instanceof VertexBuffer && !resource.io)
                continue;
            entries.push(resource.createBindGroupEntry(bindingId++));
        }
        this._group = SLGPU.device.createBindGroup({ layout: this._layout, entries });
    }
    handleComputePipelineResourceIOs() {
        //console.warn("handleComputePipelineResourceIOs")
        if (this.vertexBufferIO) {
            //console.log(this.vertexBufferIO.buffers[0])
            this.createPingPongBindgroup(this.vertexBufferIO.buffers[0], this.vertexBufferIO.buffers[1]);
        }
        else if (this.textureIO) {
            //console.log("handleComputePipelineResourceIOs")
            this.createPingPongBindgroup(this.textureIO.textures[0], this.textureIO.textures[1]);
        }
    }
    handleRenderPipelineResourceIOs() {
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
                    textureIOs.push(resource);
                    textureIOs.push(this.elements[i + 1].resource);
                    this.elements.splice(i, 2);
                    foundTextureIO = true;
                    break;
                }
            }
        }
        if (foundVertexIO) {
            const attributes = bufferIOs[0].attributeDescriptor;
            const vb = new VertexBuffer(attributes, { stepMode: "instance" });
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
            vb.initBufferIO([bufferIOs[0].buffer, bufferIOs[1].buffer]);
        }
        else if (foundTextureIO) {
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
            img.initTextureIO([textureIOs[0].texture, textureIOs[1].texture]);
        }
    }
    ioGroups;
    io_index = 0;
    debug;
    createPingPongBindgroup(resource1, resource2) {
        const group = new Bindgroup(this.name);
        group.mustRefreshBindgroup = this.mustRefreshBindgroup = true;
        group._layout = this.layout;
        group.elements = this.getSwappedElements(resource1, resource2);
        //console.log("=> group.elements ", group.elements)
        if (resource1 instanceof VertexBuffer) {
            const buffers = [resource1.buffer, resource2.buffer];
            buffers[0].debug = 1;
            buffers[1].debug = 2;
            resource1.initBufferIO(buffers);
        }
        else if (resource1 instanceof ImageTexture) {
            console.log(resource1.gpuResource === resource2.gpuResource);
            const textures = [resource1.gpuResource, resource2.gpuResource];
            textures[0].debug = 1;
            textures[1].debug = 2;
            resource1.initTextureIO(textures);
        }
        this.ioGroups = [this, group];
        //console.log(this.ioGroups)
        this.debug = 1;
        group.debug = 2;
        return group;
    }
    get pingPongBindgroup() {
        return this._pingPongBindgroup;
    }
    get layout() {
        if (!this._layout)
            this.buildLayout();
        return this._layout;
    }
    get group() {
        //console.log("this._pingponggroup = ", this._pingPongBindgroup, this.ioGroups)
        if (!this._group)
            this.build();
        if (this.ioGroups) {
            const group = this.ioGroups[this.io_index++ % 2];
            if (!group._group)
                group.build();
            //console.warn("group ", group.debug);
            return group._group;
        }
        if (!this._group || this.mustRefreshBindgroup)
            this.build();
        return this._group;
    }
    update() {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].resource.update();
        }
    }
    destroy() {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].resource.destroyGpuResource();
        }
        this.elements = [];
    }
}
