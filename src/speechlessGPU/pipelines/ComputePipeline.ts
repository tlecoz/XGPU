import { SLGPU } from "../SLGPU";
import { Bindgroup } from "../shader/Bindgroup";
import { ComputeShader } from "../shader/ComputeShader";
import { ImageTextureIO } from "../shader/resources/ImageTextureIO";
import { VertexBuffer } from "../shader/resources/VertexBuffer";
import { VertexBufferIO } from "../shader/resources/VertexBufferIO";
import { ShaderStruct } from "../shader/shaderParts/ShaderStruct";
import { Pipeline } from "./Pipeline";
import { ImageTexture } from "../shader/resources/ImageTexture";


export class ComputePipeline extends Pipeline {

    public computeShader: ComputeShader;
    public onReceiveData: (datas: Float32Array) => void;


    protected gpuComputePipeline: GPUComputePipeline;
    public workgroups: number[];
    protected dispatchWorkgroup: number[];
    protected bufferSize: number;
    protected textureSize: number[];// [width,height]
    protected stagingBuffer: GPUBuffer;
    protected canCallMapAsync: boolean = true;
    protected bufferIOs: VertexBuffer[];
    protected textureIOs: ImageTexture[];
    private checkedBufferIO: boolean = false;
    private checkedTextureIO: boolean = false;

    constructor() {
        super()
        this.computeShader = new ComputeShader();
        this.type = "compute";
    }

    public set useRenderPipeline(b: boolean) {
        if (b) this.type = "compute_mixed";
        else this.type = "compute";
    }

    public initFromObject(descriptor: {
        bindgroups?: any,
        computeShader: {
            outputs?: any,
            main: string
            inputs: any,
            code?: string,
        },
    }) {



        if (descriptor.bindgroups) {
            let group: Bindgroup;
            for (let z in descriptor.bindgroups) {
                group = new Bindgroup(z);
                group.initFromObject(descriptor.bindgroups[z]);
                //console.log(group)
                this.bindGroups.add(group);
            }
        }

        const computeOutput = descriptor.computeShader.outputs;

        if (computeOutput) {
            const cOutput = [];
            let o: any;
            for (let z in computeOutput) {
                o = computeOutput[z];
                cOutput.push({ name: z, ...o })
            }
            this.computeShader.outputs = cOutput;

        }

        const t = [];
        for (let z in descriptor.computeShader.inputs) t.push({ name: z, ...descriptor.computeShader.inputs[z] });
        //console.log("TTTTTT ", t)
        this.computeShader.inputs = t//descriptor.computeShader.inputs;

        if (descriptor.computeShader.code) this.computeShader.code.text = descriptor.computeShader.code;
        this.computeShader.main.text = descriptor.computeShader.main;

        return descriptor;

    }



    public setWorkgroups(x: number, y: number = 1, z: number = 1) {
        this.workgroups = [x, y, z];
    }


    public setDispatchWorkgroup(x: number = 1, y: number = 1, z: number = 1) {
        this.dispatchWorkgroup = [x, y, z];
    }


    protected cleanInputsAndInitBufferIO() {
        const _inputs = [];
        const t = this.computeShader.inputs;
        let o: any;
        let k = 0;
        for (let i = 0; i < t.length; i++) {
            o = t[i];
            if (o instanceof VertexBufferIO || o instanceof ImageTextureIO) {
                if (o instanceof VertexBufferIO) {
                    this.bufferSize = o.bufferSize;
                }
                //o.init(this);
                continue;
            }
            _inputs[k++] = t[i];
        }
        this.computeShader.inputs = _inputs;
        return _inputs;
    }


    public update(): void {
        if (!this.gpuComputePipeline) return;
        this.bindGroups.update();
    }



