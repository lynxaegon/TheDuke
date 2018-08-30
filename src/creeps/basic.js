class BasicCreep {
    constructor(creep) {
        this.creep = creep;
        if (!this.creep.memory.pipeline) {
            this.creep.memory.pipeline = {
                states: [],
                params: []
            }
        }
        console.log("run super");
    }

    execute() {
        if (!this.creep.memory.state && this.creep.memory.pipeline.states.length > 0) {
            this.creep.memory.state = this.creep.memory.pipeline.states[0];
            this.creep.memory.stateParams = this.creep.memory.pipeline.params[0];
        }

        var target;

        switch (this.creep.memory.state) {
            case "move":
                Logger.info("Move creep", this.creep.memory.stateParams.x, this.creep.memory.stateParams.y, this.creep.memory.stateParams.target);
                if (this._isMoveByTarget()) {
                    Logger.info("By target");
                    target = Game.getObjectById(this.creep.memory.stateParams.target);
                    this.creep.moveTo(target);
                } else if (this._isMoveByPos()) {
                    Logger.info("By pos");
                    this.creep.moveTo(this.creep.memory.stateParams.x, this.creep.memory.stateParams.y);
                }
                this.creep.say("Moving to " + this.creep.memory.stateParams.nextRoom);
                break;
            case "harvest":
                target = Game.getObjectById(this.creep.memory.stateParams.target);
                if (target) {
                    this.creep.say("Harvesting...");
                    if (this.creep.harvest(target) == ERR_NOT_IN_RANGE) {
                        this.forceState(move, {
                            target: this.creep.memory.stateParams.target
                        }).execute();
                    }
                }
                break;
            case "transfer":
                target = Game.getObjectById(this.creep.memory.stateParams.target);
                this.creep.say("Transfering...");
                if (this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.forceState(move, {
                        target: this.creep.memory.stateParams.target
                    }).execute();
                }
                break;
            default:
                this.creep.say("Idle");
        }
    }

    cleanup() {
        var target;
        switch (this.creep.memory.state) {
            case "move":
                if (this._isMoveByTarget()) {
                    target = Game.getObjectById(this.creep.memory.stateParams.target);
                    var distance = Math.sqrt((this.creep.pos.x - target.pos.x) + (this.creep.pos.y - target.pos.y));
                    if (distance == 0) {
                        this.creep.say("arrived via target");
                        this.finishState();
                    }
                } else if (this._isMoveByPos()) {
                    if (this.creep.memory.stateParams.r !== this.creep.room.name) {
                        this.creep.say("arrived via diff room");
                        this.finishState();
                    } else if (this.creep.pos.x == this.creep.memory.stateParams.x && this.creep.pos.y == this.creep.memory.stateParams.y) {
                        this.creep.say("arrived via x,y");
                        this.finishState();
                    }
                } else {
                    this.creep.say("Invalid move state");
                    this.finishState();
                }
                break;
            case "harvest":
                if (this.creep.carry.energy < this.creep.carryCapacity) {
                    this.creep.say("Harvest compeleted");
                    this.finishState();
                }
                break;
            case "transfer":
                if (this.creep.carry.energy == 0) {
                    this.creep.say("Transfer compeleted");
                    this.finishState();
                }
                break;
            default:
                Logger.info("Creep", this.creep.name, "nothing to cleanup");
        }
    }

    forceState(state, params) {
        this.creep.memory.pipeline.states.unshift(state);
        this.creep.memory.pipeline.params.unshift(params);
        return this;
    }

    addState(state, params) {
        this.creep.memory.pipeline.states.push(state);
        this.creep.memory.pipeline.params.push(params);
        return this;
    }

    isIdle() {
        return this.creep.memory.pipeline.states.length == 0;
    }

    finishState() {
        if (this.creep.memory.pipeline.states.length > 0) {
            this.creep.memory.pipeline.states.pop();
            this.creep.memory.pipeline.params.pop();
        }
        delete this.creep.memory.state;
        delete this.creep.memory.params;
    }

    _isMoveByTarget() {
        if (this.creep.memory.stateParams.hasOwnProperty('target')) {
            return true;
        }
        return false;
    }
    _isMoveByPos() {
        if (this.creep.memory.stateParams.hasOwnProperty('x') && this.creep.memory.stateParams.hasOwnProperty('y')) {
            return true;
        }
        return false;
    }
    // memory: {
    //     get(path, obj) {
    //         obj = obj || this.creep.memory;
    //         path = path.split(".");
    //         for (var i in path) {
    //             obj = obj[path[i]]
    //         }
    //
    //         return obj;
    //     }
    //
    //     getParams(path, obj) {
    //         return this.get(path, obj);
    //     }
    //
    //
    // }
}

module.exports = BasicCreep;