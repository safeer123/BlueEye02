import React from "react";
import { shortenKeys } from "./constants";
import { EventEmitter, EventName, BTN } from "../../";
import "./index.css";

class ControlMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    EventEmitter.on(EventName.ControlObjectModified, this.onControlModified);
  }

  onControlModified = id => {
    const { selectedControl } = this.props;
    if (selectedControl && selectedControl.id === id) {
      this.forceUpdate();
    }
  };

  fireAction = (obj, enabled) => {
    if (enabled) {
      if (obj.action) obj.action();
      this.forceUpdate();
    }
  };

  toggleEnable = () => {
    const { selectedControl } = this.props;
    EventEmitter.emit(EventName.ToggleControlEnableFlag, {
      id: selectedControl.id
    });
  };

  handleClose = () => {
    if (this.props.handleClose) {
      this.props.handleClose();
    }
  };

  idToLabel = id => id.replace(new RegExp("_", "g"), " ");

  render() {
    const { selectedControl } = this.props;
    if (!selectedControl) return null;

    const { enabled } = selectedControl;
    const closeBTN = BTN.Close;
    const toggleBTN = BTN.Toggle(enabled);
    const disabledClass = enabled ? "" : "disabled";
    return (
      <div className="control-items-wrapper">
        <div className="control-header">
          <i className={`${toggleBTN} pull-left`} onClick={this.toggleEnable} />
          <i className={`${closeBTN} pull-right`} onClick={this.handleClose} />
        </div>
        <div className="control-title">
          {this.idToLabel(selectedControl.id)}
          <hr />
        </div>
        <div className="control-type">{selectedControl.type}</div>

        <div className="controls-content">
          {selectedControl.controls.map((obj, i) => {
            const { controlButton, name, input } = obj;
            const inputDisplay = input ? shortenKeys(input.join(", ")) : "";
            const elemKey = `${name}_${i}`;
            const iconClass = controlButton ? controlButton() : "";
            return (
              <div key={elemKey} className="control-item">
                <div className="control-name">{name}</div>
                {input && <div className="control-keys">{inputDisplay}</div>}
                {controlButton && (
                  <div className={`control-btn ${disabledClass}`}>
                    <i
                      className={iconClass}
                      onClick={() => this.fireAction(obj, enabled)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ControlMenu;
