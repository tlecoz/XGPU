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
    static vertexDebug: {
        Float: (instanceId?: number, vertexId?: number) => {
            vertexId: number;
            instanceId: number;
            type: string;
            __debug: boolean;
        };
        Vec2: (instanceId?: number, vertexId?: number) => {
            vertexId: number;
            instanceId: number;
            type: string;
            __debug: boolean;
        };
        Vec3: (instanceId?: number, vertexId?: number) => {
            vertexId: number;
            instanceId: number;
            type: string;
            __debug: boolean;
        };
        Vec4: (instanceId?: number, vertexId?: number) => {
            vertexId: number;
            instanceId: number;
            type: string;
            __debug: boolean;
        };
        Int: (instanceId?: number, vertexId?: number) => {
            vertexId: number;
            instanceId: number;
            type: string;
            __debug: boolean;
        };
        IVec2: (instanceId?: number, vertexId?: number) => {
            vertexId: number;
            instanceId: number;
            type: string;
            __debug: boolean;
        };
        IVec3: (instanceId?: number, vertexId?: number) => {
            vertexId: number;
            instanceId: number;
            type: string;
            __debug: boolean;
        };
        IVec4: (instanceId?: number, vertexId?: number) => {
            vertexId: number;
            instanceId: number;
            type: string;
            __debug: boolean;
        };
        Uint: (instanceId?: number, vertexId?: number) => {
            vertexId: number;
            instanceId: number;
            type: string;
            __debug: boolean;
        };
        UVec2: (instanceId?: number, vertexId?: number) => {
            vertexId: number;
            instanceId: number;
            type: string;
            __debug: boolean;
        };
        UVec3: (instanceId?: number, vertexId?: number) => {
            vertexId: number;
            instanceId: number;
            type: string;
            __debug: boolean;
        };
        UVec4: (instanceId?: number, vertexId?: number) => {
            vertexId: number;
            instanceId: number;
            type: string;
            __debug: boolean;
        };
        Matrix3x3: (instanceId?: number, vertexId?: number) => {
            vertexId: number;
            instanceId: number;
            type: string;
            __debug: boolean;
        };
        Matrix4x4: (instanceId?: number, vertexId?: number) => {
            vertexId: number;
            instanceId: number;
            type: string;
            __debug: boolean;
        };
        Vec4Array: (len?: number, instanceId?: number, vertexId?: number) => {
            vertexId: number;
            instanceId: number;
            type: string;
            __debug: boolean;
            len: number;
            isArray: boolean;
            primitiveType: string;
        };
        IVec4Array: (len?: number, instanceId?: number, vertexId?: number) => {
            vertexId: number;
            instanceId: number;
            type: string;
            __debug: boolean;
            len: number;
            isArray: boolean;
            primitiveType: string;
        };
        UVec4Array: (len?: number, instanceId?: number, vertexId?: number) => {
            vertexId: number;
            instanceId: number;
            type: string;
            __debug: boolean;
            len: number;
            isArray: boolean;
            primitiveType: string;
        };
        Matrix4x4Array: (len?: number, instanceId?: number, vertexId?: number) => {
            vertexId: number;
            instanceId: number;
            type: string;
            __debug: boolean;
            len: number;
            isArray: boolean;
            primitiveType: string;
        };
    };
    static __initDebug(): void;
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
type BuiltIns_vertexInputs = typeof BuiltIns.vertexInputs;
type BuiltIns_vertexOutputs = typeof BuiltIns.vertexOutputs;
type BuiltIns_fragmentInputs = typeof BuiltIns.fragmentInputs;
type BuiltIns_fragmentOutputs = typeof BuiltIns.fragmentOutputs;
type BuiltIns_computeInputs = typeof BuiltIns.computeInputs;
type BuiltIns_computeOutputs = typeof BuiltIns.computeOutputs;
export type VertexShaderInput = (BuiltIns_vertexInputs["vertexIndex"] | BuiltIns_vertexInputs["instanceIndex"]);
export type VertexShaderOutput = (BuiltIns_vertexOutputs["position"] | BuiltIns_vertexOutputs["Float"] | BuiltIns_vertexOutputs["Vec2"] | BuiltIns_vertexOutputs["Vec3"] | BuiltIns_vertexOutputs["Vec4"]);
export type FragmentShaderInput = (BuiltIns_fragmentInputs["frontFacing"] | BuiltIns_fragmentInputs["fragDepth"] | BuiltIns_fragmentInputs["sampleIndex"] | BuiltIns_fragmentInputs["sampleMask"]);
export type FragmentShaderOutputs = BuiltIns_fragmentOutputs["color"];
export type ComputeShaderInput = (BuiltIns_computeInputs["localInvocationId"] | BuiltIns_computeInputs["localInvocationIndex"] | BuiltIns_computeInputs["globalInvocationId"] | BuiltIns_computeInputs["workgroupId"] | BuiltIns_computeInputs["numWorkgroup"]);
export type ComputeShaderOutputs = BuiltIns_computeOutputs["result"];
export {};
