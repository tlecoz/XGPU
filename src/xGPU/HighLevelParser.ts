// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { BuiltIns } from "./BuiltIns";
import { DrawConfig } from "./pipelines/resources/DrawConfig";

import { Bindgroup } from "./shader/Bindgroup";
import { PrimitiveFloatUniform, PrimitiveIntUniform, PrimitiveType, PrimitiveUintUniform } from "./PrimitiveType";
import { CubeMapTexture } from "./shader/resources/CubeMapTexture";
import { IShaderResource } from "./shader/resources/IShaderResource";
import { ImageTexture } from "./shader/resources/ImageTexture";
import { ImageTextureArray } from "./shader/resources/ImageTextureArray";
import { ImageTextureIO } from "./shader/resources/ImageTextureIO";
import { TextureSampler } from "./shader/resources/TextureSampler";
import { UniformBuffer } from "./shader/resources/UniformBuffer";
import { UniformGroup } from "./shader/resources/UniformGroup";
import { UniformGroupArray } from "./shader/resources/UniformGroupArray";
import { VertexAttribute } from "./shader/resources/VertexAttribute";
import { VertexBuffer } from "./shader/resources/VertexBuffer";
import { VertexBufferIO } from "./shader/resources/VertexBufferIO";
import { VideoTexture } from "./shader/resources/VideoTexture";



/*

export type VertexShaderDescriptor = {
    main:string,
    constants?:string,
    inputs:{
        [key:string]:VertexShaderInput
    },
    outputs:{
        [key:string]:VertexShaderOutput
    }
} | string;

export type FragmentShaderDescriptor = {
    main:string,
    constants?:string,
    inputs:{
        [key:string]:FragmentShaderInput
    },
    outputs:{
        [key:string]:FragmentShaderOutputs
    }
} | string;


export type ShaderResource = (IShaderResource | VertexBufferIO | ImageTextureIO| PrimitiveType | VertexAttribute)

export type DefaultBindgroup = {
    uniforms?:UniformBuffer
    buffer?:VertexBuffer,
    [key:string]:PipelineResource
}
export type BindgroupDescriptor = Bindgroup | {
    [key:string]:PipelineResource
}
export type BindgroupsDescriptor = {
    default?:BindgroupDescriptor,
    [key:string]:BindgroupDescriptor
}




export type RenderPipelineDescriptor = {
    vertexCount?:number,
    instanceCount?:number,
    firstVertexId?:number,
    firstInstanceId?:number,
    cullMode?: "front" | "back" | "none",
    topology?: "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip",
    frontFace?: "ccw" | "cw",
    stripIndexFormat?: "uint16" | "uint32",
    antiAliasing?: boolean,
    useDepthTexture?: boolean,
    depthTextureSize?: number,
    depthTest?: boolean,
    clearColor?: { r: number, g: number, b: number, a: number },
    blendMode?: BlendMode,
    bindgroups?: BindgroupsDescriptor,
    indexBuffer?: IndexBuffer,
    vertexShader:VertexShaderDescriptor,
    fragmentShader?:FragmentShaderDescriptor,
    //[key:string]:PipelineResource
}

*/

///export type HighLevelParserTarget = RenderPipeline | ComputePipeline | Bindgroup;

export class HighLevelParser {



    constructor() {

    }



