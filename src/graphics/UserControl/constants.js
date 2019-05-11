// Gesture type definition
const GestureType = {
  Swipe: "swipe",
  Press: "press",
  // Tap: "tap",
  Pan: "pan",
  DoubleTap: "doubletap",
  Pinch: "pinch",
  Wheel: "wheel"
};

const GestureTypeList = [
  GestureType.Press,
  GestureType.Swipe,
  // GestureType.Tap,
  GestureType.DoubleTap,
  GestureType.Pan,
  GestureType.Pinch
];

const MasterPrimaryKeys = {
  Controlv: "Controlv",
  Controla: "Controla",
  Controlf: "Controlf",
  doubletap: GestureType.DoubleTap
};

const PrimaryKeys = {
  a: "a",
  b: "b",
  c: "c",
  d: "d",
  e: "e",
  f: "f",
  g: "g",
  h: "h",
  i: "i",
  j: "j",
  k: "k",
  l: "l",
  m: "m",
  n: "n",
  o: "o",
  p: "p",
  q: "q",
  r: "r",
  s: "s",
  t: "t",
  u: "u",
  v: "v",
  w: "w",
  x: "x",
  y: "y",
  z: "z",
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9"
};

const SecondaryKeys = {
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  AxisX: "AxisX",
  AxisY: "AxisY",
  pan: GestureType.Pan,
  pinch: GestureType.Pinch,
  wheel: GestureType.Wheel
};

export {
  MasterPrimaryKeys,
  PrimaryKeys,
  SecondaryKeys,
  GestureType,
  GestureTypeList
};
