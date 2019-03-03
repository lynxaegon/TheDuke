const BasicCreep = require("creeps.basic");
class Creep extends BasicCreep {
    static get config(){
      return {
        count:2,
        parts: [MOVE, CARRY, WORK],
        role: "upgrader"
      };
    }

    constructor() {
        super(...arguments);
    }

    plan() {
        var target;
        if (this.api.carry.energy < this.api.carryCapacity) {
            var sources = this.api.room.find(FIND_SOURCES);
            if (sources.length) {
                target = sources[Game.time % sources.length];
                this.addState("moveToTarget", {
                    target: target.id
                });
                this.addState("harvest", {
                    target: target.id
                });
            }
        } else {
            this.addState("moveToTarget", {
                target: this.api.room.controller.id
            });
            this.addState("upgradeController", {
                target: this.api.room.controller.id
            });
        }
    }
}
module.exports = Creep;
