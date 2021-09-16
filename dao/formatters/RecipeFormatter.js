const RecipeDB = require("../db/RecipeDB");
const Recipe = require("../../models/Recipe");

module.exports.formatJsonArray = function(dbResult){
    output = [];
    for (var index in dbResult){
        newRecipe = Recipe.new({id: dbResult[index][RecipeDB.ID], recipe_name: dbResult[index][RecipeDB.NAME]});
        output.push(newRecipe);
    }
    return output;
}

module.exports.formatJsonObject = function(dbResult){
    newRecipe = Recipe.new(dbResult.recipe,
                            dbResult.ingredients,
                            dbResult.steps
                            );
    return newRecipe;
}

module.exports.create = function(name, id){
    json = {ing_name: name, id: id};
    newRecipe = Recipe.new(json);
    return newRecipe;
}