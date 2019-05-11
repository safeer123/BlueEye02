import { TrMeshObject, BasicOptions } from "./Base";
import Utils from "../../AppUtils";
import { Quad3D, Sector3D } from "./Planar";

const defaultOptionsSphere3D = {
  ...BasicOptions,
  dThetaCount: 20,
  dPhiCount: 20,
  startTheta: 0,
  endTheta: Math.PI,
  startPhi: 0,
  endPhi: 2 * Math.PI
};

// Define Spherical objects
class Sphere3D extends TrMeshObject {
  constructor(radius = 1, options) {
    super(defaultOptionsSphere3D);
    this.radius = radius;
    this.setOptions(options);
  }

  generateChildItems() {
    if (this.childList.length === 0) {
      const {
        dThetaCount,
        dPhiCount,
        startTheta,
        endTheta,
        startPhi,
        endPhi,
        colorPerVertex,
        getColor
      } = this.options;
      const dTheta = (endTheta - startTheta) / dThetaCount;
      const dPhi = (endPhi - startPhi) / dPhiCount;
      const r = this.radius;

      const theta = i => startTheta + i * dTheta;
      const phi = i => startPhi + i * dPhi;
      const processIndices = indices => {
        const pListForQuad = [];
        const cListForQuad = [];
        indices.forEach(ij => {
          const p = Utils.rThetaPhiToXYZ(r, theta(ij[0]), phi(ij[1]));
          pListForQuad.push(p);
          if (colorPerVertex && getColor) {
            cListForQuad.push(getColor(ij[0], ij[1], this.options));
          }
        });
        const quad = new Quad3D(pListForQuad);
        quad.getNormal = v => v;
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

      for (let i = 0; i < dThetaCount; i += 1) {
        for (let j = 0; j < dPhiCount; j += 1) {
          const indices = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]];
          processIndices(indices);
        }
      }
    }
  }
}

const defaultOptionsHemisphere3D = {
  startTheta: 0,
  endTheta: 0.5 * Math.PI
};

// Define Hemisphere3D object
class Hemisphere3D extends TrMeshObject {
  constructor(radius, options = null) {
    super(defaultOptionsSphere3D);
    this.radius = radius;
    this.setOptions({ ...options, ...defaultOptionsHemisphere3D });
  }

  generateChildItems() {
    if (this.childList.length === 0) {
      const HemisphereSurface3D = new Sphere3D(this.radius, this.options);
      const { dPhiCount, color, deltaColor } = this.options;
      const faceOptions = { dPhiCount, color, deltaColor };
      const base = new Sector3D(this.radius, faceOptions);
      this.childList.push(HemisphereSurface3D, base);
    }
  }
}

const defaultOptionsInvertedHemisphere3D = {
  startTheta: 0.5 * Math.PI,
  endTheta: Math.PI
};

// Define InvertedHemisphere3D object
class InvertedHemisphere3D extends Hemisphere3D {
  constructor(radius, options = null) {
    super(radius, options);
    this.setOptions(defaultOptionsInvertedHemisphere3D);
    this.model().translate(0, this.radius, 0);
  }
}

export { Sphere3D, Hemisphere3D, InvertedHemisphere3D };
