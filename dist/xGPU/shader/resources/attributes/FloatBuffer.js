import { VertexAttribute } from "../VertexAttribute";
export class FloatBuffer extends VertexAttribute {
    constructor(datas, offset) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        super("", "float32", offset);
        if (typeof (datas) != "number")
            this.datas = datas;
    }
}
