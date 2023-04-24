export abstract class BlendMode {

    public color: {
        operation: "add" | "subtract" | "reverse-subtract" | "min" | "max",
        srcFactor: "zero" | "one" | "src" | "one-minus-src" | "src-alpha" | "one-minus-src-alpha" | "dst" | "one-minus-dst" | "one-minus-dst-alpha" | "src-alpha-saturated" | "constant" | "one-minus-constant",
        dstFactor: "zero" | "one" | "src" | "one-minus-src" | "src-alpha" | "one-minus-src-alpha" | "dst" | "one-minus-dst" | "one-minus-dst-alpha" | "src-alpha-saturated" | "constant" | "one-minus-constant",
    } = { operation: "add", srcFactor: "one", dstFactor: "zero" }

    public alpha: {
        operation: "add" | "subtract" | "reverse-subtract" | "min" | "max",
        srcFactor: "zero" | "one" | "src" | "one-minus-src" | "src-alpha" | "one-minus-src-alpha" | "dst" | "one-minus-dst" | "one-minus-dst-alpha" | "src-alpha-saturated" | "constant" | "one-minus-constant",
        dstFactor: "zero" | "one" | "src" | "one-minus-src" | "src-alpha" | "one-minus-src-alpha" | "dst" | "one-minus-dst" | "one-minus-dst-alpha" | "src-alpha-saturated" | "constant" | "one-minus-constant",
    } = { operation: "add", srcFactor: "one", dstFactor: "zero" }

    constructor() {

    }
}