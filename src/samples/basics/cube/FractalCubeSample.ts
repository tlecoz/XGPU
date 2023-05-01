import { GPURenderer } from "../../../xGPU/GPURenderer";
import { ImageTexture } from "../../../xGPU/shader/resources/ImageTexture";
import { TextureSampler } from "../../../xGPU/shader/resources/TextureSampler";
import { Sample } from "../../Sample";
import { Cube } from "./RotatingCubeSample";




export class FractalCubeSample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {

        const cube = new Cube(renderer, {
            imageSampler: new TextureSampler(),
            image: new ImageTexture({ source: null }),
            fragmentShader: ` 
                output.color = textureSample(image, imageSampler, fragUV) + fragPosition;
            `
        })

        const transform = cube.transform;
        transform.scaleX = transform.scaleY = transform.scaleZ = 200;
        cube.onDrawBegin = () => {
            transform.rotationX += 0.01;
            transform.rotationY += 0.01;
            transform.rotationZ += 0.01;
        }

        cube.onDrawEnd = () => {
            cube.resources.image.source = cube.renderPass.texture;
        }


        renderer.addPipeline(cube)


    }

}