import { VertexAttribute } from "../VertexAttribute";

export class UVec3Buffer extends VertexAttribute {

    constructor(datas?: number[][] | number[] | number, offset?: number) {

        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }

        super("", "uint32x3", offset)
        if (typeof (datas) != "number") this.datas = datas;
    }
}