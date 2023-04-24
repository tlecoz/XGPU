import { GPURenderer } from "../xGPU/GPURenderer";
import { HeadlessGPURenderer } from "../xGPU/HeadlessGPURenderer";
import { CubeMapTexture } from "../xGPU/shader/resources/CubeMapTexture";
import { TextureSampler } from "../xGPU/shader/resources/TextureSampler";
import { Sample } from "./Sample"
import { RotatingCube } from "./Test13";


export class CubeMap extends RotatingCube {




    protected createResources(o: { renderer: GPURenderer | HeadlessGPURenderer, options: { sides: ImageBitmap[] } }): any {

        const { renderer, options } = o;
        const { sides } = options;

        const resource = super.createResources({ renderer });


        resource.bindgroups.fragment = {
            imgSampler: new TextureSampler(),
            img: new CubeMapTexture({
                size: [1024, 1024, 6],
                source: sides
            })
        }

        resource.fragmentShader.main = `
        var cubemapVec = fragPosition.xyz - vec3(0.5);
        output.color = textureSample(img, imgSampler, cubemapVec);
        `

        return resource;

    }


    constructor(renderer: GPURenderer | HeadlessGPURenderer, options: any) {
        super(renderer, options);


        let now = new Date().getTime();

        this.onDrawEnd = () => {

            let time = (new Date().getTime() - now) / 1000;
            this.scaleX = this.scaleY = this.scaleZ = 10000;
            this.rotationY = Math.sin(time * 0.15 + 1) * Math.PI;
            this.rotationX = 0.25 + Math.cos(time * 0.4) * Math.PI * 0.1;
        }
    }



}




export class Test14 extends Sample {


    constructor() {
        super(1024, 1024);
    }

    protected async loadSides(urls: string[]): Promise<ImageBitmap[]> {

        return new Promise(async (onResolve: (v: any) => void, onError: (e: any) => void) => {

            const promises = urls.map((src) => {
                const img = document.createElement("img");
                img.src = src;
                return img.decode().then(() => createImageBitmap(img))
            })

            onResolve(await Promise.all(promises));

        })
    }

    protected async start(renderer: GPURenderer): Promise<void> {


        const sides: ImageBitmap[] = await this.loadSides([
            "../../assets/cube/posx.jpg",
            "../../assets/cube/negx.jpg",
            "../../assets/cube/posy.jpg",
            "../../assets/cube/negy.jpg",
            "../../assets/cube/posz.jpg",
            "../../assets/cube/negz.jpg",
        ])

        const { bmp } = this.medias;
        const t = [bmp, bmp, bmp, bmp, bmp, bmp]

        const cube = new CubeMap(renderer, { sides });
        renderer.addPipeline(cube);

    }

}