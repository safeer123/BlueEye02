import React from "react";
import CustomPopover from "../CustomPopover";
import { EventEmitter, EventName } from "../../";
import "./index.css";

const OVERLAY0 = "OVERLAY0";
const OVERLAY1 = "OVERLAY1";

const DefaultItems = [];
/*
[
  { text: "(theta: 0.0, phi: 13.89)", key: 0 },
  { text: "(X:1.2, Y:34.0, Z:92.19)", key: 1 }
];
*/

class MessagePane extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pairMode: false,
      padding: 50,
      overlays: {
        [OVERLAY0]: {
          visible: false,
          expiryTime: new Date(),
          displayItemList: DefaultItems,
          defaultClass: "msg-default",
          highlightClass: ""
        },
        [OVERLAY1]: {
          visible: false,
          expiryTime: new Date(),
          displayItemList: DefaultItems,
          defaultClass: "summary-default",
          highlightClass: ""
        }
      }
    };

    EventEmitter.on(
      EventName.DisplayOutRequest,
      ({ displayOutList, duration }) =>
        this.launchOverlay(OVERLAY0, displayOutList, duration)
    );

    EventEmitter.on(
      EventName.DisplaySummaryRequest,
      ({ title, displayOutList, duration }) =>
        this.launchOverlay(OVERLAY1, displayOutList, duration, title)
    );

    EventEmitter.on(EventName.TogglePairMode, this.togglePairMode);
    EventEmitter.on(EventName.HighlightMessage, this.highlight);
  }

  getOverlaysContent = () => {
    const { overlays } = this.state;
    return (
      <React.Fragment>
        {[OVERLAY0, OVERLAY1].map(Overlay => (
          <CustomPopover {...overlays[Overlay]} />
        ))}
      </React.Fragment>
    );
  };

  // launch Overlay
  launchOverlay(Overlay, displayOutList, duration = 2, title) {
    const now = new Date();
    const expiryTime = now.setSeconds(now.getSeconds() + duration);
    const overlayState = {
      ...this.state.overlays[Overlay],
      visible: true,
      expiryTime,
      displayItemList: [],
      title
    };
    if (displayOutList && displayOutList.length > 0) {
      displayOutList.forEach((str, index) => {
        overlayState.displayItemList.push({ text: str, key: index });
      });
    }
    this.setState({
      overlays: {
        ...this.state.overlays,
        [Overlay]: overlayState
      }
    });
    setTimeout(() => {
      const expTime = this.state.overlays[Overlay].expiryTime;
      if (new Date() > expTime) {
        this.setState({
          overlays: {
            ...this.state.overlays,
            [Overlay]: {
              ...this.state.overlays[Overlay],
              visible: false,
              displayItemList: [],
              expiryTime: expTime,
              highlightClass: "",
              title: undefined
            }
          }
        });
      }
    }, (duration + 1) * 1000);
  }

  togglePairMode = obj => {
    let pairMode;
    if (obj && typeof obj.mode !== "undefined") {
      pairMode = obj.mode;
    } else {
      pairMode = !this.state.pairMode;
    }
    this.setState({
      pairMode,
      overlays: {
        ...this.state.overlays,
        [OVERLAY0]: {
          ...this.state.overlays[OVERLAY0],
          defaultClass: pairMode ? "msg-center" : "msg-default"
        },
        [OVERLAY1]: {
          ...this.state.overlays[OVERLAY1],
          defaultClass: pairMode ? "summary-center" : "summary-default"
        }
      }
    });
  };

  highlight = highlightTag => {
    this.setState({
      overlays: {
        ...this.state.overlays,
        [OVERLAY0]: {
          ...this.state.overlays[OVERLAY0],
          highlightClass: highlightTag
        }
      }
    });
  };

  render() {
    const { pairMode, padding } = this.state;

    if (pairMode) {
      return (
        <React.Fragment>
          <div className="half-area" style={{ paddingLeft: `${padding}px` }}>
            {this.getOverlaysContent("msg-center")}
          </div>
          <div className="half-area" style={{ paddingRight: `${padding}px` }}>
            {this.getOverlaysContent("msg-center")}
          </div>
        </React.Fragment>
      );
    }
    return this.getOverlaysContent("msg-default");
  }
}

export default MessagePane;
