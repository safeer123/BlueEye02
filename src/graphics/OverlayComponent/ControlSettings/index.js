import React from 'react';
import { Settings, Close } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import {
  objControlListForTest,
  globalControlListForTest,
} from './sampleControls';
import ControlMenu from './ControlMenu';
import { EventEmitter, EventName, BTN, ControlTypes } from '../../';
import './index.css';

const UseTestControls = false;
const SearchInput = {
  GLOBAL_CONTROL_SEARCH: 0,
  OBJECT_CONTROL_SEARCH: 1,
};

class ControlSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsEnabled: true,
      selectedControls: [],
      globalControls: {},
      objectControls: {},
      searchKey: {
        [SearchInput.GLOBAL_CONTROL_SEARCH]: '',
        [SearchInput.OBJECT_CONTROL_SEARCH]: '',
      },
      anchorEl: null,
    };
    if (UseTestControls) {
      this.state.globalControls = globalControlListForTest;
      this.state.objectControls = objControlListForTest;
    } else {
      EventEmitter.on(EventName.RegisterControls, this.registerControl);
      EventEmitter.on(EventName.UnregisterControls, this.unregisterControl);
      EventEmitter.on(EventName.ClearControls, this.clearControls);
      EventEmitter.on(EventName.ControlObjectModified, this.controlModified);
    }
    this.selectedControlById = {};
  }

  unregisterControl = (controlObjId) => {};

  clearControls = () => {
    setTimeout(() => {
      this.setState({
        selectedControls: [],
        globalControls: {},
        objectControls: {},
      });
      this.selectedControlById = {};
    }, 0);
  };

  controlModified = (id) => {
    if (id) {
      this.forceUpdate();
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
        selectedControls: [...this.state.selectedControls, controlToAdd],
      });
    }
    this.handleMenuClose();
  }

  getMenuItems(controlObjList, searchKey = '') {
    const itemList = [];
    controlObjList.forEach((obj, i) => {
      const { id } = obj;
      const label = this.idToLabel(id);
      const elemKey = `${id}_${i}`;
      const addItem = searchKey
        ? label.toLowerCase().includes(searchKey.toLowerCase())
        : true;
      if (addItem) {
        itemList.push(<MenuItem
          key={elemKey}
          eventKey={id}
          disabled={Boolean(this.selectedControlById[id])}
          onClick={() => this.handleDropdown(id)}
        >
          {label}
        </MenuItem> );
      }
    });
    return itemList;
  }

  getSearchBox = searchType => (
    <TextField
      fullWidth
      label="Search"
      value={this.state.searchKey[searchType]}
      onChange={e => this.searchInputChange(searchType, e.target.value)}
      onFocus={() => this.enableDisableKeyListener(false)}
      onBlur={() => this.enableDisableKeyListener(true)}
    />
  );

  registerControl = (controlObj) => {
    setTimeout(() => {
      const { id, type } = controlObj;
      if (type === ControlTypes.GlobalControl) {
        const globalControls = {
          ...this.state.globalControls,
          [id]: controlObj,
        };
        this.setState({ globalControls });
      } else if (type === ControlTypes.ObjectControl) {
        const objectControls = {
          ...this.state.objectControls,
          [id]: controlObj,
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
        [SearchInputType]: value,
      },
    });
  };

  enableDisableKeyListener = (flag) => {
    const event = flag
      ? EventName.EnableKeyboardListener
      : EventName.DisableKeyboardListener;
    EventEmitter.emit(event);
  };

  clearAll = () => {
    this.setState({
      selectedControls: [],
    });
    this.selectedControlById = {};
  };

  idToLabel = id => id.replace(new RegExp('_', 'g'), ' ');

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleMenuOpen = (e) => {
    this.setState({ anchorEl: e.currentTarget });
  };

  render() {
    const {
      settingsEnabled,
      selectedControls,
      globalControls,
      objectControls,
      anchorEl,
    } = this.state;
    const { show } = this.props;
    const hidden = show ? '' : 'hidden';
    return (
      <div className="controls-wrapper">
        <div className={`obj-settings ${hidden}`}>
          <div>
            {settingsEnabled && (
              <React.Fragment>
                <Button
                  size="small"
                  variant="contained"
                  id="controls-dropdown"
                  aria-owns={anchorEl ? 'simple-menu' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenuOpen}
                  className="controlBtn"
                >
                  Controls
                </Button>

                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={this.handleMenuClose}
                  classes={{ paper: 'controls-dropdown' }}
                >
                  <MenuItem disabled>Global Controls</MenuItem>
                  <MenuItem disableRipple>
                    {this.getSearchBox(SearchInput.GLOBAL_CONTROL_SEARCH)}
                  </MenuItem>
                  {this.getMenuItems(
                    Object.values(globalControls),
                    this.state.searchKey[SearchInput.GLOBAL_CONTROL_SEARCH],
                  )}
                  <MenuItem disabled>Object Controls</MenuItem>
                  <MenuItem disableRipple>
                    {this.getSearchBox(SearchInput.OBJECT_CONTROL_SEARCH)}
                  </MenuItem>
                  {this.getMenuItems(
                    Object.values(objectControls),
                    this.state.searchKey[SearchInput.OBJECT_CONTROL_SEARCH],
                  )}
                </Menu>
              </React.Fragment>
            )}
            {settingsEnabled && selectedControls.length > 0 && (
              <Close
                className="close-icon clickable-item"
                onClick={this.clearAll}
              />
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
