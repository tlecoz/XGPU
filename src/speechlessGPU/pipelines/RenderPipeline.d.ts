/// <reference types="dist" />
import { GPURenderer } from "../GPURenderer";
import { HeadlessGPURenderer } from "../HeadlessGPURenderer";
import { Pipeline } from "./Pipeline";
import { BlendMode } from "./resources/blendmodes/BlendMode";
import { DepthStencilTexture } from "./resources/textures/DepthStencilTexture";
import { MultiSampleTexture } from "./resources/textures/MultiSampleTexture";
import { RenderPassTexture } from "./resources/textures/RenderPassTexture";
import { IndexBuffer } from "./resources/IndexBuffer";
export declare class RenderPipeline extends Pipeline {
    renderer: GPURenderer | HeadlessGPURenderer;
    protected canvas: {
        width: number;
        height: number;
        dimensionChanged: boolean;
    };
    protected _depthStencilTexture: DepthStencilTexture;
    protected multisampleTexture: MultiSampleTexture;
    protected renderPassTexture: RenderPassTexture;
    outputColor: any;
    renderPassDescriptor: any;
    indexBuffer: IndexBuffer;
    protected gpuPipeline: GPURenderPipeline;
    debug: string;
    onDrawBegin: () => void;
    onDrawEnd: () => void;
    constructor(renderer: GPURenderer | HeadlessGPURenderer, bgColor?: {
        r: number;
        g: number;
        b: number;
        a: number;
    });
    get depthStencilTexture(): DepthStencilTexture;
    initFromObject(descriptor: {
        cullMode?: "front" | "back" | "none";
        topology?: "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip";
        frontFace?: "ccw" | "cw";
        stripIndexFormat?: "uint16" | "uint32";
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
            outputs: any;
            main: string;
            inputs?: any;
            code?: string;
        };
        fragmentShader?: {
            outputs: any;
            main: string;
            inputs?: any;
            code?: string;
        };
    }): {
        cullMode?: "front" | "back" | "none";
        topology?: "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip";
        frontFace?: "ccw" | "cw";
        stripIndexFormat?: "uint16" | "uint32";
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
            outputs: any;
            main: string;
            inputs?: any;
            code?: string;
        };
        fragmentShader?: {
            outputs: any;
            main: string;
            inputs?: any;
            code?: string;
        };
    };
    createColorAttachment(rgba: {
        r: number;
        g: number;
        b: number;
        a: number;
    }, view?: GPUTextureView): any;
    private drawConfig;
    setupDraw(o: {
        instanceCount?: number;
        vertexCount?: number;
        firstVertexId?: number;
        firstInstanceId?: number;
    }): void;
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
    }, depthStencilDescription?: {
        depthWriteEnabled: boolean;
        depthCompare: "never" | "less" | "equal" | "less-equal" | "greater" | "not-equal" | "greater-equal" | "always";
    }, depthStencilAttachmentOptions?: any): void;
    get renderPassView(): GPUTextureView;
    get renderPass(): RenderPassTexture;
    protected cleanInputs(): any[];
    blendMode: BlendMode;
    private getFragmentShaderColorOptions;
    buildGpuPipeline(): GPURenderPipeline;
    private clearOpReady;
    private rendererUseSinglePipeline;
    beginRenderPass(commandEncoder: GPUCommandEncoder, outputView?: GPUTextureView): GPURenderPassEncoder;
    private handleOutputColor;
    update(): void;
    draw(renderPass: GPURenderPassEncoder, gpuPipeline?: GPURenderPipeline): void;
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
