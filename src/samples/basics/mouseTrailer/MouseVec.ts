import { Vec4 } from "../../../xGPU/shader/PrimitiveType";

export class MouseVec extends Vec4 {

    constructor(screenW: number, screenH: number) {
        super(0, 0, 0, 0);
        this.initStruct(["x", "y", "down", "wheel"]);

        document.body.addEventListener("mousemove", (e) => {
            this.x = -1.0 + (e.clientX / screenW) * 2.0;
            this.y = 1.0 - (e.clientY / screenH) * 2.0;
        })
        document.body.addEventListener("mousedown", () => { this.z = 1; })
        document.body.addEventListener("mouseup", () => { this.z = 0; })
        document.body.addEventListener("wheel", (e) => {
            if (e.deltaY > 0) this.w = 1;
            else this.w = -1;

        })
    }

    public get down(): boolean { return this.z === 1 }
    public set down(b: boolean) {
        if (b) this.z = 1;
        else this.z = 0;
    }
    public get wheelDelta(): number { return this.w }
    public set wheelDelta(n: number) { this.w = n; }
}