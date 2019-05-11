const keys = ["turn", "light"];

const OnOff = (token, params) => {
  params.key = token;
  return token === "on" || token === "off";
};

const VoiceCmds = (powerSwitch, name) => [
  {
    keys,
    match: ["turn", OnOff, "light", name],
    action: params => {
      powerSwitch(params.key === "on");
    }
  }
];

export { VoiceCmds };
