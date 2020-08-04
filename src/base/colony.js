const availableTasks = [
    require("tasks.task.basic_harvest")
];
const tasks = {};
for(let t of availableTasks) {
    if(!tasks[t.getTaskType()])
        tasks[t.getTaskType()] = {};
    if(!tasks[t.getTaskType()][t.getTaskName()])
        tasks[t.getTaskType()][t.getTaskName()] = t;
}

module.exports = class Colony {
    static get STATE_GROW() {
        return 1;
    };

    static getTasks() {
        return tasks;
    }

    constructor(creeps, structures, rooms, tasks) {
        this.creeps = creeps;
        this.structures = structures;
        this.rooms = rooms;
        this.tasks = tasks;

        this.state = Colony.STATE_GROW;
    }

    announceDead(creeps, structures, rooms) {
         console.log("Creeps Died:", creeps.length);
         console.log("Structures Died:", structures.length);
         console.log("Rooms Died:", rooms.length);
    }

    run() {
        for(let room in this.rooms) {
            room = this.rooms[room];

            room.assignColony(this);
            room.run();
        }
    }
};