import React from 'react';
import { Mic, MicOff } from '@material-ui/icons';

import './index.css';
import { EventEmitter, EventName } from '../';

class SpeakButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: false,
      active: false,
    };
    EventEmitter.on(EventName.SoundStart, () => this.talking(true));
    EventEmitter.on(EventName.SoundEnd, () => this.talking(false));
  }

  talking = (flag) => {
    if (this.state.enabled) {
      this.setState({ active: flag });
    }
  };

  toggleSpeechDetection = () => {
    const newValue = !this.state.enabled;
    this.setState({ enabled: newValue });
    if (!newValue) {
      this.setState({ active: false });
    }
    EventEmitter.emit(EventName.ToggleSpeechDetection, newValue);
  };

  render() {
    const { enabled, active } = this.state;
    let MicrophoneBTN = MicOff;
    let IconClass = 'icon-neutral';
    if (enabled) {
      MicrophoneBTN = Mic;
      IconClass = active ? 'icon-green' : 'icon-red';
    }
    return (
      <div className="speak-btn">
        <MicrophoneBTN
          onClick={this.toggleSpeechDetection}
          className={IconClass}
        />
      </div>
    );
  }
}

export default SpeakButton;
