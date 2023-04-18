import { ComputePipeline } from "../pipelines/ComputePipeline";
import { ShaderStage } from "./shaderParts/ShaderStage";
import { ShaderStruct } from "./shaderParts/ShaderStruct";
export declare class ComputeShader extends ShaderStage {
    constructor();
    build(shaderPipeline: ComputePipeline, inputs: ShaderStruct): {
        code: string;
        output: ShaderStruct;
    };
}
