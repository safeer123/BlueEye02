import {
  SplitScreenCanvasView,
  Scene,
  EventEmitter,
  EventName
} from "../../graphics";

// TwoEyesView Layer
export default class TwoEyesView extends SplitScreenCanvasView {
  constructor(canvas, preRender) {
    super(canvas, preRender);
    this.canvas = canvas;
  }

  switchPairMode = mode => {
    EventEmitter.emit(EventName.TogglePairMode, { mode });
  };

  onEnter() {
    this.switchPairMode(true);
  }

  onExit() {
    this.switchPairMode(false);
  }

  createScene() {
    const {
      nodeObj: { nodes, twoEyes, initScene },
      sceneSetters
    } = this.sceneData;
    // Define left scene and right scene
    const leftScene = new Scene("LEFT_EYE_SCENE");
    leftScene.setNodeList(nodes);
    leftScene.setSceneSetters(sceneSetters);
    const rightScene = leftScene.clone("RIGHT_EYE_SCENE");

    // Set active camera Ids
    const leftCamId = twoEyes.getLeftCamId();
    const rightCamId = twoEyes.getRightCamId();
    leftScene.setActiveCameraId(leftCamId);
    rightScene.setActiveCameraId(rightCamId);

    // Set scenes in CanvasView
    const { canvas } = this;
    this.setLeftRightScenes(leftScene, rightScene, canvas);

    initScene();
  }
}
