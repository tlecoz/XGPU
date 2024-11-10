// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { EventDispatcher } from "../../EventDispatcher";
import { UniformBuffer } from "./UniformBuffer";
import { UniformGroup } from "./UniformGroup";

export class UniformGroupArray extends EventDispatcher {

    public static ON_CHANGE:string = "ON_CHANGE";
    public static ON_CHANGED:string = "ON_CHANGED";


    public groups: UniformGroup[];

    public startId: number = 0;
    
    public createVariableInsideMain: boolean = false;
    public name: string;

    public mustBeTransfered:boolean = true;
    protected mustDispatchChangeEvent:boolean = false;
   

    protected buffer: UniformBuffer = null;
    public get uniformBuffer(): UniformBuffer { return this.buffer };
    public set uniformBuffer(buffer: UniformBuffer) {
        this.buffer = buffer;
        if (buffer) buffer.mustBeTransfered = true;
        for (let i = 0; i < this.groups.length; i++) {
            this.groups[i].uniformBuffer = buffer;
        }
    }

    constructor(groups: UniformGroup[], createLocalVariable: boolean = false) {
        
        super();

        this.groups = groups;


        //----- AJOUT LE 07/11/2024 --------
        let offset = 0;
        groups.forEach((g)=>{
            g.startId = offset;
            let n = g.type.nbComponent;
            g.startId = offset;
            offset += (g.arrayStride)// * 4;
            
            
            g.addEventListener(UniformGroup.ON_CHANGE,()=>{
                //console.log("on array child ON_CHANGE")
                this.mustBeTransfered = true;
                this.dispatchEvent(UniformGroupArray.ON_CHANGE)
            })
            
        })
        //----------------------------------

        this.createVariableInsideMain = createLocalVariable;
    }

    public clone(): UniformGroupArray {
        const t = [...this.groups];
        for (let i = 0; i < t.length; i++) {
            t[i] = t[i].clone();
        }

        const group = new UniformGroupArray(t, this.createVariableInsideMain);
        group.startId = this.startId;
        group.name = this.name;
        return group;
    }

    public get type(): any { return { nbComponent: this.arrayStride, isUniformGroup: true, isArray: true } }

    public copyIntoDataView(dataView: DataView, offset: number) {
        //console.log("groupArray copy into dataview")
        let group: UniformGroup;
        for (let i = 0; i < this.groups.length; i++) {
            group = this.groups[i];
            if(group.mustBeTransfered){
                group.copyIntoDataView(dataView, offset);
                //console.log("groupArray ",i,offset,new Float32Array(dataView.buffer))
                group.mustBeTransfered = false;
            }
            //
            
            offset += group.arrayStride;
        }
        this.mustBeTransfered = false;
        //console.log("====> ",Array.from(new Float32Array(dataView.buffer)))
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
        return "   var " + varName + ":array<" + this.getStructName(this.name) + "," + this.length + "> = " + this.getVarName(uniformBufferName) + "." + varName + ";\n"
    }

    

    public update(gpuResource: GPUBuffer){
        
        //console.warn("uniformGroupArray.update")
        for (let i = 0; i < this.groups.length; i++) {
            this.groups[i].update(gpuResource);
        }
        
    }

    public forceUpdate(): void {
        for (let i = 0; i < this.groups.length; i++) {
            this.groups[i].forceUpdate()
        }
    }

    public getElementById(id: number): UniformGroup { return this.groups[id] };

    public get length(): number { return this.groups.length };
    public get arrayStride(): number { 

        let stride = this.groups[0].arrayStride * this.groups.length ;
        /*
        if(stride % 4 != 0){
            stride += 4 - stride % 4;
        }
        */
        //console.log("STRIDE = ",stride);

        return stride;
    }
    public get isArray(): boolean { return true; }
    public get isUniformGroup(): boolean { return true; }
}