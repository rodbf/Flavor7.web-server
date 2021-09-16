const TagDB = require("../db/TagDB");
const Tag = require("../../models/Tag");

module.exports.formatJsonArray = function(dbResult){
    output = [];
    for (var index in dbResult){
        newTag = Tag.new(dbResult[index][TagDB.ID], dbResult[index][TagDB.NAME]);
        output.push(newTag);
    }
    return output;
}

module.exports.formatJsonObject = function(dbResult){
    newTag = Tag.new(dbResult[0][TagDB.ID], dbResult[0][TagDB.NAME]);
    return newTag;
}

module.exports.create = function(name, dbResult){
    newTag = Tag.new(dbResult.insertId, name);
    return newTag;
}