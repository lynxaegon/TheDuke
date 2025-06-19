module.exports = class DukeCreep extends DukeObjectTaskExecutor {
    constructor(memory, api) {
        super(memory, api);

        this.name = memory.name || nanoid();
        this.oRoom = memory.oRoom || false;
        this.room = memory.room || false;

        if(this.isAlive()) {
            // original room created in
            this.oRoom = this.oRoom || this.api.room.name;
            this.room = this.api.room.name;
        }
    }

    isFree() {
        return !this.api.spawning;
    }


    isType(type) {
        for(let t of type) {
            let found = false;
            for(let part of this.api.body) {
                if(part.type == t) {
                    found = true;
                    break;
                }
            }
            if(!found)
                return false;
        }

        return true;
    }

    dumpMemory() {
        let result = super.dumpMemory();
        return Object.assign(result, {
            name: this.name,
            room: this.room.name,
            oRoom: this.oRoom
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
            if(!source) {

            }
            this.taskMemory.sourcePath = source.pos.toWorldPosition().findPathToWorldPosition(this.api.pos.toWorldPosition());
        }
        console.log("Path to source["+target+"]", JSON.stringify(this.taskMemory.sourcePath));
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