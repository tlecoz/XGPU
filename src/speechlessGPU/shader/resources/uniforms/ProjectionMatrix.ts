import { mat4 } from "gl-matrix";
import { Matrix4x4 } from "../../PrimitiveType";

export class ProjectionMatrix extends Matrix4x4 {




    constructor(screenW: number, screenH: number, fovInDegree: number = 60, zNear: number = 0.1, zFar: number = 100000) {

        super()

        var w: number = screenW * 0.5;
        var h: number = screenH * 0.5;
        var fov: number = Math.PI / 180 * fovInDegree;
        var focal = 0.5 * (Math.cos(fov / 2) / Math.sin(fov / 2));
        var aspect = w / h;



        mat4.identity(this)
        mat4.perspective(this,
            fov,
            aspect,
            zNear,
            zFar);
        mat4.scale(this, this, [aspect, -1, 1]);
        mat4.translate(this, this, [0, 0, -focal])

        this.mustBeTransfered = true;
    }




}