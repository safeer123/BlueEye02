const Buttons = {
  x: "x",
  y: "y",
  a: "a",
  b: "b",
  X: "X",
  Y: "Y",
  A: "A",
  B: "B",
  SELECT: "SELECT",
  ESC: "ESC"
};

const Axes = {
  AxisX: "AxisX",
  AxisY: "AxisY"
};

const mapping = {
  gpid: "VR SHINECON_S10-AUTO",
  buttonMapping: {
    0: Buttons.a,
    1: Buttons.b,
    2: Buttons.x,
    3: Buttons.y,
    4: Buttons.SELECT,
    5: Buttons.ESC,
    6: Buttons.A,
    7: Buttons.B,
    8: Buttons.X,
    9: Buttons.Y
  },
  axesMapping: {
    0: Axes.AxisX,
    1: Axes.AxisY
  }
};

export default { Buttons, Axes, mapping };
