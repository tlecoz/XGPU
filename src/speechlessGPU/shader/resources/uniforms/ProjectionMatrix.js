import { mat4 } from "gl-matrix";
import { Matrix4x4 } from "../../PrimitiveType";
export class ProjectionMatrix extends Matrix4x4 {
    constructor(screenW, screenH, fovInDegree = 90, zNear = 0.1, zFar = 100000) {
        super();
        this.className = "mat4x4<f32>";
        var w = screenW * 0.5;
        var h = screenH * 0.5;
        var fov = Math.PI / 180 * fovInDegree;
        var focal = (Math.cos(fov / 2) / Math.sin(fov / 2)) * h;
        var aspect = w / h;
        //console.log("focal = ", focal);
        //const eye = new Float32Array([0, 0, focal]);
        const eye = new Float32Array([0, 50, -focal]);
        const target = new Float32Array([0, 0, 0]);
        const up = new Float32Array([0, 1, 0]);
        mat4.identity(this);
        const projection = mat4.create();
        mat4.perspective(projection, fov, aspect, zNear, zFar);
        const camera = mat4.create();
        mat4.lookAt(camera, eye, target, up);
        //const view = mat4.create();
        //mat4.invert(view, camera)
        console.log("#0 this ", this);
        mat4.multiply(this, projection, camera);
        console.log("#1 this ", this);
        this.mustBeTransfered = true;
    }
    update() {
        return;
    }
}
