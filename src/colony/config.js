global.RoleToCreepClass = {};
global.CreepConfigs = {}
global.CreepTypes = [
  require("creeps.roles.wanderer"),
  require("creeps.roles.harvester"),
  require("creeps.roles.upgrader")
]
for(var i in CreepTypes){
  CreepConfigs[CreepTypes[i].config.role] = CreepTypes[i].config;
}
