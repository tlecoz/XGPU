import { ShaderStage } from "./shaderParts/ShaderStage";
import { ShaderStruct } from "./shaderParts/ShaderStruct";
export declare class VertexShader extends ShaderStage {
    constructor();
    build(pipeline: any, input: ShaderStruct): {
        code: string;
        output: ShaderStruct;
    };
}
