require("colony.config");
global.CreepFactory = require("creeps.factory");
global.SCREEPS_PROFILER = require("utils.profiler");
global.getCacheKey = (params) => {
  var stack = new Error().stack;
  var cacheKey = stack.split('\n')[2].trim();
  cacheKey = cacheKey.substr("at ".length)
  cacheKey = "/" + cacheKey.substr(0, cacheKey.indexOf("(")).trim();
  if (params) {
    for(let name in params){
      cacheKey += "/" + name + ":" + params[name];
    }
  }
  return cacheKey;
}
var Room = require("colony.room");

// SCREEPS_PROFILER.enable();
class TheDuke {
  handler() {
    if (!Memory.suspend && Game.cpu.bucket < 500) {
      Logger.warn("CPU bucket is critically low (" + Game.cpu.bucket + ") - suspending for 5 ticks!");
      Memory.suspend = 4;
      return;
    } else {
      if (Memory.suspend != undefined) {
        if (Memory.suspend > 0) {
          Logger.info("Operation suspended for " + Memory.suspend + " more ticks.");
          Memory.suspend -= 1;
          return;
        } else {
          delete Memory.suspend;
        }
      }
      this.loop();
    }
  }

  // Run phases
  loop() {
    SCREEPS_PROFILER.wrap(function() {
      this.initPhase();
      this.investigate();
      this.runPhase();
      this.runFactories();
      this.visualsPhase();
    }.bind(this));
  }

  initPhase() {
    this.creeps = [];
    this.rooms = [];
    for (var i in CreepConfigs) {
      this.creeps[i] = [];
    }

    var role;
    for (var name in Game.creeps) {
      // Game.creeps[name].room.lookAtArea(0, 0, 49, 49);
      // break;
      role = Game.creeps[name].memory.role;
      if (!CreepTypes[role]) {
        console.log("Invalid role '" + role + "'");
        continue;
      }

      // create creep
      var creep = new CreepTypes[role](Game.creeps[name]);
      // create room
      if (!this.rooms[Game.creeps[name].room.name]) {
        this.rooms[Game.creeps[name].room.name] = new Room(Game.creeps[name].room);
      }
      // assign creep
      this.rooms[Game.creeps[name].room.name].assignCreep(creep);
    }

    // assign structure
    for (var name in Game.structures) {
      if (!this.rooms[Game.structures[name].room.name]) {
        this.rooms[Game.structures[name].room.name] = new Room(Game.structures[name].room);
      }
      this.rooms[Game.structures[name].room.name].assignStructure(Game.structures[name]);
    }
  }

  investigate() {
    // here we should scan for enemies
  }

  runPhase() {
    // here we should run the creeps logic
    for (var i in this.rooms) {
      this.rooms[i].run();
    }
  }

  runFactories() {
    // here we should update the factory queues
    for (var i in this.rooms) {
      let room = this.rooms[i];
      let buildCreeps = [];
      let creeps = room.upkeepCreeps();
      console.log("upkeep [" + i + "]", JSON.stringify(creeps));
      for (let type in creeps) {
        if (creeps[type]) {
          if (!CreepConfigs[type]) {
            console.error("Invalid creep type (required for upkeep): " + type);
            continue;
          }
          buildCreeps.push(CreepConfigs[type]);
          break;
        }
      }

      console.log("required to spawn", buildCreeps.length);
      if (buildCreeps.length > 0) {
        for (let factory of room.factories) {
          console.log("factory is busy", factory.isBusy());
          if (!factory.isBusy())
            factory.build(buildCreeps.pop());
        }
      }
    }
  }

  visualsPhase() {
    // here we should build visuals
  }
}

module.exports = TheDuke;
