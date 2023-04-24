import { BuiltIns } from "../../xGPU/BuiltIns";
import { GPURenderer } from "../../xGPU/GPURenderer";
import { RenderPipeline } from "../../xGPU/pipelines/RenderPipeline";
import { Vec4, Vec4Array } from "../../xGPU/shader/PrimitiveType";
import { ShaderType } from "../../xGPU/shader/ShaderType";
import { UniformBuffer } from "../../xGPU/shader/resources/UniformBuffer";
import { Sample } from "../Sample";

export class HelloTriangle_uniform_shorter extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {

        const pipeline: RenderPipeline = new RenderPipeline(renderer);
        pipeline.initFromObject({
            vertexCount: 3,

            vertexIndex: BuiltIns.vertexInputs.vertexIndex,
            vertexPos: new Vec4Array([
                new Vec4(0.0, 0.5, 0.0, 1.0),
                new Vec4(-0.5, -0.5, 0.0, 1.0),
                new Vec4(0.5, -0.5, 0.0, 1.0),
            ]),

            vertexShader: `output.position = uniforms.vertexPos[vertexIndex];`,
            fragmentShader: `output.color = vec4(1.0,0.0,0.0,1.0);`
        })
        renderer.addPipeline(pipeline);
    }

}