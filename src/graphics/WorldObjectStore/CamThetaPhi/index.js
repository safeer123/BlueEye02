import { addVectors, Matrix4 } from "../../lib/m4";
import config from "./config";
import Camera from "../AbstractCamera";
import Utils from "../../AppUtils";
import { BTN } from "../../constants";

export default class CamThetaPhi extends Camera {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);

    // Here the model matrix is exactly the lookAt matrix
    this.setPropertyGetter("camera_position", () => {
      // r, theta, phi to camera position
      const targetPos = this.getProperty("target_position");
      const sphericalPos = Utils.rThetaPhiToXYZ(
        this.getProperty("radius"),
        this.getProperty("theta"),
        this.getProperty("phi")
      );
      return addVectors(targetPos, sphericalPos);
    });

    this.setPropertyGetter("up_vector", () => {
      const upVec = [0, 1, 0];
      const theta = this.getProperty("theta");
      const phi = this.getProperty("phi");
      const mtx4 = new Matrix4().zRotate(0.5 * Math.PI - theta).yRotate(-phi);
      return mtx4.apply(upVec);
    });
    this.setControls();
  }

  setTargetObjects(targetWOList) {
    if (targetWOList && targetWOList.length > 0) {
      this.targetWOList = targetWOList;
      this.targetWOList[0].addChildren([this]);
    }
  }

  setControls() {
    const modeName = "Camera-θφ";
    const DPHI = 0.01;
    const DTHETA = 0.01;
    const STEPDIST = 1;

    const phiPlus = dPhi => {
      const phi = (this.getProperty("phi") + dPhi) % (2 * Math.PI);
      this.setProperty("phi", phi);
    };

    const thetaPlus = dTheta => {
      const theta = (this.getProperty("theta") + dTheta) % Math.PI;
      this.setProperty("theta", theta);
    };

    const radiusPlus = dR => {
      const radius = this.getProperty("radius") + dR;
      this.setProperty("radius", radius);
    };

    const summary = () => {
      const phiInDeg = Utils.radToDeg(this.getProperty("phi"));
      const thetaInDeg = Utils.radToDeg(this.getProperty("theta"));
      return [modeName, `(φ: ${phiInDeg}°, θ: ${thetaInDeg}°)`];
    };

    let targetIndex = 0;
    const switchTargetObject = () => {
      if (this.targetWOList && this.targetWOList.length > 0) {
        this.targetWOList[targetIndex].clearChild(this);
        targetIndex = parseInt(
          (targetIndex + 1) % this.targetWOList.length,
          10
        );
        // console.log(`Selected target: ${this.targetWOList[targetIndex].Id}`);
        this.targetWOList[targetIndex].addChildren([this]);
      }
    };

    const controls = [
      {
        name: "Change target",
        input: ["Alt+t"],
        action: () => {
          switchTargetObject();
        },
        controlButton: () => BTN.DoubleRight
      },
      {
        name: "φ- Rotation",
        input: ["ArrowLeft"],
        controlButton: () => BTN.Left,
        action: () => phiPlus(-DPHI),
        summary
      },
      {
        name: "φ+ Rotation",
        input: ["ArrowRight"],
        controlButton: () => BTN.Right,
        action: () => phiPlus(DPHI),
        summary
      },
      {
        name: "θ- Rotation",
        input: ["ArrowUp"],
        controlButton: () => BTN.Up,
        action: () => thetaPlus(-DPHI),
        summary
      },
      {
        name: "θ+ Rotation",
        input: ["ArrowDown"],
        controlButton: () => BTN.Down,
        action: () => thetaPlus(DPHI),
        summary
      },
      {
        name: "θφ Rotation",
        input: ["pan"],
        action: e => {
          phiPlus(2 * DPHI * e.velocityX);
          thetaPlus(2 * -DTHETA * e.velocityY);
        },
        summary
      },
      {
        name: "Distance (mouse)",
        input: ["wheel"],
        action: e => {
          radiusPlus(STEPDIST * (e.dy > 0 ? 1 : -1) * 1);
        },
        summary
      },
      {
        name: "Distance (touch)",
        input: ["pinch"],
        action: e => {
          radiusPlus(STEPDIST * (e.scale > 1 ? 1 : -1) * 0.4);
        },
        summary
      }
    ];
    this.addControls(controls, false);
  }
}
