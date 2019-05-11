import React from 'react';
import { Visibility, VisibilityOff } from '@material-ui/icons';

import './index.css';
import { EventEmitter, EventName } from '../';

class HideLayerButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  switchVisibility = () => {
    const { active } = this.props;
    EventEmitter.emit(EventName.SwitchControlLayerVisibility);
  };

  render() {
    const { active } = this.props;
    const VisibilityBTN = active ? Visibility : VisibilityOff;
    return (
      <div className="hide-layer-btn">
        <VisibilityBTN
          className="visibility-icon"
          onClick={this.switchVisibility}
        />
      </div>
    );
  }
}

export default HideLayerButton;
