import { GestureTypeList, GestureType } from "./constants";

const MouseWheel = require("mouse-wheel");
const Hammer = require("hammerjs");

class GestureController {
  constructor(domElement) {
    this.setupGestureHandlers(domElement);
  }

  setupGestureHandlers = domElement => {
    console.log("setup Gesture Handlers...");
    const hammer = new Hammer(domElement);
    hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL });
    hammer.get("pinch").set({
      enable: true
    });
    // Subscribe to a quick start event: press, tap, or doubletap.
    // These are quick start events.
    GestureTypeList.forEach(gesture => {
      hammer.on(gesture, e => {
        if (this.handleGesture) {
          this.handleGesture(gesture, e);
        }
      });
    });

    MouseWheel(domElement, (dx, dy) => {
      if (this.handleGesture) {
        this.handleGesture(GestureType.Wheel, { dx, dy });
      }
    });
  };

  onGestureInput(handleGesture) {
    this.handleGesture = handleGesture;
  }
}

export default GestureController;
