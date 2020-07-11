global.CreepTaskResult = {
  EXECUTED: 1,
  STUCK: 2,
  FINISHED: 3
};

const DEBUG_ENABLED_CREEPS = [
  // "IKHix6"
];
const DEBUG_ENABLED_ALL_CREEPS = false;

class CreepTask {
  constructor(creep) {
    this.creep = creep;
    this.memory = this.creep.memory;
    this.task = false;
  }

  preExecute() {
    this.CPU_USAGE = Game.cpu.getUsed();
    if (!this.memory.state && this.memory.pipeline.states.length > 0) {
      this.memory.state = this.memory.pipeline.states[0];
      this.memory.taskParams = this.memory.pipeline.params[0];
    }

    if (!this.memory.state) {
      this.creep.finishState();
      return false;
    }

    this.creep.updateTarget();

    if (!TaskTypes[this.memory.state]) {
      console.log("[CreepTask][" + this.creep.api.name + " - " + this.creep.role + "] Invalid task: " + this.memory.state);
      this.creep.finishState();
      if (this.memory.pipeline.states.length > 0) {
        this.creep.preExecute(true);
        return true;
      }
      return false;
    }

    var result = false;
    try {
      this.task = new TaskTypes[this.memory.state](this.creep, this.memory.taskParams);
      if (DEBUG_ENABLED_CREEPS.indexOf(this.creep.api.name) != -1 || DEBUG_ENABLED_ALL_CREEPS) {
        this.task.debug = true;
      }
      result = this.task.preExecute();
      // console.log("[CreepTask]["+this.creep.api.name+" - "+this.creep.role+"]", this.task.config.task, "status:", result.state);
    } catch (e) {
      console.log("[CreepTaskFailed][" + this.creep.api.name + " - " + this.creep.role + "]", e, e.stack);
      this.creep.finishState();
      if (this.memory.pipeline.states.length > 0) {
        this.creep.preExecute(true);
        return true;
      }
    }
    result = this.processResult(result);

    if (!result && this.memory.pipeline.states.length > 0) {
      this.creep.preExecute(true);
      return true;
    }
    return result;
  }

  execute(forced) {
    if (!this.task) {
      // console.log("[CreepTask]["+this.creep.api.name+" - "+this.creep.role+"] execute - no task");
      return;
    }
    var result = this.task.execute();
    this.processResult(result);
  }

  postExecute() {
    if (!this.task) {
      // console.log("[CreepTask]["+this.creep.api.name+" - "+this.creep.role+"] postExecute - no task");
      return;
    }

    var result = this.task.postExecute();
    this.processResult(result);

    this.CPU_USAGE = (Game.cpu.getUsed() - this.CPU_USAGE).toFixed(2);
    // if(DEBUG_ENABLED_CREEPS.indexOf(this.creep.api.name) != -1 || DEBUG_ENABLED_ALL_CREEPS)
    var highCpu = (this.CPU_USAGE >= 0.6 ? "HIGH CPU USAGE" : "_");
    console.log("[CreepTask]["+this.creep.api.name+" - "+this.creep.role+"][cpu_used]", this.CPU_USAGE, "[task]", this.task.config.task,highCpu);
  }

  processResult(result) {
    // console.log("[CreepTask]("+this.task.config.task+") processResult:", JSON.stringify(result));
    switch (result.state) {
      case CreepTaskResult.STUCK:
      case CreepTaskResult.FINISHED:
        this.creep.finishState();
        return false;
      case CreepTaskResult.EXECUTED:
        this.memory.taskParams = result.memory;
        return true;
      default:
        console.log("[CreepTask][" + this.creep.api.name + " - " + this.creep.role + "][" + this.task.name + "] Invalid task result:", result.state, new Error().stack);
        return false;
    }
  }
}

module.exports = CreepTask;
