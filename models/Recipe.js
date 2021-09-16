module.exports.new = function(recipe, ingredients, steps){
    newRecipe = {};
    newRecipe.recipe = {};
    newRecipe.recipe.id = recipe.id;
    newRecipe.recipe.name = recipe.recipe_name;
    newRecipe.recipe.description = recipe.recipe_description;
    newRecipe.recipe.servings = recipe.servings;
    newRecipe.recipe.duration = recipe.duration_minutes;
    newRecipe.recipe.url = "/recipes/"+recipe.id;

    newRecipe.ingredients = ingredients;
    newRecipe.steps = steps;

    minutes = recipe.duration_minutes % 60;
    hours = (recipe.duration_minutes - minutes) / 60;

    newRecipe.recipe.duration_formatted = (hours>0)?(hours+'h'):'' + minutes + "min";


    return newRecipe;
}