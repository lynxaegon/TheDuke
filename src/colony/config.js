global.CreepTypes = {};
global.TaskTypes = {};
global.CreepConfigs = {}
var creeps = [
  require("creeps.roles.wanderer"),
  require("creeps.roles.harvester"),
  require("creeps.roles.upgrader")
];
var tasks = [
  require("creeps.tasks.moveToTarget"),
  require("creeps.tasks.moveXY"),
  require("creeps.tasks.harvest"),
  require("creeps.tasks.transfer"),
  require("creeps.tasks.upgradeController"),
];


for(var i in creeps){
  CreepConfigs[creeps[i].config.role] = creeps[i].config;
  CreepTypes[creeps[i].config.role] = creeps[i];
}

for(var i in tasks){
  TaskTypes[tasks[i].config.task] = tasks[i];
}
