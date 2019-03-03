global.CreepTaskResult = {
	EXECUTED: 1,
	STUCK: 2,
	FINISHED: 3
}

class CreepTask {
    constructor(creep){
		this.creep = creep;
		this.memory = this.creep.memory;
		this.task = false;
    }

	preExecute() {
        if (!this.memory.state && this.memory.pipeline.states.length > 0) {
            this.memory.state = this.memory.pipeline.states[0];
            this.memory.stateParams = this.memory.pipeline.params[0];
        }
		this.creep.updateTarget();


		if(!TaskTypes[this.memory.state]) {
			console.log("[CreepTask]["+this.creep.api.name+"] Invalid task: " + this.memory.state);
			this.creep.finishState();
			if(this.memory.pipeline.states.length > 0){
				this.creep.preExecute(true);
				return true;
			}
			return false;
		}

		var result = false;
		try {
			this.task = new TaskTypes[this.memory.state](this.creep, this.memory.stateParams);
			console.log("[CreepTask]["+this.creep.api.name+"]", this.task.config.task);
			result = this.task.preExecute();
		}
		catch(e){
			console.log("[CreepTaskFailed]["+this.creep.api.name+"]", e, e.stack);
			this.creep.finishState();
			if(this.memory.pipeline.states.length > 0){
				this.creep.preExecute(true);
				return true;
			}
		}
		result = this.processResult(result);

		if(!result && this.memory.pipeline.states.length > 0){
			this.creep.preExecute(true);
			return true;
		}
		return result;
  	}

	execute(forced) {
		if(!this.task){
			console.log("[CreepTask]["+this.creep.api.name+"] execute - no task");
			return;
		}
		var result = this.task.execute();
		this.processResult(result);
	}

	postExecute() {
		if(!this.task){
			console.log("[CreepTask]["+this.creep.api.name+"] preExecute - no task");
			return;
		}

		var result = this.task.postExecute();
		this.processResult(result);
	}

	processResult(result) {
		// console.log("[CreepTask]("+this.task.config.task+") processResult:", JSON.stringify(result));
		switch(result.state){
			case CreepTaskResult.STUCK:
			case CreepTaskResult.FINISHED:
				this.creep.finishState();
				return false;
			case CreepTaskResult.EXECUTED:
				this.memory.stateParams = result.memory;
				return true;
			default:
				console.log("[CreepTask]["+this.creep.api.name+"] Invalid task result:", result.state, new Error().stack);
				return false;
		}
	}
}

module.exports =  CreepTask;
