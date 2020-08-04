module.exports = class DukeCreep extends DukeObject {
    constructor(memory, api) {
        super(memory, api);

        this.name = memory.name || nanoid();
        this.oRoom = memory.oRoom || false;
        this.room = memory.room || false;

        this.taskMemory = memory.task ? (memory.task.memory || {}) : {};

        if(this.isAlive()) {
            // original room created in
            this.oRoom = this.oRoom || this.api.room.name;
            this.room = this.api.room.name;
        }
    }

    isFree() {
        return !this.api.spawning;
    }

    setTask(task, fromMemory) {
        this.task = task;
        this.taskMemory = fromMemory ? this.taskMemory : {};
    }

    executeTask() {
        // TODO: implement task execution and notify the task of the status
    }

    memorize(result) {
        this.taskMemory = Object.assign(this.taskMemory, result);
    }

    dumpMemory() {
        let result = super.dumpMemory();
        return Object.assign(result, {
            name: this.name,
            room: this.room.name,
            oRoom: this.oRoom,
            task: {
                id: this.task.id,
                memory: this.taskMemory
            }
        });
    }

    ///////////////////////////
    getEnergySource() {
        this.taskMemory.source = this.room.getFreeSource(true);
        if(this.taskMemory.source) {
            return DukeTask.TASK_DONE;
        }

        return DukeTask.TASK_ERROR;
    }

    moveToTarget(target) {
        if(!this.taskMemory.sourcePath) {
            let source = DukeObject.findById(target);
            this.taskMemory.sourcePath = source.room.pos.toWorldPosition().findPathToWorldPosition(this.api.pos.toWorldPosition());
            console.log("Path to source["+target+"]",this.taskMemory.sourcePath)
        }
        return DukeTask.TASK_CONTINUE;
    }
};

module.exports.PARTS = {
    MOVE: "move",
    WORK: "work",
    CARRY: "carry",
    ATTACK: "attack",
    RANGED_ATTACK: "ranged_attack",
    TOUGH: "tough",
    HEAL: "heal",
    CLAIM: "claim"
};