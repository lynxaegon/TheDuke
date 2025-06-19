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
                    action: (body, name) => {
                        if(structure.api.spawnCreep(body, name) == OK) {
                            return DukeTask.TASK_DONE;
                        }
                        return DukeTask.TASK_ERROR;
                    },
                    params: [this.params.parts, nanoid()],
                    onSuccess: {
                        next: "wait"
                    }
                },
                "wait": {
                    action: () => {
                        return !!structure.spawning;
                    },
                    onSuccess: {
                        next: null
                    }
                }
            }
        };
    }
};