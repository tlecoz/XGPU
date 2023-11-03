// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.


import { HighLevelParser } from "../HighLevelParser";
import { IndexBuffer } from "../pipelines/resources/IndexBuffer";
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

    public bindgroupId: number //the id used in renderPass.setBindgroup

    public parent: Bindgroups;
    public entries: any[] = [];
    public elements: { name: string, resource: IShaderResource }[] = [];

    public mustRefreshBindgroup: boolean = false;
    public applyDraw: boolean = false;


    protected _layout: GPUBindGroupLayout;
    protected _group: GPUBindGroup;
    public name: string = "";

    protected _pingPongBindgroup: Bindgroup = null; //used in ComputePipeline and VertexBufferIO
    public vertexBufferIO: VertexBufferIO;
    public textureIO: ImageTextureIO;


    public resourcesIOs: (VertexBufferIO | ImageTextureIO)[] = [];



    constructor(descriptor?: any | any[]) {
        if (descriptor) this.initFromObject(descriptor);
    }



    public add(name: string, resource: IShaderResource): IShaderResource {
        if (resource instanceof VideoTexture) this.mustRefreshBindgroup = true;
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


            if (this.parent) this.parent.add(this);
            return resource;
        }

        if (resource instanceof ImageTextureIO) {


            this.resourcesIOs.push(resource);




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




    public set(name: string, resource: IShaderResource) {
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].name === name) {
                this.elements[i].resource = resource;
            }
        }
    }

    public remove(name: string) {
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].name === name) {
                this.elements.splice(i, 1);
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


    public initFromObject(descriptor: any | any[]): IShaderResource[] {
        //console.log("group.initFromObject ", object)

        let object: any = descriptor;
        let isArray = false;
        if (descriptor instanceof Array) {
            isArray = true;
            object = descriptor[0];
        }


        HighLevelParser.parse(object, "bindgroup");


        const result: IShaderResource[] = [];
        let k = 0;
        let o;
        for (let z in object) {
            o = object[z];
            if (!o) continue;
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

    public clearAfterDeviceLost(): void {
        this._layout = null
        this._group = null;
        this.setupApplyCompleted = false;
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].resource.destroyGpuResource();
        }

        if (this.instances) {
            let elements: any, resource: IShaderResource;
            let instance: any;
            for (let i = 0; i < this.instances.length; i++) {
                instance = this.instances[i];
                instance.group = undefined;
                elements = instance.elements;

                if (instance.indexBuffer) (instance.indexBuffer as IndexBuffer).createGpuResource();

                for (let j = 0; j < elements.length; j++) {
                    resource = elements[j].resource;
                    //console.log(j, resource)
                    if (resource.gpuResource) {

                        resource.destroyGpuResource();
                    }
                }
            }
        }
    };

    protected deviceId: number = 0;

    protected buildLayout(): void {

        this.deviceId = XGPU.deviceId;

        this.io_index = 0;
        const layout = { entries: [] }
        let bindingId = 0;
        //console.warn(this.elements)
        let resource: IShaderResource;
        for (let i = 0; i < this.elements.length; i++) {
            resource = this.elements[i].resource;
            //console.log(i, resource)
            if (resource instanceof VertexBuffer && !(resource as VertexBuffer).io) continue;
            let bgl = resource.createBindGroupLayoutEntry(bindingId++);
            //console.log("bindgroupLayout entry ", (bindingId - 1), bgl);
            layout.entries.push(bgl);
        }

        //console.log("BINDGROUP LAYOUT ENTRIES ", layout)
        this._layout = XGPU.device.createBindGroupLayout(layout);
    }

    private setupApplyCompleted: boolean = false;
    public build(): GPUBindGroup {
        //console.log(this.ioGroups)
        if (!this._layout || (this.deviceId != XGPU.deviceId && this.ioGroups)) this.buildLayout();
        this.deviceId = XGPU.deviceId;
        let entries = [];
        let bindingId: number = 0;
        let resource: IShaderResource;



        for (let i = 0; i < this.elements.length; i++) {
            resource = this.elements[i].resource;
            //if (!resource.gpuResource) {

            resource.update();
            //}

            if (resource instanceof VertexBuffer && !(resource as VertexBuffer).io) continue;




            let entry = resource.createBindGroupEntry(bindingId++)
            //console.log("bindgroup entry ", this.elements[i].name, (bindingId - 1), entry);
            entries.push(entry);
        }


        this._group = XGPU.device.createBindGroup({ layout: this._layout, entries })



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


    protected indexBuffer: IndexBuffer;
    protected vertexBuffers: VertexBuffer[];
    protected vertexBufferReferenceByName: any;
    protected elementByName: any = {};

    private setupApply() {

        this.bindgroupId = this.parent.groups.indexOf(this);



        //this.indexBuffer = this.parent.drawConfig ? this.parent.drawConfig.indexBuffer : undefined;

        const types = this.parent.resources.types;
        if (!types) return;
        const allVertexBuffers = types.vertexBuffers;
        if (!allVertexBuffers) return;

        //console.log("SETUP APPLY  id = ", this.bindgroupId, allVertexBuffers, this.elements)

        const getBufferId = (o) => {

            //const name = this.getResourceName(o);

            if (!this.instances) {
                for (let i = 0; i < allVertexBuffers.length; i++) {
                    //console.log("allVertexBuffers[i].resource.nane = ", allVertexBuffers[i].resource.nane)
                    //if (allVertexBuffers[i].resource.nane === o.name) return i;
                    if (allVertexBuffers[i].resource === o) return i;
                }
            } else {
                for (let i = 0; i < allVertexBuffers.length; i++) {
                    //console.log("allVertexBuffers[i].resource.nane = ", allVertexBuffers[i].resource.nane)
                    if (allVertexBuffers[i].resource.nane === o.name) return i;

                }
            }



            //console.warn("GET BUFFER ID = -1  ", allVertexBuffers.length)
            return -1;
        }



        this.vertexBuffers = [];
        this.vertexBufferReferenceByName = {};
        let k = 0;
        let element: { name: string, resource: IShaderResource };
        let resource: IShaderResource;
        for (let i = 0; i < this.elements.length; i++) {
            element = this.elements[i];
            resource = element.resource;
            //console.log("A ", element.name)
            if (resource instanceof VertexBuffer) {
                //console.log("B");
                if (!(resource as VertexBuffer).io) {

                    (resource as VertexBuffer).bufferId = getBufferId(resource);

                    this.elementByName[element.name] = resource
                    this.vertexBufferReferenceByName[element.name] = { bufferId: (resource as VertexBuffer).bufferId, resource };
                    this.vertexBuffers[k++] = resource;

                    continue;
                }
            } else {
                this.elementByName[element.name] = resource;
            }
        }
    }


    protected setupDrawCompleted: boolean = false;
    protected setupDraw() {


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
                    throw new Error("a renderPipeline require a vertexBuffer or a drawConfig object in order to draw. You must add a vertexBuffer or call RenderPipeline.setupDraw")
                }

                const buffers = this.parent.resources.types.vertexBuffers;
                let buf: VertexBuffer;
                for (let i = 0; i < buffers.length; i++) {
                    buf = buffers[i].resource as VertexBuffer;
                    if (buf.descriptor.stepMode === "vertex") {
                        this.parent.drawConfig.vertexCount = this.parent.resources.types.vertexBuffers[i].resource.nbVertex;
                        break;
                    }
                }


            }
        }






    }


    public apply(renderPass: GPURenderPassEncoder | GPUComputePassEncoder) {




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


        const instances = this.instances ? this.instances : [{ group: this.group, update: () => { } }]
        const applyDraw = this.applyDraw;

        //console.log("instances.length = ", instances.length)
        for (let i = 0; i < instances.length; i++) {

            instances[i].update();
            this.update();

            renderPass.setBindGroup(this.bindgroupId, instances[i].group);
            //renderPass.setBindGroup(this.bindgroupId, this.group);


            if (this.vertexBuffers) {
                //console.log("vertexBuffers = ", this.vertexBuffers)
                let buf: any;
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

    protected instances: any[];
    protected instanceResourcesArray: any[];

    public get useInstances(): boolean { return !!this.instances || !!this.instanceResourcesArray };

    public createInstance(instanceResources: any) {
        if (!this.instanceResourcesArray) this.instanceResourcesArray = [];
        this.instanceResourcesArray.push(instanceResources)
    }

    protected _createInstance(resourcePerInstance: any) {

        resourcePerInstance = HighLevelParser.parse(resourcePerInstance, "bindgroup");


        if (!this.instances) this.instances = [];



        let indexBuffer: IndexBuffer;
        let vertexBuffers: VertexBuffer[] = [];
        let result: any = {
            elements: this.elements.concat()
        }




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
                    } else {
                        //use "model" descriptor (some config options are applyed on VertexBuffer/UniformBuffer/...  and we want to keep it for all the instances)
                        //(whzt I call "model" is the source bindgroup used to call 'createInstance')
                        resource.descriptor = element.resource.descriptor;
                    }


                    if (!resource.gpuResource) {
                        resource.createGpuResource();
                    }

                    if (element.resource instanceof VertexBuffer) {

                        resource.bufferId = (element.resource as VertexBuffer).bufferId;
                        if (vertexBuffers.indexOf(resource) === -1) {
                            vertexBuffers.push(resource);
                        }
                    }

                    result.elements[i] = { name: z, resource: resource };

                }

            }


        }


        //let id = this.instances.length;
        if (indexBuffer) result.indexBuffer = indexBuffer;
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
            if (result.indexBuffer) this.parent.drawConfig.indexBuffer = result.indexBuffer;
        }




        resourcePerInstance._object = result;

        this.instances.push(result);

    }























    public handleComputePipelineResourceIOs() {
        //console.warn("handleComputePipelineResourceIOs ", this.resourcesIOs)



        if (this.resourcesIOs.length) {
            let buf0 = [];
            let buf1 = [];
            for (let i = 0; i < this.resourcesIOs.length; i++) {
                if (this.resourcesIOs[i] instanceof VertexBufferIO) {

                    buf0[i] = (this.resourcesIOs[i] as VertexBufferIO).buffers[0];
                    buf1[i] = (this.resourcesIOs[i] as VertexBufferIO).buffers[1];

                } else {
                    buf0[i] = (this.resourcesIOs[i] as ImageTextureIO).textures[0];
                    buf1[i] = (this.resourcesIOs[i] as ImageTextureIO).textures[1];
                    buf0[i].createGpuResource();
                    buf1[i].createGpuResource();

                }
            }
            this.createPingPongBindgroup(buf0, buf1);
        }


    }


    private swapElements() {
        let result = this.elements.concat();
        let temp;
        for (let i = 0; i < this.elements.length; i += 2) {
            temp = result[i];
            result[i] = result[i + 1];
            result[i + 1] = temp;
        }
        return result;
    }

    public createPingPongBindgroup(resource1: IShaderResource[], resource2: IShaderResource[]): Bindgroup {
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

                const buffers = [res1.buffer, (res2 as VertexBuffer).buffer];
                (buffers[0] as any).debug = 1;
                (buffers[1] as any).debug = 2;

                res1.initBufferIO(buffers);
            } else if (res1 instanceof ImageTexture) {

                if (!res1.gpuResource) res1.createGpuResource();
                if (!res2.gpuResource) res2.createGpuResource();


                //console.log(resource1.gpuResource === resource2.gpuResource)

                const textures = [res1.gpuResource, res2.gpuResource];
                try {
                    (textures[0] as any).debug = 1;
                    (textures[1] as any).debug = 2;
                } catch (e) {

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


    protected renderPipelineimageIO: ImageTexture;
    protected renderPipelineBufferIO: VertexBuffer;

    public handleRenderPipelineResourceIOs() {

        //console.warn("handleRenderPipelineResourceIOs ", this.elements.length, this.textureIO)

        if (this.renderPipelineimageIO) {
            (this.renderPipelineimageIO as any).initIO();
            return
        } else if (this.renderPipelineBufferIO) {
            (this.renderPipelineBufferIO as any).initIO();
            return
        }

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
            //console.log(i, this.elements[i], this.parent.pipeline);
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
                    //console.log("this.elements[i + 1] = ", this.elements[i + 1])
                    textureIOs.push(resource);
                    textureIOs.push(this.elements[i + 1].resource as ImageTexture);
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
            const vb: VertexBuffer = new VertexBuffer(attributes, { stepMode });
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

            (vb as any).initIO = () => {
                vb.initBufferIO([bufferIOs[0].buffer, bufferIOs[1].buffer])
            }
            (vb as any).initIO();
            this.renderPipelineBufferIO = vb;


        } else if (foundTextureIO) {

            //console.log("foundTextureIO")

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

            (img as any).initIO = () => {
                //console.log("initIO ", textureIOs[0].deviceId, textureIOs[1].deviceId)
                img.source = textureIOs[0].texture;
                img.initTextureIO([textureIOs[0].texture, textureIOs[1].texture])
            }
            (img as any).initIO();

            this.renderPipelineimageIO = img;


        }

    }


    protected ioGroups: Bindgroup[];

    protected io_index: number = 0;
    public debug: any;



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
        //console.log("bindGroup.update elements.length = ", this.elements.length)
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