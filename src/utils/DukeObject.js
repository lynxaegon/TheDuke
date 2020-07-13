module.exports = class DukeObject {
    constructor(memory) {
        this.id = memory.id;
        this.api = Game.getObjectById(this.id);
    }

    isAlive() {
        return !!this.api;
    }

    dumpMemory() {
        return {};
    }
};