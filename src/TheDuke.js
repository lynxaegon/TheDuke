const Creep = require("creeps.creep");
const Structure = require("structures.structure");

class TheDuke {
    init(memory) {
        this.memory = memory;
        // deserialize Memory to Objects

        this.structure = {
            creeps: {
                loader: "game",
                cls: Creep,
                memory: "creeps",
                alive: [],
                dead: []
            },
            structures: {
                loader: "game",
                cls: Structure,
                memory: "structures",
                alive: [],
                dead: []
            },
            tasks: {
                loader: "memory",
                cls: Task,
                memory: "tasks",
                alive: [],
                dead: []
            }
        };

        for (let key in this.structure) {
            if(this.structure[key].loader == "game") {
                this.loadFromGame(this.structure[key]);
            } else if(this.structure[key].loader == "memory"){
                this.loadFromMemory(this.structure[key]);
            } else {
                console.log("Unknown loader for", JSON.stringify(this.structure[key]));
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
                ),
                structure.opts
            );
            if (obj.isAlive()) {
                structure.alive.push(obj);
            } else {
                structure.dead.push(obj);
            }
        }
    }

    loadFromMemory(structure) {
        for (let name in this.memory[structure.memory]) {
            let id = this.memory[structure.memory][name].id;
            let memoryId = DukeMemory.encodeId(this.memory[structure.memory][name].id);
            let obj = new structure.cls(
                Object.assign({
                        id: id
                    },
                    this.memory[structure.memory][memoryId]
                ),
                structure.opts
            );
            if (obj.isAlive()) {
                structure.alive.push(obj);
            } else {
                structure.dead.push(obj);
            }
        }
    }

    addTask(task) {
        this.structure.tasks.alive[task.id] = task;
        return this;
    }

    // Game Phases

    run() {
        if (Game.cpu.bucket > 9000) {
            Game.cpu.generatePixel();
        }

        this.phase__init();
    }

    phase__init() {
        // this.addTask(new Task({}));
    }

    end() {
        for (let key in this.structure) {
            for (let i in this.structure[key].alive) {
                let obj = this.structure[key];
                this.memory[obj.memory][obj.alive[i].id] = obj.alive[i].dumpMemory();
            }
            for (let i in this.structure[key].dead) {
                let obj = this.structure[key];
                delete this.memory[obj.memory][obj.dead[i].id];
            }
        }
    }

}

module.exports = TheDuke;