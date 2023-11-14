// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.


export class BuiltIns {

    public static vertexInputs = {
        vertexIndex: { builtin: "@builtin(vertex_index)", type: "u32" },
        instanceIndex: { builtin: "@builtin(instance_index)", type: "u32" },
    }

    public static vertexOutputs = {
        position: { builtin: "@builtin(position)", type: "vec4<f32>" },
        Float: { type: "f32", vsOut: true },
        Vec2: { type: "vec2<f32>", vsOut: true },
        Vec3: { type: "vec3<f32>", vsOut: true },
        Vec4: { type: "vec4<f32>", vsOut: true },

    }



    public static vertexDebug = {

        Float: (instanceId: number = 0, vertexId: number = 0) => {
            return { vertexId, instanceId, type: "f32", __debug: true }
        },
        Vec2: (instanceId: number = 0, vertexId: number = 0) => {
            return { vertexId, instanceId, type: "vec2<f32>", __debug: true }
        },
        Vec3: (instanceId: number = 0, vertexId: number = 0) => {
            return { vertexId, instanceId, type: "vec3<f32>", __debug: true }
        },
        Vec4: (instanceId: number = 0, vertexId: number = 0) => {
            return { vertexId, instanceId, type: "vec4<f32>", __debug: true }
        },
        Int: (instanceId: number = 0, vertexId: number = 0) => {
            return { vertexId, instanceId, type: "i32", __debug: true }
        },
        IVec2: (instanceId: number = 0, vertexId: number = 0) => {
            return { vertexId, instanceId, type: "vec2<i32>", __debug: true }
        },
        IVec3: (instanceId: number = 0, vertexId: number = 0) => {
            return { vertexId, instanceId, type: "vec3<i32>", __debug: true }
        },
        IVec4: (instanceId: number = 0, vertexId: number = 0) => {
            return { vertexId, instanceId, type: "vec4<i32>", __debug: true }
        },
        Uint: (instanceId: number = 0, vertexId: number = 0) => {
            return { vertexId, instanceId, type: "uint", __debug: true }
        },
        UVec2: (instanceId: number = 0, vertexId: number = 0) => {
            return { vertexId, instanceId, type: "vec2<u32>", __debug: true }
        },
        UVec3: (instanceId: number = 0, vertexId: number = 0) => {
            return { vertexId, instanceId, type: "vec3<u32>", __debug: true }
        },
        UVec4: (instanceId: number = 0, vertexId: number = 0) => {
            return { vertexId, instanceId, type: "vec4<uf32>", __debug: true }
        },
        Matrix3x3: (instanceId: number = 0, vertexId: number = 0) => {
            return { vertexId, instanceId, type: "mat3x3<f32>", __debug: true }
        },
        Matrix4x4: (instanceId: number = 0, vertexId: number = 0) => {
            return { vertexId, instanceId, type: "mat4x4<f32>", __debug: true }
        },

        Vec4Array: (len: number = 1, instanceId: number = 0, vertexId: number = 0) => {
            return { vertexId, instanceId, type: "array<vec4<f32>," + len + ">", __debug: true, len, isArray: true, primitiveType: "f32" }
        },
        IVec4Array: (len: number = 1, instanceId: number = 0, vertexId: number = 0) => {
            return { vertexId, instanceId, type: "array<vec4<i32>," + len + ">", __debug: true, len, isArray: true, primitiveType: "i32" }
        },
        UVec4Array: (len: number = 1, instanceId: number = 0, vertexId: number = 0) => {
            return { vertexId, instanceId, type: "array<vec4<u32>," + len + ">", __debug: true, len, isArray: true, primitiveType: "u32" }
        },
        Matrix4x4Array: (len: number = 1, instanceId: number = 0, vertexId: number = 0) => {
            return { vertexId, instanceId, type: "array<mat4x4<f32>," + len + ">", __debug: true, len, isArray: true, primitiveType: "mat4" }
        }
    }

