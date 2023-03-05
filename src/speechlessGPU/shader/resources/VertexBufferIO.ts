import { ComputePipeline } from "../../pipelines/ComputePipeline";
import { VertexBuffer, VertexBufferDescriptor } from "./VertexBuffer";

export class VertexBufferIO extends VertexBuffer {

    constructor(attributes: any, descriptor?: any) {
        super(attributes, descriptor as VertexBufferDescriptor)
    }

    public init(pipeline: ComputePipeline) {

    }
}