import { Matrix4x4 } from "../../PrimitiveType";
export declare class ProjectionMatrix extends Matrix4x4 {
    constructor(screenW: number, screenH: number, fovInDegree?: number, zNear?: number, zFar?: number);
    update(): void;
}
