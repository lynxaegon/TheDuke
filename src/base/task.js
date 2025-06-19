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

        if (this.id < 0) {
            throw new Error("Invalid pid! '" + this.id + "'")
        }

        this.alive = true;
    }

    assignRoom(room) {
        this.room = room;

        for (let key in this.assigned) {
            this.assigned[key] = this.room.getObjectById(this.assigned[key]);
            if (!this.assigned[key] || !this.assigned[key].isAlive()) {
                delete this.assigned[key];
                console.log("[Task]", "["+ DukeTask.getTaskName() +"]", key, " died!");
            } else {
                this.assigned[key].setTask(this, true);
            }
        }
    }

    assign(obj) {
        if(obj != null) {
            obj.setTask(this, false);
            this.assigned.push(obj);
        }
    }

    execute() {
        console.log("assigned", this.assigned.length);
        for(let obj of this.assigned) {
            obj.executeTask();
        }
    }

    finalize() {
        // override if necessary
    }

    rules() {
        return {};
    }

    // override
    isAlive() {
        console.log("Check if alive", this.alive)
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
        result.rules = this.extraRules;
        result.params = this.params;
        result.assigned = this.assigned.map(o => o.id);
        return Object.assign(this.config(), result);
    }
};

module.exports.TASK_ERROR = -1;
module.exports.TASK_CONTINUE = 1;
module.exports.TASK_DONE = 0;
