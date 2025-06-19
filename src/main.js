/* Servers:
official - None yet
server1.screepspl.us - overmind test
screeps.space - The Duke (testing phase)
*/

require('version');

const injectLogger = require('utils.logger');
const initCache = require("utils.cache");

global._ = require('lodash');
global.DukeMemory = require('utils.memory');
global.DukeObject = require('utils.DukeObject');
global.DukeObjectTaskExecutor = require('utils.DukeObjectTaskExecutor');
global.nanoid = require('utils.nanoid');


let SIMULATION = false;
if (global.navigator) {
    SIMULATION = true;
}

if (!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION) {
    Memory.SCRIPT_VERSION = SCRIPT_VERSION;
    console.log('New code version: ', SCRIPT_VERSION);
}

const _TheDuke = require('TheDuke');

module.exports.loop = () => {
    if (SIMULATION) {
        Game.cpu.limit = 20;
        Game.cpu.tickLimit = 500;
        Game.cpu.bucket = 1000;
    }

    injectLogger();
    console.log("--===---------- Loop " + Game.time + " Started ----------===--");

    global.TheDuke = new _TheDuke();

    DukeMemory.loadState(initCache);

    try {
        TheDuke.init(DukeMemory.state);
        TheDuke.run();
        TheDuke.end();
    } catch(e) {
        console.log(e.stack);
        throw e;
    }

    DukeMemory.saveState();

    if (typeof Game.cpu.getHeapStatistics === "function") {
        let heapStats = Game.cpu.getHeapStatistics();
        if (heapStats) {
            let heapPercent = Math.round(((heapStats.total_heap_size + heapStats.externally_allocated_size) / heapStats.heap_size_limit) * 100);
            console.log("------ MEM: heap usage:", Math.round((heapStats.total_heap_size) / 1048576), "MB +", Math.round((heapStats.externally_allocated_size) / 1048576), "MB of", Math.round(heapStats.heap_size_limit / 1048576), "MB (", heapPercent, "% )");
        }
    }

    console.log("--===---------- Loop Ended (used cpu: " + Game.cpu.getUsed().toFixed(2) + "/" + Game.cpu.limit + " (" + Game.cpu.tickLimit + "))----------===--");
};