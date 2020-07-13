module.exports = class DukeObject {
    static findById(id) {
        if(!Cache.tick.has("go/"+ id))
            Cache.tick.set("go/"+ id, Game.getObjectById(id));
        return Cache.tick.get("go/"+ id);
    }

    constructor(memory, hasApi) {
        this.id = memory.id;

        if(hasApi)
            this.api = DukeObject.findById(this.id);
    }

    isAlive() {
        return !!this.api;
    }

    dumpMemory() {
        return {};
    }
};