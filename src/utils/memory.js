class Mem {
    // initialize memory
    format() {
        if (!Memory.intel) {
            Memory.intel = {
                rooms: {}
            };
        }
    }

    // cleanup stale memory
    gc() {
        for (var i in Memory.creeps) {
            if (!Game.creeps[i]) {
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
