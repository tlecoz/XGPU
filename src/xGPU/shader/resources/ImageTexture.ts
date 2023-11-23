// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { EventDispatcher } from "../../EventDispatcher";
import { XGPU } from "../../XGPU";
import { Pipeline } from "../../pipelines/Pipeline";
import { RenderPassTexture } from "../../pipelines/resources/textures/RenderPassTexture";
import { IShaderResource } from "./IShaderResource";
import { ImageTextureIO } from "./ImageTextureIO";

export type ImageTextureDescriptor = {
    source?: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture | RenderPassTexture
    size?: GPUExtent3D,
    usage?: GPUTextureUsageFlags,
    format?: GPUTextureFormat,
    defaultViewDescriptor?: GPUTextureViewDescriptor,
    sampledType?: "f32" | "i32" | "u32",
    label?: string,
}


export class ImageTexture extends EventDispatcher implements IShaderResource {

    public resourceIO: ImageTextureIO;
    public io: number = 0;
    public mustBeTransfered: boolean = false;
    public descriptor: ImageTextureDescriptor
    public gpuResource: GPUTexture;


    protected _view: GPUTextureView;
    protected viewDescriptor: GPUTextureViewDescriptor = undefined;
    protected useOutsideTexture: boolean = false;

    protected renderPassTexture: RenderPassTexture;

    constructor(descriptor: {
        source?: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture | RenderPassTexture
        size?: GPUExtent3D,
        usage?: GPUTextureUsageFlags,
        format?: GPUTextureFormat,
        defaultViewDescriptor?: GPUTextureViewDescriptor,
        sampledType?: "f32" | "i32" | "u32",
        label?: string,
    }) {

        super();
        descriptor = { ...descriptor };
        this.descriptor = descriptor as any;

        //console.warn("imageTExture descriptor = ", descriptor);
        if (undefined === descriptor.sampledType) descriptor.sampledType = "f32";
        if (undefined === descriptor.usage) descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT;
        if (undefined === descriptor.format) descriptor.format = "rgba8unorm";
        if (undefined === descriptor.label) descriptor.label = "ImageTexture";
        if (undefined === descriptor.size) {
            if (descriptor.source) {

                descriptor.size = [descriptor.source.width, descriptor.source.height];



                if (descriptor.source instanceof GPUTexture) {
                    this.initFromTexture(descriptor.source);
                } else if (descriptor.source instanceof ImageTexture && descriptor.source.isRenderPass) {
                    //I canoot use instanceof in the constructor of ImageTexture with a class that extends it.
                    //but I wanted to write 'if (descriptor.source instanceof RenderPassTexture){' 

                    this.renderPassTexture = descriptor.source;
                    console.log("wait resource changed")
                    this.renderPassTexture.addEventListener("RESOURCE_CHANGED", () => {
                        console.log("ON_RESOURCE_CHANGED")
                        this.initFromTexture(this.renderPassTexture.texture)
                    });
                    this.initFromTexture(descriptor.source.texture)
                }

            }
            else descriptor.size = [1, 1];
        }



        if (descriptor.source) this.mustBeTransfered = true;


        //this.createGpuResource()
    }


    private initFromTexture(tex: GPUTexture) {
        this.gpuResource = tex;
        this.descriptor.format = tex.format;
        this.descriptor.usage = tex.usage;
        this._view = this.gpuResource.createView();
        this.descriptor.source = undefined;
        this.useOutsideTexture = true;
    }


    public clone(): ImageTexture {
        return new ImageTexture(this.descriptor);
    }

    public get sampledType(): "f32" | "i32" | "u32" { return this.descriptor.sampledType }
    public set sampledType(type: "f32" | "i32" | "u32") { this.descriptor.sampledType = type; }
    public get isRenderPass(): boolean { return false; }


    protected gpuTextureIOs: GPUTexture[];
    protected gpuTextureIO_index: number = 1;
    public initTextureIO(textures: GPUTexture[]) {
        this.gpuTextureIOs = textures;
    }

