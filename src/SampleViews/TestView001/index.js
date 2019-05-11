import {
  renderConfigNoLight,
  renderConfigLight,
  ViewHolder
} from "../../graphics";

import getNodes from "./nodes";
import { ViewList, ViewHolderId } from "./config";

// TestView001 ViewHolder (Smart Graphics Layer)
export default class TestView001 extends ViewHolder {
  // Construct canvas and webgl context
  constructor(wrapperElem) {
    super(wrapperElem);
    const {
      gl,
      shaderFac: { shaderPrograms }
    } = this;
    const inObj = {
      gl,
      programs: shaderPrograms,
      renderConfigLight,
      renderConfigNoLight
    };
    const nodeObj = getNodes(inObj);
    super.init(ViewHolderId, nodeObj, ViewList);
  }
}
