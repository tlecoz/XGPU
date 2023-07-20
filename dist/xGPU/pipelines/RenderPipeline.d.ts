/// <reference types="dist" />
import { Pipeline } from "./Pipeline";
import { BlendMode } from "./resources/blendmodes/BlendMode";
import { DepthStencilTexture } from "./resources/textures/DepthStencilTexture";
import { MultiSampleTexture } from "./resources/textures/MultiSampleTexture";
import { RenderPassTexture } from "./resources/textures/RenderPassTexture";
import { IndexBuffer } from "./resources/IndexBuffer";
import { IRenderer } from "../IRenderer";
import { DrawConfig } from "./DrawConfig";
export declare class RenderPipeline extends Pipeline {
    renderer: IRenderer;
    drawConfig: DrawConfig;
    protected _depthStencilTexture: DepthStencilTexture;
    protected multisampleTexture: MultiSampleTexture;
    protected renderPassTexture: RenderPassTexture;
    outputColor: any;
    renderPassDescriptor: any;
    protected gpuPipeline: GPURenderPipeline;
    debug: string;
    onDrawBegin: () => void;
    onDrawEnd: () => void;
    onDraw: (drawCallId: number) => void;
    constructor(renderer: IRenderer, bgColor?: {
        r: number;
        g: number;
        b: number;
        a: number;
    });
    get canvas(): any;
    get depthStencilTexture(): DepthStencilTexture;
    destroy(): void;
    initFromObject(descriptor: {
        cullMode?: "front" | "back" | "none";
        topology?: "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip";
        frontFace?: "ccw" | "cw";
        stripIndexFormat?: "uint16" | "uint32";
        keepRendererAspectRatio?: boolean;
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
        } | string;
        fragmentShader?: {
            main: string;
            outputs?: any;
            inputs?: any;
            constants?: string;
        } | string;
        [key: string]: unknown;
    }): {
        [key: string]: unknown;
        cullMode?: "front" | "back" | "none";
        topology?: "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip";
        frontFace?: "ccw" | "cw";
        stripIndexFormat?: "uint16" | "uint32";
        keepRendererAspectRatio?: boolean;
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
        } | string;
        fragmentShader?: {
            main: string;
            outputs?: any;
            inputs?: any;
            constants?: string;
        } | string;
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
    protected cleanInputs(): any[];
    blendMode: BlendMode;
    private getFragmentShaderColorOptions;
    protected rebuildingAfterDeviceLost: boolean;
    onRebuildStartAfterDeviceLost: () => void;
    clearAfterDeviceLostAndRebuild(): void;
    buildGpuPipeline(): GPURenderPipeline;
    private clearOpReady;
    private rendererUseSinglePipeline;
    beginRenderPass(commandEncoder: GPUCommandEncoder, outputView?: GPUTextureView, drawCallId?: number): GPURenderPassEncoder;
    private handleOutputColor;
    update(): void;
    draw(renderPass: GPURenderPassEncoder): void;
    end(commandEncoder: any, renderPass: any): void;
    private get resourceDefined();
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
