/* Servers:
official - None yet
server1.screepspl.us - overmind test
screeps.space - The Duke (testing phase)
*/

require('version');

global._ = require('lodash');
global.Logger = require('utils.logger');
global.Mem = require('utils.memory');
global.Cache = require('utils.cache');

// 3rd party
require("3rdparty.traveler");

if (!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION) {
    Memory.SCRIPT_VERSION = SCRIPT_VERSION;
    Logger.info('New code version: ', SCRIPT_VERSION);
}

const _TheDuke = require('TheDuke');
module.exports.loop = function() {
    Logger.info("--===---------- Loop " + Game.time + " Started ----------===--");

    Mem.gc();
    Mem.format();
    Cache.gc();

    // init The Duke from memory obj
    global.TheDuke = new _TheDuke();

    TheDuke.handler();

    if (typeof Game.cpu.getHeapStatistics === "function") {
    	let heapStats = Game.cpu.getHeapStatistics();
    	let heapPercent = Math.round(((heapStats.total_heap_size + heapStats.externally_allocated_size) / heapStats.heap_size_limit) * 100);
      console.log("------ MEM: heap usage:",Math.round((heapStats.total_heap_size)/1048576),"MB +",Math.round((heapStats.externally_allocated_size)/1048576),"MB of",Math.round(heapStats.heap_size_limit/1048576),"MB (",heapPercent,"% )");
    }

    Logger.info("--===---------- Loop Ended (used cpu: " + Game.cpu.getUsed() + "/" + Game.cpu.limit + " (" + Game.cpu.tickLimit + "))----------===--");
}
