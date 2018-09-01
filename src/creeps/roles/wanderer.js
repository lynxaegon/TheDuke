const BasicCreep = require("creeps.basic");
class Wanderer extends BasicCreep {
    static get role() {
        return "wanderer";
    }

    constructor() {
        super(...arguments);
    }

    execute() {
        if (!this.creep.memory.state) {
            this.getIntel();
            var room = this.getRandomRoom();
            var exit = this.creep.pos.findClosestByRange(this.creep.room.findExitTo(room))
            this.addState("move", {
                x: exit.x,
                y: exit.y,
                r: exit.roomName,
                nextRoom: room
            });
        }
        super.execute();
    }

    getIntel() {
        const targets = this.creep.room.find(FIND_HOSTILE_CREEPS);
        const spawns = this.creep.room.find(FIND_HOSTILE_SPAWNS);

        Memory.intel.rooms[this.creep.room.name] = {
            creeps: targets.length,
            spawns: spawns.length
        }
    }

    getRandomRoom() {
        var rooms = Object.values(Game.map.describeExits(this.creep.room.name));
        rooms = _.filter(rooms, function(o) {
            return "W19S47" !== o;
        });
        return rooms[Math.floor(Math.random() * rooms.length)];
    }
}
module.exports = Wanderer;