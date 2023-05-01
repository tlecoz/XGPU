import { GPURenderer } from "../xGPU/GPURenderer";
import { HeadlessGPURenderer } from "../xGPU/HeadlessGPURenderer";
import { PipelinePlugin } from "../xGPU/pipelines/plugins/PipelinePlugin";
import { RenderPipeline } from "../xGPU/pipelines/RenderPipeline";
import { IndexBuffer } from "../xGPU/pipelines/resources/IndexBuffer";
import { Matrix4x4, Vec3 } from "../xGPU/shader/PrimitiveType";
import { Camera } from "./uniforms/Camera";
import { VertexAttribute } from "../xGPU/shader/resources/VertexAttribute";
import { ShaderType } from "../xGPU/shader/ShaderType";
import { Sample } from "./Sample";
import { Light, ShadowPipeline } from "./Test18";

import { dragonMesh } from "./meshes/DragonMesh"
import { VertexBuffer } from "../xGPU/shader/resources/VertexBuffer";
import { UniformBuffer } from "../xGPU/shader/resources/UniformBuffer";
import { BuiltIns } from "../xGPU/BuiltIns";
import { TextureSampler } from "../xGPU/shader/resources/TextureSampler";


export class LightPlugin extends PipelinePlugin {


    constructor(target: RenderPipeline, required: {
        position: VertexAttribute,
        normal: VertexAttribute,
        cameraMatrix: Matrix4x4,
        modelMatrix: Matrix4x4
    }) {

        super(target, required);

        this.bindgroupResources = {
            light: new Light(target.renderer.width, target.renderer.height),
        }

        this.vertexShader = {
            outputs: {
                fragNorm: ShaderType.Vec3,
                fragPos: ShaderType.Vec3,
                transformedLightPos: ShaderType.Vec3
            },
            main: `
            output.fragPos = output.position.xyz;
            output.fragNorm = ${this.requiredNames.normal};
            output.transformedLightPos = vec4( ${this.requiredNames.cameraMatrix}  *  ${this.requiredNames.modelMatrix} * vec4(light.position,1.0)).xyz;
            
            `
        }

        const shaderCode: string[] = [];

        /*
        I decompose the code in 2 parts because LightPlugin can be used as base class to handle shadow 
        */

        shaderCode[0] = `var visibility = 1.0;`
        shaderCode[1] = `
        let lambertFactor = max(dot(normalize(transformedLightPos-fragPos), fragNorm), 0.0);
        let lightingFactor = vec3(
           min(light.ambient.r + lambertFactor * visibility, 1.0),
           min(light.ambient.g + lambertFactor * visibility, 1.0),
           min(light.ambient.b + lambertFactor * visibility, 1.0),
       );
       output.color *= vec4(lightingFactor * light.color.rgb, 1.0);
        `

        this.fragmentShader = {
            inputs: {
                frontFacing: BuiltIns.fragmentInputs.frontFacing
            },
            main: shaderCode
        }
    }

    public get position(): Vec3 { return this.bindgroupResources.light.items.position; }
    public get color(): Vec3 { return this.bindgroupResources.light.items.color };
    public get ambient(): Vec3 { return this.bindgroupResources.light.items.ambient }

}


export class LightShadowPlugin extends LightPlugin {


