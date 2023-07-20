export declare class BuiltIns {
    static vertexInputs: {
        vertexIndex: {
            builtin: string;
            type: string;
        };
        instanceIndex: {
            builtin: string;
            type: string;
        };
    };
    static vertexOutputs: {
        position: {
            builtin: string;
            type: string;
        };
        Float: {
            type: string;
            vsOut: boolean;
        };
        Vec2: {
            type: string;
            vsOut: boolean;
        };
        Vec3: {
            type: string;
            vsOut: boolean;
        };
        Vec4: {
            type: string;
            vsOut: boolean;
        };
    };
    static fragmentInputs: {
        frontFacing: {
            builtin: string;
            type: string;
        };
        fragDepth: {
            builtin: string;
            type: string;
        };
        sampleIndex: {
            builtin: string;
            type: string;
        };
        sampleMask: {
            builtin: string;
            type: string;
        };
    };
    static fragmentOutputs: {
        color: {
            builtin: string;
            type: string;
        };
    };
    static computeInputs: {
        localInvocationId: {
            builtin: string;
            type: string;
        };
        localInvocationIndex: {
            builtin: string;
            type: string;
        };
        globalInvocationId: {
            builtin: string;
            type: string;
        };
        workgroupId: {
            builtin: string;
            type: string;
        };
        numWorkgroup: {
            builtin: string;
            type: string;
        };
    };
    static computeOutputs: {
        result: {
            builtin: string;
            type: string;
        };
    };
}
