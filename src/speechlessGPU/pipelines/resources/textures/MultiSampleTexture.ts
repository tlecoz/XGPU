import { SLGPU } from "../../../SLGPU";
import { Texture, TextureDescriptor } from "./Texture";

export type MultiSampleTextureDescriptor = {
    size: GPUExtent3D,
    format?: GPUTextureFormat,
    usage?: GPUTextureUsageFlags,
    sampleCount?: GPUSize32,
    alphaToCoverageEnabled?: boolean,
    mask?: number,
    resolveTarget?: GPUTextureView
}

export class MultiSampleTexture extends Texture {

    private _description: { count: number, mask: number, alphaToCoverageEnabled: boolean };
    public get description(): { count: number, mask: number, alphaToCoverageEnabled: boolean } { return this._description }

    constructor(descriptor: {
        size: GPUExtent3D,
        format?: GPUTextureFormat,
        usage?: GPUTextureUsageFlags,
        sampleCount?: GPUSize32,
        alphaToCoverageEnabled?: boolean,
        mask?: number,
        resolveTarget?: GPUTextureView
    }) {

        if (undefined === descriptor.format) descriptor.format = SLGPU.getPreferredCanvasFormat();
        if (undefined === descriptor.usage) descriptor.usage = GPUTextureUsage.RENDER_ATTACHMENT;
        if (undefined === descriptor.sampleCount) descriptor.sampleCount = 4;
        if (undefined === descriptor.alphaToCoverageEnabled) descriptor.alphaToCoverageEnabled = false;
        if (undefined === descriptor.mask) descriptor.mask = 0xFFFFFFFF;
        if (undefined === descriptor.resolveTarget) descriptor.resolveTarget = null;

        console.log(descriptor)

        super(descriptor as TextureDescriptor);

        this._description = {
            count: descriptor.sampleCount,
            mask: descriptor.mask,
            alphaToCoverageEnabled: descriptor.alphaToCoverageEnabled
        }
    }

    public create(): void {
        super.create();
    }

    public get resolveTarget(): any { return (this.descriptor as MultiSampleTextureDescriptor).resolveTarget }



}