const validator = require('express-validator');

const recipeDAO = require('../dao/RecipeDAO');
const ingredientDAO = require('../dao/IngredientDAO');
const stepActionDAO = require('../dao/StepActionDAO');
const unitDAO = require('../dao/UnitDAO');
const tagDAO = require('../dao/TagDAO');
const mealDAO = require('../dao/MealDAO');
const dietDAO = require('../dao/DietDAO');

const recipePublisher = require('../dao/publisher/RecipePublisherDAO');

const errHandler = require('./ErrorHandler');
const Recipe = require('../models/Recipe');

const async = require('async');

exports.recipe_list = function(req, res){
    recipeDAO.getAll((err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.render('recipes/RecipeList', {title: 'Lista de receitas', recipe_list: result});
    })
}

//TEST
exports.recipe_test = function(req, res){
    newStep = require('../models/RecipeStep').new(10, 10, 10, 10, 10, 10, 10, 10, 10);
    newIngredient = require('../models/RecipeIngredient').new(67, 10, 1, 10);
    newRecipe = require('../models/Recipe').new(10, 10, 10, 10, 10, [newIngredient], [newStep]);
    recipeCreateGet(req, res, newRecipe, null);
}

//CREATE
exports.recipe_create_get = function(req, res){
    recipeFormGet(req, res, null, null);
}

function recipeFormGet(req, res, recipe, errors, title='Criar receita'){

    async.parallel({
            actions: (callback) => {
                stepActionDAO.getAll((err, result)=>{
                    if(err)
                        errHandler(res, err);
                    else
                        callback(err, result);
                });
            },
            ingredients: (callback) => {
                ingredientDAO.getAll((err, result)=>{
                    if(err)
                        errHandler(res, err);
                    else
                        callback(err, result);
                });
            },
            units: (callback) => {
                unitDAO.getAll((err, result)=>{
                    if(err)
                        errHandler(res, err);
                    else
                        callback(err, result);
                });
            }
        },
        (err, results) => {
            res.render('recipes/RecipeForm', 
                {
                    title: title, 
                    action_list: results.actions, 
                    ingredient_list: results.ingredients,
                    unit_list: results.units,
                    recipe: recipe,
                    errors: errors
                }
            );
        }
    )
}



exports.recipe_create_post = (req, res) => {
    let recipe = JSON.parse(req.body.recipe);
    let errors = [];

    for(var i in recipe.recipe)
        if(recipe.recipe[i]==='')
            recipe.recipe[i]=null;

    for(var i in recipe.ingredients)
        for(var j in recipe.ingredients[i])
            if(recipe.ingredients[i][j] === '')
                recipe.ingredients[i][j] = null
        
    for(var i in recipe.steps)
        for(var j in recipe.steps[i])
            if(recipe.steps[i][j]==='')
                recipe.steps[i][j]=null;

    if(recipe.recipe.name == null)
        errors.push("Nome da receita em branco");
    if(recipe.recipe.duration == null)
        errors.push("Tempo de preparo em branco");
    if(recipe.recipe.servings == null)
        errors.push("Porções em branco");
    for(var index in recipe.ingredients){
        ing = recipe.ingredients[index];
        if(ing.ingredient_id == null)
            errors.push("Ingrediente em branco");
        if(ing.amount == null)
            errors.push("Quantidade do ingrediente em branco");
        if(ing.unit_id == null)
            errors.push("Unidade do ingrediente em branco");
    }
    for(var index in recipe.steps){
        step = recipe.steps[index];
        if(step.step_text == null)
            errors.push("Passo em branco");
    }
    if(errors.length > 0){
        recipeFormGet(req, res, recipe, errors);
        return;
    }
    else{
        recipeDAO.writeRecipe(recipe, (err, result, insertID) =>{
            if(err)
                errHandler(res, err);
            else
                res.redirect("/recipes/"+insertID);
        });
    }
}


//READ
exports.recipe_detail = function(req, res){
    recipeDAO.findById(req.params.id, (err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.render('recipes/RecipeDetail', {title: 'Receita', recipe: result});
    })
}

//UPDATE
exports.recipe_update_get = function(req, res){
    recipeDAO.findById(req.params.id, (err, result) => {
        if(err)
            errHandler(res, err);
        else
            recipeFormGet(req, res, result, null, 'Atualizar receita');
    })
}

