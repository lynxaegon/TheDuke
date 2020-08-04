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

    constructor(memory, room) {
        super(memory, {
            room: {
                name: memory.room || room
            }
        });

        this.alive = false;

        this.id = memory.id || this.findFreePID();

        // will be changed to room object after task is assigned to room
        /** @type {{name: string}|DukeRoom} */
        this.room = memory.room || room;

        this.assigned = memory.assigned || [];
        for (let key in this.assigned) {
            this.assigned[key] = DukeObject.findById(this.assigned[key]);
            if (!this.assigned[key].isAlive()) {
                delete this.assigned[key];
                console.log("[Task]", "["+ Task.getTaskName() +"]", key, " died!");
            } else {
                this.assigned[key].setTask(this, true);
            }
        }

        if (this.id < 0) {
            throw new Error("Invalid pid! '" + this.id + "'")
        }

        this.alive = true;
    }

    getRequirements() {
        return [];
    }

    isAlive() {
        return this.alive;
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
        return Object.assign(result, this.config());
    }
};

module.exports.TASK_ERROR = -1;
module.exports.TASK_CONTINUE = 1;
module.exports.TASK_DONE = 0;
