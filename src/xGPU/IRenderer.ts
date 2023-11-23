// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { RenderPipeline } from "./pipelines/RenderPipeline";

export interface IRenderer {

    addPipeline(pipeline: RenderPipeline, offset?: number): void;
    resize(w: number, h: number);
    destroy(): void;
    update(): void;

    get renderPipelines(): RenderPipeline[];
    get canvas(): HTMLCanvasElement;
    get resized(): boolean;
    get width(): number;
    get height(): number;
    get texture(): GPUTexture;
    get view(): GPUTextureView;
    get frameId(): number;
    get commandEncoder(): GPUCommandEncoder;

}