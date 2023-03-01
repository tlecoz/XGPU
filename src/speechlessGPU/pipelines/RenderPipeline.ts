import { GPU } from "../GPU";
import { GPURenderer } from "../GPURenderer";
import { DepthTextureDescriptor } from "../resources/descriptors/DepthTextureDescriptor";
import { RenderPassTextureDescriptor } from "../resources/descriptors/RenderPassTextureDescriptor";
import { TextureDescriptor } from "../resources/descriptors/TextureDescriptor";
import { PipelineResource } from "../resources/PipelineResource";
import { RenderPassTextureResource } from "../resources/RenderPassTextureResource";
import { VertexArray } from "../resources/VertexArray";
import { VertexBuffer } from "../resources/VertexBufferResource";
import { FragmentShader } from "../shader/FragmentShader";
import { ShaderStruct } from "../shader/ShaderStruct";
import { VertexShader } from "../shader/VertexShader";
import { Pipeline } from "./Pipeline";

export class RenderPipeline extends Pipeline {


    protected renderer: GPURenderer;
    protected canvas: HTMLCanvasElement;

    public depthStencilView: GPUTextureView;
    public multisampleView: GPUTextureView;

    public outputColor: any;
    public renderPassDescriptor: any = { colorAttachments: [] }

    private gpuPipeline: GPURenderPipeline;

    constructor(name: string, renderer: GPURenderer, bgColor: { r: number, g: number, b: number, a: number } = { r: 0, g: 0, b: 0, a: 1 }) {
        super(name);

        if (!renderer.canvas) {
            throw new Error("A RenderPipeline need a GPUProcess with a canvas in order to draw things inside. You must pass a reference to a canvas when you instanciate the GPUProcess.")
        }
        this.renderer = renderer;
        this.canvas = renderer.canvas;
        this.vertexShader = new VertexShader();
        this.fragmentShader = new FragmentShader();
        this.description.primitive = {
            topology: "triangle-list",
            cullMode: "back"
        }
        this.outputColor = this.createColorAttachment(bgColor);
    }

    public createColorAttachment(rgba: { r: number, g: number, b: number, a: number }, view: GPUTextureView = undefined): any {

        const colorAttachment = {
            view: view,
            clearValue: rgba,
            loadOp: "clear",
            storeOp: "store"
        }

        this.renderPassDescriptor.colorAttachments.push(colorAttachment);

        return colorAttachment;
    }
    //----------- used if there is no indexBuffer ------
    private drawConfig: { vertexCount: number, instanceCount: number, firstVertexId: number, firstInstanceId: number } = {
        vertexCount: -1,
        instanceCount: 1,
        firstVertexId: 0,
        firstInstanceId: 0
    }

    public setupDraw(o: { instanceCount?: number, vertexCount?: number, firstVertexId?: number, firstInstanceId?: number }) {
        if (o.instanceCount !== undefined) this.drawConfig.instanceCount = o.instanceCount;
        if (o.vertexCount !== undefined) this.drawConfig.vertexCount = o.vertexCount;
        if (o.firstVertexId !== undefined) this.drawConfig.firstVertexId = o.firstVertexId;
        if (o.firstInstanceId !== undefined) this.drawConfig.firstInstanceId = o.firstInstanceId;
    }
    //------------------------------------------------

    public setupMultiSampleView(count: number = 1, mask: number = 0xFFFFFFFF, alphaToCoverageEnabled: boolean = false, resolveTarget: GPUTextureView = null) {
        this.description.multisample = {
            count,
            mask,
            alphaToCoverageEnabled
        }

        const updateTexture = () => {
            if (this.multisampleView) (this.multisampleView as any).texture.destroy();


            const desc = new TextureDescriptor(this.canvas.width, this.canvas.height, navigator.gpu.getPreferredCanvasFormat(), null, count)
            const tex = GPU.addTexture(desc);
            this.multisampleView = tex.texture.createView();
            (this.multisampleView as any).texture = tex;
            (this.multisampleView as any).updateTexture = updateTexture;
            if (resolveTarget) (this.multisampleView as any).resolveTarget = resolveTarget;
        }

        updateTexture();
    }