    constructor(target: RenderPipeline, required: {
        position: VertexAttribute,
        normal: VertexAttribute,
        cameraMatrix: Matrix4x4,
        modelMatrix: Matrix4x4
    }) {

        super(target, required);

        const shadow = new ShadowPipeline(target, {
            indexBuffer: target.indexBuffer,
            position: required.position,
            model: required.modelMatrix,
            lightProjection: this.bindgroupResources.light.items.projection
        })

        target.renderer.addPipeline(shadow);

        this.bindgroupResources = {
            ...this.bindgroupResources,
            shadowMap: shadow.depthStencilTexture,
            shadowSampler: new TextureSampler({ compare: "less" })
        }


        this.vertexShader.outputs = {
            ...this.vertexShader.outputs,
            shadowPos: ShaderType.Vec3
        }

        this.vertexShader.main += `
            // XY is in (-1, 1) space, Z is in (0, 1) space
            let posFromLight = light.projection  *  ${this.requiredNames.modelMatrix} * vec4(${this.requiredNames.position} , 1.0) ;
            
            // Convert XY to (0, 1)
            // Y is flipped because texture coords are Y-down.
            output.shadowPos = vec3(
                posFromLight.xy * vec2(0.5, -0.5) + vec2(0.5),
                posFromLight.z
            );
        `

        this.fragmentShader.code = `
        const shadowDepthTextureSize: f32 = ${Math.round(target.renderer.canvas.width)}.0; 
        `;

        (this.fragmentShader.main as string[])[0] = `
            // Percentage-closer filtering. Sample texels in the region
            // to smooth the result.
            var visibility = 0.0;
            let oneOverShadowDepthTextureSize = 1.0 / shadowDepthTextureSize;
            for (var y = -1; y <= 1; y++) {
                for (var x = -1; x <= 1; x++) {
                let offset = vec2<f32>(vec2(x, y)) * oneOverShadowDepthTextureSize;

                visibility += textureSampleCompare(
                    shadowMap, shadowSampler,
                    shadowPos.xy + offset, shadowPos.z - 0.005
                );
                }
            }
            visibility /= 9.0;
            
        `;
    }
}


export class DragonWithoutLight extends RenderPipeline {

    public model: Matrix4x4;
    public camera: Camera;
    public position: VertexAttribute;
    public normal: VertexAttribute;


    constructor(renderer: GPURenderer | HeadlessGPURenderer) {
        super(renderer);

        this.initFromObject({
            cullMode: "back",
            indexBuffer: new IndexBuffer({ nbPoint: dragonMesh.triangles.length, datas: new Uint16Array(dragonMesh.triangles) }),
            bindgroups: {
                geom: {
                    vertexBuffer: new VertexBuffer({
                        position: VertexAttribute.Vec3(dragonMesh.positions),
                        normal: VertexAttribute.Vec3(dragonMesh.normals),
                    }),
                    scene: new UniformBuffer({
                        cameraViewProjMatrix: new Camera(renderer.canvas.width, renderer.canvas.height, 60, 0.1, 100000),
                    }),
                    model: new UniformBuffer({
                        modelMatrix: new Matrix4x4()
                    })

                }
            },
            vertexShader: {
                outputs: {
                    position: BuiltIns.vertexOutputs.position,

                },
                main: `
                output.position = scene.cameraViewProjMatrix  *  model.modelMatrix * vec4(position, 1.0);
                `
            },
            fragmentShader: {
                outputs: {
                    color: BuiltIns.fragmentOutputs.color
                },
                main: `
                output.color = vec4(1.0);
                `
            }
        });

        const geom = this.resources.bindgroups.geom;
        this.model = geom.model.items.modelMatrix;
        this.camera = geom.scene.items.cameraViewProjMatrix
        this.position = geom.vertexBuffer.attributes.position;
        this.normal = geom.vertexBuffer.attributes.normal;
        this.setupDepthStencilView()

    }



}




export class Test19 extends Sample {

    constructor(canvas) {
        super(canvas);
    }

    protected async start(renderer: GPURenderer): Promise<void> {


        const dragon = new DragonWithoutLight(renderer);

        /*
        const light = new LightPlugin(dragon, {
            position: dragon.position,
            normal: dragon.normal,
            modelMatrix: dragon.model,
            cameraMatrix: dragon.camera
        }).apply() as LightPlugin;


         */
        const light = new LightShadowPlugin(dragon, {
            position: dragon.position,
            normal: dragon.normal,
            modelMatrix: dragon.model,
            cameraMatrix: dragon.camera
        })
        light.apply();


        dragon.model.scaleXYZ = renderer.canvas.width;

        const now = new Date().getTime();

        light.position.y = renderer.canvas.width * 0.9;
        dragon.onDrawBegin = () => {
            const time = (new Date().getTime() - now) / 1000;
            dragon.camera.rotationY += 0.01;
            light.position.z = (Math.sin(time) * renderer.canvas.width);

        }

        renderer.addPipeline(dragon);
    }
}