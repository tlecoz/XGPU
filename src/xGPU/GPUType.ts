// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

export class GPUType {

    private _isVector: boolean = false;
    private _isMatrix: Boolean = false;
    private _isArray: boolean = false;
    private _vecType: number = 1;
    private _arrayLen: number | undefined;
    private _primitive: "u32" | "i32" | "f32" | "f16";
    private _matrixColumns: number = 1;
    private _matrixRows: number = 1;

    private _alignOf: number;
    private _sizeOf: number;
    private _dataType: string;
    private _rawType: string;


    //https://www.w3.org/TR/WGSL/#alignment-and-size

    constructor(dataType: string) {
        this._rawType = dataType;
        dataType = this.renameDataType(dataType);
        //ex : u32,vec3<f16>,...
        this._dataType = dataType;
        //console.log("GPUType dataType = ", dataType)
        this.getPrimitiveDataType(dataType, 0);


    }

    private renameDataType(type: string): string {

        const isArray = type.substring(0, 6) === "array<";

        if (isArray) {
            const t = type.split(",")
            const varType = t[0]
            const end = t[1];
            //console.log("isArray ", varType, end)
            switch (varType) {
                case "array<float":
                    return "array<f32," + end;
                case "array<vec2":
                    return "array<vec2<f32>," + end;
                case "array<vec3":
                    return "array<vec3<f32>," + end;
                case "array<vec4":
                    return "array<vec4<f32>," + end;
            }
        }



        switch (type) {
            case "float":
                return "f32";
            case "vec2":
                return "vec2<f32>";
            case "vec3":
                return "vec3<f32>";
            case "vec4":
                return "vec4<f32>";

            case "int":
                return "i32";
            case "ivec2":
                return "vec2<i32>";
            case "ivec3":
                return "vec3<i32>";
            case "ivec4":
                return "vec4<i32>";

            case "uint":
                return "u32";
            case "uvec2":
                return "vec2<u32>";
            case "uvec3":
                return "vec3<u32>";
            case "uvec4":
                return "vec4<u32>";

            case "mat4":
                return "mat4x4<f32>";
            case "mat3":
                return "mat3x3<f32>";
            case "mat2":
                return "mat2x2<f32>";
            case "mat2d":
                return "mat2w3<f32>";

        }
        return type;


    }


    public get isPrimitive(): boolean { return !this._isVector && !this._isArray && !this._isMatrix };
    public get isVector(): boolean { return this._isVector && !this._isArray && !this._isMatrix };
    public get isMatrix(): boolean { return this._isMatrix && !this._isArray }
    public get isArray(): boolean { return this._isArray }

    public get isMatrixOfVectors(): boolean { return this._isMatrix && this._isVector }
    public get isArrayOfVectors(): boolean { return this._isArray && this._isVector }

    public get vectorType(): number { return this._vecType; }
    public get arrayLength(): number { return this._arrayLen; }
    public get matrixColumns(): number { return this._matrixColumns; }
    public get matrixRows(): number { return this._matrixRows; }

    public get primitive(): "u32" | "i32" | "f32" | "f16" { return this._primitive; }

    public get nbValues(): number { return this._matrixColumns * this._matrixRows * this._vecType * (this._arrayLen ? this._arrayLen : 1) }
    public get byteSize(): number { return this._sizeOf; }
    public get byteAlign(): number { return this._alignOf; }
    public set byteAlign(n: number) { this._alignOf = n; }

    public get dataType(): string { return this._dataType; }
    public get rawType(): string { return this._rawType; }

    public get byteValue(): number {
        if (this._primitive === "f16") return 2;
        return 4;
    }

    private getMatrixBytesStructure(col: number, row: number, primitive: string): void {

        const type = "mat" + col + "x" + row + "<" + primitive + ">";
        //console.log("getMatrixBytesStructure ", type)
        const dataInfos = {
            "mat2x2<f32>": [8, 16],
            "mat2x2<f16>": [4, 8],
            "mat3x2<f32>": [8, 24],
            "mat3x2<f16>": [4, 12],
            "mat4x2<f32>": [8, 32],
            "mat4x2<f16>": [4, 16],
            "mat2x3<f32>": [16, 32],
            "mat2x3<f16>": [8, 16],
            "mat3x3<f32>": [16, 48],
            "mat3x3<f16>": [8, 24],
            "mat4x3<f32>": [16, 64],
            "mat4x3<f16>": [8, 32],
            "mat2x4<f32>": [16, 32],
            "mat2x4<f16>": [8, 16],
            "mat3x4<f32>": [16, 48],
            "mat3x4<f16>": [8, 24],
            "mat4x4<f32>": [16, 64],
            "mat4x4<f16>": [8, 32]
        }

        const o = dataInfos[type];
        //console.log(o)
        this._alignOf = o[0];
        this._sizeOf = o[1];
    }

