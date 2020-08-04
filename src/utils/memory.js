const DBVersion = 2;
let HEAP = false;

// TODO: check if we should enable
// minor optimization atm (0.03 cpu)
let FEATURE_ENABLED__USE_HEAP_IF_POSSIBLE = false;

let TICK_FLAGS = {};

class DukeMemory {
    constructor() {
        this.state = {};
    }

    loadState(initCache) {
        if(FEATURE_ENABLED__USE_HEAP_IF_POSSIBLE){
            if(!HEAP) {
                console.log(" ==== HEAP CLEARED ==== ");
                this.__loadState(initCache);
            } else {
                console.log(" ==== USING HEAP ==== ");
            }
        }
        else {
            console.log(" ==== HEAP FEATURE DISABLED ==== ");
            this.__loadState(initCache);
        }
    }

    __loadState(initCache) {
        // noinspection JSAnnotator
        delete global.Memory;
        this.state = RawMemory.get();
        this.state = JSON.parse(this.state);

        if (!this.state._ || this.state._ > DBVersion) {
            // first time we init the memory
            RawMemory.set('');
            this.state = {};
        }

        if (!this.state._ || this.state._ < DBVersion) {
            // requires init
            this.state._ = DBVersion;

            this.state.creeps = {};
            this.state.structures = {};
            this.state.rooms = {};
            this.state.tasks = {};
            this.state.cache = {};
        }

        if(TICK_FLAGS.clearCache){
            this.state.cache = {};
            delete TICK_FLAGS.clearCache;
            console.log("======= cache cleared!");
        }

        global.Cache = initCache(this.state.cache);
        HEAP = true;
    }

    isPIDFree(pid) {
        return !!this.state.tasks[pid] == false ? true : false;
    }

    encodeId(s) {
        return s;
        // 5bbcab5f9099fc012e63362b -> 宼ꭟ邙ﰁ⹣㘫
        return s.split("-").map(function (a, b, c) {
            return a.split(/(\w{4})/).filter(Boolean).map(function (aa, bb, cc) {
                return String.fromCharCode(parseInt(aa, 16))
            }).join("");
        }).join("|");
    }


    decodeId(s) {
        return s;
        // 宼ꭟ邙ﰁ⹣㘫 -> 5bbcab5f9099fc012e63362b
        return s.split("|").map(function (a) {
            return a.split("").map(function (aa) {
                return String("0" + aa.charCodeAt(0).toString(16)).slice(-4)
            }).join("")
        }).join("-");
    }

    saveState() {
        RawMemory.set(JSON.stringify(this.state));
    }

    clearCache() {
        TICK_FLAGS.clearCache = true;
    }
}

module.exports = new DukeMemory();