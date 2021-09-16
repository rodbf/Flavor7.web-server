const TagDB = require('./db/TagDB');

const con = require('./connection/pool');
const tagFormatter = require('./formatters/TagFormatter');
const dietDAO = require('./DietDAO');

module.exports.getAll = function(callback){
    let output = {};
    const query = "SELECT * FROM "+TagDB.TABLE;
    con.query(query, (err, result) => {
        if(err){
            callback(err);
        } 
        else if(result.length < 1){
            callback("Não há tags cadastradas");
        }
        else {
            output = tagFormatter.formatJsonArray(result);
            callback(null, output);
        }
    })
}

module.exports.findById = function(id, callback){
    let output = {};
    const query = "SELECT * FROM "+TagDB.TABLE+
                    " WHERE "+TagDB.ID+" = ?";
    con.query(query, [[id]], (err, result) => {
        if(err){
            callback(err);
        }
        else if(result.length < 1){
            callback("Tag "+id+" não existe");
        } else {
            output = tagFormatter.formatJsonObject(result);
            callback(null, output);
        }
    })
}

module.exports.findByName = function(name, callback){
    let output = {};
    const query = "SELECT * FROM "+TagDB.TABLE+
                    " WHERE "+TagDB.NAME+" = ? LIMIT 1";
    con.query(query, [[name]], (err, result) => {
        if(err)
            callback(err);
        else if(result.length == 0)
            callback("Tag "+name+" não existe", null);
        else callback(null, tagFormatter.formatJsonObject(result));
    });
}

module.exports.findDuplicate = function(id, name, callback){
    let query = "SELECT * FROM tags WHERE id != ? AND tag_name = ?";
    con.query(query, [id, name], (err, result) => {
        console.log(err, result);
        if(result.length > 0)
            callback(err, tagFormatter.formatJsonObject(result));
        else
            callback(null, null);
    });
}

module.exports.create = function(name, dietBlacklist, callback){
    const query = "INSERT INTO "+TagDB.TABLE+
                    "("+TagDB.NAME+") "+
                    "VALUES(?)";
    con.query(query, [[[name]]], (err, tagResult) => {
        if(err)
            callback(err);
        else{
            dietDAO.registerDietTagBlacklist(tagResult.insertId, dietBlacklist, (err, result) => {
                callback(null, tagFormatter.create(name, tagResult));
            })
        }
    })
}

module.exports.update = function(tag, blacklist, callback){
    const query = "UPDATE "+TagDB.TABLE+" SET "+TagDB.NAME+" = ? WHERE("+TagDB.ID+" = ?)";
    con.query(query, [tag.name, tag.id], (err, result) => {
        dietDAO.updateTagDietBlacklist(tag.id, blacklist, () => callback(err, tag));
    });
}

module.exports.delete = function(id, callback){
    const query = "DELETE FROM "+TagDB.TABLE+
                    " WHERE("+TagDB.ID+" = ?)";
    con.query(query, [[id]], (err, result) => {
        callback(err, result);
    })
}

module.exports.getTagsFromIngredientIdArray = function(ingredientIds, callback){
    let query = "SELECT DISTINCT it.id_tags as id, t.tag_name as name FROM ingredients_tags it LEFT JOIN tags t ON it.id_tags = t.id WHERE id_ingredients IN (?)";
    let q = con.query(query, [ingredientIds], callback);
}