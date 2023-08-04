export declare abstract class BlendMode {
    color: {
        operation: "add" | "subtract" | "reverse-subtract" | "min" | "max";
        srcFactor: "zero" | "one" | "src" | "one-minus-src" | "src-alpha" | "one-minus-src-alpha" | "dst" | "one-minus-dst" | "one-minus-dst-alpha" | "src-alpha-saturated" | "constant" | "one-minus-constant";
        dstFactor: "zero" | "one" | "src" | "one-minus-src" | "src-alpha" | "one-minus-src-alpha" | "dst" | "one-minus-dst" | "one-minus-dst-alpha" | "src-alpha-saturated" | "constant" | "one-minus-constant";
    };
    alpha: {
        operation: "add" | "subtract" | "reverse-subtract" | "min" | "max";
        srcFactor: "zero" | "one" | "src" | "one-minus-src" | "src-alpha" | "one-minus-src-alpha" | "dst" | "one-minus-dst" | "one-minus-dst-alpha" | "src-alpha-saturated" | "constant" | "one-minus-constant";
        dstFactor: "zero" | "one" | "src" | "one-minus-src" | "src-alpha" | "one-minus-src-alpha" | "dst" | "one-minus-dst" | "one-minus-dst-alpha" | "src-alpha-saturated" | "constant" | "one-minus-constant";
    };
    constructor();
}
