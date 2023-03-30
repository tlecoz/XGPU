import { mat4, vec3 } from "gl-matrix";
import { Matrix4x4, Vec3, Vec4 } from "../../shader/PrimitiveType";
import { UniformBuffer } from "../../shader/resources/UniformBuffer";

export class Light extends UniformBuffer {

    public modelMatrixName: string; //used to make a link with shadowPipeline resource and shader
    public vertexPositionName: string;//same
    public vertexNormalName: string;//same


    public modelMatrix: Matrix4x4;  //same... 

    protected lightOrthoCamera: Matrix4x4;

    constructor(x: number, y: number, z: number, w: number = 1) {
        super({
            lightPos: new Vec3(x, y, z),
            lightViewProjMatrix: new Matrix4x4(),
            ambientLight: new Vec4(0.02, 0.02, 0.02, 1.0),
            colorMulti: new Vec4(0.99, 0.99, 0.99, 1.0),
        })
    }


    public get r(): number { return this.items.colorMulti[0] }
    public get g(): number { return this.items.colorMulti[1] }
    public get b(): number { return this.items.colorMulti[2] }
    public get a(): number { return this.items.colorMulti[3] }

    public set r(n: number) { this.items.colorMulti.x = n; }
    public set g(n: number) { this.items.colorMulti.y = n; }
    public set b(n: number) { this.items.colorMulti.z = n; }
    public set a(n: number) { this.items.colorMulti.w = n; }

    public get ambientR(): number { return this.items.ambientLight[0] }
    public get ambientG(): number { return this.items.ambientLight[1] }
    public get ambientB(): number { return this.items.ambientLight[2] }

    public set ambientR(n: number) { this.items.ambientLight.x = n; }
    public set ambientG(n: number) { this.items.ambientLight.y = n; }
    public set ambientB(n: number) { this.items.ambientLight.z = n; }

    public set ambienRGB(n: number) { this.items.ambientLight.x = this.items.ambientLight.y = this.items.ambientLight.z = n }

    public get insideModel(): boolean { return this.items.ambientLight.w === 1 };
    public set insideModel(b: boolean) {
        if (b) this.items.ambientLight.w = 1;
        else this.items.ambientLight.w = 0;
    }

    public update(): void {


        if (!this.lightOrthoCamera) return;

        if (!this.lightViewProjMatrix || this.position.mustBeTransfered) {

            const lightViewMatrix = mat4.create();
            mat4.lookAt(lightViewMatrix, this.position, vec3.fromValues(0, 0, 0), vec3.fromValues(0, -1, 0));
            //mat4.lookAt(lightViewMatrix, this.position, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));


            // console.log(lightViewMatrix)
            const lightViewProjMatrix = mat4.create();
            //console.log("orth = ", this.lightOrthoCamera)
            mat4.multiply(lightViewProjMatrix, this.lightOrthoCamera, lightViewMatrix);
            this.lightViewProjMatrix.set(lightViewProjMatrix);
            this.mustBeTransfered = true;
        }
        super.update();

    }

    public init(rendererW: number, rendererH: number, near: number = -20000, far: number = 20000): void {

        //console.log("light.init")

        const lightProjectionMatrix = mat4.create();
        const left = -rendererW * 0.5;
        const right = rendererW * 0.5;
        const bottom = -rendererH * 0.5;
        const top = rendererH * 0.5;

        mat4.ortho(lightProjectionMatrix, left, right, bottom, top, near, far);
        this.lightOrthoCamera = new Matrix4x4(lightProjectionMatrix as Float32Array);

        this.update();
    }

    public get position(): Vec3 { return this.items.lightPos as Vec3; }
    public get lightViewProjMatrix(): Matrix4x4 { return this.items.lightViewProjMatrix }

}