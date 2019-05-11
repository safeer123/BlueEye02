// Error in axis values of the gamepad
const AxisError = 0.005;

class GamepadController {
  constructor() {
    this.connectedGamepads = [];
    this.gpConfig = {};

    // Previous state of buttons and axes
    this.prevState = {};

    // If we gave gamepad API
    if ("getGamepads" in navigator) {
      console.log("GamepadController: Waiting for any gamepad to connect...");
      this.gamepadDetected = false;

      window.addEventListener("gamepadconnected", this.handleNewConnection);
      window.addEventListener("gamepaddisconnected", this.handleDisconnection);

      // setup an interval for Chrome
      window.setInterval(() => {
        if (navigator.getGamepads()[0]) {
          if (!this.gamepadDetected) {
            console.log("GAMEPAD DETECTED INSIDE SETINTERVAL LOOP...");
            this.handleNewConnection({ gamepad: navigator.getGamepads()[0] });
          }
        }
      }, 2000);
    }
  }

  // TODO: check if the config id matching with this gamepad
  getGpConfig(id) {
    // For now just retun the existing configuration
    // Ideally we should compare id and return the correct config if we have
    if (this.gpConfig[id]) return this.gpConfig[id];
    return null;
  }

  isGoodAxisValue = val => Math.abs(val) > AxisError;

  loop() {
    if (navigator.getGamepads().length > 0) {
      const gamepadList = navigator.getGamepads();
      const gamepads = Object.values(gamepadList).filter(g => g);
      gamepads.forEach(gamepad => {
        const { index, id } = gamepad;

        const config = this.getGpConfig(id);
        if (config) {
          const { gpid, buttonMapping, axesMapping } = config.mapping;

          if (!this.prevState[gpid])
            this.defineState(
              gpid,
              Object.keys(buttonMapping),
              Object.keys(axesMapping)
            );

          // Process button events
          Object.keys(buttonMapping).forEach(bi => {
            if (bi in gamepad.buttons) {
              const { pressed } = gamepad.buttons[bi];
              const pressedBefore = this.prevState[gpid].btn[bi].pressed;
              if (pressed !== pressedBefore) {
                const key = buttonMapping[bi];
                const e = { pressed, index: bi, key };
                if (pressed && this.buttonDown) this.buttonDown(e);
                if (!pressed && this.buttonUp) this.buttonUp(e);

                this.prevState[gpid].btn[bi].pressed = pressed;
              }
            }
          });

          // Process axes events
          Object.keys(axesMapping).forEach(ai => {
            if (ai in gamepad.axes) {
              // console.log("Axis value: " + gamepad.axes[ai]);
              const value = this.isGoodAxisValue(gamepad.axes[ai])
                ? gamepad.axes[ai]
                : 0;
              const valueBefore = this.prevState[gpid].axs[ai].value;
              if (
                this.isGoodAxisValue(value) ||
                this.isGoodAxisValue(valueBefore)
              ) {
                const axisName = axesMapping[ai];
                const e = { value, index: ai, axisName };
                if (this.axisValueChanged) this.axisValueChanged(e);

                this.prevState[gpid].btn[ai].value = value;
              }
            }
          });
        }
      });
    }
  }

  defineState(id, btns, axes) {
    const stateObj = { btn: {}, axs: {} };
    btns.forEach(bi => {
      stateObj.btn[bi] = { pressed: false };
    });
    axes.forEach(ai => {
      stateObj.axs[ai] = { value: 0.0 };
    });
    this.prevState[id] = stateObj;
  }

  registerGamepadConfig(config) {
    if (config && config.mapping && config.mapping.gpid)
      this.gpConfig[config.mapping.gpid] = config;
  }

  onButtonDown(cb) {
    this.buttonDown = cb;
  }

  onButtonUp(cb) {
    this.buttonUp = cb;
  }

  onAxisValueChanged(cb) {
    this.axisValueChanged = cb;
  }

  onConnected(cb) {
    this.notifyConnected = cb;
  }

  onDisconnected(cb) {
    this.notifyDisconnected = cb;
  }

  handleDisconnection = e => {
    this.gamepadDetected = false;
    console.log("gamepad disconnected.");
    if (this.notifyDisconnected && e && e.gamepad) {
      const name = e.gamepad.id;
      const index = e.gamepad.index;
      this.notifyDisconnected({ name, index });
    }
    // window.clearInterval(repGP);
  };

  handleNewConnection = e => {
    this.gamepadDetected = true;
    console.log("gamepad connected.");
    if (this.notifyConnected && e && e.gamepad) {
      const name = e.gamepad.id;
      const index = e.gamepad.index;
      this.notifyConnected({ name, index });
      this.connectedGamepads[index] = e.gamepad;
    }
    // repGP = window.setInterval(reportOnGamepad, 100);
  };
}

const GamepadControl = new GamepadController();

export default GamepadControl;
