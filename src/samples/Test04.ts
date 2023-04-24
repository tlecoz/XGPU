import { mat4, vec3 } from "gl-matrix";
import { BuiltIns } from "../xGPU/BuiltIns";
import { GPURenderer } from "../xGPU/GPURenderer";
import { RenderPipeline } from "../xGPU/pipelines/RenderPipeline";
import { AlphaBlendMode } from "../xGPU/pipelines/resources/blendmodes/AlphaBlendMode";
import { Float, Matrix4x4, Matrix4x4Array, Vec3, Vec4, Vec4Array } from "../xGPU/shader/PrimitiveType";
import { ImageTexture } from "../xGPU/shader/resources/ImageTexture";
import { TextureSampler } from "../xGPU/shader/resources/TextureSampler";
import { UniformBuffer } from "../xGPU/shader/resources/UniformBuffer";
import { VertexBuffer } from "../xGPU/shader/resources/VertexBuffer";
import { VideoTexture } from "../xGPU/shader/resources/VideoTexture";
import { ShaderType } from "../xGPU/shader/ShaderType";
import { Sample } from "./Sample";

export class Test04 extends Sample {

    constructor() {
        super();
    }

    protected async start(renderer: GPURenderer) {

        const { bmp, bmp2, video } = this.medias;
        const pipeline = new RenderPipeline(renderer);

        const obj = pipeline.initFromObject({

            clearColor: { r: 0, g: 0, b: 0, a: 1 },
            blendMode: new AlphaBlendMode(),

            bindgroups: {
                myVertexResources: {
                    geom: new VertexBuffer({

                        vertexPos: VertexAttribute.Vec3()

                    }),

                    transform: new UniformBuffer({

                        rotation: new Float(0.10),
                        dimension: new Vec3(1.0, 1.0, 1.0),
                        position: new Vec3(0.30, 0.0, 0),
                        matrix: new Matrix4x4(),
                        projection: new Matrix4x4(mat4.perspective(mat4.create(), (Math.PI * 2) / 5, 1, -1, 1) as Float32Array),
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
                let p:vec3<f32> = vec3(vertexPos);
                let a:f32 = atan2(p.y,p.x) + transform.rotation + transform.test[0].x;
                let d:f32 = sqrt(p.x*p.x + p.y*p.y);

                var pos:vec4<f32> = transform.matrix * vec4(p ,1.0) ;
                
                output.position = vec4(pos.xyz , 1.0);
                
                output.fragUV = 0.5 + vertexPos.xy;
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
            mat4.translate(model, model, vec3.fromValues(0, 0, -0.5))
            const rota = Math.sin((Date.now() / 1000)) * Math.PI * 2;
            //matrix.rotationX = Math.sin((Date.now() / 1000)) * Math.PI * 2;
            //matrix.rotationY = Math.sin((Date.now() / 1000)) * Math.PI * 2;
            //matrix.rotationZ = Math.sin((Date.now() / 1000)) * Math.PI * 2;

            mat4.rotate(model, model, rota, vec3.fromValues(1, 0, 0));
            mat4.rotate(model, model, rota, vec3.fromValues(0, 1, 0));
            mat4.rotate(model, model, rota, vec3.fromValues(0, 0, 1));

            const m = mat4.create();
            mat4.translate(m, m, vec3.fromValues(0, 0, 0.1))
            mat4.multiply(m, mat4.perspective(mat4.create(), (Math.PI * 2) / 5, 1, 0.1, 10000), model);

            matrix.setMatrix(m as Float32Array);
            //matrix.z = Math.sin((Date.now() / 1000)) * 500;
            //matrix.scaleX = matrix.scaleY = ((500 + matrix.z) / 1000) * 2


            //uniforms.dimension.data.x = Math.sin(Date.now() / 1000);
        }, 10)

        //pipeline.setupDepthStencilView({ size: [renderer.canvas.width, renderer.canvas.height], format: "depth24plus" })
        pipeline.buildGpuPipeline();
        renderer.addPipeline(pipeline);
    }
}