class TheDuke {
    init() {
        if (!Mem._v || Mem._v != SCRIPT_VERSION) {
            Mem._v = SCRIPT_VERSION;
            console.log('New code version: ', SCRIPT_VERSION);
        }

        this.structure = {
            creeps: {
                id: "id",
                loader: "game",
                cls: DukeCreep,
                memory: "creeps",
                alive: [],
                dead: []
            },
            structures: {
                id: "id",
                loader: "game",
                cls: DukeStructure,
                memory: "structures",
                alive: [],
                dead: []
            },
            tasks: {
                id: "id",
                loader: "memory",
                cls: DukeTaskFactory,
                memory: "tasks",
                alive: [],
                dead: [],
            },
            rooms: {
                id: "name",
                loader: "rooms",
                cls: DukeRoom,
                memory: "rooms",
                alive: {},
                dead: {}
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

        this.colony = new DukeColony(
            this.structure.creeps.alive,
            this.structure.structures.alive,
            this.structure.rooms.alive,
            this.structure.tasks.alive
        );

        this.colony.announceDead(
            this.structure.creeps.dead,
            this.structure.structures.dead,
            this.structure.rooms.dead
        );
    }

    loadFromGame(structure) {
        for (let name in Game[structure.memory]) {
            let id = Game[structure.memory][name][structure.id];
            let memoryId = DukeMemory.encodeId(Game[structure.memory][name][structure.id]);
            let obj = new structure.cls(
                Object.assign({
                        id: id
                    },
                    Mem[structure.memory][memoryId]
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
        for (let name in Mem[structure.memory]) {
            let id = Mem[structure.memory][name][structure.id];
            let memoryId = DukeMemory.encodeId(Mem[structure.memory][name][structure.id]);
            let obj = new structure.cls(
                Object.assign({
                        id: id
                    },
                    Mem[structure.memory][memoryId]
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

    loadRooms(structure) {
        let rooms = this.structure.rooms;
        const createRoom = (name, alive) => {
            rooms[alive ? "alive" : "dead"][name] = new structure.cls(
                Object.assign({
                        id: name
                    },
                    Mem[structure.memory][name]
                ),
                Game[structure.memory][name]
            );
            console.log("creating room " + name);
        };

        ["creeps", "structures", "tasks"].map(key => {
            this.structure[key].alive.map(obj => {
                if (!rooms.alive[obj.api.room.name]) {
                    createRoom(obj.api.room.name, true);
                }
                rooms.alive[obj.api.room.name]['assign' + key.charAt(0).toUpperCase() + key.slice(1)](obj);
            });
            this.structure[key].dead.map(obj => {
                if (!rooms[obj.api.room.name]) {
                    createRoom(obj.api.room.name, false);
                }
            });
        });
    }

    addTask(task) {
        this.structure.tasks.alive[task.id] = task;
        this.structure.rooms.alive[task.api.room.name].assignTasks(task);
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
                Mem[obj.memory][obj.alive[i].id] = obj.alive[i].dumpMemory();
            }

            for (let i in this.structure[key].dead) {
                let obj = this.structure[key];
                delete Mem[obj.memory][obj.dead[i].id];
            }
        }
    }
}

class DukeTaskFactory {
    constructor(memory, api) {
        let taskName = memory.name;
        let taskType = memory.type;

        let taskCls = DukeColony.getTasks();
        if (!taskCls[taskType]) {
            taskCls = new DukeTask(memory, false);
            taskCls.alive = false;
            console.log("Invalid task", taskType);
            return taskCls;
        }
        if (!taskCls[taskType][taskName]) {
            console.log("Invalid task", taskType, taskName);
            taskCls = new DukeTask(memory, false);
            taskCls.alive = false;
            return taskCls;
        }

        return new (DukeColony.getTasks()[taskType][taskName])(memory, api);
    }
}

module.exports = TheDuke;