import CanvasView from "../CanvasView";
import LayoutGenerator from "../LayoutGenerator";

export default class SingleCanvasView extends CanvasView {
  constructor(canvas, preRender) {
    super(preRender);
    this.updateViewports(canvas);
    this.setName("SingleScreenView");
  }

  updateViewports(canvas) {
    const { width, height } = canvas;
    const layoutGenerator = new LayoutGenerator();
    const splitLayout = layoutGenerator.getGridLayout({
      width,
      height,
      rows: 1,
      cols: 1,
      splitterWidth: 3
    });
    this.viewport = splitLayout.viewports["0-0"];
  }

  setSingleScene(scene, canvas) {
    this.updateViewports(canvas);
    super.clearScenes();
    super.addScene(scene, this.viewport);
  }
}
