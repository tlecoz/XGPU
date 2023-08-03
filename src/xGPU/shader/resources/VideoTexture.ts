// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { XGPU } from "../../XGPU";
import { Bindgroup } from "../Bindgroup";
import { IShaderResource } from "./IShaderResource";



export type VideoTextureDescriptor = {
    source?: HTMLVideoElement,
    format?: GPUTextureFormat,
    usage?: GPUTextureUsageFlags,
    size?: GPUExtent3D,
    mipLevelCount?: GPUIntegerCoordinate,
    sampleCount?: GPUSize32,
    dimension?: GPUTextureDimension,
    viewFormats?: GPUTextureFormat[],
    defaultViewDescriptor?: any
}


export class VideoTexture implements IShaderResource {

    public mustBeTransfered: boolean = true;
    public descriptor: VideoTextureDescriptor;
    public useWebcodec: boolean = false; //still in beta 

    public gpuResource: HTMLVideoElement

    /*
    bindgroups: an array of bindgroup that contains the VideoTexture 
    => I need it to call its "build" function onVideoFrameCallback
    => a videoTexture can be contained in multiple bindgroups, that's why it's an array
    */
    protected bindgroups: Bindgroup[] = [];
    public addBindgroup(bindgroup: Bindgroup) {
        if (this.bindgroups.indexOf(bindgroup) === -1) {
            this.bindgroups.push(bindgroup);
        }
    }

    constructor(descriptor: {
        source?: HTMLVideoElement,
        format?: GPUTextureFormat,
        usage?: GPUTextureUsageFlags,
        size?: GPUExtent3D,
        mipLevelCount?: GPUIntegerCoordinate,
        sampleCount?: GPUSize32,
        dimension?: GPUTextureDimension,
        viewFormats?: GPUTextureFormat[],
        defaultViewDescriptor?: any,

    }) {

        if (undefined === descriptor.format) descriptor.format = "rgba8unorm";
        if (undefined === descriptor.usage) descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;
        if (undefined === descriptor.mipLevelCount) descriptor.mipLevelCount = 1;
        if (undefined === descriptor.sampleCount) descriptor.sampleCount = 1;
        if (undefined === descriptor.dimension) descriptor.dimension = "2d";
        if (undefined === descriptor.viewFormats) descriptor.viewFormats = [];

        this.descriptor = descriptor;

        if (descriptor.source) this.source = descriptor.source;
    }

    public clone(): VideoTexture {
        return new VideoTexture(this.descriptor);
    }


    public set source(video: HTMLVideoElement) {
        this.gpuResource = video;
        this.descriptor.source = video;
        this.descriptor.size = [video.width, video.height];

        const frame = () => {
            if (!this.gpuResource) return;
            if (XGPU.device) {
                this.bindgroups.forEach(b => b.build())
            }

            video.requestVideoFrameCallback(frame);
        }

        video.requestVideoFrameCallback(frame)
    }




    public createDeclaration(varName: string, bindingId: number, groupId: number = 0): string {
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_external;\n";
    }


    public createBindGroupLayoutEntry(bindingId: number): { binding: number, visibility: number, externalTexture: GPUExternalTextureBindingLayout } {
        return {
            binding: bindingId,
            visibility: GPUShaderStage.FRAGMENT,
            externalTexture: {},
        }
    }

    public createGpuResource() {
        /*
        no code here : 
        The HtmlVideoElement is used as gpyResource 
        */
    }
    public update(): void {
        /*
        np code here :
        the video update itself automaticly
        */


    }

    public destroyGpuResource() {

        //console.log("destroyGpuResource deviceLost = ")
        /*
        if (this.gpuResource ) {
            this.gpuResource.src = undefined;
            this.gpuResource = null;
        }*/
        if (this.videoFrame) {
            this.videoFrame.close();
            this.videoFrame = null;
        }
    }

    private videoFrame: any;

    public createBindGroupEntry(bindingId: number): { binding: number, resource: GPUExternalTexture } {

        if (this.useWebcodec) {
            if (this.videoFrame) this.videoFrame.close();
            this.videoFrame = new window["VideoFrame"](this.gpuResource)
        }


        if (!this.gpuResource) throw new Error("gpuResource cannot be null. You must provide a HTMLVideoElement")
        return {
            binding: bindingId,
            resource: XGPU.device.importExternalTexture({
                source: this.useWebcodec ? this.videoFrame as any : this.gpuResource
            })
        }
    }

    public setPipelineType(pipelineType: "compute" | "render" | "compute_mixed") {
        if (pipelineType) { }
        //use to handle particular cases in descriptor relative to the nature of pipeline
    }

}