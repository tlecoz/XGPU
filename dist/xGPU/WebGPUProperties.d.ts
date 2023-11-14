export declare class WebGPUProperties {
    private static build;
    private static resolve;
    private static getResult;
    private static ready;
    private static textureUsage;
    private static bufferUsage;
    private static shaderStage;
    static init(): Promise<void>;
    private static _instance;
    constructor();
    static getTextureUsageById(id: number): string;
    static getBufferUsageById(id: number): string;
    static getShaderStageById(id: number): string;
}
