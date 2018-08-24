global._ = require('lodash');
global.Logger = require('utils_logger');
require('version')

if (!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION) {
    Memory.SCRIPT_VERSION = SCRIPT_VERSION;
    Logger.log('New code version: ', SCRIPT_VERSION);
}

// requirements
const factory = require('creeps_factory');
factory.init();

module.exports.loop = function() {
    Logger.log("--===---------- Loop " + Game.time + " Started ----------===--");
    Logger.err("doing nothing");
    Logger.log("--===---------- Loop Ended ----------===--");
}