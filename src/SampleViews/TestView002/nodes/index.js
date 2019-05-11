// Using factory we will create WOs
import { WOFACTORY, NodeTypes } from "../../../graphics";

import PlatformType from "./Platform";
import Carpet1Type from "./Carpet1";
import Obj1Type from "./Object1";
import Obj2Type from "./Object2";
import Obj3Type from "./Object3";
import Obj4Type from "./Object4";
import Obj5Type from "./Object5";
import LightTowerType from "./Object6";

// Scene0 Layer
export default function getNodes(inpObj) {
  const { gl, programs, renderConfigLight } = inpObj;

  const inObj = (config = renderConfigLight) => ({
    gl,
    programs,
    renderConfig: config
  });

  WOFACTORY.reset();

  const platform = WOFACTORY.create(PlatformType, [inObj()]);

  const carpet1 = WOFACTORY.create(Carpet1Type, [inObj()]);
  platform.addChildren([carpet1]);

  const shape1 = WOFACTORY.create(Obj1Type, [inObj()]);
  shape1.model().translate(-67, 0, -1);
  carpet1.addChildren([shape1]);

  const shape2 = WOFACTORY.create(Obj2Type, [inObj()]);
  shape2.model().translate(-50, 0, 1);
  carpet1.addChildren([shape2]);

  const shape3 = WOFACTORY.create(Obj3Type, [inObj()]);
  shape3.model().translate(-30, 0, 2);
  carpet1.addChildren([shape3]);

  const shape4 = WOFACTORY.create(Obj4Type, [inObj()]);
  shape4.model().translate(30, 0, -5);
  carpet1.addChildren([shape4]);

  const shape5 = WOFACTORY.create(Obj5Type, [inObj()]);
  shape5.model().translate(60, 0, 2);
  carpet1.addChildren([shape5]);

  const light01 = WOFACTORY.create(LightTowerType, [inObj()]);
  light01.model().translate(85, 0, 0);
  carpet1.addChildren([light01]);

  const light02 = WOFACTORY.create(LightTowerType, [inObj()]);
  light02.model().translate(-85, 0, 0);
  carpet1.addChildren([light02]);

  const carpet2 = WOFACTORY.create(Carpet1Type, [inObj()]);
  carpet2.model().translate(0, 0.1, 0);
  carpet2.model().yRotate(Math.PI * 0.5);
  platform.addChildren([carpet2]);

  const light03 = WOFACTORY.create(LightTowerType, [inObj()]);
  light03.model().translate(85, 0, 0);
  carpet2.addChildren([light03]);

  const light04 = WOFACTORY.create(LightTowerType, [inObj()]);
  light04.model().translate(-85, 0, 0);
  carpet2.addChildren([light04]);

  const globalLightObj = WOFACTORY.create(NodeTypes.GLOBAL_LIGHTING, [inObj()]);
  globalLightObj.setProperty("theta", 0.1 * Math.PI);

  const centralLightObj = WOFACTORY.create(NodeTypes.GLOWING_SPHERE, [inObj()]);
  centralLightObj.setProperty("isON", true);
  centralLightObj.setProperty("translation", [0, 5, 0]);
  carpet1.addChildren([centralLightObj]);

  const camThetaPhi = WOFACTORY.create(NodeTypes.CAMERA_SPHERICAL_PATH, [
    inObj()
  ]);
  camThetaPhi.setProperty("target_position", [0, 0, 0]);
  camThetaPhi.setProperty("radius", 30);
  // light01.addChildren([camThetaPhi]);
  camThetaPhi.setTargetObjects([
    centralLightObj,
    light01,
    shape5,
    shape4,
    shape3,
    shape2,
    shape1
  ]);

  const oneEye = WOFACTORY.create(NodeTypes.CAMERA_ONE_EYE, [inObj()]);
  oneEye.setProperty("position", [100, 5, 0]);
  oneEye.setProperty("radius", 150);
  oneEye.setProperty("base_phi", Math.PI);

  const twoEyes = WOFACTORY.create(NodeTypes.CAMERA_TWO_EYES, [inObj()]);
  twoEyes.setProperty("position", [-10, 5, 0]);
  twoEyes.setProperty("radius", 150);
  twoEyes.setProperty("base_phi", Math.PI);
  // Animation
  const initScene = () => {
    setTimeout(() => {
      shape1.trySceneUpdate();
    }, 100);
  };

  // return all root nodes
  return {
    nodes: [globalLightObj, platform, twoEyes, oneEye],
    platform,
    camThetaPhi,
    twoEyes,
    oneEye,
    initScene
  };
}
