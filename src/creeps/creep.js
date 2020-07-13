module.exports = class Creep extends DukeObject {
    constructor(memory, opts) {
        super(memory, opts);

        this.name = memory.name || nanoid();
        this.oRoom = memory.oRoom || false;
        this.room = memory.room || false;

        if(this.isAlive()) {
            // original room created in
            this.oRoom = this.oRoom || this.api.room.name;
            this.room = this.api.room.name;
        }
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