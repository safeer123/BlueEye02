import { m4, Matrix4 } from "../../lib/m4";
import WorldObject from "../../WorldObject";
import OBJ0 from "../../Geometry/Objects3D/objects";
import config from "./config";
import Utils from "../../AppUtils";
import { PrimaryKeys, SecondaryKeys } from "../../UserControl/constants";

export default class CompositeShape extends WorldObject {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);

    this.setPropertyGetter("model_matrix", () => {
      const phi = this.getProperty("phi");
      const theta = this.getProperty("theta");
      this.model().identity();
      this.model().yRotate(theta);
      this.model().xRotate(phi);
      return this.model().matrix();
    });
  }

  defineGeometry() {
    this.ball1 = new OBJ0.Sphere3D(3, { color: [0.6, 0.8, 0.6, 1] });
    this.ball1.model().translate(0, 3, 0);
    this.ball1.color = [200 / 256, 80 / 256, 110 / 256, 1];

    this.ball2 = new OBJ0.Sphere3D(1, { color: [0.5, 0.5, 0.5, 1] });
    this.ball2.model().translate(-5, 1, 5);

    this.box1 = new OBJ0.Box3D(1, -1, -1, 1, -1, 1);
    this.box1
      .model()
      .yRotate(-Math.PI / 4)
      .xRotate(1)
      .translate(5, 5, 5);

    return [this.ball1, this.ball2, this.box1];
  }
}
