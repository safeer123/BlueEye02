import SplitScreenView from "./SplitScreenView";
import SingleNodeView from "./SingleNodeView";
import OneEyeView from "./OneEyeView";
import TwoEyesView from "./TwoEyesView";

const ViewHolderId = "9AJ77D99FLLMOI";

const ViewList = [
  {
    id: 1,
    name: "Single Node View",
    short: "SNV",
    canvasViewClass: SingleNodeView
  },
  {
    id: 0,
    name: "VR View",
    short: "VR",
    canvasViewClass: TwoEyesView
  },
  {
    id: 2,
    name: "Split Screen View",
    short: "SSV",
    canvasViewClass: SplitScreenView
  },
  {
    id: 3,
    name: "One Eye View",
    short: "OEV",
    canvasViewClass: OneEyeView
  }
];

export { ViewList, ViewHolderId };
