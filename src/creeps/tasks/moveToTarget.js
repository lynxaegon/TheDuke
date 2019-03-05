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

	preExecute(){
		if(this.taskMemory.oldPos) {
			if (this.taskMemory.oldPos.x == this.creep.api.pos.x && this.taskMemory.oldPos.y == this.creep.api.pos.y && this.taskMemory.oldPos.cnt >= 1) {
				return this.getResult(CreepTaskResult.STUCK);
			}
		}

		return super.preExecute();
	}

	execute(){
		this.creep.api.travelTo(this.creep.getTarget());
		return this.getResult(CreepTaskResult.EXECUTED);
	}

	postExecute(){
		this.saveOldPosition();
		return super.postExecute();
	}

	isFinished(){
		var range = 1;
		// TODO: Apply peekState().rangeCheck
		if (this.creep.peekState(1) == "upgradeController")
			range = 3;

		if (this.creep.api.pos.inRangeTo(this.creep.getTarget(), range)) {
			return true;
		}

		return false;
	}

	saveOldPosition(){
		if (this.taskMemory.oldPos && this.taskMemory.oldPos.x == this.creep.api.pos.x && this.taskMemory.oldPos.y == this.creep.api.pos.y) {
			this.taskMemory.oldPos.cnt += 1;
		} else {
			this.taskMemory.oldPos = {
				x: this.creep.api.pos.x,
				y: this.creep.api.pos.y,
				cnt: 0
			}
		}
	}
}

module.exports =  Task;
