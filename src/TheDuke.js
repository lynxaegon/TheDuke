require("colony.config");
var CreepFactory = require("creeps.factory");

class TheDuke {
    handler() {
        if (!Memory.suspend && Game.cpu.bucket < 500) {
            Logger.warn("CPU bucket is critically low (" + Game.cpu.bucket + ") - suspending for 5 ticks!");
            Memory.suspend = 4;
            return;
        } else {
            if (Memory.suspend != undefined) {
                if (Memory.suspend > 0) {
                    Logger.info("Operation suspended for " + Memory.suspend + " more ticks.");
                    Memory.suspend -= 1;
                    return;
                } else {
                    delete Memory.suspend;
                }
            }
            this.loop();
        }
    }

    // Run phases
    loop() {
        this.initPhase();
        this.runPhase();
        this.visualsPhase();
    }

    initPhase() {
        // for (var name in Game.rooms) {
        //     Logger.info("Rooms", name);
        // }
        this.creeps = [];
        for(var i in CreepConfigs){
          this.creeps[i] = [];
        }

        var role;
        for (var name in Game.creeps) {
            if (Game.creeps[name].spawning) {
                continue;
            }
            role = Game.creeps[name].memory.role;
			if(!CreepTypes[role]){
				console.log("Invalid role '" + role + "'");
				continue;
			}
            this.creeps[role].push(new CreepTypes[role](Game.creeps[name]));
        }

        new CreepFactory(Game.spawns.Spawn1, this.creeps);
    }

    runPhase() {
        for (var i in this.creeps) {
            for (var j in this.creeps[i]) {
				// console.log("-------------- [start] " + this.creeps[i][j].api.name + "--------------");
                this.creeps[i][j].preExecute();
                this.creeps[i][j].execute();
                this.creeps[i][j].postExecute();
				// console.log("-------------- [end]" + this.creeps[i][j].api.name + "--------------");
            }
        }
    }

    visualsPhase() {

    }
}

module.exports = TheDuke;
