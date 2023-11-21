import { VertexAttribute } from "../VertexAttribute";

export class Vec3Buffer extends VertexAttribute {


    constructor(datas?: number[][] | number[] | number, offset?: number) {

        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }

        super("", "float32x3", offset)

        if (typeof (datas) != "number") {
            this.datas = datas;
        }

    }


}