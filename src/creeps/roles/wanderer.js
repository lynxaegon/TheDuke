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
        var exit = this.api.pos.findClosestByRange(this.api.room.findExitTo(room));
        this.addState("moveXY", {
            x: exit.x,
            y: exit.y,
            r: room
        });
        console.log("wanderer planning");
    }

    getIntel() {
    	if(!Memory.intel.rooms[this.api.room.name]) {
			var usage = Game.cpu.getUsed();
			const targets = this.api.room.find(FIND_HOSTILE_CREEPS);
			const spawns = this.api.room.find(FIND_HOSTILE_SPAWNS);

			Memory.intel.rooms[this.api.room.name] = {
				creeps: targets.length,
				spawns: spawns.length
			};
			usage = Game.cpu.getUsed() - usage;
			console.log("[Wanderer]["+this.api.name+"]", "gathering intel", "used cpu:", usage);
		}
    }

    getRandomRoom() {
    	var rooms = [];
    	if(Memory.rooms[this.api.room.name]){
    		rooms = Memory.rooms[this.api.room.name].exits;
		} else {
			rooms = Object.values(Game.map.describeExits(this.api.room.name));
			Memory.rooms[this.api.room.name] = {
				exits: rooms
			};
		}
        return rooms[Math.floor(Math.random() * rooms.length)];
    	// creates recursion if on the same tick
        // return rooms[Game.time % rooms.length];
    }
}
module.exports = Creep;
