import { GPURenderer } from "../../../speechlessGPU/GPURenderer";
import { RenderPipeline } from "../../../speechlessGPU/pipelines/RenderPipeline";
import { Sample } from "../../Sample";

import { cubeVertexArray, cubeVertexSize, cubeUVOffset, cubePositionOffset } from "../../../samples/meshes/CubeMesh";
import { VertexAttribute } from "../../../speechlessGPU/shader/resources/VertexAttribute";
import { ModelViewMatrix } from "../../../speechlessGPU/shader/PrimitiveType";
import { ProjectionMatrix } from "../../../speechlessGPU/shader/resources/uniforms/ProjectionMatrix";
import { BuiltIns } from "../../../speechlessGPU/BuiltIns";
import { ShaderType } from "../../../speechlessGPU/shader/ShaderType";
import { VertexBuffer } from "../../../speechlessGPU/shader/resources/VertexBuffer";

export class Cube extends RenderPipeline {

    public modelView: ModelViewMatrix = new ModelViewMatrix();

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
            modelView: this.modelView,
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
        const transform = cube.modelView;
        transform.scaleX = transform.scaleY = transform.scaleZ = 200;
        cube.onDrawBegin = () => {
            transform.rotationX += 0.01;
            transform.rotationY += 0.01;
            transform.rotationZ += 0.01;
        }

        renderer.addPipeline(cube)
    }
}