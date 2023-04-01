import { BuiltIns } from "../speechlessGPU/Builtins";
import { GPURenderer } from "../speechlessGPU/GPURenderer";
import { HeadlessGPURenderer } from "../speechlessGPU/HeadlessGPURenderer";
import { RenderPipeline } from "../speechlessGPU/pipelines/RenderPipeline";
import { IndexBuffer } from "../speechlessGPU/pipelines/resources/IndexBuffer";
import { UniformBuffer } from "../speechlessGPU/shader/resources/UniformBuffer";
import { VertexBuffer } from "../speechlessGPU/shader/resources/VertexBuffer";
import { ShaderType } from "../speechlessGPU/shader/ShaderType";
import { Sample } from "./Sample";
import { dragonMesh } from "../../assets/DragonMesh"
import { Matrix4x4, ModelViewMatrix, Vec3, Vec4 } from "../speechlessGPU/shader/PrimitiveType";
import { mat4, vec3 } from "gl-matrix";
import { ProjectionMatrix } from "../speechlessGPU/shader/resources/uniforms/ProjectionMatrix";
import { TextureSampler } from "../speechlessGPU/shader/resources/TextureSampler";
import { Camera } from "../speechlessGPU/shader/resources/uniforms/Camera";
import { Light } from "../speechlessGPU/pipelines/resources/Light";


export class ShadowPipeline extends RenderPipeline {

    constructor(renderer: GPURenderer | HeadlessGPURenderer, target: {
        indexBuffer: IndexBuffer,
        vertexBuffer_position: VertexBuffer,
        model_modelMatrix: UniformBuffer,
        light: Light,
    }) {
        super(renderer, null);

        this.initFromObject({
            indexBuffer: target.indexBuffer,
            bindgroups: {
                geom: {
                    vertexBuffer: target.vertexBuffer_position,
                    model: target.model_modelMatrix,
                    light: target.light

                }
            },
            vertexShader: {
                outputs: {
                    position: BuiltIns.vertexOutputs.position
                },
                main: `
                output.position = light.projection * model.modelMatrix *  vec4(position , 1.0);
                `
            }
        });

        this.setupDepthStencilView({
            size: [renderer.canvas.width, renderer.canvas.height, 1],
            format: "depth32float",
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        })
    }



}




export class Dragon extends RenderPipeline {

    public model: Matrix4x4;
    public camera: Camera;
    public light: Light;


