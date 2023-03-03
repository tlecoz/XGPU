import { ShaderNode } from "./ShaderNode";
import { ShaderStruct } from "./ShaderStruct";



export class ShaderStage {

    public inputs: { name: string, type: any, builtin?: string }[] = [];
    public outputs: { name: string, type: any, builtin?: string }[] = [];
    public export: { name: string, type: any }[] = [];
    public require: { name: string, type: any }[] = [];

    public code: ShaderNode;
    public main: ShaderNode;

    public shaderType: "vertex" | "fragment" | "compute";

    constructor(shaderType: "vertex" | "fragment" | "compute") {

        this.shaderType = shaderType;
        this.code = new ShaderNode();
        this.main = new ShaderNode("", true);

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