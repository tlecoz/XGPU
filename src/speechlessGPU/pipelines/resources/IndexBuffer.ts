import { SLGPU } from "../../SLGPU";

export type IndexBufferDescriptor = {
    nbPoint: number,
    dataType?: "uint16" | "uint32",
    datas?: Uint16Array | Uint32Array

}

export class IndexBuffer {

    public gpuResource: GPUBuffer;
    public descriptor: IndexBufferDescriptor;

    constructor(descriptor: IndexBufferDescriptor) {

        if (undefined === descriptor.dataType) {
            if (descriptor.datas) {
                if (descriptor.datas instanceof Uint16Array) descriptor.dataType = "uint16";
                else descriptor.dataType = "uint32";
            } else {
                descriptor.dataType = "uint32";
            }
        }
        this.descriptor = descriptor;
    }

    public init(descriptor: IndexBufferDescriptor) {
        this.descriptor = descriptor;
        this.createGpuResource();
    }
    public destroyGpuResource(): void {
        if (this.gpuResource) this.gpuResource.destroy();
        this.gpuResource = null;
    }
    public createGpuResource(): void {
        if (this.gpuResource) this.gpuResource.destroy();
        this.gpuResource = SLGPU.device.createBuffer({
            size: this.getBufferSize(),
            usage: GPUBufferUsage.INDEX,
            mappedAtCreation: true
        });
        (this.gpuResource as any).dataType = this.dataType;
        (this.gpuResource as any).nbPoint = this.nbPoint;
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

    public get nbPoint(): number { return this.descriptor.nbPoint; }
    public get dataType(): string { return this.descriptor.dataType; }

    public setValues(points: number[]): void {
        new Uint16Array(this.gpuResource.getMappedRange()).set(points);
        this.gpuResource.unmap();
    }

}