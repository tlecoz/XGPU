import { ShaderNode } from "./ShaderNode";
import { ShaderStruct } from "./ShaderStruct";
export declare class ShaderStage {
    inputs: {
        name: string;
        type: any;
        builtin?: string;
    }[];
    outputs: {
        name: string;
        type: any;
        builtin?: string;
    }[];
    export: {
        name: string;
        type: any;
    }[];
    require: {
        name: string;
        type: any;
    }[];
    pipelineConstants: any;
    constants: ShaderNode;
    main: ShaderNode;
    shaderType: "vertex" | "fragment" | "compute";
    constructor(shaderType: "vertex" | "fragment" | "compute");
    debugLogs: {
        label: string;
        val: string;
    }[];
    debugRenders: {
        label: string;
        val: string;
        color: string;
    }[];
    protected unwrapVariableInMainFunction(shaderVariables: string): string;
    addOutputVariable(name: string, shaderType: {
        type: string;
    }): void;
    addInputVariable(name: string, shaderTypeOrBuiltIn: {
        type: string;
        builtin?: string;
    }): void;
    protected formatWGSLCode(code: string): string;
    get shaderInfos(): {
        code: string;
        output: ShaderStruct;
    };
    protected _shaderInfos: {
        code: string;
        output: ShaderStruct;
    };
    build(shaderPipeline: any, input: ShaderStruct): {
        code: string;
        output: ShaderStruct;
    };
}
