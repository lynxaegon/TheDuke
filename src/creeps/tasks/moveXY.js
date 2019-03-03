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
}

module.exports =  Task;
