import WorldObject from "../../WorldObject";
import config from "./config";

// Defines a scene setter
// This contributes to form the entire scene
export default class SceneSetter extends WorldObject {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);
    this.sceneSetterType = null; // to be defined by derived class
  }

  setSceneSetterType(type) {
    this.sceneSetterType = type;
  }

  // Mandatory method
  // This gets invoked at runtime while rendering each object
  setupScene(objRenderer) {
    // To be overridden by the derived class
    throw Error(
      `${
        this.sceneSetterType
      }: Scene setter does not have mandatory setupScene method.`
    );
  }
}
