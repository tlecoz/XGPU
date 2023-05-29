
import { XGPU } from "../../XGPU";
import { PrimitiveFloatUniform, PrimitiveIntUniform, PrimitiveType, PrimitiveUintUniform } from "../PrimitiveType";
import { UniformBuffer } from "./UniformBuffer";
import { UniformGroupArray } from "./UniformGroupArray";

export type Uniformable = PrimitiveFloatUniform | PrimitiveIntUniform | PrimitiveUintUniform | UniformGroup | UniformGroupArray;

export class UniformGroup {


    public unstackedItems: any = {};
    public items: Uniformable[];
    public itemNames: string[] = [];
    public arrayStride: number = 0;
    public startId: number = 0;
    public createVariableInsideMain: boolean = false;
    public mustBeTransfered: boolean = true;

    protected _name: string;
    public wgsl: { struct: string, localVariables: string };

    public wgslStructNames: string[] = []; /*an uniformGroup can be used multiple times, not necessarily in an array so we must 
                                       so we must store the name we use when we build the 'struct' in order to write a 'struct' 
                                       for every properties while being sure we don't have two sames structs*/


    public datas: Float32Array;

    protected buffer: UniformBuffer = null;
    public get uniformBuffer(): UniformBuffer { return this.buffer };
    public set uniformBuffer(buffer: UniformBuffer) {
        this.buffer = buffer;
        if (buffer) {
            //console.log("buffer ==== ", buffer)
            buffer.mustBeTransfered = true;
        }
        for (let i = 0; i < this.items.length; i++) {
            (this.items[i] as any).uniformBuffer = buffer;
        }
    }

    public destroy() {
        this.unstackedItems = {};
        this.items = [];
        this.itemNames = [];
        this.arrayStride = 0;
        this.startId = 0;
        this.mustBeTransfered = true;
        this.datas = null;
        this.buffer = null;
        this.wgsl = null;
        this._name = null;
        this.uniformBuffer = null;
    }

    constructor(items: any, useLocalVariable?: boolean) {


        this.createVariableInsideMain = !!useLocalVariable;

        let o: any;
        for (let z in items) {
            o = items[z];
            if (o instanceof PrimitiveFloatUniform ||
                o instanceof PrimitiveIntUniform ||
                o instanceof PrimitiveUintUniform ||
                o instanceof UniformGroup ||
                o instanceof UniformGroupArray) {
            } else {
                throw new Error("UniformGroup accept only PrimitiveFloatUniform, PrimitiveIntUniform, PrimitiveUintUniform, UniformGroup and UniformGroupArray")
            }



            this.add(z, o, this.createVariableInsideMain, false)
        }

        this.items = this.stackItems(items);
    }


    public get name(): string { return this._name; }
    public set name(s: string) {
        this._name = this.getStructName(s);
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

        const group = new UniformGroup(items);
        group.name = this.name;

        return group;

    }

