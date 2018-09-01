const nanoid = require("utils.nanoid");

class Factory {
    constructor(creeps) {
        if (!creeps[Creep_Wanderer.role] || creeps[Creep_Wanderer.role].length < 5) {
            Game.spawns.Spawn1.spawnCreep([MOVE], nanoid(), {
                memory: {
                    role: Creep_Wanderer.role
                }
            });
        }

        if (!creeps[Creep_Upgrader.role] || creeps[Creep_Upgrader.role].length < 1) {
            Game.spawns.Spawn1.spawnCreep([MOVE, CARRY, WORK], nanoid(), {
                memory: {
                    role: Creep_Upgrader.role
                }
            });
        }

        if (!creeps[Creep_Harvester.role] || creeps[Creep_Harvester.role].length < 1) {
            Game.spawns.Spawn1.spawnCreep([MOVE, CARRY, WORK], nanoid(), {
                memory: {
                    role: Creep_Harvester.role
                }
            });
        }
    }
}
module.exports = Factory;