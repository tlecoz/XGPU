import { XGPU } from "../../XGPU";

export type IndexBufferDescriptor = {
    nbPoint?: number,
    dataType?: "uint16" | "uint32",
    datas?: Uint16Array | Uint32Array,
    offset?: number
}

export class IndexBuffer {

    public gpuResource: GPUBuffer;
    public descriptor: IndexBufferDescriptor;

    private mustUpdateData: boolean = false;

    constructor(descriptor?: {
        nbPoint?: number,
        dataType?: "uint16" | "uint32",
        datas?: Uint16Array | Uint32Array,
        offset?: number
    }) {
        if (!descriptor) descriptor = { nbPoint: 3 } as any;
        if (undefined === descriptor.dataType) {
            if (descriptor.datas) {
                if (descriptor.datas instanceof Uint16Array) descriptor.dataType = "uint16";
                else descriptor.dataType = "uint32";
            } else {
                descriptor.dataType = "uint16";
            }
        }


        if (undefined === descriptor.offset) descriptor.offset = 0;
        this.descriptor = descriptor;

        if (undefined === descriptor.datas) descriptor.datas = new Uint32Array([0, 0, 0]);
        else this.datas = descriptor.datas;
    }


    public destroyGpuResource(): void {
        if (this.gpuResource) this.gpuResource.destroy();
        this.gpuResource = null;
    }
    public createGpuResource(): void {
        //console.warn("create index resource ", this.getBufferSize())
        if (this.gpuResource) this.gpuResource.destroy();
        this.gpuResource = XGPU.device.createBuffer({
            size: this.getBufferSize(),
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: false
        });
        (this.gpuResource as any).dataType = this.dataType;
        (this.gpuResource as any).nbPoint = this.nbPoint;
    }

    public getBufferSize(): number {
        let size: number = this.nbPoint * Uint16Array.BYTES_PER_ELEMENT;
        if (this.dataType === "uint32") size = this.nbPoint * Uint32Array.BYTES_PER_ELEMENT;
        /*else {
            let n = 0;
            while (n < size) n += 4;
            size = n;
        }*/
        return size;
    }

    public get dataType(): GPUIndexFormat { return this.descriptor.dataType; }

    public get nbPoint(): number { return this.descriptor.nbPoint; }
    public set nbPoint(n: number) { this.descriptor.nbPoint = n; }

    public get offset(): number { return this.descriptor.offset; }
    public set offset(n: number) { this.descriptor.offset = n; }

    private _datas: Uint32Array | Uint16Array;
    public set datas(indices: Uint32Array | Uint16Array) {
        this.mustUpdateData = true;
        this._datas = indices;
        this.createGpuResource();
        this.update();
        //new Uint16Array(this.gpuResource.getMappedRange()).set(points);
        //this.gpuResource.unmap();
    }

    public update(): void {
        if (this.mustUpdateData) {
            this.mustUpdateData = false;
            XGPU.device.queue.writeBuffer(this.gpuResource, 0, this._datas.buffer)
        }
    }

}