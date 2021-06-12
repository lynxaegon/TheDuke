const DukeTask = require('base.task');

module.exports = class Task extends DukeTask {
    static getTaskName() {
        return "SpawnCreep";
    }

    static getTaskType() {
        return "FACTORY";
    }

    config() {
        return Object.assign(super.config(), {
            name: Task.getTaskName(),
            type: Task.getTaskType()
        });
    }

    rules() {
        return {
            required: {
                spawn: [
                    {
                        now: this.assigned.length,
                        max: 1
                    }
                ]
            }
        };
    }

    stateStart(creep, state) {

    }

    stateDone(creep, state) {

    }

    stateError(creep, state) {

    }

    /***
     *
     * @param {DukeStructure} structure
     * @returns object
     */
    fsm(structure) {
        return {
            init: "spawn",
            states: {
                "spawn": {
                    action: structure.api.spawnCreep,
                    params: [this.memory.params.parts],
                    onSuccess: {
                        next: "wait"
                    }
                },
                "wait": {
                    action: () => {
                        return !!structure.spawning;
                    },
                    onSuccess: {
                        next: this.finish
                    }
                }
            }
        };
    }
};