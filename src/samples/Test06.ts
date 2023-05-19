
import { BuiltIns } from "../xGPU/BuiltIns";
import { XGPU } from "../xGPU/XGPU";
import { ComputePipeline } from "../xGPU/pipelines/ComputePipeline";
import { Float, Vec2, Vec3 } from "../xGPU/shader/PrimitiveType";
import { UniformBuffer } from "../xGPU/shader/resources/UniformBuffer";
import { UniformGroup } from "../xGPU/shader/resources/UniformGroup";
import { UniformGroupArray } from "../xGPU/shader/resources/UniformGroupArray";
import { VertexAttribute } from "../xGPU/shader/resources/VertexAttribute";
import { VertexBuffer } from "../xGPU/shader/resources/VertexBuffer";
import { VertexBufferIO } from "../xGPU/shader/resources/VertexBufferIO";




export class Test06 {

    constructor() {


        XGPU.init().then(() => {

            /*
            const group = new UniformGroup({
                a: new Float(0.1),
                b: new Vec2(1, 2),
                c: new UniformGroup({ aaa: new Vec3(1, 2, 3) }),
                d: new UniformGroupArray([new UniformGroup({ zzz: new Float(55) })]),

            }, null, true)

            console.log(group);
            const struct = group.getStruct("test");

            console.log(struct.struct);
            console.log(struct.localVariables);
            */


            const size = 512;
            const ctx = this.setupCanvas2D(size, size);
            const nbParticle = 15000;

            const pipeline = new ComputePipeline();
            const obj = pipeline.initFromObject({

                time: new Float(0),
                particles: new VertexBufferIO({
                    radius: VertexAttribute.Float(),
                    position: VertexAttribute.Vec2(),
                    velocity: VertexAttribute.Vec2()
                }),

                global_id: BuiltIns.computeInputs.globalInvocationId,
                computeShader: `
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
                        
                        p.position.x = (cx + cos( a + time % sin(dx + time) ) * d) ;  
                        p.position.y = (cy + sin( a + time % cos(dy + time) ) * d)  ;
                        
                        var out:Particles = particles_out[index];
                        particles_out[index].radius = 1.0;
                        particles_out[index].position =  p.position;
                        particles_out[index].velocity = vec2(cos(a + sin(a+d*time)) *5.15);
                    `

            });

            (obj.particles as VertexBufferIO).createVertexInstances(nbParticle, (id) => {
                return {
                    radius: [1],
                    position: [Math.random() * size, Math.random() * size],
                    velocity: [-Math.random() + Math.random() * 2, -Math.random() + Math.random() * 2]
                }
            })


            const timeObj: any = obj.time;


            let oldTime = new Date().getTime();
            pipeline.onReceiveData = (datas: Float32Array) => {


                timeObj.x = (new Date().getTime() - oldTime) / 1000000;;

                ctx.clearRect(0, 0, 512, 512)
                ctx.beginPath();
                ctx.fillStyle = "#ff0000";
                (obj.particles as VertexBufferIO).getVertexInstances(datas, (o: any) => {
                    ctx.rect(o.position.x, o.position.y, o.radius.x, o.radius.x);
                })
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



}