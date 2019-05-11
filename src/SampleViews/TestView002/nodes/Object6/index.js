import { WorldObject, OBJ0, WOFACTORY, BTN } from "../../../../graphics";
import config from "./config";
import GlowingHemiSphereType from "../GlowingHemisphere";

const LightTowerType = "LIGHT_TOWER";

const baseSideLength = 4;
const baseHeight = 0.1;
const stickHeight = 8.0;
const holderHeight = 1.5;
const stickRadius = 0.5;

class LightTower extends WorldObject {
  constructor(inObj) {
    super(inObj, [config]);

    this.glowingObj = WOFACTORY.create(GlowingHemiSphereType, [inObj]);
    this.addChildren([this.glowingObj]);
    this.glowingObj
      .model()
      .translate(0, stickHeight + baseHeight + holderHeight, 0);
    this.setControls();
  }

  defineGeometry() {
    const base = new OBJ0.Box3D();
    base
      .model()
      .scale(baseSideLength, baseHeight, baseSideLength)
      .translate(0, baseHeight * 0.5, 0)
      .yRotate(-Math.PI / 4);
    base.setOptions({
      color: [0.2, 0.2, 0.3, 1],
      deltaColor: 0.0
    });

    const cylinder3DStick = new OBJ0.Cylinder3D(stickRadius, stickHeight, {
      deltaColor: 0.1,
      getColor: (i, j, options) => {
        const { color, deltaColor, dYCount } = options;
        const changeColWhen = i % 2 === 0 || j === 1 || j === dYCount;
        const colorPlus = color.map(c => c + deltaColor);
        return changeColWhen ? color : colorPlus;
      }
    });
    cylinder3DStick.model().translate(0, baseHeight, 0);

    const cylinder3DHolder = new OBJ0.Cylinder3D(3, holderHeight, {
      deltaColor: 0.0
    });
    cylinder3DHolder.model().translate(0, stickHeight + baseHeight, 0);

    // cylinder3D.model().translate(0, 2.5, 0);
    this.geometryList = [base, cylinder3DStick, cylinder3DHolder];
    return this.geometryList;
  }

  setControls() {
    const powerSwitch = () => {
      const isON = this.glowingObj.getProperty("isON");
      this.glowingObj.setProperty("isON", !isON);
    };
    const colorList = [[1, 1, 1], [1, 0.3, 0.3], [0.3, 1, 0.3], [0.3, 0.3, 1]];
    let colorIndex = 0;
    const colorSwitch = () => {
      colorIndex = (colorIndex + 1) % colorList.length;
      this.glowingObj.setProperty("color", colorList[colorIndex]);
    };
    const controls = [
      {
        name: "Power",
        input: ["1", "a"],
        controlButton: () => BTN.Power(this.glowingObj.getProperty("isON")),
        action: () => powerSwitch()
      },
      {
        name: "Light Color",
        input: ["c+1", "b"],
        controlButton: () => {
          if (colorIndex === 0) return BTN.CircleWhite;
          else if (colorIndex === 1) return BTN.CircleRed;
          else if (colorIndex === 2) return BTN.CircleGreen;
          else if (colorIndex === 3) return BTN.CircleBlue;
        },
        action: () => colorSwitch()
      }
    ];
    this.addControls(controls);
  }
}

WOFACTORY.registerType(LightTowerType, LightTower);

export default LightTowerType;
