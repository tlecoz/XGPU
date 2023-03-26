import { IShaderResource } from "../../../shader/resources/IShaderResource";
import { Texture } from "./Texture";

export type DepthStencilTextureDescriptor = {
    size: GPUExtent3D,
    format?: "stencil8" | "depth16unorm" | "depth24plus" | "depth24plus-stencil8" | "depth32float",
}

export class DepthStencilTexture extends Texture implements IShaderResource {

    /*
    When you apply a shadow to a renderPipeline , you actually create a ShadowPipeline that store information in the DepthStencilTexture.
    This texture is then used as IShaderResource in the renderPipeline. 
    Because it can be an IShaderResource , we must implement the IShaderResource interface
    */





    private _description: { depthWriteEnabled: boolean, depthCompare: string, format: string };
    public get description(): { depthWriteEnabled: boolean, depthCompare: string, format: string } { return this._description; }

    private _attachment: any;
    public get attachment(): any { return this._attachment };

    constructor(descriptor: {
        size: GPUExtent3D,
        format?: "stencil8" | "depth16unorm" | "depth24plus" | "depth24plus-stencil8" | "depth32float",
        usage?: GPUTextureUsageFlags
    }, depthStencilDescription: {
        depthWriteEnabled: boolean,
        depthCompare: "never" | "less" | "equal" | "less-equal" | "greater" | "not-equal" | "greater-equal" | "always",
    } = null, depthStencilAttachmentOptions: any = null) {

        if (undefined === descriptor.format) descriptor.format = "depth24plus";

        super(descriptor as any)

        this.create();

        //--------
        if (!depthStencilDescription) {
            depthStencilDescription = {
                depthWriteEnabled: true,
                depthCompare: "less",
                format: this.gpuResource.format
            } as any
        }
        this._description = { format: this.gpuResource.format, ...depthStencilDescription };

        //--------
        this._attachment = {
            view: this._view,
            depthClearValue: 1,
            depthLoadOp: 'clear',
            depthStoreOp: 'store',
        }
        for (let z in depthStencilAttachmentOptions) {
            this._attachment[z] = depthStencilAttachmentOptions[z];
        }


    }


    //--------------------------------- IShaderResource ---------------------------------------------------------

    public mustBeTransfered: boolean = false;
    protected _visibility: GPUShaderStageFlags = GPUShaderStage.FRAGMENT;

    public setPipelineType(pipelineType: "compute" | "render" | "compute_mixed") {
        if (pipelineType === "render") this._visibility = GPUShaderStage.FRAGMENT;
        else if (pipelineType === "compute_mixed") this._visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE;
        else if (pipelineType === "compute") this._visibility = GPUShaderStage.COMPUTE;
    }

    public createBindGroupEntry(bindingId: number) {
        return {
            binding: bindingId,
            resource: this._view
        }
    }
    public createBindGroupLayoutEntry(bindingId: number) {
        return {
            binding: bindingId,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
                sampleType: "depth"
            }
        }
    }
    public createDeclaration(varName: string, bindingId: number, groupId: number): string {
        return "@binding(" + bindingId + ") @group(" + groupId + ") var " + varName + ":texture_depth_2d<f32>;\n";
    }

    public createGpuResource() {
        this.create()
    }

    public destroyGpuResource() {
        if (this.gpuResource) {
            this._view = null;
            this.gpuResource.destroy();
            this.gpuResource = null;
        }
    }

    public update() {

    }

    public clone(): DepthStencilTexture {
        return new DepthStencilTexture(this.descriptor as any);
    }

}