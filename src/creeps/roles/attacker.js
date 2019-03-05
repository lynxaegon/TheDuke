const BasicCreep = require("creeps.basic");
class Creep extends BasicCreep {
    static get config(){
      return {
        count: 6,
        parts: [ATTACK, MOVE, MOVE],
        role: "attacker"
      };
    }

    constructor() {
        super(...arguments);
    }

    getRoomGuardingPosition(){
		return {
			x: 18,
			y: 25,
			r: this.getRoomToAttack()
		};
	}

    getRoomToAttack(){
    	return "W32S13";
	}

    plan() {
		if(this.api.room.name != this.getRoomToAttack()){
			this.addState("moveXY", this.getRoomGuardingPosition());
		} else {
			var target = Game.getObjectById(this.memory.attackTarget);
			if(target){
				console.log("[CreepTask][" + this.api.name + " - " + this.role+"] Target:", target);
				this.addState("attack", {
					target: target.id
				});
			} else {
				const targets = this.api.room.find(FIND_HOSTILE_CREEPS);
				if (targets.length > 0) {
					target = targets[Math.floor(Math.random() * targets.length)];
					this.memory.attackTarget = target.id;
					this.addState("attack", {
						target: target.id
					});
				} else {
					var structures = this.api.room.find(FIND_HOSTILE_STRUCTURES);
					structures = _.filter(structures, function(item){
						// invalid structures
						return [STRUCTURE_ROAD, STRUCTURE_RAMPART, STRUCTURE_CONTROLLER].indexOf(item.structureType) == -1;
					});
					if(structures.length > 0) {
						target = structures[Math.floor(Math.random() * structures.length)];
						this.memory.attackTarget = target.id;
						this.addState("attack", {
							target: target.id
						});
					} else {
						var tmp = this.getRoomGuardingPosition();
						delete tmp.r;
						this.addState("moveXY", tmp);
						this.addState("idle");
					}
				}
			}
		}
    }

    onTick() {
		// if(["moveXY", "moveToTarget"].indexOf(this.memory.state) != -1){
		// 	if(this.memory.taskParams.r != this.getRoomToAttack()){
		// 		this.reset();
		// 	}
		// }
	}
}
module.exports = Creep;
