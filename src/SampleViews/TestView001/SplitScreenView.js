import { SplitScreenCanvasView, Scene } from "../../graphics";

// SplitScreenView Layer
export default class SplitScreenView extends SplitScreenCanvasView {
  constructor(canvas, preRender) {
    super(canvas, preRender);
    this.canvas = canvas;
  }

  createScene() {
    const {
      nodeObj: { nodes, camLeft, camRight, initScene },
      sceneSetters
    } = this.sceneData;
    // Define left scene and right scene
    const leftScene = new Scene("LEFT_SCENE");
    leftScene.setNodeList(nodes);
    leftScene.setSceneSetters(sceneSetters);
    const rightScene = leftScene.clone("RIGHT_SCENE");

    // Set active camera Ids
    const leftCamId = camLeft.getId();
    const rightCamId = camRight.getId();
    leftScene.setActiveCameraId(leftCamId);
    rightScene.setActiveCameraId(rightCamId);

    // Set scenes in CanvasView
    const { canvas } = this;
    this.setLeftRightScenes(leftScene, rightScene, canvas);

    initScene();
  }
}
