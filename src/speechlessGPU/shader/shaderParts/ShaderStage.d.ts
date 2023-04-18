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
    constants: any;
    code: ShaderNode;
    main: ShaderNode;
    shaderType: "vertex" | "fragment" | "compute";
    constructor(shaderType: "vertex" | "fragment" | "compute");
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
