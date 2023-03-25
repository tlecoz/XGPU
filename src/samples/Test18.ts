import { GPURenderer } from "../speechlessGPU/GPURenderer";
import { Sample } from "./Sample";

import { RenderPipeline } from "../speechlessGPU/pipelines/RenderPipeline";
import { VertexBuffer } from "../speechlessGPU/shader/resources/VertexBuffer";
import { IndexBuffer } from "../speechlessGPU/pipelines/resources/IndexBuffer";
import { BuiltIns } from "../speechlessGPU/Builtins";
import { ShaderType } from "../speechlessGPU/shader/ShaderType";
import { ModelViewMatrix } from "../speechlessGPU/shader/PrimitiveType";
import { ProjectionMatrix } from "../speechlessGPU/shader/resources/uniforms/ProjectionMatrix";
import { VertexAttribute } from "../speechlessGPU/shader/resources/VertexAttribute";
import { UniformBuffer } from "../speechlessGPU/shader/resources/UniformBuffer";

import { planeMesh } from "../../assets/PlaneMesh";
import { dragonMesh } from "../../assets/DragonMesh"
import { HeadlessGPURenderer } from "../speechlessGPU/HeadlessGPURenderer";


export class Plane extends RenderPipeline {

    public transform: ModelViewMatrix;

    constructor(renderer: GPURenderer | HeadlessGPURenderer) {
        super(renderer);

        const resource = this.initFromObject({
            indexBuffer: new IndexBuffer({ nbPoint: 6, datas: new Uint32Array(planeMesh.triangles) }),
            bindgroups: {
                geom: {
                    vertexBuffer: new VertexBuffer({
                        position: VertexBuffer.Vec3(planeMesh.position),
                        normal: VertexBuffer.Vec3(planeMesh.normals),
                        uv: VertexBuffer.Vec2(planeMesh.uvs),
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
        this.setupDraw({ vertexCount: 4, instanceCount: 1 })
        this.transform = resource.bindgroups.geom.uniforms.items.modelView;

        /*
       const vertexBuffer = resource.bindgroups.geom.vertexBuffer as VertexBuffer;
       (vertexBuffer.attributes.position as VertexAttribute).datas = planeMesh.position;
       (vertexBuffer.attributes.normal as VertexAttribute).datas = planeMesh.normals;
       (vertexBuffer.attributes.uv as VertexAttribute).datas = planeMesh.uvs;
       */
    }

}


export class Dragon extends RenderPipeline {

    public transform: ModelViewMatrix;

    constructor(renderer: GPURenderer | HeadlessGPURenderer) {
        super(renderer);

        const resource = this.initFromObject({
            indexBuffer: new IndexBuffer({ nbPoint: dragonMesh.triangles.length * 3, datas: new Uint32Array(dragonMesh.triangles) }),
            bindgroups: {
                geom: {
                    vertexBuffer: new VertexBuffer({
                        position: VertexBuffer.Vec3(dragonMesh.positions),
                        normal: VertexBuffer.Vec3(dragonMesh.normals),
                        uv: VertexBuffer.Vec2(dragonMesh.uvs),
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
                    output.color = vec4(uv,0,1.0);
                `
            }
        })

        console.log(dragonMesh.positions)
        this.setupDraw({ vertexCount: dragonMesh.positions.length, instanceCount: 1 })
        this.transform = resource.bindgroups.geom.uniforms.items.modelView;
        this.setupDepthStencilView({ size: [renderer.canvas.width, renderer.canvas.height] })
    }

}



export class Test18 extends Sample {

    constructor() {
        super(1024, 1024);
    }

    protected async start(renderer: GPURenderer): Promise<void> {


        console.log(dragonMesh)


        /*
        const plane = new Plane(renderer);
        plane.transform.scaleX = plane.transform.scaleY = plane.transform.scaleZ = 100;
        plane.onDrawEnd = () => {

            plane.transform.rotationX += 0.01;
            plane.transform.rotationY += 0.01;
            plane.transform.rotationZ += 0.01;

        }
        */
        const dragon = new Dragon(renderer);
        dragon.transform.scaleX = dragon.transform.scaleY = dragon.transform.scaleZ = 300;
        dragon.onDrawEnd = () => {

            dragon.transform.rotationX += 0.01;
            dragon.transform.rotationY += 0.01;
            dragon.transform.rotationZ += 0.01;

        }

        //renderer.addPipeline(plane);
        renderer.addPipeline(dragon);
    }

}