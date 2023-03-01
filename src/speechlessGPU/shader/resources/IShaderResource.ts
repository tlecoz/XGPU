export interface IShaderResource {

    mustBeTransfered: boolean;
    gpuResource: any;

    createDeclaration(varName: string, bindingId: number, groupId: number): string;
    createBindGroupLayoutEntry(bindingId: number): any;
    createBindGroupEntry(bindingId: number): any;

    create();
    destroy();
    update();

}