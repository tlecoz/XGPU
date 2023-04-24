export class BuiltIns {

    public static vertexInputs = {
        vertexIndex: { builtin: "@builtin(vertex_index)", type: "u32" },
        instanceIndex: { builtin: "@builtin(instance_index)", type: "u32" },
    }

    public static vertexOutputs = {
        position: { builtin: "@builtin(position)", type: "vec4<f32>" }
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