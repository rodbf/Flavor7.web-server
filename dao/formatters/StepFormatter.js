const StepDB = require('../db/StepDB');
const Step = require("../../models/Step");

module.exports.getAll = function(dbResult){
	let output = []
	for(var index in dbResult){
		newStep = {};
		newStep.id = dbResult[index][StepDB.ID];
		newStep.text = dbResult[index][StepDB.TEXT];
		output.push(newStep);
	}
	return output;
}

module.exports.formatJsonArray = function(dbResult){
    output = [];
    for (var index in dbResult){
        newStep = Step.new(dbResult[index][StepDB.ID], dbResult[index][StepDB.TEXT]);
        output.push(newStep);
    }
    return output;
}

module.exports.formatJsonObject = function(dbResult){
    newStep = Step.new(dbResult[0][StepDB.ID], dbResult[0][StepDB.TEXT]);
    return newStep;
}

module.exports.create = function(text, dbResult){
    newStep = Step.new(dbResult.insertId, text);
    return newStep;
}