    constructor(renderer: GPURenderer | HeadlessGPURenderer) {
        super(renderer);

        const resource: any = {
            cullMode: "back",
            indexBuffer: new IndexBuffer({ nbPoint: dragonMesh.triangles.length, datas: new Uint16Array(dragonMesh.triangles) }),
            bindgroups: {
                geom: {
                    vertexBuffer: new VertexBuffer({
                        position: VertexBuffer.Vec3(dragonMesh.positions),
                        normal: VertexBuffer.Vec3(dragonMesh.normals),
                        uv: VertexBuffer.Vec2(dragonMesh.uvs),
                    }),
                    light: new Light(renderer.canvas.width, renderer.canvas.height),
                    scene: new UniformBuffer({
                        cameraViewProjMatrix: new Camera(renderer.canvas.width, renderer.canvas.height, 60),
                    }),
                    model: new UniformBuffer({
                        modelMatrix: new Matrix4x4()
                    })

                }
            },
            vertexShader: {
                outputs: {
                    position: BuiltIns.vertexOutputs.position,
                    fragNorm: ShaderType.Vec3,
                    fragPos: ShaderType.Vec3,
                    shadowPos: ShaderType.Vec3,
                    transformedLightPos: ShaderType.Vec3
                },
                main: `
                
                output.position = scene.cameraViewProjMatrix  *  model.modelMatrix * vec4(position, 1.0);
                output.fragPos = output.position.xyz;
                output.fragNorm = normal;

                // XY is in (-1, 1) space, Z is in (0, 1) space
                let posFromLight = light.projection  *  model.modelMatrix * vec4(position , 1.0) ;
                
                // Convert XY to (0, 1)
                // Y is flipped because texture coords are Y-down.
                output.shadowPos = vec3(
                  posFromLight.xy * vec2(0.5, -0.5) + vec2(0.5),
                  posFromLight.z
                );

                
                output.transformedLightPos = vec4(scene.cameraViewProjMatrix  *  model.modelMatrix * vec4(light.position,1.0)).xyz;
                `
            },
            fragmentShader: {
                outputs: {
                    color: BuiltIns.fragmentOutputs.color
                },
                code: `
                const shadowDepthTextureSize: f32 = 1024.0;
                const albedo = vec3<f32>(0.9);
                const ambientFactor = 0.2;
                `,
                main: `
                // Percentage-closer filtering. Sample texels in the region
                // to smooth the result.
                var visibility = 0.0;
                let oneOverShadowDepthTextureSize = 1.0 / shadowDepthTextureSize;
                for (var y = -1; y <= 1; y++) {
                    for (var x = -1; x <= 1; x++) {
                    let offset = vec2<f32>(vec2(x, y)) * oneOverShadowDepthTextureSize;

                    visibility += textureSampleCompare(
                        shadowMap, shadowSampler,
                        shadowPos.xy + offset, shadowPos.z - 0.003
                    );
                    }
                }
                visibility /= 9.0;

                let lambertFactor = max(dot(normalize(transformedLightPos  - fragPos), fragNorm), 0.0);

                let lightingFactor = vec3(
                    min(light.ambient.r + lambertFactor * visibility, 1.0),
                    min(light.ambient.g + lambertFactor * visibility, 1.0),
                    min(light.ambient.b + lambertFactor * visibility, 1.0),
                );

                        
                output.color = vec4(lightingFactor * light.color.rgb, 1.0);
                `
            }
        }



        const model = resource.bindgroups.geom.model;
        const scene = resource.bindgroups.geom.scene;
        const light = resource.bindgroups.geom.light;
        const indexBuffer = resource.indexBuffer;
        const vertexBuffer = resource.bindgroups.geom.vertexBuffer;

        this.model = model.items.modelMatrix;
        this.camera = scene.items.cameraViewProjMatrix
        this.light = light;


        const shadow = new ShadowPipeline(this.renderer, {
            indexBuffer: indexBuffer,
            vertexBuffer_position: vertexBuffer,
            model_modelMatrix: model,
            light: light
        })

        this.renderer.addPipeline(shadow)

        resource.bindgroups.geom.shadowMap = shadow.depthStencilTexture;
        resource.bindgroups.geom.shadowSampler = new TextureSampler({ compare: "less" });





        this.initFromObject(resource);
        this.setupDepthStencilView({ size: [renderer.canvas.width, renderer.canvas.height], format: "depth32float" })



    }



}



export class Test19 extends Sample {

    constructor() {
        super(1024, 1024);
    }


    protected async start(renderer: GPURenderer) {


        const dragon = new Dragon(renderer);

        dragon.model.scaleX = dragon.model.scaleY = dragon.model.scaleZ = 600;
        renderer.addPipeline(dragon);


        let now = new Date().getTime();

        dragon.onDrawBegin = () => {
            //dragon.camera.rotationY = 2.5;
            dragon.camera.rotationY += 0.0025;

            let time = (new Date().getTime() - now) / 1000;

            dragon.light.x = Math.cos(time) * 250;
            dragon.light.z = Math.sin(time) * 250;

            dragon.light.g = Math.abs(Math.cos(time / 2));
            dragon.light.b = Math.abs(Math.cos(time / 3));

            dragon.light.ambientR = 0.2 * Math.abs(Math.cos(time / 6));
            dragon.light.ambientG = 0.2 * Math.abs(Math.sin(time / 8));
            dragon.light.ambientB = 0.2 * Math.abs(Math.sin(time / 12));

        }

    }

}