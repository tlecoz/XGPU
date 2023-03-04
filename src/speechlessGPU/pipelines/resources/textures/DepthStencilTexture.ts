import { Texture } from "./Texture";

export type DepthStencilTextureDescriptor = {
    size: GPUExtent3D,
    format?: "stencil8" | "depth16unorm" | "depth24plus" | "depth24plus-stencil8" | "depth32float",
}

export class DepthStencilTexture extends Texture {

    private _description: { depthWriteEnabled: boolean, depthCompare: string, format: string };
    public get description(): { depthWriteEnabled: boolean, depthCompare: string, format: string } { return this._description; }

    private _attachment: any;
    public get attachment(): any { return this._attachment };

    constructor(descriptor: {
        size: GPUExtent3D,
        format?: "stencil8" | "depth16unorm" | "depth24plus" | "depth24plus-stencil8" | "depth32float",
    }, depthStencilDescription: { depthWriteEnabled: boolean, depthCompare: string, format: string } = null, depthStencilAttachmentOptions: any = null) {

        if (undefined === descriptor.format) descriptor.format = "depth24plus"
        super(descriptor as any)

        this.create();

        //--------
        if (!depthStencilDescription) {
            depthStencilDescription = {
                depthWriteEnabled: true,
                depthCompare: "less",
                format: this.gpuResource.format
            }
        }
        this._description = depthStencilDescription;

        //--------
        this._attachment = {
            view: this._view,
            depthClearValue: 1,
            depthLoadOp: 'clear',
            depthStoreOp: 'store',
        }
        for (let z in depthStencilAttachmentOptions) {
            this._attachment[z] = depthStencilAttachmentOptions[z];
        }


    }


}