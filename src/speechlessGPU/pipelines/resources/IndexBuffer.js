import { SLGPU } from "../../SLGPU";
export class IndexBuffer {
    gpuResource;
    descriptor;
    mustUpdateData = false;
    constructor(descriptor) {
        if (!descriptor)
            descriptor = { nbPoint: 3 };
        if (undefined === descriptor.dataType) {
            if (descriptor.datas) {
                if (descriptor.datas instanceof Uint16Array)
                    descriptor.dataType = "uint16";
                else
                    descriptor.dataType = "uint32";
            }
            else {
                descriptor.dataType = "uint16";
            }
        }
        if (undefined === descriptor.offset)
            descriptor.offset = 0;
        this.descriptor = descriptor;
        if (undefined === descriptor.datas)
            descriptor.datas = new Uint32Array([0, 0, 0]);
        else
            this.datas = descriptor.datas;
    }
    destroyGpuResource() {
        if (this.gpuResource)
            this.gpuResource.destroy();
        this.gpuResource = null;
    }
    createGpuResource() {
        //console.warn("create index resource ", this.getBufferSize())
        if (this.gpuResource)
            this.gpuResource.destroy();
        this.gpuResource = SLGPU.device.createBuffer({
            size: this.getBufferSize(),
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: false
        });
        this.gpuResource.dataType = this.dataType;
        this.gpuResource.nbPoint = this.nbPoint;
    }
    getBufferSize() {
        let size = this.nbPoint * Uint16Array.BYTES_PER_ELEMENT;
        if (this.dataType === "uint32")
            size = this.nbPoint * Uint32Array.BYTES_PER_ELEMENT;
        /*else {
            let n = 0;
            while (n < size) n += 4;
            size = n;
        }*/
        return size;
    }
    get dataType() { return this.descriptor.dataType; }
    get nbPoint() { return this.descriptor.nbPoint; }
    set nbPoint(n) { this.descriptor.nbPoint = n; }
    get offset() { return this.descriptor.offset; }
    set offset(n) { this.descriptor.offset = n; }
    _datas;
    set datas(indices) {
        this.mustUpdateData = true;
        this._datas = indices;
        this.createGpuResource();
        this.update();
        //new Uint16Array(this.gpuResource.getMappedRange()).set(points);
        //this.gpuResource.unmap();
    }
    update() {
        if (this.mustUpdateData) {
            this.mustUpdateData = false;
            SLGPU.device.queue.writeBuffer(this.gpuResource, 0, this._datas.buffer);
        }
    }
}
