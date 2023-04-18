import { SLGPU } from "../../SLGPU";
import { ShaderStruct } from "../shaderParts/ShaderStruct";
export class UniformBuffer {
    mustBeTransfered = false;
    gpuResource;
    descriptor;
    uniforms = [];
    byteSize = 0;
    _nbComponent = 0;
    _data;
    _items = {};
    _itemNames = [];
    uniformAlignmentReady = false;
    constructor(items, descriptor) {
        if (!descriptor)
            descriptor = {};
        else
            descriptor = { ...descriptor };
        this.descriptor = descriptor;
        for (let name in items) {
            this.add(name, items[name]);
        }
    }
    clone(propertyNames) {
        const items = [...this.items];
        if (propertyNames) {
            for (let i = 0; i < propertyNames.length; i++) {
                items[propertyNames[i]] = items[propertyNames[i]].clone();
            }
        }
        return new UniformBuffer(items, this.descriptor);
    }
    add(name, data) {
        data.uniformBuffer = this;
        data.name = name;
        if (this.descriptor.useLocalVariable)
            data.createVariableInsideMain = true;
        this._items[name] = data;
        this._itemNames.push(name);
        data.startId = this.byteSize;
        this._nbComponent += data.length;
        this.uniforms.push(data);
        return data;
    }
    setupUniformAlignment() {
        this.uniforms = this.uniforms.sort((a, b) => {
            if (a.type.byteAlign > b.type.byteAlign)
                return 1;
            if (a.type.byteAlign < b.type.byteAlign)
                return -1;
            return 0;
        });
        let offset = 0;
        let type;
        let uniform;
        let oldType = "f32";
        for (let i = 0; i < this.uniforms.length; i++) {
            uniform = this.uniforms[i];
            type = uniform.type;
            //console.log("#0 ", offset)
            if (type.dataType != oldType && offset > 0) {
                if (type.dataType === "vec2<f32>") {
                    if (offset > 8) {
                        offset += 16 - (offset % 16);
                    }
                }
                else {
                    if (offset % 16 != 0) {
                        console.log("=> ", offset, " +=  16 - ", (offset % 16));
                        offset += 16 - (offset % 16);
                    }
                }
                //console.log("======+>>>>> ", offset % 16)
            }
            oldType = type.dataType;
            uniform.startId = offset;
            //console.log(uniform.name, offset);
            if (type.isArray) {
                if (type.isArrayOfVectors)
                    offset += 16 * type.arrayLength;
                else
                    offset += 4 * type.nbValues;
            }
            else if (type.isMatrix) {
                //console.log("nbValue = ", offset, type.nbValues)
                offset += type.nbValues * 4;
                //console.log("=> ", offset)
            }
            else {
                if (type.dataType === "f32") {
                    offset += 4;
                }
                else if (type.dataType === "vec2<f32>") {
                    offset += 8;
                }
                else {
                    offset += 16;
                }
                //console.log("type = ", type, offset);
                //offset += 16;
            }
        }
        this.byteSize = offset;
        //console.log("byteSize = ", this.byteSize)
    }
    update() {
        if (!this._data)
            this._data = new Float32Array(new ArrayBuffer(this.byteSize));
        if (!this.gpuResource)
            this.createGpuResource();
        let uniform;
        for (let i = 0; i < this.uniforms.length; i++) {
            uniform = this.uniforms[i];
            uniform.update();
            if (uniform.mustBeTransfered) {
                uniform.mustBeTransfered = false;
                SLGPU.device.queue.writeBuffer(this.gpuResource, uniform.startId, uniform.buffer, 0, uniform.byteLength);
            }
        }
    }
    createStruct(uniformName) {
        const structName = uniformName.substring(0, 1).toUpperCase() + uniformName.slice(1);
        const struct = new ShaderStruct(structName);
        let o;
        for (let i = 0; i < this.uniforms.length; i++) {
            o = this.uniforms[i];
            if (o.propertyNames) {
                struct.addProperty({ name: o.name, type: o.constructor.name, builtin: "", size: o.byteLength, obj: o });
            }
            else {
                struct.addProperty({ name: o.name, type: o.type.dataType, builtin: "" });
            }
            //struct.addProperty({ name: o.name, type: o.type.dataType, builtin: "" })
        }
        return struct;
    }
    createDeclaration(uniformName, bindingId, groupId = 0) {
        const structName = uniformName.substring(0, 1).toUpperCase() + uniformName.slice(1);
        const varName = uniformName.substring(0, 1).toLowerCase() + uniformName.slice(1);
        return "@binding(" + bindingId + ") @group(" + groupId + ") var<uniform> " + varName + ":" + structName + ";\n";
    }
    getUniformById(id) { return this.uniforms[id]; }
    getUniformByName(name) {
        for (let i = 0; i < this.uniforms.length; i++) {
            if (this.uniforms[i].name === name)
                return this.uniforms[i];
        }
        return null;
    }
    //------------------------------
    createGpuResource() {
        if (!this.gpuResource) {
            if (!this.uniformAlignmentReady) {
                this.uniformAlignmentReady = true;
                this.setupUniformAlignment();
            }
            this.gpuResource = SLGPU.device.createBuffer({
                size: this.byteSize,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
            this.update();
        }
    }
    destroyGpuResource() {
        if (this.gpuResource)
            this.gpuResource.destroy();
        this.gpuResource = null;
    }
    createBindGroupLayoutEntry(bindingId) {
        return {
            binding: bindingId,
            visibility: this.descriptor.visibility,
            buffer: {
                type: "uniform",
            },
        };
    }
    createBindGroupEntry(bindingId) {
        if (!this.gpuResource)
            this.createGpuResource();
        return {
            binding: bindingId,
            resource: {
                buffer: this.gpuResource
            }
        };
    }
    get items() { return this._items; }
    get itemNames() { return this._itemNames; }
    get nbComponent() { return this._nbComponent; }
    get nbUniforms() { return this.uniforms.length; }
    //public get bufferType(): string { return "uniform"; }
    setPipelineType(pipelineType) {
        //use to handle particular cases in descriptor relative to the nature of pipeline
        if (pipelineType === "compute" || pipelineType === "compute_mixed")
            this.descriptor.visibility = GPUShaderStage.COMPUTE;
        else
            this.descriptor.visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX;
    }
}
