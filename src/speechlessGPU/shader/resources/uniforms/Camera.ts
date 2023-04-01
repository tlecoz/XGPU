import { mat4, vec3 } from "gl-matrix";
import { Matrix4x4, Vec3, Vec4 } from "../../PrimitiveType";
import { UniformBuffer } from "../UniformBuffer";
import { OrthographicMatrix } from "./OrthographicMatrix";
import { ProjectionMatrix } from "./ProjectionMatrix";

export class Camera extends Matrix4x4 {

    private static _upVector: Vec3 = new Vec3(0, 1, 0);
    private static _origin: Vec3 = new Vec3(0, 0, 0);

    public static get upVector(): Vec3 { return Camera._upVector }
    public static get origin(): Vec3 { return Camera._origin }

    protected _screenW: number;
    protected _screenH: number;
    protected _zNear: number;
    protected _zFar: number;
    protected _fovInDegree: number;
    protected _focal: number;

    protected _eyePosition: Vec3;
    protected _target: Vec3;
    protected _viewMatrix: Matrix4x4;
    protected _projectionMatrix: Matrix4x4;

    protected mustUpdateMatrix: boolean = true;


    constructor(screenW: number, screenH: number, fovInDegree: number, zNear: number = 0.1, zFar: number = 10000) {

        super(new Float32Array(16));

        var h: number = screenH * 0.5;
        var fov: number = Math.PI / 180 * fovInDegree;
        this._focal = (Math.cos(fov / 2) / Math.sin(fov / 2)) * h;

        this._screenW = screenW;
        this._screenH = screenH;
        this._fovInDegree = fovInDegree;
        this._zNear = zNear;
        this._zFar = zFar;

        this._target = Camera.origin;
        this._eyePosition = new Vec3(0, h, -this._focal);
        this._viewMatrix = new Matrix4x4();
        this._projectionMatrix = new Matrix4x4();

        this.update();

    }



    public get focal(): number { return this._focal; }

    public get eyePosition(): Vec3 { return this._eyePosition; }
    public get target(): Vec3 { return this._target; }
    public get upVector(): Vec3 { return Camera.upVector; }

    public get viewMatrix(): Matrix4x4 { return this._viewMatrix; }
    public get projectionMatrix(): Matrix4x4 { return this._projectionMatrix; }


    public get screenW(): number { return this._screenW }
    public set screenW(n: number) {
        this._screenW = n;
        this.mustBeTransfered = true;
    }

    public get screenH(): number { return this._screenH }
    public set screenH(n: number) {
        this._screenH = n;
        this.mustBeTransfered = true;
    }
    public get fovInDegree(): number { return this._fovInDegree }
    public set fovInDegree(n: number) {
        this._fovInDegree = n;
        this.mustBeTransfered = true;
    }
    public get zFar(): number { return this._zFar }
    public set zFar(n: number) {
        this._zFar = n;
        this.mustBeTransfered = true;
    }
    public get zNear(): number { return this._zNear }
    public set zNear(n: number) {
        this._zNear = n;
        this.mustBeTransfered = true;
    }


    public get x(): number { return this._eyePosition.x; }
    public get y(): number { return this._eyePosition.y; }
    public get z(): number { return this._eyePosition.z; }

    public set x(n: number) { this._eyePosition.x = n; }
    public set y(n: number) { this._eyePosition.y = n; }
    public set z(n: number) { this._eyePosition.z = n; }





    public update(): void {

        let viewMatrixChanged: boolean = false;

        if (this.mustBeTransfered || this.eyePosition.mustBeTransfered || this.target.mustBeTransfered) {

            const m = mat4.create();

            mat4.rotate(m, m, this._rx, vec3.fromValues(1, 0, 0));
            mat4.rotate(m, m, this._ry, vec3.fromValues(0, 1, 0));
            mat4.rotate(m, m, this._rz, vec3.fromValues(0, 0, 1));
            mat4.translate(m, m, this.eyePosition);

            const newPosition = vec3.create();
            vec3.transformMat4(newPosition, newPosition, m);


            mat4.lookAt(this.viewMatrix, newPosition, this.target, Camera.upVector);
            mat4.scale(this.viewMatrix, this.viewMatrix, vec3.fromValues(this._sx, this._sy, this._sz));
            this.eyePosition.mustBeTransfered = this.target.mustBeTransfered = false;

            var fov: number = Math.PI / 180 * this._fovInDegree;
            var aspect = this._screenH / this._screenH;
            mat4.perspective(this.projectionMatrix, fov, aspect, this._zNear, this._zFar);

            mat4.multiply(this, this.projectionMatrix, this.viewMatrix)

            this.mustBeTransfered = true;

        }



        //this.mustUpdateMatrix = false;

    }






}