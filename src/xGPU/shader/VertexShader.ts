// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { BuiltIns } from "../BuiltIns";
import { XGPU } from "../XGPU";
import { RenderPipeline } from "../pipelines/RenderPipeline";
import { ShaderStage } from "./shaderParts/ShaderStage";
import { ShaderStruct } from "./shaderParts/ShaderStruct";


export class VertexShader extends ShaderStage {

    //public keepRendererAspectRatio: boolean = true;

    constructor() {
        super("vertex");
    }




    public build(pipeline: RenderPipeline, input: ShaderStruct): { code: string, output: ShaderStruct } {

        //this.main.text = this.extractDebugInfo(this.main.text);

        let result = this.constants.value + "\n\n";
        //if (this.keepRendererAspectRatio) result += "const xgpuRendererAspectRatio = " + (pipeline.renderer.width / pipeline.renderer.height).toFixed(4) + ";\n\n";
        const obj = pipeline.bindGroups.getVertexShaderDeclaration();
        result += obj.result;

        //-----
        //if the renderPipeline is "fed" by a computePipeline, the shaderStruct "input"
        //contains the output vertexBuffer from the computePipeline
        result += input.getComputeVariableDeclaration();

        //-----

        let bool = false;
        for (let i = 0; i < this.outputs.length; i++) {
            if (this.outputs[i].builtin === BuiltIns.vertexOutputs.position.builtin) {
                bool = true;
            }
        }
        if (!bool) {


            this.outputs.unshift({ name: "position", ...BuiltIns.vertexOutputs.position });
        }


        let output: ShaderStruct = new ShaderStruct("Output", [...this.outputs]);
        result += output.struct + "\n"



        let mainFunc = this.unwrapVariableInMainFunction(obj.variables)//handleVariables();



        //------
        //console.log("VertexShader.variables = ", obj.variables)
        result += "@vertex\n";
        result += "fn main(" + input.getFunctionParams() + ") -> " + output.name + "{\n";
        result += "   var output:Output;\n";
        result += mainFunc;
        result += "   return output;\n"
        result += "}\n";

        result = this.formatWGSLCode(result)

        if (XGPU.debugVertexShader) {

            console.log("------------- VERTEX SHADER --------------")
            console.log(result);
            console.log("------------------------------------------")
        }

        return { code: result, output: output };
    }
}