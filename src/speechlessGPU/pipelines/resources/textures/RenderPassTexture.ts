import { Texture, TextureDescriptor } from "./Texture";

export type RenderPassTextureDescriptor = {
    size: GPUExtent3D,
    format?: GPUTextureFormat,
    usage?: GPUTextureUsageFlags,
    mipLevelCount?: GPUIntegerCoordinate,
    sampleCount?: GPUSize32,
    dimension?: GPUTextureDimension,
    viewFormats?: GPUTextureFormat[];
}

export class RenderPassTexture extends Texture {

    constructor(descriptor: RenderPassTextureDescriptor) {

        if (!descriptor.format) descriptor.format = "bgra8unorm" //WGSL.textureFormat.bit32.bgra8unorm;
        if (!descriptor.usage) descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST;
        if (!descriptor.mipLevelCount) descriptor.mipLevelCount = 1;
        if (!descriptor.sampleCount) descriptor.sampleCount = 1;
        if (!descriptor.dimension) descriptor.dimension = "2d";
        if (!descriptor.viewFormats) descriptor.viewFormats = [];

        super(descriptor as TextureDescriptor)
    }

    public get width(): number { return this.descriptor.size[0] }
    public get height(): number { return this.descriptor.size[1] }

}