import { ImageTexture } from "./ImageTexture";
export class ImageTextureIO {
    textures = [];
    descriptor;
    constructor(descriptor) {
        let w, h;
        if (descriptor.source != null) {
            w = descriptor.source.width;
            h = descriptor.source.height;
        }
        else {
            if (!descriptor.width || !descriptor.height) {
                throw new Error("ImageTextureIO width and/or height missing in descriptor");
            }
            w = descriptor.width;
            h = descriptor.height;
        }
        this.descriptor = {
            size: [w, h],
            format: "rgba8unorm"
        };
        if (descriptor.format)
            this.descriptor.format = descriptor.format;
        this.textures[0] = new ImageTexture(this.descriptor);
        this.textures[1] = new ImageTexture(this.descriptor);
        this.textures[0].io = 1;
        this.textures[1].io = 2;
        if (descriptor.source != null)
            this.textures[0].source = descriptor.source;
    }
    clone() {
        const obj = {
            source: this.textures[0].gpuResource,
            width: this.descriptor.size[0],
            height: this.descriptor.size[1],
            format: this.descriptor.format
        };
        return new ImageTextureIO(obj);
    }
    createDeclaration(name, bindingId, groupId) {
        let result = "";
        const varName = name.substring(0, 1).toLowerCase() + name.slice(1);
        result += " @binding(" + bindingId + ") @group(" + groupId + ") var " + varName + " : texture_2d<f32>;\n";
        result += " @binding(" + (bindingId + 1) + ") @group(" + groupId + ") var " + varName + "_out" + " : texture_storage_2d<rgba8unorm, write>;\n";
        return result;
    }
    textureSize() { return this.descriptor.size; }
}
