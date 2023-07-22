// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { ShaderNode } from "./ShaderNode";
export class ShaderStage {
    inputs = [];
    outputs = [];
    export = [];
    require = [];
    pipelineConstants = {};
    constants;
    main;
    shaderType;
    constructor(shaderType) {
        this.shaderType = shaderType;
        this.constants = new ShaderNode();
        this.main = new ShaderNode("", true);
    }
    addOutputVariable(name, shaderType) {
        this.outputs.push({ name, type: shaderType.type });
    }
    addInputVariable(name, shaderTypeOrBuiltIn) {
        this.outputs.push({ name, type: shaderTypeOrBuiltIn.type, builtin: shaderTypeOrBuiltIn.builtin });
    }
    formatWGSLCode(code) {
        // Retire les sauts de ligne inutiles et divise le code en lignes
        const lines = code.replace(/\n+/g, '\n').split('\n');
        let formattedCode = '';
        let indentLevel = 0;
        for (const line of lines) {
            const trimmedLine = line.trim();
            // Diminue le niveau d'indentation si la ligne contient une accolade fermante
            if (trimmedLine.startsWith('}')) {
                indentLevel--;
            }
            // Ajoute des espaces pour la tabulation
            const indentedLine = '   '.repeat(indentLevel) + trimmedLine;
            // Augmente le niveau d'indentation si la ligne contient une accolade ouvrante
            if (trimmedLine.endsWith('{')) {
                indentLevel++;
            }
            formattedCode += indentedLine + '\n';
        }
        //console.log("CODE-------------")
        //console.log(code);
        //console.log("---------------------")
        return formattedCode;
    }
    get shaderInfos() { return this._shaderInfos; }
    _shaderInfos;
    build(shaderPipeline, input) {
        //must be overrided;
        if (!shaderPipeline || !input) {
        }
        ;
        if (this._shaderInfos)
            return this._shaderInfos;
        this._shaderInfos = { code: "", output: null };
        return this._shaderInfos;
    }
}
