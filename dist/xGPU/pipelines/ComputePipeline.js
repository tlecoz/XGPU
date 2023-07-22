// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { XGPU } from "../XGPU";
import { Bindgroup } from "../shader/Bindgroup";
import { ComputeShader } from "../shader/ComputeShader";
import { ImageTextureIO } from "../shader/resources/ImageTextureIO";
import { VertexBufferIO } from "../shader/resources/VertexBufferIO";
import { ShaderStruct } from "../shader/shaderParts/ShaderStruct";
import { Pipeline } from "./Pipeline";
import { Bindgroups } from "../shader/Bindgroups";
import { HighLevelParser } from "../HighLevelParser";
export class ComputePipeline extends Pipeline {
    computeShader;
    onReceiveData;
    gpuComputePipeline;
    workgroups;
    dispatchWorkgroup;
    bufferSize;
    textureSize; // [width,height]
    stagingBuffer;
    bufferIOs;
    textureIOs;
    constructor() {
        super();
        this.computeShader = new ComputeShader();
        this.type = "compute";
    }
    set useRenderPipeline(b) {
        if (b)
            this.type = "compute_mixed";
        else
            this.type = "compute";
    }
    initFromObject(descriptor) {
        this._resources = {};
        this.vertexShader = null;
        this.fragmentShader = null;
        this.bindGroups.destroy();
        this.bindGroups = new Bindgroups(this, "pipeline");
        /*
        descriptor = this.highLevelParse(descriptor);
        descriptor = this.findAndFixRepetitionInDataStructure(descriptor);
        */
        descriptor = HighLevelParser.parse(descriptor, "compute");
        super.initFromObject(descriptor);
        if (descriptor.bindgroups) {
            let group;
            for (let z in descriptor.bindgroups) {
                group = new Bindgroup();
                group.name = z;
                group.initFromObject(descriptor.bindgroups[z]);
                this.bindGroups.add(group);
            }
            if (descriptor.bindgroups.default) {
                if (descriptor.bindgroups.default.buffer) {
                    const attributes = descriptor.bindgroups.default.buffer.attributes;
                    for (let z in attributes) {
                        if (descriptor[z])
                            descriptor[z] = attributes[z];
                    }
                }
            }
        }
        const createArrayOfObjects = (obj) => {
            const result = [];
            let o;
            for (let z in obj) {
                o = obj[z];
                result.push({ name: z, ...o });
            }
            return result;
        };
        this.computeShader = new ComputeShader();
        if (typeof descriptor.computeShader === "string") {
            this.computeShader.main.text = descriptor.computeShader;
        }
        else {
            this.computeShader.inputs = createArrayOfObjects(descriptor.computeShader.inputs);
            this.computeShader.outputs = createArrayOfObjects(descriptor.computeShader.outputs);
            if (descriptor.computeShader.constants)
                this.computeShader.constants.text = descriptor.computeShader.constants;
            this.computeShader.main.text = descriptor.computeShader.main;
        }
        return descriptor;
    }
    setWorkgroups(x, y = 1, z = 1) {
        this.workgroups = [x, y, z];
    }
    setDispatchWorkgroup(x = 1, y = 1, z = 1) {
        this.dispatchWorkgroup = [x, y, z];
    }
    vertexBufferIOs = [];
    imageTextureIOs = [];
    resourceIOs = [];
    nbVertexMax = 0;
    widthMax = 0;
    heightMax = 0;
    initResourceIOs() {
        const resources = this.bindGroups.resources.io;
        if (!resources)
            return;
        let res;
        let io;
        //console.log("IOOOO = ", resources)
        for (let z in resources) {
            res = resources[z];
            io = res.resourceIO;
            if (io instanceof VertexBufferIO) {
                if (this.vertexBufferIOs.indexOf(io) === -1) {
                    this.resourceIOs.push(io);
                    if (io.nbVertex > this.nbVertexMax)
                        this.nbVertexMax = io.nbVertex;
                    this.vertexBufferIOs.push(io);
                }
            }
            else if (io instanceof ImageTextureIO) {
                if (this.imageTextureIOs.indexOf(io) === -1) {
                    this.resourceIOs.push(io);
                    if (io.width > this.widthMax)
                        this.widthMax = io.width;
                    if (io.height > this.heightMax)
                        this.heightMax = io.height;
                    this.imageTextureIOs.push(io);
                }
            }
            else {
            }
        }
    }
    deviceId;
    lastFrameTime = -1;
    update() {
        if (!this.gpuComputePipeline)
            return;
        if (this.deviceId !== XGPU.deviceId) {
            this.deviceId = XGPU.deviceId;
            this.clearAfterDeviceLostAndRebuild();
            if (new Date().getTime() - this.lastFrameTime < 100) {
                this.nextFrame();
            }
        }
        this.bindGroups.update();
        this.lastFrameTime = new Date().getTime();
    }
    setupDefaultWorkgroups() {
        if (this.vertexBufferIOs.length) {
            let n = 64;
            while (this.nbVertexMax / n >= 65536)
                n *= 2;
            this.setWorkgroups(n);
            this.setDispatchWorkgroup(Math.ceil(this.nbVertexMax / n));
        }
        else {
            this.setWorkgroups(1);
            this.setDispatchWorkgroup(this.widthMax, this.heightMax);
        }
    }
    rebuildingAfterDeviceLost = false;
    clearAfterDeviceLostAndRebuild() {
        console.warn("ComputePipeline.clearAfterDeviceLostAndRebuild()");
        this.gpuComputePipeline = null;
        this.rebuildingAfterDeviceLost = true;
        super.clearAfterDeviceLostAndRebuild();
        //this.buildGpuPipeline();
    }
    buildGpuPipeline() {
        //console.log("buildGpuPipeline ", this.gpuComputePipeline)
        if (this.gpuComputePipeline)
            return this.gpuComputePipeline;
        this.initPipelineResources(this);
        this.createLayouts();
        this.bindGroups.handleComputePipelineResourceIOs();
        this.initResourceIOs();
        if (!this.workgroups)
            this.setupDefaultWorkgroups();
        const outputs = this.computeShader.outputs;
        const inputs = this.computeShader.inputs;
        for (let i = 0; i < outputs.length; i++) {
            if (outputs[i].type.createGpuResource) { //it's a pipeline resource
                outputs[i].isOutput = true;
                inputs.push(outputs[i]);
            }
        }
        const inputStruct = new ShaderStruct("Input", [...inputs]);
        ;
        const { code } = this.computeShader.build(this, inputStruct);
        this.description.compute = {
            module: XGPU.device.createShaderModule({ code: code }),
            entryPoint: "main"
        };
        this.description.layout = this.gpuPipelineLayout;
        //console.log("description = ", this.description)
        this.deviceId = XGPU.deviceId;
        this.gpuComputePipeline = XGPU.createComputePipeline(this.description);
        return this.gpuComputePipeline;
    }
    async nextFrame() {
        this.update();
        const commandEncoder = XGPU.device.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(this.buildGpuPipeline());
        this.bindGroups.update();
        this.bindGroups.apply(computePass);
        computePass.dispatchWorkgroups(this.dispatchWorkgroup[0], this.dispatchWorkgroup[1], this.dispatchWorkgroup[2]);
        computePass.end();
        XGPU.device.queue.submit([commandEncoder.finish()]);
        for (let i = 0; i < this.resourceIOs.length; i++) {
            //console.log(i, "getOutputData")
            this.resourceIOs[i].getOutputData();
        }
    }
}
