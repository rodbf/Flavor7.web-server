const con = require('./connection/pool');

module.exports.getAll = function(callback){
    let output = {};
    const query = "SELECT id, meal_name as name FROM meals ORDER BY id";
    con.query(query, callback);
}