/* Servers:
official - None yet
server1.screepspl.us - overmind test
screeps.space - The Duke (testing phase)
*/

require('version');

// utils
const injectLogger = require('utils/logger');
global.nanoid = require('utils/nanoid');

// The Duke Requirements
const InitCache = require('utils/cache');

global.WorldPosition = require("3rdparty/worldPosition");
global.DukeMemory = require('utils/memory');
global.DukeObject = require('utils/DukeObject');
global.DukeObjectTaskExecutor = require('utils/DukeObjectTaskExecutor');
global.DukeColony = require('base/colony');
global.DukeTask = require('base/task');
global.DukeCreep = require("base/creep");
global.DukeStructure = require("base/structure");
global.DukeRoom = require("base/room");

// The Duke
global.TheDuke = new (require("TheDuke"))();

let SIMULATION = false;
if (global.navigator) {
    SIMULATION = true;
}

module.exports.loop = () => {
    injectLogger();
    if (SIMULATION) {
        Game.cpu.limit = 20;
        Game.cpu.tickLimit = 500;
        Game.cpu.bucket = 1000;
    }

    console.log("--===---------- Loop " + Game.time + " Started ----------===--");

    DukeMemory.loadState();
    global.Mem = DukeMemory.state;
    global.Cache = InitCache(DukeMemory.state.cache);

    try {
        TheDuke.init();
        TheDuke.run();
        TheDuke.end();
    } catch(e) {
        console.log(e.stack);
        throw e;
    }

    DukeMemory.saveState();

    DukeMemory.clearData();

    if (typeof Game.cpu.getHeapStatistics === "function") {
        let heapStats = Game.cpu.getHeapStatistics();
        if (heapStats) {
            let heapPercent = Math.round(((heapStats.total_heap_size + heapStats.externally_allocated_size) / heapStats.heap_size_limit) * 100);
            console.log("------ MEM: heap usage:", Math.round((heapStats.total_heap_size) / 1048576), "MB +", Math.round((heapStats.externally_allocated_size) / 1048576), "MB of", Math.round(heapStats.heap_size_limit / 1048576), "MB (", heapPercent, "% )");
        }
    }

    console.log("--===---------- Loop Ended (used cpu: " + Game.cpu.getUsed().toFixed(2) + "/" + Game.cpu.limit + " (" + Game.cpu.tickLimit + "))----------===--");
};