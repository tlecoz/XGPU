/// <reference types="dist" />
import { Bindgroup } from "../shader/Bindgroup";
import { FragmentShader } from "../shader/FragmentShader";
import { VertexAttribute } from "../shader/resources/VertexAttribute";
import { VertexBuffer } from "../shader/resources/VertexBuffer";
import { VertexShader } from "../shader/VertexShader";
import { Pipeline } from "./Pipeline";
import { BlendMode } from "../blendmodes/BlendMode";
import { DepthStencilTexture } from "./resources/textures/DepthStencilTexture";
import { MultiSampleTexture } from "./resources/textures/MultiSampleTexture";
import { RenderPassTexture } from "./resources/textures/RenderPassTexture";
import { IndexBuffer } from "./resources/IndexBuffer";
import { IShaderResource } from "../shader/resources/IShaderResource";
import { IRenderer } from "../IRenderer";
import { DrawConfig } from "./resources/DrawConfig";
import { FragmentShaderInput, FragmentShaderOutputs, VertexShaderInput, VertexShaderOutput } from "../BuiltIns";
import { VertexBufferIO } from "../shader/resources/VertexBufferIO";
import { ImageTextureIO } from "../shader/resources/ImageTextureIO";
import { PrimitiveType } from "../PrimitiveType";
import { UniformBuffer } from "../shader/resources/UniformBuffer";
import { VertexShaderDebuggerPipeline } from "./VertexShaderDebuggerPipeline";
export type HighLevelShaderResource = (IShaderResource | VertexBufferIO | ImageTextureIO | PrimitiveType | VertexAttribute);
export type BindgroupDescriptor = {
    [key: string]: HighLevelShaderResource;
};
export type DefaultBindgroup = BindgroupDescriptor & {
    uniforms?: UniformBuffer;
    buffer?: VertexBuffer;
};
export type BindgroupsDescriptor = {
    default?: DefaultBindgroup;
    [key: string]: (Bindgroup | BindgroupDescriptor);
};
export type VertexShaderDescriptor = {
    main: string;
    constants?: string;
    inputs: {
        [key: string]: VertexShaderInput;
    };
    outputs: {
        [key: string]: VertexShaderOutput;
    };
} | string;
export type FragmentShaderDescriptor = {
    main: string;
    constants?: string;
    inputs: {
        [key: string]: FragmentShaderInput;
    };
    outputs: {
        [key: string]: FragmentShaderOutputs;
    };
} | string;
export type RenderPipelineProperties = {
    vertexShader: VertexShaderDescriptor;
    vertexCount?: number;
    instanceCount?: number;
    debugVertexCount?: number;
    firstVertexId?: number;
    firstInstanceId?: number;
    cullMode?: "front" | "back" | "none";
    topology?: "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip";
    frontFace?: "ccw" | "cw";
    stripIndexFormat?: "uint16" | "uint32";
    antiAliasing?: boolean;
    useDepthTexture?: boolean;
    depthTextureSize?: number;
    depthTest?: boolean;
    clearColor?: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    blendMode?: BlendMode;
    bindgroups?: BindgroupsDescriptor;
    indexBuffer?: IndexBuffer;
    fragmentShader?: FragmentShaderDescriptor;
};
export type RenderPipelineDescriptor = RenderPipelineProperties & BindgroupDescriptor;
export declare class RenderPipeline extends Pipeline {
    static ON_ADDED_TO_RENDERER: string;
    static ON_REMOVED_FROM_RENDERER: string;
    static ON_DRAW_BEGIN: string;
    static ON_DRAW_END: string;
    static ON_DRAW: string;
    static ON_GPU_PIPELINE_BUILT: string;
    static ON_LOG: string;
    static ON_VERTEX_SHADER_CODE_BUILT: string;
    static ON_FRAGMENT_SHADER_CODE_BUILT: string;
    static ON_INIT_FROM_OBJECT: string;
    static ON_DEVICE_LOST: string;
    static ON_UPDATE_RESOURCES: string;
    protected _renderer: IRenderer;
    get renderer(): IRenderer;
    set renderer(renderer: IRenderer);
    drawConfig: DrawConfig;
    protected multiSampleTextureDescriptor: any;
    protected waitingMultisampleTexture: boolean;
    protected multisampleTexture: MultiSampleTexture;
    protected waitingDepthStencilTexture: boolean;
    protected depthStencilTextureDescriptor: any;
    protected _depthStencilTexture: DepthStencilTexture;
    protected renderPassTexture: RenderPassTexture;
    outputColor: any;
    renderPassDescriptor: any;
    protected vertexShaderDebuggerPipeline: VertexShaderDebuggerPipeline;
    protected gpuPipeline: GPURenderPipeline;
    debug: string;
    constructor(bgColor?: {
        r: number;
        g: number;
        b: number;
        a: number;
    });
    get depthStencilTexture(): DepthStencilTexture;
    destroy(): void;
    initFromObject(descriptor: {
        cullMode?: "front" | "back" | "none";
        topology?: "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip";
        frontFace?: "ccw" | "cw";
        stripIndexFormat?: "uint16" | "uint32";
        keepRendererAspectRatio?: boolean;
        vertexCount?: number;
        instanceCount?: number;
        debugVertexCount?: number;
        antiAliasing?: boolean;
        useDepthTexture?: boolean;
        depthTextureSize?: number;
        depthTest?: boolean;
        clearColor?: {
            r: number;
            g: number;
            b: number;
            a: number;
        };
        blendMode?: BlendMode;
        bindgroups?: any;
        indexBuffer?: IndexBuffer;
        vertexShader: {
            main: string;
            outputs?: any;
            inputs?: any;
            constants?: string;
        } | string | VertexShader;
        fragmentShader?: {
            main: string;
            outputs?: any;
            inputs?: any;
            constants?: string;
        } | string | FragmentShader;
        [key: string]: unknown;
    }): any;
    protected _clearValue: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    get clearValue(): {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    createColorAttachment(rgba: {
        r: number;
        g: number;
        b: number;
        a: number;
    }, view?: GPUTextureView): any;
    setupDraw(o: {
        vertexCount: number;
        instanceCount?: number;
        firstVertexId?: number;
        firstInstanceId?: number;
        indexBuffer?: IndexBuffer;
        baseVertex?: number;
    }): void;
    get debugVertexCount(): number;
    set debugVertexCount(n: number);
    get vertexCount(): number;
    set vertexCount(n: number);
    get instanceCount(): number;
    set instanceCount(n: number);
    get firstVertexId(): number;
    set firstVertexId(n: number);
    get firstInstanceId(): number;
    set firstInstanceId(n: number);
    get baseVertex(): number;
    set baseVertex(n: number);
    setupMultiSampleView(descriptor?: {
        size?: GPUExtent3D;
        format?: GPUTextureFormat;
        usage?: GPUTextureUsageFlags;
        sampleCount?: GPUSize32;
        alphaToCoverageEnabled?: boolean;
        mask?: number;
        resolveTarget?: GPUTextureView;
    }): void;
    setupDepthStencilView(descriptor?: {
        size?: GPUExtent3D;
        format?: "stencil8" | "depth16unorm" | "depth24plus" | "depth24plus-stencil8" | "depth32float";
        usage?: GPUTextureUsageFlags;
        sampleCount?: number;
    }, depthStencilDescription?: {
        depthWriteEnabled: boolean;
        depthCompare: "never" | "less" | "equal" | "less-equal" | "greater" | "not-equal" | "greater-equal" | "always";
    }, depthStencilAttachmentOptions?: any): void;
    get renderPassView(): GPUTextureView;
    get renderPass(): RenderPassTexture;
    get useRenderPassTexture(): boolean;
    protected cleanInputs(): any[];
    blendMode: BlendMode;
    private getFragmentShaderColorOptions;
    protected rebuildingAfterDeviceLost: boolean;
    onRebuildStartAfterDeviceLost: () => void;
    clearAfterDeviceLostAndRebuild(): void;
    private buildingPipeline;
    buildGpuPipeline(): GPURenderPipeline;
    private clearOpReady;
    private rendererUseSinglePipeline;
    beginRenderPass(commandEncoder: GPUCommandEncoder, outputView?: GPUTextureView, drawCallId?: number, usingRenderPassTexture?: boolean): GPURenderPassEncoder;
    private handleOutputColor;
    update(): void;
    draw(renderPass: GPURenderPassEncoder): void;
    end(commandEncoder: GPUCommandEncoder, renderPass: any): void;
    get resourceDefined(): boolean;
    get pipeline(): GPURenderPipeline;
    get cullMode(): "front" | "back" | "none";
    set cullMode(s: "front" | "back" | "none");
    get topology(): "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip";
    set topology(s: "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip");
    get frontFace(): "ccw" | "cw";
    set frontFace(s: "ccw" | "cw");
    get stripIndexFormat(): "uint16" | "uint32";
    set stripIndexFormat(s: "uint16" | "uint32");
}
