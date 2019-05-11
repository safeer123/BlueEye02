import React from "react";
import { SplitButton, MenuItem, FormControl } from "react-bootstrap";
import {
  objControlListForTest,
  globalControlListForTest
} from "./sampleControls";
import ControlMenu from "./ControlMenu";
import { EventEmitter, EventName, BTN, ControlTypes } from "../../";
import "./index.css";

const UseTestControls = false;
const SearchInput = {
  GLOBAL_CONTROL_SEARCH: 0,
  OBJECT_CONTROL_SEARCH: 1
};

class ControlSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsEnabled: false,
      selectedControls: [],
      globalControls: {},
      objectControls: {},
      searchKey: {
        [SearchInput.GLOBAL_CONTROL_SEARCH]: "",
        [SearchInput.OBJECT_CONTROL_SEARCH]: ""
      }
    };
    if (UseTestControls) {
      this.state.globalControls = globalControlListForTest;
      this.state.objectControls = objControlListForTest;
    } else {
      EventEmitter.on(EventName.RegisterControls, this.registerControl);
      EventEmitter.on(EventName.UnregisterControls, this.unregisterControl);
      EventEmitter.on(EventName.ClearControls, this.clearControls);
      EventEmitter.on(EventName.ToggleControlEnableFlag, this.toggleEnable);
    }
    this.selectedControlById = {};
  }

  unregisterControl = controlObjId => {};

  clearControls = () => {
    setTimeout(() => {
      this.setState({
        selectedControls: [],
        globalControls: {},
        objectControls: {}
      });
      this.selectedControlById = {};
    }, 0);
  };

  toggleEnable = ({ id, flag }) => {
    if (id) {
      const { globalControls, objectControls } = this.state;
      const controlObj = globalControls[id]
        ? globalControls[id]
        : objectControls[id];
      if (controlObj) {
        if (typeof flag !== "undefined") {
          controlObj.enabled = flag;
        } else {
          controlObj.enabled = !controlObj.enabled;
        }
        EventEmitter.emit(EventName.ControlObjectModified, controlObj.id);
      }
    }
  };

  duplicateControlSelected(id) {
    return Boolean(this.selectedControlById[id]);
  }

  handleDropdown(id) {
    // console.log(id);
    if (this.duplicateControlSelected(id)) return;
    const { globalControls, objectControls } = this.state;
    let controlToAdd = null;
    if (objectControls[id]) {
      controlToAdd = objectControls[id];
    } else if (globalControls[id]) {
      controlToAdd = globalControls[id];
    }
    if (controlToAdd) {
      this.selectedControlById[id] = controlToAdd;
      this.setState({
        selectedControls: [...this.state.selectedControls, controlToAdd]
      });
    }
  }

  getMenuItems(controlObjList, searchKey = "") {
    const itemList = [];
    controlObjList.forEach((obj, i) => {
      const { id } = obj;
      const label = this.idToLabel(id);
      const elemKey = `${id}_${i}`;
      const addItem = searchKey
        ? label.toLowerCase().includes(searchKey.toLowerCase())
        : true;
      if (addItem) {
        itemList.push(
          <MenuItem
            key={elemKey}
            eventKey={id}
            disabled={Boolean(this.selectedControlById[id])}
          >
            {label}
          </MenuItem>
        );
      }
    });
    return itemList;
  }

  getSearchBox = searchType => (
    <FormControl
      type="string"
      value={this.state.searchKey[searchType]}
      onChange={e => this.searchInputChange(searchType, e.target.value)}
      onFocus={() => this.enableDisableKeyListener(false)}
      onBlur={() => this.enableDisableKeyListener(true)}
    />
  );

  registerControl = controlObj => {
    setTimeout(() => {
      const { id, type } = controlObj;
      if (type === ControlTypes.GlobalControl) {
        const globalControls = {
          ...this.state.globalControls,
          [id]: controlObj
        };
        this.setState({ globalControls });
      } else if (type === ControlTypes.ObjectControl) {
        const objectControls = {
          ...this.state.objectControls,
          [id]: controlObj
        };
        this.setState({ objectControls });
      }
    }, 0);
  };

  handleClose(selectedControl) {
    if (this.selectedControlById[selectedControl.id]) {
      let selectedControls = [...this.state.selectedControls];
      selectedControls = selectedControls.filter(c => c !== selectedControl);
      delete this.selectedControlById[selectedControl.id];
      this.setState({ selectedControls });
    }
  }

  toggleSettings = () => {
    this.setState({ settingsEnabled: !this.state.settingsEnabled });
  };

  searchInputChange = (SearchInputType, value) => {
    // console.log(SearchInputType, value);
    this.setState({
      searchKey: {
        ...this.state.searchKey,
        [SearchInputType]: value
      }
    });
  };

  enableDisableKeyListener = flag => {
    const event = flag
      ? EventName.EnableKeyboardListener
      : EventName.DisableKeyboardListener;
    EventEmitter.emit(event);
  };

  clearAll = () => {
    this.setState({
      selectedControls: []
    });
    this.selectedControlById = {};
  };

  idToLabel = id => id.replace(new RegExp("_", "g"), " ");

  render() {
    const {
      settingsEnabled,
      selectedControls,
      globalControls,
      objectControls
    } = this.state;
    const { show } = this.props;
    const hidden = show ? "" : "hidden";
    const settingsBTN = BTN.Settings(settingsEnabled);
    const closeBTN = BTN.Close;
    return (
      <div className="controls-wrapper">
        <div className={`obj-settings ${hidden}`}>
          <div>
            <i className={settingsBTN} onClick={() => this.toggleSettings()} />
            {settingsEnabled && (
              <SplitButton
                title="Controls"
                id="controls-dropdown"
                onSelect={e => this.handleDropdown(e)}
              >
                <MenuItem header>
                  Global Controls
                  {this.getSearchBox(SearchInput.GLOBAL_CONTROL_SEARCH)}
                </MenuItem>
                {this.getMenuItems(
                  Object.values(globalControls),
                  this.state.searchKey[SearchInput.GLOBAL_CONTROL_SEARCH]
                )}
                <MenuItem divider />
                <MenuItem header>
                  Object Controls
                  {this.getSearchBox(SearchInput.OBJECT_CONTROL_SEARCH)}
                </MenuItem>
                {this.getMenuItems(
                  Object.values(objectControls),
                  this.state.searchKey[SearchInput.OBJECT_CONTROL_SEARCH]
                )}
              </SplitButton>
            )}
            {settingsEnabled && selectedControls.length > 0 && (
              <i className={`${closeBTN} close-icon`} onClick={this.clearAll} />
            )}
          </div>
        </div>
        {settingsEnabled && selectedControls && selectedControls.length > 0 && (
          <div className={`control-items-container ${hidden}`}>
            {selectedControls.map(selectedControl => (
              <ControlMenu
                selectedControl={selectedControl}
                handleClose={() => this.handleClose(selectedControl)}
                key={selectedControl.id}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default ControlSettings;
