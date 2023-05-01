export declare function computeSurfaceNormals(positions: [number, number, number][], triangles: [number, number, number][]): [number, number, number][];
type ProjectedPlane = 'xy' | 'xz' | 'yz';
export declare function computeProjectedPlaneUVs(positions: [number, number, number][], projectedPlane?: ProjectedPlane): [number, number][];
export {};
