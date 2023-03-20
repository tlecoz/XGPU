import { EarCutting } from "./EarCutting";

export class Graphics {

    private _paths: number[][] = [];
    private _nbPath: number = 0;
    private _curvePoints: number[];
    private _widthRatio: number; // => (width  / height) of the path
    private oldX: number = null;
    private oldY: number = null;
    private oldZ: number = null;
    private startX: number = null;
    private startY: number = null;
    private startZ: number = null;
    private closedPath: boolean = false;

    //polygon variable
    private radius: number;
    private cx: number;
    private cy: number;


    //vertexBufferDatas
    private vertex: number[][] = [];
    private curves: number[][] = [];
    private nbTriangle: number[] = [];

    //graphic perimeter
    private perimeters: number[][] = [];
    private perimeterPercents: number[][] = [];

    //debug
    //private canvas:HTMLCanvasElement;
    //private context:CanvasRenderingContext2D;

    private normalized: boolean[] = [];


    constructor() {

        ////////////////////////////////console.log("Graphics");
        /*
         this.canvas = document.createElement("canvas")
         this.canvas.width = this.canvas.height = 1000;
         this.context = this.canvas.getContext("2d");
         document.body.appendChild(this.canvas)*/
    }

    public moveTo(px: number, py: number, pz: number = 0): Graphics {


        this.oldX = this.startX = px;
        this.oldY = this.startY = py;
        this.oldZ = this.startZ = pz;

        this._paths[this._nbPath] = this._curvePoints = [];
        this.normalized[this._nbPath] = false;
        this.nbTriangle[this._nbPath] = 0;
        this._curvePoints.push(this.oldX, this.oldY, this.oldZ); //first point

        this._nbPath++
        this.closedPath = false;
        return this;
    }
    public lineTo(px: number, py: number, pz: number = 0): Graphics {
        if (this.closedPath) return;

        var dx: number = px - this.oldX;
        var dy: number = py - this.oldY;
        var dz: number = pz - this.oldZ;

        var a: number = Math.atan2(dy, dx);
        var d: number = Math.sqrt(dx * dx + dy * dy) * 0.5;

        var x: number = this.oldX + Math.cos(a) * d;
        var y: number = this.oldY + Math.sin(a) * d;
        var z: number = this.oldZ + (pz - this.oldZ) * 0.5;

        this._curvePoints.push(x, y, z); // anchor

        this._curvePoints.push(px, py, pz); //second point

        this.oldX = px;
        this.oldY = py;
        this.oldZ = pz;

        this.closedPath = (px == this.startX && py == this.startY && pz == this.startZ);
        return this;
    }

    public curveTo(ax: number, ay: number, az: number, px: number, py: number, pz: number): Graphics {
        if (this.closedPath) return;

        this._curvePoints.push(ax, ay, az); //anchor point
        this._curvePoints.push(px, py, pz); //second point
        this.oldX = px;
        this.oldY = py;
        this.oldZ = pz;

        // //////////////////////////////console.log(px+" vs "+this.startX+" && "+py+" vs "+this.startY);

        var dx: number = Math.abs(px - this.startX);
        var dy: number = Math.abs(py - this.startY);
        var dz: number = Math.abs(pz - this.startZ);

        this.closedPath = (dx + dy + dz) < 0.01;



        return this;
    }

    //--------------------
    //polygon and circle functions :
    //http://stackoverflow.com/questions/26947321/building-a-circle-with-quadratic-curves-in-canvas

    // functions to calc a point on circumference of circle
    private xx(a: number): number { return (this.cx + this.radius * Math.cos(a)); }
    private yy(a: number): number { return (this.cy + this.radius * Math.sin(a)); }

    // general interpolation function
    private lerp(a: number, b: number, x: number): number { return (a + x * (b - a)); }

    // given a side of a regular polygon,
    // calc a qCurve that approximates a circle
    private makePolySide(n: number, sideCount: number) {

        var PI2: number = Math.PI * 2;
        // starting & ending angles vs centerpoint
        var sweep: number = PI2 / sideCount;
        var sAngle: number = sweep * (n - 1);
        var eAngle: number = sweep * n;

        // given start & end points,
        // calc the point on circumference at middle of sweep angle
        var x0: number = this.xx(sAngle);
        var y0: number = this.yy(sAngle);
        var x1: number = this.xx((eAngle + sAngle) / 2);
        var y1: number = this.yy((eAngle + sAngle) / 2);
        var x2: number = this.xx(eAngle);
        var y2: number = this.yy(eAngle);

        // calc the control points to pass a qCurve
        // through the 3 points
        var dx: number = x2 - x1;
        var dy: number = y2 - y1;
        var a: number = Math.atan2(dy, dx);
        var midX: number = this.lerp(x0, x2, 0.50);
        var midY: number = this.lerp(y0, y2, 0.50);

        // calc middle control point
        var cpX: number = 2 * x1 - x0 / 2 - x2 / 2;
        var cpY: number = 2 * y1 - y0 / 2 - y2 / 2;

        return ({
            x0: x0, y0: y0,
            x2: x2, y2: y2,
            midX: midX, midY: midY,
            cpX: cpX, cpY: cpY,
        });
    }


