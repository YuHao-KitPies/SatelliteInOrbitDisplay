import { math, primitives, utils, Vec3 } from "cc";

export class OrbitalMeshUtils {

    static genEllipseOrbitalMeshOpt( 
        semiMajorAxis: number = 0.4, 
        eccentricity: number = 0,
        size: number = 0.1,
        opts?: {
            radialSegments?: number;
            tubularSegments?: number;
            arc?: number;
        } 
        ): {
            positions: number[];
            normals: number[];
            uvs: number[];
            indices: number[];
            minPos: math.Vec3;
            maxPos: math.Vec3;
            boundingRadius: number;
        }{
            const radialSegments = opts?.radialSegments || 32;
            const tubularSegments = opts?.tubularSegments || 32;
            const arc = opts?.arc || 2.0 * Math.PI;
            const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);

            const positions: number[] = [];
            const normals: number[] = [];
            const uvs: number[] = [];
            const indices: number[] = [];
            const minPos = new Vec3(-semiMinorAxis - size, -size, -semiMajorAxis - size);
            const maxPos = new Vec3(semiMinorAxis + size, size, semiMajorAxis + size);
            const boundingRadius = semiMajorAxis + size;

            for (let j = 0; j <= radialSegments; j++) {
                for (let i = 0; i <= tubularSegments; i++) {
                    const u = i / tubularSegments;
                    const v = j / radialSegments;

                    const u1 = u * arc;
                    const v1 = v * Math.PI * 2;

                    // vertex
                    const x = (semiMinorAxis + size * Math.cos(v1)) * Math.sin(u1);
                    const y = size * Math.sin(v1);
                    const z = (semiMajorAxis + size * Math.cos(v1)) * Math.cos(u1);

                    // this vector is used to calculate the normal
                    const nx = Math.sin(u1) * Math.cos(v1) * (Math.pow(semiMinorAxis, 2) / Math.pow(semiMajorAxis, 2));
                    const ny = Math.sin(v1);
                    const nz = Math.cos(u1) * Math.cos(v1);

                    positions.push(x, y, z);
                    normals.push(nx, ny, nz);
                    uvs.push(u, v);

                    if ((i < tubularSegments) && (j < radialSegments)) {
                        const seg1 = tubularSegments + 1;
                        const a = seg1 * j + i;
                        const b = seg1 * (j + 1) + i;
                        const c = seg1 * (j + 1) + i + 1;
                        const d = seg1 * j + i + 1;

                        indices.push(a, d, b);
                        indices.push(d, c, b);
                    }
                }
            }

            return {
                positions,
                normals,
                uvs,
                indices,
                minPos,
                maxPos,
                boundingRadius,
            };
    }
}