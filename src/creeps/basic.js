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

    plan(){
      if (this.creep.memory.pipeline.states.length > 10) {
          Logger.info("too many states queued...");
          return;
      }
      if (!this.creep.memory.state && this.creep.memory.pipeline.states.length > 0) {
          this.creep.memory.state = this.creep.memory.pipeline.states[0];
          this.creep.memory.stateParams = this.creep.memory.pipeline.params[0];
      }

      this.updateTarget();
    }

    execute(forced) {
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
                if (this.hasTarget()) {
                    if (this.creep.moveTo(this.target, {
                            noPathFinding: true
                        }) == ERR_NOT_FOUND) {
                        this.creep.moveTo(this.target);
                    }
                } else if (this.hasValidMoveXY()) {
                    if (this.creep.moveTo(this.creep.memory.stateParams.x, this.creep.memory.stateParams.y, {
                            noPathFinding: true
                        }) == ERR_NOT_FOUND) {
                        this.creep.moveTo(this.creep.memory.stateParams.x, this.creep.memory.stateParams.y);
                    }
                }
                break;
            case "harvest":
                if (this.target) {
                    this.creep.say("Harvesting...");
                    if (this.creep.harvest(this.target) == ERR_NOT_IN_RANGE) {
                        this.forceState("move", {
                            target: this.targetSerialized
                        });
                    }
                }
                break;
            case "transfer":
                this.creep.say("Transfering...");
                var t = this.creep.transfer(this.target, RESOURCE_ENERGY);
                if (this.creep.transfer(this.target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.forceState("move", {
                        target: this.targetSerialized
                    })
                }
                break;
            case "upgradeController":
                this.creep.say("Upgrading...");
                if (!this.creep.room.controller.sign || this.creep.room.controller.sign.username !== "LynxAegon") {
                    this.creep.signController(this.target, "Q: How did the hipster burn his tongue? A: He drank his coffee before it was cool.");
                }
                this.creep.upgradeController(this.target);
                break;
            default:
                this.creep.say("Idle");
        }
    }

    cleanup() {
        var range = 1;
        switch (this.creep.memory.state) {
            case "move":
                if (this.hasTarget()) {
                    if (this.peekState(1) == "upgradeController")
                        range = 3;
                    if (this.creep.pos.inRangeTo(this.target, range)) {
                        this.creep.say("via target");
                        this.finishState();
                    }
                } else if (this.hasValidMoveXY()) {
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

    peekState(index) {
        index = index || 0;
        if (this.creep.memory.pipeline.states.length > 0 && this.creep.memory.pipeline.states[index]) {
            return this.creep.memory.pipeline.states[index];
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

    hasTarget() {
        if(!this.creep.memory.stateParams || !this.creep.memory.stateParams.target){
            this.target = false;
            return false;
        }
        return true;
      }

    hasValidMoveXY() {
        if (this.creep.memory.stateParams.hasOwnProperty('x') && this.creep.memory.stateParams.hasOwnProperty('y')) {
            return true;
        }
        return false;
    }

    updateTarget() {
        if(this.hasTarget()){
            this.target = Game.getObjectById(this.creep.memory.stateParams.target);
            this.targetSerialized = this.creep.memory.stateParams.target;
        } else {
          this.target = false;
          this.targetSerialized = false;
        }
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
