const StepActionDB = require('../dao/db/StepActionDB');

module.exports.new = function(json){
    newAction = {};
    newAction.id = json[StepActionDB.ID];
    newAction.action = json[StepActionDB.ACTION];
    newAction.description = json[StepActionDB.DESCRIPTION];
    if(newAction.description == null)
    	newAction.description = json.description;
    newAction.url = "/actions/"+json[StepActionDB.ID];
    return newAction;
}