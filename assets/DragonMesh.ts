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

        datas[i][0] = -0.5 * rx + (datas[i][0] - minx) / dx * rx;
        datas[i][1] = -0.5 * ry + (datas[i][1] - miny) / dy * ry;
        datas[i][2] = -0.5 + (datas[i][2] - minz) / dz;

        //console.log(datas[i][0], datas[i][1], datas[i][2])
    }
}






var indices = [];
for (let i = 0; i < dragonRawData.cells.length; i++) {
    indices.push(...dragonRawData.cells[i]);
}
//console.log("cells.length = ", dragonRawData.cells.length, " vs ", indices.length)
//add plane ------------------
indices.push(dragonMesh.positions.length, dragonMesh.positions.length + 2, dragonMesh.positions.length + 1)
indices.push(dragonMesh.positions.length, dragonMesh.positions.length + 1, dragonMesh.positions.length + 3);



dragonMesh.normals = computeSurfaceNormals(dragonMesh.positions, dragonRawData.cells);


dragonMesh.positions.push(
    [-100, 20, -100], //
    [100, 20, 100], //
    [-100, 20, 100], //
    [100, 20, -100]
);

normalize(dragonMesh.positions);
dragonMesh.normals.push(
    [0, 1, 0], //
    [0, 1, 0], //
    [0, 1, 0], //
    [0, 1, 0]
);
dragonMesh.uvs.push(
    [0, 0], //
    [1, 1], //
    [0, 1], //
    [1, 0]
);






dragonMesh.triangles = indices;

// Compute surface normals


// Compute some easy uvs for testing
dragonMesh.uvs = computeProjectedPlaneUVs(dragonMesh.positions, 'xy');