import { GPURenderer } from "../../../xGPU/GPURenderer";
import { Float } from "../../../xGPU/shader/PrimitiveType";
import { ShaderType } from "../../../xGPU/shader/ShaderType";
import { UniformBuffer } from "../../../xGPU/shader/resources/UniformBuffer";
import { Sample } from "../../Sample";
import { MouseTrailer } from "./MouseTrailerSample";
import { MouseTrailerDeclinaison } from "./MouseTrailerSample2";


export class MouseTrailerOtherDeclinaison extends MouseTrailerDeclinaison {

    protected time: Float;
    protected startTime: number = new Date().getTime();

    constructor(renderer: GPURenderer) {
        super(renderer);

        /*
        this.grid.x = this.grid.y = 200;
        this.instanceCount = this.grid.x * this.grid.y;
        this.grid.z = 0.005;
        */
        this.gpuPipeline = null;


        const uniformBuffer: UniformBuffer = this.bindGroups.getGroupByName("default").get("uniforms") as UniformBuffer;
        const createLocalVariable: boolean = true;
        this.time = uniformBuffer.add("time", new Float(0.0), createLocalVariable) as Float;

        this.vertexShader.main.createNode(`
           var newPos = vec2(
                cos(time+a) * 0.5 * px +  output.position.x,
                cos(time+a) * 0.5 * py + output.position.y
           );
            output.position = vec4(newPos, 0.0 , 1.0);
        `)

        this.fragmentShader.main.text = `output.color = vec4(abs(sin(time)),1.0,dist,1.0);`

    }

    public update() {
        super.update();
        this.time.x = (new Date().getTime() - this.startTime) / 1000;
    }

}


export class MouseTrailerSample3 extends Sample {

    protected async start(renderer: GPURenderer) {
        renderer.addPipeline(new MouseTrailerOtherDeclinaison(renderer));
    }


}