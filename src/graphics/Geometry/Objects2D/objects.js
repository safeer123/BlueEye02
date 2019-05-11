// Defines a Trangle based mesh structure
let TrMeshObject = class {
  constructor() {
    this.enableTexture = false; // default
    this.childList = [];
  }

  toArrayBuffer() {
    if (this.generateChildItems) {
      this.generateChildItems();
    }

    let arrayBuffer = new OBJ2D.VertexData();
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

        // pass texture flag
        child.enableTexture = this.enableTexture;

        // Concat all child vertex data
        arrayBuffer.concat(child.toArrayBuffer());
      });
    }
    return arrayBuffer;
  }
};

const OBJ2D = {
  //====== Customizable Basic Objects =====================================//
  //====== These objects can be re-used, can be used to create complex objects

  Triangle2D: class {
    constructor(p1, p2, p3, t1 = [], t2 = [], t3 = []) {
      this.p1 = p1;
      this.p2 = p2;
      this.p3 = p3;
      this.t1 = t1;
      this.t2 = t2;
      this.t3 = t3;
      this.color = [72 / 256, 162 / 256, 219 / 256, 1];
    }

    toArrayBuffer() {
      function toVertices(p1, p2, p3, t1, t2, t3, color) {
        var dataObj = new OBJ2D.VertexData();
        var vertexData = [
          ...p1,
          ...color,
          ...t1,
          ...p2,
          ...color,
          ...t2,
          ...p3,
          ...color,
          ...t3
        ];

        var vertexNum = 3; // 3 vertices here
        dataObj.trglItems = vertexNum;
        dataObj.trglData = vertexData;
        return dataObj;
      }
      let p1_ = this.p1;
      let p2_ = this.p2;
      let p3_ = this.p3;

      if (this.modelMatrix) {
        p1_ = this.modelMatrix.apply(this.p1);
        p2_ = this.modelMatrix.apply(this.p2);
        p3_ = this.modelMatrix.apply(this.p3);
      }
      return toVertices(
        p1_,
        p2_,
        p3_,
        this.t1,
        this.t2,
        this.t3,
        this.color
      );
    }
  },

  Quad2D: class extends TrMeshObject {
    constructor(p1, p2, p3, p4, t1 = [], t2 = [], t3 = [], t4 = []) {
      super();
      this.triangle1 = new OBJ2D.Triangle2D(p1, p2, p3, t1, t2, t3);
      this.triangle2 = new OBJ2D.Triangle2D(p1, p3, p4, t1, t3, t4);
      this.color = [72 / 256, 162 / 256, 219 / 256, 1]; // default
    }

    generateChildItems() {
      if (this.childList.length === 0) {
        this.triangle1.color = this.color;
        this.triangle2.color = this.color;
        this.childList.push(this.triangle1);
        this.childList.push(this.triangle2);
      }
    }
  },

  Rectangle2D: class extends TrMeshObject {
    constructor(x, y, width, height) {
      super();
      const x2 = x+width;
      const y2 = y+height;
      this.p1 = [x, y];
      this.p2 = [x, y2];
      this.p3 = [x2, y2];
      this.p4 = [x2, y];
      this.color = [72 / 256, 162 / 256, 219 / 256, 1]; // default
    }

    generateChildItems() {
      if (this.childList.length === 0) {
        const quad = new OBJ2D.Quad2D(this.p1, this.p2, this.p3, this.p4);
        quad.color = this.color;
        this.childList.push(quad);
      }
    }
  },

  VertexData: class {
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
};

export default OBJ2D;
