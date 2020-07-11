const BasicTask = require("creeps.tasks.basicTask");

class Task extends BasicTask {
  static get config() {
    return {
      task: "transfer"
    };
  }

  get config() {
    return Task.config
  }

  execute() {
    this.creep.api.say("Transfering...");
    if (this.creep.api.transfer(this.creep.getTarget(), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.creep.forceState("moveToTarget", {
        target: this.creep.getTargetSerialized()
      });
    }
    return super.execute();
  }

  isFinished() {
    var target = this.creep.getTarget();
    if (this.creep.api.carry.energy == 0 || target.energy == target.energyCapacity) {
      this.creep.api.say("Transfer compeleted");
      return true;
    }

    return false;
  }
}

module.exports = Task;
