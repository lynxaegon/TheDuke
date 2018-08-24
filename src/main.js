global._ = require('lodash');
global.Logger = require('utils_logger');
require('version');

if (!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION) {
    Memory.SCRIPT_VERSION = SCRIPT_VERSION;
    Logger.info('New code version: ', SCRIPT_VERSION);
}

// requirements
// const factory = require('creeps_factory');
const _TheDuke = require('TheDuke');
// factory.init();

module.exports.loop = function() {
    Logger.info("--===---------- Loop " + Game.time + " Started ----------===--");

    // init The Duke from memory obj
    global.TheDuke = new _TheDuke();
    TheDuke.loadFrom(Memory);

    TheDuke.handler();

    // Run Stats
    // Stats.run();

    Logger.info("--===---------- Loop Ended ----------===--");
}