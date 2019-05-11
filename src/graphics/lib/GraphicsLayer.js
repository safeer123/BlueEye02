import { Canvas2D, Canvas } from "../ShaderFactory/Canvas";
import Utils from "../AppUtils";

const ClearColor = [0.2, 0.2, 0.2, 3];

// GraphicsLayer Layer
export default class GraphicsLayer {
  // Construct canvas and webgl context
  constructor(wrapperElem) {
    if (!wrapperElem) console.error("Canvas Wrapper Element is unset");

    this.wrapperElem = wrapperElem;

    const canvasObj = new Canvas(wrapperElem);
    this.canvas = canvasObj.canvas;
    this.gl = canvasObj.gl;
    this.shaderFac = canvasObj.shaderFac;
    this.clearColor = ClearColor;
  }

  clear() {
    const { gl } = this;
    if (gl) {
      gl.clearColor(...this.clearColor);
      gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    }
    if (this.canvas2D) {
      this.canvas2D.ctx.clearRect(
        0,
        0,
        this.canvas2D.canvas.width,
        this.canvas2D.canvas.height
      );
    }
  }

  onResize() {
    this.clear();
    Utils.canvasResize(this.canvas, this.wrapperElem);
    if (this.canvas2D) {
      Utils.canvasResize(this.canvas2D.canvas, this.wrapperElem);
    }
  }

  addCanvas2D() {
    this.canvas2D = new Canvas2D(this.wrapperElem);
  }
}
