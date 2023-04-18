import { SLGPU } from "../../../SLGPU";
export class Texture {
    descriptor;
    gpuResource = null;
    _view = null;
    constructor(descriptor) {
        //console.log(descriptor.format + " ::: " + descriptor.usage)
        if (undefined === descriptor.usage)
            descriptor.usage = GPUTextureUsage.RENDER_ATTACHMENT;
        if (undefined === descriptor.sampleCount && descriptor.format !== "depth32float")
            descriptor.sampleCount = 1;
        this.descriptor = descriptor;
    }
    get sampleCount() { return this.descriptor.sampleCount; }
    get format() { return this.descriptor.format; }
    get size() { return this.descriptor.size; }
    get usage() { return this.descriptor.usage; }
    get view() { return this._view; }
    destroy() {
        if (this.gpuResource)
            this.gpuResource.destroy();
        this.gpuResource = null;
    }
    create() {
        if (this.gpuResource)
            this.gpuResource.destroy();
        //console.log("createTexture ", this.descriptor)
        this.gpuResource = SLGPU.device.createTexture(this.descriptor);
        this.createView();
    }
    createView() {
        this._view = this.gpuResource.createView();
        //(this._view as any).texture = this;
    }
    resize(width, height) {
        this.descriptor.size = [width, height];
        this.create();
    }
}
