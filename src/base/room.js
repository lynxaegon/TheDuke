/**
 * OBSTACLE_OBJECT_TYPES:
 * ["spawn", "creep", "powerCreep", "source", "mineral",
 *  "deposit", "controller", "constructedWall", "extension",
 *  "link", "storage", "tower", "observer", "powerSpawn",
 *  "powerBank", "lab", "terminal", "nuker", "factory",
 *  "invaderCore"],
 */
let tasks = {
	harvest: DukeColony.getTasks()['BASIC_HARVEST']['BasicHarvest']
};
// const STATES = {};

// STATES[Colony.STATE_] = {};

module.exports = class DukeRoom extends DukeObject {
	constructor(memory, api) {
		super(memory, api);

		this.spawns = [];
		this.controller = false;
		this.others = [];
		/** @type {DukeTask[]} **/
		this.tasks = [];
		this.colony = false;

		this.creeps = [];
	}

	assignColony(colony) {
		this.colony = colony;
	}

	/**
	 * accessed via "Reflection"
	 * @param creep
	 */
	assignCreeps(creep) {
		creep.room = this;
		this.creeps.push(creep);
	}

	/**
	 * accessed via "Reflection"
	 * @param structure
	 */
	assignStructures(structure) {
		switch (structure.type) {
			case "spawn":
				this.spawns.push(structure);
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
	}

	/**
	 * accessed via "Reflection"
	 * @param task
	 */
	assignTasks(task) {
		task.room = this;
		this.tasks.push(task);
	}

	run() {
		this.runState();
	}

	runState() {
		this._checkEconomy();
		this._updateTasks();
		this._processTasks();
		this._executeTasks();
		this._finalizeTasks();
	}

	_checkEconomy() {
		// console.log(JSON.stringify(this.find(Room.FIND_TYPE.ENERGY_SOURCE)));
	}

	_updateTasks() {
		let harvestTask = this.tasks.find(t => t.config().type == "BASIC_HARVEST");

		if(!harvestTask)
		{
			TheDuke.addTask(new tasks.harvest({}, this.id));
		}
	}

	_processTasks() {
		// TODO: check task requirements and try to meet them
		for(let t of this.tasks) {
			console.log("Requirements", JSON.stringify(t.getRequirements()));
		}
	}

	_executeTasks() {
		// TODO: execute all tasks (maybe via priority)
	}

	_finalizeTasks() {
		// TODO: dunno what to do here :D (yet)
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
				for(let source in sources) {
					tickData[source] = Object.assign({current : 0}, sources[source]);
				}

				return tickData;
			});
		}
		return null;
	}

	getFreeSource(occupy) {
		let sources = this.find(DukeRoom.FIND_TYPE.ENERGY_SOURCE);
		for(let source in sources) {
			if(sources[source].current < sources[source].max) {
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
		return  2 * sources.length;
	}
};

module.exports.FIND_TYPE = {
	ENERGY_SOURCE: 1
};