import { SLGPU } from "../../SLGPU";
import { ImageTexture } from "./ImageTexture";
import { IShaderResource } from "./IShaderResource";

export type CubeMapTextureDescriptor = {
    source?: {
        front: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas,
        back: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas,
        left: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas,
        right: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas,
        top: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas,
        bottom: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas,
    },
    size: GPUExtent3D,
    usage?: GPUTextureUsageFlags,
    defaultViewDescriptor?: GPUTextureViewDescriptor
}


export class CubeMapTexture extends ImageTexture implements IShaderResource {


    declare public descriptor: any;

    protected _sides: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[] = [];

    constructor(descriptor: {
        source?: {
            front: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas,
            back: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas,
            left: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas,
            right: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas,
            top: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas,
            bottom: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas,
        },
        size: GPUExtent3D,
        usage?: GPUTextureUsageFlags,
        defaultViewDescriptor?: GPUTextureViewDescriptor
    }) {

        descriptor = { ...descriptor };

        if (undefined === descriptor.usage) descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;

        super(descriptor as any);
        if (descriptor.source) this.sides = [
            descriptor.source.front,
            descriptor.source.back,
            descriptor.source.left,
            descriptor.source.right,
            descriptor.source.top,
            descriptor.source.bottom,
        ];
        this.createGpuResource();
    }
    public set right(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) {
        this._sides[0] = bmp;
        this.mustBeTransfered = true;
    }
    public set left(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) {
        this._sides[1] = bmp;
        this.mustBeTransfered = true;
    }
    public set bottom(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) {
        this._sides[2] = bmp;
        this.mustBeTransfered = true;
    }
    public set top(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) {
        this._sides[3] = bmp;
        this.mustBeTransfered = true;
    }
    public set back(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) {
        this._sides[4] = bmp;
        this.mustBeTransfered = true;
    }
    public set front(bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas) {
        this._sides[5] = bmp;
        this.mustBeTransfered = true;
    }

    public set sides(images: (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[]) {
        for (let i = 0; i < 6; i++) this._sides[i] = images[i];
        this.mustBeTransfered = true;
        this.update();
    }
    public get sides(): (ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas)[] { return this._sides; }

    public createGpuResource(): void {
        if (this.gpuResource) this.gpuResource.destroy();
        this.gpuResource = SLGPU.device.createTexture(this.descriptor as GPUTextureDescriptor);
    }

    public update(): void {


        if (this.mustBeTransfered) {
            let bmp: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas;
            for (let i = 0; i < 6; i++) {
                bmp = this._sides[i];
                if (bmp) {
                    SLGPU.device.queue.copyExternalImageToTexture(
                        { source: bmp },
                        { texture: this.gpuResource, origin: [0, 0, i] },
                        [bmp.width, bmp.height]
                    );
                }

                this._sides[i] = null;
            }
            //if (bmp instanceof ImageBitmap) bmp.close();
            this.mustBeTransfered = false;
        }


    }

    //-----

    public createDeclaration(varName: string, bindingId: number, groupId: number = 0): string {
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_cube<f32>;\n";
    }


    public createBindGroupLayoutEntry(bindingId: number): { binding: number, visibility: number, texture: GPUTextureBindingLayout } {
        return {
            binding: bindingId,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
                sampleType: "float",
                viewDimension: "cube",
                multisampled: false
            },
        }
    }


    public createBindGroupEntry(bindingId: number): { binding: number, resource: GPUTextureView } {
        return {
            binding: bindingId,
            resource: this.gpuResource.createView({ dimension: 'cube' }),
        }
    }

    public setPipelineType(pipelineType: "compute" | "render" | "compute_mixed") {
        if (pipelineType) { }

        //use to handle particular cases in descriptor relative to the nature of pipeline
    }
}