const BasicCreep = require("creeps.basic");
class Creep extends BasicCreep {
  static get config() {
    return {
      parts: [MOVE, MOVE, CARRY, WORK],
      role: "harvester"
    };
  }

  constructor() {
    super(...arguments);
  }

  plan() {
    var target;
    if (this.api.carry.energy < this.api.carryCapacity) {
      var sources = this.room.getEnergySources();
      if (sources.length) {
        target = sources[Game.time % sources.length];
        this.addState("moveToTarget", {
          target: target.id
        });
        this.addState("harvest", {
          target: target.id
        });
      }
    } else {
      if (Game.spawns['Spawn1'].energy == Game.spawns['Spawn1'].energyCapacity) {
        this.addState("moveToTarget", {
          target: this.api.room.controller.id
        });
        this.addState("upgradeController", {
          target: this.api.room.controller.id
        });
      } else {
        this.addState("moveToTarget", {
          target: Game.spawns['Spawn1'].id
        });
        this.addState("transfer", {
          target: Game.spawns['Spawn1'].id
        });
      }
    }
  }
}
module.exports = Creep;
