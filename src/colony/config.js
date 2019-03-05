global.CreepTypes = {};
global.TaskTypes = {};
global.CreepConfigs = {};
var creeps = [
	require("creeps.roles.harvester"),
	require("creeps.roles.upgrader"),
	require("creeps.roles.wanderer"),
	require("creeps.roles.attacker"),
];
var tasks = [
  require("creeps.tasks.idle"),
  require("creeps.tasks.moveToTarget"),
  require("creeps.tasks.moveXY"),
  require("creeps.tasks.harvest"),
  require("creeps.tasks.transfer"),
  require("creeps.tasks.upgradeController"),
  require("creeps.tasks.attack"),
];


for(var i in creeps){
  CreepConfigs[creeps[i].config.role] = creeps[i].config;
  CreepTypes[creeps[i].config.role] = creeps[i];
}

for(var i in tasks){
  TaskTypes[tasks[i].config.task] = tasks[i];
}
