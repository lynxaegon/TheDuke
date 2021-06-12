let pid = 0;
let MAX_PID = 9999;

function generatePID() {
    pid += 1;
    if (pid > MAX_PID) {
        pid = 1;
    }
    return pid;
}

module.exports = class DukeTask extends DukeObject {
    static getTaskName() {
        return "UndefinedTaskName";
    }

    static getTaskType() {
        return "UndefinedTaskType";
    }

    config() {
        return {
            name: DukeTask.getTaskName(),
            type: DukeTask.getTaskType(),
            assigned: []
        }
    }

    constructor(memory, room, rules) {
        super(memory, {
            room: {
                name: memory.room || room
            }
        });
        rules = rules || {};

        this.alive = false;

        this.id = memory.id || this.findFreePID();
        this.extraRules = memory.rules || rules;
        this.params = memory.params || {};
        // will be changed to room object after task is assigned to room
        /** @type {{name: string}|DukeRoom} */
        this.room = memory.room || room;

        this.assigned = memory.assigned || [];
        for (let key in this.assigned) {
            this.assigned[key] = DukeObject.findById(this.assigned[key]);
            if (!this.assigned[key].isAlive()) {
                delete this.assigned[key];
                console.log("[Task]", "["+ DukeTask.getTaskName() +"]", key, " died!");
            } else {
                this.assigned[key].setTask(this, true);
            }
        }

        if (this.id < 0) {
            throw new Error("Invalid pid! '" + this.id + "'")
        }

        this._finished = false;
        this.alive = true;
    }

    rules() {
        return {};
    }

    isAlive() {
        return this.alive;
    }

    isDone() {
        return this._finished;
    }

    finish() {
        this._finished = true;
    }

    findFreePID() {
        let count = 0;
        while (true) {
            count++;
            pid = generatePID();
            if (DukeMemory.isPIDFree(pid)) {
                console.log("Found pid in", count, "counts", "pid", pid);
                return pid;
            }
            if (count > MAX_PID) {
                console.log("PID Not found in", count, "counts");
                break;
            }
        }
        return -1;
    }

    dumpMemory() {
        let result = super.dumpMemory();
        result.id = this.id;
        result.room = this.room.id;
        result.rules = this.extraRules;
        result.params = this.params;
        return Object.assign(result, this.config());
    }
};

module.exports.TASK_ERROR = -1;
module.exports.TASK_CONTINUE = 1;
module.exports.TASK_DONE = 0;
