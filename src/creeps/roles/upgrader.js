const BasicCreep = require("creeps.basic");
class Upgrader extends BasicCreep {
    static get role() {
        return "upgrader";
    }

    constructor() {
        super(...arguments);
    }

    execute() {
        var target;
        if (this.isIdle()) {
            if (this.creep.carry.energy < this.creep.carryCapacity) {
                var sources = this.creep.room.find(FIND_SOURCES);
                if (sources.length) {
                    if (sources[1]) {
                        target = sources[1];
                    } else {
                        target = sources[0];
                    }
                    this.addState("move", {
                        target: target.id
                    });
                    this.addState("harvest", {
                        target: target.id
                    });
                }
            } else {
                this.addState("move", {
                    target: this.creep.room.controller.id
                });
                this.addState("upgradeController", {
                    target: this.creep.room.controller.id
                });
            }
        }
        super.execute();
    }
}
module.exports = Upgrader;