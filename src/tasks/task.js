let pid = 0;
let MAX_PID = 9999;

function generatePID() {
    pid += 1;
    if (pid > MAX_PID) {
        pid = 1;
    }
    return pid;
}

module.exports = class Task {
    static get PRIORITY_NORMAL() {
        return 0;
    }

    constructor(options) {
        if (!options.pid) {
            let count = 0;
            while (true) {
                count++;
                options.pid = generatePID();
                if (!Memory.tasks[pid])
                    break;
                if (count > MAX_PID) {
                    throw new Error("Could not find free pid! Cannot execute task", JSON.stringify(options));
                }
            }
        }

        this.options = Object.assign({
            pid: 0,
            name: "",
            rules: [],
            priority: Task.PRIORITY_NORMAL,
        }, options);
    }

    init() {
        if (!Memory.tasks[this.options.pid]) {
            Memory.tasks[this.options.pid] = {};
        }

        this.memory = Memory.tasks[this.options.pid];
    }

    end() {
        delete Memory.tasks[this.options.pid];
    }
};