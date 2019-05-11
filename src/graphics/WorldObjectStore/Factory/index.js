import configure from "./configure";
import NodeTypes from "../constants/NodeTypes";

const MAX_LIGHT_COUNT = 10;

// WOFactory: Defines a factory for creating instances of World Objects
class WOFactory {
  constructor() {
    this.countOfObjects = 0;
    this.lightCount = 0;
    this.WOClassLookup = {};
  }

  // register a type of WO
  registerType(type, Class) {
    if (this.WOClassLookup[type]) {
      console.error(
        `registerType: ${type} is already defined. This will override previous definition.`
      );
    }
    this.WOClassLookup[type] = Class;
  }

  // create instance of WO of the specified type
  // List of argument objects to be passed in
  create(type, argObjects) {
    if (this.WOClassLookup[type]) {
      const Class = this.WOClassLookup[type];
      const obj = new Class(...argObjects);
      this.initObject(type, obj);
      return obj;
    }
    return null;
  }

  initObject(type, obj) {
    const id = this.generateUniqueId(type);
    obj.setId(id);
    obj.setType(type);
    if (type === NodeTypes.ABSTRACT_LIGHT) {
      obj.setLightIndex(this.lightCount);
      if (this.lightCount < MAX_LIGHT_COUNT - 1) this.lightCount += 1;
      else
        console.log(
          `Maximum Light count reached... We don't support more than ${MAX_LIGHT_COUNT} lights.`
        );
    }
  }

  // Generate a unique id using object count
  generateUniqueId(type) {
    this.countOfObjects += 1;
    return `${this.countOfObjects}_${type}`;
  }

  reset() {
    this.countOfObjects = 0;
    this.lightCount = 0;
  }
}

const WOFACTORY = new WOFactory();
configure(WOFACTORY);

export default WOFACTORY;
