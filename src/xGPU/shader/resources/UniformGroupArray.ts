import { UniformBuffer } from "./UniformBuffer";
import { UniformGroup } from "./UniformGroup";

export class UniformGroupArray {

    public groups: UniformGroup[];

    public startId: number = 0;
    public createVariableInsideMain: boolean = false;
    public mustBeTransfered: boolean = true;
    public name: string;

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
        this.groups = groups;
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
        return "   var " + varName + ":array<" + this.getStructName(this.name) + "," + this.length + "> = " + uniformBufferName + "." + varName + ";\n"
    }

    public update(gpuResource: GPUBuffer, fromUniformBuffer: boolean = false) {
        if (fromUniformBuffer) {
            //required to build
        }
        for (let i = 0; i < this.groups.length; i++) {
            this.groups[i].update(gpuResource, false);
        }
    }

    public getElementById(id: number): UniformGroup { return this.groups[id] };

    public get length(): number { return this.groups.length };
    public get arrayStride(): number { return this.groups[0].arrayStride * this.groups.length }
    public get isArray(): boolean { return true; }
    public get isUniformGroup(): boolean { return true; }
}