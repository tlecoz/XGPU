import { EventDispatcher } from "../../EventDispatcher";
import { XGPU } from "../../XGPU";
export class StageableBuffer extends EventDispatcher {
    static ON_OUTPUT_DATA = "ON_OUTPUT_DATA";
    static ON_OUTPUT_PROCESS_START = "ON_OUTPUT_PROCESS_START";
    onOutputData = null;
    constructor() {
        super();
    }
    stagingBuffer;
    canCallMapAsync = true;
    onCanCallMapAsync = null;
    get mustOutputData() {
        return !!this.onOutputData || this.hasEventListener(StageableBuffer.ON_OUTPUT_DATA);
    }
    async getOutputData(buffer) {
        if (!this.onOutputData && !this.hasEventListener(StageableBuffer.ON_OUTPUT_DATA))
            return;
        if (!this.canCallMapAsync) {
            //console.warn("the last call of 'getOutputData' is not completed yet. You must wait 'ON_OUTPUT_DATA' to call computePipeline.nextFrame()" )
            return;
        }
        this.dispatchEvent(StageableBuffer.ON_OUTPUT_PROCESS_START);
        this.canCallMapAsync = false;
        //const buffer:GPUBuffer = this.gpuResource;
        //console.log("getOutputData ",buffer.size+" vs "+this.bufferSize);
        if (!this.stagingBuffer || buffer.size != this.stagingBuffer.size)
            this.stagingBuffer = XGPU.createStagingBuffer(buffer.size);
        const copyEncoder = XGPU.device.createCommandEncoder();
        const stage = this.stagingBuffer;
        copyEncoder.copyBufferToBuffer(buffer, 0, stage, 0, stage.size);
        XGPU.device.queue.submit([copyEncoder.finish()]);
        await this.stagingBuffer.mapAsync(GPUMapMode.READ, 0, stage.size);
        const copyArray = stage.getMappedRange(0, stage.size);
        const data = copyArray.slice(0);
        stage.unmap();
        this.canCallMapAsync = true;
        if (this.onCanCallMapAsync)
            this.onCanCallMapAsync();
        this.dispatchEvent(StageableBuffer.ON_OUTPUT_DATA, data);
        if (this.onOutputData)
            this.onOutputData(data);
    }
}