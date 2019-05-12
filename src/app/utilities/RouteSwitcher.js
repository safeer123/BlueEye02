let history;
class RouteSwitcher {
  static setHistory(router) {
    if (!history) {
      history = router;
    }
  }

  static getHistory() {
    return history;
  }
}

export default RouteSwitcher;