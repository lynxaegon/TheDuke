// usefull
/**\
 * OBSTACLE_OBJECT_TYPES:
 * ["spawn", "creep", "powerCreep", "source", "mineral",
 *  "deposit", "controller", "constructedWall", "extension",
 *  "link", "storage", "tower", "observer", "powerSpawn",
 *  "powerBank", "lab", "terminal", "nuker", "factory",
 *  "invaderCore"],
 */

const STATES = {};

STATES[Colony.STATE_GROW] = {};

module.exports = class Room extends DukeObject {
	constructor(memory, api) {
		super(memory, api);

		this.spawns = [];
		this.controller = false;
		this.others = [];

		this.creeps = [];

		this.stateConfig = {};
	}

	/**
	 * accessed via "Reflection"
	 * @param creep
	 */
	assignCreeps(creep) {
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

	run(colony) {
		this.stateConfig = STATES[colony.state];
		this.runState();
	}

	runState() {
		this._checkEconomy();
		this._updateTasks();
		// this.checkTasks();
		// this.createNewTasks();
		// this.executeTasks();
		// this.finalizeTasks();
	}

	_checkEconomy() {
		console.log("Energy:", this.getEnergy(), "/", this.getEnergyCapacity());
	}

	_updateTasks() {
		console.log(JSON.stringify(this.find("ENERGY_SOURCE")));
		// console.log(this.trace());
		// console.log(getRoomHex());
	}

	/*
	getRoomHex() {
		let lookupTable = {
			'0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
			'5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
			'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
			'e': '1110', 'f': '1111',
			'A': '1010', 'B': '1011', 'C': '1100', 'D': '1101',
			'E': '1110', 'F': '1111'
		};
		let invertedLookupTable = {
			'0000': '0',

		};
		let string = "";
		let roomMap = this.api.lookAtArea(0, 0, 49, 49, true);
		let acc = "";
		for (let i = 0; i < roomMap.length; i++) {
			for (let j = 0; j < roomMap[j].length; j++) {
				acc += LOOK_
			}
		}
	}
	*/

	find(type) {
		if (type == "ENERGY_SOURCE") {
			return Cache.disk.retrieve("Room/" + this.id + ".find/type:" + type, () => {
				return this.api.find(FIND_SOURCES).map(o => o.id);
			});
		}
		return null;
	}

	dumpMemory() {
		return Object.assign(super.dumpMemory(), {});
	}

	// functions
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
};