const shortHand = {
  Control: "Ctrl",
  doubletap: "dbtap"
};

const shortenKeys = keyString => {
  let outString = keyString;
  Object.keys(shortHand).forEach(btnName => {
    outString = outString.replace(btnName, shortHand[btnName]);
  });
  return outString;
};

export { shortenKeys };