    private getPrimitiveDataType = (dataType: string, start: number) => {
        //console.log("getPrimitiveDataType ", dataType)
        const first = dataType.substring(start, start + 1);

        switch (first) {
            case "u":
                this._primitive = "u32";
                this._alignOf = 4;
                this._sizeOf = 4;
                break
            case "i":
                this._primitive = "i32";
                this._alignOf = 4;
                this._sizeOf = 4;
                break
            case "f":
                const val: string = dataType.substring(start, start + 3);

                if (val === "f32" || val == "flo") { //float
                    this._primitive = "f32";
                    this._alignOf = 4;
                    this._sizeOf = 4;
                } else if (val === "f16") {
                    this._primitive = val;
                    this._alignOf = 2;
                    this._sizeOf = 2;
                } else throw new Error("invalid primitive type");
                break
            case "v":

                if (dataType.substring(start, start + 3) === "vec") {
                    this._isVector = true;
                    const type: number = Number(dataType.substring(start + 3, start + 4));
                    if (type >= 2 && type <= 4) {
                        this._vecType = type;
                        this.getPrimitiveDataType(dataType, start + 5);

                        if (this._primitive === "f16") {
                            this._sizeOf = 2 * type;
                            if (type === 2) this._alignOf = 4;
                            else if (type === 3) this._alignOf = 8
                            else if (type === 4) this._alignOf = 8;

                        } else {
                            this._sizeOf = 4 * type;
                            if (type === 2) this._alignOf = 8;
                            else if (type === 3) this._alignOf = 16
                            else if (type === 4) this._alignOf = 16;
                        }

                    } else {
                        throw new Error("invalid vec type");
                    }
                } else {
                    throw new Error("invalid primitive type");
                }
                break
            case "a":
                if (dataType.substring(start, start + 5) === "array") {
                    this._isArray = true;

                    let temp = 15;
                    if (dataType.substring(6, 7) === "m") {//array of matrix
                        temp = 17;
                    } else if (dataType.substring(6, 7) === "f") {//array of f32
                        temp = 9;
                    }
                    //console.log(start, temp, dataType.substring(start, temp))
                    //console.log("dataType.substring(start + temp, start + temp + 1) = ", dataType.substring(start + temp, start + temp + 1))
                    if (dataType.substring(start + temp, start + temp + 1) === ",") {
                        let num;
                        temp++;
                        //console.log("=> ", dataType.substring(temp, temp + 1))
                        for (let i = 1; i < 16; i++) {
                            let n = dataType.substring(temp, temp + i);
                            if (isNaN(Number(n))) break;
                            num = n;
                        }
                        //console.log("num = ", num)
                        this._arrayLen = Number(num);
                    }


                    this.getPrimitiveDataType(dataType, start + 6);

                    if (this.arrayLength) this._sizeOf *= this._arrayLen;


                } else {
                    throw new Error("invalid primitive type");
                }
                break
            case "m":

                if (dataType.substring(start, start + 3) === "mat") {

                    this._isMatrix = true;
                    const col: number = Number(dataType.substring(start + 3, start + 4));
                    const row: number = Number(dataType.substring(start + 5, start + 6));
                    //console.log("matrix ", col, row)
                    if (!isNaN(col) && !isNaN(row)) {
                        this._matrixColumns = col;
                        this._matrixRows = row;
                        this.getPrimitiveDataType(dataType, start + 7);
                        if (this._primitive === "f16" || this._primitive === "f32") {
                            this.getMatrixBytesStructure(col, row, this._primitive);
                        } else {
                            throw new Error("Matrix values must be f32 or f16")
                        }


                    } else {
                        throw new Error("invalid matrix type");
                    }
                } else {
                    throw new Error("invalid primitive type");
                }
                break
        }

    }

}