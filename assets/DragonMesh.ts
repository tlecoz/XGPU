import dragonRawData from 'stanford-dragon/4';
import { computeSurfaceNormals, computeProjectedPlaneUVs } from './utils';

export const dragonMesh = {
    positions: dragonRawData.positions as [number, number, number][],
    triangles: dragonRawData.cells,
    normals: [] as [number, number, number][],
    uvs: [] as [number, number][],
};


const normalize = (datas: number[][]) => {

    let minx = 99999999;
    let miny = 99999999;
    let minz = 99999999;
    let maxx = -99999999;
    let maxy = -99999999;
    let maxz = -99999999;
    let val: number;
    for (let i = 0; i < datas.length; i++) {

        val = datas[i][0];
        if (val < minx) minx = val;
        if (val > maxx) maxx = val;

        val = datas[i][1];
        if (val < miny) miny = val;
        if (val > maxy) maxy = val;

        val = datas[i][2];
        if (val < minz) minz = val;
        if (val > maxz) maxz = val;

    }

    let dx = maxx - minx;
    let dy = maxy - miny;
    let dz = maxz - minz;

    let ry = dy / dz;
    let rx = dx / dz;

    for (let i = 0; i < datas.length; i++) {

        datas[i][0] = -1 + (datas[i][0] - minx) / dx * rx;
        datas[i][1] = -0.5 + (datas[i][1] - miny) / dy * ry;
        datas[i][2] = -0.5 + (datas[i][2] - minz) / dz;

        //console.log(datas[i][0], datas[i][1], datas[i][2])
    }
}

normalize(dragonMesh.positions);




var indices = [];
for (let i = 0; i < dragonRawData.cells.length; i++) {
    indices.push(...dragonRawData.cells[i]);
}
dragonMesh.triangles = indices;

// Compute surface normals
dragonMesh.normals = computeSurfaceNormals(dragonMesh.positions, dragonRawData.cells);

// Compute some easy uvs for testing
dragonMesh.uvs = computeProjectedPlaneUVs(dragonMesh.positions, 'xy');