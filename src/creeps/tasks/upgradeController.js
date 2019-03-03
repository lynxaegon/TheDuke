const BasicTask = require("creeps.tasks.basicTask");

class Task extends BasicTask {
	static get config(){
      return {
        task: "upgradeController"
      };
    }

	get config(){
		return Task.config
	}

	execute(){
		this.creep.api.say("Upgrading...");
		if (!this.creep.api.room.controller.sign || this.creep.api.room.controller.sign.username !== "LynxAegon") {
			this.creep.api.signController(this.creep.getTarget(), "Q: How did the hipster burn his tongue? A: He drank his coffee before it was cool.");
		}
		this.creep.api.upgradeController(this.creep.getTarget());
		return super.execute();
	}
	
	isFinished(){
		if (this.creep.api.carry.energy == 0) {
			this.creep.api.say("Transfer compeleted");
			return true;
		}

		return false;
	}
}

module.exports =  Task;