    protected parseShaderBuiltins(descriptor: any) {

        //------------- COMPUTE INPUTS -----------------

        const addComputeInput = (name: string, val: any) => {
            if (typeof descriptor.computeShader === "string") {
                const main: string = descriptor.computeShader;
                descriptor.computeShader = {
                    main
                }
            }
            if (!descriptor.computeShader.inputs) descriptor.computeShader.inputs = {};
            descriptor.computeShader.inputs[name] = val;
        }
        const checkComputeInputBuiltIns = (name: string, o: any) => {

            for (let z in BuiltIns.computeInputs) {
                if (o === BuiltIns.computeInputs[z]) {
                    addComputeInput(name, o);
                }
            }
        }

        //-------------- COMPUTE OUTPUTS ------------
        const addComputeOutput = (name: string, val: any) => {
            if (typeof descriptor.computeShader === "string") {
                const main: string = descriptor.computeShader;
                descriptor.computeShader = {
                    main
                }
            }
            if (!descriptor.computeShader.outputs) descriptor.computeShader.outputs = {};
            descriptor.computeShader.outputs[name] = val;
        }
        const checkComputeOutputBuiltIns = (name: string, o: any) => {
            for (let z in BuiltIns.computeOutputs) {
                if (o === BuiltIns.computeOutputs[z]) {
                    addComputeOutput(name, o);
                }
            }
        }



        //------------- VERTEX INPUTS -----------------

        const addVertexInput = (name: string, val: any) => {
            if (typeof descriptor.vertexShader === "string") {
                const main: string = descriptor.vertexShader;
                descriptor.vertexShader = {
                    main
                }
            }
            if (!descriptor.vertexShader.inputs) descriptor.vertexShader.inputs = {};
            descriptor.vertexShader.inputs[name] = val;
        }
        const checkVertexInputBuiltIns = (name: string, o: any) => {

            for (let z in BuiltIns.vertexInputs) {
                if (o === BuiltIns.vertexInputs[z]) {
                    addVertexInput(name, o);
                }
            }
        }

        //-------------- VERTEX OUTPUTS ------------
        const addVertexOutput = (name: string, val: any) => {
            if (typeof descriptor.vertexShader === "string") {
                const main: string = descriptor.vertexShader;
                descriptor.vertexShader = {
                    main
                }
            }
            if (!descriptor.vertexShader.outputs) descriptor.vertexShader.outputs = {};
            descriptor.vertexShader.outputs[name] = val;
        }
        const checkVertexOutputBuiltIns = (name: string, o: any) => {
            for (let z in BuiltIns.vertexOutputs) {
                if (o === BuiltIns.vertexOutputs[z]) {
                    addVertexOutput(name, o);
                }
            }
        }

        //------------- FRAGMENT INPUTS -----------------

        const addFragmentInput = (name: string, val: any) => {
            if (typeof descriptor.fragmentShader === "string") {
                const main: string = descriptor.fragmentShader;
                descriptor.fragmentShader = {
                    main
                }
            }
            if (!descriptor.fragmentShader.inputs) descriptor.fragmentShader.inputs = {};
            descriptor.fragmentShader.inputs[name] = val;
        }
        const checkFragmentInputBuiltIns = (name: string, o: any) => {

            for (let z in BuiltIns.fragmentInputs) {
                if (o === BuiltIns.vertexInputs[z]) {
                    addFragmentInput(name, o);
                }
            }
        }

        //-------------- FRAGMENT OUTPUTS ------------
        const addFragmentOutput = (name: string, val: any) => {
            if (typeof descriptor.fragmentShader === "string") {
                const main: string = descriptor.fragmentShader;
                descriptor.fragmentShader = {
                    main
                }
            }
            if (!descriptor.fragmentShader.outputs) descriptor.fragmentShader.outputs = {};
            descriptor.fragmentShader.outputs[name] = val;
        }
        const checkFragmentOutputBuiltIns = (name: string, o: any) => {
            for (let z in BuiltIns.fragmentOutputs) {
                if (o === BuiltIns.fragmentOutputs[z]) {
                    addFragmentOutput(name, o);
                }
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) {
                checkVertexInputBuiltIns(z, o);
                checkVertexOutputBuiltIns(z, o);
                checkFragmentInputBuiltIns(z, o);
                checkFragmentOutputBuiltIns(z, o);
                checkComputeInputBuiltIns(z, o);
                checkComputeOutputBuiltIns(z, o);
            }
        }

        return descriptor;
    }

