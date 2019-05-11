import Utils from "../AppUtils";
import NodeTypes from "./constants";

// This class defines a node in Scene Graph
export default class Node {
  constructor() {
    // List of child nodes
    this.children = [];

    // A node is characterized by a set of its properties
    // Values of these properties define how this node will contribute to the scene
    this.propertyBucket = {};

    // Each node might hold a set of parent properties
    // delivered from its parent through setParentProperties
    this.parentProperties = {};

    // Flag that is responsible for recalculating properties once again
    // Defaulting this to true
    // Once we render, we should set this flag false
    this.rebuildProperties = true;

    // We should set the type for derived world objects,
    // and that will override this value
    this.setType(NodeTypes.ABSTRACT_NODE);

    // This is invoked whenever we expect to update the scene
    this.sceneUpdater = null;
  }

  // Set the type of Node
  setType(type) {
    this.type = type;
  }

  getType() {
    return this.type;
  }

  setId(id) {
    this.Id = id;
  }

  getId() {
    return this.Id;
  }

  // Expects a list of nodes as children
  addChildren(list) {
    this.children.push(...list);
    this.rebuildProperties = true;
    this.trySceneUpdate();
  }

  clearChildren() {
    this.children = [];
    this.rebuildProperties = true;
    this.trySceneUpdate();
  }

  clearChild(child) {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      this.rebuildProperties = true;
      this.trySceneUpdate();
    }
  }

  defineProperty(propertyObj) {
    this.propertyBucket[propertyObj.name] = Utils.clone(propertyObj);
  }

  defineProperties(propertyObjList = []) {
    if (propertyObjList.length > 0) {
      propertyObjList.forEach(propertyObj => {
        this.defineProperty(propertyObj);
      });
    }
  }

  initProperties(initList = []) {
    if (initList.length > 0) {
      initList.forEach(initObj => {
        this.setProperty(initObj.name, initObj.value);
      });
    }
  }

  setProperty(propertyName, value, onlyIfValueChanged = false) {
    const propertyObj = this.propertyBucket[propertyName];
    if (!propertyObj) {
      console.error(`WorldObject:setProperty(): ${propertyName} not defined.`);
    }

    if (onlyIfValueChanged && propertyObj.value === value) {
      return;
    }

    if (propertyObj.min && value < propertyObj.min) {
      propertyObj.value = propertyObj.min;
    } else if (propertyObj.max && value > propertyObj.max) {
      propertyObj.value = propertyObj.max;
    } else {
      propertyObj.value = value;
    }
    // This will imply that we should recompute all properties
    this.rebuildProperties = true;

    this.trySceneUpdate();
  }

  setPropertyGetter(propertyName, getter) {
    if (!this.propertyBucket[propertyName]) {
      console.error(`WorldObject:setProperty(): ${propertyName} not defined.`);
    }
    this.propertyBucket[propertyName].getter = getter;
    // This will imply that we should recompute all properties
    this.rebuildProperties = true;

    this.trySceneUpdate();
  }

  getProperty(propertyName) {
    const { rebuildProperties } = this;
    const propertyObj = this.propertyBucket[propertyName];
    if (!propertyObj) {
      console.error(`WorldObject:getProperty(): ${propertyName} not defined.`);
    }
    // If rebuildProperties=true and there is a getter then we compute it
    if (rebuildProperties && propertyObj.getter) {
      const computedValue = propertyObj.getter();
      this.setProperty(propertyName, computedValue);
    }
    // if no getter, return the value
    return this.getValue(propertyName);
  }

  getValue(propertyName) {
    if (!this.propertyBucket[propertyName]) {
      console.error(`WorldObject:getValue(): ${propertyName} not defined.`);
    }
    return this.propertyBucket[propertyName].value;
  }

  setParentProperties(properties) {
    this.parentProperties = { ...this.parentProperties, ...properties }; // override existing
    this.rebuildProperties = true; // We should recalculate properties
  }

  setSceneUpdater(sceneUpdater) {
    this.sceneUpdater = sceneUpdater;
  }

  trySceneUpdate() {
    if (this.sceneUpdater) this.sceneUpdater();
  }
}
