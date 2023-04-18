import { BlendMode } from "./BlendMode";
export class AlphaBlendMode extends BlendMode {
    constructor() {
        super();
        this.color.operation = "add";
        this.color.srcFactor = "src-alpha";
        this.color.dstFactor = "one-minus-src-alpha";
        this.alpha.operation = "add";
        this.alpha.srcFactor = "src-alpha";
        this.alpha.dstFactor = "one-minus-src-alpha";
    }
}
