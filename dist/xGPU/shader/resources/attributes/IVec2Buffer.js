import { VertexAttribute } from "../VertexAttribute";
export class IVec2Buffer extends VertexAttribute {
    constructor(datas, offset) {
        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }
        super("", "sint32x2", offset);
        if (typeof (datas) != "number")
            this.datas = datas;
    }
}
