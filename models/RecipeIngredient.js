module.exports.new = function(json){
    newIngredient = {};
    newIngredient.ingredient_id = json.id_ingredients;
    newIngredient.ingredient_name = json.ing_name;
    newIngredient.ingredient_name_plural = json.ing_name_plural;
    newIngredient.unit_id = json.id_unit;
    newIngredient.unit_name = json.unit_name;
    newIngredient.amount = json.amount;
    newIngredient.extrainfo = json.extra_info;
    newIngredient.position = json.position;

    switch(true){
        case (json.id_unit == 6): // unidade(s) - 6 cebolas picadas, 1 cebola picada
            newIngredient.formatted = json.amount + " " + (json.amount>1?json.ing_name_plural.toLowerCase():json.ing_name.toLowerCase()) + (json.extra_info?(" " + json.extra_info):'');
            break;

        case (json.id_unit == 13): // a gosto - sal a gosto
            newIngredient.formatted = json.ing_name.toLowerCase() + " " + json.unit_name + (json.extra_info?(" " + json.extra_info):'');
            break;

        case (json.id_unit <= 4 || json.id_unit == 7): // mg, g, kg, mL, L - 500g de queijo ralado - ingrediente sempre singular
            newIngredient.formatted = json.amount + json.unit_name + " de " + json.ing_name.toLowerCase() + (json.extra_info?(" " + json.extra_info):'');
            break;

        case (json.id_unit == 99):// indefinido
            newIngredient.formatted = json.amount + " " + (json.amount>1?json.ing_name_plural.toLowerCase():json.ing_name.toLowerCase());
            break;

        case (json.id_unit == 100): //unidade formato 2
            newIngredient.formatted = json.amount + " " + json.extra_info + " de " + json.ing_name.toLowerCase();
            break;

        default: // xícara, colher - 2 xícaras de morango, 1 colher de chá de morango - ingrediente sempre singular
            newIngredient.formatted = json.amount + " " + (json.amount>1?json.unit_name_plural.toLowerCase():json.unit_name.toLowerCase()) + " de " + json.ing_name.toLowerCase() + (json.extra_info?(" " + json.extra_info):'');
            break;
    }

    return newIngredient
}