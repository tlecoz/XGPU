import { SLGPU } from "../../../SLGPU";
import { Texture } from "./Texture";
export class MultiSampleTexture extends Texture {
    _description;
    get description() { return this._description; }
    constructor(descriptor) {
        if (undefined === descriptor.format)
            descriptor.format = SLGPU.getPreferredCanvasFormat();
        if (undefined === descriptor.usage)
            descriptor.usage = GPUTextureUsage.RENDER_ATTACHMENT;
        if (undefined === descriptor.sampleCount)
            descriptor.sampleCount = 4;
        if (undefined === descriptor.alphaToCoverageEnabled)
            descriptor.alphaToCoverageEnabled = false;
        if (undefined === descriptor.mask)
            descriptor.mask = 0xFFFFFFFF;
        if (undefined === descriptor.resolveTarget)
            descriptor.resolveTarget = null;
        console.log(descriptor);
        super(descriptor);
        this._description = {
            count: descriptor.sampleCount,
            mask: descriptor.mask,
            alphaToCoverageEnabled: descriptor.alphaToCoverageEnabled
        };
    }
    create() {
        super.create();
    }
    get resolveTarget() { return this.descriptor.resolveTarget; }
}
