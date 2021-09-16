const IngredientDB = require('./db/IngredientDB');
const con = require('./connection/pool');
const recipeDAO = require('./RecipeDAO');

const ingredientFormatter = require('./formatters/IngredientFormatter');

const async = require('async');

module.exports.getAll = function(callback){
    let output = {};
    const query = "SELECT "+IngredientDB.ID+", "+IngredientDB.NAME+" as name, "+IngredientDB.NAME_PLURAL+" as plural, "+IngredientDB.DESCRIPTION+" FROM "+IngredientDB.TABLE+" ORDER BY "+IngredientDB.NAME;
    con.query(query, (err, result) => {
        if(err){
            callback(err);
        } 
        else if (result.length < 1){
            callback("Não há ingredientes cadastrados");
        }
        else {
            output = ingredientFormatter.formatJsonArray(result);
            callback(null, output);
        }
    })
}

module.exports.findById = function(id, callback){
    let output = {};

    async.parallel({
            ingredient: callback => {
                const query = "SELECT * FROM "+IngredientDB.TABLE+
                                " WHERE "+IngredientDB.ID+" = ?";
                con.query(query, [[id]], (err, result) => {
                    if(err){
                        callback(err);
                        return;
                    }
                    if(result.length < 1){
                        callback("Ingrediente "+id+" não existe");
                        return;
                    }
                    callback(err, ingredientFormatter.formatJsonObject(result));
                });
            },
            recipes: callback => {
                recipeDAO.findByIngredientId(id, callback);
            },
            tags: callback => {
                const query = "SELECT id_tags FROM ingredients_tags WHERE id_ingredients = ?";
                con.query(query, [[id]], (err, result) => {
                    callback(err, result);
                })
            }
        },
        (err, results)=>{
            results.ingredient.tags = [];
            for (var i = 0; i < results.tags.length; i++){
                results.ingredient.tags.push(results.tags[i].id_tags);
            }
            callback(err, results.ingredient, results.recipes);
        }
    );
}

module.exports.findByName = function(name, callback){
    let output = {};
    const query = "SELECT * FROM "+IngredientDB.TABLE+
                    " WHERE "+IngredientDB.NAME+" = ? LIMIT 1";
    con.query(query, [[name]], (err, result) => {
        if(err)
            callback(err);
        else if(result.length == 0)
            callback("Ingrediente "+name+" não existe", null);
        else callback(null, ingredientFormatter.formatJsonObject(result));
    });
}

module.exports.create = function(ingredient, callback){
    async.waterfall(
        [
            (callback) => {
                const query = "INSERT INTO "+IngredientDB.TABLE+"("+IngredientDB.NAME+", "+IngredientDB.NAME_PLURAL+", "+IngredientDB.DESCRIPTION+") "+"VALUES(?)";
                con.query(query, [[ingredient.name, ingredient.plural, ingredient.description]], (err, result) => callback(err, result.insertId));
            },
            (insertId, callback) => {
                if(ingredient.tags.length < 1){
                    callback(null, insertId);
                    return;
                }

                const query = "INSERT INTO ingredients_tags(id_ingredients, id_tags) VALUES(?)";
                let tagargs = [];

                for (var i = 0; i < ingredient.tags.length; i++){
                    tagargs.push([insertId, ingredient.tags[i]]);
                }
                con.query(query, tagargs, (err, result) => callback(err, insertId));
            }
        ],
        (err, result) => {
            output = ingredientFormatter.create({name: ingredient.name, plural: ingredient.plural, id: result, description: ingredient.description});
            console.log('output', output);
            callback(err, output);
        }
    );
    
}

module.exports.update = function(ingredient, callback){
    async.parallel(
        [
            (callback) => {
                const query = "UPDATE "+IngredientDB.TABLE+" SET "+IngredientDB.NAME+" = ?, "+IngredientDB.NAME_PLURAL+" = ?, "+IngredientDB.DESCRIPTION+" = ? WHERE("+IngredientDB.ID+" = ?)";
                con.query(query, [ingredient.name, ingredient.plural, ingredient.description, ingredient.id], (err, result) => {
                    callback(err, ingredient);
                });
            },
            (callback) => {
                const del = "DELETE FROM ingredients_tags WHERE id_ingredients = ?";
                const ins = "INSERT INTO ingredients_tags(id_ingredients, id_tags) VALUES ?";
                con.query(del, ingredient.id, (err, result) => {
                    if(ingredient.tags.length < 1){
                        callback(err, result);
                        return;
                    }
                    let tagargs = [];

                    for(var i = 0; i < ingredient.tags.length; i++){
                        tagargs.push([ingredient.id, ingredient.tags[i]]);
                    }
                    con.query(ins, [tagargs], (err, result) => {
                        callback(err, result)
                    });
                })
            }
        ],
        (err, results) => {
            callback(err, results);
        })
}

module.exports.delete = function(id, callback){
    const query = "DELETE FROM "+IngredientDB.TABLE+
                    " WHERE("+IngredientDB.ID+" = ?)";
    con.query(query, [[id]], (err, result) => {
        if(err){
            callback(err);
            return;
        }
        callback(err, result);
    })
}