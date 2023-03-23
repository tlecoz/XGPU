import { GPURenderer } from "../speechlessGPU/GPURenderer";
import { Sample } from "./Sample";
import { RotatingCube } from "./Test13";

export class Test15 extends Sample {

    constructor() {
        super(1024, 1024);
    }

    protected async start(renderer: GPURenderer) {

        for (let i = 0; i < 50; i++) {
            var cube = new RotatingCube(renderer);
            cube.scaleX = cube.scaleY = cube.scaleZ = 50;
            cube.x = -512 + Math.random() * 1024;
            cube.y = -512 + Math.random() * 1024;
            cube.z = -512 + Math.random() * 1024;
            renderer.addPipeline(cube);
        }

    }

}