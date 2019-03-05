class Mem {
    // initialize memory
    format() {
        if (!Memory.intel) {
            Memory.intel = {
                rooms: {}
            };
        }

		if (!Memory.rooms) {
			Memory.rooms = {};
		}

		if(!Memory._grafana_stats){
        	Memory._grafana_stats = {
        		creeps: {}
			};
		}
    }

    // cleanup stale memory
    gc() {
        for (var i in Memory.creeps) {
            if (!Game.creeps[i]) {
				if(Memory._grafana_stats && Memory._grafana_stats.creeps)
                	delete Memory._grafana_stats.creeps[Memory.creeps[i].role][i];
				delete Memory.creeps[i];
            }
        }

        if (Game.time % 300) {
            if (Memory.intel) {
                for (var i in Memory.intel.rooms) {}
            }
        }
    }
}

module.exports = new Mem();
