const RecipeIngredientDB = require('../db/RecipeIngredientDB');
const UnitDB = require('../db/UnitDB');
const IngredientDB = require('../db/IngredientDB');
const Ingredient = require('../../models/RecipeIngredient');

module.exports.findByRecipeId = function(dbResult){
    output = [];
    for(var index in dbResult){
        output.push(Ingredient.new(dbResult[index])) ;
    }
    return output;
}