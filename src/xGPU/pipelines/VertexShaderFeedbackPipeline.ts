import { BuiltIns } from "../BuiltIns";
import { Uint, Vec4 } from "../PrimitiveType";
import { ComputePipeline } from "./ComputePipeline";
import { RenderPipeline } from "./RenderPipeline";
import { IndexBuffer } from "./resources/IndexBuffer";
import { UniformBuffer } from "../shader/resources/UniformBuffer";
import { VertexAttribute } from "../shader/resources/VertexAttribute";
import { VertexBuffer } from "../shader/resources/VertexBuffer";
import { VertexBufferIO } from "../shader/resources/VertexBufferIO";


export class VertexShaderFeedbackPipeline extends ComputePipeline {

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
    protected fieldNewNames: string[] = [];
    protected fieldIndexByName: any = {};
    protected attributes: any = {};

    protected setupDataStructure() {
        this.results = {};
        this.resultBufferStructure = {};
        this.nbValueByFieldIndex = {};
        this.nbValueByFieldName = {};
        this.dataTypeByFieldname = {};
        this.fieldNames = [];
        this.fieldNewNames = [];
        this.fieldIndexByName = {};
        this.attributes = {};

        //const vertexShaderOutputs = this.renderPipeline.vertexShader.outputs;
        const vertexShaderDebugs = this.renderPipeline.resources.__DEBUG__.objectById;

        let nb: number, name: string;
        let debug: { name: string, newName: string, type: string, builtin?: string, nbValue: number };
        for (let i = 0; i < vertexShaderDebugs.length; i++) {
            debug = vertexShaderDebugs[i];
            name = debug.name;
            nb = this.getNbValueByType(debug.type)

            //console.log(i, debug.name, debug.newName)

            //used to write the shader code
            this.fieldNames[i] = name;
            this.fieldNewNames[i] = debug.newName;
            this.fieldIndexByName[name] = i;
            this.nbValueByFieldIndex[i] = debug.nbValue;
            this.dataTypeByFieldname[name] = debug.type;


            //used to fill the vertexBufferIO with the appropriate property names and the correct data structure
            this.resultBufferStructure[name] = this.createEmptyArray(nb)

            //used to manipule the data outside of this class
            this.nbValueByFieldName[name] = nb;

            //console.log("debug.type = ", debug)
            this.attributes[debug.newName] = this.getObjectByType(debug.type)

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
        the vertexShader outputs must be replaced by local variables
        */
        let outputVariables = "";
        let outputs = this.renderPipeline.vertexShader.outputs;
        for (let i = 0; i < outputs.length; i++) {
            console.log(i, outputs[i])
            outputVariables += `var output_${outputs[i].name} = ${this.getNewInstanceByType(outputs[i].type)};\n`
        }



        /*
        the VertexAttributes used as input of the vertexShader must be redefined in the computeShader in 
        order to target a particular vertex in the buffer, to mimic the behaviour of a vertexShader
        */
        let computeShader: string = ``;
        if (this.indexBuffer) computeShader += `let index:u32 = indexBuffer[global_id.x].id;`;
        else computeShader += `let index = global_id.x;`;
        computeShader += `
        ${outputVariables}
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
        let vertexShaderText = this.renderPipeline.resources.vertexShader.debugVersion;

        for (let i = 0; i < this.vertexShaderInputs.length; i++) {
            input = this.vertexShaderInputs[i];
            if (input.builtin.slice(0, 8) != "@builtin") {
                attributeNames[this.fieldIndexByName[input.name]] = input.name;
                vertexShaderText = searchAndReplace(vertexShaderText, input.name, "computed_vertex_" + input.name);
            }
        }


        /*
        we also need to update the code that involve the keyword 'debug' in order to target our result buffer instead
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

        vertexShaderText = searchAndReplace(vertexShaderText, "output.", "output_");
        vertexShaderText = searchAndReplace(vertexShaderText, "debug", "computeResult");
        computeShader += vertexShaderText + "\n";


        /*
        we put the vertexData in our result buffer
        */



        for (let i = 0; i < this.fieldNames.length; i++) {
            computeShader += `
            result_out[index].${this.fieldNewNames[i]} =  computeResult.${this.fieldNewNames[i]};    
                `;
        }


        const debugById = this.renderPipeline.resources.__DEBUG__.objectById;
        let debug: any;
        let alreadyDefined: any = {};
        let temp: string;
        let isMatrix4x4;
        for (let i = 0; i < debugById.length; i++) {
            debug = debugById[i];
            if (debug.isMatrix) {

                isMatrix4x4 = debug.newName.includes("_m4");

                if (isMatrix4x4) temp = debug.newName.split("_m4")[0];
                else temp = debug.newName.split("_m3")[0];

                if (!alreadyDefined[temp]) {
                    alreadyDefined[temp] = true;
                    computeShader = this.writeMatrixTemplate(computeShader, temp, isMatrix4x4)
                }
            } else if (debug.isArray) {

                temp = debug.newName.split("_ar")[0];
                if (!alreadyDefined[temp]) {
                    alreadyDefined[temp] = true;
                    computeShader = this.writeArrayTemplate(computeShader, temp, debug.len, debug.primitiveType)
                }

            }
        }


        console.log(computeShader)

        return computeShader;
    }





    private writeArrayTemplate(shader: string, computeMatrixName: string, arrayLen: number, primitiveType: "f32" | "i32" | "u32" | "mat4"): string {
        let abc = "abcdefghijklmnopqrstuvwxyz0123456789"
        abc += abc.toUpperCase();
        let lines: string[] = shader.split("\n");
        let line: string;

        const isComplexVal = (val: string): boolean => {
            for (let i = 0; i < val.length; i++) {
                if (abc.includes(val[i])) continue;
                else return true;
            }
            return false;
        }



        let tempName: string;



        const writeTemplate = (computeName: string, matrixName: string): string => {
            let result = "";
            let nb = arrayLen;
            let isArrayMatrix = primitiveType == "mat4";

            for (let i = 0; i < nb; i++) {
                if (!isArrayMatrix) result += `computeResult.${computeName}_ar${i} = ${matrixName}[${i}];\n`;
                else {
                    result += `computeResult.${computeName}_ar${i}_m0 = ${matrixName}[${i}][0];\n`;
                    result += `computeResult.${computeName}_ar${i}_m1 = ${matrixName}[${i}][1];\n`;
                    result += `computeResult.${computeName}_ar${i}_m2 = ${matrixName}[${i}][2];\n`;
                    result += `computeResult.${computeName}_ar${i}_m3 = ${matrixName}[${i}][3];\n\n`;
                }
            }
            result += "\n";
            return result;
        }

        let newLine = "";
        for (let i = 0; i < lines.length; i++) {
            line = lines[i];
            //console.log(i, " line = ", computeMatrixName, line);
            if (line.includes("computeResult." + computeMatrixName) == true) {
                newLine = "";
                let val = line.split("=")[1].split(";")[0].trim();
                //console.log("val = ", val)

                let j = i;
                if (isComplexVal(val)) {

                    if (line.includes(";") === false) {

                        for (j = i + 1; j < lines.length; j++) {

                            if (lines[j].includes(";") == false) {
                                val += lines[j] + "\n";
                                lines[j] = "";
                            } else {
                                val += lines[j].split(";")[0] + "";
                                lines[j] = "";
                                break;
                            }
                        }
                    }


                    tempName = "temporaryVariable_" + this.temporaryIndex++;
                    if (primitiveType === "mat4") newLine = "let " + tempName + ":array<mat4x4<f32>," + arrayLen + "> = " + val + ";\n";
                    else newLine = "let " + tempName + ":array<vec4<" + primitiveType + "> = " + val + ";\n";
                    val = tempName;
                }

                newLine += writeTemplate(computeMatrixName, val);
                lines[i] = newLine;


                break;

            }

        }

        return lines.join("\n");


    }







    private temporaryIndex: number = 0;
    private writeMatrixTemplate(shader: string, computeMatrixName: string, mat4x4: boolean = true): string {
        let abc = "abcdefghijklmnopqrstuvwxyz0123456789"
        abc += abc.toUpperCase();
        let lines: string[] = shader.split("\n");
        let line: string;

        const isComplexVal = (val: string): boolean => {
            for (let i = 0; i < val.length; i++) {
                if (abc.includes(val[i])) continue;
                else return true;
            }
            return false;
        }


        let tempId = 0;
        let tempName: string;



        const writeTemplate = (computeName: string, matrixName: string): string => {
            let result = "";
            let nb = 4;
            if (mat4x4 == false) nb = 3;
            console.log(computeName + " => mat4x4:", mat4x4);
            for (let i = 0; i < nb; i++) {
                result += `computeResult.${computeName}_m${nb}${i} = ${matrixName}[${i}];\n`;
            }
            result += "\n";
            return result;
        }

        let newLine = "";
        for (let i = 0; i < lines.length; i++) {
            line = lines[i];
            //console.log(i, " line = ", computeMatrixName, line);
            if (line.includes("computeResult." + computeMatrixName) == true) {
                newLine = "";
                let val = line.split("=")[1].split(";")[0].trim();
                //console.log("val = ", val)

                let j = i;
                if (isComplexVal(val)) {

                    if (line.includes(";") === false) {

                        for (j = i + 1; j < lines.length; j++) {

                            if (lines[j].includes(";") == false) {
                                val += lines[j] + "\n";
                                lines[j] = "";
                            } else {
                                val += lines[j].split(";")[0] + "";
                                lines[j] = "";
                                break;
                            }
                        }
                    }


                    tempName = "temporaryVariable_" + this.temporaryIndex++;
                    if (mat4x4) newLine = "let " + tempName + ":mat4x4<f32> = " + val + ";\n";
                    else newLine = "let " + tempName + ":mat3x3<f32> = " + val + ";\n";
                    val = tempName;
                }

                newLine += writeTemplate(computeMatrixName, val);
                lines[i] = newLine;


                break;

            }

        }

        return lines.join("\n");


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
    private getNewInstanceByType(type: string): string {
        if (type === "f32") return "0.0";
        if (type === "vec2<f32>") return "vec2(0.0)";
        if (type === "vec3<f32>") return "vec3(0.0)";
        if (type === "vec4<f32>") return "vec4(0.0)";
    }
}