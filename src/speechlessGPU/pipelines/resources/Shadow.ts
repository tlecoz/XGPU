import { BuiltIns } from "../../Builtins";
import { GPURenderer } from "../../GPURenderer";
import { HeadlessGPURenderer } from "../../HeadlessGPURenderer";
import { UniformBuffer } from "../../shader/resources/UniformBuffer";
import { VertexBuffer } from "../../shader/resources/VertexBuffer";
import { RenderPipeline } from "../RenderPipeline";
import { IndexBuffer } from "./IndexBuffer";

export class Shadow extends RenderPipeline {

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