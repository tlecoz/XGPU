import { BuiltIns } from "../../speechlessGPU/BuiltIns";
import { GPURenderer } from "../../speechlessGPU/GPURenderer";
import { HeadlessGPURenderer } from "../../speechlessGPU/HeadlessGPURenderer";
import { RenderPipeline } from "../../speechlessGPU/pipelines/RenderPipeline";
import { AlphaBlendMode } from "../../speechlessGPU/pipelines/resources/blendmodes/AlphaBlendMode";
import { IndexBuffer } from "../../speechlessGPU/pipelines/resources/IndexBuffer";
import { Float, Matrix4x4, Vec2, Vec3 } from "../../speechlessGPU/shader/PrimitiveType";
import { UniformBuffer } from "../../speechlessGPU/shader/resources/UniformBuffer";
import { ProjectionMatrix } from "../../speechlessGPU/shader/resources/uniforms/ProjectionMatrix";
import { VertexBuffer } from "../../speechlessGPU/shader/resources/VertexBuffer";
import { ShaderType } from "../../speechlessGPU/shader/ShaderType";
import { Graphics } from "./Graphics";

export class GraphicPipeline extends RenderPipeline {

    protected resource: any;


    protected useMultipleGraphics: boolean = false;
    protected graphicObjs: any[] = [];
    protected vertexId: number = 0;
    protected curveId: number = 0;
    protected triangleId: number = 0;
    protected graphicId: number = -1;

    private verts: number[] = [];
    private curvs: number[] = [];
    private dirty: boolean = false;
    private nbTriangleMax: number = 0;

    protected w: number;
    protected h: number;

    constructor(renderer: GPURenderer | HeadlessGPURenderer) {
        super(renderer);

        var viewMatrix = new Matrix4x4();
        viewMatrix.z = 0

        var model = new Matrix4x4();

        this.resource = this.initFromObject({
            blendMode: new AlphaBlendMode(),
            indexBuffer: new IndexBuffer({ nbPoint: 0 }),
            bindgroups: {
                geom: {
                    vertexBuffer: new VertexBuffer({
                        vertices: VertexAttribute.Vec4(),
                        curves: VertexAttribute.Vec3(),
                    }),



                    uniforms: new UniformBuffer({
                        dimension: new Vec3(100, 100, 0, true),
                        scale: new Vec3(1, 1, 1, true),
                        shapeScale: new Vec2(600, 600, true),
                        center: new Vec3(0, 0, 0, true),
                        rotation: new Float(0, true),
                        shapeRotation: new Float(0, true),
                        widthRatio: new Float(1.0, true),
                        model: model,
                        view: viewMatrix,
                        projection: new ProjectionMatrix(renderer.canvas.width, renderer.canvas.height, 45),
                    })

                }
            },

            vertexShader: {
                outputs: {
                    position: BuiltIns.vertexOutputs.position,
                    curves: ShaderType.Vec3,
                    pos: ShaderType.Vec3
                },
                main: `
                    var vertexPos = vec2(vertices.xy * shapeScale);
                    

                    
                    var a = atan2(vertexPos.y , vertexPos.x) + shapeRotation;
                    var d = sqrt(vertexPos.x * vertexPos.x + vertexPos.y * vertexPos.y);

                    vertexPos.x = cos(a) * d;
                    vertexPos.y = sin(a) * d;
                    
                   
                    var result = vec4(vertexPos * dimension.xy/shapeScale,0.0,1.0);
                    
                    a = atan2(result.y , result.x) + rotation;
                    d = sqrt(result.x * result.x + result.y * result.y);
                    result.x = cos(a) * d;
                    result.y = sin(a) * d * -1.0;

                    result = vec4(result.xyz *  scale + center,1.0);
                    

                    output.position = uniforms.projection *  uniforms.view * uniforms.model * vec4(vertexPos,0.0,1.0);;
                    output.pos = output.position.xyz;
                    output.curves = curves;
                `
            },

            fragmentShader: {

                outputs: {
                    color: BuiltIns.fragmentOutputs.color
                },
                main: `

                var col = vec4(1.0);
                var d = (curves.x * curves.x) - curves.y;
                
                if(curves.z == 0.0){
                    if(d > 0.0){
                        col.a = 0.0;
                    }
                }else{
                    if(d < 0.0){
                        col.a = 0.0;
                    }
                }
                
                var c = 1.0-(pos.z-1000.0) / 500.0;

                output.color = vec4(c,c,c,col.a);
                `
            },


        })

        this.onDrawEnd = () => {

            model.rotationX += 0.01;
            model.rotationY += 0.01;
            model.rotationZ += 0.01;




        }

        this.setupMultiSampleView({ size: [renderer.canvas.width, renderer.canvas.height], sampleCount: 4 })

    }

