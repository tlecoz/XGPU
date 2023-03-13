import { BuiltIns } from "../speechlessGPU/Builtins";
import { GPURenderer } from "../speechlessGPU/GPURenderer";
import { ComputePipeline } from "../speechlessGPU/pipelines/ComputePipeline";
import { RenderPipeline } from "../speechlessGPU/pipelines/RenderPipeline";
import { Float } from "../speechlessGPU/shader/PrimitiveType";
import { UniformBuffer } from "../speechlessGPU/shader/resources/UniformBuffer";
import { VertexBuffer } from "../speechlessGPU/shader/resources/VertexBuffer";
import { VertexBufferIO } from "../speechlessGPU/shader/resources/VertexBufferIO";
import { Sample } from "./Sample";

export class Test08 extends Sample {


    constructor() {
        super(1024, 1024);
    }



    protected async start(renderer: GPURenderer) {

        //console.log("START")

        const nbParticle = 10;
        const particleDatas = this.createParticleDatas(nbParticle, renderer.canvas.width, renderer.canvas.height);


        let computePipeline = new ComputePipeline();
        let computeResources = computePipeline.initFromObject({
            bindgroups: {
                io: {
                    particles: new VertexBufferIO({
                        radius: VertexBuffer.Float(),
                        position: VertexBuffer.Vec2(),
                        velocity: VertexBuffer.Vec2(),

                    },
                        { datas: particleDatas }
                    ),
                },
                datas: {
                    uniforms: new UniformBuffer({
                        time: new Float(0, true)
                    })
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
                p.radius = 10.0 + id * 10.0;
                
                var out:Particles = particles_out[index];
                particles_out[index].radius = p.radius;
                particles_out[index].position =  vec2(250 + id * 60.0,512.0);
                particles_out[index].velocity = p.velocity;
               
                `
            }
        })


        let renderPipeline = new RenderPipeline(renderer);
        renderPipeline.setupDraw({
            instanceCount: nbParticle,
            vertexCount: 6
        })

        let quadSize = 0.001;
        renderPipeline.initFromObject({

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
                /*io: {
                    
                    particles: new VertexBuffer({
                        radius: VertexBuffer.Float(),
                        position: VertexBuffer.Vec2(1),
                        velocity: VertexBuffer.Vec2(3)
                    }, { datas: particleDatas, stepMode: "instance" })
                }*/
            },

            vertexShader: {
                inputs: {
                    instanceId: BuiltIns.vertexInputs.instanceIndex
                },
                outputs: {
                    position: BuiltIns.vertexOutputs.position
                },
                main: `
                
                let a = -1.0 + position / 512.0;
                output.position = vec4( vertexPos.xy * radius + a, 0.0 , 1.0);
                
                //output.position = vec4( vertexPos.xy + position , 0.0 , 1.0);
                `
            },

            fragmentShader: {
                outputs: {
                    color: BuiltIns.fragmentOutputs.color
                },
                main: `
                    output.color = vec4(1.0,0.0,0.0,1.0);
                `
            }


        })



        computePipeline.buildGpuPipeline();



        renderPipeline.buildGpuPipeline();

        /*
        computePipeline.onReceiveData = (data: Float32Array) => {
            console.log(data.slice(0, 5))
        }*/
        computePipeline.nextFrame();
        computePipeline.nextFrame();

        //const time = computeResources.bindgroups.datas.uniforms.items.time;
        //console.log("time = ", time)






        let oldTime = new Date().getTime();
        renderPipeline.onDrawEnd = () => {
            //time.x = (new Date().getTime() - oldTime) / 1000000;
            //console.log("nextFrame")
            computePipeline.nextFrame();
        }

        renderer.addPipeline(renderPipeline);


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
            console.log(x, y)
            //datas.push(radius, x, y, speedX, speedY, x, y);
            datas.push(radius, x, y, speedX, speedY);
            //datas.push(x, y, speedX, speedY);
        }
        return new Float32Array(datas);
    }
}