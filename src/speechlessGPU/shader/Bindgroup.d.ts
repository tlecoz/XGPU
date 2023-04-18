/// <reference types="dist" />
import { Bindgroups } from "./Bindgroups";
import { ImageTextureIO } from "./resources/ImageTextureIO";
import { IShaderResource } from "./resources/IShaderResource";
import { VertexBufferIO } from "./resources/VertexBufferIO";
export declare class Bindgroup {
    parent: Bindgroups;
    entries: any[];
    elements: {
        name: string;
        resource: IShaderResource;
    }[];
    mustRefreshBindgroup: boolean;
    protected _layout: GPUBindGroupLayout;
    protected _group: GPUBindGroup;
    protected _name: string;
    protected _pingPongBindgroup: Bindgroup;
    vertexBufferIO: VertexBufferIO;
    textureIO: ImageTextureIO;
    constructor(name: string);
    get name(): string;
    add(name: string, resource: IShaderResource): IShaderResource;
    private getSwappedElements;
    get(name: string): IShaderResource;
    initFromObject(object: any): void;
    protected buildLayout(): void;
    protected build(): void;
    handleComputePipelineResourceIOs(): void;
    handleRenderPipelineResourceIOs(): void;
    protected ioGroups: Bindgroup[];
    protected io_index: number;
    debug: any;
    createPingPongBindgroup(resource1: IShaderResource, resource2: IShaderResource): Bindgroup;
    get pingPongBindgroup(): Bindgroup;
    get layout(): GPUBindGroupLayout;
    get group(): GPUBindGroup;
    update(): void;
    destroy(): void;
}
