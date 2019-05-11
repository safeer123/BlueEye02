import { WorldObject, OBJ0, WOFACTORY } from "../../../../graphics";
import config from "./config";

const Obj3Type = "Obj3Type";

class Shape3 extends WorldObject {
  constructor(inObj) {
    super(inObj, [config]);
  }

  defineGeometry() {
    const color = [0.6, 0.8, 0.45, 1];
    const radius = 3;
    const hemiSphere1 = new OBJ0.Hemisphere3D(radius, {
      dThetaCount: 10,
      deltaColor: 0.1,
      color
    });
    hemiSphere1.model().translate(0, radius, radius * 0.7);

    const hemiSphere2 = new OBJ0.InvertedHemisphere3D(radius, {
      dThetaCount: 10,
      deltaColor: 0.1,
      color
    });
    hemiSphere2.model().translate(0, 0, -radius * 0.7);

    this.geometryList = [hemiSphere1, hemiSphere2];
    return this.geometryList;
  }
}

WOFACTORY.registerType(Obj3Type, Shape3);

export default Obj3Type;
