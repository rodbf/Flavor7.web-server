const StepAction = require("../../models/StepAction");

module.exports.formatJsonArray = function(dbResult){
    output = [];
    for (var index in dbResult){
        newAction = StepAction.new(dbResult[index]);
        output.push(newAction);
    }
    return output;
}

module.exports.formatJsonObject = function(dbResult){
    newAction = StepAction.new(dbResult[0], dbResult[0]);
    return newAction;
}

module.exports.create = function(action, dbResult){
    newAction = StepAction.new({id: dbResult.insertId, action: action.action, description: action.description});
    return newAction;
}