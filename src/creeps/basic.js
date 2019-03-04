var CreepTask = require("creeps.creepTask");
class BasicCreep {
    constructor(creep) {
        this.api = creep;
		this.memory = this.api.memory;
        this.formatMemory();
		
		this.recursionCount = 0;
		this.recursionLimit = 10;
		this.maxQueuedStates = 10;

		this.creepTask = new CreepTask(this);
    }

	preExecute(noTickUpdate){
		this.recursionCount++;
		if(this.recursionCount >= this.recursionLimit)
			return;
		if(noTickUpdate)
			this.onTick();

		var result = this.creepTask.preExecute();
		if(!result){
			if (this.memory.pipeline.states.length > this.maxQueuedStates) {
				Logger.info("too many states queued...");
				return false;
			}
			this.plan();
			this.preExecute(true);
		}
	}

    execute(forced) {
        this.creepTask.execute(forced);
    }

	postExecute(){
		this.creepTask.postExecute();
	}

	onTick(){

	}

	plan(){

	}

    forceState(state, params) {
        Logger.info("forced state", state);
        params['tick'] = Game.time;
        this.memory.pipeline.states.unshift(state);
        this.memory.pipeline.params.unshift(params);

        this.clearCurrentState();

        return this;
    }

    addState(state, params) {
        params['tick'] = Game.time;
        this.memory.pipeline.states.push(state);
        this.memory.pipeline.params.push(params);
        return this;
    }

    isIdle() {
        return this.memory.pipeline.states.length == 0;
    }

    peekState(index) {
        index = index || 0;
        if (this.memory.pipeline.states.length > 0 && this.memory.pipeline.states[index]) {
            return this.memory.pipeline.states[index];
        }
        return null;
    }

    finishState() {
        if (this.memory.pipeline.states.length > 0) {
            this.memory.pipeline.states.shift();
            this.memory.pipeline.params.shift();
        }
        this.clearCurrentState();
    }

    clearCurrentState() {
        delete this.memory.state;
        delete this.memory.stateParams;
    }

    hasTarget() {
        if(!this.memory.stateParams || !this.memory.stateParams.target){
            this.target = false;
            return false;
        }
        return true;
  	}

    updateTarget() {
        if(this.hasTarget()){
            this.target = Game.getObjectById(this.memory.stateParams.target);
            this.targetSerialized = this.memory.stateParams.target;
        } else {
          this.target = false;
          this.targetSerialized = false;
        }
    }

	getTarget() {
		return this.target;
	}

	getTargetSerialized() {
		return this.targetSerialized;
	}

    formatMemory() {
		if (!this.memory.pipeline) {
            this.memory.pipeline = {
                states: [],
                params: []
            }
        }
    }
}

module.exports = BasicCreep;
