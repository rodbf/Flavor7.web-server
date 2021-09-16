const validator = require('express-validator');
const dao = require('../dao/TagDAO');
const dietDAO = require('../dao/DietDAO');
const errHandler = require('./ErrorHandler');
const Tag = require('../models/Tag');

exports.tag_list = function(req, res){
    dao.getAll((err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.render('tags/TagList', {title: 'Lista de tags', tag_list: result});
    })
}

//CREATE
exports.tag_create_get = function(req, res){
    dietDAO.getAll((err, diets) => {
        if(err)
            errHandler(res, err);
        else
            res.render('tags/TagForm', {title: 'Criar tag', diets: diets});
    });
}

exports.tag_create_post = (req, res) => {
    let data = JSON.parse(req.body.data);
    let errors = [];


    var tag = {
        name: data.name
    };
    var blacklist = data.dietBlacklist;

    if(tag.name.trim().length < 2)
        errors.push({msg: "Nome não pode estar vazio"});

    if(errors.length > 0){
        dietDAO.getAll((err, diets) => {
            if(err)
                errHandler(res, err);
            else
                res.render('tags/TagForm', {title: 'Criar tag', tag: tag, errors: errors, diets: diets, blacklist: blacklist});
        });
        return;
    }
    else{
        dao.findByName(tag.name, (err, result) => {
            if(result){
                res.render('tags/TagDetail', {title: 'Tag já existe', tag: result})
            }
            else{
                dao.create(tag.name, blacklist, (err, result) => {
                    if(err)
                        errHandler(res, err);
                    else
                        res.render('tags/TagDetail', {title: 'Tag criada', tag: result})
                })
            }
        })
    }
}

//READ
exports.tag_detail = function(req, res){
    dao.findById(req.params.id, (err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.render('tags/TagDetail', {title: 'Tag', tag: result});
    })
}

//UPDATE
exports.tag_update_get = function(req, res){
    dao.findById(req.params.id, (err, tag) => {
        dietDAO.getAll((err, diets) => {
            dietDAO.getBlacklistedFromTagId(req.params.id, (err, blacklist) => {
                if(err)
                    errHandler(res, err);
                else
                    res.render('tags/TagForm', {title: 'Atualizar tag', tag: tag, diets: diets, blacklist: blacklist});
            });
        });
    });
}

exports.tag_update_post = (req, res) => {
    let data = JSON.parse(req.body.data);
    let errors = [];

    var tag = Tag.new(req.params.id, data.name);
    var blacklist = data.dietBlacklist;

    if(tag.name.trim().length < 2)
            errors.push({msg: "Nome não pode estar vazio"});

    if(errors.length > 0){
        dietDAO.getAll((err, diets) => {
            if(err)
                errHandler(res, err);
            else
                res.render('tags/TagForm', {title: 'Atualizar tag', tag: tag, diets: diets, blacklist: blacklist, errors: errors});
        });
        return;
    }
    else{
        dao.findDuplicate(tag.id, tag.name, (err, result) => {
            if(result){
                if(err)
                    errHandler(res, err);
                else
                    res.render('tags/TagDetail', {title: 'Tag já existe', tag: result});            }
            else{
                dao.update(tag, blacklist, (err, results) => {
                    if(err)
                        errHandler(res, err);
                    else
                        res.render('tags/TagDetail', {title: 'Tag atualizada', tag: tag})
                })
            }
        })
    }
}

//DELETE
exports.tag_delete_get = function(req, res){
    dao.findById(req.params.id, (err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.render('tags/TagDelete', {title: 'Deletar tag', tag: result})
    })
}

exports.tag_delete_post = function(req, res){
    dao.delete(req.params.id, (err, result) => {
        if(err)
            errHandler(res, err);
        else
            res.redirect('/tags/');
    })
}