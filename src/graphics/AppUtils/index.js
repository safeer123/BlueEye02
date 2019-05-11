const Utils = {};

// requestAnimationFrame: reference to last request call
let requestRef = null;

// Initialize definitions we would need later
(() => {
  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    (f => setTimeout(f, 1000 / 60));
  // simulate calling code 60

  window.cancelAnimationFrame =
    window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    (requestID => clearTimeout(requestID)); // fall back

  window.screen.lockOrientationUniversal =
    window.screen.lockOrientation ||
    window.screen.mozLockOrientation ||
    window.screen.msLockOrientation;
})();

Utils.clone = obj => {
  let copy;

  // Handle the 3 simple types, and null or undefined
  if (obj == null || typeof obj !== "object") return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = Utils.clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (const attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = Utils.clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
};

Utils.createBufferObj = () => ({
  data: [],
  numItems: 0,
  buffer: null
});

Utils.isInsideBox = (boundingBox, point) => {
  if (
    point.x >= boundingBox.left &&
    point.x <= boundingBox.right &&
    point.y >= boundingBox.top &&
    point.y <= boundingBox.bottom
  ) {
    return true;
  }
  return false;
};

Utils.FCache = new class {
  constructor() {
    this.cached = [];
  }

  sin(theta) {
    const key = `sin${theta.toString()}`;
    if (!(key in this.cached)) {
      this.cached[key] = Math.sin(theta);
    }
    return this.cached[key];
  }

  cos(theta) {
    const key = `cos${theta.toString()}`;
    if (!(key in this.cached)) {
      this.cached[key] = Math.cos(theta);
    }
    return this.cached[key];
  }
}();

// Spherical coordinates to cartesian coordinates
// But here y is up, x is right, z head-looking direction for you
Utils.rThetaPhiToXYZ = (r, theta, phi, cache = false) => {
  let sinFunc = Math.sin;
  let cosFunc = Math.cos;
  if (cache) {
    sinFunc = Utils.FCache.sin;
    cosFunc = Utils.FCache.cos;
  }
  return [
    r * sinFunc(theta) * cosFunc(phi),
    r * cosFunc(theta),
    r * sinFunc(theta) * sinFunc(phi)
  ];
};

// Cylidrical Coordinates, (y is up)
Utils.rPhiYtoXYZ = (r, phi, y, cache = false) => {
  let sinFunc = Math.sin;
  let cosFunc = Math.cos;
  if (cache) {
    sinFunc = Utils.FCache.sin;
    cosFunc = Utils.FCache.cos;
  }
  return [r * cosFunc(phi), y, r * sinFunc(phi)];
};

Utils.interpolate = (a, b, t) => {
  if (Number.isFinite(a) && Number.isFinite(b)) {
    return a * (1 - t) + b * t;
  } else if (Array.isArray(a) && Array.isArray(b)) {
    const out = [];
    a.forEach((k, i) => out.push(Utils.interpolate(a[i], b[i], t)));
    return out;
  }
};

Utils.radToDeg = rad => (180 * rad / Math.PI).toFixed(2);
Utils.degToRad = deg => (Math.PI * deg / 180).toFixed(4);
Utils.clampTo0And2PI = rad => {
  if (rad < 0) rad += 2 * Math.PI;
  return rad % (2 * Math.PI);
};

Utils.canvasResize = (canvas, wrapperDiv) => {
  if (canvas && wrapperDiv) {
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = wrapperDiv.clientWidth * devicePixelRatio;
    canvas.height = wrapperDiv.clientHeight * devicePixelRatio;
    canvas.style.width = `${wrapperDiv.clientWidth}px`;
    canvas.style.height = `${wrapperDiv.clientHeight}px`;
  }
};

Utils.startRenderingLoop = loop => {
  const recursiveLoop = timeStamp => {
    loop(timeStamp);
    requestRef = requestAnimationFrame(recursiveLoop);
  };
  requestRef = requestAnimationFrame(recursiveLoop);
};

Utils.stopRenderingLoop = () => {
  if (requestRef) {
    cancelAnimationFrame(requestRef);
  }
};

// To lock screen orientation in landscape mode
// This will work only in fullscreen mode
Utils.lockScreenOrientationAsLandscape = () => {
  if (
    window.screen &&
    window.screen.orientation &&
    window.screen.orientation.lock
  ) {
    window.screen.orientation.lock("landscape").catch(error => {
      // We may get error in desktops. We just ignore them.
      // console.log(error);
    });
  }

  if (
    window.screen.lockOrientationUniversal &&
    window.screen.lockOrientationUniversal([
      "landscape-primary",
      "landscape-secondary"
    ])
  ) {
    // orientation was locked
  } else {
    // orientation lock failed
  }
};

Utils.OR = (...args) => t => args.indexOf(t) !== -1;

export default Utils;
