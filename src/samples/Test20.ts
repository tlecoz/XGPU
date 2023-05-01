import { GPURenderer } from "../xGPU/GPURenderer";
import { HeadlessGPURenderer } from "../xGPU/HeadlessGPURenderer";
import { PipelinePlugin } from "../xGPU/pipelines/plugins/PipelinePlugin";
import { RenderPipeline } from "../xGPU/pipelines/RenderPipeline";
import { IndexBuffer } from "../xGPU/pipelines/resources/IndexBuffer";
import { Float, Matrix4x4, Vec3 } from "../xGPU/shader/PrimitiveType";
import { Camera } from "./uniforms/Camera";
import { VertexAttribute } from "../xGPU/shader/resources/VertexAttribute";
import { ShaderType } from "../xGPU/shader/ShaderType";
import { Sample } from "./Sample";


import { dragonMesh } from "../samples/meshes/DragonMesh"

import { TextureSampler } from "../xGPU/shader/resources/TextureSampler";
import { mat4, vec3 } from "gl-matrix";
import { UniformBuffer } from "../xGPU/shader/resources/UniformBuffer";




export class ShadowPipeline extends RenderPipeline {

    constructor(lightPipeline: RenderPipeline, required: {
        indexBuffer: IndexBuffer,
        position: VertexAttribute,
        model: Matrix4x4,
        lightProjection: Matrix4x4,
    }) {
        super(lightPipeline.renderer, null);


        const resources: any = { indexBuffer: required.indexBuffer };

        /*
        VertexAttributes are stored in the shader into VertexBuffers 
        We want to re-use an existing VertexBuffer in our shadow, so instead of giving it the reference of the vertexAttribute
        we need to pass the entire vertexBuffer that contains the attribute we want to use 
        */
        resources.buffer = required.position.vertexBuffer;

        /*
        primitiveType like Matrix4x4 , Vec4, Float, ...  defined outside of the shader are known as Uniforms.
        They are stored in the shader in an UniformBuffer. 
        
        We want to re-use an uniform from a renderPipeline into our shadowPipeline, but in order to re-use the existing one,
        we need to pass the entire uniformBuffer that contains the uniform we want to use. 
        */

        //Two uniforms may share the same uniformBuffer but we can't pass the uniformBuffer twice to the shader, so we must check
        //and pass the correct amount of uniformBuffer with the correct uniform's name 
        let model: string, lightProjection: string;
        if (required.model.uniformBuffer === required.lightProjection.uniformBuffer) {
            resources.uniforms = required.model.uniformBuffer;
            model = "uniforms." + required.model.name;
            lightProjection = "uniforms." + required.lightProjection.name;

        } else {
            resources.model = required.model.uniformBuffer;
            resources.light = required.lightProjection.uniformBuffer;
            model = "model." + required.model.name;
            lightProjection = "light." + required.lightProjection.name;
        }


        this.initFromObject({
            ...resources,
            useDepthTexture: true,
            depthTextureSize: 1024,
            vertexShader: `output.position = ${lightProjection} * ${model} *  vec4(${required.position.name} , 1.0);`

        });


    }
}

export class Light extends UniformBuffer {

    private static origin: Vec3 = new Vec3(0, 0, 0);
    private static upVector: Vec3 = new Vec3(0, 1, 0);

    protected viewMatrix: mat4;
    protected projectionMatrix: mat4;

    constructor(screenW: number, screenH: number) {
        super({
            position: new Vec3(50, 200, -200),
            projection: new Matrix4x4(new Float32Array(16)),
            ambient: new Vec3(0.2, 0.2, 0.2),
            color: new Vec3(1.0, 1.0, 1.0),
            projectionScale: new Float(0.5)
        }, { useLocalVariable: false })


        this.viewMatrix = mat4.create();
        this.createProjectionMatrix(screenW, screenH);
        this.update();
    }

