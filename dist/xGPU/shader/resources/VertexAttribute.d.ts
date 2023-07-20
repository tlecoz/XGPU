import { VertexBuffer } from "./VertexBuffer";
export declare class VertexAttribute {
    static Float(datas?: number[][] | number[] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[] | number[][];
    };
    static Vec2(datas?: number[][] | number[] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[] | number[][];
    };
    static Vec3(datas?: number[][] | number[] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[] | number[][];
    };
    static Vec4(datas?: number[][] | number[] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[] | number[][];
    };
    static Int(datas?: number[][] | number[] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[] | number[][];
    };
    static IVec2(datas?: number[][] | number[] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[] | number[][];
    };
    static IVec3(datas?: number[][] | number[] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[] | number[][];
    };
    static IVec4(datas?: number[][] | number[] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[] | number[][];
    };
    static Uint(datas?: number[][] | number[] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[] | number[][];
    };
    static UVec2(datas?: number[][] | number[] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[] | number[][];
    };
    static UVec3(datas?: number[][] | number[] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[] | number[][];
    };
    static UVec4(datas?: number[][] | number[] | number, offset?: number): {
        type: string;
        offset: number;
        datas: number | number[] | number[][];
    };
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
    get datas(): number[][] | number[];
    set datas(n: number[][] | number[]);
    get useByVertexData(): boolean;
    get format(): string;
    get bytePerElement(): number;
    get varType(): string;
    get name(): string;
    get nbComponent(): number;
    private renameVertexDataType;
    private getVertexDataType;
}
