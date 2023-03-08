
import { BuiltIns } from "../speechlessGPU/Builtins";
import { GPU } from "../speechlessGPU/GPU";
import { GPURenderer } from "../speechlessGPU/GPURenderer";
import { ComputePipeline } from "../speechlessGPU/pipelines/ComputePipeline";
import { VertexBuffer } from "../speechlessGPU/shader/resources/VertexBuffer";
import { VertexBufferIO } from "../speechlessGPU/shader/resources/VertexBufferIO";
import { Sample } from "./Sample";




export class Test06 {

    constructor() {


        GPU.init().then(() => {



            const size = 500;
            const ctx = this.setupCanvas2D(size, size);
            const nbParticle = 5000;
            const particleDatas = this.createParticleDatas(nbParticle, ctx.canvas.width, ctx.canvas.height);


            const pipeline = new ComputePipeline();
            pipeline.initFromObject({
                bindgroups: {
                    myComputeResources: {
                        particles: new VertexBufferIO({
                            radius: VertexBuffer.Float(),
                            position: VertexBuffer.Vec2(),
                            velocity: VertexBuffer.Vec2()
                        }, {
                            datas: particleDatas
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
                        var d = f32(index)*0.05;//distance(p.position,center);
                        var a = atan2(dy ,dx) + p.position.x * 0.001; //+ d*0.0001 * cos(p.velocity.x * sin(d*0.1)  ) * 0.618;
                        
            
                        p.position = vec2(cx + cos(a)*d,cy + sin(a)*d);  //( vec2(cx + cos(a) * d, cy + sin(a) * d))  ;
                        
                        var out:Particles = particles_out[index];
                        particles_out[index].position =  p.position;
                        particles_out[index].velocity += cos(a)*2.15;
                    `
                }
            })



            pipeline.onReceiveData = (datas: Float32Array) => {
                ctx.canvas.width = ctx.canvas.width;
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