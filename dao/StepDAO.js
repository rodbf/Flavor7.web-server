const StepDB = require('./db/StepDB');
const con = require('./connection/pool');
const recipeDAO = require('./RecipeDAO');

const stepFormatter = require('./formatters/StepFormatter');

const async = require('async');

module.exports.getAll = function(callback){
    let output = {};
    const query = "SELECT "+StepDB.ID+", "+StepDB.TEXT+" FROM "+StepDB.TABLE+" ORDER BY "+StepDB.ID;
    con.query(query, (err, result) => {
        if(err){
            callback(err);
        }
        else if (result.length < 1){
            callback("Não há passos cadastrados");
        }
        else {
            output = stepFormatter.formatJsonArray(result);
            callback(null, output);
        }
    })
}

module.exports.findById = function(id, callback){
    let output = {};

    async.parallel({
            step: callback => {
                const query = "SELECT * FROM "+StepDB.TABLE+
                                " WHERE "+StepDB.ID+" = ?";
                con.query(query, [[id]], (err, result) => {
                    if(err){
                        callback(err);
                        return;
                    }
                    if(result.length < 1){
                        callback("Passo "+id+" não existe");
                        return;
                    }
                    callback(err, stepFormatter.formatJsonObject(result));
                });
            },
            recipes: callback => {
                recipeDAO.findByStepId(id, callback);
            }
        },
        (err, results)=>{
            callback(err, results.step, results.recipes);
        }
    )

}

module.exports.findByName = function(text, callback){
    let output = {};
    const query = "SELECT * FROM "+StepDB.TABLE+
                    " WHERE "+StepDB.TEXT+" LIKE ? LIMIT 1";
    con.query(query, [["%"+text+"%"]], (err, result) => {
        if(err)
            callback(err);
        else if(result.length == 0)
            callback("Passo "+text+" não existe", null);
        else callback(null, stepFormatter.formatJsonObject(result));
    });
}

module.exports.create = function(text, callback){
    const query = "INSERT INTO "+StepDB.TABLE+
                    "("+StepDB.TEXT+") "+
                    "VALUES(?)";
    con.query(query, [[[text]]], (err, result) => {
        if(err)
            callback(err);
        else
            callback(null, stepFormatter.create(text, result));
    })
}

module.exports.update = function(step, callback){
    const query = "UPDATE "+StepDB.TABLE+" SET "+StepDB.TEXT+" = ? WHERE("+StepDB.ID+" = ?)";
    con.query(query, [step.text, step.id], (err, result) => {
        callback(err, step)
    });
}

module.exports.delete = function(id, callback){
    const query = "DELETE FROM "+StepDB.TABLE+
                    " WHERE("+StepDB.ID+" = ?)";
    con.query(query, [[id]], (err, result) => {
        callback(err, result);
    })
}