    public drawPoly(px: number, py: number, pz: number, radius: number, sideCount: number, circleInterpolatePercent: number = 0): Graphics {
        this.cx = px;
        this.cy = py;
        this.radius = radius;

        var sides: any[] = [];
        var s: any;
        var i: number, cpx: number, cpy: number;
        for (i = 0; i < sideCount; i++) sides[i] = this.makePolySide(i, sideCount);

        this.moveTo(sides[0].x0, sides[0].y0, pz);
        for (i = 0; i < sideCount; i++) {
            s = sides[i];
            cpx = this.lerp(s.midX, s.cpX, circleInterpolatePercent);
            cpy = this.lerp(s.midY, s.cpY, circleInterpolatePercent);
            this.curveTo(cpx, cpy, pz, s.x2, s.y2, pz);
        }
        return this;
    }
    public drawCircle(px: number, py: number, pz: number, radius: number): Graphics {
        this.drawPoly(px, py, pz, radius, 5, 1);
        return this;
    }

    public drawRect(px: number, py: number, pz: number, w: number, h: number): Graphics {
        var w2: number = w / 2;
        var h2: number = h / 2;
        this.moveTo(px - w2, py - h2);
        this.lineTo(px + w2, py - h2);
        this.lineTo(px + w2, py + h2);
        this.lineTo(px - w2, py + h2);
        this.lineTo(px - w2, py - h2);
        return this;
    }
    public drawRoundRect(px: number, py: number, pz: number, w: number, h: number, radius: number): Graphics {
        var w2: number = w / 2;
        var h2: number = h / 2;
        this.moveTo(px - (w2 - radius), py - h2, pz);
        this.lineTo(px + (w2 - radius), py - h2, pz);
        this.curveTo(px + w2, py - h2, pz, px + w2, py - (h2 - radius), pz);
        this.lineTo(px + w2, py + (h2 - radius), pz);
        this.curveTo(px + w2, py + h2, pz, px + (w2 - radius), py + h2, pz);
        this.lineTo(px - (w2 - radius), py + h2, pz);
        this.curveTo(px - w2, py + h2, pz, px - w2, py + (h2 - radius), pz);
        this.lineTo(px - w2, py - (h2 - radius), pz);
        this.curveTo(px - w2, py - h2, pz, px - (w2 - radius), py - h2, pz);
        return this;
    }

    //------------------






    public get pathIsClosed(): boolean {
        return this.closedPath;
    }
    public get curvePoints(): number[] {
        return this._curvePoints;
    }



    //------------------------------



    private createTriangulatablePath(curvePoints: number[]): number[] {

        var n: number, i: number, len: number = curvePoints.length
        var x0: number, y0: number, ax: number, ay: number, x1: number, y1: number
        var pointAngle: number, anchorAngle: number, da: number;
        var result: number[] = [];


        x0 = curvePoints[0];
        y0 = curvePoints[1];


        for (i = 3; i < len; i += 6) {

            ax = curvePoints[i];
            ay = curvePoints[i + 1];
            x1 = curvePoints[i + 3];
            y1 = curvePoints[i + 4];

            pointAngle = Math.atan2(y1 - y0, x1 - x0);
            anchorAngle = Math.atan2(ay - y0, ax - x0);
            da = anchorAngle - pointAngle;
            if (da > Math.PI) da -= Math.PI * 2
            if (da < -Math.PI) da += Math.PI * 2

            if (da < 0) {
                result.push(x0, y0)
                result.push(x1, y1)
            } else {
                result.push(x0, y0)
                result.push(ax, ay)
                result.push(x1, y1)
            }
            x0 = x1;
            y0 = y1;

        }

        return result
    }












