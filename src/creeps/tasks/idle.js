const BasicTask = require("creeps.tasks.basicTask");

class Task extends BasicTask {
	static get config(){
      return {
        task: "idle"
      };
    }

	get config(){
		return Task.config
	}

	getIdleTicks(){
		return 2;
	}

	execute(){
		this.creep.api.say("idle");
		return super.execute();
	}

	isFinished(){
		if(!this.taskMemory.tick)
			return false;

		return Game.time - this.taskMemory.tick > this.getIdleTicks();
	}
}

module.exports =  Task;