import { EventName } from "../constants";
import EventEmitter from "../lib/EventEmitter";

class KeyboardListener {
  constructor() {
    this.enabled = true;

    EventEmitter.on(EventName.EnableKeyboardListener, () => {
      this.enabled = true;
    });
    EventEmitter.on(EventName.DisableKeyboardListener, () => {
      this.enabled = false;
    });

    this.pressedKeys = [];
    this.keyState = {};

    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  }

  setKeyListener(listener) {
    this.listener = listener;
  }

  onKeyDown = event => {
    if (this.enabled) {
      event.preventDefault();
      event.stopPropagation();
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
      event.preventDefault();
      event.stopPropagation();
      const { key } = event;
      delete this.keyState[key];
      this.pressedKeys = Object.keys(this.keyState);
    }
  };

  getPressedKeys() {
    return [...this.pressedKeys];
  }
}

export default new KeyboardListener();
