// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { XGPU } from "../../XGPU";
export class VideoTexture {
    mustBeTransfered = true;
    descriptor;
    useWebcodec = false; //still in beta 
    gpuResource;
    /*
    bindgroups: an array of bindgroup that contains the VideoTexture
    => I need it to call its "build" function onVideoFrameCallback
    => a videoTexture can be contained in multiple bindgroups, that's why it's an array
    */
    bindgroups = [];
    addBindgroup(bindgroup) {
        if (this.bindgroups.indexOf(bindgroup) === -1) {
            this.bindgroups.push(bindgroup);
        }
    }
    constructor(descriptor) {
        if (undefined === descriptor.format)
            descriptor.format = "rgba8unorm";
        if (undefined === descriptor.usage)
            descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;
        if (undefined === descriptor.mipLevelCount)
            descriptor.mipLevelCount = 1;
        if (undefined === descriptor.sampleCount)
            descriptor.sampleCount = 1;
        if (undefined === descriptor.dimension)
            descriptor.dimension = "2d";
        if (undefined === descriptor.viewFormats)
            descriptor.viewFormats = [];
        this.descriptor = descriptor;
        if (descriptor.source)
            this.source = descriptor.source;
    }
    clone() {
        return new VideoTexture(this.descriptor);
    }
    set source(video) {
        this.gpuResource = video;
        this.descriptor.source = video;
        this.descriptor.size = [video.width, video.height];
        const frame = () => {
            if (XGPU.device) {
                this.bindgroups.forEach(b => b.build());
            }
            video.requestVideoFrameCallback(frame);
        };
        video.requestVideoFrameCallback(frame);
    }
    createDeclaration(varName, bindingId, groupId = 0) {
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_external;\n";
    }
    createBindGroupLayoutEntry(bindingId) {
        return {
            binding: bindingId,
            visibility: GPUShaderStage.FRAGMENT,
            externalTexture: {},
        };
    }
    createGpuResource() {
        /*
        no code here :
        The HtmlVideoElement is used as gpyResource
        */
    }
    update() {
        /*
        np code here :
        the video update itself automaticly
        */
    }
    destroyGpuResource() {
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
    videoFrame;
    createBindGroupEntry(bindingId) {
        if (this.useWebcodec) {
            if (this.videoFrame)
                this.videoFrame.close();
            this.videoFrame = new window["VideoFrame"](this.gpuResource);
        }
        if (!this.gpuResource)
            throw new Error("gpuResource cannot be null. You must provide a HTMLVideoElement");
        return {
            binding: bindingId,
            resource: XGPU.device.importExternalTexture({
                source: this.useWebcodec ? this.videoFrame : this.gpuResource
            })
        };
    }
    setPipelineType(pipelineType) {
        if (pipelineType) { }
        //use to handle particular cases in descriptor relative to the nature of pipeline
    }
}
