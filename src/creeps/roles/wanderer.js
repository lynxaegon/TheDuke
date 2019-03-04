const BasicCreep = require("creeps.basic");
class Creep extends BasicCreep {
    static get config(){
      return {
        count: 5,
        parts: [MOVE],
        role: "wanderer"
      };
    }

    constructor() {
        super(...arguments);
    }

    plan() {
        this.getIntel();
        var room = this.getRandomRoom();
        var exit = this.api.pos.findClosestByRange(this.api.room.findExitTo(room))
        this.addState("moveXY", {
            x: exit.x,
            y: exit.y,
            r: exit.roomName,
            nextRoom: room
        });
		console.log("next", JSON.stringify({
            x: exit.x,
            y: exit.y,
            r: exit.roomName,
            nextRoom: room
        }));
    }

    getIntel() {
        const targets = this.api.room.find(FIND_HOSTILE_CREEPS);
        const spawns = this.api.room.find(FIND_HOSTILE_SPAWNS);

        Memory.intel.rooms[this.api.room.name] = {
            creeps: targets.length,
            spawns: spawns.length
        }
    }

    getRandomRoom() {
        var rooms = Object.values(Game.map.describeExits(this.api.room.name));
        rooms = _.filter(rooms, function(o) {
            return "W19S47" !== o;
        });
        return rooms[Math.floor(Math.random() * rooms.length)];
    }
}
module.exports = Creep;
