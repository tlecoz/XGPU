import { Matrix4x4 } from "../../xGPU/shader/PrimitiveType";
import { mat4 } from "gl-matrix";
export class ModelViewMatrix extends Matrix4x4 {


    public model: Matrix4x4;
    public view: Matrix4x4;

    constructor() {

        super();
        this.className = "mat4x4<f32>"
        this.model = new Matrix4x4();
        this.view = new Matrix4x4();
    }

    public get x(): number { return this.view.x; }
    public get y(): number { return this.view.y; }
    public get z(): number { return this.view.z; }

    public get rotationX(): number { return this.model.rotationX; }
    public get rotationY(): number { return this.model.rotationY; }
    public get rotationZ(): number { return this.model.rotationZ; }

    public get scaleX(): number { return this.model.scaleX; }
    public get scaleY(): number { return this.model.scaleY; }
    public get scaleZ(): number { return this.model.scaleZ; }


    public set x(n: number) {
        if (n === this.view.x) return;
        this.view.x = n;
    }

    public set y(n: number) {
        if (n === this.view.y) return;
        this.view.y = n;
    }

    public set z(n: number) {
        if (n === this.view.z) return;
        this.view.z = n;

    }

    public set rotationX(n: number) {
        if (n === this.model.rotationX) return;
        this.model.rotationX = n;
    }

    public set rotationY(n: number) {
        if (n === this.model.rotationY) return;
        this.model.rotationY = n;
    }

    public set rotationZ(n: number) {
        if (n === this.model.rotationZ) return;
        this.model.rotationZ = n;
    }

    public set scaleX(n: number) {
        if (n === this.model.scaleX) return;
        this.model.scaleX = n;
    }

    public set scaleY(n: number) {
        if (n === this.model.scaleY) return;
        this.model.scaleY = n;
    }

    public set scaleZ(n: number) {
        if (n === this.model.scaleZ) return;
        this.model.scaleZ = n;
    }

    public override set(m: Float32Array, offset?: number) {
        super.set(m, offset);
        this.mustBeTransfered = true;
    }
    public setMatrix(mat: Float32Array) {
        this.set(mat);
        this.mustBeTransfered = true;
    }

    public update() {

        if (this.model.mustBeTransfered || this.view.mustBeTransfered) {
            if (this.model.mustBeTransfered) this.model.update();
            if (this.view.mustBeTransfered) this.view.update();
            //mat4.identity(this);
            mat4.multiply(this, this.view, this.model);
            this.model.mustBeTransfered = this.view.mustBeTransfered = false;
            this.mustBeTransfered = true;
        }
    }
}