    public normalizeAndGetCurrentScale(pathId: number = 0): number {
        //if(this.normalized[pathId]) return;

        var t: number[] = this._paths[pathId];
        var i: number, len: number = t.length;

        var minX: number = 10000000;
        var minY: number = 10000000;
        var maxX: number = -10000000;
        var maxY: number = -10000000;
        var px: number, py: number;
        for (i = 0; i < len; i += 3) {
            px = t[i];
            py = t[i + 1];
            if (minX > px) minX = px;
            if (minY > py) minY = py;
            if (maxX < px) maxX = px;
            if (maxY < py) maxY = py;
        }
        maxX -= minX;
        maxY -= minY;

        this._widthRatio = maxX / maxY;
        ////////////////////////////////console.log(this._widthRatio+" = "+maxX+" / "+maxY);
        var scale: number = Math.max(maxX, maxY);
        for (i = 0; i < len; i++) t[i] = t[i] / scale;

        ////////////////////////////////console.log("scale = "+scale)
        //this.normalized[pathId] = true;

        return scale;
    }
    public get widthRatio(): number {
        return this._widthRatio;
    }





    public normalizeAndGetCurrentScaleForCanvas(pathId: number = 0): number {
        if (this.normalized[pathId]) return;

        var t: number[] = this._paths[pathId];
        var i: number, len: number = t.length;

        var minX: number = 10000000;
        var minY: number = 10000000;
        var maxX: number = -10000000;
        var maxY: number = -10000000;
        var px: number, py: number;
        for (i = 0; i < len; i += 2) {
            px = t[i];
            py = t[i + 1];
            if (minX > px) minX = px;
            if (minY > py) minY = py;
            if (maxX < px) maxX = px;
            if (maxY < py) maxY = py;
        }
        maxX -= minX;
        maxY -= minY;
        this._widthRatio = maxX / maxY;

        var scale: number = Math.max(maxX, maxY);
        for (i = 0; i < len; i++) t[i] = 0.5 + t[i] / scale;

        ////////////////////////////////console.log("scale = "+scale)
        this.normalized[pathId] = true;

        return scale;
    }



    public renderToCanvas(inside: HTMLImageElement, w: number, h: number, scaleX: number, scaleY: number, rotation: number, offsetX: number = 0, offsetY: number = 0, pathId: number = 0): HTMLCanvasElement {
        if (!this.normalized[pathId]) this.normalizeAndGetCurrentScaleForCanvas(pathId);

        var t: number[] = this._paths[pathId].concat();
        var i: number, len: number = t.length;
        var size: number = Math.max(w, h);
        var px: number, py: number, a: number, d: number;
        var minX: number = 10000000, minY: number = 10000000, maxX: number = -10000000, maxY: number = -10000000;
        for (i = 0; i < len; i += 3) {
            //t[i] *= size * scaleX;
            //t[i+1] *= size * scaleY;

            px = t[i];
            py = t[i + 1];
            a = Math.atan2(py, px) + rotation;
            d = Math.sqrt(px * px + py * py);
            ////////////////////////////////console.log("RTC > "+ d);
            px = t[i] = (Math.cos(a)) * d * size * scaleX;
            py = t[i + 1] = (Math.sin(a)) * d * size * scaleY;

            if (px < minX) minX = px;
            if (py < minY) minY = py;
            if (px > maxX) maxX = px;
            if (py > maxY) maxY = py;
        }

        //////////////////////////////console.log("RENDER TO CANVAS ------------------ ",this.normalized)
        //////////////////////////////console.log(inside.width,inside.height)
        //////////////////////////////console.log("-----------------------------------")
        var result: HTMLCanvasElement = document.createElement("canvas");
        result.width = (maxX - minX) * 2;
        result.height = (maxY - minY) * 2;

        var context: CanvasRenderingContext2D = result.getContext("2d");
        context.fillStyle = "#000000";
        //context.fillStyle = "#ff0000";
        context.moveTo(t[0], t[1]);
        for (i = 3; i < len; i += 6) context.quadraticCurveTo(t[i], t[i + 1], t[i + 3], t[i + 4]);
        context.fill();

        context.clip();
        //////////////////////////////console.log("inside = "+result.width+" : "+result.height)

        var ratioX: number = result.width / result.height;

        context.drawImage(inside, -offsetX * inside.width * 0.5 * ratioX, -offsetY * inside.height * 0.5, inside.width, inside.height, 0, 0, w, h)//offsetX + (size-w)/2,offsetY + h,w,h);

        // //////////////////////////////console.log("Shape offset : ",size,w,h)


        return result;

    }



