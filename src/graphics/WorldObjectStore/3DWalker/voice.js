import Utils from "../../AppUtils";

const LeftRight = (token, params) => {
  params.direction = token;
  return Utils.OR("left", "right")(token);
};

const UpDown = (token, params) => {
  params.direction = token;
  return Utils.OR("up", "down")(token);
};

const ForwardsBackwards = (token, params) => {
  params.direction = token;
  return Utils.OR("forwards", "backwards")(token);
};

const AngleInDeg = (token, params) => {
  const isPositiveNumber = Number.isFinite(+token) && +token >= 0;
  if (isPositiveNumber) {
    params.angle = +token;
  }
  return isPositiveNumber;
};

const Distance = (token, params) => {
  const isPositiveNumber = Number.isFinite(+token) && +token >= 0;
  if (isPositiveNumber) {
    params.distance = +token;
  }
  return isPositiveNumber;
};

const dirSign = direction =>
  Utils.OR("right", "down", "forwards")(direction) ? +1 : -1;

const VoiceCmdsTurn = (turnLeftRight, turnUpDown) => [
  {
    keys: ["turn", "by"],
    match: ["turn", LeftRight, "by", AngleInDeg],
    action: params => {
      const { direction, angle } = params;
      const dir = dirSign(direction);
      turnLeftRight(angle, dir);
    }
  },
  {
    keys: ["turn"],
    match: ["turn", LeftRight],
    action: params => {
      const { direction } = params;
      const dir = dirSign(direction);
      turnLeftRight(45.0, dir);
    }
  },
  {
    keys: ["turn", "by"],
    match: ["turn", UpDown, "by", AngleInDeg],
    action: params => {
      const { direction, angle } = params;
      const dir = dirSign(direction);
      turnUpDown(angle, dir);
    }
  },
  {
    keys: ["turn"],
    match: ["turn", UpDown],
    action: params => {
      const { direction } = params;
      const dir = dirSign(direction);
      turnUpDown(45.0, dir);
    }
  }
];

const VoiceCmdsWalk = slowWalk => [
  {
    keys: ["walk", "by"],
    match: ["walk", "by", Distance],
    action: params => {
      const { distance } = params;
      const dir = dirSign("forwards");
      slowWalk(distance, dir);
    }
  },
  {
    keys: ["walk", "by"],
    match: ["walk", "backwards", "by", Distance],
    action: params => {
      const { distance } = params;
      const dir = dirSign("backwards");
      slowWalk(distance, dir);
    }
  }
];

export { VoiceCmdsTurn, VoiceCmdsWalk };
