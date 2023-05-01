import { GPURenderer } from "../xGPU/GPURenderer";
import { HeadlessGPURenderer } from "../xGPU/HeadlessGPURenderer";
import { RenderPipeline } from "../xGPU/pipelines/RenderPipeline";
import { Matrix4x4Array, ModelViewMatrix } from "../xGPU/shader/PrimitiveType";
import { Sample } from "./Sample";

import { cubeVertexArray, cubeVertexSize, cubeUVOffset, cubePositionOffset } from "../../assets/CubeMesh";
import { VertexBuffer } from "../xGPU/shader/resources/VertexBuffer";
import { UniformBuffer } from "../xGPU/shader/resources/UniformBuffer";
import { ProjectionMatrix } from "./uniforms/ProjectionMatrix";
import { BuiltIns } from "../xGPU/BuiltIns";
import { ShaderType } from "../xGPU/shader/ShaderType";
import { ImageTexture } from "../xGPU/shader/resources/ImageTexture";

export class InstanceCube extends RenderPipeline {


    public instanceMatrixs: ModelViewMatrix[];





    constructor(renderer: GPURenderer | HeadlessGPURenderer, nbInstance: number, options?: any) {
        super(renderer);

        this.setupDraw({ instanceCount: nbInstance })


        const nbComponentTotal = cubeVertexSize / 4
        const positionOffset = cubePositionOffset / 4;
        const uvOffset = cubeUVOffset / 4;



        const instanceMatrixs: ModelViewMatrix[] = this.instanceMatrixs = [];
        for (let i = 0; i < nbInstance; i++) instanceMatrixs[i] = new ModelViewMatrix();






        const resources = this.initFromObject({
            bindgroups: {
                geom: {
                    vb: new VertexBuffer({
                        position: VertexAttribute.Vec4(positionOffset),
                        uv: VertexAttribute.Vec2(uvOffset)
                    }),
                    uniforms: new UniformBuffer({
                        instanceMatrixs: new Matrix4x4Array(instanceMatrixs),
                        projection: new ProjectionMatrix(renderer.canvas.width, renderer.canvas.height, 45),
                    }),

                }
            },
            vertexShader: {
                inputs: {
                    instanceId: BuiltIns.vertexInputs.instanceIndex
                },
                outputs: {
                    position: BuiltIns.vertexOutputs.position,
                    fragUV: ShaderType.Vec2,
                    fragPosition: ShaderType.Vec4
                },
                main: `
                output.position = uniforms.projection *  uniforms.instanceMatrixs[instanceId] * position;
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

        resources.bindgroups.geom.vb.setComplexDatas(cubeVertexArray, nbComponentTotal)

        this.setupDepthStencilView({ size: [renderer.canvas.width, renderer.canvas.height], format: "depth24plus" });
    }



}




export class Test16 extends Sample {

    constructor() {
        super(1024, 1024);
    }

    protected async start(renderer: GPURenderer) {

        const nbInstance = 300;
        /*
        1023 is the max because you can transfert less than 65336 values as uniform
        => each matrix contains 64 values
        ===> 65336 / 64 = 1024  

        but because you must transfert less than 65336 values, the maximum amount of matrix you can send as uniform is 1023
        */


        const cube = new InstanceCube(renderer, nbInstance);

        let instance: ModelViewMatrix;
        //init state : 
        for (let i = 0; i < nbInstance; i++) {
            instance = cube.instanceMatrixs[i];
            instance.scaleX = instance.scaleY = instance.scaleZ = 15;
            instance.x = -512 + Math.random() * 1024;
            instance.y = -512 + Math.random() * 1024;
            instance.z = -512 + Math.random() * 1024;
            instance.rotationX = Math.random() * 3.1416;
            instance.rotationY = Math.random() * 3.1416;
            instance.rotationZ = Math.random() * 3.1416;
        }

        cube.onDrawEnd = () => {

            for (let i = 0; i < nbInstance; i++) {
                instance = cube.instanceMatrixs[i];
                instance.rotationX += 0.01;
                instance.rotationY += 0.01;
                instance.rotationZ += 0.01 + i / (nbInstance * 8);
            }
        }



        renderer.addPipeline(cube);
    }


}