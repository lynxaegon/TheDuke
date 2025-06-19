/**
 * @template T
 * @typedef {Object} CacheType
 * @property {(key: string, value: T) => void} set
 * @property {(key: string) => T} get
 * @property {(key: string) => boolean} has
 * @property {(key: string, fn: () => T) => T} retrieve
 * @property {() => void} gc
 */

/**
 * @template T
 */
class Cache {
  /**
   * @param {Object<string, T>} cacheStorage
   */
  constructor(cacheStorage) {
    /** @private */
    this._cache = cacheStorage;
  }
  /**
   * @param {string} key
   * @param {T} value
   */
  set(key, value) {
    this._cache[key] = value;
  }

  /**
   * @param {string} key
   * @returns {T}
   */
  get(key) {
    return this._cache[key];
  }

  /**
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return !!this._cache[key];
  }

  /**
   * @param {string} key
   * @param {() => T} fn
   * @returns {T}
   */
  retrieve(key, fn) {
    if (!this.has(key)) {
      this.set(key, fn());
    }
    return this.get(key);
  }

  gc() {
    this._cache = {};
  }
}

/**
 * @typedef {Object} CacheManager
 * @property {Cache<any>} disk
 * @property {Cache<any>} ram
 * @property {Cache<any>} tick
 * @property {(params?: Object) => string} getKey
 */

const ramCache = new Cache({});

/**
 * @param {Object<string, any>} memory
 * @returns {CacheManager}
 */
function InitCache(memory) {
  return {
    // kept in screeps memory
    disk: new Cache(memory),
    // kept in HEAP memory - clears every now and then
    ram: ramCache,
    // kept in HEAP memory - clears every tick
    tick: new Cache({}),
    getKey: (params) => {
      let stack = new Error().stack;
      let cacheKey = stack.split('\n')[2].trim();
      cacheKey = cacheKey.substr("at ".length);
      cacheKey = "/" + cacheKey.substr(0, cacheKey.indexOf("(")).trim();
      if (params) {
        for (let name in params) {
          cacheKey += "/" + name + ":" + params[name];
        }
      }
      return cacheKey;
    }
  }
}

module.exports = InitCache;