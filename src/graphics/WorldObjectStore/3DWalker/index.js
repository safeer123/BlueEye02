import { addVectors, multVector } from "../../lib/m4";
import config from "./config";
import OrientationListener from "../OrientationListener";
import Utils from "../../AppUtils";
import { VoiceCmdsTurn, VoiceCmdsWalk } from "./voice";
import { EventName } from "../../constants";
import EventEmitter from "../../lib/EventEmitter";

// Define Space3DWalker
// This is an orientation listener capable of walking in 3D space
// using control keys.
// To enable these controls it is necessary to call enableDefaultUserControls method
export default class Space3DWalker extends OrientationListener {
  constructor(inObj, configList = []) {
    super(inObj, [config, ...configList]);
    this.setControls();
    this.actionList = [];
  }

  onTick() {
    if (this.actionList.length > 0) {
      const actionItem = this.actionList.pop();
      actionItem();
    }
  }

  turnLeftRight = (angle, dir) => {
    const step = dt => () => this.phiPlus(dir * dt);
    const stepSize = 2;
    const numSteps = parseInt(Math.floor(angle / stepSize), 10);
    for (let i = 0; i < numSteps; i += 1) {
      this.actionList.push(step(Utils.degToRad(stepSize)));
    }
    const reminder = angle % stepSize;
    if (reminder > 0) {
      this.actionList.push(step(Utils.degToRad(reminder)));
    }
  };

  turnUpDown = (angle, dir) => {
    const step = dt => () => this.thetaPlus(dir * dt);
    const stepSize = 2;
    const numSteps = parseInt(Math.floor(angle / stepSize), 10);
    for (let i = 0; i < numSteps; i += 1) {
      this.actionList.push(step(Utils.degToRad(stepSize)));
    }
    const reminder = angle % stepSize;
    if (reminder > 0) {
      this.actionList.push(step(Utils.degToRad(reminder)));
    }
  };

  slowWalk = (distance, dir) => {
    const step = dt => () => this.walk(dir * dt);
    const stepSize = 2;
    const numSteps = parseInt(Math.floor(distance / stepSize), 10);
    for (let i = 0; i < numSteps; i += 1) {
      this.actionList.push(step(stepSize));
    }
    const reminder = distance % stepSize;
    if (reminder > 0) {
      this.actionList.push(step(reminder));
    }
  };

  phiPlus = dPhi => {
    const basePhi = (this.getProperty("base_phi") + dPhi) % (2 * Math.PI);
    this.setProperty("base_phi", basePhi);
    this.displaySummary();
  };

  thetaPlus = dTheta => {
    const baseTheta = (this.getProperty("base_theta") + dTheta) % Math.PI;
    this.setProperty("base_theta", baseTheta);
    this.displaySummary();
  };

  walk = d => {
    const position = this.getProperty("position");
    const targetDrection = this.getProperty("target_direction");
    const dv = multVector(d, targetDrection);
    // console.log(targetDrection);
    const newPosition = addVectors(position, dv);
    const fixed2 = n => n.toFixed(2);
    /*
    console.log(
      fixed2(position[0]),
      fixed2(position[1]),
      fixed2(position[2]),
      " -------> ",
      fixed2(newPosition[0]),
      fixed2(newPosition[1]),
      fixed2(newPosition[2]),
      "(",
      fixed2(dv[0]),
      fixed2(dv[1]),
      fixed2(dv[2]),
      ")"
    );
    */
    this.setProperty("position", newPosition);
    this.displaySummary();
  };

  summary = () => {
    const position = this.getProperty("position");
    const phiInDeg = Utils.radToDeg(this.getProperty("base_phi"));
    const thetaInDeg = Utils.radToDeg(this.getProperty("base_theta"));
    return [
      `(X: ${position[0].toFixed(1)}, 
        Y: ${position[1].toFixed(1)}, 
        Z: ${position[2].toFixed(1)})`,
      `(φ: ${phiInDeg}°, θ: ${thetaInDeg}°)`
    ];
  };

  displaySummary = () => {
    EventEmitter.emit(EventName.DisplaySummaryRequest, {
      title: this.Id,
      displayOutList: this.summary(),
      duration: 3
    });
  };

  setControls() {
    const orientationControlName = "View direction";
    const walkControlName = "Walk";

    const DPHI = 0.03;
    const DTHETA = 0.03;
    const STEPDIST = 1;

    const { phiPlus, thetaPlus, walk, summary } = this;

    const controls = [
      {
        name: walkControlName,
        action: v => walk(-STEPDIST * v),
        input: ["AxisY"],
        summary,
        showSummary: false
      },
      {
        name: orientationControlName,
        action: v => (Math.abs(v) > 0.3 ? phiPlus(DPHI * v) : 0),
        input: ["AxisX"],
        summary,
        showSummary: false
      },
      {
        name: orientationControlName,
        action: e => {
          phiPlus(-DPHI * e.velocityX);
          thetaPlus(-DTHETA * e.velocityY);
        },
        input: ["pan"],
        voice: VoiceCmdsTurn(this.turnLeftRight, this.turnUpDown),
        summary,
        showSummary: false
      },
      {
        name: walkControlName,
        action: e => {
          walk(STEPDIST * (e.scale > 1 ? 1 : -1) * 0.4);
        },
        input: ["pinch"],
        voice: VoiceCmdsWalk(this.slowWalk),
        summary,
        showSummary: false
      },
      {
        name: walkControlName,
        action: e => {
          walk(STEPDIST * (e.dy > 0 ? -1 : 1) * 1);
        },
        input: ["wheel"],
        summary,
        showSummary: false
      }
    ];
    this.addControls(controls, false);
  }
}
