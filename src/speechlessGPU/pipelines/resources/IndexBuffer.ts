import { GPU } from "../../GPU";

export type IndexBufferDescriptor = {
    nbPoint: number,
    dataType: "uint16" | "uint32"
}

export class IndexBuffer {

    protected _buffer: GPUBuffer;
    protected descriptor: IndexBufferDescriptor;

    constructor(descriptor: IndexBufferDescriptor) {

        this.descriptor = descriptor;
    }

    public init(descriptor: IndexBufferDescriptor) {
        this.descriptor = descriptor;
        this.createBuffer();
    }
    public destroy(): void {
        if (this._buffer) this._buffer.destroy();
        this._buffer = null;
    }
    public createBuffer(): void {
        if (this._buffer) this._buffer.destroy();
        this._buffer = GPU.device.createBuffer({
            size: this.getBufferSize(),
            usage: GPUBufferUsage.INDEX,
            mappedAtCreation: true
        });
        (this._buffer as any).dataType = this.dataType;
        (this._buffer as any).nbPoint = this.nbPoint;
    }

    private getBufferSize(): number {
        let size: number = this.nbPoint * Uint16Array.BYTES_PER_ELEMENT;
        if (this.dataType === "uint32") size = this.nbPoint * Uint32Array.BYTES_PER_ELEMENT;
        else {
            let n = 0;
            while (n < size) n += 4;
            size = n;
        }
        return size;
    }
    public get buffer(): GPUBuffer { return this._buffer; }
    public get nbPoint(): number { return this.descriptor.nbPoint; }
    public get dataType(): string { return this.descriptor.dataType; }

    public setValues(points: number[]): void {
        new Uint16Array(this._buffer.getMappedRange()).set(points);
        this._buffer.unmap();
    }

}