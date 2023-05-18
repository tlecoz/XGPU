import { GPUType } from "../../GPUType";
import { PrimitiveFloatUniform, PrimitiveIntUniform, PrimitiveType, PrimitiveUintUniform } from "../PrimitiveType";
import { UniformBuffer } from "./UniformBuffer";

type Uniformable = PrimitiveFloatUniform | PrimitiveIntUniform | PrimitiveUintUniform | UniformGroup | UniformGroup[];

export class UniformGroup {


    protected unstackedItems: any;
    public items: Uniformable[];
    public arrayStride: number = 0;
    public startId: number = 0;
    public createVariableInsideMain: boolean = false;

    public name: string;
    public struct: string;
    public datas: Float32Array;

    protected buffer: UniformBuffer = null;
    public get uniformBuffer(): UniformBuffer { return this.buffer };
    public set uniformBuffer(buffer: UniformBuffer) {
        this.buffer = buffer;
        if (buffer) buffer.mustBeTransfered = true;
        for (let i = 0; i < this.items.length; i++) {
            (this.items[i] as any).uniformBuffer = buffer;
        }
    }


    constructor(name: string, items: any) {
        this.name = this.getStructName(name);

        let o: any;
        for (let z in items) {
            o = items[z];
            if (o instanceof PrimitiveFloatUniform ||
                o instanceof PrimitiveIntUniform ||
                o instanceof PrimitiveUintUniform ||
                o instanceof UniformGroup ||
                (o instanceof Array && o[0] instanceof UniformGroup)) {
            } else {
                throw new Error("UniformGroup accept only PrimitiveFloatUniform, PrimitiveIntUniform, PrimitiveUintUniform, UniformGroup and UniformGroup[]")
            }
        }
        this.unstackedItems = items;
        this.items = this.stackItems(items);

    }

    public clone(propertyNames?: string[]): UniformGroup {
        //if propertyNames exists, it will clone only these properties and copy the others
        //if propertyNames is undefined, it will clone every properties 

        const items = { ...this.unstackedItems };
        if (propertyNames) {
            for (let i = 0; i < propertyNames.length; i++) {
                items[propertyNames[i]] = items[propertyNames[i]].clone();
            }
        } else {
            for (let z in items) {
                items[z] = items[z].clone();
            }
        }

        return new UniformGroup(this.name, items);

    }



    public add(name: string, data: Uniformable, useLocalVariable: boolean = false) {

        const o: any = data;
        o.uniformBuffer = this.uniformBuffer;
        o.name = name;
        o.mustBeTransfered = true;

        if ((this.uniformBuffer && this.uniformBuffer.descriptor.useLocalVariable) || useLocalVariable) {
            o.createVariableInsideMain = true;
        }


        const alreadyDefined: boolean = !!this.unstackedItems[name];
        this.unstackedItems[name] = o;
        if (alreadyDefined) {
            for (let i = 0; i < this.items.length; i++) {
                if ((this.items[i] as any).name === name) {
                    this.items[i] = o;
                    break;
                }
            }
        }

        this.items = this.stackItems(this.unstackedItems);

        if (this.struct) this.struct = this.getStruct();

        if (this.uniformBuffer) this.uniformBuffer.mustBeTransfered = true;


    }




    public get type(): { nbComponent: number, isUniformGroup: boolean, isArray: boolean } { return { nbComponent: this.arrayStride, isUniformGroup: true, isArray: false } }

    protected getStructName(name: string) {
        return name[0].toUpperCase() + name.slice(1);
    }
    protected getVarName(name: string) {
        return name[0].toLowerCase() + name.slice(1);
    }

