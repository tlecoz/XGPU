import { ShaderStage } from "./shaderParts/ShaderStage";
import { ShaderStruct } from "./shaderParts/ShaderStruct";
export declare class FragmentShader extends ShaderStage {
    constructor();
    build(shaderPipeline: any, inputs: ShaderStruct): {
        code: string;
        output: ShaderStruct;
    };
}