    //---------------------------

    public setupDepthStencilView(wglsTextureFormat: string = "depth24plus", depthStencilOptions?: any, pipelineDepthStencilOptions?: any) {

        const updateTexture = () => {

            if (this.depthStencilView) (this.depthStencilView as any).texture.destroy();

            const desc = new DepthTextureDescriptor(this.canvas.width, this.canvas.height, wglsTextureFormat);
            const tex = GPU.addTexture(desc);

            this.depthStencilView = tex.texture.createView();
            (this.depthStencilView as any).updateTexture = updateTexture;
            (this.depthStencilView as any).texture = tex;
            const o = {
                view: this.depthStencilView,
                depthClearValue: 1,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            };
            for (var z in depthStencilOptions) o[z] = depthStencilOptions[z];

            this.renderPassDescriptor.depthStencilAttachment = o

            const obj = this.description.depthStencil = {
                depthWriteEnabled: true,
                depthCompare: "less",
                format: tex.texture.format
            }
            for (var z in pipelineDepthStencilOptions) obj[z] = pipelineDepthStencilOptions[z];

        }
        updateTexture();

    }
    //----------------------------------------

    protected _renderPassTexture: RenderPassTextureResource = null;
    public get renderPass(): RenderPassTextureResource { return this._renderPassTexture; }
    public setupRenderPassView(w?: number, h?: number) {
        if (!w) w = this.canvas.width;
        if (!h) h = this.canvas.height;
        if (!this._renderPassTexture) {
            this._renderPassTexture = GPU.addRenderPassTexture(new RenderPassTextureDescriptor(w, h))
        }
    }



    //----------------------------------------




    protected cleanInputs(/*initIO: boolean = false*/) {
        const _inputs = [];
        const t = this.vertexShader.inputs;
        //let o: any;
        let k = 0;
        for (let i = 0; i < t.length; i++) {
            /*
            o = t[i];
            if ((o instanceof VertexBufferIO) || (o instanceof TextureIO)) {
                //must be overrided
                continue;
            }*/
            _inputs[k++] = t[i];
        }
        this.vertexShader.inputs = _inputs;
        return _inputs;
    }

    public buildGpuPipeline(): GPURenderPipeline {
        if (this.gpuPipeline) return this.gpuPipeline


        this.build();

        //setup vertexShader inputs ------
        const vertexInput: ShaderStruct = new ShaderStruct("Input", this.cleanInputs());;

        if (this.vertexBuffers.length) {
            let buffer: VertexBuffer;
            let arrays: VertexArray[];
            let builtin: number = 0;
            for (let i = 0; i < this.vertexBuffers.length; i++) {
                buffer = this.vertexBuffers[i];
                arrays = buffer.vertexArrays;
                for (let j = 0; j < arrays.length; j++) {
                    vertexInput.addProperty({ name: arrays[j].name, type: arrays[j].varType, builtin: "@location(" + builtin + ")" })
                    builtin++;
                }
            }
        }

        //---------------------------------


        const vertexShader: { code: string, output: ShaderStruct } = this.vertexShader.build(this, vertexInput);
        const fragmentShader: { code: string, output: ShaderStruct } = this.fragmentShader.build(this, vertexShader.output.getInputFromOutput());

        //console.log("vertexInput = ", vertexInput);
        //console.log("vertexShader.output.getInputFromOutput = ", vertexShader.output.getInputFromOutput())


        //const bufferLayout = this.createVertexBufferLayout();
        //console.log("bufferLayout = ", bufferLayout)

        this.description.vertex = {
            module: GPU.device.createShaderModule({
                code: vertexShader.code
            }),
            entryPoint: "main",
            buffers: this.createVertexBufferLayout()
        }

        this.description.fragment = {
            module: GPU.device.createShaderModule({
                code: fragmentShader.code
            }),
            entryPoint: "main",
            targets: [
                {
                    format: GPU.getPreferredCanvasFormat()
                }
            ]
        }


        this.description.layout = this.gpuPipelineLayout;

        console.log("buildGPUPipeline description = ", this.description)
        this.gpuPipeline = GPU.createRenderPipeline(this.description);

        return this.gpuPipeline;

    }

