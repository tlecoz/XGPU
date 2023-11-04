import { RenderPipeline } from "../RenderPipeline";
import { IndexBuffer } from "./IndexBuffer";

export class DrawConfig {

    public vertexCount: number = -1;
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
        //console.log("DrawConfig.draw")
        if (this.indexBuffer) {
            //console.log(this.indexBuffer.nbPoint, this.instanceCount, this.firstVertexId, this.baseVertex, this.firstInstanceId)
            renderPass.setIndexBuffer(this.indexBuffer.gpuResource, this.indexBuffer.dataType, this.indexBuffer.offset, this.indexBuffer.getBufferSize())
            renderPass.drawIndexed(this.indexBuffer.nbPoint, this.instanceCount, this.firstVertexId, this.baseVertex, this.firstInstanceId);
        } else {
            renderPass.draw(this.vertexCount, this.instanceCount, this.firstVertexId, this.firstInstanceId);
        }
    }





}