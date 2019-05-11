import { EventName } from "../constants";
import EventEmitter from "../lib/EventEmitter";
import GamepadControl from "./GamepadController";
import configGP1 from "./CustomGamepadConfig/VRSHINECON";
import configGP2 from "./CustomGamepadConfig/vrshinecon_desktop";
import configGP3 from "./CustomGamepadConfig/VRSHINECON_android";

// TestMode: Displays what is the index mapped to the button key in gamepad
const TestMode = false;

class GamepadKeyListener {
  constructor() {
    this.enabled = true;

    EventEmitter.on(EventName.EnableGamepadKeyListener, () => {
      this.enabled = true;
    });
    EventEmitter.on(EventName.DisableGamepadKeyListener, () => {
      this.enabled = false;
    });

    this.pressedKeys = [];
    this.keyState = {};

    GamepadControl.registerGamepadConfig(configGP1);
    GamepadControl.registerGamepadConfig(configGP2);
    GamepadControl.registerGamepadConfig(configGP3);

    GamepadControl.onButtonDown(this.onKeyDown);
    GamepadControl.onButtonUp(this.onKeyUp);
  }

  setKeyListener(listener) {
    this.listener = listener;
  }

  onKeyDown = event => {
    if (this.enabled) {
      if (TestMode) {
        EventEmitter.emit(EventName.DisplayOutRequest, {
          displayOutList: [event.index],
          duration: 2
        });
      }
      const { key } = event;
      this.keyState[key] = true;
      this.pressedKeys = Object.keys(this.keyState);
      if (this.listener) {
        this.listener([...this.pressedKeys]);
      }
    }
  };

  onKeyUp = event => {
    if (this.enabled) {
      const { key } = event;
      delete this.keyState[key];
      this.pressedKeys = Object.keys(this.keyState);
    }
  };

  getPressedKeys() {
    return [...this.pressedKeys];
  }
}

export default new GamepadKeyListener();
