const StepActionDB = require('./db/StepActionDB');
const con = require('./connection/pool');
const recipeDAO = require('./RecipeDAO');

const stepActionFormatter = require('./formatters/StepActionFormatter');

const async = require('async');

module.exports.getAll = function(callback){
    let output = {};
    const query = "SELECT "+StepActionDB.ID+", "+StepActionDB.ACTION+", "+StepActionDB.DESCRIPTION+" FROM "+StepActionDB.TABLE+" ORDER BY "+StepActionDB.ID;
    con.query(query, (err, result) => {
        if(err){
            callback(err);
        }
        else if (result.length < 1){
            callback("Não há ações cadastrados");
        }
        else {
            output = stepActionFormatter.formatJsonArray(result);
            callback(null, output);
        }
    })
}

module.exports.findById = function(id, callback){
    let output = {};

    async.parallel({
            action: callback => {
                const query = "SELECT * FROM "+StepActionDB.TABLE+
                                " WHERE "+StepActionDB.ID+" = ?";
                con.query(query, [[id]], (err, result) => {
                    if(err){
                        callback(err);
                        return;
                    }
                    if(result.length < 1){
                        callback("Ação "+id+" não existe");
                        return;
                    }
                    callback(err, stepActionFormatter.formatJsonObject(result));
                });
            },
            recipes: callback => {
                recipeDAO.findByActionId(id, callback);
            }
        },
        (err, results)=>{
            callback(err, results.action, results.recipes);
        }
    )

}

module.exports.findByName = function(action, callback){
    let output = {};
    const query = "SELECT * FROM "+StepActionDB.TABLE+
                    " WHERE "+StepActionDB.ACTION+" LIKE ? LIMIT 1";
    con.query(query, [["%"+action+"%"]], (err, result) => {
        if(err)
            callback(err);
        else if(result.length == 0)
            callback("Ação "+action+" não existe", null);
        else callback(null, stepActionFormatter.formatJsonObject(result));
    });
}

module.exports.create = function(action, callback){
    const query = "INSERT INTO "+StepActionDB.TABLE+
                    "("+StepActionDB.ACTION+", "+StepActionDB.DESCRIPTION+") "+
                    "VALUES(?, ?)";
    con.query(query, [[action.action], [action.description]], (err, result) => {
        if(err)
            callback(err);
        else
            callback(null, stepActionFormatter.create(action, result));
    })
}

module.exports.update = function(step, callback){
    const query = "UPDATE "+StepActionDB.TABLE+" SET "+StepActionDB.ACTION+" = ?, "+StepActionDB.DESCRIPTION+" = ? WHERE("+StepActionDB.ID+" = ?)";
    con.query(query, [step.action, step.description, step.id], (err, result) => {
        callback(err, step)
    });
}

module.exports.delete = function(id, callback){
    const query = "DELETE FROM "+StepActionDB.TABLE+
                    " WHERE("+StepActionDB.ID+" = ?)";
    con.query(query, [[id]], (err, result) => {
        callback(err, result);
    })
}