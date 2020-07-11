class Room {
  constructor(room) {
    // ScreepsAPI
    this.api = room;
    this.name = room.name;
    this.energyAvailable = room.energyAvailable;
    this.energyCapacityAvailable = room.energyCapacityAvailable;

    // TheDukeAPI
    this.creeps = {};
    this.structures = {};
    this.factories = [];
  }

  assignCreep(creep) {
    var role = creep.memory.role;
    if (!this.creeps[role])
      this.creeps[role] = [];

    creep.room = this;
    this.creeps[creep.memory.role].push(creep);
  }

  assignStructure(structure) {
    var type = structure.structureType;
    if (!this.structures[type])
      this.structures[type] = [];
    this.structures[type].push(structure);

    if (type == "spawn") {
      this.factories.push(new CreepFactory(structure));
      this.getEnergySources();
    }
  }

  upkeepCreeps() {
    var energySources = this.getEnergySources();
    if (energySources.length > 0) {
      let builders = energySources.length * 2;
      return {
        harvester: builders - this.creeps['harvester'].length > 0
      };
    }

    return {};
  }

  run() {
    for (var i in this.creeps) {
      for (var j in this.creeps[i]) {
        if (this.creeps[i][j].spawning) {
          continue;
        }
        // console.log("-------------- [start] " + this.creeps[i][j].api.name + "--------------");
        this.creeps[i][j].preExecute();
        this.creeps[i][j].execute();
        this.creeps[i][j].postExecute();
        // console.log("-------------- [end]" + this.creeps[i][j].api.name + "--------------");
      }
    }
  }

  // API Functions
  getEnergySources() {
    var cacheKey = getCacheKey({
      name: this.name
    });
    if (Cache.has(cacheKey)) {
      return Cache.get(cacheKey);
    }

    Cache.set(cacheKey, this.api.find(FIND_SOURCES));
    return Cache.get(cacheKey);
  }

  distanceTo(room, diagonal) {
    if (typeof room == "string") {
      room = new Room({"name": room});
    }

    diagonal = diagonal || true;
    if (this.name == room.name)
      return 0;

    let posA = this.name.split(/([N,E,S,W])/);
    let posB = room.name.split(/([N,E,S,W])/);

    let xDif = posA[1] == posB[1] ? Math.abs(posA[2] - posB[2]) : posA[2] + posB[2] + 1;
    let yDif = posA[3] == posB[3] ? Math.abs(posA[4] - posB[4]) : posA[4] + posB[4] + 1;

    if (diagonal)
      return Math.max(xDif, yDif); // count diagonal as 1
    return xDif + yDif; // count diagonal as 2
  }
}

module.exports = Room;
