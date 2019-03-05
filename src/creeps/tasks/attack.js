const BasicTask = require("creeps.tasks.basicTask");

class Task extends BasicTask {
	static get config(){
      return {
        task: "attack"
      };
    }

	get config(){
		return Task.config
	}

	preExecute(){
		if(!this.creep.getTarget()) {
			return this.getResult(CreepTaskResult.FINISHED);
		}

		return super.preExecute();
	}

	execute(){
		this.creep.api.travelTo(this.creep.target);
		this.creep.api.attack(this.creep.target);
		return super.execute();
	}

	isFinished(){
		return false;
	}

}

module.exports =  Task;