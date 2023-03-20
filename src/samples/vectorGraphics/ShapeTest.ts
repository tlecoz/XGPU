import { Graphics } from "./Graphics";

export class ShapeTest extends Graphics {
    private static _instance: ShapeTest;
    public static get instance(): ShapeTest {
        if (!ShapeTest._instance) ShapeTest._instance = new ShapeTest();
        return ShapeTest._instance;
    }
    constructor() {
        super();
        this.moveTo(378.075, 319.2, 0);
        this.curveTo(245.875, 451.45, 0, 58.875, 451.45, 0);
        this.curveTo(-128.125, 451.45, 0, -260.375, 319.2, 0);
        this.curveTo(-392.575, 187, 0, -392.575, 0, 0);
        this.curveTo(-392.575, -187, 0, -260.375, -319.25, 0);
        this.curveTo(-128.125, -451.45, 0, 58.875, -451.45, 0);
        this.curveTo(245.875, -451.45, 0, 378.075, -319.25, 0);
        this.curveTo(382.525, -314.8, 0, 386.775, -310.35, 0);
        this.curveTo(282.625, -298.1, 0, 205.375, -220.85, 0);
        this.curveTo(113.525, -129, 0, 113.525, 0.8, 0);
        this.curveTo(113.525, 130.65, 0, 205.375, 222.45, 0);
        this.curveTo(282.075, 299.2, 0, 392.575, 306.35, 0);
        this.curveTo(381.725, 315.55, 0, 378.075, 319.2, 0);
    }
}