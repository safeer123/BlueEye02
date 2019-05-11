const keys = ["blue", "eye"];

const LockUnlock = (token, params) => {
  params.key = token;
  return token === "lock" || token === "unlock";
};

const OnOff = (token, params) => {
  params.key = token;
  return token === "on" || token === "off";
};

const LeftRight = (token, params) => {
  params.key = token;
  return token === "left" || token === "right";
};

const Angle = (token, params) => {
  const isNumber = Number.isFinite(+token);
  if (isNumber) {
    params.angle = +token;
  }
  return isNumber;
};

const LockBlueEye = [
  {
    keys,
    match: [LockUnlock, "blue", "eye"],
    action: params => {
      console.log(params);
    }
  },
  {
    keys: ["light", "turn"],
    match: ["turn", OnOff, "the", "light"],
    action: params => {
      console.log(params);
    }
  },
  {
    keys: ["list", "objects"],
    match: ["list", "all", "objects"],
    action: () => {
      console.log("listing objects...");
    }
  },
  {
    keys: ["turn"],
    match: ["turn", LeftRight, "by", Angle],
    action: params => {
      console.log(params);
    }
  }
];

export { LockBlueEye };