    public getStruct(): any {



        let name = this.name;
        let struct = "struct " + name + " {\n";
        let item: Uniformable;

        let otherStructs = "";

        for (let i = 0; i < this.items.length; i++) {
            item = this.items[i];
            if (item instanceof UniformGroup || item[0] instanceof UniformGroup) {
                if (item instanceof UniformGroup) {
                    if (!item.struct) {
                        otherStructs = item.getStruct() + otherStructs;
                    }
                    struct += "   " + this.getVarName(item.name) + ":" + item.name + ";\n"
                } else {
                    name = (item as any).name;
                    let sName = (item[0] as UniformGroup).name;

                    if (!(item[0] as UniformGroup).struct) {

                        otherStructs = (item[0] as UniformGroup).getStruct() + otherStructs;

                    }
                    struct += "    " + name + ":array<" + sName + "," + item.length + ">;\n"
                }
            } else {
                let o = item as PrimitiveType;
                struct += "    " + o.name + ":" + o.type.dataType + ";\n";
            }
        }
        struct += "}\n\n";

        struct = otherStructs + struct;

        this.struct = struct;
        return struct;
    }


    public stackItems(items: any): Uniformable[] {

        console.log("---------- STACK UNIFORMS ------------");

        const result: any[] = []

        let bound = 1;

        var floats: any[] = [];
        var vec2s: any[] = [];
        var vec3s: any[] = [];


        let v: any, type: any, nbComponent;
        let offset = 0;

        for (let z in items) {


            v = items[z];
            v.name = z;
            type = v.type;

            if (!type) {
                if (v[0] instanceof UniformGroup) {

                    v.startId = offset;
                    v.isArray = true;
                    v.isUniformGroup = true;
                    offset += v.length * v[0].arrayStride
                    result.push(v);

                }
            } else {

                if (type.isArray) {

                    v.startId = offset;

                    if (type.isArrayOfMatrixs) {
                        offset += type.matrixRows * 4 * type.arrayLength;
                    } else {
                        offset += 4 * type.arrayLength;
                    }

                    result.push(v);


                } else if (type.isMatrix) {
                    v.startId = offset;
                    offset += 4 * type.matrixRows;

                    result.push(v);

                } else if (type.isUniformGroup) {

                    if (type.nbComponent >= 4) {
                        v.startId = offset;
                        offset += Math.ceil(type.nbComponent / 4) * 4;
                        result.push(v);
                    }

                } else {



                    nbComponent = type.nbValues;

                    if (nbComponent === 1) floats.push(v);
                    else if (nbComponent === 2) {
                        if (bound < 2) bound = 2;
                        vec2s.push(v);
                    } else if (nbComponent === 3) {
                        bound = 4;
                        vec3s.push(v);
                    } else if (nbComponent >= 4) {
                        bound = 4;
                        v.startId = offset;
                        offset += nbComponent;
                        result.push(v);
                    }

                }

            }

        }


        //------------------------


        const addVec3 = () => {
            v = vec3s.shift();
            v.startId = offset;
            offset += 3;
            result.push(v);
            if (floats.length) {
                const f = floats.shift();
                f.startId = offset;
                result.push(f);
            }
            offset++
        }

        let nb = vec3s.length;
        for (let i = 0; i < nb; i++) addVec3();

        //--------------------------

        nb = vec2s.length;
        for (let i = 0; i < nb; i++) {
            v = vec2s.shift();
            v.startId = offset;
            offset += 2;
            result.push(v);
        }

        //--------------------------

        nb = floats.length;
        for (let i = 0; i < nb; i++) {
            v = floats.shift();
            v.startId = offset;
            offset++;
            result.push(v);
        }

        //--------------------------

        if (offset % bound !== 0) {
            offset += bound - (offset % bound);
        }

        //--------------------------

        this.arrayStride = offset;

        this.datas = new Float32Array(offset);

        let o: any;
        for (let i = 0; i < result.length; i++) {
            o = result[i];
            if (o instanceof UniformGroup || o[0] instanceof UniformGroup) {
                if (o instanceof UniformGroup) {
                    this.datas.set(o.datas, o.startId);
                } else {
                    let start = o.startId;
                    for (let j = 0; j < o.length; j++) {
                        this.datas.set(o[j].datas, start);
                        start += o[j].arrayStride;
                    }
                }
            } else {
                this.datas.set(o, o.startId)
            }
        }


        return result

    }

}