// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { RenderPipeline } from "./pipelines/RenderPipeline";

export interface IRenderer {

    init(w: number, h: number, usage?: number, sampleCount?: number): void;
    addPipeline(pipeline: RenderPipeline, offset?: number): void;
    resize(w: number, h: number);
    destroy(): void;
    update(): void;

    get firstPipeline(): RenderPipeline;
    get nbPipeline(): number;
    get useSinglePipeline(): boolean;
    get dimensionChanged(): boolean;
    get canvas(): { width: number, height: number, dimensionChanged: boolean };
    get width(): number;
    get height(): number;
    get texture(): GPUTexture;
    get view(): GPUTextureView;
}