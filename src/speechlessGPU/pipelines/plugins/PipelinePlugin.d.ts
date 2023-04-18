import { ShaderNode } from "../../shader/shaderParts/ShaderNode";
import { Pipeline } from "../Pipeline";
export declare class PipelinePlugin {
    protected target: Pipeline;
    protected requiredNames: any;
    bindgroupResources: any;
    vertexShader: {
        outputs?: any;
        inputs?: any;
        code?: string;
        main?: string | string[];
    };
    fragmentShader: {
        outputs?: any;
        inputs?: any;
        code?: string;
        main?: string | string[];
    };
    constructor(target: Pipeline, required?: any);
    apply(vertexShaderNode?: ShaderNode, fragmentShaderNode?: ShaderNode): PipelinePlugin;
}
