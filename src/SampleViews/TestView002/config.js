import SingleNodeView from "./SingleNodeView";
import OneEyeView from "./OneEyeView";
import TwoEyesView from "./TwoEyesView";
import TwoByTwoView from "./TwoByTwoView";

const ViewHolderId = "XA098D12G1000TK";

const ViewList = [
  {
    id: 2,
    name: "Single Node View",
    short: "SNV",
    canvasViewClass: SingleNodeView
  },
  {
    id: 1,
    name: "VR View",
    short: "VR",
    canvasViewClass: TwoEyesView
  },
  {
    id: 3,
    name: "One Eye View",
    short: "OEV",
    canvasViewClass: OneEyeView
  },
  {
    id: 0,
    name: "Two By Two",
    short: "2X2",
    canvasViewClass: TwoByTwoView
  }
];

export { ViewList, ViewHolderId };
