import Utils from "./../AppUtils";
import EventEmitter from "../lib/EventEmitter";
import { EventName } from "../constants";

// Define CanvasView
// This class holds multiple scene objects
// Renders all scenes into their respective viewports inside the canvas
export default class CanvasView {
  constructor(preRender) {
    this.scenes = [];
    this.name = "unnamed";
    // Flag that will ensure a render in the next iteration of renderLoop
    this.renderOnce = true;

    // Time at previous renderLoop was hit
    this.prevTimeStamp = -1;

    // render loop initialization flag
    this.loopStarted = false;

    // This will be garanteed to be invoked prior to render call
    this.preRender = preRender;

    // Animation loop
    // Will get called in requestAnimationFrame
    // Timestamp is passed
    this.animationLoop = null;

    // Scene Data containing nodes
    this.sceneData = null;

    EventEmitter.on(EventName.UpdateScene, this.updateSceneOnce);
  }

  setName(name) {
    this.name = name;
  }

  addScene(scene, viewport) {
    this.scenes.push({
      scene,
      viewport
    });
  }

  clearScenes() {
    this.scenes = [];
  }

  updateSceneOnce = () => {
    this.renderOnce = true;
  };

  setSceneData(sceneData) {
    this.sceneData = sceneData;
  }

  registerAnimationLoop(loop) {
    this.animationLoop = loop;
  }

  render() {
    const { renderOnce, scenes } = this;
    if (renderOnce) {
      if (this.preRender) {
        this.preRender();
      }
      // console.log(`rendering ${this.name}..`);
      scenes.forEach(obj => obj.scene.render(obj.viewport));
      this.renderOnce = false;
    }
  }

  renderLoop(timeStamp) {
    // console.log(timeStamp);

    // Optimize the rendering call based on checking
    // significant update in the time stamp value
    if (Math.abs(this.prevTimeStamp - timeStamp) < 20) {
      return;
    }
    // If there is animationLoop call this here
    if (this.animationLoop) this.animationLoop(timeStamp);
    this.render();

    this.prevTimeStamp = timeStamp;
  }

  start() {
    if (!this.loopStarted) {
      this.renderOnce = true;
      Utils.startRenderingLoop(this.renderLoop.bind(this));
      this.loopStarted = true;
    }
  }

  stop() {
    Utils.stopRenderingLoop();
    this.loopStarted = false;
    this.renderOnce = true;
  }
}
