import { GPURenderer } from "../speechlessGPU/GPURenderer";
import { HeadlessGPURenderer } from "../speechlessGPU/HeadlessGPURenderer";
import { RenderPipeline } from "../speechlessGPU/pipelines/RenderPipeline";
import { Sample } from "./Sample";

import { cubeVertexArray, cubeVertexSize, cubeUVOffset, cubePositionOffset } from "../../assets/CubeMesh";
import { VertexBuffer } from "../speechlessGPU/shader/resources/VertexBuffer";
import { ShaderType } from "../speechlessGPU/shader/ShaderType";
import { BuiltIns } from "../speechlessGPU/BuiltIns";
import { UniformBuffer } from "../speechlessGPU/shader/resources/UniformBuffer";
import { ProjectionMatrix } from "../speechlessGPU/shader/resources/uniforms/ProjectionMatrix";
import { Matrix4x4, ModelViewMatrix } from "../speechlessGPU/shader/PrimitiveType";
import { AlphaBlendMode } from "../speechlessGPU/pipelines/resources/blendmodes/AlphaBlendMode";


export class RotatingCube extends RenderPipeline {

    //protected model: Matrix4x4;
    //protected view: Matrix4x4;
    protected modelView: ModelViewMatrix;

    protected createResources(o: { renderer: GPURenderer | HeadlessGPURenderer, options?: any }): any {

        const { renderer } = o;

        const nbComponentTotal = cubeVertexSize / 4
        const positionOffset = cubePositionOffset / 4;
        const uvOffset = cubeUVOffset / 4;

        const resource = {
            //clearColor: { r: 0, g: 0, b: 0, a: 0 },
            //blendMode: new AlphaBlendMode(),
            bindgroups: {
                geom: {
                    vb: new VertexBuffer({
                        position: VertexBuffer.Vec4(positionOffset),
                        uv: VertexBuffer.Vec2(uvOffset)
                    }),
                    uniforms: new UniformBuffer({
                        modelView: new ModelViewMatrix(),
                        //model: new Matrix4x4(),
                        //view: new Matrix4x4(),
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
                output.position = uniforms.projection *  uniforms.modelView * position;
                //output.position = uniforms.projection *  uniforms.view * uniforms.model * position;
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

        this.modelView = resource.bindgroups.geom.uniforms.items.modelView;
        //this.model = resource.bindgroups.geom.uniforms.items.model;
        //this.view = resource.bindgroups.geom.uniforms.items.view;


        resource.bindgroups.geom.vb.setComplexDatas(cubeVertexArray, nbComponentTotal)


        return resource;
    }



    constructor(renderer: GPURenderer | HeadlessGPURenderer, options?: any) {
        super(renderer);




        var resources = this.createResources({ renderer, options })


        this.initFromObject(resources)

        this.setupDepthStencilView({ size: [renderer.canvas.width, renderer.canvas.height], format: "depth24plus" });




        this.scaleX = this.scaleY = this.scaleZ = 200.0;

        this.onDrawEnd = () => {


            this.rotationX += 0.01;
            this.rotationY += 0.01;
            this.rotationZ += 0.01;

            //this.z = Math.sin(this.rotationX) * 500;
        }


    }


    public get x(): number { return this.modelView.x; }
    public set x(n: number) { this.modelView.x = n }

    public get y(): number { return this.modelView.y; }
    public set y(n: number) { this.modelView.y = n }

    public get z(): number { return this.modelView.z; }
    public set z(n: number) { this.modelView.z = n }


    public get rotationX(): number { return this.modelView.rotationX; }
    public set rotationX(n: number) { this.modelView.rotationX = n }

    public get rotationY(): number { return this.modelView.rotationY; }
    public set rotationY(n: number) { this.modelView.rotationY = n }

    public get rotationZ(): number { return this.modelView.rotationZ; }
    public set rotationZ(n: number) { this.modelView.rotationZ = n }


    public get scaleX(): number { return this.modelView.scaleX; }
    public set scaleX(n: number) { this.modelView.scaleX = n }

    public get scaleY(): number { return this.modelView.scaleY; }
    public set scaleY(n: number) { this.modelView.scaleY = n }

    public get scaleZ(): number { return this.modelView.scaleZ; }
    public set scaleZ(n: number) { this.modelView.scaleZ = n }



}








export class Test13 extends Sample {


    constructor() {
        super(1024, 1024);
    }

    protected async start(renderer: GPURenderer) {

        var cube = new RotatingCube(renderer);
        cube.scaleX = cube.scaleY = cube.scaleZ = 200;
        renderer.addPipeline(cube);

    }


}