    public get texture(): GPUTexture {

        //if (this.gpuTextureIOs) return this.gpuTextureIOs[this.gpuTextureIO_index++ % 2]
        return this.gpuResource;
    }

    public getCurrentTexture(): GPUTexture {
        //if (this.gpuTextureIOs) return this.gpuTextureIOs[(this.gpuTextureIO_index + 1) % 2]
        return this.gpuResource;
    }




    public createView(viewDescriptor?: GPUTextureViewDescriptor): GPUTextureView {
        if (this.useOutsideTexture) return null;
        let desc: GPUTextureViewDescriptor = this.viewDescriptor;
        if (viewDescriptor) desc = viewDescriptor;
        return this.gpuResource.createView(desc);
    }



    public resize(w: number, h: number): ImageTexture {
        if (this.useOutsideTexture) return null;
        this.descriptor.size = [w, h];
        this.createGpuResource()
        return this;
    }

    public get view(): GPUTextureView {
        //console.log("aaa")
        if (!this._view) this.createGpuResource();
        return this._view;

    }



    public get source(): ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture | RenderPassTexture { return this.descriptor.source }
    public set source(bmp: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture | RenderPassTexture) {
        this.useOutsideTexture = bmp instanceof GPUTexture || (bmp instanceof ImageTexture && bmp.isRenderPass);

        //console.warn("SOURCE ==============================================   source = ", bmp)

        if (this.useOutsideTexture) {
            if (bmp instanceof GPUTexture) {
                this.gpuResource = bmp as GPUTexture;
                this._view = this.gpuResource.createView();
            } else {
                this.renderPassTexture = bmp as any;
                this.renderPassTexture.clearEvents("RESOURCE_CHANGED");
                this.renderPassTexture.addEventListener("RESOURCE_CHANGED", () => {
                    console.log("ON_RESOURCE_CHANGED")
                    this.initFromTexture(this.renderPassTexture.texture)
                });



                this.gpuResource = (bmp as ImageTexture).texture;
                this._view = this.gpuResource.createView();
            }


        } else this.mustBeTransfered = true;
        this.descriptor.source = bmp;


    }

    public update(pipeline: Pipeline): void {



        if (this.renderPassTexture && !this.renderPassTexture.mustUseCopyTextureToTexture) this.renderPassTexture.applyRenderPass(pipeline);
        if (this.useOutsideTexture) return;

        if (!this.gpuResource) this.createGpuResource()



        if (this.descriptor.source) {
            if (this.descriptor.source.width !== this.gpuResource.width || this.descriptor.source.height !== this.gpuResource.height) {
                //console.log("source = ", this.descriptor.source)
                this.descriptor.size = [this.descriptor.source.width, this.descriptor.source.height]
                this.createGpuResource();
                this.mustBeTransfered = true;
            }
        }



        if (this.mustBeTransfered) {
            this.mustBeTransfered = false;
            //console.log("updateTexture")
            XGPU.device.queue.copyExternalImageToTexture(
                { source: this.descriptor.source as any, flipY: true },
                { texture: this.gpuResource },
                this.descriptor.size
            );


        }

    }

    public deviceId: number;

    public createGpuResource(): void {
        //console.warn("imageTexture.createGpuResource ", this.deviceId, XGPU.deviceId, this.useOutsideTexture, this.descriptor.source)

        if (this.useOutsideTexture && this.gpuResource) {
            if (this.deviceId != XGPU.deviceId) {
                const o = (this.gpuResource as any).xgpuObject;
                if (o) {
                    o.createGpuResource();
                    //console.log("o = ", o)
                    this.gpuResource = o.gpuResource;
                    this._view = o.view;
                }

            }
        }




        this.deviceId = XGPU.deviceId;
        if (this.useOutsideTexture || this.gpuTextureIOs) return;

        if (this.gpuResource) {
            (this.gpuResource as any).xgpuObject = null;
            this.gpuResource.destroy();
        }



        this.gpuResource = XGPU.device.createTexture(this.descriptor as GPUTextureDescriptor);
        (this.gpuResource as any).xgpuObject = this;

        this._view = this.gpuResource.createView();
        if (this.descriptor.source) this.mustBeTransfered = true;


    }


