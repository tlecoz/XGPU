import { BuiltIns } from "../speechlessGPU/Builtins";
import { GPURenderer } from "../speechlessGPU/GPURenderer";
import { ComputePipeline } from "../speechlessGPU/pipelines/ComputePipeline";
import { MixedPipeline } from "../speechlessGPU/pipelines/MixedPipeline";
import { RenderPipeline } from "../speechlessGPU/pipelines/RenderPipeline";
import { Float, Matrix4x4, Vec2 } from "../speechlessGPU/shader/PrimitiveType";
import { ImageTexture } from "../speechlessGPU/shader/resources/ImageTexture";
import { TextureSampler } from "../speechlessGPU/shader/resources/TextureSampler";
import { UniformBuffer } from "../speechlessGPU/shader/resources/UniformBuffer";
import { ProjectionMatrix } from "../speechlessGPU/shader/resources/uniforms/ProjectionMatrix";
import { VertexBuffer } from "../speechlessGPU/shader/resources/VertexBuffer";
import { VertexBufferIO } from "../speechlessGPU/shader/resources/VertexBufferIO";
import { ShaderType } from "../speechlessGPU/shader/ShaderType";
import { Sample } from "./Sample";

export class Test09 extends Sample {


    constructor() {
        super(1024, 1024);
    }



    protected async start(renderer: GPURenderer) {

        //console.log("START")
        const { bmp, bmp2, video } = this.medias;

        const mediaW = bmp.width;
        const mediaH = bmp.height;

        console.log("media = ", mediaW, mediaH)

        const nbParticle = renderer.canvas.width * renderer.canvas.height;
        console.log("nbParticle = ", nbParticle)

        let mixedPipeline = new MixedPipeline(renderer);
        mixedPipeline.setupDraw({ instanceCount: nbParticle, vertexCount: 6 })
        mixedPipeline.setupDepthStencilView({ size: [1024, 1024, 1] })




        let computePipeline = mixedPipeline.computePipeline; //new ComputePipeline();
        let computeResources = computePipeline.initFromObject({
            bindgroups: {
                io: {
                    particles: new VertexBufferIO({

                        //ra: VertexBuffer.Float(),
                        //ra7: VertexBuffer.Float(),
                        //radius: VertexBuffer.Vec2(),
                        //r2: VertexBuffer.Vec2(),


                        position: VertexBuffer.Vec3(),
                        r5: VertexBuffer.Float(),
                        //radius2: VertexBuffer.Vec2()

                    },
                        { datas: new Float32Array(nbParticle * 4) }
                    ),
                },
                datas: {
                    uniforms: new UniformBuffer({
                        mediaSize: new Vec2(mediaW, mediaH, true),
                        screen: new Vec2(renderer.canvas.width, renderer.canvas.height, true)
                    }),
                    mySampler: new TextureSampler({ minFilter: "linear", magFilter: "linear" }),
                    myTexture: new ImageTexture({ source: bmp }),
                }
            }, computeShader: {
                inputs: {
                    global_id: BuiltIns.computeInputs.globalInvocationId
                },
                main: `
                /*
                let nbParticle = arrayLength(&particles);
               
                if(index >= nbParticle){
                    return;
                }*/
                let index = global_id.x;

                

                var p = particles[index];
                var id = f32(index);

                
               
                var idx = (id % screen.x);
                var idy = floor(id / screen.x);

                

                let px = -0.5+(idx / screen.x) ;
                let py = -0.5+(idy / screen.y) ;

                var col = textureSampleLevel(myTexture,mySampler,vec2( (0.5 + px) , (0.5+ py)),0.0);



                let pz = distance(col.rgb,vec3(0.5)) ;

                
                var out:Particles = particles_out[index];
                
                particles_out[index].position =  vec3(px,py,pz);
               
               
                `
            }
        })

        computePipeline.buildGpuPipeline();
        computePipeline.nextFrame();



        let modelMatrix = new Matrix4x4();
        //modelMatrix.z = -0.73

        let viewMatrix = new Matrix4x4();
        viewMatrix.z = 0.;

        let quadSize = 1 / 1024;
        mixedPipeline.initFromObject({

            bindgroups: {
                vertexResources: {
                    geom: new VertexBuffer({
                        vertexPos: VertexBuffer.Vec3(0)
                    }, {
                        datas: new Float32Array([
                            -quadSize, -quadSize, 0.0,
                            +quadSize, -quadSize, 0.0,
                            -quadSize, +quadSize, 0.0,

                            +quadSize, -quadSize, 0.0,
                            +quadSize, +quadSize, 0.0,
                            -quadSize, +quadSize, 0.0,
                        ])
                    }),
                    uniforms: new UniformBuffer({
                        model: modelMatrix,
                        view: viewMatrix,
                        projection: new ProjectionMatrix(renderer.canvas.width, renderer.canvas.height, 45),


                    })
                },
                io: computeResources.bindgroups.io,

            },

            vertexShader: {
                inputs: {
                    instanceId: BuiltIns.vertexInputs.instanceIndex
                },
                outputs: {
                    position: BuiltIns.vertexOutputs.position,
                    color: ShaderType.Vec4
                },
                main: `
                
                

                output.position = uniforms.projection *  uniforms.view * uniforms.model * vec4( (vertexPos.xy + position.xy)*1024.0 ,position.z*100.0, 1.0);
                output.color = vec4(vec3(position.z),1.0);
                `
            },

            fragmentShader: {
                outputs: {
                    color: BuiltIns.fragmentOutputs.color
                },
                main: `
                    output.color = color;//vec4(1.0,0.0,0.0,1.0);
                `
            }


        })


        mixedPipeline.buildPipelines()



        const time = computeResources.bindgroups.datas.uniforms.items.time;

        //console.log("time = ", time)






        let oldTime = new Date().getTime();
        mixedPipeline.onDrawEnd = () => {
            modelMatrix.rotationY += 0.01;
            modelMatrix.rotationX += 0.01;
            modelMatrix.rotationZ += 0.01;

            viewMatrix.z = 1000

            //renderPipeline.onDrawEnd = () => {

            //console.log("nextFrame")
            computePipeline.nextFrame();
        }

        renderer.addPipeline(mixedPipeline);


    }




}