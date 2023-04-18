export declare class ShaderNode {
    enabled: boolean;
    executeSubNodeAfterCode: boolean;
    private _text;
    private insideMainFunction;
    private subNodes;
    constructor(code?: string, insideMainFunction?: boolean);
    get text(): string;
    set text(s: string);
    replaceValues(values: {
        old: string;
        new: string;
    }[]): void;
    get value(): string;
    createNode(code?: string): ShaderNode;
}
