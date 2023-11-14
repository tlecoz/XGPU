// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
export class BuiltIns {
    static vertexInputs = {
        vertexIndex: { builtin: "@builtin(vertex_index)", type: "u32" },
        instanceIndex: { builtin: "@builtin(instance_index)", type: "u32" },
    };
    static vertexOutputs = {
        position: { builtin: "@builtin(position)", type: "vec4<f32>" },
        Float: { type: "f32", vsOut: true },
        Vec2: { type: "vec2<f32>", vsOut: true },
        Vec3: { type: "vec3<f32>", vsOut: true },
        Vec4: { type: "vec4<f32>", vsOut: true },
    };
    static vertexDebug = {
        Float: (instanceId = 0, vertexId = 0) => {
            return { vertexId, instanceId, type: "f32", __debug: true };
        },
        Vec2: (instanceId = 0, vertexId = 0) => {
            return { vertexId, instanceId, type: "vec2<f32>", __debug: true };
        },
        Vec3: (instanceId = 0, vertexId = 0) => {
            return { vertexId, instanceId, type: "vec3<f32>", __debug: true };
        },
        Vec4: (instanceId = 0, vertexId = 0) => {
            return { vertexId, instanceId, type: "vec4<f32>", __debug: true };
        },
        Int: (instanceId = 0, vertexId = 0) => {
            return { vertexId, instanceId, type: "i32", __debug: true };
        },
        IVec2: (instanceId = 0, vertexId = 0) => {
            return { vertexId, instanceId, type: "vec2<i32>", __debug: true };
        },
        IVec3: (instanceId = 0, vertexId = 0) => {
            return { vertexId, instanceId, type: "vec3<i32>", __debug: true };
        },
        IVec4: (instanceId = 0, vertexId = 0) => {
            return { vertexId, instanceId, type: "vec4<i32>", __debug: true };
        },
        Uint: (instanceId = 0, vertexId = 0) => {
            return { vertexId, instanceId, type: "uint", __debug: true };
        },
        UVec2: (instanceId = 0, vertexId = 0) => {
            return { vertexId, instanceId, type: "vec2<u32>", __debug: true };
        },
        UVec3: (instanceId = 0, vertexId = 0) => {
            return { vertexId, instanceId, type: "vec3<u32>", __debug: true };
        },
        UVec4: (instanceId = 0, vertexId = 0) => {
            return { vertexId, instanceId, type: "vec4<uf32>", __debug: true };
        },
        Matrix3x3: (instanceId = 0, vertexId = 0) => {
            return { vertexId, instanceId, type: "mat3x3<f32>", __debug: true };
        },
        Matrix4x4: (instanceId = 0, vertexId = 0) => {
            return { vertexId, instanceId, type: "mat4x4<f32>", __debug: true };
        },
        Vec4Array: (len = 1, instanceId = 0, vertexId = 0) => {
            return { vertexId, instanceId, type: "array<vec4<f32>," + len + ">", __debug: true, len, isArray: true, primitiveType: "f32" };
        },
        IVec4Array: (len = 1, instanceId = 0, vertexId = 0) => {
            return { vertexId, instanceId, type: "array<vec4<i32>," + len + ">", __debug: true, len, isArray: true, primitiveType: "i32" };
        },
        UVec4Array: (len = 1, instanceId = 0, vertexId = 0) => {
            return { vertexId, instanceId, type: "array<vec4<u32>," + len + ">", __debug: true, len, isArray: true, primitiveType: "u32" };
        },
        Matrix4x4Array: (len = 1, instanceId = 0, vertexId = 0) => {
            return { vertexId, instanceId, type: "array<mat4x4<f32>," + len + ">", __debug: true, len, isArray: true, primitiveType: "mat4" };
        }
    };
    static __initDebug() {
        let o;
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
    static fragmentInputs = {
        frontFacing: { builtin: "@builtin(front_facing)", type: "bool" },
        fragDepth: { builtin: "@builtin(frag_depth)", type: "f32" },
        sampleIndex: { builtin: "@builtin(sample_index)", type: "u32" },
        sampleMask: { builtin: "@builtin(sample_mask)", type: "u32" },
    };
    static fragmentOutputs = {
        color: { builtin: "@location(0)", type: "vec4<f32>" }
    };
    //----
    static computeInputs = {
        localInvocationId: { builtin: "@builtin(local_invocation_id)", type: "vec3<u32>" },
        localInvocationIndex: { builtin: "@builtin(local_invocation_index)", type: "u32" },
        globalInvocationId: { builtin: "@builtin(global_invocation_id)", type: "vec3<u32>" },
        workgroupId: { builtin: "@builtin(workgroup_id)", type: "vec3<u32>" },
        numWorkgroup: { builtin: "@builtin(num_workgroup)", type: "vec3<u32>" },
    };
    static computeOutputs = {
        result: { builtin: "@location(0)", type: "???" }
    };
}
