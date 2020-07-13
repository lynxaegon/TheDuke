const Creep = require("creeps.creep");
const Structure = require("structures.structure");

class TheDuke {
    init(memory) {
        this.memory = memory;
        // deserialize Memory to Objects

        this.structure = {
            creeps: {
                cls: Creep,
                memory: "creeps",
                alive: [],
                dead: []
            },
            structures: {
                cls: Structure,
                memory: "structures",
                alive: [],
                dead: []
            }
        };

        for(let key in this.structure){
            this.loadFromGame(this.structure[key]);
        }
    }

    run() {
        if (Game.cpu.bucket > 9000) {
            Game.cpu.generatePixel();
        }

        this.phase__init();
    }

    end() {
        for (let key in this.structure) {
            for (let i in this.structure[key].alive) {
                this.memory[this.structure[key].memory][this.structure[key].alive[i].id] = this.structure[key].alive[i].dumpMemory();
            }
            for (let i in this.structure[key].dead) {
                delete this.memory[this.structure[key].memory][this.structure[key].alive[i].id];
            }
        }
    }

    loadFromGame(structure) {
        for (let name in Game[structure.memory]) {
            let id = Game[structure.memory][name].id;
            let memoryId = DukeMemory.encodeId(Game[structure.memory][name].id);
            let obj = new structure.cls(
                Object.assign({
                    id: id
                },
                    this.memory[structure.memory][memoryId]
                )
            );
            if (obj.isAlive()) {
                structure.alive.push(obj);
            } else {
                structure.dead.push(obj);
            }
        }
    }

    phase__init() {

    }

}

module.exports = TheDuke;