import { WorldObject, OBJ0, WOFACTORY, NodeTypes } from "../../../../graphics";
import config from "./config";

const GlowingHemiSphereType = "GlowingHemiSphereType";

class GlowingHemiSphere extends WorldObject {
  constructor(inObj) {
    super(inObj, [config]);

    const inObjForLight = { ...inObj, renderConfig: null };
    const lightSource = WOFACTORY.create(NodeTypes.ABSTRACT_LIGHT, [
      inObjForLight
    ]);
    this.addChildren([lightSource]);

    lightSource.setPropertyGetter("color_on", () => this.getProperty("color"));
    lightSource.setPropertyGetter("isActive", () => this.getProperty("isON"));

    this.setPropertyGetter("emissive_color", () => {
      if (lightSource.getProperty("isActive")) {
        return lightSource.getProperty("light_color");
      }
      return [0, 0, 0];
    });
  }

  defineGeometry() {
    const color = [0.8, 0.8, 0.8, 1];
    const radius = 3;
    const hemiSphere1 = new OBJ0.Hemisphere3D(radius, {
      dThetaCount: 10,
      deltaColor: 0.0,
      color
    });

    this.geometryList = [hemiSphere1];
    return this.geometryList;
  }
}

WOFACTORY.registerType(GlowingHemiSphereType, GlowingHemiSphere);

export default GlowingHemiSphereType;
