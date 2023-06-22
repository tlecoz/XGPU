import { RenderPipeline } from "./RenderPipeline";
import { IndexBuffer } from "./resources/IndexBuffer";

export class DrawConfig {

    public _vertexCount: number = -1;
    public get vertexCount(): number { return this._vertexCount }
    public set vertexCount(n: number) {
        console.warn("set vertexCount = ", n);
        this._vertexCount = n;
    }

    public instanceCount: number = 1;
    public firstVertexId: number = 0;
    public firstInstanceId: number = 0;
    public baseVertex: number = 0;
    public indexBuffer: IndexBuffer;

    protected pipeline: RenderPipeline;
    protected setupDrawCompleted: boolean = false;

    constructor(renderPipeline: RenderPipeline) {
        this.pipeline = renderPipeline;
    }

    public draw(renderPass: GPURenderPassEncoder) {
        if (this.indexBuffer) {
            //console.log(this.indexBuffer.nbPoint, this.instanceCount, this.firstVertexId, this.baseVertex, this.firstInstanceId)
            renderPass.setIndexBuffer(this.indexBuffer.gpuResource, this.indexBuffer.dataType, this.indexBuffer.offset, this.indexBuffer.getBufferSize())
            renderPass.drawIndexed(this.indexBuffer.nbPoint, this.instanceCount, this.firstVertexId, this.baseVertex, this.firstInstanceId);
        } else {
            console.log(this.vertexCount, this.instanceCount)
            renderPass.draw(this.vertexCount, this.instanceCount, this.firstVertexId, this.firstInstanceId);
        }
    }





}