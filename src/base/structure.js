module.exports = class DukeStructure extends DukeObject {
    constructor(memory, api) {
        super(memory, api);

        this.type = memory.type || false;
        this.room = memory.room || false;

        if(this.isAlive()) {
            this.type = this.type || this.api.structureType;
            this.room = this.room || this.api.room.name;
        }
    }

    getResource(resource) {
        return this.api.store[resource] || 0;
    }

    getResourceCapacity(resource) {
        return this.api.store.getCapacity(resource) || 0;
    }

    dumpMemory() {
        let result = super.dumpMemory();
        return Object.assign(result, {
            type: this.type,
            room: this.room
        });
    }
};