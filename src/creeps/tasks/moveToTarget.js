const BasicTask = require("creeps.tasks.basicTask");

class Task extends BasicTask {
	static get config(){
      return {
        task: "moveToTarget"
      };
    }

	get config(){
		return Task.config
	}

	execute(){
		if (this.creep.api.moveTo(this.creep.getTarget(), {
				noPathFinding: true
			}) == ERR_NOT_FOUND) {
			this.creep.api.moveTo(this.creep.getTarget());
		}
		return this.getResult(CreepTaskResult.EXECUTED);
	}

	isFinished(){
		var range = 1;
		// TODO: Apply peekState().rangeCheck
		// console.log("IS FINISHED", this.creep.api.pos.inRangeTo(this.creep.getTarget(), range));
		if (this.creep.peekState(1) == "upgradeController")
			range = 3;

		if (this.creep.api.pos.inRangeTo(this.creep.getTarget(), range)) {
			this.creep.api.say("via target");
			return true;
		}

		return false;
	}
}

module.exports =  Task;
