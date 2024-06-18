import { VertexAttribute } from "../VertexAttribute";

export class Vec2Buffer extends VertexAttribute {


    constructor(datas?: number[][] | number[] | number, offset?: number) {

        if (datas != undefined && offset === undefined) {
            if (typeof datas === "number") {
                offset = datas;
                datas = undefined;
            }
        }

        //console.log("Vec2Buffer ", offset)

        super("", "float32x2", offset)
        //console.log("Vec2Buffer.dataOffset = ", this.dataOffset)
        if (typeof (datas) != "number") {
            this.datas = datas;
        }

    }


}