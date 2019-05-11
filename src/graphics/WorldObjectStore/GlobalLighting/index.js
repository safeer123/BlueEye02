import { m4, Matrix4, dot, addVectors, multVector } from "../../lib/m4";
import { SHADER_VARS } from "../../ShaderFactory/constants";
import SceneSetter from "../SceneSetter";
import config from "./config";
import Utils from "../../AppUtils";
import SceneSetterTypes from "../constants/SceneSetterTypes";
import { BTN } from "../../constants";

export default class GlobalLighting extends SceneSetter {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);
    this.setSceneSetterType(SceneSetterTypes.GLOBAL_LIGHTING_SCENE_SETTER);

    this.setPropertyGetter("sun_light_color", () => {
      if (this.getProperty("isDay")) return config.dayColor;
      return config.nightColor;
    });

    this.setPropertyGetter("sun_direction", () => {
      const theta = this.getProperty("theta");
      return Utils.rThetaPhiToXYZ(1, theta, Math.PI / 2);
    });

    this.setPropertyGetter("isDay", () => {
      const theta = this.getProperty("theta");
      return theta < Math.PI * 0.5 && theta > -Math.PI * 0.5;
    });

    // Create sky color for background
    this.objRenderer.setUniformGetter(SHADER_VARS.u_color, () => {
      const ambient = [0.1, 0.1, 0.1];
      const diffuseI = dot([0, 1, 0], this.getProperty("sun_direction"));
      const netColor = addVectors(
        ambient,
        multVector(diffuseI, [0.1, 0.1, 0.1])
      );
      return [...netColor, 1.0];
    });
    this.setControls();
  }

  setupScene(objRenderer) {
    objRenderer.setUniformGetter(SHADER_VARS.u_sunDirection, () =>
      this.getProperty("sun_direction")
    );

    objRenderer.setUniformGetter(SHADER_VARS.u_sunLightColor, () =>
      this.getProperty("sun_light_color")
    );
  }

  setControls() {
    const DTHETA = 0.01;
    const changeDirection = dt => {
      const newTheta = this.getProperty("theta") + dt;
      this.setProperty("theta", newTheta);
    };
    const summary = () => {
      const sunAngle = Utils.radToDeg(this.getProperty("theta"));
      return [`Sun Orientation: (θ: ${sunAngle}°)`];
    };
    const controls = [
      {
        name: "Sun: θ Minus",
        input: ["s+ArrowLeft"],
        controlButton: () => BTN.Left,
        action: () => changeDirection(-DTHETA),
        summary
      },
      {
        name: "Sun: θ Plus",
        input: ["s+ArrowRight"],
        controlButton: () => BTN.Right,
        action: () => changeDirection(DTHETA),
        summary
      }
    ];
    this.addControls(controls);
  }
}
