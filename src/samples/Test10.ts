import { BuiltIns } from "../xGPU/BuiltIns";
import { GPURenderer } from "../xGPU/GPURenderer";
import { HeadlessGPURenderer } from "../xGPU/HeadlessGPURenderer";
import { RenderPipeline } from "../xGPU/pipelines/RenderPipeline";
import { ImageTexture } from "../xGPU/shader/resources/ImageTexture";
import { TextureSampler } from "../xGPU/shader/resources/TextureSampler";
import { VideoTexture } from "../xGPU/shader/resources/VideoTexture";
import { ShaderType } from "../xGPU/shader/ShaderType";
import { Sample } from "./Sample";



export class GPUVideo extends HeadlessGPURenderer {



    constructor(video: HTMLVideoElement, onReady?: (canvas: HTMLCanvasElement) => void) {
        super()

        this.init(video.width, video.height).then((canvas: HTMLCanvasElement) => {


            const renderPipeline = new RenderPipeline(this);
            renderPipeline.setupDraw({ instanceCount: 1, vertexCount: 6 });
            renderPipeline.initFromObject({
                bindgroups: {
                    group: {
                        mySampler: new TextureSampler({ minFilter: "linear", magFilter: "linear" }),
                        myTexture: new VideoTexture({ source: video })
                    }

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
                        output.color = textureSampleBaseClampToEdge(myTexture,mySampler,uv);
                    `
                }
            })

            renderPipeline.buildGpuPipeline();
            this.addPipeline(renderPipeline);
            this.update();
            if (onReady) onReady(canvas);
        })
    }
}

export class GPUImage extends GPURenderer {

    private pipeline: RenderPipeline;

    constructor(source: GPUTexture | ImageBitmap | HTMLVideoElement, onReady?: (canvas: HTMLCanvasElement) => void) {
        super()

        this.initCanvas(source.width, source.height).then((canvas: HTMLCanvasElement) => {


            const renderPipeline = this.pipeline = new RenderPipeline(this);
            renderPipeline.setupDraw({ instanceCount: 1, vertexCount: 6 })
            renderPipeline.initFromObject({
                bindgroups: {
                    group: {
                        mySampler: new TextureSampler({ minFilter: "linear", magFilter: "linear" }),
                        myTexture: new ImageTexture({ source: source })
                    }

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
                        output.color = textureSample(myTexture,mySampler,uv);
                    `
                }
            })

            renderPipeline.buildGpuPipeline();


            this.addPipeline(renderPipeline);




            this.update();
            if (onReady) onReady(canvas);
        })
    }

    public get texture(): GPUTexture {
        return this.pipeline.renderPass.gpuResource;
    }
}


export class Test10 extends Sample {

    constructor(canvas) {
        super(canvas);
    }

    protected async start(renderer: GPURenderer) {

        //console.log("START")
        const { bmp, bmp2, video } = this.medias;
        video.width = 512;
        video.height = 512;


        var img;
        var media = new GPUVideo(video, (canvas) => {
            //document.body.appendChild(canvas);
            console.log(media.texture)
            img = new GPUImage(media.texture, (canvas) => {

                document.body.appendChild(canvas);
                console.log("ready")
                animate();
            });
        });





        const animate = () => {
            media.update();
            img.update();
            requestAnimationFrame(animate);
        }

    }

}