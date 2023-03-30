import { SLGPU } from "../SLGPU";
import { Bindgroup } from "../shader/Bindgroup";
import { Bindgroups } from "../shader/Bindgroups";
import { FragmentShader } from "../shader/FragmentShader";
import { IShaderResource } from "../shader/resources/IShaderResource";
import { VertexAttribute } from "../shader/resources/VertexAttribute";
import { VertexBuffer } from "../shader/resources/VertexBuffer";
import { ShaderStruct } from "../shader/shaderParts/ShaderStruct";
import { VertexShader } from "../shader/VertexShader";


export class Pipeline {

    public description: any = {};
    public nbVertex: number;
    public bindGroups: Bindgroups;
    public vertexBuffers: VertexBuffer[];


    public vertexShader: VertexShader;
    public fragmentShader: FragmentShader;

    protected vertexBufferLayouts: Iterable<GPUVertexBufferLayout>;
    protected gpuBindgroups: GPUBindGroup[] = [];
    protected gpuBindGroupLayouts: GPUBindGroupLayout[] = [];
    protected gpuPipelineLayout: GPUPipelineLayout;
    protected type: "compute" | "compute_mixed" | "render" = null;

    constructor() {
        this.bindGroups = new Bindgroups("pipeline");
    }
    public get isComputePipeline(): boolean { return this.type === "compute" || this.type === "compute_mixed"; }
    public get isRenderPipeline(): boolean { return this.type === "render"; }
    public get isMixedPipeline(): boolean { return this.type === "compute_mixed"; }


    protected _resources: any;
    public get resources(): any { return this._resources; }
    public initFromObject(obj: any) {
        this._resources = obj;
    }


    public addBindgroup(group: Bindgroup) {
        this.bindGroups.add(group);
    }



    protected createVertexBufferLayout(): any {



        this.vertexBufferLayouts = [];
        this.vertexBuffers = [];

        const groups: Bindgroup[] = this.bindGroups.groups;
        let elements: { name: string, resource: IShaderResource }[];
        let resource: IShaderResource;
        let builtin: number = 0;
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

    protected createShaderInput(shader: VertexShader, buffers: VertexBuffer[]): ShaderStruct {
        const vertexInput: ShaderStruct = new ShaderStruct("Input", shader.inputs);;

        if (buffers) {
            let arrays: VertexAttribute[];
            let builtin: number = 0;
            for (let i = 0; i < buffers.length; i++) {
                arrays = buffers[i].vertexArrays;
                for (let j = 0; j < arrays.length; j++) {
                    vertexInput.addProperty({ name: arrays[j].name, type: arrays[j].varType, builtin: "@location(" + builtin + ")" })
                    builtin++;
                }
            }
        }

        return vertexInput;
    }

    protected mergeBindgroupShaders(): void {
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



    protected createLayouts(): void {


        this.gpuBindGroupLayouts = [];
        this.gpuBindgroups = [];
        this.gpuPipelineLayout = null;


        const groups: Bindgroup[] = this.bindGroups.groups;
        let elements: { name: string, resource: IShaderResource }[];
        let resource: IShaderResource;
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
                    group.entries[k] = resource.createBindGroupEntry(k)
                    k++;
                }
            }

            if (k > 0) {
                group.layout = this.gpuBindGroupLayouts[n] = SLGPU.createBindgroupLayout(layout)
                this.gpuBindgroups[n] = SLGPU.createBindgroup(group)
                n++;

                //console.log("-----")
                //console.log(layout);
                //console.log(group)
            }


        }
        //console.log("this.gpuBindGroupLayouts", this.gpuBindGroupLayouts)

        this.gpuPipelineLayout = SLGPU.createPipelineLayout({ bindGroupLayouts: this.gpuBindGroupLayouts })
    }

    protected initPipelineResources(pipeline: Pipeline) {
        const resources: IShaderResource[] = this.bindGroups.resources.all;
        for (let i = 0; i < resources.length; i++) resources[i].setPipelineType(pipeline.type);
    }


    protected build() {

        this.createVertexBufferLayout();
        this.createLayouts();

    }


    public update(o: any) {
        if (o) {

        }
        //must be overided
    }
}