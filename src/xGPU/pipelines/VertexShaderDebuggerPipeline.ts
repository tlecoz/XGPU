import { BuiltIns } from "../BuiltIns";
import { Uint } from "../PrimitiveType";
import { ComputePipeline } from "./ComputePipeline";
import { RenderPipeline } from "./RenderPipeline";
import { IndexBuffer } from "./resources/IndexBuffer";
import { UniformBuffer } from "../shader/resources/UniformBuffer";
import { VertexAttribute } from "../shader/resources/VertexAttribute";
import { VertexBuffer } from "../shader/resources/VertexBuffer";
import { VertexBufferIO } from "../shader/resources/VertexBufferIO";


export class VertexShaderDebuggerPipeline extends ComputePipeline {

    public onLog: (o: {
        config: any,
        results: any[],
        nbValueByFieldName: any
        renderPipeline: RenderPipeline,
        dataTypeByFieldname: any,
    }) => void;


    private config: any;

    constructor() {
        super();
    }

    public init(renderPipeline: RenderPipeline, config: { nbVertex: number, startVertexId: number, instanceId: number }) {


        if (!renderPipeline.pipeline) {
            /*
            if the renderPipeline is not built already, we build it 
            to be sure that all the datas are in their final states 
            */
            renderPipeline.buildGpuPipeline();
            renderPipeline.bindGroups.setupDraw(true);
        }

        const resourceByType: any = renderPipeline.bindGroups.resources.types;

        this.config = config;

        const computeShaderObj: any = {
            bindgroups: {
                io: {}, //computeShaders have a reserved bindgroup 'io' , dedicated to the ping-pong process 
            }
        };


        /*
        we check if the renderPipeline use an indexBuffer.
        If yes, we create a vertexBuffer to represent it 
        */


        let indexBuffer: IndexBuffer = null
        if (renderPipeline.resources.indexBuffer) {
            indexBuffer = renderPipeline.resources.indexBuffer;
            computeShaderObj["indexBuffer"] = new VertexBuffer({ id: VertexAttribute.Uint() }, {
                stepMode: "vertex",
                datas: indexBuffer.datas
            })
        }



        const result: any = {};
        const resultBufferStructure: any = {};

        /*
        We create an object that define the data-structure of the result we want from our computerShader.
        This data-structure should follow the output value defined in the vertexShader of the renderPipeline
        */

        const nbValueByFieldIndex: any = {};
        const nbValueByFieldName: any = {};
        const dataTypeByFieldname: any = {};
        const fieldNames: string[] = [];
        const fieldIndexByName: any = {};
        const attributes: any = {};

        const vertexShaderOutputs = renderPipeline.vertexShader.outputs;
        let nb: number, name: string;
        let output: { name: string, type: string, builtin?: string };
        for (let i = 0; i < vertexShaderOutputs.length; i++) {
            output = vertexShaderOutputs[i];
            name = output.name;
            nb = this.getNbValueByType(output.type)

            //used to write the shader code
            fieldNames[i] = name;
            fieldIndexByName[name] = i;
            nbValueByFieldIndex[i] = nb;
            dataTypeByFieldname[name] = output.type;


            //used to fill the vertexBufferIO with the appropriate property names and the correct data structure
            resultBufferStructure[name] = this.createEmptyArray(nb)

            //used to manipule the data outside of this class
            nbValueByFieldName[name] = nb;

            attributes[name] = this.getObjectByType(output.type)

        }


        console.log("output.type = ", dataTypeByFieldname)


        /*  
        we must look at the vertexShader inputs in order to reproduce them in the computeShader with the 
        appropriate names
        */

        const vertexShaderInputs = renderPipeline.vertexShader.inputs;
        let input: { name: string, type: string, builtin?: string };

        /*
        we first convert the Builtins "vertex_index" and "instance_index" (if they exists) into an uniform used in the computeShader
        with the name used in the vertexShader
        */

        let vertexIdName: string;// = "vertexId";
        let instanceIdName: string;// = "instanceId";

        let computeUniforms = {};

        for (let i = 0; i < vertexShaderInputs.length; i++) {
            input = vertexShaderInputs[i];
            if (input.builtin) {
                if (input.builtin === "@builtin(vertex_index)") {
                    vertexIdName = input.name;
                    computeUniforms[input.name] = new Uint(config.startVertexId, true)
                } else if (input.builtin === "@builtin(instance_index)") {
                    instanceIdName = input.name;
                    computeUniforms[input.name] = new Uint(config.instanceId, true)
                }
            }
        }

        if (!vertexIdName) {
            vertexIdName = "vertex_ID"
            computeUniforms[vertexIdName] = new Uint(config.startVertexId, true)
        }

        if (!instanceIdName) {
            instanceIdName = "instance_ID"
            computeUniforms[instanceIdName] = new Uint(config.startVertexId, true)
        }

        /*
        then we add the uniforms from the renderPipeline to the computePipeline
        */
        const renderUniformBuffers: { name: string, resource: UniformBuffer }[] = resourceByType.uniformBuffers;
        let ub: { name: string, resource: UniformBuffer };

        const cloneUniformBuffer = (buf: UniformBuffer) => {

            const result: any = {};

            for (let i = 0; i < buf.itemNames.length; i++) {
                result[buf.itemNames[i]] = buf.items[buf.itemNames[i]].clone();
                //result[buf.itemNames[i]].datas
            }

            return new UniformBuffer(result, { useLocalVariable: buf.descriptor.useLocalVariable })
        }

        for (let i = 0; i < renderUniformBuffers.length; i++) {
            ub = renderUniformBuffers[i];
            computeShaderObj[ub.name] = cloneUniformBuffer(ub.resource);
        }


        this.onComputeBegin = () => {
            let items: any, itemNames: string[];
            for (let i = 0; i < renderUniformBuffers.length; i++) {
                ub = renderUniformBuffers[i];
                itemNames = ub.resource.itemNames;

                for (let j = 0; j < itemNames.length; j++) {
                    computeShaderObj[ub.name].items[itemNames[j]].set(ub.resource.items[itemNames[j]]);
                }
            }
        }



        /*
        we can't use the GPUBuffer from the renderPipeline directly because the GPUBufferUsage is different 
        in a compute pipeline, so we rebuild them. 
        
        Even if I force the usage, some concurrency problem occurs 
        because both pipeline are not perfectly synchrone (because of the StagingBuffer and the map/unmap process)
        */

        const renderVertexBuffers: { name: string, resource: VertexBuffer }[] = resourceByType.vertexBuffers;
        let vb: { name: string, resource: VertexBuffer };
        let vBuffer: VertexBuffer;

        let bufferNameByAttributeName: string[] = [];


        for (let i = 0; i < renderVertexBuffers.length; i++) {
            vb = renderVertexBuffers[i];
            vBuffer = vb.resource;

            let attributes = vBuffer.attributeDescriptor;
            for (let z in attributes) {
                bufferNameByAttributeName[z] = vb.name;
            }


            computeShaderObj[vb.name] = new VertexBuffer(vBuffer.attributeDescriptor, {
                stepMode: vBuffer.stepMode,
                datas: vBuffer.datas
            })

        }




        const vertexBufferIO: VertexBufferIO = new VertexBufferIO(attributes);
        vertexBufferIO.createVertexInstances(config.nbVertex, () => {
            return resultBufferStructure;
        })


        let outputResultId;
        vertexBufferIO.onOutputData = (data) => {




            const result = new Float32Array(data);

            outputResultId = 0;
            let outputResults = [];
            vertexBufferIO.getVertexInstances(result, (o) => {
                //the object received in this function is reused all the time
                //so I need to clone it in order to be able to use it outside of the "callback-loop"

                let result = {};
                for (let z in o) result[z] = { ...o[z] };

                outputResults[outputResultId++] = result;
                if (this.onLog && outputResultId == config.nbVertex) this.onLog({ config: this.config, results: outputResults, nbValueByFieldName, renderPipeline, dataTypeByFieldname });
                //console.log("RESULT = ", result);

            })

        }





        /*
        the VertexAttributes used as input of the vertexShader must be redefined in the computeShader in 
        order to target a particular vertex in the buffer, to mimic the behaviour of a vertexShader
        */





        let computeShader: string = ``;
        if (indexBuffer) computeShader += `let index:u32 = indexBuffer[global_id.x].id;`;
        else computeShader += `let index = global_id.x`;
        computeShader += `
        let nbResult = arrayLength(&result);
        if(index >= nbResult){
            return;
        }



        var computeResult = result[index];
        `;
        for (let i = 0; i < vertexShaderInputs.length; i++) {
            input = vertexShaderInputs[i];

            if (input.builtin.slice(0, 8) != "@builtin") { //if it's not explicitly a builtin, it's a vertexAttribute
                computeShader += `var computed_vertex_${input.name} = ${bufferNameByAttributeName[input.name]}[${vertexIdName}+index].${input.name};\n`;
            }
        }


        /*
        we need to update the code of the vertexShader in order to replace the attribute's name
        used in the code by our computed_vertex_${input.name} 
        */

        const searchAndReplace = (shaderCode: string, wordToReplace: string, replacement: string) => {
            const regex = new RegExp(`(?<=[^\\w.])\\b${wordToReplace}\\b`, 'g');
            return shaderCode.replace(regex, replacement);
        }

        let attributeNames: string[] = [];
        let vertexShaderText = renderPipeline.vertexShader.main.value;
        for (let i = 0; i < vertexShaderInputs.length; i++) {
            input = vertexShaderInputs[i];
            if (input.builtin.slice(0, 8) != "@builtin") {
                attributeNames[fieldIndexByName[input.name]] = input.name;
                vertexShaderText = searchAndReplace(vertexShaderText, input.name, "computed_vertex_" + input.name);
            }
        }


        /*
        we also need to update the code that involve the keyword 'output' in order to target our result buffer instead
        */


        vertexShaderText = searchAndReplace(vertexShaderText, "output", "computeResult");
        computeShader += vertexShaderText + "\n";


        /*
        we put the vertexData in our result buffer
        */



        for (let i = 0; i < fieldNames.length; i++) {
            computeShader += `
                    
            result_out[index].${fieldNames[i]} =  computeResult.${fieldNames[i]};  
                    
                `;
        }


        /*
        and we transfer it to the output_buffer
        */

        // computeShader += "result_out[index] = computeResult;"


        computeShaderObj.computeUniforms = new UniformBuffer(computeUniforms)
        computeShaderObj.result = vertexBufferIO;
        computeShaderObj.global_id = BuiltIns.computeInputs.globalInvocationId;
        computeShaderObj.computeShader = computeShader;

        this.initFromObject(computeShaderObj)

        let groups = this.bindGroups.groups;
        for (let i = 0; i < groups.length; i++) groups[i].mustRefreshBindgroup = true;
    }


    private createEmptyArray(len: number): number[] {
        const arr = [];
        for (let i = 0; i < len; i++) arr[i] = 0;
        return arr;
    }


    private getObjectByType(type: string): any {
        if (type === "f32") return VertexAttribute.Float();
        if (type === "vec2<f32>") return VertexAttribute.Vec2();
        if (type === "vec3<f32>") return VertexAttribute.Vec3();
        if (type === "vec4<f32>") return VertexAttribute.Vec4();
        return null;
    }
    private getNbValueByType(type: string): number {
        if (type === "f32") return 1;
        if (type === "vec2<f32>") return 2;
        if (type === "vec3<f32>") return 3;
        if (type === "vec4<f32>") return 4;
    }

}