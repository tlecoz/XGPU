import { BuiltIns } from "../../xGPU/BuiltIns";
import { GPURenderer } from "../../xGPU/GPURenderer";
import { RenderPipeline } from "../../xGPU/pipelines/RenderPipeline";
import { Sample } from "../Sample";

export class HelloTriangle_inline_shorter extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {

        const pipeline: RenderPipeline = new RenderPipeline(renderer);
        pipeline.initFromObject({
            vertexCount: 3,
            vertexIndex: BuiltIns.vertexInputs.vertexIndex,
            vertexShader: `var pos = array<vec2<f32>,3>(
                    vec2(0.0,0.5),
                    vec2(-0.5,-0.5),
                    vec2(0.5,-0.5),
                );
                output.position = vec4(pos[vertexIndex],0.0,1.0);
            `,
            fragmentShader: `output.color = vec4(1.0,0.0,0.0,1.0);`
        })
        renderer.addPipeline(pipeline);
    }

}