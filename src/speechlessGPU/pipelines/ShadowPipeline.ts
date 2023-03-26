import { BuiltIns } from "../Builtins";
import { GPURenderer } from "../GPURenderer";
import { HeadlessGPURenderer } from "../HeadlessGPURenderer";
import { Matrix4x4, Vec3 } from "../shader/PrimitiveType";
import { UniformBuffer } from "../shader/resources/UniformBuffer";
import { VertexAttribute } from "../shader/resources/VertexAttribute";
import { VertexBuffer } from "../shader/resources/VertexBuffer";

import { RenderPipeline } from "./RenderPipeline";

export class ShadowPipeline extends RenderPipeline {

    protected target: RenderPipeline;

    constructor(target: RenderPipeline, depthTextureSize: number = 1024) {
        super(target.renderer, null);

        this.setupDepthStencilView({
            size: [depthTextureSize, depthTextureSize],
            format: "depth32float",
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        })


    }

    public initShadowFromObject(vertexPositionName: string, vertexNormalName: string, projectionMatrixName: string) {

        const resources: any = {
            bindgroups: {
                geom: {

                }
            },
            vertexShader: {
                outputs: {
                    position: BuiltIns.vertexOutputs.position
                },
                main: `
                
                `
            }
        }


        //------- find correct VertexBuffers from target-pipeline ----------------------------------------------


        const vertexBuffers: VertexBuffer[] = this.target.bindGroups.resources.types.vertexBuffers;
        if (!vertexBuffers) throw new Error("ShadowPipeline's target doesn't contain a VertexAttribute called '" + vertexPositionName + "' or '" + vertexNormalName + "'")

        const buffers = [];
        for (let i = 0; i < vertexBuffers.length; i++) {
            if (vertexBuffers[i].getAttributeByName(vertexPositionName)) {
                buffers[0] = vertexBuffers[i];

            }
            if (vertexBuffers[i].getAttributeByName(vertexNormalName)) {
                buffers[1] = vertexBuffers[i];
            }
        }

        if (!buffers[0]) throw new Error("ShadowPipeline's target doesn't contain a VertexAttribute called '" + vertexPositionName + "'");
        if (!buffers[1]) throw new Error("ShadowPipeline's target doesn't contain a VertexAttribute called '" + vertexNormalName + "'");

        if (buffers[0] === buffers[1]) resources.bindgroups.geom.vb = buffers[0];
        else {
            resources.bindgroups.geom.vb0 = buffers[0];
            resources.bindgroups.geom.vb1 = buffers[1];
        }


        //---------- find uniforms containing projectionMatrix from target-pipeline ---------------
        const uniforms: UniformBuffer[] = this.target.bindGroups.resources.types.uniformBuffers;
        if (!uniforms) throw new Error("ShadowPipeline's target doesn't contain an Uniform called '" + projectionMatrixName + "'");

        let uniformBuffer: UniformBuffer;
        for (let i = 0; i < uniforms.length; i++) {
            if (uniforms[i].items[projectionMatrixName]) {
                uniformBuffer = uniforms[i];
                break;
            }
        }

        if (!uniformBuffer) throw new Error("ShadowPipeline's target doesn't contain an Uniform called '" + projectionMatrixName + "'");

        resources.bindgroup.geom.uniforms = uniformBuffer;




    }

    public initFromObject(descriptor: any): any {
        throw new Error("you must use ShadowPipeline.initShadow instead of initFromObject")
    }




}