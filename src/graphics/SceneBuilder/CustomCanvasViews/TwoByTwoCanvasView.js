import CanvasView from "../CanvasView";
import LayoutGenerator from "../LayoutGenerator";

export default class TwoByTwoCanvasView extends CanvasView {
  constructor(canvas, preRender) {
    super(preRender);
    this.updateViewports(canvas);
    this.setName("TwoByTwoCanvasView");
  }

  updateViewports(canvas) {
    const { width, height } = canvas;
    const layoutGenerator = new LayoutGenerator();
    const splitLayout = layoutGenerator.getGridLayout({
      width,
      height,
      rows: 2,
      cols: 2,
      splitterWidth: 3
    });
    this.layoutAreas = splitLayout.viewports;
  }

  setScene(scene, canvas, row, col) {
    const key = `${row}-${col}`;
    super.addScene(scene, this.layoutAreas[key]);
  }
}
