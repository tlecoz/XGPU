
// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "../XGPU";
import { ComputePipeline } from "../pipelines/ComputePipeline";
import { ShaderStage } from "./shaderParts/ShaderStage";
import { ShaderStruct } from "./shaderParts/ShaderStruct";


export class ComputeShader extends ShaderStage {



    constructor() {
        super("compute");

    }

    public build(shaderPipeline: ComputePipeline, inputs: ShaderStruct): { code: string, output: ShaderStruct } {

        if (this._shaderInfos) return this._shaderInfos;



        let result = "";
        const obj = shaderPipeline.bindGroups.getComputeShaderDeclaration();
        result += obj.result + "\n\n";


        //------

        const w = shaderPipeline.workgroups;

        //this.unwrapVariableInMainFunction(obj.variables)//handleVariables();
        let constants = this.unwrapVariableInWGSL(obj.variables, this.constants.value);
        result += constants + "\n\n";


        let mainFunc = this.unwrapVariableInWGSL(obj.variables, this.main.value);

        result += "@compute @workgroup_size(" + w[0] + "," + w[1] + "," + w[2] + ")\n";
        result += "fn main(" + inputs.getFunctionParams() + ") {\n";
        //result += obj.variables + "\n";
        //result += this.main.value;
        result += mainFunc;
        result += "}\n";

        if (XGPU.showComputeShader) {
            console.log("------------- COMPUTE SHADER --------------")
            console.log(result)
            console.log("-------------------------------------------")
        }
        this._shaderInfos = { code: result, output: null };
        return this._shaderInfos;




    }

}