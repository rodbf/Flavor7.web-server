const validator = require('express-validator');
const dao = require('../dao/StepDAO');
const errHandler = require('./ErrorHandler');
const Step = require('../models/Step');

exports.step_list = function(req, res){
    dao.getAll((err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.render('steps/StepList', {title: 'Lista de passos', step_list: result});
    })
}

//CREATE
exports.step_create_get = function(req, res){
    res.render('steps/StepForm', {title: 'Criar passo'});
}

exports.step_create_post = [
    validator.body('text', 'Texto não pode estar vazio').trim().isLength({min: 1}),
    validator.sanitizeBody('text').escape(),
    (req, res) => {
        const errors = validator.validationResult(req);

        var step = {
            text: req.body.text
        };

        if(!errors.isEmpty()){
            res.render('steps/StepForm', {title: 'Criar passo', step: step, errors: errors.array()});
            return;
        }
        else{
            dao.findByName(step.text, (err, result) => {
                if(result){
                    res.render('steps/StepDetail', {title: 'Passo já existe', step: result})
                }
                else{
                    dao.create(step.text, (err, result) => {
                        if(err)
                            errHandler(res, err);
                        else
                            res.render('steps/StepDetail', {title: 'Passo criado', step: result})
                    })
                }
            })
        }
    }
]

//READ
exports.step_detail = function(req, res){
    dao.findById(req.params.id, (err, step, recipe_list) => {
        if(err)
            errHandler(res, err);
        else
            res.render('steps/StepDetail', {title: 'Passo', step: step, recipe_list: recipe_list});
    })
}

//UPDATE
exports.step_update_get = function(req, res){
    dao.findById(req.params.id, (err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.render('steps/StepForm', {title: 'Atualizar passo', step: result});
    })
}

exports.step_update_post = [
    validator.body('text', 'Texto não pode estar vazio').trim().isLength({min: 1}),
    validator.sanitizeBody('text').escape(),
    (req, res) => {
        const errors = validator.validationResult(req);

        var step = Step.new(req.params.id, req.body.text);

        if(!errors.isEmpty()){
            res.render('steps/StepForm', {title: 'Atualizar passo', step: step, errors: errors.array()});
            return;
        }
        else{
            dao.update(step, (err, result) => {
                if(err)
                    errHandler(res, err);
                else
                    res.redirect(step.url);
            })
        }
    }

]

//DELETE
exports.step_delete_get = function(req, res){
    dao.findById(req.params.id, (err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.render('steps/StepDelete', {title: 'Deletar passo', step: result})
    })
}

exports.step_delete_post = function(req, res){
    dao.delete(req.params.id, (err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.redirect('/steps/');
    })
}