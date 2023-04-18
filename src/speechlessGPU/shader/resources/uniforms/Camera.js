import { mat4, vec3 } from "gl-matrix";
import { Matrix4x4, Vec3 } from "../../PrimitiveType";
export class Camera extends Matrix4x4 {
    static _upVector = new Vec3(0, 1, 0);
    static _origin = new Vec3(0, 0, 0);
    static get upVector() { return Camera._upVector; }
    static get origin() { return Camera._origin; }
    _screenW;
    _screenH;
    _zNear;
    _zFar;
    _fovInDegree;
    _focal;
    _eyePosition;
    _target;
    _viewMatrix;
    _projectionMatrix;
    mustUpdateMatrix = true;
    constructor(screenW, screenH, fovInDegree, zNear = 0.1, zFar = 10000) {
        super(new Float32Array(16));
        var h = screenH * 0.5;
        var fov = Math.PI / 180 * fovInDegree;
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
    get focal() { return this._focal; }
    get eyePosition() { return this._eyePosition; }
    get target() { return this._target; }
    get upVector() { return Camera.upVector; }
    get viewMatrix() { return this._viewMatrix; }
    get projectionMatrix() { return this._projectionMatrix; }
    get screenW() { return this._screenW; }
    set screenW(n) {
        this._screenW = n;
        this.mustBeTransfered = true;
    }
    get screenH() { return this._screenH; }
    set screenH(n) {
        this._screenH = n;
        this.mustBeTransfered = true;
    }
    get fovInDegree() { return this._fovInDegree; }
    set fovInDegree(n) {
        this._fovInDegree = n;
        this.mustBeTransfered = true;
    }
    get zFar() { return this._zFar; }
    set zFar(n) {
        this._zFar = n;
        this.mustBeTransfered = true;
    }
    get zNear() { return this._zNear; }
    set zNear(n) {
        this._zNear = n;
        this.mustBeTransfered = true;
    }
    get x() { return this._eyePosition.x; }
    get y() { return this._eyePosition.y; }
    get z() { return this._eyePosition.z; }
    set x(n) { this._eyePosition.x = n; }
    set y(n) { this._eyePosition.y = n; }
    set z(n) { this._eyePosition.z = n; }
    update() {
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
            var fov = Math.PI / 180 * this._fovInDegree;
            var aspect = this._screenH / this._screenH;
            mat4.perspective(this.projectionMatrix, fov, aspect, this._zNear, this._zFar);
            mat4.multiply(this, this.projectionMatrix, this.viewMatrix);
            this.mustBeTransfered = true;
        }
        //this.mustUpdateMatrix = false;
    }
}
