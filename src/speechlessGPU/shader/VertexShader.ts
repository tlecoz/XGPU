import { BuiltIns } from "../BuiltIns";
import { ShaderStage } from "./shaderParts/ShaderStage";
import { ShaderStruct } from "./shaderParts/ShaderStruct";


export class VertexShader extends ShaderStage {


    constructor() {
        super("vertex");
    }


    public build(pipeline: any, input: ShaderStruct): { code: string, output: ShaderStruct } {
        //console.log("VS inputs = ", input)
        let result = this.code.value + "\n\n";
        const obj = pipeline.bindGroups.getVertexShaderDeclaration();
        result += obj.result;

        //-----
        //if the renderPipeline is "fed" by a computePipeline, the shaderStruct "input"
        //contains the output vertexBuffer from the computePipeline
        result += input.getComputeVariableDeclaration();

        //-----


        let bool = false;
        for (let i = 0; i < this.outputs.length; i++) {
            if (this.outputs[0].builtin === BuiltIns.vertexOutputs.position.builtin) {
                bool = true;
            }
        }
        if (!bool) this.outputs.unshift({ name: "position", ...BuiltIns.vertexOutputs.position })


        let output: ShaderStruct = new ShaderStruct("Output", [...this.outputs]);
        result += output.struct + "\n"

        //------

        result += "@vertex\n";
        result += "fn main(" + input.getFunctionParams() + ") -> " + output.name + "{\n";
        result += obj.variables + "\n";
        result += "   var output:Output;\n";
        result += this.main.value;
        result += "   return output;\n"
        result += "}\n";

        result = this.formatWGSLCode(result)

        //console.log("------------- VERTEX SHADER --------------")
        console.log(result);

        //console.log("------------------------------------------")
        return { code: result, output: output };
    }
}