    private createTriangleInside(pathId: number, vertex: number[], curveData: number[]): any {

        var path: number[] = this.createTriangulatablePath(this._paths[pathId]);

        var triangleIndices: number[] = EarCutting.instance.computeTriangles(path);
        triangleIndices.reverse()

        var i: number, len: number = triangleIndices.length;
        var i0: number, i1: number, i2: number;
        var k: number = 0, nbc: number = 0;
        var x0: number, y0: number, ax: number, ay: number, x1: number, y1: number;

        var result: any = {};
        result.nbTriangle = len / 3;

        for (i = 0; i < len; i += 3) {

            i0 = triangleIndices[i] * 2;
            i1 = triangleIndices[i + 1] * 2;
            i2 = triangleIndices[i + 2] * 2

            x0 = path[i0];
            y0 = path[i0 + 1];
            ax = path[i1];
            ay = path[i1 + 1];
            x1 = path[i2];
            y1 = path[i2 + 1];


            // X - Y - Z - isInnerTriangle
            vertex[k++] = x0;
            vertex[k++] = y0;
            vertex[k++] = 0//points[i0 + 2];
            vertex[k++] = 0;
            curveData[nbc++] = 0;
            curveData[nbc++] = 0;
            curveData[nbc++] = 0;

            vertex[k++] = ax;
            vertex[k++] = ay;
            vertex[k++] = 0//points[i1 + 2];
            vertex[k++] = 0;
            curveData[nbc++] = 0;
            curveData[nbc++] = 0;
            curveData[nbc++] = 0;


            vertex[k++] = x1;
            vertex[k++] = y1;
            vertex[k++] = 0//points[i2 + 2];
            vertex[k++] = 0;
            curveData[nbc++] = 0;
            curveData[nbc++] = 0;
            curveData[nbc++] = 0;

        }
        result.countVertex = k;
        result.countCurve = nbc;
        return result
    }

    private createOutsideTriangles(pathId: number, vertex: number[], curveData: number[], nbTriangle: number, countVertex: number, countCurve: number): void {

        var i: number, len: number;
        var i0: number, i1: number, i2: number;
        var j: number = 0, k: number = countVertex, nbc: number = countCurve;
        var sens: number;
        var x0: number, y0: number, ax: number, ay: number, x1: number, y1: number;
        var d0: number, d1: number, da: number

        var indexs: number[] = [];
        var curvePoints: number[] = this._paths[pathId];

        len = curvePoints.length / 6;
        var j: number = 0;
        for (i = 0; i < len - 1; i++) {
            j = i * 2;
            indexs.push(j, j + 1, j + 2);
        }


        len = indexs.length;
        nbTriangle += len / 3;
        var pointAngle: number, anchorAngle: number

        console.log("createOutsideTriangles ", len)

        for (i = 0; i < len; i += 3) {

            i0 = (indexs[i] * 3);
            i1 = (indexs[i + 1] * 3);
            i2 = (indexs[i + 2] * 3)

            x0 = curvePoints[i0];
            y0 = curvePoints[i0 + 1];
            ax = curvePoints[i1];
            ay = curvePoints[i1 + 1];
            x1 = curvePoints[i2];
            y1 = curvePoints[i2 + 1];

            console.log(i, " ::: ", x0, y0, ax, ay, x1, y1);

            pointAngle = Math.atan2(y1 - y0, x1 - x0);
            anchorAngle = Math.atan2(ay - y0, ax - x0);
            da = anchorAngle - pointAngle;
            if (da > Math.PI) da -= Math.PI * 2
            if (da < -Math.PI) da += Math.PI * 2
            if (da < 0) sens = 0;
            else sens = 1;



            // X - Y - Z - isInnerTriangle
            vertex[k++] = x0;
            vertex[k++] = y0;
            vertex[k++] = curvePoints[i0 + 2];
            vertex[k++] = 1;
            curveData[nbc++] = 0;
            curveData[nbc++] = 0;
            curveData[nbc++] = sens;

            vertex[k++] = ax;
            vertex[k++] = ay;
            vertex[k++] = curvePoints[i1 + 2];
            vertex[k++] = 1;


            console.log("curveData[", nbc, "] = 0.5");
            curveData[nbc++] = 0.5;
            curveData[nbc++] = 0;
            curveData[nbc++] = sens;

            vertex[k++] = x1;
            vertex[k++] = y1;
            vertex[k++] = curvePoints[i2 + 2];
            vertex[k++] = 1;
            curveData[nbc++] = 1;
            curveData[nbc++] = 1;
            curveData[nbc++] = sens;
        }

        console.log("curveDatas = ", curveData)
        ////////////////////////////////console.log("nbTriangle3 = "+nbTriangle)


        this.nbTriangle[pathId] = nbTriangle;
    }



