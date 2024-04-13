// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
export class UniformGroupArray {
    groups;
    startId = 0;
    createVariableInsideMain = false;
    mustBeTransfered = true;
    name;
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
        this.groups = groups;
        this.createVariableInsideMain = createLocalVariable;
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
        let group;
        for (let i = 0; i < this.groups.length; i++) {
            group = this.groups[i];
            group.copyIntoDataView(dataView, offset);
            offset += group.arrayStride;
        }
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
    update(gpuResource, fromUniformBuffer = false) {
        if (fromUniformBuffer) {
            //required to build
        }
        for (let i = 0; i < this.groups.length; i++) {
            this.groups[i].update(gpuResource, false);
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
    get arrayStride() { return this.groups[0].arrayStride * this.groups.length; }
    get isArray() { return true; }
    get isUniformGroup() { return true; }
}
