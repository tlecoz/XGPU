import { BuiltIns } from "../xGPU/BuiltIns";
import { GPURenderer } from "../xGPU/GPURenderer";
import { ComputePipeline } from "../xGPU/pipelines/ComputePipeline";
import { RenderPipeline } from "../xGPU/pipelines/RenderPipeline";
import { AlphaBlendMode } from "../xGPU/pipelines/resources/blendmodes/AlphaBlendMode";
import { Float } from "../xGPU/shader/PrimitiveType";
import { UniformBuffer } from "../xGPU/shader/resources/UniformBuffer";
import { VertexAttribute } from "../xGPU/shader/resources/VertexAttribute";
import { VertexBuffer } from "../xGPU/shader/resources/VertexBuffer";
import { VertexBufferIO } from "../xGPU/shader/resources/VertexBufferIO";
import { Sample } from "./Sample";

export class Test07 extends Sample {


    constructor(canvas) {
        canvas.width = canvas.height = 512;
        super(canvas);
    }

    private createParticleDatas(nb: number, w, h) {
        const pi2 = Math.PI * 2;
        let radius: number, x: number, y: number, a: number, speedX: number, speedY: number;
        const datas: number[] = [];
        for (let i = 0; i < nb; i++) {
            radius = 0.5//1 + Math.random() * 2;
            x = i % 512;//Math.random() * w;
            y = Math.floor(i / 512)//Math.random() * h;
            a = Math.random() * pi2;
            speedX = Math.cos(a);
            speedY = Math.sin(a);
            //datas.push(radius, x, y, speedX, speedY, x, y);
            datas.push(x, y); //vec2
            datas.push(0, 0); //float + pad
            //datas.push(0, 0, 0); //vec3



            //datas.push(radius, 0, 0, 0, x, y, 0, 0, speedX, speedY, 0, 0);
            //datas.push(x, y, speedX, speedY);
        }
        return new Float32Array(datas);
    }

    protected async start(renderer: GPURenderer) {

        //console.log("START")

        const nbParticle = 512 * 512;

        let computePipeline = new ComputePipeline();
        let computeResources = computePipeline.initFromObject({
            time: new Float(0),
            particles: new VertexBufferIO({
                position: VertexAttribute.Vec2(),
                a: VertexAttribute.Float(),
                b: VertexAttribute.Vec3(),
                c: VertexAttribute.Float(),
                d: VertexAttribute.Vec2(),
                e: VertexAttribute.Float(),
            }),

            global_id: BuiltIns.computeInputs.globalInvocationId,
            computeShader: `
                let nbParticle = arrayLength(&particles);
                let index = global_id.x;
                if(index >= nbParticle){
                    return;
                }
                
                var p:Particles = particles[index]; 
                p.c = abs(sin(time));

                var out:Particles = particles_out[index];
                particles_out[index] = p;
               
                `
        });

        (computeResources.particles as VertexBufferIO).createVertexInstances(nbParticle, (instanceId: number) => {
            return {
                position: [instanceId % 512, Math.floor(instanceId / 512)],
                a: [instanceId / nbParticle],

            }
        })


        computePipeline.useRenderPipeline = true;
        computePipeline.buildGpuPipeline();
        computePipeline.nextFrame();



        console.log("arrayStride = ", (computeResources.particles as VertexBufferIO).buffers[0].arrayStride)



        let renderPipeline = new RenderPipeline(renderer);
        renderPipeline.setupDraw({
            instanceCount: nbParticle,
            vertexCount: 6
        })

        let quadSize = 0.0005;
        let resource = renderPipeline.initFromObject({
            antiAliasing: true,
            blendMode: new AlphaBlendMode(),
            topology: "point-list",
            vertexCount: 1,
            instanceCount: nbParticle,
            particles: computeResources.particles,

            vertexShader: {
                inputs: {
                    instanceId: BuiltIns.vertexInputs.instanceIndex
                },
                outputs: {
                    position: BuiltIns.vertexOutputs.position,
                    uv: BuiltIns.vertexOutputs.Vec2,
                    id: BuiltIns.vertexOutputs.Float,
                    a: BuiltIns.vertexOutputs.Float,
                    c: BuiltIns.vertexOutputs.Float
                },
                main: `
                
                let pos = -1.0 + (position.xy / 512.0) * 2.0;
              
                output.position = vec4(pos,0.0,1.0);

                output.uv = position.xy / 512.0;
                output.id = (f32(instanceId) % 512.0)/512.0;
                output.a = a;
                output.c = c;
               
                `
            },

            fragmentShader: `output.color = vec4(a,1.0-id,c,1.0);`



        })






        renderPipeline.buildGpuPipeline();


        //computePipeline.nextFrame();
        //computePipeline.onReceiveData = (data: Float32Array) => {
        //console.log(data.slice(0, 6))
        //}



        //console.log("time = ", time)

        let oldTime = new Date().getTime();
        renderPipeline.onDrawEnd = () => {
            (computeResources.time as any).x = (new Date().getTime() - oldTime) * 0.0001;
            //console.log("nextFrame")
            computePipeline.nextFrame();
        }

        renderer.addPipeline(renderPipeline);


    }





}