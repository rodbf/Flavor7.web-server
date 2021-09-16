const RecipeIngredientDB = require('./db/RecipeIngredientDB');
const IngredientDB = require('./db/IngredientDB');
const UnitDB = require('./db/UnitDB');

const con = require('./connection/pool');

const recipeIngredientFormatter = require('./formatters/recipeIngredientFormatter');

module.exports.findByRecipeId = function(id, callback){
    let output = {};
    const query = "SELECT ri.position, ri."+RecipeIngredientDB.UNIT_ID+" id_unit, ri."+RecipeIngredientDB.INGREDIENT_ID+", ri."+RecipeIngredientDB.AMOUNT+", ri."+RecipeIngredientDB.EXTRA_INFO+", i."+IngredientDB.NAME+", i."+IngredientDB.NAME_PLURAL+", u."+UnitDB.NAME+", u."+UnitDB.NAME_PLURAL+
                    " FROM "+RecipeIngredientDB.TABLE+" ri"+
                    " JOIN "+IngredientDB.TABLE+" i ON ri."+RecipeIngredientDB.INGREDIENT_ID+" = i."+IngredientDB.ID+
                    " JOIN "+UnitDB.TABLE+" u ON ri."+RecipeIngredientDB.UNIT_ID+" = u."+UnitDB.ID+
                    " WHERE ri."+RecipeIngredientDB.RECIPE_ID+" = ? ORDER BY ri.position";
    con.query(query, [[id]], (err, result) => {
        if(err){
            callback(err);
        } else {
            output = recipeIngredientFormatter.findByRecipeId(result);
            callback(null, output);
        }
    })
}

module.exports.writeIngredients = function(recipeID, ingredients, callback){
    const query = "INSERT INTO "+RecipeIngredientDB.TABLE+"("+
                            RecipeIngredientDB.RECIPE_ID+", "+RecipeIngredientDB.INGREDIENT_ID+", "+
                            RecipeIngredientDB.AMOUNT+", "+RecipeIngredientDB.UNIT_ID+", "+
                            RecipeIngredientDB.EXTRA_INFO+", position)"+
                    " VALUES ?";
    data = [];
    for (var index in ingredients){
        newIng = [];
        ing = ingredients[index];
        newIng.push(recipeID);
        newIng.push(ing.ingredient_id);
        newIng.push(ing.amount);
        newIng.push(ing.unit_id);
        newIng.push(ing.extrainfo);
        newIng.push(ing.position);
        data.push(newIng);
    }

    con.query(query, [data], (err, result) => {
        callback(err, result);
    });
}

module.exports.deleteIngredientsByRecipeId = function(recipeId, callback){
    const query = "DELETE FROM "+RecipeIngredientDB.TABLE+" WHERE "+RecipeIngredientDB.RECIPE_ID+" = ?";
    con.query(query, [recipeId], (err, result) => {
        callback(err, result);
    });
}