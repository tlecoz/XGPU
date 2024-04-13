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
    debugLogs = [];
    debugRenders = [];
    /*
    public extractDebugInfo(shaderCode: string): string {
        const { code, debugLogs, debugRenders } = ShaderStage.extractDebugInfo(shaderCode);
        this.debugLogs = debugLogs;
        this.debugRenders = debugRenders;
        return code;
    }

    public static extractDebugInfo(code: string): {
        code: string,
        debugLogs: any[],
        debugRenders: any[]
    } {

        const result: any = {};
        result.debugLogs = [];
        result.debugRenders = [];

        const cut = (s: string) => {
            let id;
            for (let i = s.length - 1; i > -1; i--) {
                if (s[i] === ",") {
                    id = i;
                    break;
                }
            }

            return {
                label: s.slice(0, id),
                val: s.slice(id + 1)
            }

        }

        const extractDebug = (line: string) => {
            let s: string = line.split("XGPU.debug(")[1].split(");")[0];

            //const { label, val } = cut(s);
            //console.log("A = ", label);
            //console.log("B = ", val);
            result.debugLogs.push(cut(s));
        }
        const extractDebugRender = (line: string) => {
            //XGPU.renderDebug("testC : ",output.position,vec4(0.0,0.0,1.0,1.0));
            let s: string = line.split("XGPU.renderDebug(")[1].split(");")[0];
            let t = s.split(",vec4")
            let color = "vec4" + t[1];
            s = t[0];

            //const { label, val } = cut(s);
            //console.log("A = ", label);
            //console.log("B = ", val);
            //console.log("C = ", color);

            result.debugRenders.push({
                ...cut(s),
                color
            })

        }


        const lines: string[] = code.split("\n");
        const newLines: string[] = [];
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes("XGPU.debug")) {
                extractDebug(lines[i])
            } else if (lines[i].includes("XGPU.renderDebug")) {
                extractDebugRender(lines[i]);
            } else {
                newLines.push(lines[i]);
            }
        }

        result.code = newLines.join("\n");

        return result;


    }*/
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
        }
        const searchAndReplace = (shaderCode, wordToReplace, replacement) => {
            const regex = new RegExp(`(?<=[^\\w.])\\b${wordToReplace}\\b`, 'g');
            return shaderCode.replace(regex, replacement);
        };
        let shader = this.main.value + "";
        for (let i = 0; i < objs.length; i++) {
            shader = searchAndReplace(shader, objs[i].varName, objs[i].otherName);
        }
        return shader;
    }
    unwrapVariableInWGSL(shaderVariables, wgsl) {
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
        }
        const searchAndReplace = (shaderCode, wordToReplace, replacement) => {
            const regex = new RegExp(`(?<=[^\\w.])\\b${wordToReplace}\\b`, 'g');
            return shaderCode.replace(regex, replacement);
        };
        for (let i = 0; i < objs.length; i++) {
            wgsl = searchAndReplace(wgsl, objs[i].varName, objs[i].otherName);
        }
        return wgsl;
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