exports.recipe_update_post = function(req, res){
    let recipe = JSON.parse(req.body.recipe);
    let errors = [];

    for(var i in recipe.recipe)
        if(recipe.recipe[i]==='')
            recipe.recipe[i]=null;

    for(var i in recipe.ingredients)
        for(var j in recipe.ingredients[i])
            if(recipe.ingredients[i][j] === '')
                recipe.ingredients[i][j] = null
        
    for(var i in recipe.steps)
        for(var j in recipe.steps[i])
            if(recipe.steps[i][j]==='')
                recipe.steps[i][j]=null;

    if(recipe.recipe.name == null)
        errors.push("Nome da receita em branco");
    if(recipe.recipe.duration == null)
        errors.push("Tempo de preparo em branco");
    if(recipe.recipe.servings == null)
        errors.push("Porções em branco");
    for(var index in recipe.ingredients){
        ing = recipe.ingredients[index];
        if(ing.ingredient_id == null)
            errors.push("Ingrediente em branco");
        if(ing.amount == null)
            errors.push("Quantidade do ingrediente em branco");
        if(ing.unit_id == null)
            errors.push("Unidade do ingrediente em branco");
    }
    for(var index in recipe.steps){
        step = recipe.steps[index];
        if(step.step_text == null)
            errors.push("Passo em branco");
    }

    if(errors.length > 0){
        recipeFormGet(req, res, recipe, errors, 'Atualizar receita');
        return;
    }
    else{
        recipeDAO.updateRecipe(req.params.id, recipe, (err, result) =>{
        if(err)
            errHandler(res, err);
        else
            res.redirect("/recipes/"+req.params.id);
        });
    }
}

//DELETE
exports.recipe_delete_get = function(req, res){
    recipeDAO.findById(req.params.id, (err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.render('recipes/RecipeDelete', {title: 'Deletar receita', recipe: result.recipe})
    })
}

exports.recipe_delete_post = function(req, res){
    recipeDAO.delete(req.params.id, (err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.redirect('/recipes/');
    })
}

//PUBLISH
exports.recipe_publish_get = function(req, res){
    getPublishObject(req.params.id, (err, data) => res.render('recipes/RecipePublisher', {title: 'Publicar receita', data: data}));
}

exports.recipe_publish_post = function(req, res){
    let data = JSON.parse(req.body.data);
    recipePublisher.publish(data, (err, publishedId) => {
        recipeDAO.findById(req.params.id, (err, result) => {
            if(err)
                errHandler(res, err);
            else
                res.render('recipes/RecipeDetail', {title: 'Receita publicada com sucesso - Disponível no app (id '+publishedId+')', recipe: result});
        });
    });
}

function getPublishObject(recipeId, callback){
    recipeDAO.findById(recipeId, (err, result) => {
        let data = {};
        data.recipe = {};

        data.recipe.id = result.recipe.id;
        data.recipe.name = result.recipe.name;
        data.recipe.description = result.recipe.description;
        data.recipe.servings = result.recipe.servings;
        data.recipe.duration = result.recipe.duration;

        data.ingredients = [];
        let ingIds = [];

        for(let i = 0; i < result.ingredients.length; i++){
            let newIng = {};
            newIng.id = result.ingredients[i].ingredient_id;
            newIng.position = result.ingredients[i].position;
            newIng.text = result.ingredients[i].formatted;
            data.ingredients.push(newIng);
            ingIds.push(result.ingredients[i].ingredient_id);
        }

        data.steps = [];

        for(let i = 0; i < result.steps.length; i++){
            let newStep = {};
            newStep.position = result.steps[i].position;
            newStep.text = result.steps[i].formatted;
            data.steps.push(newStep);
        }

        async.parallel([
                (callback) => {
                    tagDAO.getTagsFromIngredientIdArray(ingIds, (err, result) => {
                        data.tags = result;
                        if(result.length < 1){
                            data.disabledDiets = [];
                            callback(err, true);
                        }
                        else{
                            dietDAO.getBlacklistedFromTags(data.tags, (err, result) => {
                                data.disabledDiets = result;
                                callback(err, true);
                            });
                        }
                    });
                },
                (callback) => {
                    mealDAO.getAll((err, result) => {
                        data.meals = result;
                        callback(err, true);
                    });
                },
                (callback) => {
                    dietDAO.getAll((err, result) => {
                        data.diets = result;
                        callback(err, true);
                    });
                }
            ],
            (err, results) => {
                callback(err, data);
            }
        );
    });
}