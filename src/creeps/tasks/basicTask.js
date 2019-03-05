class BasicTask {
	constructor(creep, memory){
		this.creep = creep;
		this.taskMemory = memory;
		this.debug = false;
    }

	preExecute() {
		// console.log("[Task] preExecute", this.config.task, "params", JSON.stringify(this.memory));
		if(this.isFinished()){
			return this.getResult(CreepTaskResult.FINISHED);
		}

		return this.getResult(CreepTaskResult.EXECUTED);
	}

	execute(){
		// console.log("[Task] execute", this.config.task, "params", JSON.stringify(this.memory));
		return this.getResult(CreepTaskResult.EXECUTED);
	}

	postExecute(){
		// console.log("[Task] postExecute", this.config.task, "params", JSON.stringify(this.memory));
		return this.getResult(CreepTaskResult.EXECUTED);
	}

	isFinished() {
		return true;
	}

	getResult(state){
		return {
			state: state,
			memory: this.taskMemory
		}
	}

	getCurrentTask(){
		// return this.taskMemory.
	}
}

module.exports = BasicTask;
