export declare class ShaderStruct {
    protected properties: {
        name: string;
        type: string;
        builtin?: string;
    }[];
    protected isShaderIO: boolean;
    name: string;
    constructor(name: string, properties?: ({
        name: string;
        type: string;
        builtin?: string;
    })[]);
    clone(name?: string): ShaderStruct;
    addProperty(o: {
        name: string;
        type: string;
        builtin?: string;
        offset?: number;
        size?: number;
        obj?: any;
    }): ShaderStruct;
    getComputeVariableDeclaration(offset?: number): string;
    getFunctionParams(): string;
    getComputeFunctionParams(): string;
    getInputFromOutput(): ShaderStruct;
    get struct(): string;
}
