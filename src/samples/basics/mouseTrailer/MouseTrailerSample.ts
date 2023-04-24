
import { BuiltIns } from "../../../xGPU/BuiltIns";
import { GPURenderer } from "../../../xGPU/GPURenderer";
import { RenderPipeline } from "../../../xGPU/pipelines/RenderPipeline";
import { Vec2, Vec4 } from "../../../xGPU/shader/PrimitiveType";
import { VertexAttribute } from "../../../xGPU/shader/resources/VertexAttribute";
import { Sample } from "../../Sample";
import { MouseVec } from "./MouseVec";


export class MouseTrailer extends RenderPipeline {

    protected grid: Vec4 = new Vec4(20, 20, 0.05);

    protected getNbInstance(): number { return this.grid.x * this.grid.y; }

    constructor(renderer: GPURenderer) {
        super(renderer);


        this.initFromObject({
            antiAliasing: true,
            instanceCount: this.getNbInstance(),
            instanceIndex: BuiltIns.vertexInputs.instanceIndex,
            grid: this.grid,
            mouse: new MouseVec(renderer.width, renderer.height),
            position: VertexAttribute.Vec2([
                [0.0, 0.5],
                [-0.5, -0.5],
                [0.5, -0.5]
            ]),
            vertexShader: `
                var px = 0.05-1.0 + f32(instanceIndex) % grid.x / grid.x * 2.0;
                var py = 0.05-1.0 + floor(f32(instanceIndex) / grid.x) / grid.y * 2.0;
               
                var a = atan2(position.y,position.x);
                var d = sqrt(position.x * position.x + position.y * position.y) * grid.z;
                
                var a2 = atan2(py - mouse.y,px - mouse.x);
                var dx = px - mouse.x;
                var dy = py - mouse.y;
                d *= sqrt(dx*dx + dy*dy) + mouse.wheel*0.5;

                output.position = vec4(px +  cos(a + a2) * d  ,py + sin(a + a2) * d,0.0,1.0);
            `,
            fragmentShader: `
            if(mouse.down == 1.0){
                output.color = vec4(1.0,0.0,0.0,1.0);
            } else {
                output.color = vec4(1.0,1.0,1.0,1.0);
            }
            `
        })


    }



}




export class MouseTrailerSample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {
        renderer.addPipeline(new MouseTrailer(renderer));
    }

}