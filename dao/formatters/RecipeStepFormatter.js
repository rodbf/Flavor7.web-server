const Step = require('../../models/RecipeStep');

module.exports.findByRecipeId = function(dbResult){
    output = [];
    for(var index in dbResult){
        output.push(Step.new(dbResult[index]));
    }
    return output;
}