const Creep = require("base.creep");
const Structure = require("base.structure");
const Room = require("base.room");
const Task = require('base.task');
const Colony = require('base.colony');

class TheDuke {
    init(memory) {
        this.memory = memory;
        // deserialize Memory to Objects

        this.structure = {
            creeps: {
                id: "id",
                loader: "game",
                cls: Creep,
                memory: "creeps",
                alive: [],
                dead: []
            },
            structures: {
                id: "id",
                loader: "game",
                cls: Structure,
                memory: "structures",
                alive: [],
                dead: []
            },
            tasks: {
                id: "id",
                loader: "memory",
                cls: Task,
                memory: "tasks",
                alive: [],
                dead: []
            },
            rooms: {
                id: "name",
                loader: "rooms",
                cls: Room,
                memory: "rooms",
                alive: [],
                dead: []
            }
        };

        for (let key in this.structure) {
            if (this.structure[key].loader == "game") {
                this.loadFromGame(this.structure[key]);
            } else if (this.structure[key].loader == "memory") {
                this.loadFromMemory(this.structure[key]);
            } else if (this.structure[key].loader == "rooms") {
                this.loadRooms(this.structure[key]);
            } else {
                console.log("Unknown loader for", JSON.stringify(this.structure[key]));
            }
        }

        this.colony = new Colony(
            this.structure.creeps.alive,
            this.structure.structures.alive,
            this.structure.rooms.alive
        );

        this.colony.announceDead(
            this.structure.creeps.dead,
            this.structure.structures.dead,
            this.structure.rooms.dead
        );
    }

    loadRooms(structure) {
        let rooms = this.structure.rooms;
        const createRoom = (name, alive) => {
            let room = new structure.cls(
                Object.assign({
                        id: name
                    },
                    this.memory[structure.memory][name]
                ),
                Game[structure.memory][name]
            );
            rooms[alive ? "alive" : "dead"][name] = room;
        };

        ["creeps", "structures"].map(key => {
            this.structure[key].alive.map(obj => {
                if(!rooms.alive[obj.api.room.name]){
                    createRoom(obj.api.room.name, true);
                }
                rooms.alive[obj.api.room.name]['assign' + key.charAt(0).toUpperCase() + key.slice(1)](obj);
            });
            this.structure[key].dead.map(obj => {
                if(!rooms[obj.api.room.name]){
                    createRoom(obj.api.room.name, false);
                }
            });
        })
    }

    loadFromGame(structure) {
        for (let name in Game[structure.memory]) {
            let id = Game[structure.memory][name][structure.id];
            let memoryId = DukeMemory.encodeId(Game[structure.memory][name][structure.id]);
            let obj = new structure.cls(
                Object.assign({
                        id: id
                    },
                    this.memory[structure.memory][memoryId]
                ),
                Game[structure.memory][name]
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
            let id = this.memory[structure.memory][name][structure.id];
            let memoryId = DukeMemory.encodeId(this.memory[structure.memory][name][structure.id]);
            let obj = new structure.cls(
                Object.assign({
                        id: id
                    },
                    this.memory[structure.memory][memoryId]
                ),
                false
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

        this.colony.run();
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