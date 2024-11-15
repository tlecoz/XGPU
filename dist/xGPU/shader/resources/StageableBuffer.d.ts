/// <reference types="dist" />
import { EventDispatcher } from "../../EventDispatcher";
export declare class StageableBuffer extends EventDispatcher {
    static ON_OUTPUT_DATA: string;
    static ON_OUTPUT_PROCESS_START: string;
    onOutputData: ((data: ArrayBuffer) => void) | null;
    constructor();
    protected stagingBuffer: GPUBuffer;
    protected canCallMapAsync: boolean;
    onCanCallMapAsync: (() => void) | null;
    get mustOutputData(): boolean;
    getOutputData(buffer: GPUBuffer): Promise<void>;
}
