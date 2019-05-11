import { m4 } from "../../lib/m4";
import { SHADER_VARS } from "../../ShaderFactory/constants";
import SceneSetter from "../SceneSetter";
import config from "./config";
import SceneSetterTypes from "../constants/SceneSetterTypes";

export default class AbstractPointLight extends SceneSetter {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);
    this.setSceneSetterType(SceneSetterTypes.LIGHT_SCENE_SETTER);

    // light_color is the color that shines other objects
    // Light source supposedly emits this color of light
    this.setPropertyGetter(
      "light_color",
      () =>
        this.getProperty("isActive")
          ? this.getProperty("color_on")
          : this.getProperty("color_off")
    );

    this.setPropertyGetter("model_matrix", () => {
      const translation = this.getProperty("light_position");
      this.model().identity();
      this.model().translate(...translation);
      return this.model().matrix();
    });

    this.lightIndex = 0;
  }

  setLightIndex(i) {
    this.lightIndex = i;
  }

  // This light index is used in shaders to translate to which index in the light array
  setLightIndex(index) {
    this.lightIndex = index;
  }

  setupScene(objRenderer) {
    objRenderer.setUniformGetter(
      SHADER_VARS.u_LightColor(this.lightIndex),
      () => this.getProperty("light_color")
    );

    objRenderer.setUniformGetter(
      SHADER_VARS.u_LightPosition(this.lightIndex),
      () => {
        const origin = [0, 0, 0, 1];
        const worldMatrix = this.getProperty("world_matrix");
        const lightPosInWorld = m4.transformVector(origin, worldMatrix);
        return lightPosInWorld.splice(0, 3);
      }
    );
  }
}
