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
    constructor(spawn, creeps) {
		this.spawn = spawn;
		if(this.isBusy()){
			console.log("[Factory]["+this.spawn.name+"] is busy!");
			return;
		}

		for(var i in CreepConfigs){
			console.log(i, creeps[i].length + " / " + CreepConfigs[i].count)
			if(CreepConfigs[i].count > 0 && creeps[i].length < CreepConfigs[i].count){
				if(this.canSpawnCreep())
					this.spawnCreep(CreepConfigs[i]);
			}
		}
    }

    spawnCreep(config){
      var result = this.spawn.spawnCreep(config.parts, nanoid(), {
          memory: {
              role: config.role
          }
      });
      console.log("[Factory]["+this.spawn.name+"]",JSON.stringify(config.parts), "result:", SpawnErrors[result]);
    }

	isBusy() {
		return !!this.spawn.spawning;
	}

	canSpawnCreep(parts){
		var cost = this._calculateCreepCost(parts);
		if(this.spawn.energy >= cost)
			return true;

		return false;
	}

	_calculateCreepCost(parts){
		var cost = 0;
		for(var i in parts){
			cost += PartCost[parts[i]];
		}

		return cost;
	}
}
module.exports = Factory;
