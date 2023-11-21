import { VertexAttribute } from "../VertexAttribute";

export class IVec4Buffer extends VertexAttribute {

    constructor(datas?: number[][] | number[] | number, offset?: number) {

        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }

        super("", "sint32x4", offset)
        if (typeof (datas) != "number") this.datas = datas;
    }
}