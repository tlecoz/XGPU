import { ImageTexture } from "../../../shader/resources/ImageTexture";
export class RenderPassTexture extends ImageTexture {
    constructor(descriptor) {
        if (!descriptor.format)
            descriptor.format = "bgra8unorm";
        if (!descriptor.usage)
            descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC;
        if (!descriptor.mipLevelCount)
            descriptor.mipLevelCount = 1;
        if (!descriptor.sampleCount)
            descriptor.sampleCount = 1;
        if (!descriptor.dimension)
            descriptor.dimension = "2d";
        if (!descriptor.viewFormats)
            descriptor.viewFormats = [];
        super(descriptor);
    }
    get width() { return this.descriptor.size[0]; }
    get height() { return this.descriptor.size[1]; }
    update() {
        //nothing here
    }
    get source() { return null; }
    set source(bmp) { if (bmp)
        return; }
}
