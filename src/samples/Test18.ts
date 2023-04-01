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


export class ShadowPipeline extends RenderPipeline {

    constructor(renderer: GPURenderer | HeadlessGPURenderer, target: {
        indexBuffer: IndexBuffer,
        vertexBuffer_position: VertexBuffer,
        model_modelMatrix: UniformBuffer,
        scene_lightViewProjMatrix: UniformBuffer
    }) {
        super(renderer, null);
        this.initFromObject({
            indexBuffer: target.indexBuffer,
            bindgroups: {
                geom: {
                    vertexBuffer: target.vertexBuffer_position,
                    model: target.model_modelMatrix,
                    scene: target.scene_lightViewProjMatrix
                }
            },
            vertexShader: {
                outputs: {
                    position: BuiltIns.vertexOutputs.position
                },
                main: `
                output.position = scene.lightViewProjMatrix * model.modelMatrix * vec4(position, 1.0);
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

    public model: UniformBuffer;
    public scene: UniformBuffer;
    public cameraViewProjMatrix: Matrix4x4;
    public lightViewProjMatrix: Matrix4x4;
    public vertexBuffer: VertexBuffer;

    private shadow: ShadowPipeline;

    public _update: () => void;

    constructor(renderer: GPURenderer | HeadlessGPURenderer) {
        super(renderer, { r: 0, g: 0, b: 0, a: 1 });



        //----------

        const aspect = renderer.canvas.width / renderer.canvas.height;

        const eyePosition = vec3.fromValues(0, 50, -100);
        const upVector = vec3.fromValues(0, 1, 0);
        const origin = vec3.fromValues(0, 0, 0);

        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, Math.PI / 180 * 90, aspect, 0.1, 2000.0);

        const viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, eyePosition, origin, upVector);

        const lightPosition = vec3.fromValues(50, 100, -100);
        const lightViewMatrix = mat4.create();
        mat4.lookAt(lightViewMatrix, lightPosition, origin, upVector);

        const lightProjectionMatrix = mat4.create();
        {
            const left = -80;
            const right = 80;
            const bottom = -80;
            const top = 80;
            const near = -200;
            const far = 300;
            mat4.ortho(lightProjectionMatrix, left, right, bottom, top, near, far);
        }

        const lightViewProjMatrix = mat4.create();
        mat4.multiply(lightViewProjMatrix, lightProjectionMatrix, lightViewMatrix);

        const viewProjMatrix = mat4.create();
        mat4.multiply(viewProjMatrix, projectionMatrix, viewMatrix);

        // Move the model so it's centered.
        const modelMatrix = new ModelViewMatrix();//mat4.create();
        //mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0, -50, 0));
        modelMatrix.y = -50;

        let time = Date.now();
        this._update = () => {

            const rad = Math.PI * ((Date.now() - time) / 2000);


            const v3 = vec3.fromValues(0, 50, -100) //eye position

            vec3.rotateY(v3, v3, origin, rad);

            const viewMatrix = mat4.create();
            mat4.lookAt(viewMatrix, v3, origin, upVector);

            mat4.multiply(viewProjMatrix, projectionMatrix, viewMatrix);


            this.cameraViewProjMatrix.set(viewProjMatrix);
            this.cameraViewProjMatrix.mustBeTransfered = true;

            //return viewProjMatrix as Float32Array;
        }

        //-----------

        const resource: any = {

            indexBuffer: new IndexBuffer({ nbPoint: dragonMesh.triangles.length * 3, datas: new Uint16Array(dragonMesh.triangles) }),
            bindgroups: {
                geom: {
                    vertexBuffer: new VertexBuffer({
                        position: VertexBuffer.Vec3(dragonMesh.positions),
                        normal: VertexBuffer.Vec3(dragonMesh.normals),
                        uv: VertexBuffer.Vec2(dragonMesh.uvs),
                    }),
                    scene: new UniformBuffer({
                        lightViewProjMatrix: new Matrix4x4(lightViewProjMatrix as Float32Array),
                        cameraViewProjMatrix: new Matrix4x4(viewProjMatrix as Float32Array),
                        lightPos: new Vec3(lightPosition[0], lightPosition[1], lightPosition[2])
                    }, { useLocalVariable: true }),
                    model: new UniformBuffer({
                        modelMatrix: new Matrix4x4(modelMatrix as Float32Array)
                    })

                }
            },
            vertexShader: {
                outputs: {
                    position: BuiltIns.vertexOutputs.position,
                    fragNorm: ShaderType.Vec3,
                    fragPos: ShaderType.Vec3,
                    shadowPos: ShaderType.Vec3
                },
                main: `
                
                output.position = scene.cameraViewProjMatrix * model.modelMatrix * vec4(position, 1.0);
                output.fragPos = output.position.xyz;
                output.fragNorm = normal;

                // XY is in (-1, 1) space, Z is in (0, 1) space
                let posFromLight = scene.lightViewProjMatrix * model.modelMatrix * vec4(position, 1.0);
              
                // Convert XY to (0, 1)
                // Y is flipped because texture coords are Y-down.
                output.shadowPos = vec3(
                  posFromLight.xy * vec2(0.5, -0.5) + vec2(0.5),
                  posFromLight.z
                );
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
                        shadowPos.xy + offset, shadowPos.z - 0.007
                    );
                    }
                }
                visibility /= 9.0;

                let lambertFactor = max(dot(normalize(scene.lightPos - fragPos), fragNorm), 0.0);
                let lightingFactor = min(ambientFactor + visibility * lambertFactor, 1.0);             
                output.color = vec4(lightingFactor * albedo, 1.0);
                `
            }
        }



        const model = resource.bindgroups.geom.model;
        const scene = resource.bindgroups.geom.scene;
        const indexBuffer = resource.indexBuffer;
        const vertexBuffer = resource.bindgroups.geom.vertexBuffer;

        this.cameraViewProjMatrix = scene.items.cameraViewProjMatrix;

        this.shadow = new ShadowPipeline(this.renderer, {
            indexBuffer: indexBuffer,
            vertexBuffer_position: vertexBuffer,
            model_modelMatrix: model,
            scene_lightViewProjMatrix: scene
        })

        this.renderer.addPipeline(this.shadow)

        resource.bindgroups.geom.shadowMap = this.shadow.depthStencilTexture;
        resource.bindgroups.geom.shadowSampler = new TextureSampler({ compare: "less" });





        this.initFromObject(resource);
        this.setupDepthStencilView({ size: [renderer.canvas.width, renderer.canvas.height], format: "depth24plus" })



    }

    public update() {

        this._update();
        super.update();
    }

}



export class Test18 extends Sample {

    constructor() {
        super(1024, 1024);
    }


    protected async start(renderer: GPURenderer) {


        const dragon = new Dragon(renderer);
        dragon.description.primitive.cullMode = "back";
        renderer.addPipeline(dragon);


    }

}