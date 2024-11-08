// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

export class ShaderNode {

    public enabled: boolean = true;
    public executeSubNodeAfterCode: boolean = true;


    private _text: string;
    private insideMainFunction: boolean;

    private _nodeByName:{[key:string]:ShaderNode} = {};
    public get nodeByName():{[key:string]:ShaderNode}{
        return this._nodeByName;
    }


    private subNodes: ShaderNode[];

    constructor(code: string = "", insideMainFunction: boolean = false) {
        this.text = code;
        this.insideMainFunction = insideMainFunction;
    }


    public get text(): string { return this._text }
    public set text(s: string) {
        
        //--------- remove useless tabulations while keeping tabs structure -------

        const lines = s.split("\n");
        let line;
        let nbTabMin = 99999999;

        if (lines.length > 1) {
            for (let i = 0; i < lines.length; i++) {
                line = lines[i];
                for (let j = 0; j < line.length; j++) {
                    if (line[j] === "\n") continue;
                    if (line[j] !== " ") {
                        if (nbTabMin > j) nbTabMin = j;
                        break;
                    }
                }
            }

            if (this.insideMainFunction && nbTabMin >= 3) nbTabMin -= 3;
            for (let i = 0; i < lines.length; i++) {
                lines[i] = lines[i].slice(nbTabMin);
            }

            s = lines.join("\n");
        }
        //-----------------------------------------------------------------------

        this._text = s;
    }

    public replaceValues(values: { old: string, new: string }[]) {
        for (let i = 0; i < values.length; i++) {
            this.replaceKeyWord(values[i].old, values[i].new);
            //this._text = this._text.replace(values[i].old, values[i].new);
        }
    }

    public replaceKeyWord(wordToReplace: string, replacement: string) {
        const regex = new RegExp(`(?<=[^\\w.])\\b${wordToReplace}\\b`, 'g');
        this._text = this._text.replace(regex, replacement);
    }



    public get value(): string {

        let result = "";

        if (this.executeSubNodeAfterCode) {

            result += this.text + "\n";
        }
        if (this.subNodes) {
            for (let i = 0; i < this.subNodes.length; i++) {
                result += this.subNodes[i].value + "\n";
            }
        }

        if (!this.executeSubNodeAfterCode) result += this.text + "\n";


        //console.log(this.text + " vs " + result)
        return result;
    }

    public createNode(code: string = ""): ShaderNode {
        const node = new ShaderNode(code);
        if (!this.subNodes) this.subNodes = [];
        this.subNodes.push(node);
        return node;
    }

    public addNode(nodeName:string,code:string=""):ShaderNode{
        const node = this.createNode(code);
        this._nodeByName[nodeName] = node;
        return node;
    }



}