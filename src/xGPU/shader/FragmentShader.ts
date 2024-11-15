// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { BuiltIns } from "../BuiltIns";
import { XGPU } from "../XGPU";
import { ShaderStage } from "./shaderParts/ShaderStage";
import { ShaderStruct } from "./shaderParts/ShaderStruct";

export class FragmentShader extends ShaderStage {



    constructor() {
        super("fragment");
    }

    public build(shaderPipeline: any, inputs: ShaderStruct): { code: string, output: ShaderStruct } {
        if (this._shaderInfos) return this._shaderInfos;





        let result = "";
        const obj = shaderPipeline.bindGroups.getVertexShaderDeclaration(true);
        result += obj.result;

        //console.log("-------- FRAGMENT -----------");
        //console.log(result)

        for (let i = 0; i < this.inputs.length; i++) {
            inputs.addProperty(this.inputs[i]);
        }

        if (this.outputs.length === 0) {
            this.outputs[0] = { name: "color", ...BuiltIns.fragmentOutputs.color }
        }
        const output: ShaderStruct = new ShaderStruct("Output", this.outputs);
        result += output.struct + "\n"



        //------

        //const mainFunc = this.unwrapVariableInMainFunction(obj.variables)//handleVariables();
        let constants = this.unwrapVariableInWGSL(obj.variables, this.constants.value);
        result += constants + "\n\n";


        let mainFunc = this.unwrapVariableInWGSL(obj.variables, this.main.value);

        result += "@fragment\n";
        result += "fn main(" + inputs.getFunctionParams() + ") -> " + output.name + "{\n";
        //result += obj.variables + "\n";
        result += "   var output:Output;\n";
        //result += this.main.value;
        result += mainFunc;
        result += "   return output;\n"
        result += "}\n";

        result = this.formatWGSLCode(result)

        if (XGPU.showFragmentShader) {
            console.log("------------- FRAGMENT SHADER --------------")
            console.log(result)
            console.log("--------------------------------------------")
        }


        this._shaderInfos = { code: result, output: output };
        
        return this._shaderInfos;
    }
}