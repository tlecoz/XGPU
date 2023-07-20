import { RenderPipeline } from "../pipelines/RenderPipeline";
import { ShaderStage } from "./shaderParts/ShaderStage";
import { ShaderStruct } from "./shaderParts/ShaderStruct";
export declare class VertexShader extends ShaderStage {
    constructor();
    build(pipeline: RenderPipeline, input: ShaderStruct): {
        code: string;
        output: ShaderStruct;
    };
}
