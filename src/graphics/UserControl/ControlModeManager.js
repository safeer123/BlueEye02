import EventEmitter from "../lib/EventEmitter";
import { EventName, ControlTypes } from "../constants";

export default class ControlModeManager {
  constructor() {
    this.controlModes = {};
    this.currentModeKey = "default";

    this.clearControls();
    EventEmitter.on(EventName.RegisterControls, this.registerControl);
    EventEmitter.on(EventName.UnregisterControls, this.unregisterControl);
    EventEmitter.on(EventName.ClearControls, this.clearControls);
  }

  // Registers a ControlObject that defines a list of controls and respective
  // keys and action callbacks optionally summary callback as well
  // { id:String, type:String, controls:[{name, action, input, summary}], enabled:Boolean }
  registerControl = controlObj => {
    const { id, type, controls } = controlObj;

    const isEnabled = () => controlObj && controlObj.enabled;

    // We have already registered controls for this object
    if (this.controlsById[type][id]) return;

    this.controlsById[type][id] = controlObj;
    if (controls && controls.length > 0) {
      const controlList = controls.map(c => ({ ...c, id, type, isEnabled }));
      controlList.forEach(c => {
        const { input } = c;
        if (input && input.length > 0) {
          input.forEach(inputKeys => {
            const sortedKeys = inputKeys
              .split("+")
              .sort()
              .join("+");
            const registeredControls = this.registeredControls[type];
            if (!registeredControls[sortedKeys])
              registeredControls[sortedKeys] = [];
            registeredControls[sortedKeys].push(c);
          });
        }
      });
    }
  };

  unregisterControl = controlObjId => {};

  // Clears all registered controls of type controlType(input)
  clearControls = () => {
    this.registeredControls = {
      [ControlTypes.GlobalControl]: {},
      [ControlTypes.ObjectControl]: {}
    };
    this.controlsById = {
      [ControlTypes.GlobalControl]: {},
      [ControlTypes.ObjectControl]: {}
    };
  };

  fireAction(inputKeys, value) {
    Object.values(this.registeredControls).forEach(registeredControls => {
      if (
        registeredControls[inputKeys] &&
        registeredControls[inputKeys].length > 0
      ) {
        registeredControls[inputKeys].forEach(c => {
          if (c.isEnabled()) {
            if (c.action) c.action(value);
            EventEmitter.emit(EventName.ControlObjectModified, c.id);
          }
        });
      }
    });
  }
}
