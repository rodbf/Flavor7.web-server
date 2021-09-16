const IngredientDB = require('../db/IngredientDB');
const Ingredient = require('../../models/Ingredient');

module.exports.getAll = function(dbResult){
	let output = []
	for(var index in dbResult){
		newIng = {};
		newIng.id = dbResult[index][IngredientDB.ID];
		newIng.name = dbResult[index][IngredientDB.NAME];
        newIng.description = dbResult[index][IngredientDB.DESCRIPTION];
		output.push(newIng);
	}
	return output;
}

module.exports.formatJsonArray = function(dbResult){
    output = [];
    for (var index in dbResult){
        newIngredient = Ingredient.new(dbResult[index]);
        output.push(newIngredient);
    }
    return output;
}

module.exports.formatJsonObject = function(dbResult){
    newIngredient = Ingredient.new({id: dbResult[0].id, name: dbResult[0].ing_name, plural: dbResult[0].ing_name_plural, description: dbResult[0].description});
    return newIngredient;
}

module.exports.create = function(json){
    newIngredient = Ingredient.new({id: json.id, name: json.name, plural: json.plural, description: json.description});
    return newIngredient;
}