    public createBufferDatas(forceCreate: boolean = false): void {

        if (!this.vertex[0] || forceCreate) {

            var i: number, len: number = this._nbPath;
            var c: number[];
            var v: number[];

            ////////////////////////////////console.log("NBPATH = "+this._nbPath)

            for (i = 0; i < len; i++) {
                this.vertex[i] = v = [];
                this.curves[i] = c = [];
                var infos: any = this.createTriangleInside(i, v, c);
                this.createOutsideTriangles(i, v, c, infos.nbTriangle, infos.countVertex, infos.countCurve);
            }



        }
    }


    //----------------

    private barycentre(a: number, b: number, c: number, t: number): number {
        //a = pt1 values;
        //b = ancre value;
        //c = pt2 value;
        //t = time value - 0 --> 1 -
        return (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
    }

    private getCurveLength(x0: number, y0: number, ax: number, ay: number, x1: number, y1: number, nbStep: number): number {
        var stepRatio: number = 1 / nbStep;
        var i: number;
        var ox: number = x0, oy: number = y0;
        var dx: number, dy: number, d: number
        var px: number, py: number;
        var dist: number = 0;

        for (i = 0; i <= nbStep; i++) {
            px = this.barycentre(x0, ax, x1, i * stepRatio)
            py = this.barycentre(y0, ay, y1, i * stepRatio)
            dx = px - ox;
            dy = py - oy;
            dist += Math.sqrt(dx * dx + dy * dy);
            ox = px;
            oy = py;
        }

        return dist;
    }

    public getPerimeter(nbStepByCurve: number = 10, pathId: number = 0): number {

        if (this.perimeters[pathId]) return (this.perimeters[pathId] as any).dist;

        var p: number[];
        var percents: number[] = [];

        this.perimeters[pathId] = p = [];
        this.perimeterPercents[pathId] = percents = [];


        var t: number[] = this._paths[pathId];
        var i: number, len: number = t.length;

        var ox: number, oy: number, ax: number, ay: number, px: number, py: number;
        var curveLen: number, totalDist: number = 0;
        var k: number = 0;
        ox = t[0];
        oy = t[1];

        for (i = 3; i < len; i += 6) {
            ax = t[i];
            ay = t[i + 1];
            px = t[i + 3];
            py = t[i + 4];

            p[k++] = curveLen = this.getCurveLength(ox, oy, ax, ay, px, py, nbStepByCurve);
            totalDist += curveLen;
            ////////////////////////////////console.log("dist = "+totalDist+" ||| "+ox,oy,ax,ay,px,py)
            ox = px;
            oy = py;
        }

        len = p.length;
        var n: number = 0;

        for (i = 0; i < len; i++) {
            n += p[i];
            percents[i] = n / totalDist;
        }
        (p as any).dist = totalDist;
        return totalDist;

    }

    public getPointAtPercent(pct: number = 0, pathId: number = 0): any {
        if (!this.perimeters[pathId]) this.getPerimeter(10, pathId);
        var p: any = this.perimeters[pathId];

        var curvePoints: number[] = this._paths[pathId];
        var cLen: number = curvePoints.length


        ////////////////////////////////console.log(pct)

        if (pct == 0) return { x: curvePoints[0], y: curvePoints[1], z: curvePoints[2] }
        if (pct == 1) return { x: curvePoints[cLen - 3], y: curvePoints[cLen - 2], z: curvePoints[cLen - 1] }

        var t: any = this.perimeters[pathId];
        var tPercent: number[] = this.perimeterPercents[pathId];
        var i: number, len: number = t.length;
        var result: any = {};
        var id: number = 0;
        var oldPct: number = 0;
        var tPct: number;
        for (i = 0; i < len; i++) {
            tPct = tPercent[i];
            if (tPct >= pct) {
                pct = (pct - oldPct) / (tPct - oldPct);

                result.x = this.barycentre(curvePoints[id + 0], curvePoints[id + 3], curvePoints[id + 6], pct);
                result.y = this.barycentre(curvePoints[id + 1], curvePoints[id + 4], curvePoints[id + 7], pct);

                return result;
            }
            id += 6;
            oldPct = tPercent[i];

        }

        return null;
    }






    public getCurveDataById(pathId: number): number[] { return this.curves[pathId] }
    public getVertexDataById(pathId: number): number[] { return this.vertex[pathId] }

    public get curveDatas(): number[] { return this.curves[0] }
    public get vertexDatas(): number[] { return this.vertex[0] }
    public get nbTriangleVisible(): number { return this.nbTriangle[0] }




}
