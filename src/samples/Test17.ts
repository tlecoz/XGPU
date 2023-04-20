import { GPURenderer } from "../speechlessGPU/GPURenderer";
import { HeadlessGPURenderer } from "../speechlessGPU/HeadlessGPURenderer";
import { RenderPipeline } from "../speechlessGPU/pipelines/RenderPipeline";
import { Float, ModelViewMatrix, Vec3, Vec4 } from "../speechlessGPU/shader/PrimitiveType";
import { Sample } from "./Sample";

import { cubeVertexArray, cubeVertexSize, cubeUVOffset, cubePositionOffset } from "../../assets/CubeMesh";
import { VertexBuffer } from "../speechlessGPU/shader/resources/VertexBuffer";
import { UniformBuffer } from "../speechlessGPU/shader/resources/UniformBuffer";
import { BuiltIns } from "../speechlessGPU/BuiltIns";
import { ShaderType } from "../speechlessGPU/shader/ShaderType";
import { ProjectionMatrix } from "../speechlessGPU/shader/resources/uniforms/ProjectionMatrix";
import { AlphaBlendMode } from "../speechlessGPU/pipelines/resources/blendmodes/AlphaBlendMode";



export class CubeGrid extends RenderPipeline {

    //protected model: Matrix4x4;
    //protected view: Matrix4x4;
    protected modelView: ModelViewMatrix;
    protected time: Float;

    protected createResources(o: { renderer: GPURenderer | HeadlessGPURenderer, gridX: number, gridY: number, gridZ: number, options?: any }): any {

        const { renderer, gridX, gridY, gridZ } = o;

        const nbComponentTotal = cubeVertexSize / 4
        const positionOffset = cubePositionOffset / 4;
        const uvOffset = cubeUVOffset / 4;




        const resource = {

            //blendMode: new AlphaBlendMode(),
            bindgroups: {
                geom: {
                    vb: new VertexBuffer({
                        position: VertexAttribute.Vec4(positionOffset),
                        uv: VertexAttribute.Vec2(uvOffset)
                    }),
                    uniforms: new UniformBuffer({
                        time: new Float(0, true),
                        grid: new Vec4(gridX, gridY, gridZ, 40, true),
                        modelView: new ModelViewMatrix(),
                        projection: new ProjectionMatrix(renderer.canvas.width, renderer.canvas.height, 45, 0.1, Infinity),
                    })
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
                code: `
                

                fn rotationX( angle:f32 )->mat4x4<f32> {
                    return mat4x4<f32>(	
                                     vec4(1.0,		0,			0,			0),
                                     vec4(0 , 	cos(angle),	-sin(angle),	0),
                                     vec4(0 , 	sin(angle),	 cos(angle),	0),
                                     vec4(0 , 			0,			  0, 	1)
                                     );
                }
                
                
                fn rotationY( angle:f32 )->mat4x4<f32> {
                    return mat4x4<f32>(
                        	vec4( cos(angle),   0   ,	sin(angle) ,	0),
                            vec4(   0       ,	1.0 ,   	 0     ,	0),
                            vec4(-sin(angle),	0   ,	cos(angle) ,	0),
                            vec4(   0       , 	0   ,	 	 0     ,	1)
                        );
                }
                
                fn rotationZ( angle:f32 )->mat4x4<f32> {
                    return mat4x4<f32>(
                        	vec4(cos(angle) , -sin(angle) ,	0  ,  0 ),
                            vec4(sin(angle) , cos(angle)  ,	0  ,  0 ),
                            vec4(    0      ,     0       ,	1  ,  0 ),
                            vec4(    0      ,	  0       ,	0  ,  1)
                        );
                }

                `,
                main: `
                let id = f32(instanceId);
                let idx = id % grid.x;
                let idy = floor(id / grid.x) % grid.y;
                let idz = floor(id / (grid.x * grid.y));

                let size = 400.0;
                let offset = vec3(size / grid.x , size / grid.y , size / grid.z) * 0.05;
                var px = (-0.5 + idx / grid.x) * size;// + cos(time + id) * 1.0/grid.x * 100.0;
                var py = (-0.5 + idy / grid.y) * size;// + sin(time + id) * 1.0/grid.y * 100.0;
                var pz = (-0.5 + idz / grid.z) * size;// + sin(time + id) * 1.0/grid.z * 100.0;

                
                var pos = vec4(offset,0.0) /* +   rotationX(id + time) rotationY(id + time) * rotationZ(id + time)*/  * vec4((position.xyz / grid.xyz) * 30.0 , 1.0) ;
                
                
                pos.x += px;
                pos.y += py;
                pos.z += pz;



                output.position = uniforms.projection * uniforms.modelView *  vec4(pos.xyz,position.w);

                
                //output.position = uniforms.projection *  uniforms.view * uniforms.model * position;
                output.fragUV = uv;
                output.fragPosition = (position + vec4<f32>(1.0, 1.0, 1.0, 1.0));
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
        this.time = resource.bindgroups.geom.uniforms.items.time;
        resource.bindgroups.geom.vb.setComplexDatas(cubeVertexArray, nbComponentTotal)


        return resource;
    }



    constructor(renderer: GPURenderer | HeadlessGPURenderer, gridX: number = 1, gridY: number = 1, gridZ: number = 1, options?: any) {
        super(renderer);

        var resources = this.createResources({ renderer, gridX, gridY, gridZ, options })

        this.initFromObject(resources)
        this.description.primitive.cullMode = "back";
        //this.description.primitive.topology = "triangle-list";
        this.setupDraw({ instanceCount: gridX * gridY * gridZ })
        this.setupDepthStencilView({ size: [renderer.canvas.width, renderer.canvas.height], format: "depth24plus" });

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


    public set currentTime(f: number) { this.time.x = f; }

}








export class Test17 extends Sample {

    constructor() {
        super(1024, 1024);
    }

    protected async start(renderer: GPURenderer): Promise<void> {

        const cube = new CubeGrid(renderer, 100, 100, 100);
        renderer.addPipeline(cube);

        const now = new Date().getTime();
        cube.onDrawEnd = () => {
            const time = (new Date().getTime() - now) * 0.01;
            cube.currentTime = time;
            cube.scaleX = cube.scaleY = cube.scaleZ = Math.sin(time * 0.001) * 100;
            cube.rotationX += 0.003;
            cube.rotationY += 0.003;
            cube.rotationZ += 0.003;
        }
    }

}