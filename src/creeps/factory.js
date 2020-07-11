const nanoid = require("utils.nanoid");
const SpawnErrors = {
  "0": "OK",
  "-1": "ERR_NOT_OWNER",
  "-3": "ERR_NAME_EXISTS",
  "-4": "ERR_BUSY",
  "-6": "ERR_NOT_ENOUGH_ENERGY",
  "-10": "ERR_INVALID_ARGS",
  "-14": "ERR_RCL_NOT_ENOUGH"
};

const PartCost = {
  MOVE: 50,
  WORK: 100,
  CARRY: 50,
  ATTACK: 80,
  RANGED_ATTACK: 150,
  HEAL: 250,
  TOUGH: 10,
  CLAIM: 600
};

class Factory {
  constructor(spawn) {
    this.spawn = spawn;
  }

  build(creepConfig) {
    if (this.isBusy()) {
      console.log("[Factory][" + this.spawn.name + "] is busy!");
      return false;
    }

    if (this.canSpawnCreep(creepConfig.parts)) {
      this.spawnCreep(creepConfig);
    }

    return true;
  }

  spawnCreep(config) {
    var result = this.spawn.spawnCreep(config.parts, nanoid(), {
      memory: {
        role: config.role
      }
    });
    console.log("[Factory][" + this.spawn.name + "]", JSON.stringify(config.parts), "result:", SpawnErrors[result]);
  }

  isBusy() {
    return !!this.spawn.spawning;
  }

  canSpawnCreep(parts) {
    var cost = Factory.calculateCreepCost(parts);
    console.log("[Factory] Can Spawn ", JSON.stringify(parts), "COST:", cost, "has energy:", this.spawn.energy >= cost);
    if (this.spawn.energy >= cost)
      return true;

    return false;
  }

  static calculateCreepCost(parts) {
    var cost = 0;
    for (var i in parts) {
      cost += PartCost[parts[i].toUpperCase()];
    }

    return cost;
  }
}
module.exports = Factory;
