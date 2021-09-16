module.exports.new = function(id, name){
    newTag = {};
    newTag.id = id;
    newTag.name = name;
    newTag.url = "/tags/"+id;
    return newTag;
}