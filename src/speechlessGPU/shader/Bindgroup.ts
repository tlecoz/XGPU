import { GPU } from "../GPU";
import { IShaderResource } from "./resources/IShaderResource";
import { VertexBuffer } from "./resources/VertexBuffer";
import { VideoTexture } from "./resources/VideoTexture";

export class Bindgroup {


    public entries: any[] = [];
    public elements: { name: string, resource: IShaderResource }[] = [];

    public mustRefreshBindgroup: boolean = false;
    private _layout: GPUBindGroupLayout;
    private _group: GPUBindGroup;
    private _name: string;
    constructor(name: string) {
        this._name = name;

    }

    public get name(): string { return this._name; }

    public add(name: string, resource: IShaderResource): IShaderResource {
        if (resource instanceof VideoTexture) this.mustRefreshBindgroup = true;
        this.elements.push({ name, resource });
        return resource;
    }


    //---------------------------------------------------------------------------

    protected buildLayout(): void {

        const layout = { entries: [] }
        let bindingId = 0;

        let resource: IShaderResource;
        for (let i = 0; i < this.elements.length; i++) {
            resource = this.elements[i].resource;
            if (resource instanceof VertexBuffer) continue;
            layout.entries.push(resource.createBindGroupLayoutEntry(bindingId++));
        }
        this._layout = GPU.device.createBindGroupLayout(layout);
    }

    protected build(): void {

        if (!this._layout) this.buildLayout();

        let entries = [];
        let bindingId: number = 0;

        let resource: IShaderResource;
        for (let i = 0; i < this.elements.length; i++) {
            resource = this.elements[i].resource;
            if (resource instanceof VertexBuffer) continue;
            entries.push(resource.createBindGroupEntry(bindingId++));
        }

        this._group = GPU.device.createBindGroup({ layout: this._layout, entries })
    }

    public get layout(): GPUBindGroupLayout {
        if (!this._layout) this.buildLayout();
        return this._layout;
    }
    public get group(): GPUBindGroup {
        if (!this._group || this.mustRefreshBindgroup) this.build();
        return this._group;
    }

    public update(): void {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].resource.update();
        }
    }

}