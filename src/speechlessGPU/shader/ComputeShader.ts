
import { ComputePipeline } from "../pipelines/ComputePipeline";
import { UniformBuffer } from "./resources/UniformBuffer";
import { VertexBuffer } from "./resources/VertexBuffer";
import { ShaderStage } from "./shaderParts/ShaderStage";
import { ShaderStruct } from "./shaderParts/ShaderStruct";


export class ComputeShader extends ShaderStage {



    constructor() {
        super("compute");

    }

    public build(shaderPipeline: ComputePipeline, inputs: ShaderStruct): { code: string, output: ShaderStruct } {
        if (this._shaderInfos) return this._shaderInfos;



        let result = this.code.value + "\n\n";
        const obj = shaderPipeline.bindGroups.getComputeShaderDeclaration();
        result += obj.result;

        console.log("-------- COMPUTE -----------");
        //console.log(result)

        for (let i = 0; i < this.inputs.length; i++) {
            inputs.addProperty(this.inputs[i]);
        }


        const output: ShaderStruct = new ShaderStruct("Output", this.outputs);
        result += output.struct + "\n"



        //------

        const w = shaderPipeline.workgroups;

        result += "@compute @workgroup_size(" + w[0] + "," + w[1] + "," + w[2] + ")\n";
        result += "fn main(" + inputs.getFunctionParams() + ") -> " + output.name + "{\n";
        result += obj.variables + "\n";
        result += "   var output:Output;\n";
        result += this.main.value;
        result += "   return output;\n"
        result += "}\n";

        console.log(result)
        this._shaderInfos = { code: result, output: output };
        return this._shaderInfos;

        /*
        let result = "";
        result += this.code.value + "\n\n";

        let bindingId = 0;
        let uniform: UniformBuffer;
        const nbUniform = shaderPipeline.uniformBufferIds.length;
        for (let i = 0; i < uniform.items.length; i++) {
            uniform = uniform.items[uniform.itemNames[i]];//this.gpu.getUniformBufferById(shaderPipeline.uniformBufferIds[i]);
            result += uniform.createStruct(uniform.itemNames[i]).struct + "\n";
            result += uniform.createDeclaration(bindingId++) + "\n";
        }

        let vertexBuffer:VertexBuffer;
        const groupId = 0;
        let nbVertexBuffer = shaderPipeline.vertexBufferIds.length;
        for (let i = 0; i < nbVertexBuffer; i++) {
            vertexBuffer = this.gpu.getVertexBufferById(shaderPipeline.vertexBufferIds[i]);
            if (vertexBuffer.io) continue;
            result += vertexBuffer.createDeclaration(bindingId++, groupId, vertexBuffer.accessMode === "read") + "\n";
        }

        nbVertexBuffer = shaderPipeline.vertexBufferIOIds.length;
        console.log("NB = ", nbVertexBuffer)
        for (let i = 0; i < nbVertexBuffer; i++) {
            const v = this.gpu.getVertexBufferIOById(shaderPipeline.vertexBufferIOIds[i])

            result += v.createDeclaration(bindingId++, groupId);
        }


        result += input.getComputeVariableDeclaration(nbUniform);

        const w = shaderPipeline.workgroups;

        result += "@compute @workgroup_size(" + w[0] + "," + w[1] + "," + w[2] + ")\n";
        result += "fn main(" + input.getComputeFunctionParams() + "){\n";
        result += this.main.value;
        result += "}\n";
        */
        this._shaderInfos = { code: result, output: null };
        return this._shaderInfos;
    }

}