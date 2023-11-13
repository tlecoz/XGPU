import { BuiltIns } from "../BuiltIns";
import { Uint, Vec4 } from "../PrimitiveType";
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


    protected config: any;

    constructor() {
        super();
    }


    protected vertexShaderInputs: any;
    protected renderPipeline: RenderPipeline;
    protected computeShaderObj: any;
    protected resourceByType: any;

    protected initRenderPipeline(renderPipeline: RenderPipeline): void {
        this.renderPipeline = renderPipeline;

        if (!renderPipeline.pipeline) {
            /*
            if the renderPipeline is not built already, we build it 
            to be sure that all the datas are in their final states 
            */


            //renderPipeline.buildGpuPipeline();

        }
        renderPipeline.bindGroups.setupDraw(true);
        this.resourceByType = renderPipeline.bindGroups.resources.types;
        this.vertexShaderInputs = renderPipeline.vertexShader.inputs;
        this.renderUniformBuffers = this.resourceByType.uniformBuffers;

    }

    protected indexBuffer: IndexBuffer;
    protected setupIndexBuffer() {
        /*
       we check if the renderPipeline use an indexBuffer.
       If yes, we create a vertexBuffer to represent it 
       */


        let indexBuffer: IndexBuffer = null
        if (this.renderPipeline.resources.indexBuffer) {
            indexBuffer = this.renderPipeline.resources.indexBuffer;
            this.computeShaderObj["indexBuffer"] = new VertexBuffer({ id: VertexAttribute.Uint() }, {
                stepMode: "vertex",
                datas: indexBuffer.datas
            })
        }
    }

    protected results: any;
    protected resultBufferStructure: any = {};
    protected nbValueByFieldIndex: any = {};
    protected nbValueByFieldName: any = {};
    protected dataTypeByFieldname: any = {};
    protected fieldNames: string[] = [];
    protected fieldIndexByName: any = {};
    protected attributes: any = {};

    protected setupDataStructure() {
        this.results = {};
        this.resultBufferStructure = {};
        this.nbValueByFieldIndex = {};
        this.nbValueByFieldName = {};
        this.dataTypeByFieldname = {};
        this.fieldNames = [];
        this.fieldIndexByName = {};
        this.attributes = {};

        const vertexShaderOutputs = this.renderPipeline.vertexShader.outputs;
        let nb: number, name: string;
        let output: { name: string, type: string, builtin?: string };
        for (let i = 0; i < vertexShaderOutputs.length; i++) {
            output = vertexShaderOutputs[i];
            name = output.name;
            nb = this.getNbValueByType(output.type)

            //used to write the shader code
            this.fieldNames[i] = name;
            this.fieldIndexByName[name] = i;
            this.nbValueByFieldIndex[i] = nb;
            this.dataTypeByFieldname[name] = output.type;


            //used to fill the vertexBufferIO with the appropriate property names and the correct data structure
            this.resultBufferStructure[name] = this.createEmptyArray(nb)

            //used to manipule the data outside of this class
            this.nbValueByFieldName[name] = nb;

            this.attributes[name] = this.getObjectByType(output.type)

        }
    }


    protected vertexIdName: string;// = "vertexId";
    protected instanceIdName: string;// = "instanceId";
    protected computeUniforms = {};

    protected setupVertexShaderBuiltIns() {
        let input: { name: string, type: string, builtin?: string };

        /*
        we first convert the Builtins "vertex_index" and "instance_index" (if they exists) into an uniform used in the computeShader
        with the name used in the vertexShader
        */



        for (let i = 0; i < this.vertexShaderInputs.length; i++) {
            input = this.vertexShaderInputs[i];
            if (input.builtin) {
                if (input.builtin === "@builtin(vertex_index)") {
                    this.vertexIdName = input.name;
                    this.computeUniforms[input.name] = new Uint(this.config.startVertexId, true)
                } else if (input.builtin === "@builtin(instance_index)") {
                    this.instanceIdName = input.name;
                    this.computeUniforms[input.name] = new Uint(this.config.instanceId, true)
                }
            }
        }

        if (!this.vertexIdName) {
            this.vertexIdName = "vertex_ID"
            this.computeUniforms[this.vertexIdName] = new Uint(this.config.startVertexId, true)
        }

        if (!this.instanceIdName) {
            this.instanceIdName = "instance_ID"
            this.computeUniforms[this.instanceIdName] = new Uint(this.config.startVertexId, true)
        }
    }

    protected renderUniformBuffers: { name: string, resource: UniformBuffer }[]
    protected setupUniformBuffers() {

        let ub: { name: string, resource: UniformBuffer };

        const cloneUniformBuffer = (buf: UniformBuffer) => {

            const result: any = {};

            for (let i = 0; i < buf.itemNames.length; i++) {
                result[buf.itemNames[i]] = buf.items[buf.itemNames[i]].clone();
                //result[buf.itemNames[i]].datas
            }

            return new UniformBuffer(result, { useLocalVariable: buf.descriptor.useLocalVariable })
        }

        if (this.renderUniformBuffers) {
            for (let i = 0; i < this.renderUniformBuffers.length; i++) {
                ub = this.renderUniformBuffers[i];
                this.computeShaderObj[ub.name] = cloneUniformBuffer(ub.resource);
            }
        }
    }

    protected renderVertexBuffers: { name: string, resource: VertexBuffer }[];
    protected bufferNameByAttributeName: string[];
    protected setupVertexBuffers() {
        this.renderVertexBuffers = this.resourceByType.vertexBuffers;
        this.bufferNameByAttributeName = [];

        let vb: { name: string, resource: VertexBuffer };
        let vBuffer: VertexBuffer;


        if (this.renderVertexBuffers) {



            for (let i = 0; i < this.renderVertexBuffers.length; i++) {
                vb = this.renderVertexBuffers[i];
                vBuffer = vb.resource;

                let attributes = vBuffer.attributeDescriptor;
                for (let z in attributes) {
                    this.bufferNameByAttributeName[z] = vb.name;
                }


                this.computeShaderObj[vb.name] = new VertexBuffer(vBuffer.attributeDescriptor, {
                    stepMode: vBuffer.stepMode,
                    datas: vBuffer.datas
                })

            }
        }
    }

    protected vertexBufferIO: VertexBufferIO;
    protected setupComputeShaderVertexBufferIO() {
        this.vertexBufferIO = new VertexBufferIO(this.attributes);
        this.vertexBufferIO.createVertexInstances(this.config.nbVertex, () => {
            return this.resultBufferStructure;
        })


        let outputResultId;
        this.vertexBufferIO.onOutputData = (data) => {

            const result = new Float32Array(data);

            outputResultId = 0;
            let outputResults = [];
            this.vertexBufferIO.getVertexInstances(result, (o) => {
                //the object received in this function is reused all the time
                //so I need to clone it in order to be able to use it outside of the "callback-loop"

                let result = {};
                for (let z in o) result[z] = { ...o[z] };

                outputResults[outputResultId++] = result;
                if (this.onLog && outputResultId == this.config.nbVertex) {
                    this.onLog({
                        config: this.config,
                        results: outputResults,
                        nbValueByFieldName: this.nbValueByFieldName,
                        renderPipeline: this.renderPipeline,
                        dataTypeByFieldname: this.dataTypeByFieldname
                    });
                }
                //console.log("RESULT = ", result);

            })

        }
    }


    protected writeComputeShader(): string {


        /*
        the VertexAttributes used as input of the vertexShader must be redefined in the computeShader in 
        order to target a particular vertex in the buffer, to mimic the behaviour of a vertexShader
        */

        let computeShader: string = ``;
        if (this.indexBuffer) computeShader += `let index:u32 = indexBuffer[global_id.x].id;`;
        else computeShader += `let index = global_id.x;`;
        computeShader += `
        let nbResult = arrayLength(&result);
        if(index >= nbResult){
            return;
        }



        var computeResult = result[index];
        `;

        let input: any;
        for (let i = 0; i < this.vertexShaderInputs.length; i++) {
            input = this.vertexShaderInputs[i];

            if (input.builtin.slice(0, 8) != "@builtin") { //if it's not explicitly a builtin, it's a vertexAttribute
                computeShader += `var computed_vertex_${input.name} = ${this.bufferNameByAttributeName[input.name]}[${this.vertexIdName}+index].${input.name};\n`;
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
        let vertexShaderText = this.renderPipeline.vertexShader.main.value;
        for (let i = 0; i < this.vertexShaderInputs.length; i++) {
            input = this.vertexShaderInputs[i];
            if (input.builtin.slice(0, 8) != "@builtin") {
                attributeNames[this.fieldIndexByName[input.name]] = input.name;
                vertexShaderText = searchAndReplace(vertexShaderText, input.name, "computed_vertex_" + input.name);
            }
        }


        /*
        we also need to update the code that involve the keyword 'output' in order to target our result buffer instead
        */


        const lines = vertexShaderText.split("\n");
        const chars = "abcdefghijklmnopqrstuvwxyz/"
        const isChars = {};
        for (let i = 0; i < chars.length; i++) {
            isChars[chars[i]] = true;
            isChars[chars[i].toUpperCase()] = true;
        }

        const getFirstCharId = (line: string) => {
            for (let i = 0; i < line.length; i++) {
                if (isChars[line[i]]) return i;
            }
        }

        for (let i = 0; i < lines.length; i++) {
            lines[i] = " " + lines[i].slice(getFirstCharId(lines[i]));
        }

        vertexShaderText = lines.join("\n");


        vertexShaderText = searchAndReplace(vertexShaderText, "output", "computeResult");
        computeShader += vertexShaderText + "\n";


        /*
        we put the vertexData in our result buffer
        */



        for (let i = 0; i < this.fieldNames.length; i++) {
            computeShader += `
            result_out[index].${this.fieldNames[i]} =  computeResult.${this.fieldNames[i]};    
                `;
        }

        return computeShader;
    }


    protected buildComputeShader() {
        this.computeShaderObj.computeUniforms = new UniformBuffer(this.computeUniforms)
        this.computeShaderObj.result = this.vertexBufferIO;
        this.computeShaderObj.global_id = BuiltIns.computeInputs.globalInvocationId;
        this.computeShaderObj.computeShader = {
            constants: this.renderPipeline.vertexShader.constants.text,
            main: this.writeComputeShader(),
        }

        this.initFromObject(this.computeShaderObj)

        let groups = this.bindGroups.groups;
        for (let i = 0; i < groups.length; i++) groups[i].mustRefreshBindgroup = true;
    }


    protected copyUniformsFromRenderToCompute(): void {
        if (!this.renderUniformBuffers) return;

        let ub;
        let itemNames: string[];
        for (let i = 0; i < this.renderUniformBuffers.length; i++) {
            ub = this.renderUniformBuffers[i];
            itemNames = ub.resource.itemNames;

            for (let j = 0; j < itemNames.length; j++) {
                //console.log(itemNames[j], ub.resource.items[itemNames[j]])
                this.computeShaderObj[ub.name].items[itemNames[j]].set(ub.resource.items[itemNames[j]]);
            }
        }
    }


    public init(renderPipeline: RenderPipeline, config: { nbVertex: number, startVertexId: number, instanceId: number }) {


        this.config = config;
        this.computeShaderObj = {
            bindgroups: {
                io: {}, //computeShaders have a reserved bindgroup 'io' , dedicated to the ping-pong process 
            }
        };




        this.initRenderPipeline(renderPipeline);

        /*
        if (!this.renderPipeline.disableDebuggerCreation) {
            this.renderPipeline.disableDebuggerCreation = true;
            if (!this.renderUniformBuffers) {
                const resource = new UniformBuffer({
                    debugUniform: new Vec4(0, 1, 0, 1)
                }, { useLocalVariable: true });
                const name: string = "debugUniformBuffer"
                this.renderUniformBuffers = [{ name, resource }];
                this.renderPipeline.bindGroups.groups[0].add(name, resource)
            } else {


                this.renderUniformBuffers[0].resource.add("debugUniform", new Vec4(0, 1, 0, 1), true)
                console.log(this.renderPipeline)


            }
        }

        */




        //this.computeShaderObj[ub.name].items[itemNames[j]]




        this.setupIndexBuffer();
        this.setupDataStructure();
        this.setupVertexShaderBuiltIns();
        this.setupUniformBuffers();
        this.setupVertexBuffers();
        this.setupComputeShaderVertexBufferIO();
        this.buildComputeShader();




        //this.computeShaderObj[this.renderUniformBuffers[0].name].add("debugUniform", new Vec4(0, 1, 0, 1)) 




        /*
        this.renderPipeline.initFromObject(
            {
                ...this.renderPipeline.resources
            }
        )*/

        this.onComputeBegin = () => {
            this.copyUniformsFromRenderToCompute();
        }


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