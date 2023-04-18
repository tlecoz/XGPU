/// <reference types="dist" />
import { Bindgroup } from "./Bindgroup";
import { IShaderResource } from "./resources/IShaderResource";
import { VertexBuffer } from "./resources/VertexBuffer";
export declare class Bindgroups {
    parent: Bindgroups;
    groups: Bindgroup[];
    private _name;
    constructor(name: string);
    get name(): string;
    build(autoLayout?: boolean): {
        description: any;
        bindgroups: GPUBindGroup[];
        buffers: VertexBuffer[];
        nbVertex: number;
    };
    getBindgroupByResource(resource: IShaderResource): Bindgroup;
    apply(passEncoder: GPURenderPassEncoder | GPUComputePassEncoder): void;
    update(): void;
    getVertexShaderDeclaration(): {
        result: string;
        variables: string;
    };
    getFragmentShaderDeclaration(): {
        result: string;
        variables: string;
    };
    getComputeShaderDeclaration(): {
        result: string;
        variables: string;
    };
    protected createVertexBufferLayout(): {
        vertexLayouts: Iterable<GPUVertexBufferLayout>;
        buffers: VertexBuffer[];
        nbVertex: number;
    };
    handleRenderPipelineResourceIOs(): void;
    handleComputePipelineResourceIOs(): void;
    protected _resources: any;
    get resources(): any;
    add(bindgroup: Bindgroup | Bindgroups): (Bindgroup | Bindgroups);
    copy(options?: {
        oldGroups: Bindgroup[];
        replacedGroup: Bindgroup[];
    }): Bindgroups;
    propertyNameIsUsed(propertyName: string): boolean;
    get(propertyName: string): IShaderResource;
    getNameByResource(resource: IShaderResource): string;
    get current(): Bindgroup;
    destroy(): void;
}
