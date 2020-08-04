const DukeTask = require('base.task');

module.exports = class Task extends DukeTask {
	static getTaskName() {
		return "BasicHarvest";
	}

	static getTaskType() {
		return "BASIC_HARVEST";
	}

	config() {
		return Object.assign(super.config(), {
			name: Task.getTaskName(),
			type: Task.getTaskType()
		});
	}

	getRequirements() {
		let sources = this.room.find(DukeRoom.FIND_TYPE.ENERGY_SOURCE);
		let maxHarvesters = 0;

		for(let sourceId in sources) {
			maxHarvesters += sources[sourceId].max;
		}

		return Object.assign(super.getRequirements(), [{
			parts: [DukeCreep.PARTS.MOVE, DukeCreep.PARTS.CARRY, DukeCreep.PARTS.WORK],
			count: maxHarvesters - this.assigned.length
		}]);
	}

	stateStart(creep, state) {

	}

	stateDone(creep, state) {

	}

	stateError(creep, state) {

	}

	/***
	 *
	 * @param {DukeCreep} creep
	 * @returns object
	 */
	fsm(creep) {
		return {
			init: "findEnergySources",
			states: {
				"findEnergySources": {
					action: creep.getEnergySource,
					onSuccess: {
						next: "moveToSource",
						continue: true,
					},
					onFail: {
						next: "findSources"
					}
				},
				"moveToSource": {
					action: creep.moveToTarget,
					params: [creep.taskMemory.source],
					onSuccess: {
						next: "harvest",
						continue: true
					}
				},
				"harvest": {
					action: creep.harvest,
					onSuccess: {
						next: "isFull",
						continue: true
					}
				},
				"isFull": {
					action: creep.isFull,
					params: [RESOURCE_ENERGY],
					onSuccess: {
						next: "moveToSpawn",
						continue: true
					},
					onFail: {
						next: "harvest"
					}
				},
				"findEnergyStores": {
					action: creep.getEnergyStore,
					onSuccess: {
						next: "moveToStore",
						continue: true
					},
					onFail: {
						next: "findEnergyStores"
					}
				},
				"moveToStore": {
					action: creep.moveToTarget,
					params: [creep.taskMemory.store],
					onSuccess: {
						next: "transfer",
						continue: true
					}
				},
				"transfer": {
					action: creep.transfer,
					params: [creep.taskMemory.store, RESOURCE_ENERGY],
					onSuccess: {
						next: "moveToSource",
						continue: true
					}
				}
			}
		}

	}
};