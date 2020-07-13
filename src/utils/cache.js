class Cache {
  constructor(cacheStorage) {
    this._cache = cacheStorage;
  }
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
const ramCache = new Cache({});
module.exports = (memory) => {
    return {
      disk: new Cache(memory),
      ram: ramCache,
      tick: new Cache({}),
      getKey: (params) => {
        let stack = new Error().stack;
        let cacheKey = stack.split('\n')[2].trim();
        cacheKey = cacheKey.substr("at ".length);
        cacheKey = "/" + cacheKey.substr(0, cacheKey.indexOf("(")).trim();
        if (params) {
          for(let name in params){
            cacheKey += "/" + name + ":" + params[name];
          }
        }
        return cacheKey;
      }
    }
};
