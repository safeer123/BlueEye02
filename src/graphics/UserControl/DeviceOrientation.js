// Singleton class
class DeviceOrientationFeed {
  constructor() {
    if (window.DeviceOrientationEvent) {
      // Our browser supports DeviceOrientation
      console.log("Browser supports Device Orientation");
      window.addEventListener("deviceorientation", this.onOrientationChange);
    } else {
      console.log("Sorry, your browser doesn't support Device Orientation");
    }

    this.listenerList = {};
  }

  // Axes on device
  onOrientationChange = event => {
    if (this.listener) {
      this.listener({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma
      });
    }
  };

  addListener(l) {
    this.listener = l;
  }
}

export default new DeviceOrientationFeed();
