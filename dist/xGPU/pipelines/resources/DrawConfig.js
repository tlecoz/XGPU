export class DrawConfig {
    vertexCount = -1;
    instanceCount = 1;
    firstVertexId = 0;
    firstInstanceId = 0;
    baseVertex = 0;
    indexBuffer;
    pipeline;
    setupDrawCompleted = false;
    constructor(renderPipeline) {
        this.pipeline = renderPipeline;
    }
    draw(renderPass) {
        //console.log("DrawConfig.draw")
        if (this.indexBuffer) {
            //console.log(this.indexBuffer.nbPoint, this.instanceCount, this.firstVertexId, this.baseVertex, this.firstInstanceId)
            renderPass.setIndexBuffer(this.indexBuffer.gpuResource, this.indexBuffer.dataType, this.indexBuffer.offset, this.indexBuffer.getBufferSize());
            renderPass.drawIndexed(this.indexBuffer.nbPoint, this.instanceCount, this.firstVertexId, this.baseVertex, this.firstInstanceId);
        }
        else {
            renderPass.draw(this.vertexCount, this.instanceCount, this.firstVertexId, this.firstInstanceId);
        }
    }
}
