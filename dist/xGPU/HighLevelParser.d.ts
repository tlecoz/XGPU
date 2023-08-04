import { DrawConfig } from "./pipelines/resources/DrawConfig";
export declare class HighLevelParser {
    constructor();
    protected parseShaderBuiltins(descriptor: any): any;
    protected parseVertexBufferIOs(descriptor: any): any;
    protected parseImageTextureIOs(descriptor: any): any;
    protected parseVertexBuffers(descriptor: any): any;
    protected parseVertexAttributes(descriptor: any): any;
    protected parseUniformBuffers(descriptor: any): any;
    protected parseUniform(descriptor: any): any;
    protected parseImageTextureArray(descriptor: any): any;
    protected parseImageTexture(descriptor: any): any;
    protected parseTextureSampler(descriptor: any): any;
    protected parseVideoTexture(descriptor: any): any;
    protected parseCubeMapTexture(descriptor: any): any;
    protected parseDrawConfig(descriptor: any, drawConfig: DrawConfig): any;
    protected parseBindgroup(descriptor: any): any;
    protected firstPass(descriptor: any, target: "render" | "compute" | "bindgroup", drawConfig?: DrawConfig): any;
    protected parseHighLevelObj(descriptor: any): any;
    protected findAndFixRepetitionInDataStructure(o: any): any;
    protected targetIsBindgroup: boolean;
    protected parseBindgroupEntries(descriptor: any): any;
    parse(descriptor: any, target: "render" | "compute" | "bindgroup", drawConfig?: DrawConfig): any;
    private static instance;
    static parse(descriptor: any, target: "render" | "compute" | "bindgroup", drawConfig?: DrawConfig): any;
}
