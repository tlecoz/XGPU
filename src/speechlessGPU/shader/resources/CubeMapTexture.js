import { SLGPU } from "../../SLGPU";
import { ImageTexture } from "./ImageTexture";
export class CubeMapTexture extends ImageTexture {
    _sides = [];
    constructor(descriptor) {
        descriptor = { ...descriptor };
        if (!descriptor.dimension)
            descriptor.dimension = "2d";
        if (undefined === descriptor.usage)
            descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;
        super(descriptor);
        if (descriptor.source)
            this.sides = descriptor.source;
    }
    clone() {
        if (!this.descriptor.source)
            this.descriptor.source = this._sides;
        return new CubeMapTexture(this.descriptor);
    }
    set right(bmp) {
        this._sides[0] = bmp;
        this.mustBeTransfered = true;
    }
    set left(bmp) {
        if (!this.descriptor.source)
            this.descriptor.source = {};
        this._sides[1] = bmp;
        this.mustBeTransfered = true;
    }
    set bottom(bmp) {
        if (!this.descriptor.source)
            this.descriptor.source = {};
        this._sides[2] = bmp;
        this.mustBeTransfered = true;
    }
    set top(bmp) {
        if (!this.descriptor.source)
            this.descriptor.source = {};
        this._sides[3] = bmp;
        this.mustBeTransfered = true;
    }
    set back(bmp) {
        if (!this.descriptor.source)
            this.descriptor.source = {};
        this._sides[4] = bmp;
        this.mustBeTransfered = true;
    }
    set front(bmp) {
        if (!this.descriptor.source)
            this.descriptor.source = {};
        this._sides[5] = bmp;
        this.mustBeTransfered = true;
    }
    set sides(images) {
        for (let i = 0; i < 6; i++)
            this._sides[i] = images[i];
        this.mustBeTransfered = true;
        this.update();
    }
    get sides() { return this._sides; }
    createGpuResource() {
        if (this.gpuResource)
            this.gpuResource.destroy();
        console.log("cubemap createtexture ", this.descriptor);
        this.gpuResource = SLGPU.device.createTexture(this.descriptor);
        this._view = this.gpuResource.createView({ dimension: 'cube' });
    }
    update() {
        if (this.mustBeTransfered) {
            if (!this.gpuResource)
                this.createGpuResource();
            let bmp;
            for (let i = 0; i < 6; i++) {
                bmp = this._sides[i];
                console.log("upload texture ", bmp);
                if (bmp) {
                    SLGPU.device.queue.copyExternalImageToTexture({ source: bmp }, { texture: this.gpuResource, origin: [0, 0, i] }, [bmp.width, bmp.height]);
                }
            }
            //if (bmp instanceof ImageBitmap) bmp.close();
            this.mustBeTransfered = false;
        }
    }
    //-----
    createDeclaration(varName, bindingId, groupId = 0) {
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_cube<f32>;\n";
    }
    createBindGroupLayoutEntry(bindingId) {
        return {
            binding: bindingId,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
                sampleType: "float",
                viewDimension: "cube",
                multisampled: false
            },
        };
    }
    createBindGroupEntry(bindingId) {
        if (!this.gpuResource)
            this.createGpuResource();
        return {
            binding: bindingId,
            resource: this._view,
        };
    }
    setPipelineType(pipelineType) {
        if (pipelineType) { }
        //use to handle particular cases in descriptor relative to the nature of pipeline
    }
}
