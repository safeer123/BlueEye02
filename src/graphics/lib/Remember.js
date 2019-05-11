class Remember {
  static set(key, value) {
    if (typeof key === "string") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  static get(key) {
    if (typeof key === "string") {
      const valStr = localStorage.getItem(key);
      return JSON.parse(valStr);
    }
    return null;
  }

  static forget(key) {
    if (typeof key === "string") {
      localStorage.removeItem(key);
    }
  }
}

export default Remember;
