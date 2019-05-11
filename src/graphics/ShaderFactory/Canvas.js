import GLInitializer from "./GLInitializer";

// Define Canvas: A wrapper around canvas and gl context
// canvas has three sizes associated with it
// Actual Size on the screen: clientWidth and clientHeight
// Display size: no of pixels used for drawing the canvas
// Drawing Buffer Size: How many pixels used for drawing within the canvas
export class Canvas {
  constructor(wrapperDiv, programIdList = null) {
    this.canvas = document.createElement("canvas");
    wrapperDiv.appendChild(this.canvas);

    this.canvas.style.position = "absolute";
    this.canvas.style.left = "0";
    this.canvas.style.zIndex = 1;
    this.canvas.style.pointerEvents = "none";

    this.initGL(); // webgl canvas

    this.shaderFac = new GLInitializer(this);
    this.shaderFac.init(programIdList);
  }

  initGL() {
    try {
      this.gl = this.canvas.getContext("experimental-webgl");
    } catch (e) {}
    if (!this.gl) {
      console.error("Could not initialise WebGL, sorry :-(");
    }
  }
}

export class Canvas2D {
  constructor(wrapperDiv) {
    this.canvas = document.createElement("canvas");
    wrapperDiv.appendChild(this.canvas);

    this.canvas.style.position = "absolute";
    this.canvas.style.left = "0";
    this.canvas.style.zIndex = 1;
    this.canvas.style.pointerEvents = "none";

    this.initGL(); // 2d canvas
  }

  initGL() {
    try {
      this.ctx = this.canvas.getContext("2d");
    } catch (e) {}
    if (!this.ctx) {
      console.error("Could not initialise 2D canvas, sorry :-(");
    }
  }
}
