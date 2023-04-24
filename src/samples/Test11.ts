import { BuiltIns } from "../xGPU/BuiltIns";
import { GPURenderer } from "../xGPU/GPURenderer";
import { ComputePipeline } from "../xGPU/pipelines/ComputePipeline";
import { RenderPipeline } from "../xGPU/pipelines/RenderPipeline";
import { Float } from "../xGPU/shader/PrimitiveType";
import { ImageTextureIO } from "../xGPU/shader/resources/ImageTextureIO";
import { TextureSampler } from "../xGPU/shader/resources/TextureSampler";
import { UniformBuffer } from "../xGPU/shader/resources/UniformBuffer";
import { ShaderType } from "../xGPU/shader/ShaderType";
import { Sample } from "./Sample";

export class Test11 extends Sample {

    constructor() {
        super(1024, 1024)
    }

    protected async start(renderer: GPURenderer) {

        const { bmp, bmp2 } = this.medias;

        const computePipeline = new ComputePipeline();
        computePipeline.useRenderPipeline = true;
        const computeResource = computePipeline.initFromObject({
            bindgroups: {
                io: {
                    image: new ImageTextureIO({ source: bmp2 }),
                    mySampler: new TextureSampler({ minFilter: "linear", magFilter: "linear" }),

                },
                other: {
                    uniforms: new UniformBuffer({
                        time: new Float(0, true)
                    })
                }

            },
            computeShader: {
                inputs: {
                    localId: BuiltIns.computeInputs.localInvocationId,
                    workgroupId: BuiltIns.computeInputs.workgroupId
                },
                main: `
                    let dim = vec2<f32>(textureDimensions(image));
                    let id = vec2<i32>(workgroupId.xy);
                    var col = textureSampleLevel(image, mySampler, (0.5+vec2<f32>(id)) / dim,0.0);
                    col.r = 0.5 + sin( time) * 0.5;
                    col.g = 0.5 + cos( time + col.b) * 0.5;
                    
                    textureStore(image_out, id, col);
                `
            }
        })
        computePipeline.buildGpuPipeline();
        computePipeline.nextFrame();


        const renderPipeline = new RenderPipeline(renderer);
        renderPipeline.setupDraw({ instanceCount: 1, vertexCount: 6 });
        const renderResource = renderPipeline.initFromObject({
            bindgroups: {
                io: computeResource.bindgroups.io
            },
            vertexShader: {
                inputs: {
                    vertexId: BuiltIns.vertexInputs.vertexIndex
                },
                outputs: {
                    position: BuiltIns.vertexOutputs.position,
                    uv: ShaderType.Vec2
                },
                main: `
                var pos = array<vec2<f32>,6>(
                    vec2(-1.0, -1.0),
                    vec2(1.0, -1.0),
                    vec2(-1.0, 1.0),
                    vec2(1.0, -1.0),
                    vec2(1.0, 1.0),
                    vec2(-1.0, 1.0),
                 );

                 output.position = vec4(pos[vertexId],0.0,1.0);
                 output.uv = (pos[vertexId] + 1.0) * 0.5;
                `
            },
            fragmentShader: {
                outputs: {
                    color: BuiltIns.fragmentOutputs.color
                },
                main: `
                    output.color = textureSample(image,mySampler,uv);
                `
            }
        })
        renderPipeline.buildGpuPipeline();
        renderer.addPipeline(renderPipeline);

        let now = new Date().getTime();
        renderPipeline.onDrawEnd = () => {
            computeResource.bindgroups.other.uniforms.items.time.x = (new Date().getTime() - now) / 1000;
            computePipeline.nextFrame();
            //console.log("a")
        }
    }

}