export interface IShaderResource {

    mustBeTransfered: boolean;
    gpuResource: any;
    descriptor: any;

    setPipelineType(pipelineType: "compute" | "render" | "compute_mixed"); //used to handle particular cases in descriptor relative to the nature of pipeline

    createDeclaration(varName: string, bindingId: number, groupId: number): string;
    createBindGroupLayoutEntry(bindingId: number): any;
    createBindGroupEntry(bindingId: number): any;

    createGpuResource();
    destroyGpuResource();
    update();

    clone(): IShaderResource;

}