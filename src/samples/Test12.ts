import { GPURenderer } from "../speechlessGPU/GPURenderer";
import { Sample } from "./Sample";
import { GraphicPipeline } from "./vectorGraphics/GraphicPipeline";
import { ShapeTest } from "./vectorGraphics/ShapeTest";

export class Test12 extends Sample {

    constructor() {
        super(1024, 1024);
    }

    protected async start(renderer: GPURenderer) {

        var graphicPipeline = new GraphicPipeline(renderer);
        graphicPipeline.addGraphics(new ShapeTest(), 0);
        graphicPipeline.setGraphicById(0);
        graphicPipeline.buildGpuPipeline();
        renderer.addPipeline(graphicPipeline);
    }

}