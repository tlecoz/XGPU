
import { BuiltIns } from "../speechlessGPU/Builtins";
import { GPU } from "../speechlessGPU/GPU";
import { GPURenderer } from "../speechlessGPU/GPURenderer";
import { ComputePipeline } from "../speechlessGPU/pipelines/ComputePipeline";
import { Float } from "../speechlessGPU/shader/PrimitiveType";
import { UniformBuffer } from "../speechlessGPU/shader/resources/UniformBuffer";
import { VertexBuffer } from "../speechlessGPU/shader/resources/VertexBuffer";
import { VertexBufferIO } from "../speechlessGPU/shader/resources/VertexBufferIO";
import { Sample } from "./Sample";




export class Test06 {

    constructor() {


        GPU.init().then(() => {



            const size = 512;
            const ctx = this.setupCanvas2D(size, size);
            const nbParticle = 5000;
            const particleDatas = this.createParticleDatas(nbParticle, size, size);

            const pipeline = new ComputePipeline();
            const obj = pipeline.initFromObject({
                bindgroups: {
                    myComputeResources: {
                        particles: new VertexBufferIO({
                            radius: VertexBuffer.Float(),
                            position: VertexBuffer.Vec2(),
                            velocity: VertexBuffer.Vec2()
                        }, { datas: particleDatas }),

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
                        var dx = p.position.x - cx + p.velocity.x;
                        var dy = p.position.y - cy + p.velocity.y;
                        var d = distance(p.position,center);
                        var a = atan2(dy ,dx) ;
                        
                        
                        //var id = f32(index) ;
                        p.position.x = (cx + cos( a + time % sin(dx + time) ) * d) ;  
                        p.position.y = (cy + sin( a + time % cos(dy + time) ) * d)  ;
                        
                        var out:Particles = particles_out[index];
                        particles_out[index].radius = 4.0;
                        particles_out[index].position =  p.position;
                        particles_out[index].velocity = vec2(cos(a + sin(a+d*time)) *5.15);
                    `
                }
            })
            console.log(obj.bindgroups.myComputeResources)
            const timeObj = obj.bindgroups.myComputeResources.uniforms.items.time;


            let oldTime = new Date().getTime();
            pipeline.onReceiveData = (datas: Float32Array) => {


                let time = (new Date().getTime() - oldTime) / 1000000;
                timeObj.x = time;
                //console.log(timeObj.x, time)
                ctx.clearRect(0, 0, 512, 512)
                ctx.beginPath();
                ctx.fillStyle = "#ff0000";
                let radius, x, y;
                for (let i = 0; i < datas.length; i += 6) {
                    radius = datas[i + 0]; //because of byte-alignment, data is packed by 2 
                    //so even if 'radius' is a single value, it takes 2 slots in the array 
                    //=> The data have been refactored by VertexBuffer in order to be used in computePipeline
                    //   ==> we send an array with 5 value by vertex in the vertexBuffer and it outputs an array with 6 value by vertex
                    //       => it added a zero after the "radius" to maintain the alignment

                    x = datas[i + 2];      //'x' and 'y' can be considered as a pack of two so we can just add one
                    y = datas[i + 3];

                    //ctx.lineWidth = 100;
                    //ctx.moveTo(x, y);
                    //ctx.lineTo(x + 1, y);

                    ctx.rect(x, y, radius, radius);

                    //ctx.arc(x, y, radius, 0, Math.PI * 2);
                    //ctx.fill();

                }
                ctx.fill();
            }


            pipeline.buildGpuPipeline();
            pipeline.nextFrame();
            const animate = () => {
                pipeline.nextFrame();
                requestAnimationFrame(animate)
            }
            animate();



        })



    }


    private setupCanvas2D(w: number, h: number): CanvasRenderingContext2D {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.style.position = "absolute";
        canvas.style.top = canvas.style.left = "0px";
        canvas.style.zIndex = "" + 9999;
        document.body.appendChild(canvas);
        return canvas.getContext("2d", { alpha: false });
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
            datas.push(radius, x, y, speedX, speedY);
        }
        return new Float32Array(datas);
    }

}