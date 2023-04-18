import { ShaderNode } from "./ShaderNode";
export class ShaderStage {
    inputs = [];
    outputs = [];
    export = [];
    require = [];
    constants = {};
    code;
    main;
    shaderType;
    constructor(shaderType) {
        this.shaderType = shaderType;
        this.code = new ShaderNode();
        this.main = new ShaderNode("", true);
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
