import { mat4 } from "gl-matrix";
import { Matrix4x4 } from "../../PrimitiveType";

export class ProjectionMatrix extends Matrix4x4 {




    constructor(screenW: number, screenH: number, fovInDegree: number = 90, zNear: number = 0.1, zFar: number = 100000) {

        super()


        var w: number = screenW * 0.5;
        var h: number = screenH * 0.5;
        var fov: number = Math.PI / 180 * fovInDegree;
        var focal = (Math.cos(fov / 2) / Math.sin(fov / 2)) * h;
        var aspect = w / h;

        const eye = new Float32Array([0, 0, -focal]);
        const target = new Float32Array([0, 0, 0]);
        const up = new Float32Array([0, 1, 0]);

        mat4.identity(this)

        const projection = mat4.create();
        mat4.perspective(projection, fov, aspect, zNear, zFar);

        const camera = mat4.create();
        mat4.lookAt(camera, eye, target, up);

        const view = mat4.create();
        mat4.invert(view, camera)

        mat4.multiply(this, projection, view);



        this.mustBeTransfered = true;
    }

    public update(): void {
        return;
    }



}