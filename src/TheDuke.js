var CreepFactory = require("creeps.factory");
global.Creep_Wanderer = require("creeps.roles.wanderer");
global.Creep_Harvester = require("creeps.roles.harvester");
global.Creep_Upgrader = require("creeps.roles.upgrader");

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
        this.creeps = {};

        for (var name in Game.creeps) {
            if (Game.creeps[name].spawning) {
                continue;
            }

            switch (Game.creeps[name].memory.role) {
                case Creep_Wanderer.role:
                    if (!this.creeps[Creep_Wanderer.role])
                        this.creeps[Creep_Wanderer.role] = [];

                    this.creeps[Creep_Wanderer.role].push(new Creep_Wanderer(Game.creeps[name]));
                    break;
                case Creep_Upgrader.role:
                    if (!this.creeps[Creep_Upgrader.role])
                        this.creeps[Creep_Upgrader.role] = [];

                    this.creeps[Creep_Upgrader.role].push(new Creep_Upgrader(Game.creeps[name]));
                    break;
                case Creep_Harvester.role:
                    if (!this.creeps[Creep_Harvester.role])
                        this.creeps[Creep_Harvester.role] = [];

                    this.creeps[Creep_Harvester.role].push(new Creep_Harvester(Game.creeps[name]));
                    break;
            }
        }

        new CreepFactory(this.creeps);

    }

    runPhase() {
        for (var i in this.creeps) {
            for (var j in this.creeps[i]) {
                this.creeps[i][j].execute();
                this.creeps[i][j].cleanup();
            }
        }
    }

    visualsPhase() {

    }
}

module.exports = TheDuke;