import { BuiltIns } from "../speechlessGPU/Builtins";
import { GPURenderer } from "../speechlessGPU/GPURenderer";
import { ComputePipeline } from "../speechlessGPU/pipelines/ComputePipeline";
import { RenderPipeline } from "../speechlessGPU/pipelines/RenderPipeline";
import { ImageTextureIO } from "../speechlessGPU/shader/resources/ImageTextureIO";
import { TextureSampler } from "../speechlessGPU/shader/resources/TextureSampler";
import { ShaderType } from "../speechlessGPU/shader/ShaderType";
import { Sample } from "./Sample";

export class Test11 extends Sample {

    constructor() {
        super(1024, 1024)
    }

    protected async start(renderer: GPURenderer) {

        const { bmp } = this.medias;

        const computePipeline = new ComputePipeline();
        computePipeline.useRenderPipeline = true;
        const computeResource = computePipeline.initFromObject({
            bindgroups: {
                io: {
                    image: new ImageTextureIO({ source: bmp }),
                    mySampler: new TextureSampler({ minFilter: "linear", magFilter: "linear" })
                },
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
                    col.a = 1.0;

                    col.r *= 1.01;

                    
                    /*
                    let fid = vec2<f32>(id);
                    if(fid.x > 100.0 && fid.y > 682.0*0.5){
                        col = vec4(1.0,0.0,0.0,1.0);
                    }else{
                        col = vec4(0.0,1.0,0.0,1.0);
                    }
                    */
                   
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

        renderPipeline.onDrawEnd = () => {
            computePipeline.nextFrame();
            //console.log("a")
        }
    }

}