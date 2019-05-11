import CanvasView from "../CanvasView";
import LayoutGenerator from "../LayoutGenerator";

export default class SplitScreenCanvasView extends CanvasView {
  constructor(canvas, preRender) {
    super(preRender);
    this.updateViewports(canvas);
    this.setName("SplitScreenView");
  }

  updateViewports(canvas) {
    const { width, height } = canvas;
    const layoutGenerator = new LayoutGenerator();
    const splitLayout = layoutGenerator.getGridLayout({
      width,
      height,
      rows: 1,
      cols: 2,
      splitterWidth: 3
    });
    this.viewportLeft = splitLayout.viewports["0-0"];
    this.viewportRight = splitLayout.viewports["0-1"];
  }

  setLeftRightScenes(leftScene, rightScene, canvas) {
    this.updateViewports(canvas);
    super.clearScenes();
    super.addScene(leftScene, this.viewportLeft);
    super.addScene(rightScene, this.viewportRight);
  }
}
