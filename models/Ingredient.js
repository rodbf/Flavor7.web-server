module.exports.new = function(json){
    newIngredient = {};
    newIngredient.id = json.id;
    newIngredient.name = json.name;
    newIngredient.plural = json.plural;
    newIngredient.description = json.description;
    newIngredient.url = "/ingredients/"+json.id;
    newIngredient.tags = json.tags;
    return newIngredient;
}