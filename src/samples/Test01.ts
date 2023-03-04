import { BuiltIns } from "../speechlessGPU/Builtins";
import { GPURenderer } from "../speechlessGPU/GPURenderer";
import { RenderPipeline } from "../speechlessGPU/pipelines/RenderPipeline";
import { Bindgroup } from "../speechlessGPU/shader/Bindgroup";
import { Float, Matrix4x4, Matrix4x4Array, Vec3, Vec4, Vec4Array } from "../speechlessGPU/shader/PrimitiveType";
import { ImageTexture } from "../speechlessGPU/shader/resources/ImageTexture";
import { TextureSampler } from "../speechlessGPU/shader/resources/TextureSampler";
import { UniformBuffer } from "../speechlessGPU/shader/resources/UniformBuffer";
import { VertexBuffer } from "../speechlessGPU/shader/resources/VertexBuffer";
import { VideoTexture } from "../speechlessGPU/shader/resources/VideoTexture";
import { Sample } from "./Sample";

export class Test01 extends Sample {

    constructor() {
        super();
    }

    protected async start(renderer: GPURenderer) {

        const { bmp, bmp2, video } = this.medias;
        const pipeline = new RenderPipeline("TestPipeline", renderer);
        const group: Bindgroup = new Bindgroup("common");
        pipeline.bindGroups.add(group);


        group.add("geom", new VertexBuffer({
            attributes: {
                vertexPos: VertexBuffer.Vec3()
            },
            datas: new Float32Array([
                -0.5, -0.5, 0.0,
                +0.5, -0.5, 0.0,
                -0.5, +0.5, 0.0,

                +0.5, -0.5, 0.0,
                +0.5, +0.5, 0.0,
                -0.5, +0.5, 0.0
            ])
        }))


        group.add("transform", new UniformBuffer({
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
        }))

        const group2 = new Bindgroup("media");
        group2.add("mySampler", new TextureSampler({ minFilter: "linear", magFilter: "linear" }));
        group2.add("myTexture", new ImageTexture({ source: bmp }));
        group2.add("myTexture2", new ImageTexture({ source: bmp2 }));
        group2.add("myVideo", new VideoTexture({ source: video }));
        pipeline.bindGroups.add(group2);

        pipeline.vertexShader.outputs = [
            { name: "position", type: "vec4<f32>", ...BuiltIns.vertexOutputs.position },
            { name: "fragUV", type: "vec2<f32>" },
            { name: "fragPosition", type: "vec4<f32>" },
        ]
        pipeline.vertexShader.main.text = `
            let p:vec3<f32> = vec3(vertexPos * transform.dimension);
            let a:f32 = atan2(p.y,p.x) + transform.rotation + transform.test[0].x;
            let d:f32 = sqrt(p.x*p.x + p.y*p.y);

            output.position = transform.matrix * vec4(vec3(cos(a)*d,sin(a)*d,0.0) + transform.position,1.0);
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
            if(mask.a == 0.0){
                output.color = vec4(0.0);
            }

            output.color *= fragPosition;            
        `;


        pipeline.buildGpuPipeline();
        renderer.addPipeline(pipeline);
    }
}