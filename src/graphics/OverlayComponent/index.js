import React from 'react';
import Button from '@material-ui/core/Button';
import MessagePane from './MessagePane';
import ViewButtonsPanel from './ViewButtonsPanel';
import './index.css';
// import ControlSettings from './ControlSettings';
import SpeakButton from './SpeakButton';
import HideLayerButton from './HideLayerButton';
import { EventEmitter, EventName } from '../';

class Overlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };

    EventEmitter.on(
      EventName.SwitchControlLayerVisibility,
      this.switchVisibility,
    );
  }

  switchVisibility = (obj) => {
    if (obj && obj.show) {
      this.setState({ show: obj.show });
    } else {
      this.setState({ show: !this.state.show });
    }
  };

  displayLoader() {
    const displayMsg = 'Building it...';
    return (
      <div className="loader">
        {this.props.loading ? (
          <span>
            <i className="fa fa-spinner fa-spin" />
            {displayMsg}
          </span>
        ) : null}
      </div>
    );
  }

  render() {
    const { show } = this.state;
    return (
      <div className="overlay-layer unselectable">
        <HideLayerButton active={show} />
        { /* <ControlSettings show={show} /> */}
        <MessagePane />
        <ViewButtonsPanel show={show} />
        {show && <SpeakButton />}
        {this.displayLoader()}
        {show && (
          <div className="back-home">
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.props.Navigate.toHome()}
            >
              HOME
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default Overlay;
