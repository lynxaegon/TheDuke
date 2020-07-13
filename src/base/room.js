const STATES = {};

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

    assignCreeps(creep) {
        this.creeps.push(creep);
    }

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
        // this.checkTasks();
        // this.createNewTasks();
        // this.executeTasks();
        // this.finalizeTasks();
    }

    dumpMemory() {
        let result = super.dumpMemory();
        return Object.assign(result, {});
    }
};