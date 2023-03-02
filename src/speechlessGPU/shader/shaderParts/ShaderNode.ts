export class ShaderNode {

    public enabled: boolean = true;
    public executeSubNodeAfterCode: boolean = true;


    private _text: string;
    private insideMainFunction: boolean;

    private subNodes: ShaderNode[];

    constructor(code: string = "", insideMainFunction: boolean = false) {
        this.text = code;
        this.insideMainFunction = insideMainFunction;
    }


    public get text(): string { return this._text }
    public set text(s: string) {


        //--------- remove useless tabulations while keeping tabs structure -------

        const lines = s.split("\n");
        let line;
        let nbTabMin = 99999999;

        for (let i = 0; i < lines.length; i++) {
            line = lines[i];
            for (let j = 0; j < lines[i].length; j++) {
                if (line[j] === "\n") continue;
                if (line[j] !== " ") {
                    if (nbTabMin > j - 1) nbTabMin = j - 1;
                    break;
                }
            }


        }
        if (this.insideMainFunction && nbTabMin >= 3) nbTabMin -= 3;
        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].slice(nbTabMin);
        }

        s = lines.join("\n");

        //-----------------------------------------------------------------------

        this._text = s;
    }

    public replaceValues(values: { old: string, new: string }[]) {
        for (let i = 0; i < values.length; i++) {
            this._text = this._text.replace(values[i].old, values[i].new);
        }
    }


    public get value(): string {

        let result = "";

        if (this.executeSubNodeAfterCode) result += this.text + "\n";

        if (this.subNodes) {
            for (let i = 0; i < this.subNodes.length; i++) {
                result += this.subNodes[i].text + "\n";
            }
        }

        if (!this.executeSubNodeAfterCode) result += this.text + "\n";

        return result;
    }

    public createNode(code: string = ""): ShaderNode {
        const node = new ShaderNode(code);
        if (!this.subNodes) this.subNodes = [];
        this.subNodes.push(node);
        return node;
    }




}