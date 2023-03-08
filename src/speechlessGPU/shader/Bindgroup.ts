import { GPU } from "../GPU";
import { Pipeline } from "../pipelines/Pipeline";
import { Bindgroups } from "./Bindgroups";
import { IShaderResource } from "./resources/IShaderResource";
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

    constructor(name: string) {
        this._name = name;

    }

    public get name(): string { return this._name; }




    public createPingPongBindgroup(resource1: IShaderResource, resource2: IShaderResource): Bindgroup {
        const group = new Bindgroup(this.name);
        group.mustRefreshBindgroup = this.mustRefreshBindgroup = true;
        group._layout = this.layout;
        group.elements = this.getSwappedElements(resource1, resource2);
        group.build();

        this._pingPongBindgroup = group;
        group._pingPongBindgroup = this;
        return group;

    }

    /*public get pingPongBindgroup():Bindgroup{
        this._pingPongBindgroup = this._pingPongBindgroup._pingPongBindgroup;
        return this._pingPongBindgroup;
    }*/


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



    public add(name: string, resource: IShaderResource): IShaderResource {
        if (resource instanceof VideoTexture) this.mustRefreshBindgroup = true;
        //console.log("group add ", name)
        if (resource instanceof VertexBufferIO) {
            this.mustRefreshBindgroup = true;
            this.vertexBufferIO = resource;
            this.elements.push({ name: name, resource: resource.buffers[0] });
            this.elements.push({ name: name + "_out", resource: resource.buffers[1] });

            //this.createPingPongBindgroup(resource.buffers[0], resource.buffers[1])

            if (this.parent) this.parent.add(this);
            return resource;
        }

        this.elements.push({ name, resource });
        if (this.parent) this.parent.add(this);
        return resource;
    }

    public get(name: string): IShaderResource {
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].name === name) return this.elements[i].resource;
        }
        return null;
    }


    public initFromObject(object: any): void {
        //console.log("group.initFromObject ", object)
        let o;
        for (let z in object) {
            o = object[z];
            if (o.createGpuResource || o instanceof VertexBufferIO) { //if it's a shader resource 
                this.add(z, o);
            }
        }
    }
    //---------------------------------------------------------------------------

    protected buildLayout(): void {

        const layout = { entries: [] }
        let bindingId = 0;

        let resource: IShaderResource;
        for (let i = 0; i < this.elements.length; i++) {
            resource = this.elements[i].resource;
            if (resource instanceof VertexBuffer && !(resource as VertexBuffer).io) continue;
            layout.entries.push(resource.createBindGroupLayoutEntry(bindingId++));
        }

        console.log("BINDGROUP LAYOUT ENTRIES ", layout)
        this._layout = GPU.device.createBindGroupLayout(layout);
    }

    protected build(): void {

        if (!this._layout) this.buildLayout();

        let entries = [];
        let bindingId: number = 0;

        let resource: IShaderResource;
        for (let i = 0; i < this.elements.length; i++) {
            resource = this.elements[i].resource;
            if (resource instanceof VertexBuffer && !(resource as VertexBuffer).io) continue;
            entries.push(resource.createBindGroupEntry(bindingId++));
        }

        this._group = GPU.device.createBindGroup({ layout: this._layout, entries })
    }

    public get layout(): GPUBindGroupLayout {
        if (!this._layout) this.buildLayout();
        return this._layout;
    }
    public get group(): GPUBindGroup {
        //console.log("this._pingponggroup = ", this._pingPongBindgroup)
        /*if (this._pingPongBindgroup) {
            if (!this._group) this.build();
            const ping = this._pingPongBindgroup._group;
            this._pingPongBindgroup = this._pingPongBindgroup._pingPongBindgroup;
            return ping;
        }*/

        if (!this._group || this.mustRefreshBindgroup) this.build();
        return this._group;
    }

    public update(): void {
        for (let i = 0; i < this.elements.length; i++) {

            this.elements[i].resource.update();
        }
    }

}