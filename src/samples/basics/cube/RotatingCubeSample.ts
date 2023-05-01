import { GPURenderer } from "../../../xGPU/GPURenderer";
import { RenderPipeline } from "../../../xGPU/pipelines/RenderPipeline";
import { Sample } from "../../Sample";

import { cubeVertexArray, cubeVertexSize, cubeUVOffset, cubePositionOffset } from "../../../samples/meshes/CubeMesh";
import { VertexAttribute } from "../../../xGPU/shader/resources/VertexAttribute";
import { ProjectionMatrix } from "../../uniforms/ProjectionMatrix";
import { BuiltIns } from "../../../xGPU/BuiltIns";
import { ShaderType } from "../../../xGPU/shader/ShaderType";
import { VertexBuffer } from "../../../xGPU/shader/resources/VertexBuffer";
import { ModelViewMatrix } from "../../uniforms/ModelViewMatrix";

export class Cube extends RenderPipeline {

    public transform: ModelViewMatrix = new ModelViewMatrix();

    constructor(renderer, options?: any) {
        super(renderer);

        this.initFromObject(this.createPipelineDescriptor(options))

        const vertexBuffer = this.bindGroups.getGroupByName("default").get("buffer") as VertexBuffer;
        vertexBuffer.setComplexDatas(cubeVertexArray, cubeVertexSize / 4)

    }

    protected createPipelineDescriptor(options?: any): any {


        const positionOffset = cubePositionOffset / 4;
        const uvOffset = cubeUVOffset / 4;
        const fieldOfViewInDegree = 45;

        return {
            cullMode: "back",
            depthTest: true,
            position: VertexAttribute.Vec4(positionOffset),
            uv: VertexAttribute.Vec2(uvOffset),
            modelView: this.transform,
            projection: new ProjectionMatrix(this.renderer.width, this.renderer.height, fieldOfViewInDegree),

            vertexShader: {
                outputs: {
                    position: BuiltIns.vertexOutputs.position,
                    fragUV: ShaderType.Vec2,
                    fragPosition: ShaderType.Vec4
                },
                main: `
                output.position = uniforms.projection *  uniforms.modelView * position;
                output.fragUV = uv;
                output.fragPosition = 0.5 * (position + vec4<f32>(1.0));
                `
            },
            fragmentShader: `output.color = fragPosition;`,
            ...options
        }
    }
}




export class RotatingCubeSample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {


        const cube = new Cube(renderer);
        const transform = cube.transform;
        transform.scaleX = transform.scaleY = transform.scaleZ = 200;
        cube.onDrawBegin = () => {
            transform.rotationX += 0.01;
            transform.rotationY += 0.01;
            transform.rotationZ += 0.01;
        }

        renderer.addPipeline(cube)
    }
}