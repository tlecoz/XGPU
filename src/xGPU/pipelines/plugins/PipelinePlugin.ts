// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { ShaderNode } from "../../shader/shaderParts/ShaderNode";
import { Pipeline } from "../Pipeline";

export class PipelinePlugin {

    protected target: Pipeline;
    protected requiredNames: any;

    public bindgroupResources: any = {};



    public vertexShader: {
        outputs?: any,
        inputs?: any,
        constants?: string,
        main?: string | string[],
    } = {};

    public fragmentShader: {
        outputs?: any,
        inputs?: any,
        constants?: string,
        main?: string | string[],
    } = {};

    constructor(target: Pipeline, required?: any) {
        this.target = target;

        if (required) {
            this.requiredNames = {};
            for (let z in required) {
                this.requiredNames[z] = target.getResourceName(required[z]);
            }
        }

    }

    public apply(vertexShaderNode: ShaderNode = null, fragmentShaderNode: ShaderNode = null): PipelinePlugin {



        //if (!this.target.resources.bindgroups.plugins) this.target.resources.bindgroups.plugins = {};
        //const plugins = this.target.resources.bindgroups.plugins;
        let plugins;
        for (let z in this.target.resources.bindgroups) {
            plugins = this.target.resources.bindgroups[z];
            break;
        }


        for (let z in this.bindgroupResources) plugins[z] = this.bindgroupResources[z];



        //------ VERTEX SHADER --------



        let vs = this.target.resources.vertexShader;
        if (typeof vs === "string") vs = { main: vs }

        if (this.vertexShader.outputs) {
            if (!vs.outputs) vs.outputs = {};
            for (let z in this.vertexShader.outputs) {
                vs.outputs[z] = this.vertexShader.outputs[z];
            }
        }

        if (this.vertexShader.inputs) {
            if (!vs.inputs) vs.inputs = {};
            for (let z in this.vertexShader.inputs) {
                vs.inputs[z] = this.vertexShader.inputs[z];
            }
        }

        if (this.vertexShader.constants) {
            if (!vs.constants) vs.constants = "";
            vs.constants += this.vertexShader.constants;
        }

        if (this.vertexShader.main) {
            let main: string;
            if (typeof this.vertexShader.main === "string") main = this.vertexShader.main as string;
            else main = (this.vertexShader.main as string[]).join("\n");

            if (vertexShaderNode) vertexShaderNode.text = main;
            else {
                if (!vs.main) vs.main = "";
                vs.main += main;
            }
        }
        this.target.resources.vertexShader = vs;

        //-------- FRAGMENT SHADER --------
        let fs = this.target.resources.fragmentShader;
        if (typeof fs === "string") fs = { main: fs };

        if (this.fragmentShader.outputs) {
            if (!fs.outputs) fs.outputs = {};
            for (let z in this.fragmentShader.outputs) {
                fs.outputs[z] = this.fragmentShader.outputs[z];
            }
        }

        if (this.fragmentShader.inputs) {
            if (!fs.inputs) fs.inputs = {};
            for (let z in this.fragmentShader.inputs) {
                fs.inputs[z] = this.fragmentShader.inputs[z];
            }
        }

        if (this.fragmentShader.constants) {
            if (!fs.constants) fs.constants = "";
            fs.constants += this.fragmentShader.constants;
        }

        if (this.fragmentShader.main) {
            let main: string;
            if (typeof this.fragmentShader.main === "string") main = this.fragmentShader.main as string;
            else main = (this.fragmentShader.main as string[]).join("\n");

            if (fragmentShaderNode) fragmentShaderNode.text = main;
            else {
                if (!fs.main) fs.main = "";
                fs.main += main;
            }
        }
        this.target.resources.fragmentShader = fs;

        this.target.initFromObject(this.target.resources);

        return this;
    }



}