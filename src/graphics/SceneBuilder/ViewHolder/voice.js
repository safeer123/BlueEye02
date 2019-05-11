import { EventName } from "../../constants";
import EventEmitter from "../../lib/EventEmitter";
import Utils from "../../AppUtils";

const displaySummary = (title, displayOutList) => {
  EventEmitter.emit(EventName.DisplaySummaryRequest, {
    title,
    displayOutList,
    duration: 3
  });
};

const ViewNameCheck = viewNameList => (token, params) => {
  params.name = token;
  return Utils.OR(...viewNameList)(token);
};

const ViewIndexCheck = (token, params) => {
  const isPositiveNumber = Number.isFinite(+token) && +token >= 0;
  if (isPositiveNumber) {
    params.index = +token;
  }
  return isPositiveNumber;
};

const VoiceViewCmds = (switchView, getCurrentView, viewList) => {
  const shortNames = viewList.map(v => v.short.toLowerCase());
  return [
    {
      keys: ["switch", "view"],
      match: ["switch", "view"],
      action: () => {
        switchView({ step: 1 });
      }
    },
    {
      keys: ["list", "views"],
      match: ["list", "of", "views"],
      action: () => {
        const dispList = viewList.map(v => `${v.name}  (${v.short})`);
        displaySummary("List of views", dispList);
      }
    },
    {
      keys: ["switch", "to"],
      match: ["switch", "to", ViewNameCheck(shortNames)],
      action: ({ name }) => {
        const index = viewList.findIndex(v => v.short.toLowerCase() === name);
        if (index >= 0) {
          switchView({ index });
        }
      }
    },
    {
      keys: ["switch", "to", "view"],
      match: ["switch", "to", "view", ViewIndexCheck],
      action: ({ index }) => {
        if (index >= 0 && index < viewList.length) {
          switchView({ index: parseInt(index, 10) });
        }
      }
    },
    {
      keys: ["current", "view"],
      match: ["current", "view"],
      action: () => {
        const currView = getCurrentView();
        displaySummary("Current View", [
          `${currView.name} (${currView.short})`
        ]);
      }
    }
  ];
};

export { VoiceViewCmds };
