const UnitDB = require('./db/UnitDB');
const con = require('./connection/pool');

const unitFormatter = require('./formatters/UnitFormatter');

module.exports.getAll = function(callback){
    let output = {};
    const query = "SELECT "+UnitDB.ID+", "+UnitDB.NAME+", "+UnitDB.NAME_PLURAL+" FROM "+UnitDB.TABLE;
    con.query(query, (err, result) => {
        if(err){
            callback(err);
        } else {
            output = unitFormatter.getAll(result);
            callback(null, output);
        }
    })
}