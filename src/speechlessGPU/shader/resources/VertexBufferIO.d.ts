import { VertexBuffer } from "./VertexBuffer";
export declare class VertexBufferIO {
    buffers: VertexBuffer[];
    descriptor: any;
    constructor(attributes: any, descriptor?: any);
    clone(): VertexBufferIO;
    createDeclaration(name: string, bindingId: number, groupId: number): string;
    set datas(v: Float32Array);
    update(): void;
    get bufferSize(): number;
}
