/// <reference types="dist" />
import { Bindgroup } from "../shader/Bindgroup";
import { Bindgroups } from "../shader/Bindgroups";
import { FragmentShader } from "../shader/FragmentShader";
import { VertexBuffer } from "../shader/resources/VertexBuffer";
import { ShaderStruct } from "../shader/shaderParts/ShaderStruct";
import { VertexShader } from "../shader/VertexShader";
export declare class Pipeline {
    description: any;
    nbVertex: number;
    bindGroups: Bindgroups;
    vertexBuffers: VertexBuffer[];
    vertexShader: VertexShader;
    fragmentShader: FragmentShader;
    protected vertexBufferLayouts: Iterable<GPUVertexBufferLayout>;
    protected gpuBindgroups: GPUBindGroup[];
    protected gpuBindGroupLayouts: GPUBindGroupLayout[];
    protected gpuPipelineLayout: GPUPipelineLayout;
    protected type: "compute" | "compute_mixed" | "render";
    constructor();
    get isComputePipeline(): boolean;
    get isRenderPipeline(): boolean;
    get isMixedPipeline(): boolean;
    protected _resources: any;
    get resources(): any;
    initFromObject(obj: any): void;
    addBindgroup(group: Bindgroup): void;
    protected createVertexBufferLayout(): any;
    protected createShaderInput(shader: VertexShader, buffers: VertexBuffer[]): ShaderStruct;
    protected mergeBindgroupShaders(): void;
    protected createLayouts(): void;
    protected initPipelineResources(pipeline: Pipeline): void;
    protected build(): void;
    update(o: any): void;
    getResourceName(resource: any): string;
}
