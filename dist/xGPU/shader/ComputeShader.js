// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { XGPU } from "../XGPU";
import { ShaderStage } from "./shaderParts/ShaderStage";
export class ComputeShader extends ShaderStage {
    constructor() {
        super("compute");
    }
    build(shaderPipeline, inputs) {
        if (this._shaderInfos)
            return this._shaderInfos;
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
        this._shaderInfos = { code: result, output: null };
        if (XGPU.showComputeShader) {
            setTimeout(() => {
                console.log("------------- COMPUTE SHADER --------------");
                console.log(this.formatWGSLCode(this._shaderInfos.code));
                //console.log(formated)
                console.log("-------------------------------------------");
            }, 100);
        }
        return this._shaderInfos;
    }
    static removeStructDefinitionAndReplaceStructDeclarationName(shaderCode, structName, newStructName) {
        // Expression régulière pour capturer la définition complète de la structure `structName`
        const structRegex = new RegExp(`struct\\s+${structName}\\s*\\{[^}]*\\}`, 'g');
        // Supprimer la définition de `structName`
        shaderCode = shaderCode.replace(structRegex, '');
        // Remplacer toutes les occurrences de `structName` par `newStructName`
        const nameRegex = new RegExp(`\\b${structName}\\b`, 'g');
        shaderCode = shaderCode.replace(nameRegex, newStructName);
        return shaderCode;
    }
}
