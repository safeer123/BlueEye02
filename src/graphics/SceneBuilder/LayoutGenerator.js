export default class LayoutGenerator {
  getLayout = inObject => {
    // General Layout
  };

  getGridLayout = inObject => {
    const { width, height, cols, rows, splitterWidth } = inObject;
    const normalizedSplitterWidthX = splitterWidth / width;
    const normalizedSplitterWidthY = splitterWidth / height;

    const layout = { viewports: {} };
    const availableX = 1.0 - (cols - 1) * normalizedSplitterWidthX;
    const availableY = 1.0 - (rows - 1) * normalizedSplitterWidthY;
    const cellWidth = availableX / cols;
    const cellHeight = availableY / rows;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const key = `${row}-${col}`;
        layout.viewports[key] = {
          x: col * (cellWidth + normalizedSplitterWidthX),
          y: row * (cellHeight + normalizedSplitterWidthY),
          width: cellWidth,
          height: cellHeight
        };
      }
    }
    return layout;
  };
}
