/**
 * OBSTACLE_OBJECT_TYPES:
 * ["spawn", "creep", "powerCreep", "source", "mineral",
 *  "deposit", "controller", "constructedWall", "extension",
 *  "link", "storage", "tower", "observer", "powerSpawn",
 *  "powerBank", "lab", "terminal", "nuker", "factory",
 *  "invaderCore"],
 */
let tasks = {
    harvest: DukeColony.getTasks()['BASIC_HARVEST']['BasicHarvest'],
    spawn_creeps: DukeColony.getTasks()['FACTORY']['SpawnCreep']
};
// const STATES = {};

// STATES[Colony.STATE_] = {};

module.exports = class DukeRoom extends DukeObject {
    constructor(memory, api) {
        super(memory, api);

        this.creeps = [];
        this.spawns = [];
        this.controller = false;
        this.others = [];
        /** @type {DukeTask[]} **/
        this.tasks = [];
        this.colony = false;


        this.objectsMap = {};

        this._canSpawn = false;
        this._maxSpawnTasks = 0;
    }

    assignColony(colony) {
        this.colony = colony;
    }

    getObjectById(id) {
        return this.objectsMap[id];
    }

    /**
     * accessed via "Reflection"
     * @param creep
     */
    assignCreeps(creep) {
        creep.room = this;
        this.creeps.push(creep);

        this.objectsMap[creep.id] = creep;
    }

    /**
     * accessed via "Reflection"
     * @param structure
     */
    assignStructures(structure) {
        switch (structure.type) {
            case "spawn":
                this.spawns.push(structure);
                this._canSpawn = true;
                break;
            case "controller":
                if (this.controller) {
                    console.log("[Error] Double controller found in Room:", this.id);
                }
                this.controller = structure;
                break;
            default:
                this.others.push(structure);
        }

        this.objectsMap[structure.id] = structure;
    }

    /**
     * accessed via "Reflection"
     * @param task
     */
    assignTasks(task) {
        task.assignRoom(this)
        this.tasks.push(task);
    }

    run() {
        this.runState();
    }

    runState() {
        this._checkEconomy(); // economy something something.. decide if we need to change strategy
        this._updateTasks(); // prechecks
        this._processTasks(); // spawner
        this._assignTasks(); // allocate tasks
        this._executeTasks(); // run all tasks (or filter)
        this._finalizeTasks();
    }

    _checkEconomy() {
        // console.log(JSON.stringify(this.find(Room.FIND_TYPE.ENERGY_SOURCE)));
    }

    _updateTasks() {
        const spawnTasks = this.tasks.filter(t => t.config().type == "FACTORY");
        this._canSpawn = spawnTasks ? spawnTasks.length < this.spawns.length : false;
        this._maxSpawnTasks = spawnTasks ? spawnTasks.length - this.spawns.length : 0;

        let harvestTask = this.tasks.find(t => t.config().type == "BASIC_HARVEST");
        if (!harvestTask) {
            TheDuke.addTask(new tasks.harvest({}, this.id));
        }
    }

    _processTasks() {
        let reqs = {
            creeps: []
        };
        // Get factory requirements!!!
        for (let t of this.tasks) {
            let rules = t.rules();
            // requires creeps
            if (rules.required.creeps) {
                // check if all requirements are satisfied
                for (let requirement of rules.required.creeps) {
                    if (requirement.now >= requirement.max) {
                        continue;
                    }

                    // add to spawner queue
                    reqs.creeps.push(requirement.type);
                }
            }
        }

        // Create Factories!!!
        if (this._canSpawn) {
            if (reqs.creeps.length > 0) {
                while (this._maxSpawnTasks <= 0) {
                    if (reqs.creeps.length <= 0)
                        break;

                    this._maxSpawnTasks--;
                    let creep = reqs.creeps.pop();
                    // add spawn task
                    TheDuke.addTask(new tasks.spawn_creeps({
                        params: {
                            parts: creep
                        }
                    }, this.id));
                }
            }
        }
    }

    _assignTasks() {
        for (let t of this.tasks) {
            let rules = t.rules();
            if (rules.required.creeps) {
                for (let requirement of rules.required.creeps) {
                    if (requirement.now >= requirement.max) {
                        continue;
                    }

                    let creep = this.creeps.find(creep => creep.isType(requirement.type));
                    t.assign(creep);
                }
            }

            if(rules.required.spawn) {
                for (let requirement of rules.required.spawn) {
                    if (requirement.now >= requirement.max) {
                        continue;
                    }
                    let spawn = this.spawns.find(spawn => spawn.api.spawning == null);
                    t.assign(spawn)
                }
            }
        }
    }

    _executeTasks() {
        // TODO: execute all tasks (maybe via priority)
        for (let t of this.tasks) {
            console.log("Running task:", t.config().name)
            t.execute()
        }
    }

    _finalizeTasks() {
        // TODO: dunno what to do here :D (yet)
        for (let t of this.tasks) {
            console.log("Finalizing task:", t.config().name)
            t.finalize()
        }
    }

    find(type) {
        if (type == DukeRoom.FIND_TYPE.ENERGY_SOURCE) {
            let cacheKey = "Room/" + this.id + ".find/type:" + type;
            return Cache.tick.retrieve(cacheKey, () => {
                let sources = Cache.disk.retrieve(cacheKey, () => {
                    let sources = this.api.find(FIND_SOURCES);
                    sources = sources.reduce(function (acc, val, i) {
                        acc[val.id] = {max: 2};
                        return acc;
                    }, {});
                    return sources;
                });

                let tickData = {};
                for (let source in sources) {
                    tickData[source] = Object.assign({current: 0}, sources[source]);
                }

                return tickData;
            });
        }
        return null;
    }

    getFreeSource(occupy) {
        let sources = this.find(DukeRoom.FIND_TYPE.ENERGY_SOURCE);
        for (let source in sources) {
            if (sources[source].current < sources[source].max) {
                sources[source].current += occupy ? 1 : 0;
                return source;
            }
        }

        return false;
    }

    dumpMemory() {
        return Object.assign(super.dumpMemory(), {
            id: this.id
        });
    }

    // API
    getEnergy() {
        return this.spawns.reduce((acc, obj) => {
            return acc + obj.getResource(RESOURCE_ENERGY);
        }, 0);
    }

    getEnergyCapacity() {
        return this.spawns.reduce((acc, obj) => {
            return acc + obj.getResourceCapacity(RESOURCE_ENERGY);
        }, 0);
    }

    getUpkeep() {
        let sources = this.find(DukeRoom.FIND_TYPE.ENERGY_SOURCE);
        return 2 * sources.length;
    }
};

module.exports.FIND_TYPE = {
    ENERGY_SOURCE: 1
};