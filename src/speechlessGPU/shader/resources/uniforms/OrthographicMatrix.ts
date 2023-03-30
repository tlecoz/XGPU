import { mat4 } from "gl-matrix";
import { Matrix4x4 } from "../../PrimitiveType";

export class OrthographicMatrix extends Matrix4x4 {




    constructor(screenW: number, screenH: number) {

        super()

        this.className = "mat4x4<f32>"

        var w: number = screenW * 0.5;
        var h: number = screenH * 0.5;
        var fov: number = Math.PI / 180 * 45;
        var focal = (Math.cos(fov / 2) / Math.sin(fov / 2)) * h;
        var aspect = w / h;

        //console.log("focal = ", focal);
        //const eye = new Float32Array([0, 0, focal]);
        const eye = new Float32Array([0, 0, 1]);
        const target = new Float32Array([0, 0, 0]);
        const up = new Float32Array([0, 1, 0]);

        mat4.identity(this)

        const w2 = screenW * 0.5;
        const h2 = screenH * 0.5;
        const d2 = Math.max(w2, h2) * 2;
        const projection = mat4.create();
        mat4.ortho(projection, -w2, w2, h2, -h2, 20000, -20000);

        const camera = mat4.create();
        mat4.lookAt(camera, eye, target, up);

        //const view = mat4.create();
        //mat4.invert(view, camera)

        mat4.multiply(this, projection, camera);



        this.mustBeTransfered = true;
    }

    public update(): void {
        return;
    }



}