import { GPURenderer } from "../../../speechlessGPU/GPURenderer";
import { ShaderType } from "../../../speechlessGPU/shader/ShaderType";
import { Sample } from "../../Sample";
import { MouseTrailer } from "./MouseTrailerSample";


export class MouseTrailerDeclinaison extends MouseTrailer {

    constructor(renderer: GPURenderer) {
        super(renderer);

        this.vertexShader.addOutputVariable("dist", ShaderType.Float);

        this.vertexShader.main.createNode(`
            let dist = -1.0+ distance(output.position.xy,vec2(mouse.x,mouse.y));
            output.position = vec4( output.position.xy - dist*-0.5 , 0.0 , 1.0);
            output.dist = dist;
        `)
        this.vertexShader.main.executeSubNodeAfterCode = true; // true by default

        this.fragmentShader.main.text = "output.color = vec4(1.0,dist*1.5,1.0,1.0);"
    }


}


export class MouseTrailerSample2 extends Sample {

    protected async start(renderer: GPURenderer) {
        renderer.addPipeline(new MouseTrailerDeclinaison(renderer));
    }


}