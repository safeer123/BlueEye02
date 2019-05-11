import { WorldObject, OBJ0, WOFACTORY } from "../../../../graphics";
import config from "./config";

const Obj4Type = "Obj4Type";

class Shape4 extends WorldObject {
  constructor(inObj) {
    super(inObj, [config]);
  }

  defineGeometry() {
    const sideLength = 3;
    const box1 = new OBJ0.Box3D();
    box1
      .model()
      .scale(sideLength, sideLength, sideLength)
      .translate(0, sideLength * 0.5, sideLength * 0.5)
      .xRotate(-Math.PI / 4);
    const box2 = new OBJ0.Box3D();
    box2
      .model()
      .scale(sideLength, sideLength, sideLength)
      .translate(0, sideLength * 0.5, sideLength * 0.5)
      .xRotate(-Math.PI / 4)
      .translate(sideLength, 0, sideLength * Math.sqrt(2));
    box2.setOptions({
      color: [0.4, 0.7, 0.3, 1]
    });

    this.geometryList = [box1, box2];
    return this.geometryList;
  }
}

WOFACTORY.registerType(Obj4Type, Shape4);

export default Obj4Type;
