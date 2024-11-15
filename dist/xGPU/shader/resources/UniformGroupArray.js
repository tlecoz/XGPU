// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { EventDispatcher } from "../../EventDispatcher";
import { UniformGroup } from "./UniformGroup";
export class UniformGroupArray extends EventDispatcher {
    static ON_CHANGE = "ON_CHANGE";
    static ON_CHANGED = "ON_CHANGED";
    groups;
    startId = 0;
    globalStartId = 0;
    createVariableInsideMain = false;
    name;
    mustBeTransfered = true;
    mustDispatchChangeEvent = false;
    buffer = null;
    get uniformBuffer() { return this.buffer; }
    ;
    set uniformBuffer(buffer) {
        this.buffer = buffer;
        if (buffer)
            buffer.mustBeTransfered = true;
        for (let i = 0; i < this.groups.length; i++) {
            this.groups[i].uniformBuffer = buffer;
        }
    }
    constructor(groups, createLocalVariable = false) {
        super();
        this.groups = groups;
        //----- AJOUT LE 07/11/2024 --------
        let offset = 0;
        groups.forEach((g) => {
            g.startId = offset;
            g.startId = offset;
            offset += g.arrayStride;
            g.addEventListener(UniformGroup.ON_CHANGE, () => {
                this.mustBeTransfered = true;
                this.dispatchEvent(UniformGroupArray.ON_CHANGE);
            });
        });
        //----------------------------------
        this.createVariableInsideMain = createLocalVariable;
    }
    updateStartIdFromParentToChildren() {
        //used to update the startId of elements contained in an array
        //|=> by default, the startId is related to the parent, but the parent may have a parent too so we must update every startId
        for (let i = 0; i < this.groups.length; i++) {
            this.groups[i].globalStartId = this.globalStartId + this.groups[i].startId;
            this.groups[i].updateStartIdFromParentToChildren();
        }
    }
    clone() {
        const t = [...this.groups];
        for (let i = 0; i < t.length; i++) {
            t[i] = t[i].clone();
        }
        const group = new UniformGroupArray(t, this.createVariableInsideMain);
        group.startId = this.startId;
        group.name = this.name;
        return group;
    }
    get type() { return { nbComponent: this.arrayStride, isUniformGroup: true, isArray: true }; }
    copyIntoDataView(dataView, offset) {
        //console.log("groupArray copy into dataview")
        let group;
        for (let i = 0; i < this.groups.length; i++) {
            group = this.groups[i];
            if (group.mustBeTransfered) {
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
    getStructName(name) {
        if (!name)
            return null;
        return name[0].toUpperCase() + name.slice(1);
    }
    getVarName(name) {
        if (!name)
            return null;
        return name[0].toLowerCase() + name.slice(1);
    }
    createVariable(uniformBufferName) {
        if (!this.createVariableInsideMain)
            return "";
        const varName = this.getVarName(this.name);
        return "   var " + varName + ":array<" + this.getStructName(this.name) + "," + this.length + "> = " + this.getVarName(uniformBufferName) + "." + varName + ";\n";
    }
    update(gpuResource) {
        //console.warn("uniformGroupArray.update")
        for (let i = 0; i < this.groups.length; i++) {
            this.groups[i].update(gpuResource);
        }
    }
    forceUpdate() {
        for (let i = 0; i < this.groups.length; i++) {
            this.groups[i].forceUpdate();
        }
    }
    getElementById(id) { return this.groups[id]; }
    ;
    get length() { return this.groups.length; }
    ;
    get arrayStride() {
        let stride = this.groups[0].arrayStride * this.groups.length;
        /*
        if(stride % 4 != 0){
            stride += 4 - stride % 4;
        }
        */
        //console.log("STRIDE = ",stride);
        return stride;
    }
    get isArray() { return true; }
    get isUniformGroup() { return true; }
    get definition() {
        const groups = [];
        for (let i = 0; i < this.groups.length; i++) {
            groups[i] = this.groups[i].definition;
        }
        return { type: "UniformGroupArray", groups, name: this.name };
    }
}