    public setGraphicById(id: number): any {

        //this.a.b = 12;

        if (id >= this.graphicObjs.length) return;
        this.graphicId = id;
        var obj: any = this.graphicObjs[id];

        //console.log("setGraphicById ",obj)

        this.widthRatio.x = obj.widthRatio;

        this.w = this.dimension.y * obj.widthRatio;
        this.h = this.dimension.y;


        if (this.dirty) {

            this.dirty = false;

            var len = this.nbTriangleMax * 3 * 7;
            var result = [];
            const verts = this.verts;
            const curvs = this.curvs;

            console.log("verts : ", verts.length, "    :    ", verts);
            console.log("curvs : ", curvs.length, "    :    ", curvs);
            let id = 0;
            let k = 0;
            for (let i = 0; i < len; i += 7) {
                result.push(verts[id * 4 + 0], verts[id * 4 + 1], verts[id * 4 + 2], verts[id * 4 + 3])
                result.push(curvs[id * 3 + 0], curvs[id * 3 + 1], curvs[id * 3 + 2])
                id++;
            }

            //console.log("vertex = ", result)
            this.vertexBuffer.datas = new Float32Array(result);


            /*
            this.vertexBuffer.datas = new Float32Array([
                -0.5, -0.5, 0, 0,
                0.5, -0.5, 0, 0,
                - 0.5, 0.5, 0, 0
            ])
            */
        }



        ////////////////////////////////console.log(id+" : "+obj.widthRatio);
        //console.log("this.geom.setDrawRange("+(obj.triangleId*3)+","+(obj.nbTriangle*3)+")");

        this.indexBuffer.offset = obj.triangleId * 3;
        this.indexBuffer.nbPoint = obj.nbTriangle * 3;

        console.log("index offset = ", obj.triangleId * 3, ",   nbPoint = ", obj.nbTriangle * 3)

        const indices = [];
        for (let i = 0; i < this.nbTriangleMax * 3; i++) indices[i] = i;
        this.indexBuffer.datas = new Uint32Array(indices);

        return obj;

    }

    public addGraphics(g: Graphics, pathId: number = 0): void {
        var obj: any = {};

        g.normalizeAndGetCurrentScale(pathId);
        g.createBufferDatas();

        if (this.nbTriangleMax < g.nbTriangleVisible) this.nbTriangleMax = g.nbTriangleVisible;

        if (!this.useMultipleGraphics) {
            this.vertexId = 0;
            this.curveId = 0;
            this.triangleId = 0;
        }

        obj.vertexId = this.vertexId;
        obj.curveId = this.curveId;
        obj.nbTriangle = g.nbTriangleVisible;
        obj.triangleId = this.triangleId;
        obj.widthRatio = g.widthRatio;
        this.triangleId += obj.nbTriangle;
        ////////////////////////////////console.log("triangleId = "+(this.triangleId*3));
        var vertex: number[] = this.verts;///Float32Array = this.vertices.array;
        //var vertex:Float32Array = this.vertices.array;
        var v: number[] = g.getVertexDataById(pathId);

        var i: number, len: number = v.length;
        var start: number = this.vertexId;
        for (i = 0; i < len; i++) vertex[start + i] = v[i];
        this.vertexId += len;

        var curves: number[] = this.curvs;//Float32Array = this.curves.array;
        var c: number[] = g.getCurveDataById(pathId);
        ////////////////////////////////console.log(c);
        len = c.length;
        start = this.curveId;
        for (i = 0; i < len; i++) curves[start + i] = c[i];
        this.curveId += len;

        this.dirty = true;
        obj.vertex = v;
        obj.curves = c;
        this.graphicObjs.push(obj)


        //console.log("widthRatio = ", this.resource.bindgroups.geom.uniforms.items.widthRatio)
    }


    private get vertexBuffer(): VertexBuffer { return this.resource.bindgroups.geom.vertexBuffer; }

    public get position(): Vec3 { return this.resource.bindgroups.geom.uniforms.items.center; }
    public get dimension(): Vec2 { return this.resource.bindgroups.geom.uniforms.items.dimension; }
    public get scale(): Vec3 { return this.resource.bindgroups.geom.uniforms.items.scale; }
    public get rotation(): Float { return this.resource.bindgroups.geom.uniforms.items.rotation; }
    public get widthRatio(): Float { return this.resource.bindgroups.geom.uniforms.items.widthRatio; }

}