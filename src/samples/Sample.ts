import { GPURenderer } from "../speechlessGPU/GPURenderer";

export class Sample {

    protected medias: {
        bmp: ImageBitmap,
        bmp2: ImageBitmap,
        video: HTMLVideoElement
    }

    constructor(w: number = 512, h: number = 512) {

        const renderer = new GPURenderer()
        renderer.initCanvas(w, h, true).then(async (canvas) => {
            document.body.appendChild(canvas);
            this.medias = await this.loadMedias();
            this.start(renderer);
        })

        const animate = () => {
            renderer.update();
            requestAnimationFrame(animate);
        }

        animate();
    }

    private async loadMedias() {
        const loadImage = (url: string) => {
            return new Promise((resolve: (bmp: ImageBitmap) => void, error: (e: any) => void) => {
                const img = document.createElement("img");
                img.onload = () => {
                    createImageBitmap(img).then((bmp) => {
                        resolve(bmp);
                    })
                }
                img.onerror = (e) => {
                    error(e)
                }
                img.src = url;
            });
        }

        const loadVideo = (url: string) => {
            return new Promise(async (resolve: (video: HTMLVideoElement) => void, error: (e: any) => void) => {
                const video = document.createElement("video");
                video.src = url;
                video.loop = true;
                video.muted = true;
                video.onerror = error;
                await video.play();
                resolve(video)
            });
        }

        return new Promise(async (resolve: (o: any) => void, error: (e: any) => void) => {

            const bmp = await loadImage("../../assets/leaf.png")
            const bmp2 = await loadImage("../../assets/leaf2.png")
            const video = await loadVideo("../../assets/video.webm")

            resolve({ bmp, bmp2, video });
        })

    }


    protected async start(renderer: GPURenderer) {

    }

} 