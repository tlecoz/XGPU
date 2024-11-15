// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { XGPU } from "../XGPU";
import { Bindgroup } from "../shader/Bindgroup";
import { ComputeShader } from "../shader/ComputeShader";
import { ImageTextureIO } from "../shader/resources/ImageTextureIO";
import { VertexBuffer } from "../shader/resources/VertexBuffer";
import { VertexBufferIO } from "../shader/resources/VertexBufferIO";
import { ShaderStruct } from "../shader/shaderParts/ShaderStruct";
import { Pipeline } from "./Pipeline";
import { Bindgroups } from "../shader/Bindgroups";
import { HighLevelParser } from "../HighLevelParser";
export class ComputePipeline extends Pipeline {
    static ON_COMPUTE_SHADER_CODE_BUILT = "ON_COMPUTE_SHADER_CODE_BUILT";
    static ON_COMPUTE_BEGIN = "ON_COMPUTE_BEGIN";
    static ON_COMPUTE_END = "ON_COMPUTE_END";
    static ON_GPU_PIPELINE_BUILT = "ON_GPU_PIPELINE_BUILT";
    static ON_INIT_FROM_OBJECT = "ON_INIT_FROM_OBJECT";
    static ON_DESTROY = "ON_DESTROY";
    static ON_DEVICE_LOST = "ON_DEVICE_LOST";
    static ON_UPDATE_RESOURCES = "ON_UPDATE_RESOURCES";
    static ON_SUBMIT_QUEUE = "ON_SUBMIT_QUEUE";
    computeShader;
    //public onReceiveData: (datas: Float32Array) => void;
    gpuComputePipeline;
    workgroups;
    dispatchWorkgroup;
    bufferSize;
    textureSize; // [width,height]
    stagingBuffer;
    bufferIOs;
    textureIOs;
    onComputeBegin;
    onComputeEnd;
    onShaderBuild;
    constructor() {
        super();
        //this.computeShader = new ComputeShader();
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
            if (descriptor.computeShader instanceof ComputeShader) {
                this.computeShader = descriptor.computeShader;
            }
            else {
                if (descriptor.computeShader.constants)
                    this.computeShader.constants.text = descriptor.computeShader.constants;
                this.computeShader.main.text = descriptor.computeShader.main;
            }
            this.computeShader.inputs = createArrayOfObjects(descriptor.computeShader.inputs);
            this.computeShader.outputs = createArrayOfObjects(descriptor.computeShader.outputs);
        }
        let vertexBufferReadyToUse = true;
        for (let bufferName in this.resources.bindgroups.io) {
            if (!this.resources.bindgroups.io[bufferName].data) {
                vertexBufferReadyToUse = false;
            }
        }
        if (vertexBufferReadyToUse)
            this.nextFrame();
        this.dispatchEvent(ComputePipeline.ON_INIT_FROM_OBJECT, descriptor);
        return descriptor;
    }
    destroy() {
        this.bindGroups.destroy();
        for (let z in this.description)
            this.description[z] = null;
        for (let z in this) {
            try {
                this[z].destroy();
            }
            catch (e) {
                try {
                    this[z].destroyGpuResource();
                }
                catch (e) {
                }
            }
            this[z] = null;
        }
        this.dispatchEvent(ComputePipeline.ON_DESTROY);
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
            this.dispatchEvent(ComputePipeline.ON_DEVICE_LOST);
            this.clearAfterDeviceLostAndRebuild();
            if (new Date().getTime() - this.lastFrameTime < 100) {
                this.nextFrame();
            }
        }
        //console.log("update ", this.bindGroups)
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
        this.bindGroups.build();
        const outputs = this.computeShader.outputs;
        const inputs = this.computeShader.inputs;
        for (let i = 0; i < outputs.length; i++) {
            if (outputs[i].type.createGpuResource) { //it's a pipeline resource
                outputs[i].isOutput = true;
                inputs.push(outputs[i]);
            }
        }
        let resources = this.bindGroups.resources.types;
        for (let type in resources) {
            resources[type].forEach((o) => {
                o.resource.gpuResource.label = o.name;
            });
        }
        const inputStruct = new ShaderStruct("Input", [...inputs]);
        ;
        const shaderInfos = this.computeShader.build(this, inputStruct);
        this.dispatchEvent(ComputePipeline.ON_COMPUTE_SHADER_CODE_BUILT, shaderInfos);
        if (this.onShaderBuild)
            this.onShaderBuild(shaderInfos);
        this.description.compute = {
            module: XGPU.device.createShaderModule({ code: shaderInfos.code }),
            entryPoint: "main"
        };
        this.description.layout = this.gpuPipelineLayout;
        //console.log("description = ", this.description)
        this.deviceId = XGPU.deviceId;
        this.gpuComputePipeline = XGPU.createComputePipeline(this.description);
        this.dispatchEvent(ComputePipeline.ON_GPU_PIPELINE_BUILT);
        return this.gpuComputePipeline;
    }
    firstFrame = true;
    processingFirstFrame = false;
    waitingFrame = false;
    async nextFrame() {
        if (this.processingFirstFrame) {
            this.waitingFrame = true;
            return;
        }
        this.dispatchEvent(ComputePipeline.ON_COMPUTE_BEGIN);
        if (this.onComputeBegin)
            this.onComputeBegin();
        this.processingFirstFrame = this.firstFrame;
        this.update();
        const commandEncoder = XGPU.device.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(this.buildGpuPipeline());
        //console.log(this.dispatchWorkgroup[0]*64)
        this.bindGroups.update();
        this.bindGroups.apply(computePass);
        computePass.dispatchWorkgroups(this.dispatchWorkgroup[0], this.dispatchWorkgroup[1], this.dispatchWorkgroup[2]);
        computePass.end();
        this.dispatchEvent(ComputePipeline.ON_SUBMIT_QUEUE);
        XGPU.device.queue.submit([commandEncoder.finish()]);
        if (this.firstFrame) {
            await XGPU.device.queue.onSubmittedWorkDone();
        }
        for (let i = 0; i < this.resourceIOs.length; i++) {
            this.resourceIOs[i].getOutputData();
        }
        this.bindGroups.resources.all.forEach((o) => {
            if (o instanceof VertexBuffer) {
                if (o.resourceIO == null) {
                    o.getOutputData(o.gpuResource);
                }
            }
            else if (o.getOutputData)
                o.getOutputData(o.gpuResource);
        });
        /*
        for(let i=0;i<this.vertexBuffers.length;i++){
            this.vertexBuffers[i].getOutputData();
        }
        */
        this.firstFrame = false;
        this.processingFirstFrame = false;
        this.dispatchEvent(ComputePipeline.ON_COMPUTE_END);
        if (this.onComputeEnd)
            this.onComputeEnd();
        if (this.waitingFrame) {
            this.waitingFrame = false;
            this.nextFrame();
        }
    }
}
