class BasicCreep {
    constructor(creep) {
        this.creep = creep;
        if (!this.creep.memory.pipeline) {
            this.creep.memory.pipeline = {
                states: [],
                params: []
            }
        }
    }

    execute(forced) {
        if (this.creep.memory.pipeline.states.length > 10) {
            Logger.info("too many states queued...");
            return;
        }
        if (!this.creep.memory.state && this.creep.memory.pipeline.states.length > 0) {
            this.creep.memory.state = this.creep.memory.pipeline.states[0];
            this.creep.memory.stateParams = this.creep.memory.pipeline.params[0];
        }

        var target;

        switch (this.creep.memory.state) {
            case "move":
                if (!this.creep.memory.stateParams.lastPos) {
                    this.creep.memory.stateParams.lastPos = {
                        x: this.creep.pos.x,
                        y: this.creep.pos.y
                    }
                } else {
                    if (this.creep.memory.stateParams.lastPos.x == this.creep.pos.x && this.creep.memory.stateParams.lastPos.y == this.creep.pos.y) {
                        this.finishState();
                        break;
                    }
                }
                if (this._isMoveByTarget()) {
                    target = Game.getObjectById(this.creep.memory.stateParams.target);
                    if (this.creep.moveTo(target, {
                            noPathFinding: true
                        }) == ERR_NOT_FOUND) {
                        this.creep.moveTo(target);
                    }
                } else if (this._isMoveByPos()) {
                    if (this.creep.moveTo(this.creep.memory.stateParams.x, this.creep.memory.stateParams.y, {
                            noPathFinding: true
                        }) == ERR_NOT_FOUND) {
                        this.creep.moveTo(this.creep.memory.stateParams.x, this.creep.memory.stateParams.y);
                    }
                }
                break;
            case "harvest":
                target = Game.getObjectById(this.creep.memory.stateParams.target);
                if (target) {
                    this.creep.say("Harvesting...");
                    if (this.creep.harvest(target) == ERR_NOT_IN_RANGE) {
                        this.forceState("move", {
                            target: this.creep.memory.stateParams.target
                        });
                    }
                }
                break;
            case "transfer":
                target = Game.getObjectById(this.creep.memory.stateParams.target);
                this.creep.say("Transfering...");
                var t = this.creep.transfer(target, RESOURCE_ENERGY);
                if (this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.forceState("move", {
                        target: this.creep.memory.stateParams.target
                    })
                }
                break;
            case "upgradeController":
                target = Game.getObjectById(this.creep.memory.stateParams.target);
                this.creep.say("Upgrading...");
                if (this.creep.room.controller.sign.username !== "LynxAegon") {
                    this.creep.signController(target, "Q: How did the hipster burn his tongue? A: He drank his coffee before it was cool.");
                }
                this.creep.upgradeController(target);
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
                    if (this.creep.pos.inRangeTo(target, 1)) {
                        this.creep.say("via target");
                        this.finishState();
                    }
                } else if (this._isMoveByPos()) {
                    if (this.creep.memory.stateParams.r !== this.creep.room.name) {
                        this.creep.say("diff room");
                        this.finishState();
                    } else if (this.creep.pos.x == this.creep.memory.stateParams.x && this.creep.pos.y == this.creep.memory.stateParams.y) {
                        this.creep.say("via x,y");
                        this.finishState();
                    }
                } else {
                    this.creep.say("Invalid move state");
                    this.finishState();
                }
                break;
            case "harvest":
                if (this.creep.carry.energy == this.creep.carryCapacity) {
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
            case "upgradeController":
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
        Logger.info("forced state", state);
        params['tick'] = Game.time;
        this.creep.memory.pipeline.states.unshift(state);
        this.creep.memory.pipeline.params.unshift(params);

        this.clearCurrentState();

        return this;
    }

    addState(state, params) {
        params['tick'] = Game.time;
        this.creep.memory.pipeline.states.push(state);
        this.creep.memory.pipeline.params.push(params);
        return this;
    }

    isIdle() {
        return this.creep.memory.pipeline.states.length == 0;
    }

    peekState() {
        if (this.creep.memory.pipeline.states.length > 0) {
            return this.creep.memory.pipeline.states[0];
        }
        return null;
    }

    finishState() {
        if (this.creep.memory.pipeline.states.length > 0) {
            this.creep.memory.pipeline.states.shift();
            this.creep.memory.pipeline.params.shift();
        }
        this.clearCurrentState();
    }

    clearCurrentState() {
        delete this.creep.memory.state;
        delete this.creep.memory.stateParams;
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