    public time: number;
    public destroyGpuResource() {

        if (this.time && new Date().getTime() - this.time < 100 && XGPU.loseDeviceRecently) {
            //this.createGpuResource()
            return;
        }
        this.time = new Date().getTime();


        if (this.io && XGPU.loseDeviceRecently) {

            if (this.io === 1) {
                const vbio = this.resourceIO;
                const vbs = vbio.textures;

                let temp = vbs[0].gpuTextureIOs;
                vbs[0].gpuTextureIOs = null;
                vbs[0].createGpuResource();
                vbs[0].gpuTextureIOs = temp;

                temp = vbs[1].gpuTextureIOs;
                vbs[1].gpuTextureIOs = null;
                vbs[1].createGpuResource();
                vbs[1].gpuTextureIOs = temp;

                vbs[0].gpuTextureIOs[0] = vbs[0].gpuResource;
                vbs[0].gpuTextureIOs[1] = vbs[1].gpuResource;


            }
            return

        }




        if (this.resourceIO) this.resourceIO.destroy();
        if (this.useOutsideTexture || this.gpuTextureIOs) return;

        if (this.gpuResource) {
            (this.gpuResource as any).xgpuObject = null;
            this.gpuResource.destroy();
        }
        this._view = null;
        this.gpuResource = null;
        this.resourceIO = null;
    }

    public createDeclaration(varName: string, bindingId: number, groupId: number = 0): string {

        if (this.io != 2) return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_2d<" + this.sampledType + ">;\n";

        return " @binding(" + (bindingId) + ") @group(" + groupId + ") var " + varName + " : texture_storage_2d<rgba8unorm, write>;\n";
    }

    protected _textureType: { texture: any } | { storageTexture: any };
    public get textureType(): any { return this._textureType }
    public set textureType(o: any) {
        //console.log("set textureType ", o)
        this._textureType = o;
    }
    public createBindGroupLayoutEntry(bindingId: number): { binding: number, visibility: number, storageTexture?: GPUStorageTextureBindingLayout, texture?: GPUTextureBindingLayout } {

        let sampleType: GPUTextureSampleType = "float";
        if (this.sampledType === "i32") sampleType = "sint";
        else if (this.sampledType === "u32") sampleType = "uint";

        //console.warn("createBindGroupLayoutEntry ", this.io)


        if (this.io != 2) return {
            binding: bindingId,
            visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
            ...this.textureType,
            texture: {
                sampleType,
                viewDimension: "2d",
                multisampled: false
            },

        }

        return {
            binding: bindingId,
            visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,

            storageTexture: {
                access: "write-only",
                format: "rgba8unorm"
            },
        }
    }


    public createBindGroupEntry(bindingId: number): { binding: number, resource: GPUTextureView } {
        if (!this.gpuResource || this.deviceId != XGPU.deviceId) this.createGpuResource();

        //console.log("ImageTexture.createBindgroupEntry ", this.deviceId)

        return {
            binding: bindingId,
            resource: this._view
        }
    }

    public setPipelineType(pipelineType: "compute" | "render" | "compute_mixed") {

        //use to handle particular cases in descriptor relative to the nature of pipeline

        if (pipelineType === "render") {

            this.descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT;

        } else if (pipelineType === "compute_mixed") { //the image is processed from a ComputePipeline and use inside a RenderPipeline

            if (this.io === 1) { //read buffer
                this.descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST;

            } else if (this.io === 2) { //write buffer
                this.descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.STORAGE_BINDING;
            }

        } else if (pipelineType === "compute") {

            if (this.io !== 0) {
                this.descriptor.usage = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING;
            }
        }
    }

}