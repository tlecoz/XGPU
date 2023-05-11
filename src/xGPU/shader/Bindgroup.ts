// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "../XGPU";

import { Bindgroups } from "./Bindgroups";
import { ImageTexture } from "./resources/ImageTexture";
import { ImageTextureIO } from "./resources/ImageTextureIO";
import { IShaderResource } from "./resources/IShaderResource";
import { UniformBuffer } from "./resources/UniformBuffer";
import { VertexBuffer } from "./resources/VertexBuffer";
import { VertexBufferIO } from "./resources/VertexBufferIO";
import { VideoTexture } from "./resources/VideoTexture";

export class Bindgroup {

    public parent: Bindgroups;
    public entries: any[] = [];
    public elements: { name: string, resource: IShaderResource }[] = [];

    public mustRefreshBindgroup: boolean = false;
    protected _layout: GPUBindGroupLayout;
    protected _group: GPUBindGroup;
    protected _name: string;

    protected _pingPongBindgroup: Bindgroup = null; //used in ComputePipeline and VertexBufferIO
    public vertexBufferIO: VertexBufferIO;
    public textureIO: ImageTextureIO;

    constructor(name: string) {
        this._name = name;

    }

    public get name(): string { return this._name; }

    public add(name: string, resource: IShaderResource): IShaderResource {
        if (resource instanceof VideoTexture) this.mustRefreshBindgroup = true;
        else if (resource instanceof ImageTexture && (resource.source instanceof GPUTexture || !resource.source)) {
            this.mustRefreshBindgroup = true;

        }


        //console.log("bindgroup.add ", resource)

        if (resource instanceof VertexBufferIO) {
            this.mustRefreshBindgroup = true;
            this.vertexBufferIO = resource;

            //console.log("group vertexBufferIO ", this.vertexBufferIO)
            this.elements.push({ name: name, resource: resource.buffers[0] });
            this.elements.push({ name: name + "_out", resource: resource.buffers[1] });


            if (this.parent) this.parent.add(this);
            return resource;
        }

        if (resource instanceof ImageTextureIO) {
            this.mustRefreshBindgroup = true;
            this.textureIO = resource;

            this.elements.push({ name: name, resource: resource.textures[0] });
            this.elements.push({ name: name + "_out", resource: resource.textures[1] });

            if (this.parent) this.parent.add(this);
            return resource;
        }

        if (resource instanceof VideoTexture) {
            resource.addBindgroup(this);
        }



        this.elements.push({ name, resource });
        if (this.parent) this.parent.add(this);
        return resource;
    }

    private getSwappedElements(resource1: IShaderResource, resource2: IShaderResource): { name: string, resource: IShaderResource }[] {

        let id1, id2;
        let element: IShaderResource;
        for (let i = 0; i < this.elements.length; i++) {
            element = this.elements[i].resource;
            if (element === resource1) id1 = i;
            else if (element === resource2) id2 = i;
        }

        const result = this.elements.concat();
        const temp = result[id1];
        result[id1] = result[id2];
        result[id2] = temp;

        return result;
    }


