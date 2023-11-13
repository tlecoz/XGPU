import { BuiltIns } from "../BuiltIns";
import { UniformBuffer } from "../shader/resources/UniformBuffer";
import { RenderPipeline } from "./RenderPipeline";
import { VertexShaderDebuggerPipeline } from "./VertexShaderDebuggerPipeline";

export class VertexShaderRenderDebuggerPipeline extends VertexShaderDebuggerPipeline {


    constructor() {
        super();
    }


    protected nbRenderDebugInstance: number;
    protected vertexCountChanged: boolean;
    protected setupRenderDebugger() {

        this.vertexCountChanged = false;

        const debugs: { label: string, val: string, color: string }[] = this.renderPipeline.vertexShader.debugRenders;
        this.nbRenderDebugInstance = debugs.length;

        this.renderPipeline.instanceCount += this.nbRenderDebugInstance;
        if (this.renderPipeline.vertexCount < 4) {
            this.renderPipeline.vertexCount = 4;
            this.vertexCountChanged = true;
        }




    }



    public init(renderPipeline: RenderPipeline, config: { nbVertex: number, startVertexId: number, instanceId: number }) {


        this.config = config;
        this.computeShaderObj = {
            bindgroups: {
                io: {}, //computeShaders have a reserved bindgroup 'io' , dedicated to the ping-pong process 
            }
        };


        this.initRenderPipeline(renderPipeline);
        this.setupIndexBuffer();
        this.setupDataStructure();
        this.setupVertexShaderBuiltIns();
        this.setupUniformBuffers();
        this.setupVertexBuffers();
        this.setupComputeShaderVertexBufferIO();







        this.buildComputeShader();


        this.onComputeBegin = () => {
            this.copyUniformsFromRenderToCompute();
        }


    }

}