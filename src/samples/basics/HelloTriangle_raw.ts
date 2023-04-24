import { BuiltIns } from "../../xGPU/BuiltIns";
import { GPURenderer } from "../../xGPU/GPURenderer";
import { RenderPipeline } from "../../xGPU/pipelines/RenderPipeline";
import { Bindgroup } from "../../xGPU/shader/Bindgroup";
import { VertexAttribute } from "../../xGPU/shader/resources/VertexAttribute";
import { VertexBuffer } from "../../xGPU/shader/resources/VertexBuffer";
import { Sample } from "../Sample";

export class HelloTriangle_raw extends Sample {


    protected async start(renderer: GPURenderer): Promise<void> {

        const pipeline: RenderPipeline = new RenderPipeline(renderer);

        const vertexBuffer: VertexBuffer = new VertexBuffer({ position: VertexAttribute.Vec2() })
        vertexBuffer.datas = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);

        const bindgroup: Bindgroup = new Bindgroup("bindgroupName");
        bindgroup.add("myBuffer", vertexBuffer);

        pipeline.vertexShader.main.text = `output.position = vec4(position,0.0,1.0);`;
        pipeline.fragmentShader.main.text = 'output.color = vec4(1.0,0.0,0.0,1.0);'

        pipeline.bindGroups.add(bindgroup);

        renderer.addPipeline(pipeline);

    }


}