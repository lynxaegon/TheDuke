const nanoid = require("utils.nanoid");

class Factory {
    constructor() {
        Logger.info("Factory", Game.creeps.length);
        if (Object.keys(Game.creeps).length < 1) {
            Game.spawns.Spawn1.spawnCreep([MOVE, CARRY, WORK], nanoid(), {
                memory: {
                    role: Creep_Harvester.role
                }
            });
        }
    }
}
module.exports = Factory;
