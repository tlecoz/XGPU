import { StageableBuffer } from "./StageableBuffer";
import { VertexBuffer } from "./VertexBuffer";
export declare class VertexBufferIO extends StageableBuffer {
    buffers: VertexBuffer[];
    descriptor: any;
    protected deviceId: number;
    constructor(attributes: any, descriptor?: any);
    get input(): VertexBuffer;
    get output(): VertexBuffer;
    destroy(): void;
    private rebuildAfterDeviceLost;
    currentDatas: ArrayBuffer;
    getOutputData(): Promise<any>;
    clone(): VertexBufferIO;
    createDeclaration(name: string, bindingId: number, groupId: number): string;
    createVertexInstances(nbInstance: number, createInstance: (instanceId: number) => any): void;
    protected view: any;
    getVertexInstances(datas: Float32Array, onGetInstance: (o: any) => void): void;
    dataStructureChanged: boolean;
    nextDatas: Float32Array | Int32Array | Uint32Array;
    set datas(v: Float32Array | Int32Array | Uint32Array);
    protected attributeDesc: any;
    get attributeDescriptor(): any;
    update(): void;
    get bufferSize(): number;
    get nbVertex(): number;
}
