import { TwoByTwoCanvasView, Scene } from "../../graphics";

export default class TwoByTwoView extends TwoByTwoCanvasView {
  constructor(canvas, preRender) {
    super(canvas, preRender);
    this.canvas = canvas;
  }

  createScene() {
    const {
      nodeObj: { nodes, platform, initScene },
      sceneSetters
    } = this.sceneData;
    // Define scenes
    const scene1 = new Scene("SCENE_1");
    scene1.setNodeList(nodes);
    scene1.setSceneSetters(sceneSetters);

    const scene2 = scene1.clone("SCENE_2");
    const scene3 = scene1.clone("SCENE_3");
    const scene4 = scene1.clone("SCENE_4");

    // Set active camera Ids
    const cam1ID = platform.getCam(0).getId();
    scene1.setActiveCameraId(cam1ID);

    const cam2ID = platform.getCam(1).getId();
    scene2.setActiveCameraId(cam2ID);

    const cam3ID = platform.getCam(2).getId();
    scene3.setActiveCameraId(cam3ID);

    const cam4ID = platform.getCam(3).getId();
    scene4.setActiveCameraId(cam4ID);

    // Set scenes in CanvasView
    const { canvas } = this;
    this.setScene(scene1, canvas, 0, 0);
    this.setScene(scene2, canvas, 0, 1);
    this.setScene(scene3, canvas, 1, 0);
    this.setScene(scene4, canvas, 1, 1);

    initScene();
  }
}
