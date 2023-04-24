import { BuiltIns } from "../xGPU/BuiltIns";
import { XGPU } from "../xGPU/XGPU";
import { GPURenderer } from "../xGPU/GPURenderer";
import { ComputePipeline } from "../xGPU/pipelines/ComputePipeline";
import { MixedPipeline } from "../xGPU/pipelines/MixedPipeline";
import { RenderPipeline } from "../xGPU/pipelines/RenderPipeline";
import { AlphaBlendMode } from "../xGPU/pipelines/resources/blendmodes/AlphaBlendMode";
import { Matrix4x4, Vec2 } from "../xGPU/shader/PrimitiveType";
import { ImageTexture } from "../xGPU/shader/resources/ImageTexture";
import { TextureSampler } from "../xGPU/shader/resources/TextureSampler";
import { UniformBuffer } from "../xGPU/shader/resources/UniformBuffer";
import { ProjectionMatrix } from "../xGPU/shader/resources/uniforms/ProjectionMatrix";
import { VertexBuffer } from "../xGPU/shader/resources/VertexBuffer";
import { VertexBufferIO } from "../xGPU/shader/resources/VertexBufferIO";
import { ShaderType } from "../xGPU/shader/ShaderType";
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
        console.log("format = ", XGPU.getPreferredCanvasFormat())
        console.log("media = ", mediaW, mediaH)

        const nbParticle = renderer.canvas.width * renderer.canvas.height;
        console.log("nbParticle = ", nbParticle)

        let mixedPipeline = new MixedPipeline(renderer);
        mixedPipeline.setupDraw({ instanceCount: nbParticle, vertexCount: 6 })
        mixedPipeline.setupDepthStencilView({ size: [renderer.canvas.width, renderer.canvas.height, 1] })




        let computePipeline = mixedPipeline.computePipeline; //new ComputePipeline();
        let computeResources = computePipeline.initFromObject({
            bindgroups: {
                io: {
                    particles: new VertexBufferIO({
                        //position: VertexAttribute.Vec3(),
                        depth: VertexAttribute.Float(),

                    }),
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
                
                let index = global_id.x;
                var p = particles[index];
               
                var id = f32(index);
                var idx = (id % screen.x);
                var idy = floor(id / screen.x);
                let px = -0.5+(idx / screen.x) ;
                let py = -0.5+(idy / screen.y) ;
                
                var col = textureSampleLevel(myTexture,mySampler,vec2( (0.5 + px) , (0.5+ py)),0.0);
                var nbStep = 15.0; 
                particles_out[index].depth = - 0.5 + ceil( distance(col.rgb,vec3(0.5)) * nbStep) / nbStep;
               
               
                `
            }
        })

        computeResources.bindgroups.io.particles.datas = new Float32Array(nbParticle)
        computePipeline.buildGpuPipeline();


        let modelMatrix = new Matrix4x4();


        let viewMatrix = new Matrix4x4();

        let quadSize = 1 // 1024;

        let renderPassTexture = mixedPipeline.renderPass;


        let renderResource = mixedPipeline.initFromObject({
            blendMode: new AlphaBlendMode(),
            bindgroups: {
                vertexResources: {
                    geom: new VertexBuffer({
                        vertexPos: VertexAttribute.Vec3(0)
                    }),
                    uniforms: new UniformBuffer({
                        model: modelMatrix,
                        view: viewMatrix,
                        projection: new ProjectionMatrix(renderer.canvas.width, renderer.canvas.height, 45),
                    }),
                    renderPass: new ImageTexture({ source: renderPassTexture.gpuResource }),
                    myTexture: new ImageTexture({ source: computeResources.bindgroups.datas.myTexture.gpuResource }),//computeResources.bindgroups.datas.myTexture,
                    mySampler: computeResources.bindgroups.datas.mySampler,
                },
                io: computeResources.bindgroups.io,

            },

            vertexShader: {
                inputs: {
                    instanceId: BuiltIns.vertexInputs.instanceIndex
                },
                outputs: {
                    position: BuiltIns.vertexOutputs.position,
                    color: ShaderType.Vec4,
                    uv: ShaderType.Vec2,
                },
                main: `
                
                var id = f32(instanceId);
                var px = -512.0 + (id % 1024.0);
                var py = -512.0 + floor(id / 1024.0);

                output.position = uniforms.projection *  uniforms.view * uniforms.model * vec4( (vertexPos.xy + vec2(px,py)) ,depth*100.0, 1.0);
                output.color = vec4(vec3(depth),1.0);
                output.uv = vec2(px,py)/1024.0 + 0.5;
                `
            },

            fragmentShader: {
                outputs: {
                    color: BuiltIns.fragmentOutputs.color
                },
                main: `
                    output.color = textureSample(myTexture,mySampler,uv) ;
                `
            }


        })

        renderResource.bindgroups.vertexResources.geom.datas = new Float32Array([
            -quadSize, -quadSize, 0.0,
            +quadSize, -quadSize, 0.0,
            -quadSize, +quadSize, 0.0,

            +quadSize, -quadSize, 0.0,
            +quadSize, +quadSize, 0.0,
            -quadSize, +quadSize, 0.0,
        ])
        mixedPipeline.buildPipelines()



        const time = computeResources.bindgroups.datas.uniforms.items.time;

        //console.log("time = ", time)






        let oldTime = new Date().getTime();
        mixedPipeline.onDrawEnd = () => {
            modelMatrix.rotationY += 0.01;
            modelMatrix.rotationX += 0.005;
            modelMatrix.rotationZ += 0.001;

            viewMatrix.z = 1000 + Math.sin(modelMatrix.rotationX * 0.5) * 500.0;

            //renderPipeline.onDrawEnd = () => {

            //console.log("nextFrame")
            computePipeline.nextFrame();
        }

        renderer.addPipeline(mixedPipeline);


    }




}