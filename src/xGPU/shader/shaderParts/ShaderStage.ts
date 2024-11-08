// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { ShaderNode } from "./ShaderNode";
import { ShaderStruct } from "./ShaderStruct";

export class ShaderStage {

    public inputs: { name: string, type: any, builtin?: string }[] = [];
    public outputs: { name: string, type: any, builtin?: string }[] = [];
    public export: { name: string, type: any }[] = [];
    public require: { name: string, type: any }[] = [];

    public pipelineConstants: any = {};
    public constants: ShaderNode;
    public main: ShaderNode;

    public shaderType: "vertex" | "fragment" | "compute";

    constructor(shaderType: "vertex" | "fragment" | "compute") {

        this.shaderType = shaderType;
        this.constants = new ShaderNode();
        this.main = new ShaderNode("", true);

    }


    public debugLogs: { label: string, val: string }[] = [];
    public debugRenders: { label: string, val: string, color: string }[] = [];
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

    protected unwrapVariableInMainFunction(shaderVariables: string) {
        const variables: string[] = shaderVariables.split("\n");
        let s: string;
        let objs = [];
        for (let i = 0; i < variables.length; i++) {
            variables[i] = s = variables[i].split("\t").join("").trim().slice(4);
            if (!s.length) continue;
            let t = s.split(" = ");
            let varName = t[0].split(":")[0];
            let otherName = t[1].slice(0, t[1].length - 1);
            objs.push({
                varName,
                otherName
            })
        }


        const searchAndReplace = (shaderCode: string, wordToReplace: string, replacement: string) => {
            const regex = new RegExp(`(?<=[^\\w.])\\b${wordToReplace}\\b`, 'g');
            return shaderCode.replace(regex, replacement);
        }

        let shader = this.main.value + "";

        for (let i = 0; i < objs.length; i++) {
            shader = searchAndReplace(shader, objs[i].varName, objs[i].otherName);
        }

        return shader;
    }

    protected unwrapVariableInWGSL(shaderVariables: string, wgsl: string) {
        const variables: string[] = shaderVariables.split("\n");
        let s: string;
        let objs = [];
        for (let i = 0; i < variables.length; i++) {
            variables[i] = s = variables[i].split("\t").join("").trim().slice(4);
            if (!s.length) continue;
            let t = s.split(" = ");
            let varName = t[0].split(":")[0];
            let otherName = t[1].slice(0, t[1].length - 1);
            objs.push({
                varName,
                otherName
            })
        }


        const searchAndReplace = (shaderCode: string, wordToReplace: string, replacement: string) => {
            const regex = new RegExp(`(?<=[^\\w.])\\b${wordToReplace}\\b`, 'g');
            return shaderCode.replace(regex, replacement);
        }


        for (let i = 0; i < objs.length; i++) {
            wgsl = searchAndReplace(wgsl, objs[i].varName, objs[i].otherName);
        }

        return wgsl;
    }




    public addOutputVariable(name: string, shaderType: { type: string }) {
        this.outputs.push({ name, type: shaderType.type })
    }
    public addInputVariable(name: string, shaderTypeOrBuiltIn: { type: string, builtin?: string }) {
        this.outputs.push({ name, type: shaderTypeOrBuiltIn.type, builtin: shaderTypeOrBuiltIn.builtin })
    }

    protected formatWGSLCode(code: string): string {




        const res:string[] = code.split("\n");
            let count:number = 0;

            let tabs:string[] = [];
            for(let i=0;i<16;i++){
                if(i==0) tabs[i] = "";
                else tabs[i] = tabs[i-1]+"\t";
            }
            
            const res2:string[]= [];
            var s:string;
            var empty = true;
            for(let i=0;i<res.length;i++){
                s = res[i].trim();
                if(s.includes("}")) count--;

                if(s != "" || !empty){
                    empty = s == "";
                    res2.push(tabs[count] + s);
                }
                //s = tabs[count] + s;

                if(res[i].includes("{")) count++; 
            }

           return res2.join("\n");

        /*
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
        */
    }



    public get shaderInfos(): { code: string, output: ShaderStruct } { return this._shaderInfos; }
    protected _shaderInfos: { code: string, output: ShaderStruct };
    public build(shaderPipeline: any, input: ShaderStruct): { code: string, output: ShaderStruct } {
        //must be overrided;
        if (!shaderPipeline || !input) {

        };

        if (this._shaderInfos) return this._shaderInfos;
        this._shaderInfos = { code: "", output: null }
        return this._shaderInfos;
    }
}