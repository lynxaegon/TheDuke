const nanoid = require("utils.nanoid");
const SpawnErrors = {
  "0": "OK",
  "-1": "ERR_NOT_OWNER",
  "-3": "ERR_NAME_EXISTS",
  "-4": "ERR_BUSY",
  "-6": "ERR_NOT_ENOUGH_ENERGY",
  "-10": "ERR_INVALID_ARGS",
  "-14": "ERR_RCL_NOT_ENOUGH"
}

class Factory {
    constructor(creeps) {
      for(var i in CreepConfigs){
        console.log(i, creeps[i].length + " / " + CreepConfigs[i].count)
        if(CreepConfigs[i].count > 0 && creeps[i].length < CreepConfigs[i].count){
          this.spawnCreep(CreepConfigs[i]);
        }
      }
    }

    spawnCreep(config){
      var result = Game.spawns.Spawn1.spawnCreep(config.parts, nanoid(), {
          memory: {
              role: config.role
          }
      });
      console.log("spawning", config.parts, "result:", SpawnErrors[result]);
    }
}
module.exports = Factory;
