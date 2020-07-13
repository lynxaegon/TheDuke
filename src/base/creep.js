module.exports = class Creep extends DukeObject {
    constructor(memory, api) {
        super(memory, api);

        this.name = memory.name || nanoid();
        this.oRoom = memory.oRoom || false;
        this.room = memory.room || false;

        if(this.isAlive()) {
            // original room created in
            this.oRoom = this.oRoom || this.api.room.name;
            this.room = this.api.room.name;
        }
    }

    isFree() {
        return !this.api.spawning;
    }

    dumpMemory() {
        let result = super.dumpMemory();
        return Object.assign(result, {
            name: this.name,
            room: this.room,
            oRoom: this.oRoom
        });
    }
};