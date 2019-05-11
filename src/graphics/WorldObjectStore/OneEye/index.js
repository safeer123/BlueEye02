import config from "./config";
import Space3DWalker from "../3DWalker";
import WOFACTORY from "../Factory";
import NodeTypes from "../constants/NodeTypes";

// Single camera acting like a single eye vision.
// One camera attached to a Space3DWalker which is an OrientationListener as well
export default class OneEye extends Space3DWalker {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);

    const inObjForCam = { ...inObj, renderConfig: null };
    this.camera = WOFACTORY.create(NodeTypes.CAMERA_ABSTRACT, [inObjForCam]);

    this.camera.setPropertyGetter("camera_position", () => [0, 0, 0]);
    this.camera.setPropertyGetter("target_position", () => [
      0,
      0,
      -this.getProperty("radius")
    ]);
    this.camera.setProperty("up_vector", [0, 1, 0]);

    this.addChildren([this.camera]);
  }

  getCamId() {
    return this.camera.getId();
  }
}
