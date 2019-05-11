import GraphicsLayer from "../../lib/GraphicsLayer";
import UserControl from "../../UserControl";
import EventEmitter from "../../lib/EventEmitter";
import { ControlTypes, EventName, BTN } from "../../constants";
import SceneGraph from "../SceneGraph";
import Remember from "../../lib/Remember";
import { VoiceViewCmds } from "./voice";

// ViewHolder (Smart Graphics Layer)
// List of CanvasViews having viewports and respective scenes
// Switch View option based on swipe gesture or Control+v
export default class ViewHolder extends GraphicsLayer {
  // Construct canvas and webgl context
  constructor(wrapperElem, properties = {}) {
    super(wrapperElem);
    this.properties = properties;
    this.userControl = new UserControl(wrapperElem, this.displayOutHandler);
  }

  // Derived class should pass nodeObj and viewList
  init(viewHolderId, nodeObj, viewList) {
    this.viewHolderId = viewHolderId;
    const { sceneSetters } = SceneGraph.initializeNodes(nodeObj.nodes);
    this.sceneData = { nodeObj, sceneSetters };

    this.setupViews(viewList);

    // Register all controls here
    this.clearControls();
    this.registerViewControls();
    this.registerObjectControls();
    EventEmitter.on(EventName.SwitchView, this.switchView.bind(this));
  }

  setupViews = viewList => {
    this.viewList = [];
    if (viewList) {
      this.viewList = viewList;
      this.viewList.sort((a, b) => a.id - b.id);
      EventEmitter.emit(EventName.SetViewList, this.viewList);
    }

    if (this.viewList.length > 0) {
      let startViewIndex = 0;
      if (this.properties.RememberSelectedViewsOnRefresh) {
        const rememberedIndex = Remember.get(this.getViewIndexStorageKey());
        if (rememberedIndex !== null) {
          startViewIndex = rememberedIndex;
        }
      }
      this.setCurrentViewByIndex(startViewIndex);
    }
  };

  getViewIndexStorageKey = () => `${this.viewHolderId}_VIEW_INDEX`;

  // This is the main animation loop which gets invoked at screen refresh time
  animationLoop(timestamp) {
    if (this.userControl) this.userControl.loop(timestamp);

    const {
      nodeObj: { nodes }
    } = this.sceneData;
    SceneGraph.onTick(nodes, timestamp);
  }

  switchView = ({ step, index }) => {
    if (step) {
      let nextIndex = (this.currentViewIndex + step) % this.viewList.length;
      if (nextIndex < 0) nextIndex += this.viewList.length;
      this.setCurrentViewByIndex(nextIndex);
    } else {
      this.setCurrentViewByIndex(index);
    }
  };

  clearControls = () => {
    EventEmitter.emit(EventName.ClearControls);
  };

  registerViewControls() {
    let fullscreenState = false;
    const fullscreenSwitch = ({ flag = null }) => {
      if (flag !== null) {
        fullscreenState = flag;
      } else {
        fullscreenState = !fullscreenState;
      }
      EventEmitter.emit(EventName.FullscreenSwitch, { flag: fullscreenState });
    };
    const viewSwitch = () => this.switchView({ step: 1 });
    const getCurrentView = () => this.viewList[this.currentViewIndex];
    const controlObject = {
      id: "VIEW_CONTROLS",
      type: ControlTypes.GlobalControl,
      enabled: true,
      controls: [
        {
          name: "Fullscreen switch",
          input: ["Control+f", "doubletap"],
          controlButton: () => BTN.Fullscreen(fullscreenState),
          action: fullscreenSwitch
        },
        {
          name: "Switch views",
          input: ["Control+v"],
          controlButton: () => BTN.Picture,
          action: viewSwitch,
          voice: VoiceViewCmds(this.switchView, getCurrentView, this.viewList)
        }
      ]
    };
    EventEmitter.emit(EventName.RegisterControls, controlObject);
  }

  registerObjectControls() {
    const {
      nodeObj: { nodes }
    } = this.sceneData;
    if (nodes) {
      SceneGraph.registerObjectControls(nodes);
    }
  }

  displayOutHandler = displayOutList => {
    if (displayOutList && displayOutList.length > 0) {
      EventEmitter.emit(EventName.DisplayOutRequest, {
        displayOutList,
        duration: 2
      });
    }
  };

  handleGesture(gestureType, event) {
    // console.log(gestureType, event);
    this.userControl.handleGesture(gestureType, event);
    switch (gestureType) {
      default:
        // this.displayOutHandler([gestureType]);
        break;
    }
  }

  setCurrentViewByIndex(index) {
    this.setCurrentView(this.viewList[index]);
    this.currentViewIndex = index;
    EventEmitter.emit(EventName.ViewChanged, index);
    if (this.properties.RememberSelectedViewsOnRefresh) {
      Remember.set(this.getViewIndexStorageKey(), index);
    }
  }

  setCurrentView(view) {
    if (this.currentView) {
      this.currentView.stop();
      if (this.currentView.onExit) {
        this.currentView.onExit();
      }
    }
    if (this.createCanvasView) {
      this.currentView = this.createCanvasView(view.canvasViewClass);
      if (this.currentView) {
        this.currentView.registerAnimationLoop(this.animationLoop.bind(this));
        // Concrete class must define createScene method
        if (this.createScene) {
          this.createScene();
        }

        if (this.currentView.onEnter) {
          setTimeout(() => this.currentView.onEnter(), 10);
        }

        EventEmitter.emit(EventName.ViewChanged, this.currentViewIndex);
        // If there is a name for the view, show it
        /*
        if (view.name) {
          this.displayOutHandler([`Switched to ${view.name}`]);
        }
        */
      }
    }
  }

  preRender = () => this.clear(); // Find a good logic for clearing screen

  createCanvasView(CustomCanvasView) {
    const canvasView = new CustomCanvasView(this.canvas, this.preRender);
    canvasView.setSceneData(this.sceneData);
    return canvasView;
  }

  createScene() {
    // This should be How we rebuild the scene
    if (this.currentView) {
      this.currentView.stop();
      if (this.currentView.createScene) {
        this.currentView.createScene();
      }
      this.currentView.start();
    }
  }
}
