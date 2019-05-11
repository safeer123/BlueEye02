import { TrMeshObject, VertexData, BasicOptions } from "./Base";
import { surfaceNormal } from "./Utils";
import Utils from "../../AppUtils";

const defaultOptionsTriangle3D = {
  color: [0.5, 0.5, 0.5, 1],
  colorPerVertexArray: null // array of colors (vec3 of vec4) for each vertex
};

// p(position): list of 3 vec3
// t(textureCoord): list of 3 vec2
class Triangle3D extends TrMeshObject {
  constructor(p, t = [[], [], []]) {
    super(defaultOptionsTriangle3D);
    if (p.length !== 3 || t.length !== 3) {
      console.error("Triangle3D: we expect 3 values from each vertex data");
    }
    this.p = p;
    this.t = t;
  }

  toArrayBuffer() {
    // Each input is an array
    // p:position, n:normal, t:textureCoord, c:color
    function toVertices(p, n, t, c) {
      const dataObj = new VertexData();
      const vertexData = [];
      for (let i = 0; i < 3; i += 1) {
        vertexData.push(...p[i], ...c[i], ...n[i], ...t[i]);
      }
      const vertexNum = 3; // 3 vertices here
      dataObj.trglItems = vertexNum;
      dataObj.trglData = vertexData;
      return dataObj;
    }
    let n = [[], [], []];
    let p;
    if (this.normalsEnabled) {
      if (this.normal) {
        n = n.map(() => this.normal);
      } else if (this.getNormal) {
        n = this.p.map(vec => this.getNormal(vec));
      } else {
        const normal = surfaceNormal(this.p);
        n = n.map(() => normal);
      }
    }
    if (this.modelMatrix) {
      p = this.p.map(vec => this.modelMatrix.apply(vec));
      if (this.normalsEnabled) {
        n = n.map(vec => this.modelMatrix.applyInverseTransposeMatrix(vec));
      }
    } else {
      p = this.p;
    }
    const { color, colorPerVertexArray } = this.options;
    let c = []; // We should create array of colors
    if (colorPerVertexArray && colorPerVertexArray.length === 3) {
      c = colorPerVertexArray;
    } else {
      c = [1, 2, 3].map(() => color);
    }
    return toVertices(p, n, this.t, c);
  }
}

const defaultOptionsQuad3D = {
  color: [0.5, 0.5, 0.5, 1],
  colorPerVertexArray: null // array of colors (vec4 of vec4) for each vertex
};
// p(position): list of 4 vec3
// t(textureCoord): list of 4 vec2
class Quad3D extends TrMeshObject {
  constructor(p, t = [[], [], [], []]) {
    super(defaultOptionsQuad3D);
    if (p.length !== 4 || t.length !== 4) {
      console.error("Quad3D: we expect 4 values from each vertex data");
    }
    this.p = p;
    this.t = t;
  }

  generateChildItems() {
    if (this.childList.length === 0) {
      const { p, t } = this;
      const { color, colorPerVertexArray } = this.options;
      const triangleFromIndices = (i, j, k) => {
        const triangle = new Triangle3D([p[i], p[j], p[k]], [t[i], t[j], t[k]]);
        triangle.setOptions({ color });
        if (colorPerVertexArray && colorPerVertexArray.length === 4) {
          const c4 = colorPerVertexArray;
          const c = [c4[i], c4[j], c4[k]];
          triangle.setOptions({ colorPerVertexArray: c });
        }
        return triangle;
      };
      this.triangle1 = triangleFromIndices(0, 1, 2);
      this.triangle2 = triangleFromIndices(0, 2, 3);
      this.childList.push(this.triangle1, this.triangle2);
    }
  }
}

const defaultOptionsSector3D = {
  ...BasicOptions,
  dPhiCount: 20,
  dRCount: 1,
  startPhi: 0,
  endPhi: 2 * Math.PI
};

class Sector3D extends TrMeshObject {
  constructor(radius = 1, options) {
    super(defaultOptionsSector3D);
    this.radius = radius;
    this.setOptions(options);
    this.normal = [0, 1, 0];
  }

  generateChildItems() {
    if (this.childList.length === 0) {
      const { radius } = this;
      const {
        dPhiCount,
        dRCount,
        startPhi,
        endPhi,
        colorPerVertex,
        getColor
      } = this.options;
      const dPhi = (endPhi - startPhi) / dPhiCount;
      const dR = radius / dRCount;

      const HalfPi = 0.5 * Math.PI;
      const phi = i => startPhi + i * dPhi;
      const r = i => 0 + i * dR;
      const processIndices = indices => {
        const pListForQuad = [];
        const cListForQuad = [];
        indices.forEach(ij => {
          const p = Utils.rThetaPhiToXYZ(r(ij[0]), HalfPi, phi(ij[1]));
          pListForQuad.push(p);
          if (colorPerVertex && getColor) {
            cListForQuad.push(getColor(ij[0], ij[1], this.options));
          }
        });
        const quad = new Quad3D(pListForQuad);
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
        for (let j = 0; j < dRCount; j += 1) {
          const indices = [[j + 1, i + 1], [j, i + 1], [j, i], [j + 1, i]];
          processIndices(indices);
        }
      }
    }
  }
}

const defaultOptionsQuadSurface3D = {
  ...BasicOptions,
  divCount1: 10,
  divCount2: 10
};

class QuadSurface3D extends TrMeshObject {
  constructor(p1, p2, p3, p4, options) {
    super(defaultOptionsQuadSurface3D);
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p4 = p4;
    this.setOptions(options);
    this.normal = surfaceNormal([p1, p2, p3]);
  }

  generateChildItems() {
    if (this.childList.length === 0) {
      const { p1, p2, p3, p4 } = this;
      const { divCount1, divCount2, colorPerVertex, getColor } = this.options;
      const dAlpha = 1.0 / divCount1;
      const dBeta = 1.0 / divCount2;
      const grid = [];
      for (let i = 0; i <= divCount1; i += 1) {
        const t = i * dAlpha;
        const p1to4 = Utils.interpolate(p1, p4, t);
        const p2to3 = Utils.interpolate(p2, p3, t);
        grid[i] = [];
        for (let j = 0; j <= divCount2; j += 1) {
          const k = j * dBeta;
          grid[i].push(Utils.interpolate(p1to4, p2to3, k));
        }
      }

      const processIndices = indices => {
        const pListForQuad = [];
        const cListForQuad = [];
        indices.forEach(ij => {
          const p = grid[ij[0]][ij[1]];
          pListForQuad.push(p);
          if (colorPerVertex && getColor) {
            cListForQuad.push(getColor(ij[0], ij[1], this.options));
          }
        });
        const quad = new Quad3D(pListForQuad);
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

      for (let i = 0; i < divCount1; i += 1) {
        for (let j = 0; j < divCount2; j += 1) {
          const indices = [[i, j], [i, j + 1], [i + 1, j + 1], [i + 1, j]];
          processIndices(indices);
        }
      }
    }
  }
}

export { Triangle3D, Quad3D, QuadSurface3D, Sector3D };
