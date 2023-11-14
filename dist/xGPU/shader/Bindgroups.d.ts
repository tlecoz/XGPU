/// <reference types="dist" />
import { PrimitiveFloatUniform, PrimitiveIntUniform, PrimitiveUintUniform } from "../PrimitiveType";
import { Bindgroup } from "./Bindgroup";
import { IShaderResource } from "./resources/IShaderResource";
import { VertexBuffer } from "./resources/VertexBuffer";
import { Pipeline } from "../pipelines/Pipeline";
import { DrawConfig } from "../pipelines/resources/DrawConfig";
export declare class Bindgroups {
    pipeline: Pipeline;
    parent: Bindgroups;
    groups: Bindgroup[];
    private _name;
    constructor(pipeline: Pipeline, name: string);
    get name(): string;
    clearAfterDeviceLost(): void;
    build(autoLayout?: boolean): {
        description: any;
        bindgroups: GPUBindGroup[];
        buffers: VertexBuffer[];
        nbVertex: number;
    };
    getBindgroupByResource(resource: IShaderResource): Bindgroup;
    apply(passEncoder: GPURenderPassEncoder | GPUComputePassEncoder): void;
    update(): void;
    protected temp: {
        result: string;
        variables: string;
    };
    getVertexShaderDeclaration(fromFragmentShader?: boolean): {
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
    getGroupByPropertyName(name: string): Bindgroup;
    getGroupByName(name: string): Bindgroup;
    getNameByResource(resource: IShaderResource | PrimitiveFloatUniform | PrimitiveIntUniform | PrimitiveUintUniform): string;
    setupDraw(force?: boolean): void;
    get drawConfig(): DrawConfig;
    get current(): Bindgroup;
    destroy(): void;
}
