// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { Texture } from "./Texture";
export class DepthStencilTexture extends Texture {
    /*
    When you apply a shadow to a renderPipeline , you actually create a ShadowPipeline that store information in the DepthStencilTexture.
    This texture is then used as IShaderResource in the renderPipeline.
    Because it can be an IShaderResource , we must implement the IShaderResource interface
    */
    _isDepthTexture = false;
    _description;
    get description() { return this._description; }
    _attachment;
    get attachment() { return this._attachment; }
    ;
    constructor(descriptor, depthStencilDescription = null, depthStencilAttachmentOptions = null) {
        if (undefined === descriptor.format)
            descriptor.format = "depth24plus";
        if (undefined === descriptor.sampleCount)
            descriptor.sampleCount = 1;
        super(descriptor);
        this.createGpuResource();
        //--------
        if (!depthStencilDescription) {
            depthStencilDescription = {
                depthWriteEnabled: true,
                depthCompare: "less",
                format: this.gpuResource.format
            };
        }
        this._description = { format: this.gpuResource.format, ...depthStencilDescription };
        //--------
        this._attachment = {
            view: this._view,
            depthClearValue: 1,
            depthLoadOp: 'clear',
            depthStoreOp: 'store',
        };
        if (descriptor.format === "depth24plus-stencil8") {
            this._attachment.stencilClearValue = 0;
            this._attachment.stencilLoadOp = "clear";
            this._attachment.stencilStoreOp = "store";
        }
        else if (descriptor.format === "depth32float") {
            this._isDepthTexture = true;
        }
        for (let z in depthStencilAttachmentOptions) {
            this._attachment[z] = depthStencilAttachmentOptions[z];
        }
    }
    get isDepthTexture() { return this._isDepthTexture; }
    //--------------------------------- IShaderResource ---------------------------------------------------------
    mustBeTransfered = false;
    _visibility = GPUShaderStage.FRAGMENT;
    setPipelineType(pipelineType) {
        if (pipelineType === "render")
            this._visibility = GPUShaderStage.FRAGMENT;
        else if (pipelineType === "compute_mixed")
            this._visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE;
        else if (pipelineType === "compute")
            this._visibility = GPUShaderStage.COMPUTE;
    }
    createBindGroupEntry(bindingId) {
        //console.log("view = ", this._view)
        return {
            binding: bindingId,
            resource: this._view
        };
    }
    createBindGroupLayoutEntry(bindingId) {
        return {
            binding: bindingId,
            visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX,
            texture: {
                sampleType: "depth",
            }
        };
    }
    createDeclaration(varName, bindingId, groupId) {
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_depth_2d;\n";
    }
    createGpuResource() {
        console.log("depthTexture create");
        this.create();
    }
    destroyGpuResource() {
        if (this.gpuResource) {
            console.warn("depthTexture destroy ");
            this._view = null;
            this.gpuResource.destroy();
            this.gpuResource = null;
            this.create();
        }
    }
    resize(width, height) {
        super.resize(width, height);
        this._attachment.view = this._view;
    }
    clone() {
        return new DepthStencilTexture(this.descriptor);
    }
}
