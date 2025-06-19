module.exports = class DukeObjectTaskExecutor extends DukeObject {
    constructor(memory, api) {
        super(memory, api)

        this.taskMemory = memory.task ? (memory.task.memory || {}) : {};
    }

    setTask(task, fromMemory) {
        this.task = task;
        this.taskMemory = fromMemory ? this.taskMemory : {};
    }

    executeTask() {
        // TODO: implement task execution and notify the task of the status
        let fsm = this.task.fsm(this)
        if(!this.taskMemory.state) {
            this.taskMemory.state = {
                id: fsm.init
            }
        }

        let task = fsm.states[this.taskMemory.state.id];
        let params = task.params ? task.params : [];
        let actionResult = task.action.apply(this, params)

        switch(actionResult) {
            case DukeTask.TASK_DONE:
                console.log("TASK_DONE")
                this.taskMemory.state.id = task.onSuccess.next;
                break;
            case DukeTask.TASK_ERROR:
                if(!task.onFail) {
                    console.log("TASK_ERROR w/o onFail:", this.task.config().name, "state:", JSON.safeStringify(task));
                    this.taskMemory.state.id = null;
                } else {
                    this.taskMemory.state.id = task.onFail.next;
                }
                break;
            case DukeTask.TASK_CONTINUE:
                console.log("TASK_CONTINUE")
                // do nothing
                break;
            default:
                if(!task.onFail) {
                    console.log("TASK_UNKOWN w/o onFail:", this.task.config().name, "state:", JSON.safeStringify(task));
                    this.taskMemory.state.id = null
                } else {
                    this.taskMemory.state.id = task.onFail.next
                }
        }

        // check if finished
        if(this.taskMemory.state.id == null) {
            this.task.alive = false;
            this.taskMemory = {}
            this.task = null
        }
    }

    memorize(result) {
        this.taskMemory = Object.assign(this.taskMemory, result);
    }

    dumpMemory() {
        let obj = {};
        if(this.task) {
            obj = {
                task: {
                    id: this.task.id,
                    memory: this.taskMemory
                }
            };
        }
        return obj;
    }
};