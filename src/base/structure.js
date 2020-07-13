module.exports = class Structure extends DukeObject {
    constructor(memory, api) {
        super(memory, api);

        this.type = memory.type || false;
        this.room = memory.room || false;

        if(this.isAlive()) {
            this.type = this.type || this.api.structureType;
            this.room = this.room || this.api.room.name;
        }
    }

    dumpMemory() {
        let result = super.dumpMemory();
        return Object.assign(result, {
            type: this.type,
            room: this.room
        });
    }
};