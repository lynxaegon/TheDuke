const BasicCreep = require("creeps.basic");
class Harvester extends BasicCreep {
    static get role() {
        return "harvester";
    }

    constructor() {
        super(...arguments);
    }

    execute() {
        if (this.isIdle()) {
            if (this.creep.carry.energy < this.creep.carryCapacity) {
                var sources = this.creep.room.find(FIND_SOURCES);
                if (sources.length) {
                    this.addState("move", {
                        target: sources[0].id
                    });
                    this.addState("harvest", {
                        target: sources[0].id
                    });
                }
            } else {
                if (Game.spawns['Spawn1'].energy == Game.spawns['Spawn1'].energyCapacity) {
                    this.addState("move", {
                        target: this.creep.room.controller.id
                    });
                    this.addState("upgradeController", {
                        target: this.creep.room.controller.id
                    });
                } else {
                    this.addState("move", {
                        target: Game.spawns['Spawn1'].id
                    });
                    this.addState("transfer", {
                        target: Game.spawns['Spawn1'].id
                    });
                }
            }
        }
        super.execute();
    }
}
module.exports = Harvester;