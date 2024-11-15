// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "../../XGPU";
import { Float, PrimitiveFloatUniform, PrimitiveIntUniform, PrimitiveType, PrimitiveUintUniform, Vec4Array } from "../../PrimitiveType";
import { UniformBuffer } from "./UniformBuffer";
import { UniformGroupArray } from "./UniformGroupArray";
import { GPUType } from "../../GPUType";
import { EventDispatcher } from "../../EventDispatcher";

export type Uniformable = PrimitiveFloatUniform | PrimitiveIntUniform | PrimitiveUintUniform | UniformGroup | UniformGroupArray;

export class UniformGroup extends EventDispatcher{

    public static ON_CHANGE:string = "ON_CHANGE";
    public static ON_CHANGED:string = "ON_CHANGED";

    public unstackedItems: any = {};
    public items: Uniformable[];
    public itemNames: string[] = [];
    public arrayStride: number = 0;
    public startId: number = 0;
    public globalStartId:number = 0;
    public createVariableInsideMain: boolean = false;
    
    public mustBeTransfered:boolean = true;
    protected mustDispatchChangeEvent:boolean = false;
    /*
    protected _mustBeTransfered: boolean = true;
    public get mustBeTransfered():boolean{return this._mustBeTransfered};
    public set mustBeTransfered(b:boolean){
        if(b != this._mustBeTransfered){
            console.warn(b)
            if(b) this.dispatchEvent(UniformGroup.ON_CHANGE);
            else this.dispatchEvent(UniformGroup.ON_CHANGED);
            this._mustBeTransfered = b;
        }
    }*/

    protected _name: string;
    public wgsl: { struct: string, localVariables: string };

    public wgslStructNames: string[] = []; /*an uniformGroup can be used multiple times, not necessarily in an array so we must 
                                       so we must store the name we use when we build the 'struct' in order to write a 'struct' 
                                       for every properties while being sure we don't have two sames structs*/


    public datas: ArrayBuffer;
    public dataView: DataView;

    private debug:boolean = false;
    public set(datas: ArrayBuffer) { //to follow the structure of an ArrayBuffer like other uniforms
        this.datas = datas;
        this.dataView = new DataView(datas, 0, datas.byteLength);
        this.updateItemFromDataView(this.dataView,0);
        this.mustBeTransfered = true;
    }   




    protected buffer: UniformBuffer = null;
    public get uniformBuffer(): UniformBuffer { return this.buffer };
    public set uniformBuffer(buffer: UniformBuffer) {
        this.buffer = buffer;
        if (buffer) {
            buffer.mustBeTransfered = true;
        }
        for (let i = 0; i < this.items.length; i++) {
            (this.items[i] as any).uniformBuffer = buffer;
        }
    }

    public destroy() {
        console.warn("uniformGroup.destroy")
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

    protected usedAsUniformBuffer:boolean;

    constructor(items: any, useLocalVariable?: boolean , usedAsUniformBuffer:boolean=false) {
        super();

        this.usedAsUniformBuffer = usedAsUniformBuffer;
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

        if(this.usedAsUniformBuffer == false || data instanceof UniformGroup || data instanceof UniformGroupArray || data instanceof Vec4Array){
           
            data.addEventListener("ON_CHANGE",()=>{
                this.mustBeTransfered = true;
                this.dispatchEvent("ON_CHANGE");
            })
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


    public updateStack() {

        this.items = this.stackItems(this.items);
    }

    public forceUpdate(): void {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i] instanceof UniformGroup || this.items[i] instanceof UniformGroupArray) (this.items[i] as any).forceUpdate()
            this.items[i].mustBeTransfered = true;
        }
    }






    public get type(): any {
        return {
            nbComponent: this.arrayStride,
            isUniformGroup: true,
            isArray: false
        }
    }

