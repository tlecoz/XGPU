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

    protected model: Matrix4x4;
    protected view: Matrix4x4;

    protected createResources(o: { renderer: GPURenderer | HeadlessGPURenderer, options?: any }): any {

        const { renderer } = o;

        const nbComponentTotal = cubeVertexSize / 4
        const positionOffset = cubePositionOffset / 4;
        const uvOffset = cubeUVOffset / 4;

        const resource = {
            bindgroups: {
                geom: {
                    vb: new VertexBuffer({
                        position: VertexBuffer.Vec4(positionOffset),
                        uv: VertexBuffer.Vec2(uvOffset)
                    }),
                    uniforms: new UniformBuffer({
                        model: new Matrix4x4(),
                        view: new Matrix4x4(),
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
        }

        this.model = resource.bindgroups.geom.uniforms.items.model;
        this.view = resource.bindgroups.geom.uniforms.items.view;


        resource.bindgroups.geom.vb.setComplexDatas(cubeVertexArray, nbComponentTotal)


        return resource;
    }



    constructor(renderer: GPURenderer | HeadlessGPURenderer, options?: any) {
        super(renderer);




        var resources = this.createResources({ renderer, options })


        this.initFromObject(resources)

        this.setupDepthStencilView({ size: [renderer.canvas.width, renderer.canvas.height], format: "depth24plus" });






        this.onDrawEnd = () => {

            this.scaleX = this.scaleY = this.scaleZ = 200.0;
            this.rotationX += 0.01;
            this.rotationY += 0.01;
            this.rotationZ += 0.01;

            this.z = Math.sin(this.rotationX) * 500;
        }


    }


    public get x(): number { return this.view.x; }
    public set x(n: number) { this.view.x = n }

    public get y(): number { return this.view.y; }
    public set y(n: number) { this.view.y = n }

    public get z(): number { return this.view.z; }
    public set z(n: number) { this.view.z = n }


    public get rotationX(): number { return this.model.rotationX; }
    public set rotationX(n: number) { this.model.rotationX = n }

    public get rotationY(): number { return this.model.rotationY; }
    public set rotationY(n: number) { this.model.rotationY = n }

    public get rotationZ(): number { return this.model.rotationZ; }
    public set rotationZ(n: number) { this.model.rotationZ = n }


    public get scaleX(): number { return this.model.scaleX; }
    public set scaleX(n: number) { this.model.scaleX = n }

    public get scaleY(): number { return this.model.scaleY; }
    public set scaleY(n: number) { this.model.scaleY = n }

    public get scaleZ(): number { return this.model.scaleZ; }
    public set scaleZ(n: number) { this.model.scaleZ = n }



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