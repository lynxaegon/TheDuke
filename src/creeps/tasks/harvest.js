const BasicTask = require("creeps.tasks.basicTask");

class Task extends BasicTask {
	static get config(){
      return {
        task: "harvest"
      };
    }

	get config(){
		return Task.config
	}

	execute(){
		this.creep.api.say("Harvesting...");
		if (this.creep.api.harvest(this.creep.getTarget()) == ERR_NOT_IN_RANGE) {
			this.creep.forceState("moveToTarget", {
				target: this.creep.getTargetSerialized()
			});
		}
		return super.execute();
	}

	isFinished(){
		if (this.creep.api.carry.energy == this.creep.api.carryCapacity) {
			this.creep.api.say("Harvest compeleted");
			return true;
		}

		return false;
	}
}

module.exports =  Task;