    public set(name: string, resource: IShaderResource) {
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].name === name) {
                this.elements[i].resource = resource;
            }
        }
    }

    public getResourceName(resource: IShaderResource): string {
        for (let i = 0; i < this.elements.length; i++) {
            if (resource === this.elements[i].resource) {
                return this.elements[i].name;
            }
        }
        return null;
    }

    public get(name: string): IShaderResource {
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].name === name) return this.elements[i].resource;
        }

        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].resource instanceof UniformBuffer) {
                if ((this.elements[i].resource as UniformBuffer).items[name]) {
                    return this.elements[i].resource
                }
            }
        }

        return null;
    }


    public initFromObject(object: any): IShaderResource[] {
        //console.log("group.initFromObject ", object)
        const result: IShaderResource[] = [];
        let k = 0;
        let o;
        for (let z in object) {
            o = object[z];
            if (!o) continue;
            //console.log(z + " : " + object[z])
            if (o.createGpuResource || o instanceof VertexBufferIO || o instanceof ImageTextureIO) { //if it's a shader resource 
                result[k++] = this.add(z, o);
            }
        }
        return result;
    }
    //---------------------------------------------------------------------------

    protected buildLayout(): void {

        const layout = { entries: [] }
        let bindingId = 0;
        //console.warn(this.elements)
        let resource: IShaderResource;
        for (let i = 0; i < this.elements.length; i++) {
            resource = this.elements[i].resource;

            if (resource instanceof VertexBuffer && !(resource as VertexBuffer).io) continue;
            let bgl = resource.createBindGroupLayoutEntry(bindingId++);
            //console.log("bindgroupLayout entry ", (bindingId - 1), bgl);
            layout.entries.push(bgl);
        }

        //console.log("BINDGROUP LAYOUT ENTRIES ", layout)
        this._layout = XGPU.device.createBindGroupLayout(layout);
    }

    public build(): void {

        if (!this._layout) this.buildLayout();

        let entries = [];
        let bindingId: number = 0;

        let resource: IShaderResource;
        for (let i = 0; i < this.elements.length; i++) {
            resource = this.elements[i].resource;
            if (resource instanceof VertexBuffer && !(resource as VertexBuffer).io) continue;

            let entry = resource.createBindGroupEntry(bindingId++)
            //console.log("bindgroup entry ", (bindingId - 1), entry);
            entries.push(entry);
        }

        this._group = XGPU.device.createBindGroup({ layout: this._layout, entries })
    }


    public handleComputePipelineResourceIOs() {
        //console.warn("handleComputePipelineResourceIOs")
        if (this.vertexBufferIO) {
            //console.log(this.vertexBufferIO.buffers[0])
            this.createPingPongBindgroup(this.vertexBufferIO.buffers[0], this.vertexBufferIO.buffers[1])
        } else if (this.textureIO) {
            //console.log("handleComputePipelineResourceIOs")
            this.createPingPongBindgroup(this.textureIO.textures[0], this.textureIO.textures[1])
        }



    }


    public handleRenderPipelineResourceIOs() {



        //a vertexBufferIO uses 2 vertexBuffers in a computePipeline 
        //but a single one is required in a renderPipeline (same for textures)   
        let resource: IShaderResource;
        let name: string;
        let bufferIOs: VertexBuffer[] = [];
        let textureIOs: ImageTexture[] = [];

        let parentResources: any = this.parent.resources;
        let foundVertexIO: boolean = false;
        let foundTextureIO: boolean = false;

        for (let i = 0; i < this.elements.length; i++) {
            resource = this.elements[i].resource;
            if (resource instanceof VertexBuffer) {
                if (resource.io === 1) {
                    name = this.elements[i].name;
                    parentResources[name] = undefined;
                    parentResources[name + "_out"] = undefined;

                    bufferIOs.push(resource);
                    bufferIOs.push(this.elements[i + 1].resource as VertexBuffer);
                    this.elements.splice(i, 2);
                    foundVertexIO = true;
                    break;
                }
            } else if (resource instanceof ImageTexture) {
                if (resource.io === 1) {
                    name = this.elements[i].name;
                    parentResources[name] = undefined;
                    parentResources[name + "_out"] = undefined;

                    textureIOs.push(resource);
                    textureIOs.push(this.elements[i + 1].resource as ImageTexture);
                    this.elements.splice(i, 2);
                    foundTextureIO = true;
                    break;
                }
            }
        }


        if (foundVertexIO) {

            const attributes = bufferIOs[0].attributeDescriptor;
            const vb: VertexBuffer = new VertexBuffer(attributes, { stepMode: "instance" });
            this.elements.push({ name, resource: vb })

            let vertexBuffers = parentResources.types.vertexBuffers;
            let buffers: { name: string, resource: VertexBuffer }[] = [];
            for (let i = 0; i < vertexBuffers.length; i++) {
                if (!vertexBuffers[i].resource.io) {
                    buffers.push(vertexBuffers[i]);
                }
            }
            buffers.push({ name, resource: vb });

            parentResources[name] = vb;
            parentResources.types.vertexBuffers = buffers;

            vb.initBufferIO([bufferIOs[0].buffer, bufferIOs[1].buffer])

        } else if (foundTextureIO) {

            console.log(" textureIOs[0].gpuResource = ", textureIOs[0])

            const img = new ImageTexture({ source: textureIOs[0].gpuResource })
            this.elements.push({ name, resource: img })

            let images = parentResources.types.imageTextures;
            let textures: { name: string, resource: ImageTexture }[] = [];
            for (let i = 0; i < images.length; i++) {
                if (!images[i].resource.io) {
                    textures.push(images[i]);
                }
            }
            textures.push({ name, resource: img });

            parentResources[name] = img;
            parentResources.types.imageTextures = images;

            img.initTextureIO([textureIOs[0].texture, textureIOs[1].texture])

        }

    }


    protected ioGroups: Bindgroup[];

    protected io_index: number = 0;
    public debug: any;

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

    public get pingPongBindgroup(): Bindgroup {
        return this._pingPongBindgroup;
    }


    public get layout(): GPUBindGroupLayout {
        if (!this._layout) this.buildLayout();
        return this._layout;
    }
    public get group(): GPUBindGroup {

        if (!this._group || this.mustRefreshBindgroup) {

            this.build();
        }

        if (this.ioGroups) {
            const group = this.ioGroups[this.io_index++ % 2];
            if (!group._group) group.build();
            //console.warn("group ", group.debug);
            return group._group;
        }



        return this._group;
    }

    public update(): void {
        for (let i = 0; i < this.elements.length; i++) {

            this.elements[i].resource.update();
        }
    }


    public destroy() {
        //console.log("bindgroup.destroy")
        for (let i = 0; i < this.elements.length; i++) {
            //console.log("this.elements[i] = ", this.elements[i].resource)
            this.elements[i].resource.destroyGpuResource();
        }
        this.elements = [];
    }
}