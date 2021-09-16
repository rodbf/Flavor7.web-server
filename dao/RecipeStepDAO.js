const RecipeStepDB = require('./db/RecipeStepDB');
const StepDB = require('./db/StepDB');
const IngredientDB = require('./db/IngredientDB');
const StepActionDB = require('./db/StepActionDB');

const con = require('./connection/pool');

const recipeStepFormatter = require('./formatters/recipeStepFormatter');

module.exports.findByRecipeId = function(id, callback){
    let output = {};
    const query_deprecated = "SELECT rs."+RecipeStepDB.STEP_ID+", s."+StepDB.TEXT+" text"+", rs."+RecipeStepDB.POSITION+
                        ", i1."+IngredientDB.NAME+" ing1, i1."+IngredientDB.ID+" id_ing1, rs."+RecipeStepDB.ING1_MULTIPLICITY+" multiplicity_ing1, i1."+IngredientDB.NAME_PLURAL+" plural_ing1"+
                        ", i2."+IngredientDB.NAME+" ing2, i2."+IngredientDB.ID+" id_ing2, rs."+RecipeStepDB.ING2_MULTIPLICITY+" multiplicity_ing2, i2."+IngredientDB.NAME_PLURAL+" plural_ing2"+
                        ", i3."+IngredientDB.NAME+" ing3, i3."+IngredientDB.ID+" id_ing3, rs."+RecipeStepDB.ING3_MULTIPLICITY+" multiplicity_ing3, i3."+IngredientDB.NAME_PLURAL+" plural_ing3"+
                        ", i4."+IngredientDB.NAME+" ing4, i4."+IngredientDB.ID+" id_ing4, rs."+RecipeStepDB.ING4_MULTIPLICITY+" multiplicity_ing4, i4."+IngredientDB.NAME_PLURAL+" plural_ing4"+
                        ", rs."+RecipeStepDB.TIPO1+", rs."+RecipeStepDB.TIPO2+", rs."+RecipeStepDB.TIPO3+
                        ", rs."+RecipeStepDB.ART1+", rs."+RecipeStepDB.ART2+", rs."+RecipeStepDB.ART3+
                        ", rs."+RecipeStepDB.COMPLEMENTO1+", rs."+RecipeStepDB.COMPLEMENTO2+", rs."+RecipeStepDB.COMPLEMENTO3+
                        ", rs."+RecipeStepDB.TEMPERATURE+
                        ", rs."+RecipeStepDB.UTENSIL+
                        ", rs."+RecipeStepDB.TIME+
                    " FROM "+RecipeStepDB.TABLE+" rs"+
                    " LEFT JOIN "+StepDB.TABLE+" s ON rs."+ RecipeStepDB.STEP_ID+" = s."+StepDB.ID+
                    " LEFT JOIN "+IngredientDB.TABLE+" i1 ON rs."+RecipeStepDB.ING1+" = i1."+IngredientDB.ID+
                    " LEFT JOIN "+IngredientDB.TABLE+" i2 ON rs."+RecipeStepDB.ING2+" = i2."+IngredientDB.ID+
                    " LEFT JOIN "+IngredientDB.TABLE+" i3 ON rs."+RecipeStepDB.ING3+" = i3."+IngredientDB.ID+
                    " LEFT JOIN "+IngredientDB.TABLE+" i4 ON rs."+RecipeStepDB.ING4+" = i4."+IngredientDB.ID+
                    " WHERE rs."+RecipeStepDB.RECIPE_ID+" = ?"+
                    " ORDER BY rs."+RecipeStepDB.POSITION;

    const query = "SELECT rs."+RecipeStepDB.STEP_TEXT+", rs."+RecipeStepDB.ACTION_ID+", sa."+StepActionDB.ACTION+", rs."+RecipeStepDB.POSITION+
                    " FROM "+RecipeStepDB.TABLE+" rs"+
                    " LEFT JOIN "+StepActionDB.TABLE+" sa ON rs."+RecipeStepDB.ACTION_ID+" = sa."+StepActionDB.ID+
                    " WHERE rs."+RecipeStepDB.RECIPE_ID+" = ?"+
                    " ORDER BY rs."+RecipeStepDB.POSITION;

    con.query(query, [[id]], (err, result) => {
        if(err){
            callback(err);
        } else {
            output = recipeStepFormatter.findByRecipeId(result);
            callback(null, output);
        }
    });
}

module.exports.writeSteps = function(recipeID, steps, callback){
    const query_deprecated = "INSERT INTO "+RecipeStepDB.TABLE+"("+
                            RecipeStepDB.RECIPE_ID+", "+RecipeStepDB.STEP_ID+", "+RecipeStepDB.POSITION+", "+
                            RecipeStepDB.ING1+", "+RecipeStepDB.ING1_MULTIPLICITY+", "+
                            RecipeStepDB.ING2+", "+RecipeStepDB.ING2_MULTIPLICITY+", "+
                            RecipeStepDB.ING3+", "+RecipeStepDB.ING3_MULTIPLICITY+", "+
                            RecipeStepDB.ING4+", "+RecipeStepDB.ING4_MULTIPLICITY+", "+
                            RecipeStepDB.TIPO1+", "+RecipeStepDB.TIPO2+", "+RecipeStepDB.TIPO3+", "+
                            RecipeStepDB.ART1+", "+RecipeStepDB.ART2+", "+RecipeStepDB.ART3+", "+
                            RecipeStepDB.COMPLEMENTO1+", "+RecipeStepDB.COMPLEMENTO2+", "+RecipeStepDB.COMPLEMENTO3+", "+
                            RecipeStepDB.TEMPERATURE+", "+
                            RecipeStepDB.UTENSIL+", "+
                            RecipeStepDB.TIME+")"+
                            " VALUES ?";

    const query = "INSERT INTO "+RecipeStepDB.TABLE+"("+
                    RecipeStepDB.RECIPE_ID+", "+RecipeStepDB.ACTION_ID+", "+RecipeStepDB.STEP_TEXT+", "+RecipeStepDB.POSITION+") VALUES ?";
    data = [];
    for (var index in steps){
        newStep = [];
        step = steps[index];
        newStep.push(recipeID);
        newStep.push(step.action_id);
        newStep.push(step.step_text);
        newStep.push(step.position);
        data.push(newStep);
    }
    
    con.query(query, [data], (err, result) => {
        callback(err, result);
    });
}

module.exports.deleteStepsByRecipeId = function(recipeId, callback){
    const query = "DELETE FROM "+RecipeStepDB.TABLE+" WHERE "+RecipeStepDB.RECIPE_ID+" = ?";
    con.query(query, [recipeId], (err, result) => {
        callback(err, result);
    })
}