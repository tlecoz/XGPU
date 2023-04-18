import { Matrix4x4 } from "../../PrimitiveType";
export declare class OrthographicMatrix extends Matrix4x4 {
    constructor(screenW: number, screenH: number);
    update(): void;
}
