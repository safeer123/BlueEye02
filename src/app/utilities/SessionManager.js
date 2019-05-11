class SessionManager {
  static updateValue(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  static getValue(key) {
    return JSON.parse(sessionStorage.getItem(key)) || null;
  }

  static clear(key) {
    sessionStorage.removeItem(key);
  }
}

export default SessionManager;

