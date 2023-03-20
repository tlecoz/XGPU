

export class EarCutting {

    private static _instance: EarCutting = null;

    private CONCAVE: number = -1;
    private TANGENTIAL: number = 0;
    private CONVEX: number = 1;


    private indices: number[];
    private vertices: number[];
    private vertexCount: number;
    private vertexTypes: number[] = [];
    private triangles: number[] = [];



    constructor() {
        if (EarCutting._instance != null) throw new Error("EarCutting is a singleton. You must use EarCutting.instance to use it")
        EarCutting._instance = this;
    }

    public static get instance(): EarCutting {
        if (EarCutting._instance == null) new EarCutting();
        return EarCutting._instance;
    }

    private computeSpannedAreaSign(p1x: number, p1y: number, p2x: number, p2y: number, p3x: number, p3y: number): number {
        var area: number = p1x * (p3y - p2y);
        area += p2x * (p1y - p3y);
        area += p3x * (p2y - p1y);
        if (area < 0) return -1;
        else if (area > 0) return 1;
        else return 0
    }

    private previousIndex(index: number) { return (index == 0 ? this.vertexCount : index) - 1; }
    private nextIndex(index: number) { return (index + 1) % this.vertexCount; }

    private classifyVertex(index: number): number {

        var previous = this.indices[this.previousIndex(index)] * 2;
        var current = this.indices[index] * 2;
        var next = this.indices[this.nextIndex(index)] * 2;

        return this.computeSpannedAreaSign(this.vertices[previous], this.vertices[previous + 1], this.vertices[current], this.vertices[current + 1], this.vertices[next], this.vertices[next + 1]);
    }

    private areVerticesClockwise(vertices: number[], offset: number, count: number): boolean {
        if (count <= 2) return false;
        var area: number = 0, p1x: number, p1y: number, p2x: number, p2y: number;
        var i: number, n: number;
        for (i = offset, n = offset + count - 3; i < n; i += 2) {
            p1x = vertices[i];
            p1y = vertices[i + 1];
            p2x = vertices[i + 2];
            p2y = vertices[i + 3];
            area += p1x * p2y - p2x * p1y;
        }
        p1x = vertices[count - 2];
        p1y = vertices[count - 1];
        p2x = vertices[0];
        p2y = vertices[1];
        return area + p1x * p2y - p2x * p1y < 0;
    }




    private isEarTip(earTipIndex: number): boolean {

        if (this.vertexTypes[earTipIndex] == this.CONCAVE) return false;

        var _previousIndex: number = this.previousIndex(earTipIndex);
        var _nextIndex: number = this.nextIndex(earTipIndex);

        var p1: number = this.indices[_previousIndex] * 2;
        var p2: number = this.indices[earTipIndex] * 2;
        var p3: number = this.indices[_nextIndex] * 2;

        var p1x: number = this.vertices[p1], p1y: number = this.vertices[p1 + 1];
        var p2x: number = this.vertices[p2], p2y: number = this.vertices[p2 + 1];
        var p3x: number = this.vertices[p3], p3y: number = this.vertices[p3 + 1];

        var i: number, v: number;
        var vx: number, vy: number;
        // Check if any point is inside the triangle formed by previous, current and next vertices.
        // Only consider vertices that are not part of this triangle, or else we'll always find one inside.
        for (i = this.nextIndex(_nextIndex); i != _previousIndex; i = this.nextIndex(i)) {
            // Concave vertices can obviously be inside the candidate ear, but so can tangential vertices
            // if they coincide with one of the triangle's vertices.
            if (this.vertexTypes[i] != this.CONVEX) {
                v = this.indices[i] * 2;
                vx = this.vertices[v];
                vy = this.vertices[v + 1];
                // Because the polygon has clockwise winding order, the area sign will be positive if the point is strictly inside.
                // It will be 0 on the edge, which we want to include as well.
                // note: check the edge defined by p1->p3 first since this fails _far_ more then the other 2 checks.
                if (this.computeSpannedAreaSign(p3x, p3y, p1x, p1y, vx, vy) >= 0) {
                    if (this.computeSpannedAreaSign(p1x, p1y, p2x, p2y, vx, vy) >= 0) {
                        if (this.computeSpannedAreaSign(p2x, p2y, p3x, p3y, vx, vy) >= 0) return false;
                    }
                }
            }
        }
        return true;
    }

    private findEarTip(): number {
        var i: number;
        for (i = 0; i < this.vertexCount; i++) if (this.isEarTip(i)) return i;

        for (i = 0; i < this.vertexCount; i++) if (this.vertexTypes[i] != this.CONCAVE) return i;
        return 0; // If all vertices are concave, just return the first one.
    }
    private cutEarTip(earTipIndex: number): void {

        this.triangles.push(this.indices[this.previousIndex(earTipIndex)]);
        this.triangles.push(this.indices[earTipIndex]);
        this.triangles.push(this.indices[this.nextIndex(earTipIndex)]);

        this.indices.splice(earTipIndex, 1);
        this.vertexTypes.splice(earTipIndex, 1);

        this.vertexCount--;
    }


    private triangulate(): void {

        var earTipIndex: number = 0;
        var _previousIndex: number = 0;
        var _nextIndex: number = 0;

        while (this.vertexCount > 3) {
            earTipIndex = this.findEarTip();
            this.cutEarTip(earTipIndex);

            // The type of the two vertices adjacent to the clipped vertex may have changed.
            _previousIndex = this.previousIndex(earTipIndex);
            _nextIndex = earTipIndex == this.vertexCount ? 0 : earTipIndex;
            this.vertexTypes[_previousIndex] = this.classifyVertex(_previousIndex);
            this.vertexTypes[_nextIndex] = this.classifyVertex(_nextIndex);
        }

        if (this.vertexCount == 3) {
            this.triangles.push(this.indices[0]);
            this.triangles.push(this.indices[1]);
            this.triangles.push(this.indices[2]);
        }
    }





    private _computeTriangles(arrayXY: number[], offset: number, count: number): number[] {
        this.vertices = arrayXY;
        this.vertexCount = count / 2;


        this.indices = [];
        var i: number, n: number;
        var bool: boolean = false;
        if (this.areVerticesClockwise(this.vertices, offset, count)) for (i = 0; i < this.vertexCount; i++) this.indices[i] = i;
        else {
            bool = true;
            for (i = 0, n = this.vertexCount - 1; i < this.vertexCount; i++) this.indices[i] = (n - i);
            // Reversed.


        }

        this.vertexTypes = [];
        for (i = 0, n = this.vertexCount; i < n; ++i) this.vertexTypes[i] = this.classifyVertex(i);

        this.triangles = [];
        this.triangulate();
        if (bool) this.triangles.reverse();
        return this.triangles;
    }

    public computeTriangles(arrayXY: number[]) {
        return this._computeTriangles(arrayXY, 0, arrayXY.length);
    }


}

