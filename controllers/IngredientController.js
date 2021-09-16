const validator = require('express-validator');
const dao = require('../dao/IngredientDAO');
const tagDAO = require('../dao/TagDAO');
const errHandler = require('./ErrorHandler');
const Ingredient = require('../models/Ingredient');

exports.ingredient_list = function(req, res){
    dao.getAll((err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.render('ingredients/IngredientList', {title: 'Lista de ingredientes', ingredient_list: result});
    })
}

//CREATE
exports.ingredient_create_get = function(req, res){
    ingredientFormGet(req, res);
}

exports.ingredient_create_post = (req, res) => {
    let ingredient = JSON.parse(req.body.ingredient);

    let errors = [];

    if(!ingredient.name)
        errors.push("Nome do ingrediente em branco");
    if(!ingredient.plural)
        errors.push("Plural do nome do ingrediente em branco");

    if(errors.length > 0){
        ingredientFormGet(req, res, ingredient, errors);
        return;
    }


    dao.findByName(ingredient.name, (err, result) => {
        if(result){
            res.render('ingredients/IngredientDetail', {title: 'Ingrediente já existe', ingredient: result})
        }
        else{
            dao.create(ingredient, (err, result) => {
                if(err)
                    errHandler(res, err);
                else
                    res.redirect(result.url);
            })
        }
    });
}

function ingredientFormGet(req, res, ingredient, errors, title="Cadastrar ingrediente"){
    tagDAO.getAll((err, result) =>{
        if(err)
            errHandler(res, err);
        else{
            res.render('ingredients/IngredientForm',
                {
                    title: title,
                    taglist: result,
                    ingredient: ingredient,
                    errors: errors
                })
        }
    })
}


//READ
exports.ingredient_detail = function(req, res){
    dao.findById(req.params.id, (err, ingredient, recipe_list) => {
        if(err)
            errHandler(res, err);
        else
            res.render('ingredients/IngredientDetail', {title: 'Ingrediente', ingredient: ingredient, recipe_list: recipe_list});
    })
}

//UPDATE
exports.ingredient_update_get = function(req, res){
    dao.findById(req.params.id, (err, ingredient) => {
        if(err)
            errHandler(res, err);
        else{
            tagDAO.getAll((err, result) => {
                if(err)
                    errHandler(res, err);
                else{
                    res.render('ingredients/IngredientForm', {title: 'Atualizar ingrediente', ingredient: ingredient, taglist: result});
                }
            })
            
        }
    })
}

exports.ingredient_update_post = (req, res) => {
    let ingredient = JSON.parse(req.body.ingredient);
    ingredient.id = req.params.id;
    ingredient = Ingredient.new(ingredient);
    console.log(ingredient);

    let errors = [];

    if(!ingredient.name)
        errors.push("Nome do ingrediente em branco");
    if(!ingredient.plural)
        errors.push("Plural do nome do ingrediente em branco");
    if(errors.length > 0){
        ingredientFormGet(req, res, ingredient, errors, "Atualizar ingrediente");
        return;
    }

    dao.update(ingredient, (err, results) => {
        if(err)
            errHandler(res, err);
        else
            res.redirect(ingredient.url)
    });
}



//DELETE
exports.ingredient_delete_get = function(req, res){
    dao.findById(req.params.id, (err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.render('ingredients/IngredientDelete', {title: 'Deletar ingrediente', ingredient: result})
    })
}

exports.ingredient_delete_post = function(req, res){
    dao.delete(req.params.id, (err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.redirect('/ingredients/');
    })
}