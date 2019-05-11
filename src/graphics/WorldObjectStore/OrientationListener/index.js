import { m4, addVectors, Matrix4 } from "../../lib/m4";
import config from "./config";
import WorldObject from "../../WorldObject";
import Utils from "../../AppUtils";

// We neglect changes less than angle error
// This helps very small orientational change not to disturb the view
const AngleError = 0.001;

// Define OrientationListener
// Here we listen to device orientation changes and updates look at direction
export default class OrientationListener extends WorldObject {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);

    // Here the model matrix is exactly the lookAt matrix
    this.setPropertyGetter("model_matrix", () => {
      const position = this.getProperty("position");
      const targetPosition = this.getProperty("target_position");
      const upVector = this.getProperty("up_vector");
      const lookAtMatrix = m4.lookAt(position, targetPosition, upVector);
      this.model().setMatrix(lookAtMatrix);
      return this.model().matrix();
    });

    // we should be setting relative_target_position based on orientation
    this.setPropertyGetter("relative_target_position", () => {
      // r, theta, phi to relative target position
      const sphericalPos = Utils.rThetaPhiToXYZ(
        this.getProperty("radius"),
        this.getProperty("theta"),
        this.getProperty("phi")
      );
      return sphericalPos;
    });

    // base_target_direction based on base angles
    // we can turn our head to get new orientation w.r.t this direction.
    this.setPropertyGetter("target_direction", () => {
      // r, theta, phi to relative target position
      const sphericalPos = Utils.rThetaPhiToXYZ(
        1,
        this.getProperty("theta"),
        this.getProperty("phi")
      );
      return sphericalPos;
    });

    // we should be setting target_postion based on relative_target_position
    this.setPropertyGetter("target_position", () => {
      // relativeTargetPos to target position
      const position = this.getProperty("position");
      const relativeTargetPos = this.getProperty("relative_target_position");
      return addVectors(position, relativeTargetPos);
    });

    this.setPropertyGetter("phi", () =>
      Utils.clampTo0And2PI(
        this.getProperty("base_phi") + this.getProperty("relative_phi")
      )
    );

    this.setPropertyGetter(
      "theta",
      () => this.getProperty("base_theta") + this.getProperty("relative_theta")
    );

    // Calculate Up vector from theta, phi and omega
    this.setPropertyGetter("up_vector", () => {
      const upVec = [0, 1, 0];
      const omega = this.getProperty("omega");
      const theta = this.getProperty("theta");
      const phi = this.getProperty("phi");
      const mtx4 = new Matrix4()
        .xRotate(omega)
        .zRotate(0.5 * Math.PI - theta)
        .yRotate(-phi);
      return mtx4.apply(upVec);
    });

    // Register a control that provides device orientation change
    this.setupOrientationFeed();
  }

  setupOrientationFeed() {
    const initialPhi = this.getProperty("base_phi");
    this.setProperty("phi", initialPhi);
    let phiAtStart;
    let displayOutList = [];

    const toPhiInDeg = (gamma, alpha) =>
      360 - (gamma > 0 ? alpha + 180 : alpha) % 360;

    const onOrientationChange = e => {
      const { alpha, beta, gamma } = e;
      if (!alpha || !beta || !gamma) return;

      // calculate relative phi from alpha value
      const phiInDeg = toPhiInDeg(gamma, alpha);
      const phi = Utils.degToRad(phiInDeg);
      if (phiAtStart === undefined) phiAtStart = phi; // Initialize phiAtStart
      const relativePhi = parseFloat(phi - phiAtStart);

      // Calculate relative theta from gamma value
      const thetaInDeg = gamma > 0 ? gamma : 180 + gamma;
      const relativeTheta = parseFloat(
        Utils.degToRad(thetaInDeg) - Math.PI * 0.5
      );

      // Calculate Omega, this is head rotation w.r.t lookat axis
      const omega = Utils.degToRad(gamma > 0 ? 180 - beta : beta);

      const prevRelativePhi = this.getProperty("relative_phi");
      const prevRelativeTheta = this.getProperty("relative_theta");
      const prevOmega = this.getProperty("omega");
      if (Math.abs(relativePhi - prevRelativePhi) > AngleError) {
        this.setProperty("relative_phi", relativePhi);
      }
      if (Math.abs(relativeTheta - prevRelativeTheta) > AngleError) {
        this.setProperty("relative_theta", relativeTheta);
      }
      if (Math.abs(omega - prevOmega) > AngleError) {
        this.setProperty("omega", omega);
      }
      /*
      displayOutList = this.displayAngleUpdates(
        alpha,
        beta,
        gamma,
        phi,
        relativePhi,
        relativeTheta
      );
      */
    };

    this.addControls([
      {
        name: "OrientationFeed",
        action: onOrientationChange,
        input: ["orientation"],
        summary: () => displayOutList
      }
    ]);
  }

  displayAngleUpdates = (
    alpha,
    beta,
    gamma,
    phi,
    relativePhi,
    relativeTheta
  ) => {
    const displayOutList = [
      `(α:${parseFloat(alpha).toFixed(1)},
        β:${parseFloat(beta).toFixed(1)},
        γ:${parseFloat(gamma).toFixed(1)})`,
      `phi: ${parseFloat(phi).toFixed(2)}`,
      `relativePhi: ${relativePhi.toFixed(2)}`,
      `relativeTheta: ${relativeTheta.toFixed(2)}`
    ];
    return displayOutList;
  };
}

// Gamma negative: beta 0 to 180
// Gamma positive: beta 180 to 0
// omega = gamma > 0 180 - beta : beta;
