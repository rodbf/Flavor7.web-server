const validator = require('express-validator');
const dao = require('../dao/StepActionDAO');
const errHandler = require('./ErrorHandler');
const Action = require('../models/StepAction');

exports.action_list = function(req, res){
    dao.getAll((err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.render('actions/ActionList', {title: 'Lista de ações', action_list: result});
    })
}

//CREATE
exports.action_create_get = function(req, res){
    res.render('actions/ActionForm', {title: 'Criar ação'});
}

exports.action_create_post = [
    validator.body('action', 'Texto não pode estar vazio').trim().isLength({min: 1}),
    validator.sanitizeBody('action').escape(),
    (req, res) => {
        const errors = validator.validationResult(req);

        var action = {
            action: req.body.action,
            description: req.body.description
        };

        if(!errors.isEmpty()){
            res.render('actions/ActionForm', {title: 'Criar ação', action: action, errors: errors.array()});
            return;
        }
        else{
            dao.findByName(action.action, (err, result) => {
                if(result){
                    res.render('actions/ActionDetail', {title: 'Ação já existe', action: result})
                }
                else{
                    dao.create(action, (err, result) => {
                        if(err)
                            errHandler(res, err);
                        else
                            res.render('actions/ActionDetail', {title: 'Ação criada', action: result})
                    })
                }
            })
        }
    }
]

//READ
exports.action_detail = function(req, res){
    dao.findById(req.params.id, (err, action, recipe_list) => {
        if(err)
            errHandler(res, err);
        else
            res.render('actions/ActionDetail', {title: 'Ação', action: action, recipe_list: recipe_list});
    })
}

//UPDATE
exports.action_update_get = function(req, res){
    dao.findById(req.params.id, (err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.render('actions/ActionForm', {title: 'Atualizar ação', action: result});
    })
}

exports.action_update_post = [
    validator.body('action', 'Texto não pode estar vazio').trim().isLength({min: 1}),
    validator.sanitizeBody('action').escape(),
    (req, res) => {
        const errors = validator.validationResult(req);



        var action = Action.new({id: req.params.id, action: req.body.action, description: req.body.description});

        if(!errors.isEmpty()){
            res.render('actions/ActionForm', {title: 'Atualizar ação', action: action, errors: errors.array()});
            return;
        }
        else{
            dao.update(action, (err, result) => {
                if(err)
                    errHandler(res, err);
                else
                    res.redirect(action.url);
            })
        }
    }

]

//DELETE
exports.action_delete_get = function(req, res){
    dao.findById(req.params.id, (err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.render('actions/ActionDelete', {title: 'Deletar ação', action: result})
    })
}

exports.action_delete_post = function(req, res){
    dao.delete(req.params.id, (err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.redirect('/actions/');
    })
}