

import { VertexAttribute } from "./VertexAttribute";
import { VertexBuffer, VertexBufferDescriptor } from "./VertexBuffer";



export class VertexBufferIO {

    public buffers: VertexBuffer[] = [];
    public descriptor: any;

    constructor(attributes: any, descriptor?: any) {

        if (!descriptor) descriptor = {};
        else descriptor = { ...descriptor };

        this.descriptor = descriptor;

        if (!descriptor.stepMode) descriptor.stepMode = "instance";

        let desc = { ...descriptor };
        desc.accessMode = "read";
        desc.usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;

        this.buffers[0] = new VertexBuffer(attributes, desc);

        desc = { ...descriptor };
        desc.accessMode = "read_write";
        desc.usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST // | GPUBufferUsage.VERTEX;
        this.buffers[1] = new VertexBuffer(attributes, desc);

        this.buffers[0].io = 1;
        this.buffers[1].io = 2;

    }

    public createDeclaration(name: string, bindingId: number, groupId: number): string {
        const structName = name.substring(0, 1).toUpperCase() + name.slice(1);
        const varName = name.substring(0, 1).toLowerCase() + name.slice(1);

        let result = "";
        result += "struct " + structName + "{\n";
        let a: VertexAttribute;
        for (let i = 0; i < this.buffers[0].vertexArrays.length; i++) {
            a = this.buffers[0].vertexArrays[i];
            result += "   " + a.name + ":" + a.varType + ",\n";
        }
        result += "}\n\n";

        result += "@binding(" + bindingId + ") @group(" + groupId + ") var<storage, read> " + varName + ":array<" + structName + ">;\n";//"_Array;\n";
        result += "@binding(" + (bindingId + 1) + ") @group(" + groupId + ") var<storage, read_write> " + varName + "_out:array<" + structName + ">;\n";// + "_Array;\n";
        return result + "\n";
    }



    public update() {
        this.buffers[0].update();
        this.buffers[1].update();
    }

    public get bufferSize(): number { return this.buffers[0].buffer.size; }
}