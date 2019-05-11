import { m4, Matrix4 } from "../../lib/m4";
import { SHADER_VARS } from "../../ShaderFactory/constants";
import SceneSetter from "../SceneSetter";
import config from "./config";
import SceneSetterTypes from "../constants/SceneSetterTypes";

export default class AbstractCamera extends SceneSetter {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);
    this.setSceneSetterType(SceneSetterTypes.CAMERA_SCENE_SETTER);

    if (config.CamConfig) {
      this.camConfig = config.CamConfig;
    }

    // Here the model matrix is exactly the lookAt matrix
    this.setPropertyGetter("model_matrix", () => {
      const cameraPosition = this.getProperty("camera_position");
      const targetPosition = this.getProperty("target_position");
      const upVector = this.getProperty("up_vector");
      const lookAtMatrix = m4.lookAt(cameraPosition, targetPosition, upVector);
      this.model().setMatrix(lookAtMatrix);
      return this.model().matrix();
    });

    this.setPropertyGetter(
      "projection_view_matrix",
      this.getProjectionViewMatrix.bind(this)
    );
  }

  setupScene(objRenderer) {
    this.setProperty("canvasAspect", objRenderer.getCanvasAspect(), true);
    // this.canvasAspect = objRenderer.getCanvasAspect();
    objRenderer.setUniformGetter(SHADER_VARS.u_viewProjection, () =>
      this.getProperty("projection_view_matrix")
    );
  }

  // Needed for only camera objects
  getProjectionViewMatrix() {
    const { fieldOfViewRadians, zNear, zFar } = this.camConfig;
    const { viewport } = this.sceneManager;
    const canvasAspect = this.getProperty("canvasAspect");
    const aspect = (canvasAspect * viewport.width) / viewport.height;

    const projectionMatrix = m4.perspective(
      fieldOfViewRadians,
      aspect,
      zNear,
      zFar
    );

    const cameraMatrix = this.getProperty("world_matrix");
    const viewMatrix = m4.inverse(cameraMatrix);

    // Compute a view projection matrix
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    return viewProjectionMatrix;
  }
}