    //-------------------------------------------


    public beginRenderPass(commandEncoder: GPUCommandEncoder, outputView?: GPUTextureView): GPURenderPassEncoder {

        if (this.drawConfig.vertexCount === 0) {
            if (this.vertexBuffers.length) {
                this.drawConfig.vertexCount = this.vertexBuffers[0].nbVertex;
            }

            //console.log("drawConfig.vertexCount = ", this.drawConfig.vertexCount)
        }


        if ((this.canvas as any).dimensionChanged) {
            if (this.multisampleView) {
                (this.multisampleView as any).updateTexture();
            }
            if (this.depthStencilView) {
                (this.depthStencilView as any).updateTexture();
            }
            if (this._renderPassTexture) {
                this._renderPassTexture.updateTexture(this.canvas.width, this.canvas.height)
            }
        }



        if (outputView && this.outputColor) this.handleOutputColor(outputView);

        //console.log(this.renderPassDescriptor)

        return commandEncoder.beginRenderPass(this.renderPassDescriptor);
    }

    private handleOutputColor(outputView: GPUTextureView) {
        if (this.outputColor) {

            if (this.multisampleView) {
                this.outputColor.view = this.multisampleView;

                if ((this.multisampleView as any).resolveTarget) this.outputColor.resolveTarget = (this.multisampleView as any).resolveTarget;
                else this.outputColor.resolveTarget = outputView;

            } else {
                this.outputColor.view = outputView;
            }
        }

    }

    //----------------------------------------------------------------------

    public update(bindgroupsRessource: any): void {
        if (!this.gpuPipeline) return;

        const all: PipelineResource[] = bindgroupsRessource.all;
        for (let i = 0; i < all.length; i++) {
            all[i].update();
        }



    }

    public draw(renderPass: GPURenderPassEncoder) {


        const pipeline = this.buildGpuPipeline();
        if (!pipeline) return;

        renderPass.setPipeline(pipeline);

        //console.log("bindGroups.resources = ", this.bindGroups.resources)
        const resourceByType = this.bindGroups.resources.types;
        const buffers = resourceByType.vertexBuffers;
        const vertexBuffer: VertexBuffer = buffers[0].resource as VertexBuffer;
        if (this.drawConfig.vertexCount === -1) {
            this.drawConfig.vertexCount = vertexBuffer.nbVertex;
        }

        if (buffers) {
            for (let i = 0; i < buffers.length; i++) {
                renderPass.setVertexBuffer(i, buffers[i].resource.buffer)
            }
        }

        this.bindGroups.apply(renderPass);




        const indexBuffer: any = resourceByType.indexBuffer;

        if (indexBuffer) {
            renderPass.setIndexBuffer(indexBuffer, indexBuffer.dataType);
            renderPass.drawIndexed(indexBuffer.nbPoint);
        } else {
            //console.log("drawConfig = ", this.drawConfig)
            if (this.drawConfig.vertexCount !== -1) {
                renderPass.draw(this.drawConfig.vertexCount, this.drawConfig.instanceCount, this.drawConfig.firstVertexId, this.drawConfig.firstInstanceId)
            }
        }

    }


    //-------------------------------

    public end(commandEncoder, renderPass) {
        renderPass.end();

        if (this._renderPassTexture) {
            commandEncoder.copyTextureToTexture({ texture: this.renderer.texture }, { texture: this._renderPassTexture.texture }, [this.canvas.width, this.canvas.height]);
        }

    }














    public get pipeline(): GPURenderPipeline { return this.gpuPipeline }

    public get cullMode(): string { return this.description.primitive.cullMode }
    public set cullMode(s: string) { this.description.primitive.cullMode = s }

    public get topology(): string { return this.description.primitive.topology }
    public set topology(s: string) { this.description.primitive.topology = s }
}