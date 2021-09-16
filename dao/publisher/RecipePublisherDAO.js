const con = require('../connection/pool');
const async = require('async');

exports.publish = (data, callback) => {
    let recipeQuery = "INSERT INTO pub_recipe(id_recipe, recipe_name, recipe_description, duration, servings) VALUES (?)";
    let recipeData = [data.recipe.id, data.recipe.name, data.recipe.description, data.recipe.duration, data.recipe.servings];
    let q = con.query(recipeQuery, [recipeData], (err, result) => {
        console.log("RecipePublisherDAO.publish.recipeQuery.result", err, result);
        console.log(q.sql);
        let recipeId = result.insertId;

        async.parallel(
            {
                steps: (callback) => writeSteps(recipeId, data.steps, callback),
                ingredients: (callback) => writeIngredients(recipeId, data.ingredients, callback),
                diets: (callback) => writeDiets(recipeId, data.enabledDiets, callback),
                meals: (callback) => writeMeals(recipeId, data.meals, callback),
                tags: (callback) => writeTags(recipeId, data.tags, callback)
            },
            (err, results) => {
                console.log(err, results);
                callback(err, recipeId);
            }
        );
    });

}

function writeSteps(recipeId, steps, callback){
    if(steps.length == 0){
        callback(null, "empty array");
        return;
    }
    let query = "INSERT INTO pub_recipe_steps(id_recipe, position, content) VALUES ?";
    let stepsArray = [];
    for(let i = 0; i < steps.length; i++){
        newStep = [];
        newStep.push(recipeId);
        newStep.push(steps[i].position);
        newStep.push(steps[i].text);
        stepsArray.push(newStep);
    }
    con.query(query, [stepsArray], (err, result) => callback(err, result));
}

function writeIngredients(recipeId, ingredients, callback){
    if(ingredients.length == 0){
        callback(null, "empty array");
        return;
    }
    let query = "INSERT INTO pub_recipe_ingredients(id_recipe, id_ingredient, position, content) VALUES ?";
    let ingredientsArray = [];
    for(let i = 0; i < ingredients.length; i++){
        newIngredient = [];
        newIngredient.push(recipeId);
        newIngredient.push(ingredients[i].id);
        newIngredient.push(ingredients[i].position);
        newIngredient.push(ingredients[i].text);
        ingredientsArray.push(newIngredient);
    }
    con.query(query, [ingredientsArray], (err, result) => callback(err, result));
}

function writeDiets(recipeId, diets, callback){
    if(diets.length == 0){
        callback(null, "empty array");
        return;
    }
    let query = "INSERT INTO pub_recipe_diet(id_recipe, id_diet) VALUES ?";
    let dietsArray = [];
    for(let i = 0; i < diets.length; i++){
        newDiet = [];
        newDiet.push(recipeId);
        newDiet.push(diets[i]);
        dietsArray.push(newDiet);
    }
    con.query(query, [dietsArray], (err, result) => callback(err, result));
}

function writeMeals(recipeId, meals, callback){
    if(meals.length == 0){
        callback(null, "empty array");
        return;
    }
    let query = "INSERT INTO pub_recipe_meal(id_recipe, id_meal) VALUES ?";
    let mealsArray = [];
    for(let i = 0; i < meals.length; i++){
        newMeal = [];
        newMeal.push(recipeId);
        newMeal.push(meals[i]);
        mealsArray.push(newMeal);
    }
    con.query(query, [mealsArray], (err, result) => callback(err, result));
}

function writeTags(recipeId, tags, callback){
    if(tags.length == 0){
        callback(null, "empty array");
        return;
    }
    let query = "INSERT INTO pub_recipe_tags(id_recipe, id_tag) VALUES ?";
    let tagsArray = [];
    for(let i = 0; i < tags.length; i++){
        newTag = [];
        newTag.push(recipeId);
        newTag.push(tags[i]);
        tagsArray.push(newTag);
    }
    con.query(query, [tagsArray], (err, result) => callback(err, result));
}