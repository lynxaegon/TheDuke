let pid = 0;
let MAX_PID = 9999;

function generatePID() {
    pid += 1;
    if (pid > MAX_PID) {
        pid = 1;
    }
    return pid;
}

module.exports = class Task extends DukeObject {
    config() {
        return {
            name: "BasicTask",
            type: 0,
            assigned: [],
            states: {}
        }
    }

    constructor(memory, api) {
        super(memory, api);

        this.alive = false;

        this.id = memory.id || this.findFreePID();
        this.assigned = memory.assigned;
        for (let key in this.assigned) {
            this.assigned[key] = DukeObject.findById(this.assigned[key]);
            if (!this.assigned[key].isAlive()) {
                console.log("[Task]", key, " died!");
            }
        }

        if (this.id < 0) {
            throw new Error("Invalid pid! '" + this.id + "'")
        }

        this.alive = true;
    }

    isAlive() {
        return false;
        return this.alive;
    }

    next(stateID) {

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
        return Object.assign(result, this.config());
    }
};