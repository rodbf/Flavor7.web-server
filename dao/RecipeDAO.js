const RecipeDB = require('./db/RecipeDB');
const RecipeIngredientDB = require('./db/RecipeIngredientDB');
const RecipeStepDB = require('./db/RecipeStepDB');

const con = require('./connection/pool');
const recipeFormatter = require('./formatters/RecipeFormatter');

const recipeIngredientDAO = require('./RecipeIngredientDAO');
const recipeStepDAO = require('./RecipeStepDAO');

const async = require('async');

module.exports.getAll = function(callback){
    let output = {};
    const query = "SELECT "+RecipeDB.ID+", "+RecipeDB.NAME+" FROM "+RecipeDB.TABLE+" ORDER BY "+RecipeDB.NAME;
    con.query(query, (err, result) => {
        if(err){
            callback(err);
        }
        else if (result.length < 1){
            callback("Não há receitas cadastradas");
        }
        else {
            output = recipeFormatter.formatJsonArray(result);
            callback(null, output);
        }
    })
}

module.exports.findById = function(id, callback){
    let output = {};
    const query = "SELECT * FROM "+RecipeDB.TABLE+
                    " WHERE "+RecipeDB.ID+" = ?";
    con.query(query, [[id]], (err, result) => {
        if(err){
            callback(err);
        } else if (result.length > 0){
            async.parallel(
                {
                    ingredients: (callback) => {
                        recipeIngredientDAO.findByRecipeId(id, callback);
                    },
                    steps: (callback) => {
                        recipeStepDAO.findByRecipeId(id, callback);
                    }
                }, 
                (err, results) => {
                    recipe = {};
                    recipe.recipe = result[0];
                    recipe.ingredients = results.ingredients;
                    recipe.steps = results.steps;
                    output = recipeFormatter.formatJsonObject(recipe);
                    callback(null, output);
                }
            );
        }
        else callback("Receita "+id+" não existe");
    })
}

module.exports.writeRecipe = function(recipe, callback){
    const query = "INSERT INTO "+RecipeDB.TABLE+"("+RecipeDB.NAME+", "+RecipeDB.DESCRIPTION+", "+
                                                    RecipeDB.SERVINGS+", "+RecipeDB.DURATION+")"+
                    " VALUES(?,?,?,?)"
    con.query(query, [[recipe.recipe.name], [recipe.recipe.description], [recipe.recipe.servings], [recipe.recipe.duration]], (err, result) => {
        recipeID = result.insertId;

        async.parallel({
                ingredients: (callback) => {
                    recipeIngredientDAO.writeIngredients(recipeID, recipe.ingredients, callback);
                },
                steps: (callback) => {
                    recipeStepDAO.writeSteps(recipeID, recipe.steps, callback);
                }
            },
            (err, results) => {
                callback(err, result, recipeID);
            }
        )
    });
}

module.exports.updateRecipe = function(recipeId, recipe, callback){
    async.parallel({
            recipe: callback => {
                const query = "UPDATE "+RecipeDB.TABLE+" SET ? WHERE ?";
                let data = {};
                data[RecipeDB.NAME] = recipe.recipe.name;
                data[RecipeDB.DURATION] = recipe.recipe.duration;
                data[RecipeDB.SERVINGS] = recipe.recipe.servings;
                data[RecipeDB.DESCRIPTION] = recipe.recipe.description;

                let selector = {};
                selector[RecipeDB.ID] = recipeId;
                
                con.query(query, [data, selector], (err, result) => {
                    callback(err, result);
                });
            },
            ingredients: callback => {
                recipeIngredientDAO.deleteIngredientsByRecipeId(recipeId, (err, result) => {
                    recipeIngredientDAO.writeIngredients(recipeId, recipe.ingredients, (err, result) => {
                        callback(err, result);
                    })
                })
            },
            steps: callback => {
                recipeStepDAO.deleteStepsByRecipeId(recipeId, (err, result) => {
                    recipeStepDAO.writeSteps(recipeId, recipe.steps, (err, result) => {
                        callback(err, result);
                    })
                })
            }
        },
        (err, results) => {
            callback(err, results);
        }
    );
}

module.exports.delete = function(id, callback){
    const query = "DELETE FROM "+RecipeDB.TABLE+
                    " WHERE("+RecipeDB.ID+" = ?)";
    con.query(query, [[id]], (err, result) => {
        callback(err, result);
    })
}

module.exports.findByStepId = function(id, callback){
    const query = "SELECT r."+RecipeDB.ID+", "+RecipeDB.NAME+" name"+
                " FROM "+RecipeDB.TABLE+" r"+
                " JOIN "+RecipeStepDB.TABLE+" rs ON r."+RecipeDB.ID+" = rs."+RecipeStepDB.RECIPE_ID+
                " WHERE rs."+RecipeStepDB.STEP_ID+" = ?";
    con.query(query, [[id]], (err, result) => {
        callback(err, result);
    })
}

module.exports.findByIngredientId = function(id, callback){
    const query = "SELECT r."+RecipeDB.ID+", "+RecipeDB.NAME+" name"+
                " FROM "+RecipeDB.TABLE+" r"+
                " JOIN "+RecipeIngredientDB.TABLE+" rs ON r."+RecipeDB.ID+" = rs."+RecipeIngredientDB.RECIPE_ID+
                " WHERE rs."+RecipeIngredientDB.INGREDIENT_ID+" = ?";
    con.query(query, [[id]], (err, result) => {
        callback(err, result);
    })
}

module.exports.findByActionId = function(id, callback){
    const query = "SELECT r."+RecipeDB.ID+", "+RecipeDB.NAME+" name"+
                " FROM "+RecipeDB.TABLE+" r"+
                " JOIN "+RecipeStepDB.TABLE+" rs ON r."+RecipeDB.ID+" = rs."+RecipeStepDB.RECIPE_ID+
                " WHERE rs."+RecipeStepDB.ACTION_ID+" = ?";
    con.query(query, [[id]], (err, result) => {
        callback(err, result);
    })
}