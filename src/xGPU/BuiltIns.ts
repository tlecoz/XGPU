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

        Int: { type: "i32", vsOut: true },
        IVec2: { type: "vec2<i32>", vsOut: true },
        IVec3: { type: "vec3<i32>", vsOut: true },
        IVec4: { type: "vec4<i32>", vsOut: true },

        Uint: { type: "u32", vsOut: true },
        UVec2: { type: "vec2<u32>", vsOut: true },
        UVec3: { type: "vec3<u32>", vsOut: true },
        UVec4: { type: "vec4<u32>", vsOut: true },
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