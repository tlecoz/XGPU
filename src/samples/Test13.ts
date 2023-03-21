import { GPURenderer } from "../speechlessGPU/GPURenderer";
import { HeadlessGPURenderer } from "../speechlessGPU/HeadlessGPURenderer";
import { RenderPipeline } from "../speechlessGPU/pipelines/RenderPipeline";
import { Sample } from "./Sample";

import { cubeVertexArray, cubeVertexSize, cubeUVOffset, cubePositionOffset } from "../../assets/CubeMesh";
import { VertexBuffer } from "../speechlessGPU/shader/resources/VertexBuffer";
import { ShaderType } from "../speechlessGPU/shader/ShaderType";
import { BuiltIns } from "../speechlessGPU/Builtins";
import { UniformBuffer } from "../speechlessGPU/shader/resources/UniformBuffer";
import { ProjectionMatrix } from "../speechlessGPU/shader/resources/uniforms/ProjectionMatrix";
import { Matrix4x4 } from "../speechlessGPU/shader/PrimitiveType";


export class RotatingCube extends RenderPipeline {


    constructor(renderer: GPURenderer | HeadlessGPURenderer) {
        super(renderer);

        const nbComponentTotal = cubeVertexSize / 4
        const positionOffset = cubePositionOffset / 4;
        const uvOffset = cubeUVOffset / 4;

        var viewMatrix = new Matrix4x4();
        var model = new Matrix4x4();

        var resource = this.initFromObject({
            bindgroups: {
                geom: {
                    vb: new VertexBuffer({
                        position: VertexBuffer.Vec4(positionOffset),
                        uv: VertexBuffer.Vec2(uvOffset)
                    }),
                    uniforms: new UniformBuffer({
                        model: model,
                        view: viewMatrix,
                        projection: new ProjectionMatrix(renderer.canvas.width, renderer.canvas.height, 45),
                    })
                }
            },
            vertexShader: {
                outputs: {
                    position: BuiltIns.vertexOutputs.position,
                    fragUV: ShaderType.Vec2,
                    fragPosition: ShaderType.Vec4
                },
                main: `
                output.position = uniforms.projection *  uniforms.view * uniforms.model * position;
                output.fragUV = uv;
                output.fragPosition = 0.5 * (position + vec4<f32>(1.0, 1.0, 1.0, 1.0));
                `
            },

            fragmentShader: {
                outputs: {
                    color: BuiltIns.fragmentOutputs.color
                },
                main: `
                output.color = fragPosition;
                `
            }
        })

        resource.bindgroups.geom.vb.setComplexDatas(cubeVertexArray, nbComponentTotal)


        this.setupDepthStencilView({ size: [renderer.canvas.width, renderer.canvas.height], format: "depth24plus" });
        this.buildGpuPipeline();

        this.onDrawEnd = () => {
            model.scaleX = model.scaleY = model.scaleZ = 200.0;
            model.rotationX += 0.01;
            model.rotationY += 0.01;
            model.rotationZ += 0.01;
        }
    }





}








export class Test13 extends Sample {


    constructor() {
        super(1024, 1024);
    }

    protected async start(renderer: GPURenderer) {


        var cube = new RotatingCube(renderer);

        renderer.addPipeline(cube);





    }


}