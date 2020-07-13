// usefull
/**\
 * OBSTACLE_OBJECT_TYPES:
 * ["spawn", "creep", "powerCreep", "source", "mineral",
 *  "deposit", "controller", "constructedWall", "extension",
 *  "link", "storage", "tower", "observer", "powerSpawn",
 *  "powerBank", "lab", "terminal", "nuker", "factory",
 *  "invaderCore"],
 */

const STATES = {

};

STATES[Colony.STATE_GROW] = {};

module.exports = class Room extends DukeObject {
    constructor(memory, api) {
        super(memory, api);

        this.spawns = [];
        this.controller = false;
        this.others = [];

        this.creeps = [];

        this.stateConfig = {};
    }

    /**
     * accessed via "Reflection"
     * @param creep
     */
    assignCreeps(creep) {
        this.creeps.push(creep);
    }

    /**
     * accessed via "Reflection"
     * @param structure
     */
    assignStructures(structure) {
        switch (structure.type) {
            case "spawn":
                this.spawns.push(structure);
                break;
            case "controller":
                if (this.controller) {
                    console.log("[Error] Double controller found in Room:", this.id);
                }
                this.controller = structure;
                break;
            default:
                this.others.push(structure);
        }
    }

    run(colony) {
        this.stateConfig = STATES[colony.state];
        this.runState();
    }

    runState() {
        this.checkEconomy();
        // this.checkTasks();
        // this.createNewTasks();
        // this.executeTasks();
        // this.finalizeTasks();
    }

    checkEconomy() {
        console.log("Energy:", this.getEnergy(),"/", this.getEnergyCapacity());
    }

    dumpMemory() {
        let result = super.dumpMemory();
        return Object.assign(result, {});
    }

    // functions
    getEnergy() {
        return this.spawns.reduce((acc, obj) => { return acc + obj.getResource(RESOURCE_ENERGY);}, 0);
    }
    getEnergyCapacity() {
        return this.spawns.reduce((acc, obj) => { return acc + obj.getResourceCapacity(RESOURCE_ENERGY);}, 0);
    }
};