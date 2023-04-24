import { BuiltIns } from "../../../speechlessGPU/BuiltIns";
import { GPURenderer } from "../../../speechlessGPU/GPURenderer";
import { Float, Vec2 } from "../../../speechlessGPU/shader/PrimitiveType";
import { ShaderType } from "../../../speechlessGPU/shader/ShaderType";
import { ImageTexture } from "../../../speechlessGPU/shader/resources/ImageTexture";
import { TextureSampler } from "../../../speechlessGPU/shader/resources/TextureSampler";
import { VertexAttribute } from "../../../speechlessGPU/shader/resources/VertexAttribute";
import { VertexBuffer } from "../../../speechlessGPU/shader/resources/VertexBuffer";
import { Sample } from "../../Sample";
import { Cube } from "../cube/RotatingCubeSample";
import { SoundSpectrum } from "./SoundSpectrum";





export class SoundSpectrumBuffer extends VertexBuffer {

    protected spectrum: SoundSpectrum;
    protected ready: boolean = false;

    constructor(attributeName: string, nbValue: number) {
        const o: any = {};
        o[attributeName] = VertexAttribute.Float()
        super(o, { stepMode: "instance", datas: new Float32Array(nbValue) })

    }

    public init(audioFileUrl: string, onReady?: () => void) {

        this.spectrum = new SoundSpectrum(audioFileUrl, this.datas.length, () => {
            this.ready = true;
            if (onReady) onReady();
        })
    }

    public play(): void {
        this.spectrum.play((audioData: Uint8Array) => {
            console.log(audioData.length)
            this.datas.set(new Float32Array(audioData));
            this.mustBeTransfered = true;
        })
    }

    public get isReady(): boolean { return this.ready; }
    public get volume(): number { return this.spectrum.volume }
    public set volume(n: number) { this.spectrum.volume = n; }
    public get length(): number { return this.datas.length; }
}






export class SoundSpectrumSample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {

        const gridSize: number = 32;
        const spectrumBuffer = new SoundSpectrumBuffer("amplitude", gridSize * gridSize);
        spectrumBuffer.init("../../../../assets/audio.wav", () => {
            spectrumBuffer.volume = 1.;
            spectrumBuffer.play();
        })

        const cube = new Cube(renderer, {
            instanceCount: spectrumBuffer.length,
            gridSize: new Float(gridSize),
            spectrumBuffer,
            instanceId: BuiltIns.vertexInputs.instanceIndex,
            textureSampler: new TextureSampler({ magFilter: "nearest", minFilter: "nearest" }),
            image: new ImageTexture({ source: this.medias.bmp }),
            vertexShader: {
                outputs: {
                    fragUV: ShaderType.Vec2,
                    fragPosition: ShaderType.Vec4,
                },
                code: `
                fn createMatrix( x:f32,y:f32,z:f32, sx:f32, sy:f32, sz:f32)->mat4x4<f32> {
                    let matrix = mat4x4<f32>(
                        sx, 0.0, 0.0, 0.0,
                        0.0, sy, 0.0, 0.0,
                        0.0, 0.0, sz, 0.0,
                        x, y, z, 1.0);
                    return matrix;
                }
                `,
                main: `
                let id = f32(instanceId);
                let idx = id % gridSize;
                let idy = floor(id / gridSize);
               
                var px = -0.5 + idx / (gridSize-1.0) ;
                var py = -0.5 + idy / (gridSize-1.0) ;

                let pct = amplitude / 256.0;
                
                let size =  200 + 200.0  * pct;
                let margin = 0.0;//5.0*(pct*0.5);
                let quadSize = size / gridSize - margin;
                let depthMax = 100.0;
                
                output.position = uniforms.projection * uniforms.modelView * createMatrix(px*size,py*size,0.0, quadSize,quadSize,pct *depthMax)  *  position;
                output.fragUV = vec2(0.5+ position.xy/size*quadSize);
                output.fragUV += vec2(px,py);
                
                output.fragPosition = 0.5 * (position + vec4(1.0, 1.0, 1.0, 1.0));
            `}
            , fragmentShader: `output.color = textureSample(image, textureSampler, fragUV);`
        })

        const transform = cube.modelView;
        transform.scaleX = transform.scaleY = transform.scaleZ = 2;

        cube.onDrawBegin = () => {
            transform.rotationX += 0.003;
            transform.rotationY = 0.3;
            transform.rotationZ += 0.003;
        }

        renderer.addPipeline(cube)
    }
}