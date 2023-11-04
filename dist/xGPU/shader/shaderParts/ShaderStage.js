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
    unwrapVariableInMainFunction(shaderVariables) {
        const variables = shaderVariables.split("\n");
        let s;
        let objs = [];
        for (let i = 0; i < variables.length; i++) {
            variables[i] = s = variables[i].split("\t").join("").trim().slice(4);
            if (!s.length)
                continue;
            let t = s.split(" = ");
            let varName = t[0].split(":")[0];
            let otherName = t[1].slice(0, t[1].length - 1);
            objs.push({
                varName,
                otherName
            });
            //console.log(varName + " => " + otherName);
        }
        /*
        let chatGPTrequest = "";
        chatGPTrequest += "\n=========== unwrapVariableInMainFunction ============\n";
        for (let i = 0; i < objs.length; i++) chatGPTrequest += "searchWord:" + objs[i].varName + " , replacement:" + objs[i].otherName + "\n";
        chatGPTrequest += "-------\n";
        chatGPTrequest += "originalCode : \n";
        chatGPTrequest += this.main.value;
        */
        const searchAndReplace = (shaderCode, wordToReplace, replacement) => {
            //const regex = new RegExp(`\\b${wordToReplace}\\b`, 'g');
            //const regex = new RegExp(`[^.]\\b${wordToReplace}\\b`, 'g');
            //const regex = new RegExp(`[^\\w.]\\b${wordToReplace}\\b`, 'g');
            //const regex = new RegExp(`(?<=[^\\w])\\b${wordToReplace}\\b`, 'g');
            const regex = new RegExp(`(?<=[^\\w.])\\b${wordToReplace}\\b`, 'g');
            return shaderCode.replace(regex, replacement);
        };
        let shader = this.main.value + "";
        for (let i = 0; i < objs.length; i++) {
            shader = searchAndReplace(shader, objs[i].varName, objs[i].otherName);
        }
        /*
        chatGPTrequest += "rebuilt shader :\n"
        chatGPTrequest += shader + "\n";
        console.log("chatGPTRequest = ", chatGPTrequest);
        */
        return shader;
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
