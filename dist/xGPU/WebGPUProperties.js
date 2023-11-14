export class WebGPUProperties {
    static build(obj, currentId, currentNames) {
        let infoById = {};
        let processedIds = new Set();
        let stack = [{ id: currentId, names: currentNames }];
        while (stack.length > 0) {
            let current = stack.pop();
            let currentId = current.id;
            let currentNames = current.names;
            if (processedIds.has(currentId))
                continue;
            for (let name in obj) {
                let id = obj[name];
                let combinedId = currentId | id;
                let combinedNames = [...new Set(currentNames.concat(name))];
                if (!(combinedId in infoById)) {
                    infoById[combinedId] = combinedNames;
                    stack.push({ id: combinedId, names: combinedNames });
                }
                else {
                    infoById[combinedId] = [...new Set(infoById[combinedId].concat(combinedNames))];
                }
            }
            processedIds.add(currentId);
        }
        return infoById;
    }
    static resolve(obj, id) {
        if (id in obj)
            return obj[id].join("|");
        return "undefined";
    }
    static async getResult(WebGpuObject) {
        return new Promise((resolve) => {
            const result = this.build(WebGpuObject, 0, []);
            setTimeout(() => {
                //i make a pause to unblock the thread
                resolve(result);
            }, 1);
        });
    }
    static ready = false;
    static textureUsage;
    static bufferUsage;
    static shaderStage;
    static async init() {
        if (!this._instance)
            new WebGPUProperties();
        return new Promise(async (resolve) => {
            if (this.ready)
                resolve();
            else {
                this.bufferUsage = await this.getResult(GPUBufferUsage);
                this.shaderStage = await this.getResult(GPUShaderStage);
                this.textureUsage = await this.getResult(GPUTextureUsage);
                this.ready = true;
                resolve();
            }
        });
    }
    static _instance;
    constructor() {
        if (WebGPUProperties._instance) {
            throw new Error("WebGPUProperties is not instanciable");
        }
        WebGPUProperties._instance = this;
    }
    static getTextureUsageById(id) {
        return this.resolve(this.textureUsage, id);
    }
    static getBufferUsageById(id) {
        return this.resolve(this.bufferUsage, id);
    }
    static getShaderStageById(id) {
        return this.resolve(this.shaderStage, id);
    }
}
