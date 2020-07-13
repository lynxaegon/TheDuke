module.exports = class Colony {
    static get STATE_GROW() {
        return 1;
    };
    constructor(creeps, structures, rooms) {
        this.creeps = creeps;
        this.structures = structures;
        this.rooms = rooms;

        this.state = Colony.STATE_GROW;
    }

    announceDead(creeps, structures, rooms) {
         console.log("Creeps Died:", creeps.length);
         console.log("Structures Died:", structures.length);
         console.log("Rooms Died:", rooms.length);
    }

    run() {
        for(let room of this.rooms) {
            room.run(this);
        }
    }
};