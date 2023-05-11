// Copyright (c) 2023 Thomas Le Coz. All rights reserved.
// This code is governed by an MIT license that can be found in the LICENSE file.

import { BlendMode } from "./BlendMode";

export class AlphaBlendMode extends BlendMode {

    constructor() {
        super();

        this.color.operation = "add";
        this.color.srcFactor = "src-alpha";
        this.color.dstFactor = "one-minus-src-alpha";

        this.alpha.operation = "add";
        this.alpha.srcFactor = "src-alpha";
        this.alpha.dstFactor = "one-minus-src-alpha";
    }

}