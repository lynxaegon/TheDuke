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

// requirements
// const factory = require('creeps_factory');
// factory.init();
const _TheDuke = require('TheDuke');

module.exports.loop = function() {
    Logger.info("--===---------- Loop " + Game.time + " Started ----------===--");

    Mem.gc();
    Mem.format();
	Cache.gc();

    // init The Duke from memory obj
    global.TheDuke = new _TheDuke();

    TheDuke.handler();

    // Run Stats
    // Stats.run();

    Logger.info("--===---------- Loop Ended (used cpu: " + Game.cpu.getUsed() + "/" + Game.cpu.limit + " (" + Game.cpu.tickLimit + "))----------===--");
}


/*
function bodyCost (body) {
    return body.reduce(function (cost, part) {
        return cost + BODYPART_COST[part];
    }, 0);
}
*/