    public remove(name: string): Uniformable {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].name === name) {
                const o = this.items.splice(i, 1)[0];
                this.itemNames.splice(this.itemNames.indexOf(name), 1);

                return o
            }
        }
        return null;
    }



    public add(name: string, data: Uniformable, useLocalVariable: boolean = false, stackItems: boolean = true): Uniformable {


        data.uniformBuffer = this.uniformBuffer;
        data.name = name;
        data.mustBeTransfered = true;

        if ((this.uniformBuffer && this.uniformBuffer.descriptor.useLocalVariable) || useLocalVariable) {
            data.createVariableInsideMain = true;
        }



        const alreadyDefined: boolean = !!this.unstackedItems[name];
        this.unstackedItems[name] = data;

        if (alreadyDefined) {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].name === name) {
                    this.items[i] = data;
                    break;
                }
            }
        } else {
            this.itemNames.push(name);
        }

        if (stackItems) this.items = this.stackItems(this.unstackedItems);

        if (this.wgsl) this.wgsl = this.getStruct(this.name);

        if (this.uniformBuffer) this.uniformBuffer.mustBeTransfered = true;

        return data;
    }

    public getElementByName(name: string): Uniformable {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].name === name) {
                //console.log("=>>>>>>> ", name)
                return this.items[i];
            }
        }
        return null;
    }


    public get type(): any { return { nbComponent: this.arrayStride, isUniformGroup: true, isArray: false } }

    protected getStructName(name: string) {
        if (!name) return null;
        return name[0].toUpperCase() + name.slice(1);
    }
    protected getVarName(name: string) {
        if (!name) return null;
        return name[0].toLowerCase() + name.slice(1);
    }


    public createVariable(uniformBufferName: string): string {
        if (!this.createVariableInsideMain) return "";
        const varName: string = this.getVarName(this.name);
        return "   var " + varName + ":" + this.getStructName(this.name) + " = " + this.getVarName(uniformBufferName) + "." + varName + ";\n"
    }






    public update(gpuResource: GPUBuffer, fromUniformBuffer: boolean = false) {

        if (fromUniformBuffer === false) {

            XGPU.device.queue.writeBuffer(
                gpuResource,
                this.startId,
                this.datas.buffer,
                0,
                this.arrayStride * Float32Array.BYTES_PER_ELEMENT
            )

            return;
        }

        //console.log(this.datas);

        let item: Uniformable;
        for (let i = 0; i < this.items.length; i++) {
            item = this.items[i];
            if (!item.type.isUniformGroup) (item as any).update();

            if (item.mustBeTransfered) {

                if (item instanceof UniformGroup || item instanceof UniformGroupArray) {
                    item.update(gpuResource, false);
                } else {



                    this.datas.set(item, item.startId);
                    //console.log(item.name, item.startId * Float32Array.BYTES_PER_ELEMENT, item.byteLength, item);

                    XGPU.device.queue.writeBuffer(
                        gpuResource,
                        item.startId * Float32Array.BYTES_PER_ELEMENT,
                        item.buffer,
                        0,
                        item.byteLength
                    )
                }

                item.mustBeTransfered = false;

            }
        }

    }







    public getStruct(name: string): { struct: string, localVariables: string } {

        this.name = name;


        let struct = "struct " + this.name + " {\n";
        let item: Uniformable;
        let localVariables = "";
        let otherStructs = "";

        let primitiveStructs = "";
        let o: { struct: string, localVariables: string }

        for (let i = 0; i < this.items.length; i++) {
            item = this.items[i];

            if (item instanceof UniformGroup || item instanceof UniformGroupArray) {
                if (item instanceof UniformGroup) {
                    if (!item.wgsl) {
                        //console.log("#1 NAME = ", item.name, otherStructs)
                        o = item.getStruct(item.name);
                        localVariables += o.localVariables + "\n";
                        item.wgslStructNames.push(item.name);
                    }
                    if (otherStructs.indexOf(item.wgsl.struct) === -1) {
                        //console.log("OHTER : ", otherStructs, item.wgsl.struct)
                        otherStructs = item.wgsl.struct + otherStructs;
                    }
                    struct += "    " + this.getVarName(item.name) + ":" + item.name + ",\n"
                    localVariables += item.createVariable(this.name);
                } else {
                    name = item.name;

                    if (!(item.groups[0] as UniformGroup).wgsl) {
                        //console.log("#2 NAME = ", name)
                        o = (item.groups[0] as UniformGroup).getStruct(item.name);
                        localVariables += o.localVariables;
                    }

                    if (otherStructs.indexOf((item.groups[0] as UniformGroup).wgsl.struct) === -1) {
                        otherStructs = (item.groups[0] as UniformGroup).wgsl.struct + otherStructs;
                    }

                    struct += "    " + name + ":array<" + this.getStructName(name) + "," + item.length + ">,\n"
                    localVariables += item.createVariable(this.name);
                }



            } else {
                let o = item as PrimitiveType;


                if (o.propertyNames) {
                    let s = o.createStruct();

                    if (primitiveStructs.indexOf(s) === -1 && otherStructs.indexOf(s) === -1 && struct.indexOf(s) === -1) {
                        primitiveStructs += s + "\n";
                    }


                    struct += "     @size(16) " + o.name + ":" + o.constructor.name + ",\n";

                } else {


                    if (o.type.isArray) {

                        if (o.type.isArrayOfMatrixs) {

                            let col = o.type.matrixColumns;
                            let row = 4;
                            if (o.type.matrixRows === 2) row = 2;



                            struct += "    @size(" + (o.type.arrayLength * col * row * 4) + ") " + o.name + ":" + o.type.dataType + ",\n";
                        } else {

                            console.log("PPPPPPPPPP ", o.name, o.type.dataType)

                            struct += "    @size(" + (o.type.arrayLength * 16) + ") " + o.name + ":" + o.type.dataType + ",\n";
                        }


                    } else {
                        struct += "    " + o.name + ":" + o.type.dataType + ",\n";
                    }


                }


                if (o.createVariableInsideMain) localVariables += o.createVariable(this.getVarName(this.name));
            }
        }
        struct += "}\n\n";


        struct = primitiveStructs + otherStructs + struct;



        //console.log("struct = ", struct)
        this.wgsl = {
            struct,
            localVariables
        };
        return this.wgsl;
    }


    public stackItems(items: any): Uniformable[] {



        const result: any[] = []

        let bound = 1;

        var floats: any[] = [];
        var vec2s: any[] = [];
        var vec3s: any[] = [];


        let v: any, type: any, nbComponent;
        let offset = 0;
        let count = 0;
        for (let z in items) {


            v = items[z];
            v.name = z;
            type = v.type;


            if (v instanceof UniformGroupArray) {

                v.startId = offset;
                offset += v.arrayStride;
                result.push(v);

            } else {

                if (type.isArray) {

                    v.startId = offset;

                    if (type.isArrayOfMatrixs) {
                        offset += type.matrixRows * 4 * type.arrayLength;
                    } else {
                        offset += 4 * type.arrayLength;
                    }
                    bound = 4;
                    result.push(v);


                } else if (type.isMatrix) {
                    v.startId = offset;

                    let col = type.matrixColumns;
                    let row = 4;
                    if (type.matrixRows === 2) row = 2;
                    offset += col * row;
                    bound = row;
                    result.push(v);

                } else if (type.isUniformGroup) {

                    if (type.nbComponent >= 4) {
                        bound = 4;
                        v.startId = offset;
                        offset += Math.ceil(type.nbComponent / 4) * 4;
                        result.push(v);
                    }

                } else if ((v as PrimitiveType).propertyNames) { //if it's a customClass the extends a PrimitiveType and use a struct
                    bound = 4;
                    v.startId = offset;
                    offset += 4;
                    result.push(v);

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
            count++;
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
            //console.log(v.name, v.startId * 4)
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
            if (o instanceof UniformGroup || o instanceof UniformGroupArray) {
                if (o instanceof UniformGroup) {
                    this.datas.set(o.datas, o.startId);
                } else {
                    let start = o.startId;
                    for (let j = 0; j < o.length; j++) {
                        this.datas.set(o.groups[j].datas, start);
                        start += o.groups[j].arrayStride;
                    }
                }
            } else {
                this.datas.set(o, o.startId)
            }
        }


        return result

    }

}