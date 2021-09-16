const con = require('./connection/pool');

module.exports.getAll = function(callback){
    let output = {};
    const query = "SELECT id, diet_name as name FROM diets";
    con.query(query, callback);
}

module.exports.getBlacklistedFromTags = (tags, callback) => {
    let tagIds = [];
    for(let i = 0; i < tags.length; i++){
        tagIds.push(tags[i].id);
    }
    let query = "SELECT DISTINCT id_diet as id FROM diet_tag_blacklist WHERE id_tag IN (?)";
    con.query(query, [tagIds], (err, result) => {
        let dietIds = [];
        for(let i = 0; i < result.length; i++){
            dietIds.push(result[i].id);
        }
        callback(err, dietIds)
    });
}

module.exports.getBlacklistedFromTagId = (tagId, callback) => {
    let query = "SELECT id_diet as id FROM diet_tag_blacklist WHERE id_tag = ?";
    con.query(query, tagId, (err, result) => {
        let dietIds = [];
        for(let i = 0; i < result.length; i++){
            dietIds.push(result[i].id);
        }
        callback(err, dietIds)
    });
}

module.exports.registerDietTagBlacklist = (tagId, blacklist, callback) => {
    let query = "INSERT INTO diet_tag_blacklist(id_tag, id_diet) VALUES ?";
    tagsArray = [];
    for(let i = 0; i < blacklist.length; i++){
        newTag = [];
        newTag.push(tagId);
        newTag.push(blacklist[i]);
        tagsArray.push(newTag);
    }
    con.query(query, [tagsArray], (err, result) => callback(err, result));
}

module.exports.updateTagDietBlacklist = (tagId, blacklist, callback) => {
    let delQuery = "DELETE FROM diet_tag_blacklist WHERE id_tag = ?";
    con.query(delQuery, tagId, (err, result) => {
        this.registerDietTagBlacklist(tagId, blacklist, (err, result) => callback(err, result));
    })
}