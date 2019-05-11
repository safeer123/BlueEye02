import ControlModeManager from "./ControlModeManager";
import DeviceOrientationFeed from "./DeviceOrientation";
import GamepadControl from "./GamepadController";
import GestureController from "./GestureController";
import KeyboardListener from "./KeyboardListener";
import GamepadKeyListener from "./GamepadKeyListener";
import SpeechProcessor from "./SpeechProcessor";

import configGP from "./CustomGamepadConfig/VRSHINECON";

export default class UserControl {
  constructor(canvasWrapper, sceneUpdater) {
    this.sceneUpdater = sceneUpdater;
    this.controlModeMngr = new ControlModeManager();

    // Listen to device orientation changes
    this.deviceOrientationFeedSetup();
    // Listen to keyboard events
    this.keyboardEventSetup();
    // Listen to Gamepad controller events
    this.gamepadControllerSetup();
    // Listen to Gesture input events
    this.gestureInputSetup(canvasWrapper);
  }

  displayOut(displayOutList) {
    this.sceneUpdater(displayOutList);
  }

  // Main loop for user control
  loop(timestamp) {
    GamepadControl.loop();
  }

  deviceOrientationFeedSetup() {
    const { controlModeMngr } = this;
    DeviceOrientationFeed.addListener(e => {
      controlModeMngr.fireAction("orientation", e);
    });
  }

  keyboardEventSetup() {
    const { controlModeMngr } = this;

    KeyboardListener.setKeyListener(ks => {
      const keys = this.getAllPressedKeys();
      // console.log(keys);
      // this.displayOut([this.keysToString(keys)]);
      controlModeMngr.fireAction(this.keysToString(keys));
    });
  }

  gamepadControllerSetup() {
    GamepadControl.onConnected(e => this.displayOut(["Connected", e.name]));
    GamepadControl.onDisconnected(e =>
      this.displayOut(["Disconnected", e.name])
    );
    GamepadControl.registerGamepadConfig(configGP);

    const { controlModeMngr } = this;
    GamepadKeyListener.setKeyListener(ks => {
      const keys = this.getAllPressedKeys();
      // console.log(keys);
      controlModeMngr.fireAction(this.keysToString(keys));
    });

    GamepadControl.onAxisValueChanged(e => {
      // console.log("GP Axis: ", e);
      const { axisName, value } = e;
      const keys = [...this.getAllPressedKeys(), axisName];
      // console.log(keys);
      controlModeMngr.fireAction(this.keysToString(keys), value);
    });
  }

  gestureInputSetup = domElement => {
    this.gestureControl = new GestureController(domElement);
    this.gestureControl.onGestureInput((gestureType, e) => {
      const { controlModeMngr } = this;
      const keyboardKeys = this.getAllPressedKeys();
      const keys = [...keyboardKeys, gestureType];
      // console.log(keys);
      controlModeMngr.fireAction(this.keysToString(keys), e);
    });
  };

  keysToString = keys => keys.sort().join("+");

  getAllPressedKeys = () => {
    const keys1 = KeyboardListener.getPressedKeys();
    const keys2 = GamepadKeyListener.getPressedKeys();
    return [...keys1, ...keys2];
  };
}
