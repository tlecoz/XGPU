import { BuiltIns } from "../speechlessGPU/Builtins";
import { GPURenderer } from "../speechlessGPU/GPURenderer";
import { ComputePipeline } from "../speechlessGPU/pipelines/ComputePipeline";
import { RenderPipeline } from "../speechlessGPU/pipelines/RenderPipeline";
import { Float } from "../speechlessGPU/shader/PrimitiveType";
import { UniformBuffer } from "../speechlessGPU/shader/resources/UniformBuffer";
import { VertexBuffer } from "../speechlessGPU/shader/resources/VertexBuffer";
import { VertexBufferIO } from "../speechlessGPU/shader/resources/VertexBufferIO";
import { Sample } from "./Sample";

export class Test07 extends Sample {


    constructor() {
        super();
    }



    protected async start(renderer: GPURenderer) {

        console.log("START")

        const nbParticle = 4190000;
        const particleDatas = this.createParticleDatas(nbParticle, renderer.canvas.width, renderer.canvas.height);

        let computePipeline = new ComputePipeline();
        let computeResources = computePipeline.initFromObject({
            bindgroups: {
                io: {
                    particles: new VertexBufferIO({
                        //radius: VertexBuffer.Float(),
                        position: VertexBuffer.Vec2(),
                        velocity: VertexBuffer.Vec2()
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
                
                var p:Particles = particles[index];
                var center = vec2(256.0,256.0);
                
                var cx = 256.0;
                var cy = 256.0;
                var dx = p.position.x - cx+ p.velocity.x;
                var dy = p.position.y - cy+ p.velocity.y;
                var d = distance(p.position,center);
                var a = atan2(dy ,dx) ;
                
                var end = vec2(cx + cos(a)*d,cy + sin(a)*d);
                p.position +=   sin( end*cos(a) ) ;  //( vec2(cx + cos(a) * d, cy + sin(a) * d)) ) ;
                
                var id = f32(index) ;
                var py = floor(id / 50.0); 
                p.position = vec2( id % 50.0 *10.0   , py * 10.0 );
                
                p.position.x = cx + cos( a + uniforms.time) * d ;  //sin( p.velocity.x * uniforms.time) * (100.0 + cos(uniforms.time)*100.0);
                p.position.y = cy + sin(a + uniforms.time) * d ;
                
                var out:Particles = particles_out[index];
                //particles_out[index].radius = 4.0;
                particles_out[index].position =  p.position;
                particles_out[index].velocity = vec2(cos(a + sin(d)) *2.15);
                `
            }
        })


        let renderPipeline = new RenderPipeline(renderer);
        renderPipeline.setupDraw({
            instanceCount: nbParticle,
            vertexCount: 6
        })

        let quadSize = 0.0005;
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
                io: computeResources.bindgroups.io
            },

            vertexShader: {
                inputs: {
                    instanceId: BuiltIns.vertexInputs.instanceIndex
                },
                outputs: {
                    position: BuiltIns.vertexOutputs.position
                },
                main: `
                
                let a = -1.0 + position / 256.0;
                output.position = vec4( vertexPos.xy + a, 0.0 , 1.0);
                
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
        //computePipeline.nextFrame();
        /*computePipeline.onReceiveData = (data: Float32Array) => {
            //console.log(data.slice(600, 606))
        }*/


        const time = computeResources.bindgroups.datas.uniforms.items.time;
        console.log("time = ", time)

        let oldTime = new Date().getTime();
        renderPipeline.onDrawEnd = () => {
            time.x = (new Date().getTime() - oldTime) / 1000000;
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
            radius = 1 + Math.random() * 2;
            x = Math.random() * w;
            y = Math.random() * h;
            a = Math.random() * pi2;
            speedX = Math.cos(a);
            speedY = Math.sin(a);
            //datas.push(radius, x, y, speedX, speedY);
            datas.push(x, y, speedX, speedY);
        }
        return new Float32Array(datas);
    }
}