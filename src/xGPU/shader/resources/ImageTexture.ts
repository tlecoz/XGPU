
import { XGPU } from "../../XGPU";
import { IShaderResource } from "./IShaderResource";

export type ImageTextureDescriptor = {
    source?: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture
    size?: GPUExtent3D,
    usage?: GPUTextureUsageFlags,
    format?: GPUTextureFormat,
    defaultViewDescriptor?: GPUTextureViewDescriptor
}


export class ImageTexture implements IShaderResource {

    public io: number = 0;
    public mustBeTransfered: boolean = false;
    public descriptor: ImageTextureDescriptor
    public gpuResource: GPUTexture;


    protected _view: GPUTextureView;
    protected viewDescriptor: GPUTextureViewDescriptor = undefined;
    protected useOutsideTexture: boolean = false;

    constructor(descriptor: {
        source?: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture
        size?: GPUExtent3D,
        usage?: GPUTextureUsageFlags,
        format?: GPUTextureFormat,
        defaultViewDescriptor?: GPUTextureViewDescriptor
    }) {

        descriptor = { ...descriptor };

        if (undefined === descriptor.usage) descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;
        if (undefined === descriptor.format) descriptor.format = "rgba8unorm";
        if (undefined === descriptor.size) {
            if (descriptor.source) {

                descriptor.size = [descriptor.source.width, descriptor.source.height];

                if (descriptor.source instanceof GPUTexture) {
                    this.gpuResource = descriptor.source;
                    this._view = this.gpuResource.createView();
                    descriptor.source = undefined;
                    this.useOutsideTexture = true;
                }

            }
            else descriptor.size = [1, 1];
        }



        if (descriptor.source) this.mustBeTransfered = true;

        this.descriptor = descriptor as any;
        //this.createGpuResource()
    }


    public clone(): ImageTexture {
        return new ImageTexture(this.descriptor);
    }



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
        return this._view;

    }

    public get source(): ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture { return this.descriptor.source }
    public set source(bmp: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture) {
        this.useOutsideTexture = bmp instanceof GPUTexture;
        this.descriptor.source = bmp;
        this.mustBeTransfered = true;
    }

    public update(): void {
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
            XGPU.device.queue.copyExternalImageToTexture(
                { source: this.descriptor.source as any, flipY: true },
                { texture: this.gpuResource },
                this.descriptor.size
            );
        }

    }


    public createGpuResource(): void {
        if (this.useOutsideTexture || this.gpuTextureIOs) return;
        if (this.gpuResource) this.gpuResource.destroy();
        //console.warn("ImageTexture.createGPUResource descriptor = ", this.descriptor)
        this.gpuResource = XGPU.device.createTexture(this.descriptor as GPUTextureDescriptor)
        this._view = this.gpuResource.createView();

    }

    public destroyGpuResource() {
        if (this.useOutsideTexture || this.gpuTextureIOs) return;
        if (this.gpuResource) this.gpuResource.destroy();
        this.gpuResource = null;
    }

    public createDeclaration(varName: string, bindingId: number, groupId: number = 0): string {

        if (this.io != 2) return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_2d<f32>;\n";

        return " @binding(" + (bindingId) + ") @group(" + groupId + ") var " + varName + " : texture_storage_2d<rgba8unorm, write>;\n";
    }


    public createBindGroupLayoutEntry(bindingId: number): { binding: number, visibility: number, storageTexture?: GPUStorageTextureBindingLayout, texture?: GPUTextureBindingLayout } {

        if (this.io != 2) return {
            binding: bindingId,
            visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
            texture: {
                sampleType: "float",
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
        if (!this.gpuResource) this.createGpuResource();
        return {
            binding: bindingId,
            resource: this._view
        }
    }

    public setPipelineType(pipelineType: "compute" | "render" | "compute_mixed") {

        //use to handle particular cases in descriptor relative to the nature of pipeline

        if (pipelineType === "compute_mixed") {


            if (this.io === 1) {
                this.descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT;

            } else if (this.io === 2) {
                this.descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.STORAGE_BINDING;

            }

        } else if (pipelineType === "compute") {


            if (this.io !== 0) {
                this.descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.STORAGE_BINDING;
            }
        }
    }

}