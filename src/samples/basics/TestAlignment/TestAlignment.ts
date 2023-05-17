import { BuiltIns } from "../../../xGPU/BuiltIns";
import { GPURenderer } from "../../../xGPU/GPURenderer";
import { RenderPipeline } from "../../../xGPU/pipelines/RenderPipeline";
import { Float, Vec2, Vec3 } from "../../../xGPU/shader/PrimitiveType";
import { Sample } from "../../Sample";



class Mouse extends Vec3 {

    constructor(canvas: HTMLCanvasElement | any) {
        super(0, 0, 0);
        this.initStruct(["x", "y", "down"]);

        document.body.addEventListener("mousemove", (e) => {

            const r = canvas.getBoundingClientRect();
            const px = e.clientX - r.x;
            const py = e.clientY - r.y;

            this.x = -1.0 + (px / canvas.width) * 2.0;
            this.y = 1.0 - (py / canvas.height) * 2.0;
        })
        document.body.addEventListener("mousedown", () => { this.z = 1; })
        document.body.addEventListener("mouseup", () => { this.z = 0; })

    }

    public get down(): boolean { return this.z === 1 }
    public set down(b: boolean) {
        if (b) this.z = 1;
        else this.z = 0;
    }


}


export class TestAlignment_Sample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {

        const pipeline = new RenderPipeline(renderer);
        pipeline.initFromObject({

            a: new Float(0.25),
            mouse: new Mouse(renderer.canvas),
            b: new Vec2(0.5, 0.0),
            c: new Float(0.75),
            vertexId: BuiltIns.vertexInputs.vertexIndex,
            vertexCount: 6,
            vertexShader: {
                code: `
                const pos = array<vec2<f32>,6>(
                    vec2(-1.0, -1.0),
                    vec2(1.0, -1.0),
                    vec2(-1.0, 1.0),
                    vec2(1.0, -1.0),
                    vec2(1.0, 1.0),
                    vec2(-1.0, 1.0),
                 );
                `,
                main: `output.position = vec4(pos[vertexId],0.0,1.0);`
            },
            fragmentShader: `
                //output.color = vec4(a,a,a,1.0);
                output.color = vec4(mouse.x,mouse.y,mouse.down,1.0);
                //output.color = vec4(c,c,c,1.0);
            `
        })

        renderer.addPipeline(pipeline);


    }


}