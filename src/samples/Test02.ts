import { mat4 } from "gl-matrix";
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
import { Sample } from "./Sample";

export class Test02 extends Sample {

    constructor() {
        super();
    }

    protected async start(renderer: GPURenderer) {

        const { bmp, bmp2, video } = this.medias;
        const pipeline = new RenderPipeline("TestPipeline", renderer);
        pipeline.blendMode = new AlphaBlendMode();

        const group: Bindgroup = new Bindgroup("common");
        pipeline.bindGroups.add(group);


        const obj = {
            geom: new VertexBuffer({
                attributes: {
                    vertexPos: VertexBuffer.Vec3()
                }
            }),

            transform: new UniformBuffer({
                items: {
                    rotation: new Float(0.10),
                    dimension: new Vec3(1.0, 1.0, 0),
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
                }
            })
        }

        group.initFromObject(obj);

        const buffer = group.get("geom") as VertexBuffer;

        const datas = new Float32Array([
            -0.5, -0.5, 0.0,
            +0.5, -0.5, 0.0,
            -0.5, +0.5, 0.0,

            +0.5, -0.5, 0.0,
            +0.5, +0.5, 0.0,
            -0.5, +0.5, 0.0
        ]);
        buffer.datas = datas;
        /*
       setInterval(() => {
           const scale = Math.random();
           const t = [];
           for (let i = 0; i < datas.length; i++) t[i] = datas[i] * scale;

           buffer.datas = new Float32Array(t);
       }, 100)
       */

        const transform = group.get("transform") as UniformBuffer;
        setInterval(() => {
            transform.items.rotation.x += 0.01;
            //console.log(transform.items.rotation)
        }, 1)

        //




        const group2 = new Bindgroup("media");

        group2.initFromObject({
            mySampler: new TextureSampler({ minFilter: "linear", magFilter: "linear" }),
            myTexture: new ImageTexture({ source: bmp }),
            myTexture2: new ImageTexture({ source: bmp2 }),
            myVideo: new VideoTexture({ source: video })
        })


        pipeline.bindGroups.add(group2);

        pipeline.vertexShader.outputs = [
            { name: "position", type: "vec4<f32>", ...BuiltIns.vertexOutputs.position },
            { name: "fragUV", type: "vec2<f32>" },
            { name: "fragPosition", type: "vec4<f32>" },
        ]
        pipeline.vertexShader.main.text = `
            let p:vec3<f32> = vec3(vertexPos);
            let a:f32 = atan2(p.y,p.x) + transform.rotation + transform.test[0].x;
            let d:f32 = sqrt(p.x*p.x + p.y*p.y);

            var pos:vec4<f32> = transform.matrix * vec4(p ,1.0) ;
            
            output.position = vec4(pos.xyz , 1.0);
            
            output.fragUV = 0.5 + vertexPos.xy;
            output.fragPosition = 0.5+ (vec4<f32>(vertexPos, 1.0));
        `;

        pipeline.fragmentShader.outputs = [
            { name: "color", type: "vec4<f32>", ...BuiltIns.fragmentOutputs.color }
        ]
        pipeline.fragmentShader.main.text = `
            output.color = textureSample(myTexture, mySampler, fragUV);
            
            let video = textureSampleBaseClampToEdge(myVideo, mySampler, fragUV);
            output.color /= video;

            let mask = textureSample(myTexture2, mySampler, fragUV);
            output.color = vec4(output.color.rgb,mask.a);

            output.color *= fragPosition;      
            output.color.a *= 0.5 ;  
        `;


        pipeline.buildGpuPipeline();
        renderer.addPipeline(pipeline);
    }
}