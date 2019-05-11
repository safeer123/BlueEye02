import { Matrix4 } from "../../lib/m4";

// Defines Vertex Data structure we are going to build for objects
class VertexData {
  constructor() {
    this.lineData = [];
    this.trglData = [];
    this.lineItems = 0;
    this.trglItems = 0;
  }

  concat(vertexData2) {
    this.lineData = this.lineData.concat(vertexData2.lineData);
    this.trglData = this.trglData.concat(vertexData2.trglData);
    this.lineItems += vertexData2.lineItems;
    this.trglItems += vertexData2.trglItems;
    return this;
  }
}

// Building Base for many 3D shapes
// Defines a Trangle based mesh structure
class TrMeshObject {
  constructor(opts = null) {
    this.normalsEnabled = false; // default
    this.enableTexture = false; // default
    this.childList = [];
    this.options = {};
    this.setOptions(opts);
  }

  model() {
    if (!this.modelMatrix) this.modelMatrix = new Matrix4();
    return this.modelMatrix;
  }

  setOptions(opts = null) {
    if (opts) {
      this.options = { ...this.options, ...opts };
    }
  }

  toArrayBuffer() {
    // We expect this method in concrete classes
    if (this.generateChildItems) {
      this.generateChildItems();
    }

    const arrayBuffer = new VertexData();
    if (this.childList.length > 0) {
      this.childList.forEach(child => {
        // pass model matrix to children
        if (this.modelMatrix) {
          if (child.modelMatrix) {
            child.modelMatrix.transform(this.modelMatrix.matrix());
          } else {
            child.modelMatrix = this.modelMatrix;
          }
        }
        // pass normals
        if (this.normalsEnabled) {
          child.enableNormals();
          if (this.normal) {
            child.normal = this.normal;
          }
          if (this.getNormal) {
            child.getNormal = this.getNormal;
          }
        }

        // pass texture flag
        child.enableTexture = this.enableTexture;

        // Concat all child vertex data
        arrayBuffer.concat(child.toArrayBuffer());
      });
    }
    return arrayBuffer;
  }

  enableNormals() {
    this.normalsEnabled = true;
  }

  disableNormals() {
    this.normalsEnabled = false;
  }
}

const BasicOptions = {
  color: [0.6, 0.7, 0.6, 1],
  deltaColor: 0.05,
  colorPerVertex: false,
  getColor: (i, j, options) => {
    const { color, deltaColor } = options;
    const k = (i + j) % 2;
    const colorPlus = color.map(c => c + deltaColor);
    return k > 0 ? color : colorPlus;
  }
};

export { VertexData, TrMeshObject, BasicOptions };
