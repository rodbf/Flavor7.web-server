module.exports.new_deprecated = function(json){
    newStep = {};
    newStep.step_id = json.id_step;
    newStep.step_text = json.text;
    newStep.ing1 = json.ing1;
    newStep.ing1_id = json.id_ing1;
    newStep.ing1_plural = json.plural_ing1;
    newStep.ing1_multiplicity = json.multiplicity_ing1;
    newStep.ing2 = json.ing2;
    newStep.ing2_id = json.id_ing2;
    newStep.ing2_plural = json.plural_ing2;
    newStep.ing2_multiplicity = json.multiplicity_ing2;
    newStep.ing3 = json.ing3;
    newStep.ing3_id = json.id_ing3;
    newStep.ing3_plural = json.plural_ing3;
    newStep.ing3_multiplicity = json.multiplicity_ing3;
    newStep.ing4 = json.ing4;
    newStep.ing4_id = json.id_ing4;
    newStep.ing4_plural = json.plural_ing4;
    newStep.ing4_multiplicity = json.multiplicity_ing4;
    newStep.art1 = json.art1;
    newStep.art2 = json.art2;
    newStep.art3 = json.art3;
    newStep.time = json.time;
    newStep.utensil = json.utensil;
    newStep.position = json.position;
    newStep.complemento1 = json.complemento1;
    newStep.complemento2 = json.complemento2;
    newStep.complemento3 = json.complemento3;
    newStep.tipo1 = json.tipo1;
    newStep.tipo2 = json.tipo2;
    newStep.tipo3 = json.tipo3;
    newStep.temperature = json.temperature;

    
    newStep.formatted = json.text.toString().
                            replace('[ingrediente1]', (json.ing1?(json.multiplicity_ing1>1?json.plural_ing1.toLowerCase():json.ing1.toLowerCase()):'null')).
                            replace('[ingrediente2]', (json.ing2?(json.multiplicity_ing2>1?json.plural_ing2.toLowerCase():json.ing2.toLowerCase()):'null')).
                            replace('[ingrediente3]', (json.ing3?(json.multiplicity_ing3>1?json.plural_ing3.toLowerCase():json.ing3.toLowerCase()):'null')).
                            replace('[ingrediente4]', (json.ing4?(json.multiplicity_ing4>1?json.plural_ing4.toLowerCase():json.ing4.toLowerCase()):'null')).
                            replace('[tipo1]', json.tipo1).
                            replace('[tipo2]', json.tipo2).
                            replace('[tipo3]', json.tipo3).
                            replace('[artigo1]', json.art1).
                            replace('[artigo2]', json.art2).
                            replace('[artigo3]', json.art3).
                            replace('[complemento1]', json.complemento1).
                            replace('[complemento2]', json.complemento2).
                            replace('[complemento3]', json.complemento3).
                            replace('[temperatura]', json.temperature).
                            replace('[utensilio]', json.utensil).
                            replace('[tempo]', json.time);

    return newStep;
}

module.exports.new = function(json){
    newStep = {};
    newStep.action_id = json.id_action;
    newStep.action_text = json.action;
    newStep.step_text = json.step_text;
    newStep.position = json.position;
    
    newStep.formatted = json.action + " " + json.step_text;
    return newStep;
}