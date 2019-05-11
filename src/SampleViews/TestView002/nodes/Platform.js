import { WOFACTORY, OBJ0, WorldObject, NodeTypes } from "../../../graphics";

const PlatformType = "PlatformType";

class DiscPlane extends WorldObject {
  constructor(inObj) {
    super(inObj, []);
    this.camList = [];

    this.createCam(inObj, [0, 140, 0], [0, 0, 0], [0, 0, 1], 0);
    this.createCam(inObj, [70, 70, 0], [0, 0, 0], [0, 1, 0], 1);
    this.createCam(inObj, [-70, 0, -70], [0, 0, 0], [0, 1, 0], 2);
    this.createCam(inObj, [70, 30, 70], [0, 0, 0], [0, 1, 0], 3);
  }

  createCam(inObj, pos, targetPos, up, index) {
    const cam1 = WOFACTORY.create(NodeTypes.CAMERA_ABSTRACT, [inObj]);
    cam1.model().translate(0, 100, 0);
    cam1.setProperty("camera_position", pos);
    cam1.setProperty("target_position", targetPos);
    cam1.setProperty("up_vector", up);
    this.addChildren([cam1]);
    this.camList[index] = cam1;
  }

  getCam(i) {
    return this.camList[i];
  }

  defineGeometry() {
    const baseY = -2;
    const DiscColor = [0.2, 0.25, 0.3, 1];

    const radius = 100;
    this.discSurface = new OBJ0.Sector3D(radius, {
      dThetaCount: 100,
      dRCount: 10,
      color: DiscColor,
      getColor: (i, j, options) => {
        const { color, deltaColor } = options;
        const evenI = i % 2 === 0;
        const evenJ = j % 2 === 0;
        const colorPlus = color.map(c => c + deltaColor);
        return evenI || evenJ ? color : colorPlus;
      }
    });
    this.discSurface.model().translate(0, baseY, 0);
    return [this.discSurface];
  }
}

WOFACTORY.registerType(PlatformType, DiscPlane);

export default PlatformType;
