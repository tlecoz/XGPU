import { BuiltIns } from "../BuiltIns";
import { ComputePipeline } from "./ComputePipeline";
import { UniformBuffer } from "../shader/resources/UniformBuffer";
import { VertexAttribute } from "../shader/resources/VertexAttribute";
import { VertexBuffer } from "../shader/resources/VertexBuffer";
import { VertexBufferIO } from "../shader/resources/VertexBufferIO";
import { XGPU } from "../XGPU";
export class VertexShaderDebuggerPipeline extends ComputePipeline {
    onLog;
    config;
    constructor() {
        super();
    }
    vertexShaderInputs;
    renderPipeline;
    computeShaderObj;
    resourceByType;
    initRenderPipeline(renderPipeline) {
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
    indexBuffer;
    setupIndexBuffer() {
        /*
       we check if the renderPipeline use an indexBuffer.
       If yes, we create a vertexBuffer to represent it
       */
        let indexBuffer = null;
        if (this.renderPipeline.resources.indexBuffer) {
            indexBuffer = this.renderPipeline.resources.indexBuffer;
            this.computeShaderObj["indexBuffer"] = new VertexBuffer({ id: VertexAttribute.Uint() }, {
                stepMode: "vertex",
                datas: indexBuffer.datas
            });
        }
    }
    results;
    resultBufferStructure = {};
    nbValueByFieldIndex = {};
    nbValueByFieldName = {};
    dataTypeByFieldname = {};
    fieldNames = [];
    fieldNewNames = [];
    fieldIndexByName = {};
    attributes = {};
    setupDataStructure() {
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
        let nb, name;
        let debug;
        for (let i = 0; i < vertexShaderDebugs.length; i++) {
            debug = vertexShaderDebugs[i];
            name = debug.name;
            nb = this.getNbValueByType(debug.type);
            //console.log(i, debug.name, debug.newName)
            //used to write the shader code
            this.fieldNames[i] = name;
            this.fieldNewNames[i] = debug.newName;
            this.fieldIndexByName[name] = i;
            this.nbValueByFieldIndex[i] = debug.nbValue;
            this.dataTypeByFieldname[name] = debug.type;
            //used to fill the vertexBufferIO with the appropriate property names and the correct data structure
            this.resultBufferStructure[name] = this.createEmptyArray(nb);
            //used to manipule the data outside of this class
            this.nbValueByFieldName[name] = nb;
            //console.log("debug.type = ", debug)
            this.attributes[debug.newName] = this.getObjectByType(debug.type);
        }
    }
    vertexIdName; // = "vertexId";
    instanceIdName; // = "instanceId";
    //protected computeUniforms = {};
    setupVertexShaderBuiltIns() {
        let input;
        /*
        we first convert the Builtins "vertex_index" and "instance_index" (if they exists) into an uniform used in the computeShader
        with the name used in the vertexShader
        */
        for (let i = 0; i < this.vertexShaderInputs.length; i++) {
            input = this.vertexShaderInputs[i];
            if (input.builtin) {
                if (input.builtin === "@builtin(vertex_index)") {
                    this.vertexIdName = input.name;
                    //this.computeUniforms[input.name] = new Uint(this.config.startVertexId, true)
                }
                else if (input.builtin === "@builtin(instance_index)") {
                    this.instanceIdName = input.name;
                    //this.computeUniforms[input.name] = new Uint(this.config.instanceId, true)
                }
            }
        }
        if (!this.vertexIdName) {
            this.vertexIdName = "VERTEX_ID";
            //this.computeUniforms[this.vertexIdName] = new Uint(this.config.startVertexId, true)
        }
        if (!this.instanceIdName) {
            this.instanceIdName = "INSTANCE_ID";
            //this.computeUniforms[this.instanceIdName] = new Uint(this.config.startVertexId, true)
        }
    }
    renderUniformBuffers;
    setupUniformBuffers() {
        let ub;
        const cloneUniformBuffer = (buf) => {
            const result = {};
            for (let i = 0; i < buf.itemNames.length; i++) {
                result[buf.itemNames[i]] = buf.items[buf.itemNames[i]].clone();
                //result[buf.itemNames[i]].datas
            }
            return new UniformBuffer(result, { useLocalVariable: buf.descriptor.useLocalVariable });
        };
        if (this.renderUniformBuffers) {
            for (let i = 0; i < this.renderUniformBuffers.length; i++) {
                ub = this.renderUniformBuffers[i];
                this.computeShaderObj[ub.name] = cloneUniformBuffer(ub.resource);
            }
        }
    }
    renderVertexBuffers;
    bufferNameByAttributeName;
    setupVertexBuffers() {
        this.renderVertexBuffers = this.resourceByType.vertexBuffers;
        this.bufferNameByAttributeName = [];
        let vb;
        let vBuffer;
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
                });
            }
        }
    }
    vertexBufferIO;
    setupComputeShaderVertexBufferIO() {
        this.vertexBufferIO = new VertexBufferIO(this.attributes);
        this.vertexBufferIO.createVertexInstances(this.config.nbVertex, () => {
            return this.resultBufferStructure;
        });
        let outputResultId;
        this.vertexBufferIO.onOutputData = (data) => {
            const result = new Float32Array(data);
            outputResultId = 0;
            let outputResults = [];
            this.vertexBufferIO.getVertexInstances(result, (o) => {
                //the object received in this function is reused all the time
                //so I need to clone it in order to be able to use it outside of the "callback-loop"
                let result = {};
                for (let z in o)
                    result[z] = { ...o[z] };
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
            });
        };
    }
    convertLetIntoVar(shader) {
        let result = "";
        let lines = shader.split("\n");
        let line;
        let chars = "abcdefghijklmnopqrstuvwxyz/";
        chars += chars.toUpperCase();
        const getFirstCharId = (line) => {
            for (let i = 0; i < line.length; i++) {
                if (chars.includes(line[i]))
                    return i;
            }
            return line.length - 1;
        };
        for (let i = 0; i < lines.length; i++) {
            line = lines[i];
            line = line.slice(getFirstCharId(line));
            if (line.slice(0, 4) === "let ") {
                line = "var " + line.slice(4);
            }
            //adding a first empty char is a dirty fix to another process 
            result += " " + line + "\n";
        }
        return result;
    }
    removeVar(shader) {
        let result = "";
        let lines = shader.split("\n");
        let line;
        for (let i = 0; i < lines.length; i++) {
            line = lines[i];
            if (line.slice(0, 5) === " var ")
                line = line.slice(5);
            result += " " + line + "\n";
        }
        return result;
    }
    writeComputeShader() {
        /*
        the vertexShader outputs must be replaced by local variables
        */
        let outputVariables = "";
        let outputs = this.renderPipeline.vertexShader.outputs;
        for (let i = 0; i < outputs.length; i++) {
            //console.log(i, outputs[i])
            outputVariables += `var output_${outputs[i].name} = ${this.getNewInstanceByType(outputs[i].type)};\n`;
        }
        /*
        the VertexAttributes used as input of the vertexShader must be redefined in the computeShader in
        order to target a particular vertex in the buffer, to mimic the behaviour of a vertexShader
        */
        let computeShader = ``;
        if (this.indexBuffer)
            computeShader += `let index:u32 = indexBuffer[global_id.x].id;`;
        else
            computeShader += `let index = global_id.x;`;
        computeShader += `
        ${outputVariables}
        let nbResult = arrayLength(&result);
        if(index >= nbResult){
            return;
        }

        var computeResult = result[index];
        var ${this.vertexIdName}:u32 = 0;
        var ${this.instanceIdName}:u32 = 0;
        `;
        let input;
        for (let i = 0; i < this.vertexShaderInputs.length; i++) {
            input = this.vertexShaderInputs[i];
            //console.log("input.type = ", input)
            if (input.builtin.slice(0, 8) != "@builtin") { //if it's not explicitly a builtin, it's a vertexAttribute
                computeShader += `var computed_vertex_${input.name}:${input.type};\n`;
            }
        }
        let usedNames = {};
        const vertexShaderDebugs = this.renderPipeline.resources.__DEBUG__.objectById;
        for (let i = 0; i < vertexShaderDebugs.length; i++) {
            //console.log(i, vertexShaderDebugs[i].name)
            if (!usedNames[vertexShaderDebugs[i].name]) {
                usedNames[vertexShaderDebugs[i].name] = true;
                computeShader += this.writeVertexShader(vertexShaderDebugs[i]);
            }
        }
        if (XGPU.showVertexDebuggerShader) {
            console.log("------------- VERTEX DEBUGGER SHADER --------------");
            console.log(computeShader);
            console.log("---------------------------------------------------");
        }
        return computeShader;
    }
    firstPass = true;
    writeVertexShader(debugObject) {
        const { vertexId, instanceId, name } = debugObject;
        let mainCode = `
        ${this.vertexIdName} = ${vertexId};
        ${this.instanceIdName} = ${instanceId};

        `;
        let input;
        for (let i = 0; i < this.vertexShaderInputs.length; i++) {
            input = this.vertexShaderInputs[i];
            if (input.builtin.slice(0, 8) != "@builtin") { //if it's not explicitly a builtin, it's a vertexAttribute
                mainCode += `computed_vertex_${input.name} = ${this.bufferNameByAttributeName[input.name]}[${this.vertexIdName}+index].${input.name};\n`;
            }
        }
        /*
        we need to update the code of the vertexShader in order to replace the attribute's name
        used in the code by our computed_vertex_${input.name}
        */
        const searchAndReplace = (shaderCode, wordToReplace, replacement) => {
            const regex = new RegExp(`(?<=[^\\w.])\\b${wordToReplace}\\b`, 'g');
            return shaderCode.replace(regex, replacement);
        };
        let attributeNames = [];
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
        const chars = "abcdefghijklmnopqrstuvwxyz/";
        const isChars = {};
        for (let i = 0; i < chars.length; i++) {
            isChars[chars[i]] = true;
            isChars[chars[i].toUpperCase()] = true;
        }
        const getFirstCharId = (line) => {
            for (let i = 0; i < line.length; i++) {
                if (isChars[line[i]])
                    return i;
            }
            return line.length - 1;
        };
        for (let i = 0; i < lines.length; i++) {
            lines[i] = " " + lines[i].slice(getFirstCharId(lines[i]));
        }
        vertexShaderText = lines.join("\n");
        vertexShaderText = searchAndReplace(vertexShaderText, "output.", "output_");
        let vertexResultText = searchAndReplace(vertexShaderText, "debug", "computeResult");
        /*
        we keep only the computeResult value related to the debug-object we are processing
        in order to not replace the previously computed values
        (the function "vertexShader" will be called multiple times, shering the same string-output)
        */
        function keepCurrentResourceDeclarationOnly(code, searchBase, search) {
            /*
            we keep every line that :
            - are not empty
            - doesn't contain "computeResult."
            - contain "computeResult.${debugObject.name}"
            */
            const lines = code.split("\n");
            let result = "";
            let line;
            let alphaNumeric = "abcdefghijklmnopqrstuvwxyz0123456789";
            let trimLine;
            alphaNumeric += alphaNumeric.toUpperCase();
            for (let i = 0; i < lines.length; i++) {
                line = lines[i];
                if (line.includes(searchBase)) {
                    if (line.includes(search)) {
                        const array = line.split(search);
                        let bool = true;
                        for (let j = 0; j < array.length; j++) {
                            if (alphaNumeric.includes(array[j][0])) {
                                bool = false;
                                break;
                            }
                        }
                        if (bool)
                            result += line + "\n";
                    }
                }
                else {
                    trimLine = line.trim();
                    if (trimLine.length != 0) {
                        result += line + "\n";
                    }
                }
            }
            return result;
        }
        vertexResultText = keepCurrentResourceDeclarationOnly(vertexResultText, "computeResult.", "computeResult." + debugObject.name);
        /*
        if we call the vertexShader function multiple times, we must keep the "var " only for the first pass.
        We also must convert the "let " into "var "
        */
        vertexResultText = this.convertLetIntoVar(vertexResultText);
        if (!this.firstPass)
            vertexResultText = this.removeVar(vertexResultText);
        mainCode += vertexResultText + "\n";
        /*
        we put the vertexData in our result buffer
        */
        for (let i = 0; i < this.fieldNames.length; i++) {
            //console.log(i, this.fieldNewNames[i], this.fieldNames[i], debugObject.name)
            if (this.fieldNewNames[i].includes(debugObject.name)) {
                mainCode += `result_out[index].${this.fieldNewNames[i]} =  computeResult.${this.fieldNewNames[i]};\n`;
            }
        }
        const debugById = this.renderPipeline.resources.__DEBUG__.objectById;
        let debug;
        let alreadyDefined = {};
        let temp;
        let isMatrix4x4;
        for (let i = 0; i < debugById.length; i++) {
            debug = debugById[i];
            if (debug.name != name)
                continue;
            if (debug.isMatrix) {
                isMatrix4x4 = debug.newName.includes("_m4");
                if (isMatrix4x4)
                    temp = debug.newName.split("_m4")[0];
                else
                    temp = debug.newName.split("_m3")[0];
                if (!alreadyDefined[temp]) {
                    alreadyDefined[temp] = true;
                    mainCode = this.writeMatrixTemplate(mainCode, temp, isMatrix4x4);
                }
            }
            else if (debug.isArray) {
                temp = debug.newName.split("_ar")[0];
                if (!alreadyDefined[temp]) {
                    alreadyDefined[temp] = true;
                    mainCode = this.writeArrayTemplate(mainCode, temp, debug.len, debug.primitiveType);
                }
            }
        }
        this.firstPass = false;
        return mainCode;
    }
    writeArrayTemplate(shader, computeMatrixName, arrayLen, primitiveType) {
        let abc = "abcdefghijklmnopqrstuvwxyz0123456789";
        abc += abc.toUpperCase();
        let lines = shader.split("\n");
        let line;
        const isComplexVal = (val) => {
            for (let i = 0; i < val.length; i++) {
                if (abc.includes(val[i]))
                    continue;
                else
                    return true;
            }
            return false;
        };
        let tempName;
        const writeTemplate = (computeName, matrixName) => {
            let result = "";
            let nb = arrayLen;
            let isArrayMatrix = primitiveType == "mat4";
            for (let i = 0; i < nb; i++) {
                if (!isArrayMatrix)
                    result += `computeResult.${computeName}_ar${i} = ${matrixName}[${i}];\n`;
                else {
                    result += `computeResult.${computeName}_ar${i}_m0 = ${matrixName}[${i}][0];\n`;
                    result += `computeResult.${computeName}_ar${i}_m1 = ${matrixName}[${i}][1];\n`;
                    result += `computeResult.${computeName}_ar${i}_m2 = ${matrixName}[${i}][2];\n`;
                    result += `computeResult.${computeName}_ar${i}_m3 = ${matrixName}[${i}][3];\n`;
                }
            }
            result += "\n";
            return result;
        };
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
                            }
                            else {
                                val += lines[j].split(";")[0] + "";
                                lines[j] = "";
                                break;
                            }
                        }
                    }
                    tempName = "temporaryVariable_" + this.temporaryIndex++;
                    if (primitiveType === "mat4")
                        newLine = "let " + tempName + ":array<mat4x4<f32>," + arrayLen + "> = " + val + ";\n";
                    else
                        newLine = "let " + tempName + ":array<vec4<" + primitiveType + "> = " + val + ";\n";
                    val = tempName;
                }
                newLine += writeTemplate(computeMatrixName, val);
                lines[i] = newLine;
                break;
            }
        }
        return lines.join("\n");
    }
    temporaryIndex = 0;
    writeMatrixTemplate(shader, computeMatrixName, mat4x4 = true) {
        let abc = "abcdefghijklmnopqrstuvwxyz0123456789";
        abc += abc.toUpperCase();
        let lines = shader.split("\n");
        let line;
        const isComplexVal = (val) => {
            for (let i = 0; i < val.length; i++) {
                if (abc.includes(val[i]))
                    continue;
                else
                    return true;
            }
            return false;
        };
        let tempName;
        const writeTemplate = (computeName, matrixName) => {
            let result = "";
            let nb = 4;
            if (mat4x4 == false)
                nb = 3;
            //console.log(computeName + " => mat4x4:", mat4x4);
            for (let i = 0; i < nb; i++) {
                result += `computeResult.${computeName}_m${nb}${i} = ${matrixName}[${i}];\n`;
            }
            result += "\n";
            return result;
        };
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
                            }
                            else {
                                val += lines[j].split(";")[0] + "";
                                lines[j] = "";
                                break;
                            }
                        }
                    }
                    tempName = "temporaryVariable_" + this.temporaryIndex++;
                    if (mat4x4)
                        newLine = "let " + tempName + ":mat4x4<f32> = " + val + ";\n";
                    else
                        newLine = "let " + tempName + ":mat3x3<f32> = " + val + ";\n";
                    val = tempName;
                }
                newLine += writeTemplate(computeMatrixName, val);
                lines[i] = newLine;
                break;
            }
        }
        return lines.join("\n");
    }
    buildComputeShader() {
        //this.computeShaderObj.computeUniforms = new UniformBuffer(this.computeUniforms)
        this.computeShaderObj.result = this.vertexBufferIO;
        this.computeShaderObj.global_id = BuiltIns.computeInputs.globalInvocationId;
        this.computeShaderObj.computeShader = {
            constants: this.renderPipeline.vertexShader.constants.text,
            main: this.writeComputeShader(),
        };
        this.initFromObject(this.computeShaderObj);
        let groups = this.bindGroups.groups;
        for (let i = 0; i < groups.length; i++)
            groups[i].mustRefreshBindgroup = true;
    }
    copyUniformsFromRenderToCompute() {
        if (!this.renderUniformBuffers)
            return;
        let ub;
        let itemNames;
        for (let i = 0; i < this.renderUniformBuffers.length; i++) {
            ub = this.renderUniformBuffers[i];
            itemNames = ub.resource.itemNames;
            for (let j = 0; j < itemNames.length; j++) {
                //console.log(itemNames[j], ub.resource.items[itemNames[j]])
                this.computeShaderObj[ub.name].items[itemNames[j]].set(ub.resource.items[itemNames[j]]);
            }
        }
    }
    init(renderPipeline, nbVertex) {
        if (!nbVertex)
            nbVertex = 1;
        this.config = { nbVertex };
        this.computeShaderObj = {
            bindgroups: {
                io: {}, //computeShaders have a reserved bindgroup 'io' , dedicated to the ping-pong process 
            }
        };
        this.initRenderPipeline(renderPipeline);
        this.setupIndexBuffer();
        this.setupDataStructure();
        this.setupVertexShaderBuiltIns();
        this.setupUniformBuffers();
        this.setupVertexBuffers();
        this.setupComputeShaderVertexBufferIO();
        this.buildComputeShader();
        this.onComputeBegin = () => {
            this.copyUniformsFromRenderToCompute();
        };
    }
    createEmptyArray(len) {
        const arr = [];
        for (let i = 0; i < len; i++)
            arr[i] = 0;
        return arr;
    }
    getObjectByType(type) {
        if (type === "f32")
            return VertexAttribute.Float();
        if (type === "vec2<f32>")
            return VertexAttribute.Vec2();
        if (type === "vec3<f32>")
            return VertexAttribute.Vec3();
        if (type === "vec4<f32>")
            return VertexAttribute.Vec4();
        return null;
    }
    getNbValueByType(type) {
        if (type === "f32")
            return 1;
        if (type === "vec2<f32>")
            return 2;
        if (type === "vec3<f32>")
            return 3;
        if (type === "vec4<f32>")
            return 4;
        return 0;
    }
    getNewInstanceByType(type) {
        if (type === "f32")
            return "0.0";
        if (type === "vec2<f32>")
            return "vec2(0.0)";
        if (type === "vec3<f32>")
            return "vec3(0.0)";
        if (type === "vec4<f32>")
            return "vec4(0.0)";
        return "";
    }
}
