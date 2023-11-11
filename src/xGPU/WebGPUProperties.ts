export class WebGPUProperties {

    private static build(obj: any, currentId: number, currentNames: string[]) {

        let infoById = {};
        let processedIds = new Set();
        let stack = [{ id: currentId, names: currentNames }];
        while (stack.length > 0) {
            let current = stack.pop();
            let currentId = current.id;
            let currentNames = current.names;
            if (processedIds.has(currentId)) continue;

            for (let name in obj) {
                let id = obj[name];
                let combinedId = currentId | id;
                let combinedNames = [...new Set(currentNames.concat(name))];

                if (!(combinedId in infoById)) {
                    infoById[combinedId] = combinedNames;
                    stack.push({ id: combinedId, names: combinedNames });
                } else {
                    infoById[combinedId] = [...new Set(infoById[combinedId].concat(combinedNames))];
                }
            }
            processedIds.add(currentId);
        }
        return infoById;
    }

    private static resolve(obj: any, id: number) {
        if (id in obj) return obj[id].join("|");
        return "undefined"
    }

    private static async getResult(WebGpuObject: any): Promise<any> {
        return new Promise((resolve) => {
            const result = this.build(WebGpuObject, 0, [])
            setTimeout(() => {
                //i make a pause to unblock the thread
                resolve(result);
            }, 1)
        });
    }
    private static ready: boolean = false;
    private static textureUsage: any;
    private static bufferUsage: any;
    private static shaderStage: any;

    public static async init(): Promise<void> {
        if (!this._instance) new WebGPUProperties();
        return new Promise(async (resolve) => {
            if (this.ready) resolve();
            else {
                this.bufferUsage = await this.getResult(GPUBufferUsage);
                this.shaderStage = await this.getResult(GPUShaderStage);
                this.textureUsage = await this.getResult(GPUTextureUsage);
                this.ready = true;
                resolve();
            }
        });
    }

    private static _instance: WebGPUProperties;
    constructor() {
        if (WebGPUProperties._instance) {
            throw new Error("WebGPUProperties is not instanciable");
        }
        WebGPUProperties._instance = this;
    }



    public static getTextureUsageById(id: number): string {
        return this.resolve(this.textureUsage, id);
    }

    public static getBufferUsageById(id: number): string {
        return this.resolve(this.bufferUsage, id);
    }

    public static getShaderStageById(id: number): string {
        return this.resolve(this.shaderStage, id);
    }
}

