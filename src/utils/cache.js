class Cache {
  set(key, value) {
    this._cache[key] = value;
  }

  get(key, value) {
    return this._cache[key];
  }

  has(key) {
    return !!this._cache[key];
  }

  gc() {
    this._cache = {};
  }
}

module.exports = new Cache();
