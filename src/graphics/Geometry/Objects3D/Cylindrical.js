import { TrMeshObject, BasicOptions } from "./Base";
import Utils from "../../AppUtils";
import { Quad3D, Sector3D } from "./Planar";

const defaultOptions = {
  ...BasicOptions,
  dPhiCount: 20,
  dYCount: 10,
  phiMin: 0,
  phiMax: 2 * Math.PI
};
// Define Cylindrical objects
// Y axis is the cylinder axis and stays in y>0
class CylinderSurface3D extends TrMeshObject {
  constructor(radius, height, options = null) {
    super(defaultOptions);
    this.radius = radius;
    this.height = height;
    this.setOptions(options);
  }

  generateChildItems() {
    if (this.childList.length === 0) {
      const {
        dPhiCount,
        dYCount,
        phiMin,
        phiMax,
        colorPerVertex,
        getColor
      } = this.options;
      const dPhi = (phiMax - phiMin) / dPhiCount;
      const yMin = 0;
      const yMax = this.height;
      const dy = (yMax - yMin) / dYCount;
      const r = this.radius;
      const phi = i => phiMin + i * dPhi;
      const y = i => 0 + i * dy;
      const processIndices = indices => {
        const pListForQuad = [];
        const cListForQuad = [];
        indices.forEach(ij => {
          const p = Utils.rPhiYtoXYZ(r, phi(ij[0]), y(ij[1]));
          pListForQuad.push(p);
          if (colorPerVertex && getColor) {
            cListForQuad.push(getColor(ij[0], ij[1], this.options));
          }
        });
        const quad = new Quad3D(pListForQuad);
        quad.getNormal = v => [v[0], 0, v[2]];
        if (getColor) {
          if (colorPerVertex) {
            quad.setOptions({ colorPerVertexArray: cListForQuad });
          } else {
            const color = getColor(indices[0][0], indices[0][1], this.options);
            quad.setOptions({ color });
          }
        }
        this.childList.push(quad);
      };

      for (let i = 0; i < dPhiCount; i += 1) {
        for (let j = 0; j < dYCount; j += 1) {
          const indices = [[i, j + 1], [i, j], [i + 1, j], [i + 1, j + 1]];
          processIndices(indices);
        }
      }
    }
  }
}

// Define Closed cylinder object
class Cylinder3D extends TrMeshObject {
  constructor(radius, height, options = null) {
    super(defaultOptions);
    this.radius = radius;
    this.height = height;
    this.setOptions(options);
  }

  generateChildItems() {
    if (this.childList.length === 0) {
      const cylSurface3D = new CylinderSurface3D(
        this.radius,
        this.height,
        this.options
      );
      const { dPhiCount, color, deltaColor } = this.options;
      const faceOptions = { dPhiCount, color, deltaColor };
      const face1 = new Sector3D(this.radius, faceOptions);
      const face2 = new Sector3D(this.radius, faceOptions);
      face2.model().translate(0, this.height, 0);
      this.childList.push(cylSurface3D, face1, face2);
    }
  }
}

export { CylinderSurface3D, Cylinder3D };
