const BasicTask = require("creeps.tasks.basicTask");

class Task extends BasicTask {
  static get config() {
    return {
      task: "moveXY"
    };
  }

  get config() {
    return Task.config
  }

  preExecute() {
    if (this.taskMemory.oldPos) {
      if (this.taskMemory.oldPos.x == this.creep.api.pos.x && this.taskMemory.oldPos.y == this.creep.api.pos.y && this.taskMemory.oldPos.cnt >= 1) {
        return this.getResult(CreepTaskResult.STUCK);
      }
    }

    return super.preExecute();
  }

  execute() {
    var roomName = this.taskMemory.r || this.creep.api.room.name;
    this.creep.api.travelTo(new RoomPosition(this.taskMemory.x, this.taskMemory.y, roomName));
    return super.execute();
  }

  postExecute() {
    this.saveOldPosition();
    return super.postExecute();
  }

  isFinished() {
    if (this.taskMemory.r && this.taskMemory.r == this.creep.api.room.name) {
      return true;
    } else if (this.creep.api.pos.x == this.taskMemory.x && this.creep.api.pos.y == this.taskMemory.y) {
      return true;
    }

    return false;
  }

  saveOldPosition() {
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

module.exports = Task;
