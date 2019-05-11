import { TrMeshObject } from "./Base";
import { QuadSurface3D } from "./Planar";

const defaultOptionsBox3D = {
  color: [0.7, 0.3, 0.4, 1],
  xDivisions: 10,
  yDivisions: 10,
  zDivisions: 10,
  deltaColor: 0.1
};

// Defines Box object using rectangle surfaces
class Box3D extends TrMeshObject {
  constructor(
    zNear = -0.5,
    zFar = 0.5,
    xLeft = -0.5,
    xRight = 0.5,
    yBottom = -0.5,
    yTop = 0.5,
    options = null
  ) {
    super(defaultOptionsBox3D);
    this.zNear = zNear;
    this.zFar = zFar;
    this.xLeft = xLeft;
    this.xRight = xRight;
    this.yTop = yTop;
    this.yBottom = yBottom;
    this.setOptions(options);
  }

  generateChildItems() {
    if (this.childList.length === 0) {
      const { zNear, zFar, xLeft, xRight, yBottom, yTop } = this;
      const {
        xDivisions,
        yDivisions,
        zDivisions,
        color,
        deltaColor
      } = this.options;
      this.faceXY1 = new QuadSurface3D(
        [xRight, yBottom, zNear],
        [xRight, yTop, zNear],
        [xLeft, yTop, zNear],
        [xLeft, yBottom, zNear],
        {
          divCount1: xDivisions,
          divCount2: yDivisions,
          color,
          deltaColor
        }
      );
      this.faceXY2 = new QuadSurface3D(
        [xLeft, yBottom, zFar],
        [xLeft, yTop, zFar],
        [xRight, yTop, zFar],
        [xRight, yBottom, zFar],
        {
          divCount1: xDivisions,
          divCount2: yDivisions,
          color,
          deltaColor
        }
      );
      this.faceZY1 = new QuadSurface3D(
        [xRight, yBottom, zFar],
        [xRight, yTop, zFar],
        [xRight, yTop, zNear],
        [xRight, yBottom, zNear],
        {
          divCount1: zDivisions,
          divCount2: yDivisions,
          color,
          deltaColor
        }
      );
      this.faceZY2 = new QuadSurface3D(
        [xLeft, yBottom, zNear],
        [xLeft, yTop, zNear],
        [xLeft, yTop, zFar],
        [xLeft, yBottom, zFar],
        {
          divCount1: zDivisions,
          divCount2: yDivisions,
          color,
          deltaColor
        }
      );
      this.faceXZ1 = new QuadSurface3D(
        [xRight, yTop, zNear],
        [xRight, yTop, zFar],
        [xLeft, yTop, zFar],
        [xLeft, yTop, zNear],
        {
          divCount1: xDivisions,
          divCount2: zDivisions,
          color,
          deltaColor
        }
      );
      this.faceXZ2 = new QuadSurface3D(
        [xLeft, yBottom, zNear],
        [xLeft, yBottom, zFar],
        [xRight, yBottom, zFar],
        [xRight, yBottom, zNear],
        {
          divCount1: xDivisions,
          divCount2: zDivisions,
          color,
          deltaColor
        }
      );
      this.childList.push(
        this.faceXY1,
        this.faceXY2,
        this.faceXZ1,
        this.faceXZ2,
        this.faceZY1,
        this.faceZY2
      );
    }
  }
}

export { Box3D };
