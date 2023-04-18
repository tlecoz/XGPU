import { mat4, vec3 } from "gl-matrix";
import { BuiltIns } from "../speechlessGPU/BuiltIns";
import { GPURenderer } from "../speechlessGPU/GPURenderer";
import { RenderPipeline } from "../speechlessGPU/pipelines/RenderPipeline";
import { AlphaBlendMode } from "../speechlessGPU/pipelines/resources/blendmodes/AlphaBlendMode";
import { Float, Matrix4x4, Matrix4x4Array, Vec2, Vec3, Vec4, Vec4Array } from "../speechlessGPU/shader/PrimitiveType";
import { ImageTexture } from "../speechlessGPU/shader/resources/ImageTexture";
import { TextureSampler } from "../speechlessGPU/shader/resources/TextureSampler";
import { UniformBuffer } from "../speechlessGPU/shader/resources/UniformBuffer";
import { VertexBuffer } from "../speechlessGPU/shader/resources/VertexBuffer";
import { VideoTexture } from "../speechlessGPU/shader/resources/VideoTexture";
import { ShaderType } from "../speechlessGPU/shader/ShaderType";
import { Sample } from "./Sample";


class Dimension extends Vec3 {

    constructor(width: number = 1, height: number = 1, depth: number = 1) {
        super(width, height, depth)

        const createVariableInsideMain = true;
        this.initStruct(["width", "height", "depth"], createVariableInsideMain);
    }
}


export class Test05 extends Sample {

    constructor() {
        super();
    }

    protected async start(renderer: GPURenderer) {

        const { bmp, bmp2, video } = this.medias;
        const pipeline = new RenderPipeline(renderer);


        const pos = new Vec3(0, 0, 0.025);
        pos.createVariableInsideMain = true;

        const obj = pipeline.initFromObject({

            clearColor: { r: 0, g: 0, b: 0, a: 1 },
            blendMode: new AlphaBlendMode(),

            bindgroups: {
                myVertexResources: {
                    geom: new VertexBuffer({
                        vertexPos: VertexBuffer.Vec3()
                    }),

                    transform: new UniformBuffer({
                        rotation: new Float(0.10),
                        position: pos,
                        matrix: new Matrix4x4(),
                        dimension: new Dimension(1, 1, 1),//new Vec3(1.0, 1.0, 1.0),
                        projection: new Matrix4x4(mat4.perspective(mat4.create(), (Math.PI * 2) / 4, 1, 0.01, 1000) as Float32Array),
                        test: new Vec4Array([
                            new Vec4(1, 0, 0, 0),
                            new Vec4(2, 0, 0.5, 0)
                        ]),
                        matrixs: new Matrix4x4Array([
                            new Matrix4x4(),
                            new Matrix4x4()
                        ])
                    })
                },

                myFragmentResources: {
                    mySampler: new TextureSampler({ minFilter: "linear", magFilter: "linear" }),
                    myTexture: new ImageTexture({ source: bmp }),
                    myTexture2: new ImageTexture({ source: bmp2 }),
                    myVideo: new VideoTexture({ source: video })
                }
            },

            vertexShader: {
                outputs: {
                    position: BuiltIns.vertexOutputs.position,
                    fragUV: ShaderType.Vec2,
                    fragPosition: ShaderType.Vec4
                },

                main: `
                let p = vertexPos ; 
                
                
                var pos = transform.matrix * vec4(p ,1.0) ;
                
                output.position = vec4(pos.xyz  , 1.0);
                
                output.fragUV = (1.0 + vertexPos.xy)*0.5;
                output.fragPosition = 0.5+ (vec4<f32>(vertexPos, 1.0));
                `
            },

            fragmentShader: {
                outputs: {
                    color: BuiltIns.fragmentOutputs.color
                },

                main: `
                output.color = textureSample(myTexture, mySampler, fragUV);
            
                let video = textureSampleBaseClampToEdge(myVideo, mySampler, fragUV);
                output.color += video;
    
                let mask = textureSample(myTexture2, mySampler, fragUV);
                output.color = vec4(output.color.rgb,mask.a);
    
                output.color *= fragPosition;      
                output.color.a *= 0.5 ;  

                
                `
            }
        });

        obj.bindgroups.myVertexResources.geom.datas = new Float32Array([
            -1, -1, 0.0,
            +1, -1, 0.0,
            -1, +1, 0.0,

            +1, -1, 0.0,
            +1, +1, 0.0,
            -1, +1, 0.0,
        ])


        const uniforms = obj.bindgroups.myVertexResources.transform.items;
        const matrix: Matrix4x4 = uniforms.matrix;
        //console.log("matrix = ", matrix)
        setInterval(() => {
            const model = mat4.create();
            const temp = mat4.create();
            //mat4.translate(model, model, vec3.fromValues(0, 0, -0.3))
            const rotaX = Math.sin((Date.now() / 1000)) * Math.PI * 10;
            const rotaY = Math.sin((Date.now() / 1000)) * Math.PI * 2;
            const rotaZ = Math.sin((Date.now() / 1000)) * Math.PI * 3;
            //matrix.rotationX = Math.sin((Date.now() / 1000)) * Math.PI * 2;
            //matrix.rotationY = Math.sin((Date.now() / 1000)) * Math.PI * 2;
            matrix.rotationZ = Math.sin((Date.now() / 1000)) * Math.PI * 2;
            //matrix.z = Math.sin((Date.now() / 1000)) * 0.5;
            //mat4.rotate(model, temp, rotaX, vec3.fromValues(1, 0, 0));
            //mat4.rotate(model, temp, rotaY, vec3.fromValues(0, 1, 0));
            //mat4.rotate(model, temp, rotaZ, vec3.fromValues(0, 0, 1));

            //mat4.rotate(model, model, rotaZ, vec3.fromValues(rotaX, rotaY, rotaZ));

            //const m = mat4.create();
            //mat4.translate(m, m, vec3.fromValues(0, 0, -0))
            //mat4.multiply(m, model, m);
            //mat4.multiply(m, mat4.perspective(mat4.create(), (Math.PI * 2) / 5, 1, 0.1, 10000), m);

            //matrix.setMatrix(m as Float32Array);
            var t = Math.sin((Date.now() / 1000)) * 500;
            matrix.scaleX = matrix.scaleY = 0.5;//((500 + t) / 1000) * 2


            //uniforms.dimension.data.x = Math.sin(Date.now() / 1000);
        }, 10)

        pipeline.setupDepthStencilView({ size: [renderer.canvas.width, renderer.canvas.height], format: "depth24plus" })
        pipeline.buildGpuPipeline();
        renderer.addPipeline(pipeline);

        pipeline.onDrawEnd = () => {
            //console.log("update")
        }
    }
}