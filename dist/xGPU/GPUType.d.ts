export declare class GPUType {
    private _isVector;
    private _isMatrix;
    private _isArray;
    private _vecType;
    private _arrayLen;
    private _primitive;
    private _matrixColumns;
    private _matrixRows;
    private _alignOf;
    private _sizeOf;
    private _dataType;
    private _rawType;
    constructor(dataType: string);
    private renameDataType;
    get isPrimitive(): boolean;
    get isVector(): boolean;
    get isMatrix(): boolean;
    get isArray(): boolean;
    get isMatrixOfVectors(): boolean;
    get isArrayOfVectors(): boolean;
    get isArrayOfMatrixs(): boolean;
    get vectorType(): number;
    get arrayLength(): number;
    get matrixColumns(): number;
    get matrixRows(): number;
    get primitive(): "u32" | "i32" | "f32" | "f16";
    get nbValues(): number;
    get byteSize(): number;
    get byteAlign(): number;
    set byteAlign(n: number);
    get dataType(): string;
    get rawType(): string;
    get byteValue(): number;
    private getMatrixBytesStructure;
    private getPrimitiveDataType;
}