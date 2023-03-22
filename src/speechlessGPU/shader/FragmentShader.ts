import { ShaderStage } from "./shaderParts/ShaderStage";
import { ShaderStruct } from "./shaderParts/ShaderStruct";

export class FragmentShader extends ShaderStage {



    constructor() {
        super("fragment");
    }

    public build(shaderPipeline: any, inputs: ShaderStruct): { code: string, output: ShaderStruct } {
        if (this._shaderInfos) return this._shaderInfos;





        let result = this.code.value + "\n\n";
        const obj = shaderPipeline.bindGroups.getVertexShaderDeclaration();
        result += obj.result;

        //console.log("-------- FRAGMENT -----------");
        //console.log(result)

        for (let i = 0; i < this.inputs.length; i++) {
            inputs.addProperty(this.inputs[i]);
        }


        const output: ShaderStruct = new ShaderStruct("Output", this.outputs);
        result += output.struct + "\n"



        //------

        result += "@fragment\n";
        result += "fn main(" + inputs.getFunctionParams() + ") -> " + output.name + "{\n";
        result += obj.variables + "\n";
        result += "   var output:Output;\n";
        result += this.main.value;
        result += "   return output;\n"
        result += "}\n";
        console.log("------------- FRAGMENT SHADER --------------")
        console.log(result)
        //console.log("--------------------------------------------")

        this._shaderInfos = { code: result, output: output };
        return this._shaderInfos;
    }
}