    public setDatas(item: PrimitiveType, dataView: DataView = null, offset: number = 0) {

        if (!dataView) dataView = this.dataView;
        const startId = item.startId + offset;
        const type: GPUType = item.type;
        const primitive: "f32" | "i32" | "u32" | "f16" = type.primitive;

        //console.log("setDatas = ",item.name,startId,type.nbValues)

        switch (primitive) {
            case "f32":
                for (let i = 0; i < type.nbValues; i++) dataView.setFloat32((startId + i) * 4, item[i], true);
                break;
            case "i32":
                for (let i = 0; i < type.nbValues; i++) dataView.setInt32((startId + i) * 4, item[i], true);
                break;
            case "u32":
                for (let i = 0; i < type.nbValues; i++) dataView.setUint32((startId + i) * 4, item[i], true);
                break;
        }
        if(this.usedAsUniformBuffer == false && item.type.isArray == false){
            item.mustBeTransfered = false;
        }
       
    }


    public updateItemFromDataView(dataView:DataView,offset:number){

        let item: Uniformable;
        
        for (let i = 0; i < this.items.length; i++) {
            item = this.items[i];
           
            if (item instanceof UniformGroup || item instanceof UniformGroupArray) {
                //console.log("call  (item as UniformGroup).copyIntoDataView");
                (item as UniformGroup).updateItemFromDataView(dataView, offset + item.startId);
            } else {

                const startId = item.startId + offset;
                const type: GPUType = item.type;
                const primitive: "f32" | "i32" | "u32" | "f16" = type.primitive;
                const nb = type.nbValues;
                if(primitive == "f32"){
                    for(let i=0;i<nb;i++) item[i] = dataView.getFloat32((startId+i)*4,true);

                }else if(primitive == "i32"){
                    for(let i=0;i<nb;i++) item[i] = dataView.getInt32((startId+i)*4,true);

                }else if(primitive == "u32"){
                    for(let i=0;i<nb;i++) item[i] = dataView.getUint32((startId+i)*4,true);
                }
                item.mustBeTransfered = true;
            }
                //console.log(item.name,this.usedAsUniformBuffer)

               
               
        }


    }

    public copyIntoDataView(dataView: DataView, offset: number) {

        let item: Uniformable;
        let mustTransfer = false;
        for (let i = 0; i < this.items.length; i++) {
            item = this.items[i];
            //console.log("UG.copyIntoDataView item = ",item.name,item.mustBeTransfered)
            if(item.mustBeTransfered){
                mustTransfer = true;
                //console.log("MBT => ",item.name)
                if (item instanceof UniformGroup || item instanceof UniformGroupArray) {
                    //console.log("call  (item as UniformGroup).copyIntoDataView");
                    (item as UniformGroup).copyIntoDataView(dataView, offset + item.startId);
                } else {
                    //console.log("call setDatas")
                    this.setDatas(item, dataView, offset)
                }
                //console.log(item.name,this.usedAsUniformBuffer)

                if(this.usedAsUniformBuffer == false){
                    item.mustBeTransfered = false;
                }
                //
            }
        }

        //console.log("CIDV ",mustTransfer,this.usedAsUniformBuffer)
        this.mustBeTransfered = mustTransfer;
        if( mustTransfer){
            this.dispatchEvent(UniformGroup.ON_CHANGE);
        }
        


        //console.log("dataView = ",new Float32Array(dataView.buffer));
    }

   
    public transfertWholeBuffer:boolean = false; 

    public async update(gpuResource: GPUBuffer){//}, fromUniformBuffer: boolean = false) {

       
        let mustBeTransfered = false;
        
        let item: Uniformable;
        for (let i = 0; i < this.items.length; i++) {
            item = this.items[i];
           
            if (!item.type.isUniformGroup) (item as any).update(); 
            else item.update(gpuResource);
            


            if ( item.mustBeTransfered) {
                //console.log("item MBT = ",item.name)
                mustBeTransfered = true;
                if (!(item instanceof UniformGroup || item instanceof UniformGroupArray )) {

                      
                        this.setDatas(item)
                        item.mustBeTransfered = false;

                        if(this.transfertWholeBuffer == false || item.type.isArray){
                            
                            if(this.transfertWholeBuffer == false){
                                XGPU.device.queue.writeBuffer(
                                    gpuResource,
                                    item.globalStartId * Float32Array.BYTES_PER_ELEMENT,
                                    //item.startId * Float32Array.BYTES_PER_ELEMENT,
                                    item.buffer,
                                    item.byteOffset,
                                    item.byteLength
                                )

                            }

                        }


                    

                    
                    
                    //item.mustBeTransfered = false;

                }else{
                    
                    item.copyIntoDataView(this.dataView,item.startId)
                    
                }

                

            }
            
        }

       
       

        if(/*this.usedAsUniformBuffer &&*/ this.transfertWholeBuffer){

           if(mustBeTransfered){
                //console.log("AAAAAAAAAAAAAAAAAA ",this.mustBeTransfered,new Float32Array(this.dataView.buffer));
                XGPU.device.queue.writeBuffer(
                    gpuResource,
                    0,
                    this.datas,
                    0,
                    this.arrayStride * 4
                )
            }
        }
       
    }





