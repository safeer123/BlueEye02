import {
  SingleCanvasView,
  Scene,
  EventEmitter,
  EventName
} from "../../graphics";

export default class SingleNodeView extends SingleCanvasView {
  constructor(canvas, preRender) {
    super(canvas, preRender);
    this.canvas = canvas;
  }

  onEnter() {
    const {
      nodeObj: { camThetaPhi }
    } = this.sceneData;
    EventEmitter.emit(EventName.ToggleControlEnableFlag, {
      id: camThetaPhi.Id,
      flag: true
    });
  }

  onExit() {
    const {
      nodeObj: { camThetaPhi }
    } = this.sceneData;
    EventEmitter.emit(EventName.ToggleControlEnableFlag, {
      id: camThetaPhi.Id,
      flag: false
    });
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
