import { GPURenderer } from "../speechlessGPU/GPURenderer";
import { Sample } from "./Sample";
import dragonRawData from 'stanford-dragon/4';
import { RenderPipeline } from "../speechlessGPU/pipelines/RenderPipeline";
import { VertexBuffer } from "../speechlessGPU/shader/resources/VertexBuffer";
import { IndexBuffer } from "../speechlessGPU/pipelines/resources/IndexBuffer";
import { BuiltIns } from "../speechlessGPU/Builtins";
import { ShaderType } from "../speechlessGPU/shader/ShaderType";
import { ModelViewMatrix } from "../speechlessGPU/shader/PrimitiveType";
import { ProjectionMatrix } from "../speechlessGPU/shader/resources/uniforms/ProjectionMatrix";
import { VertexAttribute } from "../speechlessGPU/shader/resources/VertexAttribute";
import { UniformBuffer } from "../speechlessGPU/shader/resources/UniformBuffer";


export const planeMesh = {
    position: [
        [-0.5, -0.5, 0.0],
        [+0.5, -0.5, 0.0],
        [-0.5, +0.5, 0.0],
        [+0.5, +0.5, 0.0],
    ],
    normals: [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ],
    uvs: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
    ],
    triangles: [
        0, 1, 2,
        1, 3, 2
    ]
}



export class Test18 extends Sample {

    constructor() {
        super(1024, 1024);
    }

    protected async start(renderer: GPURenderer): Promise<void> {


        console.log(planeMesh.triangles)

        const renderPipeline = new RenderPipeline(renderer);
        const resource = renderPipeline.initFromObject({
            indexBuffer: new IndexBuffer({ nbPoint: 6, datas: new Uint32Array(planeMesh.triangles) }),
            bindgroups: {
                geom: {
                    vertexBuffer: new VertexBuffer({
                        position: VertexBuffer.Vec3(),
                        normal: VertexBuffer.Vec3(),
                        uv: VertexBuffer.Vec2(),
                    }),
                    uniforms: new UniformBuffer({
                        modelView: new ModelViewMatrix(),
                        projection: new ProjectionMatrix(renderer.canvas.width, renderer.canvas.height, 45)
                    }, { useLocalVariable: true })
                }
            },
            vertexShader: {
                outputs: {
                    position: BuiltIns.vertexOutputs.position,
                    normal: ShaderType.Vec3,
                    uv: ShaderType.Vec2
                },
                main: `
                    output.position = projection * modelView *  vec4(position,1.0);
                    output.normal = normal;
                    output.uv = uv;
                `
            },
            fragmentShader: {
                outputs: {
                    color: BuiltIns.fragmentOutputs.color
                },
                main: `
                    output.color = vec4(uv,1.0,1.0);
                `
            }

        })

        //renderPipeline.description.primitive.topology = "triangle-list"
        renderPipeline.setupDraw({ vertexCount: 4, instanceCount: 1 })
        //renderPipeline.description.cullMode = "none";

        const modelView = resource.bindgroups.geom.uniforms.items.modelView as ModelViewMatrix;
        modelView.scaleX = modelView.scaleY = modelView.scaleZ = 100;

        renderPipeline.onDrawEnd = () => {
            modelView.z = 100;
            modelView.rotationX += 0.01;
            modelView.rotationY += 0.01;
            modelView.rotationZ += 0.01;
            console.log("update")
        }



        const vertexBuffer = resource.bindgroups.geom.vertexBuffer as VertexBuffer;
        /*
        vertexBuffer.datas = new Float32Array([
            -0.5, -0.5, 0.0,
            +0.5, -0.5, 0.0,
            -0.5, +0.5, 0.0,
            +0.5, +0.5, 0.0,
        ]);
        */

        (vertexBuffer.attributes.position as VertexAttribute).data = planeMesh.position;
        (vertexBuffer.attributes.normal as VertexAttribute).data = planeMesh.normals;
        (vertexBuffer.attributes.uv as VertexAttribute).data = planeMesh.uvs;


        renderer.addPipeline(renderPipeline);
    }

}