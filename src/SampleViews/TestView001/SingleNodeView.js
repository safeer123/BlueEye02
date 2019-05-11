import { SingleCanvasView, Scene } from "../../graphics";

export default class SingleNodeView extends SingleCanvasView {
  constructor(canvas, preRender) {
    super(canvas, preRender);
    this.canvas = canvas;
  }

  createScene() {
    const {
      nodeObj: { nodes, camThetaPhi, initScene },
      sceneSetters
    } = this.sceneData;
    // Define scene and right scene
    const scene = new Scene("MAIN_SCENE");
    scene.setNodeList(nodes);
    scene.setSceneSetters(sceneSetters);

    // Set active camera Ids
    const mainCamId = camThetaPhi.getId();
    scene.setActiveCameraId(mainCamId);

    // Set scenes in CanvasView
    const { canvas } = this;
    this.setSingleScene(scene, canvas);

    initScene();
  }
}
