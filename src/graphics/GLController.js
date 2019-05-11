export default class GLController {
  constructor(wrapperDiv, ViewHolderClass) {
    // List of views we are going to build
    this.viewList = [];
    this.viewList.push(new ViewHolderClass(wrapperDiv));
  }

  clearAll() {
    this.viewList.forEach(view => {
      view.clear();
    });
  }

  onResize(done) {
    this.viewList.forEach(view => {
      view.onResize();
      view.createScene();
    });
    if (done) done();
  }

  handleGesture(gestureType, event) {
    this.viewList.forEach(view => {
      if (view.handleGesture) {
        view.handleGesture(gestureType, event);
      }
    });
  }
}