    protected parseVertexBufferIOs(descriptor: any) {

        if (this.targetIsBindgroup) return descriptor;

        const addVertexBufferIO = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.io) descriptor.bindgroups.io = {};
            descriptor.bindgroups.io[name] = o;
            return o;
        }

        const checkVertexBufferIO = (name: string, o: any) => {
            if (o instanceof VertexBufferIO) {
                addVertexBufferIO(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkVertexBufferIO(z, o);
        }

        return descriptor;
    }

    protected parseImageTextureIOs(descriptor: any) {

        if (this.targetIsBindgroup) return descriptor;

        const addTextureIO = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.io) descriptor.bindgroups.io = {};
            descriptor.bindgroups.io[name] = o;
            return o;
        }

        const checkTextureIO = (name: string, o: any) => {
            if (o instanceof ImageTextureIO) {
                addTextureIO(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkTextureIO(z, o);
        }

        return descriptor;
    }



    protected parseVertexBuffers(descriptor: any) {
        if (this.targetIsBindgroup) return descriptor;

        const addVertexBuffer = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
            descriptor.bindgroups.default[name] = o;
            return o;
        }

        const checkVertexBuffer = (name: string, o: any) => {
            if (o instanceof VertexBuffer) {
                addVertexBuffer(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkVertexBuffer(z, o);
        }

        return descriptor;
    }


    protected parseVertexAttributes(descriptor: any) {

        const addVertexAttribute = (name: string, o: any) => {

            let bindgroup: any = descriptor;

            if (!this.targetIsBindgroup) {
                if (!descriptor.bindgroups) descriptor.bindgroups = {};
                if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
                bindgroup = descriptor.bindgroups.default;
            }





            if (!bindgroup.buffer) {


                const attributes: any = {};
                attributes[name] = o;

                //console.log(attributes)

                bindgroup.buffer = new VertexBuffer(attributes);





            } else {
                const attribute = (bindgroup.buffer as VertexBuffer).createArray(name, o.type, o.offset);
                if (o.datas) attribute.datas = o.datas;
            }

            //console.log("addVertexAttribute ", name, "buffer = ", bindgroup)
        }

        const checkVertexAttribute = (name: string, o: any) => {
            if (o.type && VertexAttribute.types[o.type]) {
                addVertexAttribute(name, o);
            } else if (o instanceof VertexAttribute) {

                addVertexAttribute(name, {
                    type: o.format,
                    offset: o.dataOffset,
                    datas: o.datas
                })
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkVertexAttribute(z, o);
        }

        return descriptor;
    }






    protected parseUniformBuffers(descriptor: any) {
        if (this.targetIsBindgroup) return descriptor;

        const addUniformBuffer = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
            descriptor.bindgroups.default[name] = o;
            return o;
        }

        const checkUniformBuffer = (name: string, o: any) => {
            if (o instanceof UniformBuffer) {
                addUniformBuffer(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkUniformBuffer(z, o);
        }

        return descriptor;
    }



    protected parseUniform(descriptor: any) {

        const addUniform = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};

            let bindgroup: any = descriptor.bindgroups.default;
            let uniformBufferName: string = "uniforms";

            if (this.targetIsBindgroup) {
                bindgroup = descriptor;
                uniformBufferName = descriptor.uniformBufferName ? descriptor.uniformBufferName : "bindgroupUniforms";
            }




            if (!bindgroup[uniformBufferName]) {
                const uniforms: any = {};
                uniforms[name] = o;
                bindgroup[uniformBufferName] = new UniformBuffer(uniforms, { useLocalVariable: true });

            } else {
                (bindgroup[uniformBufferName] as UniformBuffer).add(name, o);
            }



            //console.log("addUniform ", name, " vertexBuffer = ", descriptor.bindgroups.default.buffer)
        }

        const checkUniform = (name: string, o: any) => {
            if (o instanceof PrimitiveFloatUniform || o instanceof PrimitiveIntUniform || o instanceof PrimitiveUintUniform || o instanceof UniformGroup || o instanceof UniformGroupArray) {
                addUniform(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkUniform(z, o);
        }

        return descriptor;
    }







    protected parseImageTextureArray(descriptor: any) {
        if (this.targetIsBindgroup) return descriptor;

        const addImageTextureArray = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
            descriptor.bindgroups.default[name] = o;
        }

        const checkImageTextureArray = (name: string, o: any) => {
            if (o instanceof ImageTextureArray) {
                addImageTextureArray(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkImageTextureArray(z, o);
        }

        return descriptor;
    }

    protected parseImageTexture(descriptor: any) {
        if (this.targetIsBindgroup) return descriptor;

        const addImageTexture = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
            descriptor.bindgroups.default[name] = o;
        }

        const checkImageTexture = (name: string, o: any) => {
            if (o instanceof ImageTexture) {
                addImageTexture(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkImageTexture(z, o);
        }

        return descriptor;
    }


    protected parseTextureSampler(descriptor: any) {
        if (this.targetIsBindgroup) return descriptor;

        const addTextureSampler = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
            descriptor.bindgroups.default[name] = o;
        }

        const checkTextureSampler = (name: string, o: any) => {
            if (o instanceof TextureSampler) {
                addTextureSampler(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkTextureSampler(z, o);
        }

        return descriptor;
    }

    protected parseVideoTexture(descriptor: any) {
        if (this.targetIsBindgroup) return descriptor;

        const addVideoTexture = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
            descriptor.bindgroups.default[name] = o;
        }

        const checkVideoTexture = (name: string, o: any) => {
            if (o instanceof VideoTexture) {
                addVideoTexture(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkVideoTexture(z, o);
        }

        return descriptor;
    }

    protected parseCubeMapTexture(descriptor: any) {
        if (this.targetIsBindgroup) return descriptor;

        const addCubeMapTexture = (name: string, o: any) => {
            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};
            descriptor.bindgroups.default[name] = o;
        }

        const checkCubeMapTexture = (name: string, o: any) => {
            if (o instanceof CubeMapTexture) {
                addCubeMapTexture(name, o);
            }
        }

        let o: any;
        for (let z in descriptor) {
            o = descriptor[z];
            if (o) checkCubeMapTexture(z, o);
        }

        return descriptor;
    }



    protected parseDrawConfig(descriptor: any, drawConfig: DrawConfig) {
        // vertexCount: number, instanceCount: number, firstVertexId: number, firstInstanceId: number
        if (descriptor.vertexCount) {
            if (isNaN(descriptor.vertexCount)) throw new Error("descriptor.vertexCount is a reserved keyword and must be a number");
            drawConfig.vertexCount = descriptor.vertexCount;
        }
        if (descriptor.instanceCount) {
            if (isNaN(descriptor.instanceCount)) throw new Error("descriptor.instanceCount is a reserved keyword and must be a number");
            drawConfig.instanceCount = descriptor.instanceCount;
        }
        if (descriptor.firstVertexId) {
            if (isNaN(descriptor.firstVertexId)) throw new Error("descriptor.firstVertexId is a reserved keyword and must be a number");
            drawConfig.firstVertexId = descriptor.firstVertexId;
        }
        if (descriptor.firstInstanceId) {
            if (isNaN(descriptor.firstInstanceId)) throw new Error("descriptor.firstInstanceId is a reserved keyword and must be a number");
            drawConfig.firstInstanceId = descriptor.firstInstanceId;
        }
        return descriptor;
    }

    protected parseBindgroup(descriptor: any): any {
        for (let z in descriptor) {
            if (descriptor[z] instanceof Bindgroup) {
                if (!descriptor.bindgroups) descriptor.bindgroups = {};
                descriptor.bindgroups[z] = descriptor[z];
                delete descriptor[z];
            }
        }

        return descriptor;

    }


    protected firstPass(descriptor: any, target: "render" | "compute" | "bindgroup", drawConfig?: DrawConfig): any {


        descriptor = this.parseBindgroup(descriptor);
        descriptor = this.parseVertexBuffers(descriptor);
        descriptor = this.parseVertexAttributes(descriptor);
        descriptor = this.parseUniformBuffers(descriptor);
        descriptor = this.parseUniform(descriptor);
        descriptor = this.parseImageTexture(descriptor);
        descriptor = this.parseImageTextureArray(descriptor);
        descriptor = this.parseTextureSampler(descriptor);
        descriptor = this.parseVideoTexture(descriptor);
        descriptor = this.parseCubeMapTexture(descriptor);
        descriptor = this.parseVertexBufferIOs(descriptor);
        descriptor = this.parseImageTextureIOs(descriptor);

        if (target === "render" || target === "compute") {

            //console.log("target.type = ", target)

            descriptor = this.parseShaderBuiltins(descriptor);


            if (target === "render") {
                descriptor = this.parseDrawConfig(descriptor, drawConfig);
            }
        }


        return descriptor;

    }


    //--------
    protected parseHighLevelObj(descriptor: any) {

        const isBuiltIn = (obj) => {
            for (let z in BuiltIns.vertexInputs) if (BuiltIns.vertexInputs[z] === obj) return true;
            for (let z in BuiltIns.vertexOutputs) if (BuiltIns.vertexOutputs[z] === obj) return true;
            for (let z in BuiltIns.fragmentInputs) if (BuiltIns.fragmentInputs[z] === obj) return true;
            for (let z in BuiltIns.fragmentOutputs) if (BuiltIns.fragmentOutputs[z] === obj) return true;
            for (let z in BuiltIns.computeInputs) if (BuiltIns.computeInputs[z] === obj) return true;
            return false;
        }

        const searchComplexObject = (o: any): any[] => {
            let name: string;
            let obj;
            let objs: any[] = [];

            for (let z in o) {
                //console.log("=> ", z, o[z])
                obj = o[z];
                if (!obj) continue;
                //console.log("OBJ = ", z, obj)
                name = obj.constructor.name;
                if (name === "Object") {
                    if (z !== "bindgroups" && z !== "vertexShader" && z !== "fragmentShader" && z !== "computeShader") {
                        if (!isBuiltIn(obj)) {
                            objs.push({ name, resource: obj });
                            //console.log("######## ", z)
                        }
                    }
                }
            }
            return objs;
        }

        const analyseObjects = (objs: any[]): { primitives: { name: string, containerName: string, resource: PrimitiveType }[], vertexAttributes: { name: string, containerName: string, resource: VertexAttribute }[], shaderResources: { name: string, containerName: string, resource: IShaderResource }[] } => {

            const primitives: { name: string, resource: PrimitiveType, containerName: string }[] = [];
            const vertexAttributes: { name: string, resource: VertexAttribute, containerName: string }[] = [];
            const shaderResources: { name: string, resource: IShaderResource, containerName: string }[] = [];

            let o: any;
            let resource: PrimitiveType | IShaderResource;
            let containerName: string;
            for (let i = 0; i < objs.length; i++) {
                containerName = objs[i].name;
                o = objs[i].resource;

                for (let name in o) {
                    resource = o[name];

                    if (resource instanceof PrimitiveFloatUniform || resource instanceof PrimitiveIntUniform || resource instanceof PrimitiveUintUniform) {
                        primitives.push({ containerName, name, resource });
                    } else if (resource instanceof VertexAttribute) {
                        vertexAttributes.push({ containerName, name, resource });
                    } else {
                        shaderResources.push({ containerName, name, resource });
                    }

                }
            }

            return { primitives, vertexAttributes, shaderResources };
        }

        //console.log("descriptor = ", descriptor)

        let objects: any = searchComplexObject(descriptor);
        if (objects.length) {

            if (!descriptor.bindgroups) descriptor.bindgroups = {};
            if (!descriptor.bindgroups.default) descriptor.bindgroups.default = {};

            analyseObjects(objects);

        }


        //descriptor.bindgroups.default.buffer = new VertexBuffer(attributes);



        return descriptor;
    }

    //---

    protected findAndFixRepetitionInDataStructure(o: any): any {


        let name: string;
        let obj;
        let exist = {};
        let bindgroup;
        let resource;
        let uniformBuffers: UniformBuffer[] = [];
        let bool;


        for (let z in o.bindgroups) {
            bindgroup = o.bindgroups[z];

            for (let a in bindgroup) {

                resource = bindgroup[a];

                if (resource instanceof UniformBuffer) {
                    bool = true;


                    for (let i = resource.itemNames.length - 1; i >= 0; i--) {
                        name = resource.itemNames[i];
                        obj = resource.items[name];

                        if (!exist[name]) {
                            exist[name] = obj;
                        } else {

                            resource.remove(name);

                            if (resource.itemNames.length === 0) {
                                bool = false;
                            }
                        }
                    }

                    if (bool) uniformBuffers.push(resource);
                    else {
                        bindgroup[a] = undefined;
                    }
                }
                resource = bindgroup[a];
            }
        }

        return o;
    }


    protected targetIsBindgroup: boolean;

    protected parseBindgroupEntries(descriptor: any): any {




        const uniformBufferName: string = descriptor.uniformBufferName ? descriptor.uniformBufferName : "bindgroupUniforms";
        const addUniform = (name: string, resource: PrimitiveType) => {

            if (!descriptor[uniformBufferName]) {

                const uniforms = {};
                uniforms[name] = resource;
                descriptor[uniformBufferName] = new UniformBuffer(uniforms, { useLocalVariable: true });
            } else {
                (descriptor[uniformBufferName] as UniformBuffer).add(name, resource);
            }

        }

        const vertexBufferName: string = descriptor.vertexBufferName ? descriptor.vertexBufferName : "bindgroupVertexBuffer";
        const addVertexAttribute = (name: string, resource: any) => {



            if (!descriptor[vertexBufferName]) {
                const attributes = {};
                attributes[name] = resource;
                descriptor[vertexBufferName] = new VertexBuffer(attributes)
            } else {
                const attribute: VertexAttribute = (descriptor[vertexBufferName] as VertexBuffer).createArray(name, resource.type, resource.dataOffset)
                if (resource.datas) attribute.datas = resource.datas;
            }
        }





        let resource;
        for (let z in descriptor) {
            resource = descriptor[z];
            if (!resource) continue
            if (resource instanceof PrimitiveFloatUniform || resource instanceof PrimitiveIntUniform || resource instanceof PrimitiveUintUniform) {
                addUniform(z, resource);
            } else if (VertexAttribute.types[resource.type]) {
                addVertexAttribute(z, resource)
            }
        }



        return descriptor;
    }




    public parse(descriptor: any, target: "render" | "compute" | "bindgroup", drawConfig?: DrawConfig) {

        this.targetIsBindgroup = target === "bindgroup";

        if (target === "bindgroup") {
            descriptor = this.parseBindgroupEntries(descriptor);
        } else {
            descriptor = this.firstPass(descriptor, target, drawConfig);
            descriptor = this.parseHighLevelObj(descriptor);
            descriptor = this.findAndFixRepetitionInDataStructure(descriptor);
        }

        return descriptor;
    }

    private static instance: HighLevelParser = null;
    public static parse(descriptor: any, target: "render" | "compute" | "bindgroup", drawConfig?: DrawConfig) {
        if (!this.instance) this.instance = new HighLevelParser();
        //console.log("highLevelParser = ", this.instance)
        return this.instance.parse(descriptor, target, drawConfig);
    }

}