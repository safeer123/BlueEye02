import { WorldObject, OBJ0, WOFACTORY } from "../../../../graphics";
import config from "./config";

const Obj2Type = "Obj2Type";

class Shape2 extends WorldObject {
  constructor(inObj) {
    super(inObj, [config]);
  }

  defineGeometry() {
    const color = [0.7, 0.6, 0.6, 1];
    const hemiSphere1 = new OBJ0.Sphere3D(2, {
      startTheta: 0.5 * Math.PI,
      dThetaCount: 10,
      deltaColor: 0.1,
      color
    });
    hemiSphere1.model().translate(0, 2, 0);
    this.hemiSphere1 = hemiSphere1;

    const hemiSphere2 = new OBJ0.Sphere3D(2, {
      endTheta: 0.5 * Math.PI,
      dThetaCount: 10,
      deltaColor: 0.1,
      color
    });
    hemiSphere2.model().translate(0, 5, 0);

    const cylinder3D = new OBJ0.CylinderSurface3D(2, 3, {
      deltaColor: 0.1,
      color
    });
    cylinder3D.model().translate(0, 2, 0);
    return [hemiSphere1, cylinder3D, hemiSphere2];
  }
}

WOFACTORY.registerType(Obj2Type, Shape2);

export default Obj2Type;
