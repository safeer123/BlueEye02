import React from 'react';
import Fullscreen from 'react-full-screen';

import {
  GLController,
  EventEmitter,
  EventName,
  Utils,
} from '../../../graphics';
import OverlayComponent from '../../../graphics/OverlayComponent';
import SampleViewList from '../../../SampleViews/config';

import './index.css';

class ViewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      isFullscreenMode: false,
    };
    this.resizeHandler = this.resizeHandler.bind(this);
    EventEmitter.on(EventName.FullscreenSwitch, e =>
      this.handleFullscreenSwitch(e),);
  }

  componentDidMount() {
    console.log('Initializing graphics controller..');
    const { viewIndex } = this.props.match.params;
    if (viewIndex >= 0) {
      this.glController = new GLController(
        this.canvasWrapper,
        SampleViewList[viewIndex].viewHolder,
      );

      window.addEventListener('resize', this.resizeHandler);
      this.resizeHandler();
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log("Component: componentWillReceiveProps------");
    // console.log(nextProps);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
  }

  onFullscreenChange = (isFullscreen) => {
    if (isFullscreen) Utils.lockScreenOrientationAsLandscape();
  };

  resizeHandler() {
    // console.log(this.canvasWrapper.clientWidth, this.canvasWrapper.clientHeight);
    if (this.glController) {
      this.setState({ loading: true });
      setTimeout(
        () =>
          this.glController.onResize(() => {
            this.setState({ loading: false });
          }),
        0,
      );
    }
  }

  handleFullscreenSwitch({ flag = null }) {
    if (flag !== null) {
      this.setState({ isFullscreenMode: flag });
    } else {
      const invertedMode = !this.state.isFullscreenMode;
      this.setState({ isFullscreenMode: invertedMode });
    }
  }

  render() {
    return (
      <div
        className="main-content"
        style={{ opacity: this.state.loading ? '0.5' : '1' }}
      >
        <Fullscreen
          enabled={this.state.isFullscreenMode}
          onChange={this.onFullscreenChange}
        >
          <div
            className="canvas-wrapper"
            ref={(r) => {
              this.canvasWrapper = r;
            }}
          />
          <OverlayComponent Navigate={this.props.Navigate} />
        </Fullscreen>
      </div>
    );
  }
}

export default ViewPage;
