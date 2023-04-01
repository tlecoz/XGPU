import { mat4, vec3 } from "gl-matrix";
import { Float, Matrix4x4, Vec3, Vec4 } from "../../shader/PrimitiveType";
import { UniformBuffer } from "../../shader/resources/UniformBuffer";

export class Light extends UniformBuffer {

    private static origin: Vec3 = new Vec3(0, 0, 0);
    private static upVector: Vec3 = new Vec3(0, 1, 0);

    protected viewMatrix: mat4;
    protected projectionMatrix: mat4;

    constructor(screenW: number, screenH: number) {
        super({
            //lightViewProjMatrix: obj,
            position: new Vec3(50, 200, -200),
            projection: new Matrix4x4(new Float32Array(16)),
            ambient: new Vec3(0.2, 0.2, 0.2),
            color: new Vec3(1.0, 1.0, 1.0),
            projectionScale: new Float(0.5)
        }, { useLocalVariable: false })


        this.viewMatrix = mat4.create();
        this.createProjectionMatrix(screenW, screenH);
        this.update();
    }

    public update(): void {

        const lightViewMatrix = mat4.create();
        const p = this.items.position;
        const scale = this.items.projectionScale;
        const pos = vec3.fromValues(p.x * scale, p.y * scale, p.z * scale);
        mat4.lookAt(lightViewMatrix, pos, Light.origin, Light.upVector);
        mat4.multiply(this.items.projection, this.projectionMatrix, lightViewMatrix);

        //we must set 'mustBeTransfered' manually because we use a function from 'mat4' to transfrom the array
        this.items.projection.mustBeTransfered = true

        super.update();
    }


    protected createProjectionMatrix(screenW: number, screenH: number) {

        const _w = screenW * this.items.projectionScale;
        const _h = screenH * this.items.projectionScale;
        const left = -_w;
        const right = _w;
        const bottom = -_h;
        const top = _h;
        const near = -_w * 5;
        const far = _w * 5;

        if (!this.projectionMatrix) this.projectionMatrix = mat4.create();
        mat4.ortho(this.projectionMatrix, left, right, bottom, top, near, far);

    }

    public get ambientR(): number { return this.items.ambient.x }
    public get ambientG(): number { return this.items.ambient.y }
    public get ambientB(): number { return this.items.ambient.z }

    public set ambientR(n: number) { this.items.ambient.x = n }
    public set ambientG(n: number) { this.items.ambient.y = n }
    public set ambientB(n: number) { this.items.ambient.z = n }


    public get r(): number { return this.items.color.x }
    public get g(): number { return this.items.color.y }
    public get b(): number { return this.items.color.z }

    public set r(n: number) { this.items.color.x = n }
    public set g(n: number) { this.items.color.y = n }
    public set b(n: number) { this.items.color.z = n }

    public get x(): number { return this.items.position.x; }
    public get y(): number { return this.items.position.y; }
    public get z(): number { return this.items.position.z; }

    public set x(n: number) { this.items.position.x = n; }
    public set y(n: number) { this.items.position.y = n; }
    public set z(n: number) { this.items.position.z = n; }
}


/*
import { mat4, vec3 } from "gl-matrix";
import { Matrix4x4, Vec3, Vec4 } from "../../shader/PrimitiveType";
import { UniformBuffer } from "../../shader/resources/UniformBuffer";


export class Light extends UniformBuffer {

    private static origin: Vec3 = new Vec3(0, 0, 0);
    private static upVector: Vec3 = new Vec3(0, 1, 0);

    protected viewMatrix: mat4;
    protected projectionMatrix: mat4;


    constructor(screenW: number, screenH: number) {

        super({
            position: new Vec3(50, 200, -200),
            projection: new Matrix4x4(new Float32Array(16)),
            ambientColor: new Vec4(0.2, 0.2, 0.2, 1.0),
            color: new Vec4(1.0, 1.0, 1.0, 1.0),
        }, { useLocalVariable: false })

        this.viewMatrix = mat4.create();
        this.createProjectionMatrix(screenW, screenH);
        this.update();


    }

    public update(): void {


        const lightPosition = vec3.fromValues(50, 200, -200);
        const lightViewMatrix = mat4.create();
        mat4.lookAt(lightViewMatrix, lightPosition, Light.origin, Light.upVector);
        mat4.multiply(this.items.projection, this.projectionMatrix, lightViewMatrix);




    }


    protected createProjectionMatrix(screenW: number, screenH: number) {

        const _w = screenW;
        const _h = screenH;
        const left = -_w;
        const right = _w;
        const bottom = -_h;
        const top = _h;
        const near = -_w * 5;
        const far = _w * 5;

        if (!this.projectionMatrix) this.projectionMatrix = mat4.create();
        mat4.ortho(this.projectionMatrix, left, right, bottom, top, near, far);

    }


    public get ambientR(): number { return this.items.ambientColor.x }
    public get ambientG(): number { return this.items.ambientColor.y }
    public get ambientB(): number { return this.items.ambientColor.z }

    public set ambientR(n: number) { this.items.ambientColor.x = n }
    public set ambientG(n: number) { this.items.ambientColor.y = n }
    public set ambientB(n: number) { this.items.ambientColor.z = n }


    public get r(): number { return this.items.color.x }
    public get g(): number { return this.items.color.y }
    public get b(): number { return this.items.color.z }

    public set r(n: number) { this.items.color.x = n }
    public set g(n: number) { this.items.color.y = n }
    public set b(n: number) { this.items.color.z = n }

    public get x(): number { return this.items.position.x; }
    public get y(): number { return this.items.position.y; }
    public get z(): number { return this.items.position.z; }

    public set x(n: number) { this.items.position.x = n; }
    public set y(n: number) { this.items.position.y = n; }
    public set z(n: number) { this.items.position.z = n; }


}
*/