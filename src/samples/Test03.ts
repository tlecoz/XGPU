import { BuiltIns } from "../speechlessGPU/Builtins";
import { GPURenderer } from "../speechlessGPU/GPURenderer";
import { RenderPipeline } from "../speechlessGPU/pipelines/RenderPipeline";
import { AlphaBlendMode } from "../speechlessGPU/pipelines/resources/blendmodes/AlphaBlendMode";
import { Bindgroup } from "../speechlessGPU/shader/Bindgroup";
import { Float, Matrix4x4, Matrix4x4Array, Vec3, Vec4, Vec4Array } from "../speechlessGPU/shader/PrimitiveType";
import { ImageTexture } from "../speechlessGPU/shader/resources/ImageTexture";
import { TextureSampler } from "../speechlessGPU/shader/resources/TextureSampler";
import { UniformBuffer } from "../speechlessGPU/shader/resources/UniformBuffer";
import { VertexBuffer } from "../speechlessGPU/shader/resources/VertexBuffer";
import { VideoTexture } from "../speechlessGPU/shader/resources/VideoTexture";
import { ShaderType } from "../speechlessGPU/shader/ShaderType";
import { Sample } from "./Sample";

export class Test02 extends Sample {

    constructor() {
        super();
    }

    protected async start(renderer: GPURenderer) {

        const { bmp, bmp2, video } = this.medias;
        const pipeline = new RenderPipeline("TestPipeline", renderer);

        const obj = pipeline.initFromObject({

            clearColor: { r: 0, g: 0, b: 0, a: 1 },
            blendMode: new AlphaBlendMode(),

            bindgroups: {
                myVertexResources: {
                    geom: new VertexBuffer({
                        attributes: {
                            vertexPos: VertexBuffer.Vec3()
                        },
                    }),

                    transform: new UniformBuffer({
                        items: {
                            rotation: new Float(0.10),
                            dimension: new Vec3(1.0, 1.0, 0),
                            position: new Vec3(0.30, 0.0, 0),
                            matrix: new Matrix4x4(),
                            test: new Vec4Array([
                                new Vec4(1, 0, 0, 0),
                                new Vec4(2, 0, 0.5, 0)
                            ]),
                            matrixs: new Matrix4x4Array([
                                new Matrix4x4(),
                                new Matrix4x4()
                            ])
                        }
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
                let p:vec3<f32> = vec3(vertexPos * transform.dimension);
                let a:f32 = atan2(p.y,p.x) + transform.rotation + transform.test[0].x;
                let d:f32 = sqrt(p.x*p.x + p.y*p.y);

                output.position = transform.matrix * vec4(vec3(cos(a)*d,sin(a)*d,0.0) + transform.position,1.0);
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
                output.color /= video;
    
                let mask = textureSample(myTexture2, mySampler, fragUV);
                output.color = vec4(output.color.rgb,mask.a);
    
                output.color *= fragPosition;      
                output.color.a *= 0.5 ;  
                `
            }
        });

        obj.bindgroups.myVertexResources.geom.datas = new Float32Array([
            -0.5, -0.5, 0.0,
            +0.5, -0.5, 0.0,
            -0.5, +0.5, 0.0,

            +0.5, -0.5, 0.0,
            +0.5, +0.5, 0.0,
            -0.5, +0.5, 0.0
        ])

        setInterval(() => {
            obj.bindgroups.myVertexResources.transform.items.dimension.data.x = Math.sin(Date.now() / 1000);
        }, 10)

        pipeline.buildGpuPipeline();
        renderer.addPipeline(pipeline);
    }
}