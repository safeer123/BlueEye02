import SceneSetterTypes from "../WorldObjectStore/constants/SceneSetterTypes";
import EventEmitter from "../lib/EventEmitter";
import { EventName } from "../constants";

/** *****************************
Define Scene class
- nodeList for rendering
- Scene setters
- render method
********************************** */
export default class Scene {
  constructor(name) {
    this.name = name;
    this.nodeList = [];
    this.sceneSetters = [];
    this.relevantSceneSetters = null;
    this.activeCameraId = null;
  }

  sceneUpdater = () => {
    EventEmitter.emit(EventName.UpdateScene);
  };

  setNodeList(nodeList) {
    this.nodeList = nodeList;

    // Recalculation needed for relevantSceneSetters
    this.relevantSceneSetters = null;
  }

  setSceneSetters = sceneSetters => {
    this.sceneSetters = sceneSetters;

    // Recalculation needed for relevantSceneSetters
    this.relevantSceneSetters = null;
  };

  getRelevantSceneSetters() {
    const { sceneSetters } = this;
    const relevantSceneSetters = sceneSetters.filter(sceneSetter => {
      const { sceneSetterType, Id } = sceneSetter;
      const isActive = sceneSetter.getProperty("isActive");
      if (isActive) {
        if (sceneSetterType === SceneSetterTypes.CAMERA_SCENE_SETTER) {
          return Id === this.activeCameraId;
        }
        return true;
      }
      return false;
    });
    return relevantSceneSetters;
  }

  clone(cloneName) {
    // returns a duplicate scene
    // with same nodeList and sceneSetters
    // activeCamera should ideally differ
    const cloneScene = new Scene(cloneName);
    cloneScene.setNodeList(this.nodeList);
    cloneScene.setSceneSetters(this.sceneSetters);
    cloneScene.setActiveCameraId(this.activeCameraId);
    return cloneScene;
  }

  setActiveCameraId(id) {
    this.activeCameraId = id;

    // Recalculation needed for relevantSceneSetters
    this.relevantSceneSetters = null;
  }

  render(viewport) {
    if (this.sceneSetters.length === 0) {
      return;
    }

    const { nodeList, sceneSetters, relevantSceneSetters } = this;
    if (nodeList.length > 0 && sceneSetters.length > 0) {
      // We need relevantSceneSetters for producing the scene
      if (!relevantSceneSetters) {
        this.relevantSceneSetters = this.getRelevantSceneSetters();
      }

      if (this.relevantSceneSetters.length > 0) {
        // Create Scene config
        const { name } = this;
        const sceneConfig = {
          name,
          viewport,
          sceneSetters: this.relevantSceneSetters
        };

        // Rendering the scene
        nodeList.forEach(node => node.computeScene(sceneConfig));
        nodeList.forEach(node => node.render());
      }
    }
  }
}
