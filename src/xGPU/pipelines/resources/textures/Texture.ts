// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { EventDispatcher } from "../../../EventDispatcher";
import { XGPU } from "../../../XGPU";

export type TextureDescriptor = {
    size: GPUExtent3D,
    format: GPUTextureFormat,
    usage?: GPUTextureUsageFlags,
    sampleCount?: GPUSize32,
    label?: string,
}

export class Texture extends EventDispatcher {

    public descriptor: TextureDescriptor;
    public gpuResource: GPUTexture = null;
    protected _view: GPUTextureView = null;

    constructor(descriptor: {
        size: GPUExtent3D,
        format: GPUTextureFormat,
        usage?: GPUTextureUsageFlags,
        sampleCount?: GPUSize32,
        label?: string
    }) {

        super();
        //console.log(descriptor.format + " ::: " + descriptor.usage)
        if (undefined === descriptor.usage) descriptor.usage = GPUTextureUsage.RENDER_ATTACHMENT;
        if (undefined === descriptor.sampleCount && descriptor.format !== "depth32float") descriptor.sampleCount = 1;
        if (undefined === descriptor.label) descriptor.label = "Texture";
        this.descriptor = descriptor;

    }
    public get sampleCount(): number { return this.descriptor.sampleCount }
    public get format(): any { return this.descriptor.format }
    public get size(): GPUExtent3D { return this.descriptor.size }
    public get usage(): number { return this.descriptor.usage }
    public get view(): GPUTextureView {

        if (!this._view) this.create();
        return this._view;
    }

    public destroy(): void {
        if (this.gpuResource) {
            (this.gpuResource as any).xgpuObject = null;
            this.gpuResource.destroy();
        }
        this.gpuResource = null;
        this._view = null;
    }

    protected deviceId: number;
    public time: number;
    public create(): void {

        /*if (this.time && new Date().getTime() - this.time < 100 && XGPU.loseDeviceRecently) {
            return;
        }*/
        this.time = new Date().getTime();


        if (XGPU.loseDeviceRecently && this.deviceId === XGPU.deviceId) return

        if (this.gpuResource) {
            (this.gpuResource as any).xgpuObject = null;
            this.gpuResource.destroy();
        }
        //console.warn("createTexture ", this.deviceId)



        this.deviceId = XGPU.deviceId;
        this.gpuResource = XGPU.device.createTexture(this.descriptor as GPUTextureDescriptor);
        (this.gpuResource as any).xgpuObject = this;
        this.createView();
    }


    public createGpuResource(): void {
        this.create();
    }

    public update() {
        if (this.deviceId !== XGPU.deviceId) {

            this.create();

        }
    }

    private createView(): void {
        if (!this.gpuResource) this.create();
        this._view = this.gpuResource.createView();
        //(this._view as any).texture = this;
    }

    public resize(width: number, height: number): void {
        this.descriptor.size = [width, height];
        this.create();
    }


}