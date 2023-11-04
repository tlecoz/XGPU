// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.
import { XGPU } from "../../../XGPU";
export class Texture {
    descriptor;
    gpuResource = null;
    _view = null;
    constructor(descriptor) {
        //console.log(descriptor.format + " ::: " + descriptor.usage)
        if (undefined === descriptor.usage)
            descriptor.usage = GPUTextureUsage.RENDER_ATTACHMENT;
        if (undefined === descriptor.sampleCount && descriptor.format !== "depth32float")
            descriptor.sampleCount = 1;
        this.descriptor = descriptor;
    }
    get sampleCount() { return this.descriptor.sampleCount; }
    get format() { return this.descriptor.format; }
    get size() { return this.descriptor.size; }
    get usage() { return this.descriptor.usage; }
    get view() {
        if (!this._view)
            this.create();
        return this._view;
    }
    destroy() {
        if (this.gpuResource) {
            this.gpuResource.xgpuObject = null;
            this.gpuResource.destroy();
        }
        this.gpuResource = null;
        this._view = null;
    }
    deviceId;
    time;
    create() {
        /*if (this.time && new Date().getTime() - this.time < 100 && XGPU.loseDeviceRecently) {
            return;
        }*/
        this.time = new Date().getTime();
        if (XGPU.loseDeviceRecently && this.deviceId === XGPU.deviceId)
            return;
        if (this.gpuResource) {
            this.gpuResource.xgpuObject = null;
            this.gpuResource.destroy();
        }
        //console.warn("createTexture ", this.deviceId)
        this.deviceId = XGPU.deviceId;
        this.gpuResource = XGPU.device.createTexture(this.descriptor);
        this.gpuResource.xgpuObject = this;
        this.createView();
    }
    createGpuResource() {
        this.create();
    }
    update() {
        if (this.deviceId !== XGPU.deviceId) {
            this.create();
        }
    }
    createView() {
        if (!this.gpuResource)
            this.create();
        this._view = this.gpuResource.createView();
        //(this._view as any).texture = this;
    }
    resize(width, height) {
        this.descriptor.size = [width, height];
        this.create();
    }
}