    public static __initDebug() {
        let o: any;

        /*
        I set the value directly to the function in order to be able to write 
        BuiltIns.vertexDebug.Float  //=> implicit {vertexId:0,instanceId:0}
        and BuiltIns.vertexDebug.Float(vertexId,instanceId)
        */

        for (let z in this.vertexDebug) {
            o = this.vertexDebug[z]();
            this.vertexDebug[z].isArray = !!o.isArray;
            this.vertexDebug[z].len = o.len;
            this.vertexDebug[z].primitiveType = o.primitiveType;
            this.vertexDebug[z].type = o.type;
            this.vertexDebug[z].__debug = true;
        }

    }


    //----

    public static fragmentInputs = {
        frontFacing: { builtin: "@builtin(front_facing)", type: "bool" },
        fragDepth: { builtin: "@builtin(frag_depth)", type: "f32" },
        sampleIndex: { builtin: "@builtin(sample_index)", type: "u32" },
        sampleMask: { builtin: "@builtin(sample_mask)", type: "u32" },
    }

    public static fragmentOutputs = {
        color: { builtin: "@location(0)", type: "vec4<f32>" }
    }

    //----

    public static computeInputs = {
        localInvocationId: { builtin: "@builtin(local_invocation_id)", type: "vec3<u32>" },
        localInvocationIndex: { builtin: "@builtin(local_invocation_index)", type: "u32" },
        globalInvocationId: { builtin: "@builtin(global_invocation_id)", type: "vec3<u32>" },
        workgroupId: { builtin: "@builtin(workgroup_id)", type: "vec3<u32>" },
        numWorkgroup: { builtin: "@builtin(num_workgroup)", type: "vec3<u32>" },
    }

    public static computeOutputs = {
        result: { builtin: "@location(0)", type: "???" }
    }
}

type BuiltIns_vertexInputs = typeof BuiltIns.vertexInputs;
type BuiltIns_vertexOutputs = typeof BuiltIns.vertexOutputs;
type BuiltIns_fragmentInputs = typeof BuiltIns.fragmentInputs;
type BuiltIns_fragmentOutputs = typeof BuiltIns.fragmentOutputs;
type BuiltIns_computeInputs = typeof BuiltIns.computeInputs;
type BuiltIns_computeOutputs = typeof BuiltIns.computeOutputs;


export type VertexShaderInput = (
    BuiltIns_vertexInputs["vertexIndex"] |
    BuiltIns_vertexInputs["instanceIndex"]
);

export type VertexShaderOutput = (
    BuiltIns_vertexOutputs["position"] |
    BuiltIns_vertexOutputs["Float"] |
    BuiltIns_vertexOutputs["Vec2"] |
    BuiltIns_vertexOutputs["Vec3"] |
    BuiltIns_vertexOutputs["Vec4"] /*|
    BuiltIns_vertexOutputs["Int"] |
    BuiltIns_vertexOutputs["IVec2"] |
    BuiltIns_vertexOutputs["IVec3"] |
    BuiltIns_vertexOutputs["IVec4"] |
    BuiltIns_vertexOutputs["Uint"] |
    BuiltIns_vertexOutputs["UVec2"] |
    BuiltIns_vertexOutputs["UVec3"] |
    BuiltIns_vertexOutputs["UVec4"]*/
);

export type FragmentShaderInput = (
    BuiltIns_fragmentInputs["frontFacing"] |
    BuiltIns_fragmentInputs["fragDepth"] |
    BuiltIns_fragmentInputs["sampleIndex"] |
    BuiltIns_fragmentInputs["sampleMask"]
);

export type FragmentShaderOutputs = BuiltIns_fragmentOutputs["color"];

export type ComputeShaderInput = (
    BuiltIns_computeInputs["localInvocationId"] |
    BuiltIns_computeInputs["localInvocationIndex"] |
    BuiltIns_computeInputs["globalInvocationId"] |
    BuiltIns_computeInputs["workgroupId"] |
    BuiltIns_computeInputs["numWorkgroup"]
);

export type ComputeShaderOutputs = BuiltIns_computeOutputs["result"];