    public existingStrucName:string = undefined;

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

                    struct += "@size("+item.length * item.groups[0].arrayStride * 4 +")    " + name + ":array<" + this.getStructName(name) + "," + item.length + ">,\n"
                    localVariables += item.createVariable(this.name);
                }



            } else {
                let o = item as PrimitiveType;


                if (o.propertyNames) {
                    let s = o.createStruct();

                    if (primitiveStructs.indexOf(s) === -1 && otherStructs.indexOf(s) === -1 && struct.indexOf(s) === -1) {
                        primitiveStructs += s + "\n";
                    }
                    
                    struct += "     @size(16) " + o.name + ":" + o.className + ",\n";
                    //struct += "     @size(16) " + o.name + ":" + o.constructor.name + ",\n";

                } else {


                    if (o.type.isArray) {

                        if (o.type.isArrayOfMatrixs) {

                            let col = o.type.matrixColumns;
                            let row = 4;
                            if (o.type.matrixRows === 2) row = 2;

                            struct += "    @size(" + (o.type.arrayLength * col * row * 4) + ") " + o.name + ":" + o.type.dataType + ",\n";
                        } else {

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




        this.wgsl = {
            struct,
            localVariables
        };

        
        return this.wgsl;
    }




    public stackItems(items: any): Uniformable[] {

        //console.warn("stackItems")
        //console.time("STACK ITEMS")


        //----- we sort the items by arraystride to start with bigger values / complex structure ----
        /*
        let itemList = [];
        let item:any;
        let uniformGroupArrays = [];
        let uniformGroups = [];
        let vecArrays = [];
        let matrixArrays = [];
        let matrixs = [];
        let primitives = [];

        for(let z in items){
            item = items[z];
            item.name = z;
            if(item instanceof UniformGroupArray) uniformGroupArrays.push(item);
            else if(item instanceof UniformGroup) uniformGroups.push(item);
            else if(item.type.isArrayOfMatrixs) matrixArrays.push(item);
            else if(item.type.isArray) vecArrays.push(item);
            else if(item.type.isMatrix) matrixs.push(item);
            else primitives.push(item);
        } 

        const sortGroup = (a,b)=>{
            if(a.arrayStride > b.arrayStride) return -1;
            if(a.arrayStride < b.arrayStride) return 1;
            return 0;
        }

        uniformGroupArrays = uniformGroupArrays.sort(sortGroup);
        uniformGroups = uniformGroups.sort(sortGroup);

        const sortArray = (a,b)=>{
            const lenA = a.type.isArrayOfMatrixs ? a.type.matrixRows * 4 * a.type.arrayLength : a.type.arrayLength * 4;
            const lenB = b.type.isArrayOfMatrixs ? b.type.matrixRows * 4 * b.type.arrayLength : b.type.arrayLength * 4;

            if(lenA > lenB) return -1;
            if(lenA < lenB) return 1;
            return 0;
        }

        vecArrays = vecArrays.sort(sortArray);
        matrixArrays = matrixArrays.sort(sortArray);

        
        primitives = primitives.sort((a,b)=>{
            if(a.type.nbComponent > b.type.nbComponent) return -1;
            if(a.type.nbComponent < b.type.nbComponent) return 1;
            return 0;
        })


        itemList = uniformGroupArrays.concat(uniformGroups);
        itemList = itemList.concat(matrixArrays);
        itemList = itemList.concat(vecArrays);
        itemList = itemList.concat(matrixs);
        itemList = itemList.concat(primitives);
        */











        const result: any[] = []

        let bound = 1;

        var floats: any[] = [];
        var vec2s: any[] = [];
        var vec3s: any[] = [];


        let v: any, type: any, nbComponent;
        let offset = 0;



        //for(let i=0;i<itemList.length;i++){
        for (let z in items) {

            //v = itemList[i];
            v = items[z];
            v.name = z;
            type = v.type;







            if (v instanceof UniformGroupArray) {

                v.startId = offset;
                offset += v.arrayStride;
                //console.log(v.name+" =======>>>> ",v.arrayStride)
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

        //console.log("floats.length = ",nb)
        for (let i = 0; i < nb; i++) {
            v = floats.shift();
            v.startId = offset;
            //console.log("v = ",v)
            //console.log(v.name, v.startId * 4)
            offset++;
            result.push(v);
        }

        //--------------------------
        

        //BEFORE 07/11/2024:
        if (offset % bound !== 0) {
            offset += bound - (offset % bound);
        }
        
       //console.log("offset ",offset)
        //----AJOUT LE 07/11/2024------
        if(offset % 4 != 0){
            const n = 4 - offset % 4;

           if(!this.usedAsUniformBuffer){
                for(let i=0;i<n;i++){
                    const float = new Float(0);
                    float.startId = offset;
                    float.name = "padding_"+i;
                    result.push(float)
                    this.itemNames.push(float.name)
                }
           }
            
            offset += n;
        }
       
        //--------------------------
        

        //console.log("uniformGroup ",result,offset,bound);
        this.arrayStride = offset ;





        this.datas = new ArrayBuffer(offset * 4);

        

        this.dataView = new DataView(this.datas, 0, this.datas.byteLength);
        this.items = result;
        this.copyIntoDataView(this.dataView, 0);

        //console.timeEnd("STACK ITEMS")
        return result

    }

    

    public updateStartIdFromParentToChildren(){
        //used to update the startId of elements contained in an array
        //|=> by default, the startId is related to the parent, but the parent may have a parent too so we must update every startId
        
        let item:Uniformable;
        for(let i=0;i<this.items.length;i++){
            item = this.items[i];
            item.globalStartId = this.globalStartId + item.startId;
            if(item instanceof UniformGroup || item instanceof UniformGroupArray || item.type.isArray){
                item.updateStartIdFromParentToChildren();
            }
        }
    }

    public get definition():{type:string,values:ArrayBuffer,items:any,name:string}{

        const items = {};
        for(let i=0;i<this.items.length;i++){
            items[this.itemNames[i]] = this.items[i].definition;
        }

        return {type:"UniformGroup",values:this.datas,items,name:this.name}
    }

    /*
    protected createTypedArrayBuffer(result: any) {

        let datas: Float32Array | Int32Array | Uint32Array;
        if (this.primitiveType === "f32") datas = new Float32Array(this.arrayStride);
        else if (this.primitiveType === "i32") datas = new Int32Array(this.arrayStride);
        else if (this.primitiveType === "u32") datas = new Uint32Array(this.arrayStride);

        //console.log("uniform type = ", this._primitiveType)

        let o: any;
        for (let i = 0; i < result.length; i++) {
            o = result[i];
            if (o instanceof UniformGroup || o instanceof UniformGroupArray) {
                if (o instanceof UniformGroup) {
                    datas.set(o.datas as Float32Array | Int32Array | Uint32Array, o.startId);
                } else {
                    let start = o.startId;
                    for (let j = 0; j < o.length; j++) {
                        datas.set(o.groups[j].datas as Float32Array | Int32Array | Uint32Array, start);
                        start += o.groups[j].arrayStride;
                    }
                }
            } else {
                datas.set(o, o.startId)
            }
        }

        this.datas = datas;

    }
    */
}