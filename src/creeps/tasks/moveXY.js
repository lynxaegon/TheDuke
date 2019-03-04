const BasicTask = require("creeps.tasks.basicTask");

class Task extends BasicTask {
	static get config(){
      return {
        task: "moveXY"
      };
    }

	get config(){
		return Task.config
	}

	preExecute(){
		if(!this.memory.oldPos){
			this.saveOldPosition();
		} else {
			if(this.memory.oldPos.x == this.creep.api.pos.x && this.memory.oldPos.y == this.creep.api.pos.y){
				return this.getResult(CreepTaskResult.STUCK);
			} else {
				this.saveOldPosition();
			}
		}
		return super.preExecute();
	}

	execute(){
		if (this.creep.api.moveTo(this.memory.x, this.memory.y, {
				noPathFinding: true
			}) == ERR_NOT_FOUND) {
			this.creep.api.moveTo(this.memory.x, this.memory.y);
		}
		return super.execute();
	}

	isFinished(){
		if (this.memory.r !== this.creep.api.room.name) {
			this.creep.api.say("diff room");
			// TODO: fix room to room traveling, this should return false and update to new room coordinates
			return true;
		} else if (this.creep.api.pos.x == this.memory.x && this.creep.api.pos.y == this.memory.y) {
			this.creep.api.say("via x,y");
			return true;
		}

		return false;
	}

	saveOldPosition(){
		this.memory.oldPos = {
			x: this.creep.api.pos.x,
			y: this.creep.api.pos.y
		}
	}
}

module.exports =  Task;
