const UnitDB = require('../db/UnitDB');

module.exports.getAll = function(dbResult){
	let output = []
	for(var index in dbResult){
		newUnit = {};
		newUnit.id = dbResult[index][UnitDB.ID];
		newUnit.name = dbResult[index][UnitDB.NAME];
		newUnit.plural = dbResult[index][UnitDB.NAME_PLURAL];
		output.push(newUnit);
	}
	return output;
}