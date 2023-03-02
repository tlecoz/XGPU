import { GPU } from "../../GPU";
import { GPUType } from "../../GPUType";
import { ShaderStruct } from "../shaderParts/ShaderStruct";
import { IShaderResource } from "./IShaderResource";
import { Uniform } from "./Uniform";

export type UniformBufferDescriptor = {
    items: any;
    visibility?: GPUShaderStageFlags;
}

export class UniformBuffer implements IShaderResource {

    public mustBeTransfered: boolean = false;
    public gpuResource: GPUBuffer;
    public descriptor: UniformBufferDescriptor;

    protected uniforms: Uniform[] = [];
    protected byteSize: number = 0;
    protected _nbComponent: number = 0;
    protected _data: Float32Array;
    protected _items: any = {};
    protected _itemNames: string[] = [];

    protected uniformAlignmentReady: boolean = false;

    constructor(descriptor: UniformBufferDescriptor) {
        this.descriptor = descriptor;

        let items = descriptor.items;
        let o: any, type: string;
        for (let name in items) {

            o = items[name];
            type = o.type;
            this.add(name, type, o)
        }
    }

    public add(name: string, type: string, data?: number | (Float32Array | number[])) {


        if (typeof data === "number") data = [data];
        if (data && !(data instanceof Float32Array)) data = new Float32Array(data);

        const gpuType = new GPUType(type);
        const uniform: Uniform = new Uniform(this, name, gpuType, data as Float32Array)
        this._items[name] = uniform;
        this._itemNames.push(name);
        uniform.startId = this.byteSize;
        this._nbComponent += uniform.type.nbValues;

        this.uniforms.push(uniform)
        return uniform;
    }


    private setupUniformAlignment() {
        this.uniforms = this.uniforms.sort((a: Uniform, b: Uniform) => {
            if (a.type.byteAlign > b.type.byteAlign) return 1;
            if (a.type.byteAlign < b.type.byteAlign) return -1
            return 0;
        })


        let offset = 0;
        let type: GPUType;
        let uniform: Uniform;
        for (let i = 0; i < this.uniforms.length; i++) {
            uniform = this.uniforms[i];
            type = uniform.type;
            uniform.startId = offset;

            if (type.isArray) {
                if (type.isArrayOfVectors) offset += 16 * type.arrayLength;
                else offset += 4 * type.nbValues;
            } else if (type.isMatrix) offset += type.nbValues * 4
            else offset += 16;

        }
        this.byteSize = offset;

    }


    public update(): void {


        if (!this._data) this._data = new Float32Array(new ArrayBuffer(this.byteSize))
        if (!this.gpuResource) this.createGpuResource();

        let uniform: Uniform;
        for (let i = 0; i < this.uniforms.length; i++) {
            uniform = this.uniforms[i];

            if (uniform.mustBeTransfered) {

                uniform.mustBeTransfered = false;
                GPU.device.queue.writeBuffer(
                    this.gpuResource,
                    uniform.startId,
                    uniform.data.buffer,
                    0,
                    uniform.data.byteLength
                )

            }
        }
    }

    public createStruct(uniformName: string): ShaderStruct {

        const structName = uniformName.substring(0, 1).toUpperCase() + uniformName.slice(1);
        const struct = new ShaderStruct(structName);

        let o: Uniform;
        for (let i = 0; i < this.uniforms.length; i++) {
            o = this.uniforms[i];
            struct.addProperty({ name: o.name, type: o.type.dataType, builtin: ""/* "@location(" + o.builtin + ")"*/ })
        }


        return struct;
    }

    public createDeclaration(uniformName: string, bindingId: number, groupId: number = 0): string {

        const structName = uniformName.substring(0, 1).toUpperCase() + uniformName.slice(1);
        const varName = uniformName.substring(0, 1).toLowerCase() + uniformName.slice(1);

        return "@binding(" + bindingId + ") @group(" + groupId + ") var<uniform> " + varName + ":" + structName + ";\n";
    }

    public getUniformById(id: number) { return this.uniforms[id]; }
    public getUniformByName(name: string) {
        for (let i = 0; i < this.uniforms.length; i++) {
            if (this.uniforms[i].name === name) return this.uniforms[i];
        }
        return null;
    }

    //------------------------------

    public createGpuResource(): any {

        if (!this.gpuResource) {

            if (!this.uniformAlignmentReady) {
                this.uniformAlignmentReady = true;
                this.setupUniformAlignment();
            }

            this.gpuResource = GPU.device.createBuffer({
                size: this.byteSize,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            })

            this.update();
        }
    }

    public destroyGpuResource() {
        if (this.gpuResource) this.gpuResource.destroy();
        this.gpuResource = null;
    }


    public createBindGroupLayoutEntry(bindingId: number): { binding: number, visibility: number, buffer: { type: string } } {
        return {
            binding: bindingId,
            visibility: this.descriptor.visibility,
            buffer: {
                type: "uniform",
            },
        }
    }


    public createBindGroupEntry(bindingId: number): { binding: number, resource: { buffer: GPUBuffer } } {
        if (!this.gpuResource) this.createGpuResource();
        return {
            binding: bindingId,
            resource: {
                buffer: this.gpuResource
            }
        }
    }

    public get items(): any { return this._items; }
    public get itemNames(): string[] { return this._itemNames; }
    public get nbComponent(): number { return this._nbComponent; }
    public get nbUniforms(): number { return this.uniforms.length; }

    //public get bufferType(): string { return "uniform"; }
}