    public update(): void {

        if (this.items.position.mustBeTransfered) {

            const lightViewMatrix = mat4.create();

            /*
            shadow quality is much better with a light-projection-matrix that uses lower values
            |-> it's cheaper to apply a scale than to increase the depthTexture size, that's why I use 'projectionScale'
            |
            |-> the true 'light.position' value is not impacted, the projectionScale is only applyed for the light-projection-matrix 
                so it has an impact only on the shadow-pass , not inside the fragment shader of the main renderPipeline
            */

            const p = this.items.position;
            const scale = this.items.projectionScale;
            const pos = vec3.fromValues(p.x * scale, p.y * scale, p.z * scale);
            mat4.lookAt(lightViewMatrix, pos, Light.origin, Light.upVector);
            mat4.multiply(this.items.projection, this.projectionMatrix, lightViewMatrix);

            //we must set 'mustBeTransfered' manually because we use a function from 'mat4' to transfrom the array
            this.items.projection.mustBeTransfered = true

        }

        super.update();
    }


    protected createProjectionMatrix(screenW: number, screenH: number) {

        const _w = screenW * this.items.projectionScale;
        const _h = screenH * this.items.projectionScale;
        const left = -_w;
        const right = _w;
        const bottom = -_h;
        const top = _h;
        const near = -_w * 2.5;
        const far = _w * 2.5;

        if (!this.projectionMatrix) this.projectionMatrix = mat4.create();
        mat4.ortho(this.projectionMatrix, left, right, bottom, top, near, far);

    }

    public get ambientR(): number { return this.items.ambient.x }
    public get ambientG(): number { return this.items.ambient.y }
    public get ambientB(): number { return this.items.ambient.z }

    public set ambientR(n: number) { this.items.ambient.x = n }
    public set ambientG(n: number) { this.items.ambient.y = n }
    public set ambientB(n: number) { this.items.ambient.z = n }


    public get r(): number { return this.items.color.x }
    public get g(): number { return this.items.color.y }
    public get b(): number { return this.items.color.z }

    public set r(n: number) { this.items.color.x = n }
    public set g(n: number) { this.items.color.y = n }
    public set b(n: number) { this.items.color.z = n }

    public get x(): number { return this.items.position.x; }
    public get y(): number { return this.items.position.y; }
    public get z(): number { return this.items.position.z; }

    public set x(n: number) { this.items.position.x = n; }
    public set y(n: number) { this.items.position.y = n; }
    public set z(n: number) { this.items.position.z = n; }
}

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
            output.transformedLightPos = vec4(  ${this.requiredNames.modelMatrix} * vec4(light.position,1.0)).xyz;
            
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


export class Dragon extends RenderPipeline {

    public model: Matrix4x4;
    public camera: Camera;
    public position: VertexAttribute;
    public normal: VertexAttribute;


    constructor(renderer: GPURenderer | HeadlessGPURenderer) {
        super(renderer);

        const resources: any = this.initFromObject({
            cullMode: "back",
            indexBuffer: new IndexBuffer({ nbPoint: dragonMesh.triangles.length, datas: new Uint16Array(dragonMesh.triangles) }),
            position: VertexAttribute.Vec3(dragonMesh.positions),
            normal: VertexAttribute.Vec3(dragonMesh.normals),
            cameraViewProjMatrix: new Camera(renderer.canvas.width, renderer.canvas.height, 60, 0.1, 100000),
            modelMatrix: new Matrix4x4(),
            vertexShader: `output.position = cameraViewProjMatrix  *  modelMatrix * vec4(position, 1.0);`,
            fragmentShader: `output.color = vec4(1.0);`

        });

        this.model = resources.modelMatrix;
        this.camera = resources.cameraViewProjMatrix
        this.position = resources.position;
        this.normal = resources.normal;
        this.setupDepthStencilView()

    }



}




export class Test20 extends Sample {

    constructor(canvas) {
        super(canvas);
    }

    protected async start(renderer: GPURenderer): Promise<void> {


        const dragon = new Dragon(renderer);

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

        light.position.y = light.position.z = renderer.canvas.width * 0.9;
        dragon.onDrawBegin = () => {
            const time = (new Date().getTime() - now) / 1000;
            dragon.camera.rotationY += 0.01;
            //light.position.z = (Math.sin(time) * renderer.canvas.width);

        }

        renderer.addPipeline(dragon);
    }
}