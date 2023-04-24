import { BuiltIns } from "../../speechlessGPU/BuiltIns";
import { GPURenderer } from "../../speechlessGPU/GPURenderer";
import { RenderPipeline } from "../../speechlessGPU/pipelines/RenderPipeline";
import { VertexAttribute } from "../../speechlessGPU/shader/resources/VertexAttribute";
import { VertexBuffer } from "../../speechlessGPU/shader/resources/VertexBuffer";
import { Sample } from "../Sample";

export class HelloTriangle_buffer extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {

        const pipeline: RenderPipeline = new RenderPipeline(renderer);
        const descriptor = pipeline.initFromObject({
            bindgroups: {
                myBindgroup: {
                    myBuffer: new VertexBuffer({
                        position: VertexAttribute.Vec2([
                            [0.0, 0.5],
                            [-0.5, -0.5],
                            [0.5, -0.5]
                        ]),
                    }),
                }
            },
            vertexShader: {
                outputs: {
                    position: BuiltIns.vertexOutputs.position
                },
                main: `output.position = vec4(position,0.0,1.0);`,
            },
            fragmentShader: {
                outputs: {
                    color: BuiltIns.fragmentOutputs.color
                },
                main: `output.color = vec4(1.0,0.0,0.0,1.0);`,
            }
        })

        renderer.addPipeline(pipeline);
    }
}