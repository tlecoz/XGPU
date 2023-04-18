import { BuiltIns } from "../speechlessGPU/BuiltIns";
import { GPURenderer } from "../speechlessGPU/GPURenderer";
import { ComputePipeline } from "../speechlessGPU/pipelines/ComputePipeline";
import { MixedPipeline } from "../speechlessGPU/pipelines/MixedPipeline";
import { RenderPipeline } from "../speechlessGPU/pipelines/RenderPipeline";
import { Float, Vec2 } from "../speechlessGPU/shader/PrimitiveType";
import { ImageTexture } from "../speechlessGPU/shader/resources/ImageTexture";
import { TextureSampler } from "../speechlessGPU/shader/resources/TextureSampler";
import { UniformBuffer } from "../speechlessGPU/shader/resources/UniformBuffer";
import { VertexBuffer } from "../speechlessGPU/shader/resources/VertexBuffer";
import { VertexBufferIO } from "../speechlessGPU/shader/resources/VertexBufferIO";
import { ShaderType } from "../speechlessGPU/shader/ShaderType";
import { Sample } from "./Sample";

export class Test08 extends Sample {


    constructor() {
        super(1024, 1024);
    }



    protected async start(renderer: GPURenderer) {

        //console.log("START")
        const { bmp, bmp2, video } = this.medias;
        const size = 200;
        const nbParticle = size * size;
        const particleDatas = this.createParticleDatas(nbParticle, renderer.canvas.width, renderer.canvas.height);

        let mixedPipeline = new MixedPipeline(renderer);
        mixedPipeline.setupDraw({ instanceCount: nbParticle, vertexCount: 6 })

        let computePipeline = mixedPipeline.computePipeline; //new ComputePipeline();
        let computeResources = computePipeline.initFromObject({
            bindgroups: {
                io: {
                    particles: new VertexBufferIO({
                        radius: VertexBuffer.Float(),
                        position: VertexBuffer.Vec2(),
                        velocity: VertexBuffer.Vec2(),
                        color: VertexBuffer.Vec4(),

                    },
                        { datas: particleDatas }
                    ),
                },
                datas: {
                    uniforms: new UniformBuffer({
                        time: new Float(0, true),
                        gridSize: new Float(size, true),
                        time2: new Float(0, true),
                        test: new Vec2(size, size, true),
                        test2: new Vec2(size, size, true),
                    }),
                    mySampler: new TextureSampler({ minFilter: "linear", magFilter: "linear" }),
                    myTexture: new ImageTexture({ source: bmp }),
                }
            }, computeShader: {
                inputs: {
                    global_id: BuiltIns.computeInputs.globalInvocationId
                },
                main: `
                let nbParticle = arrayLength(&particles);
                let index = global_id.x;
                if(index >= nbParticle){
                    return;
                }


                

                var p = particles[index];
                var id = f32(index);

                
                let marge = 1.0;
                p.radius = 2.0;// 40.0 ;

                var idx = (id % test2.x);
                var idy = floor(id / test2.y);

                var col = textureSampleLevel(myTexture,mySampler,vec2( (0.5 + idx) / gridSize  , (0.5 + idy) / gridSize  ),0.0);

                let px =  0.5 + idx * (p.radius + marge*2.0);
                let py =  0.5 + idy * (p.radius + marge*2.0);

                
                var out:Particles = particles_out[index];
                particles_out[index].radius = p.radius ;
                particles_out[index].position =  vec2(px,py); //vec2(250 + id * 60.0 + sin(time) * 100.0 ,512.0);
                particles_out[index].velocity = p.velocity;
                particles_out[index].color = col;
               
                `
            }
        })



        let quadSize = 0.001;
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
                
                let a = -1.0 + position / 512.0;
                output.position = vec4( vertexPos.xy * radius + a, 0.0 , 1.0);
                output.color = color;
                //output.position = vec4( vertexPos.xy + position , 0.0 , 1.0);
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

        /*
        computePipeline.onReceiveData = (data: Float32Array) => {
            console.log(data.slice(0, 6))
        }
        */

        const time = computeResources.bindgroups.datas.uniforms.items.time;

        //console.log("time = ", time)






        let oldTime = new Date().getTime();
        mixedPipeline.onDrawEnd = () => {
            //renderPipeline.onDrawEnd = () => {

            time.x = (new Date().getTime() - oldTime) / 1000;
            //console.log("nextFrame")
            computePipeline.nextFrame();
        }

        renderer.addPipeline(mixedPipeline);


    }




    private createParticleDatas(nb: number, w, h) {
        const pi2 = Math.PI * 2;
        let radius: number, x: number, y: number, a: number, speedX: number, speedY: number;
        const datas: number[] = [];
        for (let i = 0; i < nb; i++) {
            radius = 40;
            x = 250//(0.5 + i % 10) * (w / 10);//Math.random() * w;
            y = h / 2 + 50 * i;// + ((i / 10) >> 0) * (h / 10)//Math.random() * h;
            a = Math.random() * pi2;
            speedX = Math.cos(a);
            speedY = Math.sin(a);

            //datas.push(radius, x, y, speedX, speedY, x, y);
            datas.push(radius, x, y, speedX, speedY, 0, 0, 0, 1);
            //datas.push(x, y, speedX, speedY);
        }
        return new Float32Array(datas);
    }
}