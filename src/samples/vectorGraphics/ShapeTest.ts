import { Graphics } from "./Graphics";

export class ShapeTest extends Graphics {
    private static _instance: ShapeTest;
    public static get instance(): ShapeTest {
        if (!ShapeTest._instance) ShapeTest._instance = new ShapeTest();
        return ShapeTest._instance;
    }
    constructor() {
        super();
        this.moveTo(-2.2, -283.675, 0);
        this.curveTo(-2.1, -283.625, 0, -2, -283.575, 0);
        this.curveTo(55.45, -173.875, 0, 160.25, -66.125, 0);
        this.curveTo(131.25, -58.795, 0, 102.25, -51.475, 0);
        this.curveTo(155.45, 6.775, 0, 208.65, 65.025, 0);
        this.curveTo(186.38, 75.455, 0, 164.1, 85.875, 0);
        this.curveTo(216.98, 141.955, 0, 269.85, 198.025, 0);
        this.curveTo(229, 215.475, 0, 177.85, 225.175, 0);
        this.curveTo(104.88, 235.275, 0, 31.9, 245.375, 0);
        this.curveTo(32.03, 264.525, 0, 32.15, 283.675, 0);
        this.curveTo(1.2, 283.675, 0, -29.75, 283.675, 0);
        this.curveTo(-30.42, 264.125, 0, -31.1, 244.575, 0);
        this.curveTo(-156.6, 240.225, 0, -269.85, 201.225, 0);
        this.curveTo(-215.75, 145.475, 0, -163.4, 84.825, 0);
        this.curveTo(-187.55, 76.825, 0, -211.7, 68.825, 0);
        this.curveTo(-152.5, 13.325, 0, -111.45, -49.975, 0);
        this.curveTo(-137.92, -56.845, 0, -164.4, -63.725, 0);
        this.curveTo(-122.85, -102.675, 0, -87.85, -147.475, 0);
        this.curveTo(-83.15, -153.675, 0, -78.5, -159.875, 0);
        this.curveTo(-73.9, -166.125, 0, -69.4, -172.475, 0);
        this.curveTo(-66.3, -176.825, 0, -63.3, -181.225, 0);
        this.curveTo(-60.3, -185.575, 0, -57.35, -189.925, 0);
        this.curveTo(-54.45, -194.275, 0, -51.6, -198.625, 0);
        this.curveTo(-48.8, -202.925, 0, -46, -207.225, 0);
        this.curveTo(-20.7, -246.675, 0, -2.2, -283.675, 0);
    }
}