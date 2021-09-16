module.exports.new = function(id, text){
    newStep = {};
    newStep.id = id;
    newStep.text = text;
    newStep.url = "/steps/"+id;
    return newStep;
}