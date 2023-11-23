/// <reference types="dist" />
import { EventDispatcher } from "../../EventDispatcher";
import { Pipeline } from "../../pipelines/Pipeline";
import { RenderPassTexture } from "../../pipelines/resources/textures/RenderPassTexture";
import { IShaderResource } from "./IShaderResource";
import { ImageTextureIO } from "./ImageTextureIO";
export type ImageTextureDescriptor = {
    source?: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture | RenderPassTexture;
    size?: GPUExtent3D;
    usage?: GPUTextureUsageFlags;
    format?: GPUTextureFormat;
    defaultViewDescriptor?: GPUTextureViewDescriptor;
    sampledType?: "f32" | "i32" | "u32";
    label?: string;
};
export declare class ImageTexture extends EventDispatcher implements IShaderResource {
    resourceIO: ImageTextureIO;
    io: number;
    mustBeTransfered: boolean;
    descriptor: ImageTextureDescriptor;
    gpuResource: GPUTexture;
    protected _view: GPUTextureView;
    protected viewDescriptor: GPUTextureViewDescriptor;
    protected useOutsideTexture: boolean;
    protected renderPassTexture: RenderPassTexture;
    constructor(descriptor: {
        source?: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture | RenderPassTexture;
        size?: GPUExtent3D;
        usage?: GPUTextureUsageFlags;
        format?: GPUTextureFormat;
        defaultViewDescriptor?: GPUTextureViewDescriptor;
        sampledType?: "f32" | "i32" | "u32";
        label?: string;
    });
    private initFromTexture;
    clone(): ImageTexture;
    get sampledType(): "f32" | "i32" | "u32";
    set sampledType(type: "f32" | "i32" | "u32");
    get isRenderPass(): boolean;
    protected gpuTextureIOs: GPUTexture[];
    protected gpuTextureIO_index: number;
    initTextureIO(textures: GPUTexture[]): void;
    get texture(): GPUTexture;
    getCurrentTexture(): GPUTexture;
    createView(viewDescriptor?: GPUTextureViewDescriptor): GPUTextureView;
    resize(w: number, h: number): ImageTexture;
    get view(): GPUTextureView;
    get source(): ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture | RenderPassTexture;
    set source(bmp: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas | GPUTexture | RenderPassTexture);
    update(pipeline: Pipeline): void;
    deviceId: number;
    createGpuResource(): void;
    time: number;
    destroyGpuResource(): void;
    createDeclaration(varName: string, bindingId: number, groupId?: number): string;
    protected _textureType: {
        texture: any;
    } | {
        storageTexture: any;
    };
    get textureType(): any;
    set textureType(o: any);
    createBindGroupLayoutEntry(bindingId: number): {
        binding: number;
        visibility: number;
        storageTexture?: GPUStorageTextureBindingLayout;
        texture?: GPUTextureBindingLayout;
    };
    createBindGroupEntry(bindingId: number): {
        binding: number;
        resource: GPUTextureView;
    };
    setPipelineType(pipelineType: "compute" | "render" | "compute_mixed"): void;
}
