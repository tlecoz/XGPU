import { SLGPU } from "../SLGPU";
import { Bindgroups } from "../shader/Bindgroups";
import { VertexAttribute } from "../shader/resources/VertexAttribute";
import { VertexBuffer } from "../shader/resources/VertexBuffer";
import { ShaderStruct } from "../shader/shaderParts/ShaderStruct";
export class Pipeline {
    description = {};
    nbVertex;
    bindGroups;
    vertexBuffers;
    vertexShader;
    fragmentShader;
    vertexBufferLayouts;
    gpuBindgroups = [];
    gpuBindGroupLayouts = [];
    gpuPipelineLayout;
    type = null;
    constructor() {
        this.bindGroups = new Bindgroups("pipeline");
    }
    get isComputePipeline() { return this.type === "compute" || this.type === "compute_mixed"; }
    get isRenderPipeline() { return this.type === "render"; }
    get isMixedPipeline() { return this.type === "compute_mixed"; }
    _resources;
    get resources() { return this._resources; }
    initFromObject(obj) {
        this._resources = obj;
    }
    addBindgroup(group) {
        this.bindGroups.add(group);
    }
    createVertexBufferLayout() {
        this.vertexBufferLayouts = [];
        this.vertexBuffers = [];
        const groups = this.bindGroups.groups;
        let elements;
        let resource;
        let builtin = 0;
        let k = 0;
        for (let i = 0; i < groups.length; i++) {
            elements = groups[i].elements;
            for (let j = 0; j < elements.length; j++) {
                resource = elements[j].resource;
                if (resource instanceof VertexBuffer) {
                    this.vertexBuffers[k] = resource;
                    this.vertexBufferLayouts[k++] = resource.createVertexBufferLayout(builtin);
                    builtin += resource.vertexArrays.length;
                }
            }
        }
        return this.vertexBufferLayouts;
    }
    createShaderInput(shader, buffers) {
        const vertexInput = new ShaderStruct("Input", shader.inputs);
        ;
        if (buffers) {
            let arrays;
            let builtin = 0;
            for (let i = 0; i < buffers.length; i++) {
                arrays = buffers[i].vertexArrays;
                for (let j = 0; j < arrays.length; j++) {
                    vertexInput.addProperty({ name: arrays[j].name, type: arrays[j].varType, builtin: "@location(" + builtin + ")" });
                    builtin++;
                }
            }
        }
        return vertexInput;
    }
    mergeBindgroupShaders() {
        /*
        this.vertexShader = new VertexShader();
        this.fragmentShader = new FragmentShader();

        const groups = this.bindGroups.groups;
        let group: Bindgroup;
        let vertex: string = "";
        let fragment: string = "";
        let vertexInputs = [];
        let fragmentInputs = [];
        let vertexOutputs = [];
        let fragmentOutputs = [];


        for (let i = 0; i < groups.length; i++) {
            group = groups[i];
            vertex += group.vertexShader.main.text + "\n";
            fragment += group.fragmentShader.main.text + "\n";

            vertexInputs = vertexInputs.concat(group.vertexShader.inputs);
            vertexOutputs = vertexOutputs.concat(group.vertexShader.outputs);

            fragmentInputs = fragmentInputs.concat(group.fragmentShader.inputs);
            fragmentOutputs = fragmentOutputs.concat(group.fragmentShader.outputs);
        }


        this.vertexShader.main.text = vertex;
        this.vertexShader.inputs = vertexInputs;
        this.vertexShader.outputs = vertexOutputs;

        this.fragmentShader.main.text = fragment;
        this.fragmentShader.inputs = fragmentInputs;
        this.fragmentShader.outputs = fragmentOutputs;
        */
    }
    createLayouts() {
        this.gpuBindGroupLayouts = [];
        this.gpuBindgroups = [];
        this.gpuPipelineLayout = null;
        const groups = this.bindGroups.groups;
        let elements;
        let resource;
        let layout, group;
        let layouts = [];
        let k, n = 0;
        for (let i = 0; i < groups.length; i++) {
            elements = groups[i].elements;
            layout = layouts[i] = { entries: [] };
            group = { entries: [], layout: null };
            k = 0;
            for (let j = 0; j < elements.length; j++) {
                resource = elements[j].resource;
                if (!(resource instanceof VertexBuffer) || this.isComputePipeline) {
                    layout.entries[k] = resource.createBindGroupLayoutEntry(k);
                    group.entries[k] = resource.createBindGroupEntry(k);
                    k++;
                }
            }
            if (k > 0) {
                group.layout = this.gpuBindGroupLayouts[n] = SLGPU.createBindgroupLayout(layout);
                this.gpuBindgroups[n] = SLGPU.createBindgroup(group);
                n++;
                //console.log("-----")
                //console.log(layout);
                //console.log(group)
            }
        }
        //console.log("this.gpuBindGroupLayouts", this.gpuBindGroupLayouts)
        this.gpuPipelineLayout = SLGPU.createPipelineLayout({ bindGroupLayouts: this.gpuBindGroupLayouts });
    }
    initPipelineResources(pipeline) {
        const resources = this.bindGroups.resources.all;
        for (let i = 0; i < resources.length; i++)
            resources[i].setPipelineType(pipeline.type);
    }
    build() {
        this.createVertexBufferLayout();
        this.createLayouts();
    }
    update(o) {
        if (o) {
        }
        //must be overided
    }
    getResourceName(resource) {
        if (resource instanceof VertexAttribute) {
            if (this.type !== "render") {
                const buffer = resource.vertexBuffer;
                const bufferName = this.bindGroups.getNameByResource(buffer);
                return bufferName + "." + resource.name;
            }
            else {
                return resource.name;
            }
        }
        else {
            if (resource.uniformBuffer) {
                const bufferName = this.bindGroups.getNameByResource(resource.uniformBuffer);
                return bufferName + "." + resource.name;
            }
            else {
                return this.bindGroups.getNameByResource(resource);
            }
        }
    }
}
