import { VertexBuffer } from "./VertexBuffer";
export declare class VertexAttribute {
    static get types(): any;
    private _name;
    private _dataType;
    private nbValues;
    private vertexType;
    private _data;
    dataOffset: number;
    mustBeTransfered: boolean;
    vertexBuffer: VertexBuffer;
    constructor(name: string, dataType: string, offset?: number);
    get datas(): number[][];
    set datas(n: number[][]);
    get format(): string;
    get bytePerElement(): number;
    get varType(): string;
    get name(): string;
    get nbComponent(): number;
    private renameVertexDataType;
    private getVertexDataType;
}
