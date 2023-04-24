
export class SoundSpectrum {

    protected ctx: AudioContext;
    protected sourceNode: AudioBufferSourceNode;
    protected processor: ScriptProcessorNode;
    protected analyser: AnalyserNode;


    //a basic sound spectrum class based on WebAudio 

    constructor(audioFileUrl: string, spectrumBufferSize: number = 1024, onReady?: () => void, options?: AudioContextOptions) {

        console.log("aaa ", spectrumBufferSize)

        this.ctx = new AudioContext(options);
        this.getAudioBuffer(audioFileUrl).then((buffer) => {

            this.sourceNode = new AudioBufferSourceNode(this.ctx, {
                buffer,
                loop: true
            })

            this.sourceNode = new AudioBufferSourceNode(this.ctx, {
                buffer,
                loop: true
            });



            this.gain = this.ctx.createGain();//new GainNode(this.ctx);
            this.analyser = new AnalyserNode(this.ctx);
            this.processor = this.ctx.createScriptProcessor(spectrumBufferSize, 2, 1);

            this.sourceNode.connect(this.gain); // Connectez le noeud source au noeud de gain
            this.gain.connect(this.ctx.destination);
            this.sourceNode.connect(this.analyser);
            this.analyser.connect(this.processor);
            this.processor.connect(this.ctx.destination);


            if (onReady) onReady();
        })
    }

    public get volume(): number { return this.gain.gain.value; }

    protected gain: GainNode;
    public set volume(n: number) {
        this.gain.gain.value = n;
    }

    public play(onGetAudioData: (audioData: Uint8Array) => void, options?: { when?: number, offset?: number, duration?: number }) {
        if (options) this.sourceNode.start(options.when, options.offset, options.duration);
        else this.sourceNode.start(0);

        this.processor.onaudioprocess = () => {

            const bufferSize = this.processor.bufferSize;
            const amplitudeArray = new Uint8Array(bufferSize);

            //const amplitudeArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteTimeDomainData(amplitudeArray);
            if (this.ctx.state === "running") {
                onGetAudioData(amplitudeArray);
            }
        }
    }

    private getAudioBuffer(url: string) {
        return new Promise(async (resolve: (e: AudioBuffer) => void, error: (e: any) => void) => {

            fetch(url)
                .then((response) => response.arrayBuffer())
                .then((loadedBuffer) => this.ctx.decodeAudioData(loadedBuffer))
                .then((audioData) => {
                    console.log(audioData)
                    resolve(audioData)
                }).catch((e) => {
                    error(e);
                });
        });
    }
}



