import { Pipeline } from "../../pipelines/Pipeline";
export interface IShaderResource {
    mustBeTransfered: boolean;
    gpuResource: any;
    descriptor: any;
    setPipelineType(pipelineType: "compute" | "render" | "compute_mixed"): any;
    createDeclaration(varName: string, bindingId: number, groupId: number): string;
    createBindGroupLayoutEntry(bindingId: number): any;
    createBindGroupEntry(bindingId: number): any;
    createGpuResource(): any;
    destroyGpuResource(): any;
    update(pipeline?: Pipeline): any;
    clone(): IShaderResource;
}
