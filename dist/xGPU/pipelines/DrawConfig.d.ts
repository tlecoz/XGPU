/// <reference types="dist" />
import { RenderPipeline } from "./RenderPipeline";
import { IndexBuffer } from "./resources/IndexBuffer";
export declare class DrawConfig {
    vertexCount: number;
    instanceCount: number;
    firstVertexId: number;
    firstInstanceId: number;
    baseVertex: number;
    indexBuffer: IndexBuffer;
    protected pipeline: RenderPipeline;
    protected setupDrawCompleted: boolean;
    constructor(renderPipeline: RenderPipeline);
    draw(renderPass: GPURenderPassEncoder): void;
}
