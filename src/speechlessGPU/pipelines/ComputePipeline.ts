import { ComputeShader } from "../shader/ComputeShader";
import { ImageTextureIO } from "../shader/resources/ImageTextureIO";
import { VertexBufferIO } from "../shader/resources/VertexBufferIO";
import { Pipeline } from "./Pipeline";

export class ComputePipeline extends Pipeline {

    public computeShader: ComputeShader;


    constructor(name: string) {
        super(name)
    }




    public workgroups: number[];
    public setWorkgroups(x: number, y: number = 1, z: number = 1) {
        this.workgroups = [x, y, z];
    }

    protected dispatchWorkgroup: number[];
    public setDispatchWorkgroup(x: number = 1, y: number = 1, z: number = 1) {
        this.dispatchWorkgroup = [x, y, z];
    }

    protected cleanInputsAndInitBufferIO() {
        const _inputs = [];
        const t = this.computeShader.inputs;
        let o: any;
        let k = 0;
        for (let i = 0; i < t.length; i++) {
            o = t[i];
            if (o instanceof VertexBufferIO || o instanceof ImageTextureIO) {
                o.init(this);
                continue;
            }
            _inputs[k++] = t[i];
        }
        this.computeShader.inputs = _inputs;
        return _inputs;
    }

}