    public buildGpuPipeline() {

        if (this.gpuComputePipeline) return this.gpuComputePipeline;

        let pipeline: Pipeline = this;

        this.initPipelineResources(this);


        this.createLayouts();
        this.bindGroups.handleComputePipelineResourceIOs();

        this.cleanInputsAndInitBufferIO();

        if (!this.workgroups) this.setWorkgroups(64);

        let nb = this.workgroups[0];
        if (!this.dispatchWorkgroup) {
            //console.log("=> ", this.bindGroups.resources.types)

            if (this.bindGroups.resources.types.vertexBuffers) {


                const nbVertex = this.bindGroups.resources.types.vertexBuffers[0].resource.nbVertex;

                let num = nbVertex / nb;
                if (num >= 65536) {
                    this.workgroups[0] *= 2;
                    nb = this.workgroups[0];
                    num = nbVertex / nb
                }

                this.setDispatchWorkgroup(Math.ceil(nbVertex / nb))

            } else if (this.bindGroups.resources.types.imageTextures) {
                let images = this.bindGroups.resources.types.imageTextures;
                let textureIo: ImageTexture;
                for (let i = 0; images.length; i++) {
                    if (images[i].resource.io == 1) {
                        textureIo = images[i].resource;
                        break;
                    }
                }

                const w = textureIo.gpuResource.width;
                const h = textureIo.gpuResource.height;

                let groupSize = 16;
                //this.workgroups[0] = this.workgroups[1] = groupSize;
                //this.setDispatchWorkgroup(Math.ceil(w / groupSize), Math.ceil(h / groupSize));
                this.workgroups[0] = this.workgroups[1] = 1;
                this.setDispatchWorkgroup(w, h);
            }





        }

        const outputs = this.computeShader.outputs;
        const inputs = this.computeShader.inputs;


        for (let i = 0; i < outputs.length; i++) {
            if (outputs[i].type.createGpuResource) { //it's a pipeline resource
                (outputs[i] as any).isOutput = true;
                inputs.push(outputs[i]);
            }
        }



        const inputStruct: ShaderStruct = new ShaderStruct("Input", [...inputs]);;
        const { code, output } = this.computeShader.build(this, inputStruct)

        this.description.compute = {
            module: SLGPU.device.createShaderModule({ code: code }),
            entryPoint: "main"
        }
        this.description.layout = this.gpuPipelineLayout;

        //console.log("description = ", this.description)

        this.gpuComputePipeline = SLGPU.createComputePipeline(this.description);


        return this.gpuComputePipeline;
    }









    public async nextFrame() {


        const commandEncoder = SLGPU.device.createCommandEncoder();

        this.update();

        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(this.buildGpuPipeline());

        this.bindGroups.update();
        this.bindGroups.apply(computePass)
        //console.log("this.dispatchWorkgroup = ", this.dispatchWorkgroup)
        computePass.dispatchWorkgroups(this.dispatchWorkgroup[0], this.dispatchWorkgroup[1], this.dispatchWorkgroup[2]);
        computePass.end();

        const vertexBuffers = this.bindGroups.resources.types.vertexBuffers;
        const imageTextures = this.bindGroups.resources.types.imageTextures;

        if (!this.checkedBufferIO && !this.bufferIOs) {
            this.checkedBufferIO = true;
            let inputBuffer;
            let outputBuffer;
            if (vertexBuffers) {
                for (let i = 0; i < vertexBuffers.length; i++) {
                    if (vertexBuffers[i].resource.io) {
                        inputBuffer = vertexBuffers[i].resource;
                        outputBuffer = vertexBuffers[i + 1].resource;
                        break;
                    }
                }
            }
            if (inputBuffer) {
                this.bufferIOs = [inputBuffer, outputBuffer];
                this.bufferSize = inputBuffer.bufferSize;
            }
        }

        if (!this.checkedTextureIO && !this.textureIOs) {
            this.checkedTextureIO = true;
            let input;
            let output;
            if (imageTextures) {
                for (let i = 0; i < imageTextures.length; i++) {
                    if (imageTextures[i].resource.io) {
                        input = imageTextures[i].resource;
                        output = imageTextures[i + 1].resource;
                        break;
                    }
                }
            }
            if (input) {
                this.textureIOs = [input, output];
                this.textureSize = [input.gpuResource.width, input.gpuResource.height];
            }

        }


        //------

        if (this.bufferIOs) {

            const buffer = this.bufferIOs[0].buffer; // getting this value change the reference of the GPUBuffer and create the "ping pong"

            if (this.onReceiveData) {

                if (!this.canCallMapAsync) return

                if (!this.stagingBuffer) this.stagingBuffer = SLGPU.createStagingBuffer(this.bufferSize);
                const copyEncoder = SLGPU.device.createCommandEncoder();
                const stage = this.stagingBuffer;


                copyEncoder.copyBufferToBuffer(buffer, 0, stage, 0, stage.size);

                SLGPU.device.queue.submit([copyEncoder.finish(), commandEncoder.finish()]);

                this.canCallMapAsync = false;
                await this.stagingBuffer.mapAsync(GPUMapMode.READ, 0, stage.size)
                this.canCallMapAsync = true;

                const copyArray = stage.getMappedRange(0, stage.size);
                const data = copyArray.slice(0);
                stage.unmap();

                this.onReceiveData(new Float32Array(data));

            } else {
                SLGPU.device.queue.submit([commandEncoder.finish()]);
            }

        } else {
            const texture = this.textureIOs[0].texture;


            SLGPU.device.queue.submit([commandEncoder.finish()]);
            // getting this value change the reference of the GPUBuffer and create the "ping pong"
        }

    }

}