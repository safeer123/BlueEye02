const BTN = {
  CircleWhite: "fa fa-circle btn-white",
  CircleRed: "fa fa-circle btn-red",
  CircleGreen: "fa fa-circle btn-green",
  CircleBlue: "fa fa-circle btn-blue",
  DotCircle: "far fa-dot-circle",
  Left: "fa fa-chevron-circle-left",
  Right: "fa fa-chevron-circle-right",
  DoubleRight: "fa fa-angle-double-right circle-border",
  Up: "fa fa-chevron-circle-up",
  Down: "fa fa-chevron-circle-down",
  Minus: "fa fa-minus-circle",
  Plus: "fa fa-plus-circle",
  Picture: "fa fa-image",
  Close: "fa fa-times",

  Settings: ON => (ON ? "fa fa-cog btnActive" : "fa fa-cog btnInactive"),
  Fullscreen: ON =>
    ON ? "fa fa-compress btnActive" : "fa fa-expand btnInactive",
  Power: ON => (ON ? "fa fa-power-off btnON" : "fa fa-power-off btnOFF"),
  Circle: ON => (ON ? "fa fa-circle btnON" : "fa fa-circle btnOFF"),
  Visibility: ON => (ON ? "fa fa-eye btnON" : "fa fa-eye-slash btnOFF"),
  Toggle: ON => (ON ? "fa fa-toggle-on btnON" : "fa fa-toggle-off btnOFF"),
  Microphone: {
    active: "fa fa-microphone btnON",
    idle: "fa fa-microphone btn-red",
    disabled: "fa fa-microphone btnOFF"
  },
};

export default BTN;
