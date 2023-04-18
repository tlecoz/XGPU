import { ShaderStage } from "./shaderParts/ShaderStage";
export class ComputeShader extends ShaderStage {
    constructor() {
        super("compute");
    }
    build(shaderPipeline, inputs) {
        if (this._shaderInfos)
            return this._shaderInfos;
        let result = this.code.value + "\n\n";
        const obj = shaderPipeline.bindGroups.getComputeShaderDeclaration();
        result += obj.result;
        //------
        const w = shaderPipeline.workgroups;
        result += "@compute @workgroup_size(" + w[0] + "," + w[1] + "," + w[2] + ")\n";
        result += "fn main(" + inputs.getFunctionParams() + ") {\n";
        result += obj.variables + "\n";
        result += this.main.value;
        result += "}\n";
        console.log("------------- COMPUTE SHADER --------------");
        console.log(result);
        console.log("-------------------------------------------");
        this._shaderInfos = { code: result, output: null };
        return this._shaderInfos;
    }
}
