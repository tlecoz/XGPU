import { VertexBuffer } from "../resources/VertexBuffer";
export class ShaderStruct {
    properties = [];
    isShaderIO = false;
    name;
    constructor(name, properties) {
        if (name === "Input" || name === "Output") {
            this.isShaderIO = true;
        }
        //console.log(name + " => isShaderIO = ", this.isShaderIO)
        this.name = name;
        if (properties) {
            for (let i = 0; i < properties.length; i++) {
                if (!properties[i].builtin)
                    properties[i].builtin = "";
            }
            this.properties = properties;
        }
    }
    clone(name) {
        let n = name ? name : this.name;
        return new ShaderStruct(n, [...this.properties]);
    }
    addProperty(o) {
        //console.warn("addProperty ", o)
        if (!o.builtin)
            o.builtin = "";
        this.properties.push(o);
        return this;
    }
    getComputeVariableDeclaration(offset = 0) {
        let o;
        let result = "";
        let k = 0;
        for (let i = 0; i < this.properties.length; i++) {
            o = this.properties[i];
            if (o.type.createDeclaration) { //if o.type has a type PipelineResource
                if (o.type instanceof VertexBuffer) {
                    o.type.name = o.name;
                    result += o.type.createDeclaration((offset + k++), 0, !o.isOutput);
                }
                else {
                    result += o.type.createDeclaration(offset + k++);
                    if (o.type.createStruct)
                        result += o.type.createStruct().struct;
                }
            }
        }
        return result;
    }
    getFunctionParams() {
        let result = "";
        let o;
        //console.log("getFunctionParams ", this.properties)
        for (let i = 0; i < this.properties.length; i++) {
            o = this.properties[i];
            result += o.builtin + " " + o.name + ":" + o.type;
            if (i != this.properties.length - 1)
                result += ", ";
            if (i != this.properties.length - 1)
                result += " ";
        }
        return result;
    }
    getComputeFunctionParams() {
        let result = "";
        let o;
        let k = 0;
        for (let i = 0; i < this.properties.length; i++) {
            o = this.properties[i];
            if (!o.type.createDeclaration) {
                if (k++ !== 0)
                    result += ", ";
                result += o.builtin + " " + o.name + ":" + o.type;
            }
        }
        return result;
    }
    getInputFromOutput() {
        if (this.name != "Output")
            return null;
        return new ShaderStruct("Input", this.properties.slice(1));
    }
    get struct() {
        let result = "struct " + this.name + " {\n";
        let o;
        for (let i = 0; i < this.properties.length; i++) {
            o = this.properties[i];
            if (this.isShaderIO) {
                if (i > 0)
                    o.builtin = "@location(" + (i - 1) + ")";
                //console.log(o.name + " , i = ", i, " location = ", o.builtin, " -- ", o.builtin.length)
                result += "   " + o.builtin + " " + o.name + ":" + o.type + ",\n";
            }
            else {
                if (undefined !== o.size)
                    result += "    " + "@size(" + o.size + ") @align(16) " + o.name + ":" + o.type + ",\n";
                else
                    result += "   " + " " + o.name + ":" + o.type + ",\n";
            }
        }
        result += "}\n\n";
        /*
        const varName = this.name.substring(0, 1).toLowerCase() + this.name.slice(1);
        for (let i = 0; i < this.properties.length; i++) {
            o = this.properties[i];
            if (o.obj) result += o.obj.createVariable(varName) + "\n";
        }
        */
        return result;
    }
}
