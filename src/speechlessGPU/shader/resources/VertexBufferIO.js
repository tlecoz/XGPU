import { VertexBuffer } from "./VertexBuffer";
export class VertexBufferIO {
    buffers = [];
    descriptor;
    constructor(attributes, descriptor) {
        if (!descriptor)
            descriptor = {};
        else
            descriptor = { ...descriptor };
        this.descriptor = descriptor;
        if (!descriptor.stepMode)
            descriptor.stepMode = "instance";
        this.buffers[0] = new VertexBuffer(attributes, descriptor);
        this.buffers[1] = new VertexBuffer(attributes, descriptor);
        this.buffers[0].io = 1;
        this.buffers[1].io = 2;
    }
    clone() {
        return new VertexBufferIO(this.buffers[0].attributeDescriptor, this.descriptor);
    }
    createDeclaration(name, bindingId, groupId) {
        const structName = name.substring(0, 1).toUpperCase() + name.slice(1);
        const varName = name.substring(0, 1).toLowerCase() + name.slice(1);
        let result = "";
        result += "struct " + structName + "{\n";
        let a;
        for (let i = 0; i < this.buffers[0].vertexArrays.length; i++) {
            a = this.buffers[0].vertexArrays[i];
            result += "   " + a.name + ":" + a.varType + ",\n";
        }
        result += "}\n\n";
        result += "@binding(" + bindingId + ") @group(" + groupId + ") var<storage, read> " + varName + ":array<" + structName + ">;\n"; //"_Array;\n";
        result += "@binding(" + (bindingId + 1) + ") @group(" + groupId + ") var<storage, read_write> " + varName + "_out:array<" + structName + ">;\n"; // + "_Array;\n";
        return result + "\n";
    }
    set datas(v) {
        this.buffers[0].datas = v;
        this.buffers[1].datas = v;
    }
    update() {
        this.buffers[0].update();
        this.buffers[1].update();
    }
    get bufferSize() { return this.buffers[0].buffer.size; }
}
