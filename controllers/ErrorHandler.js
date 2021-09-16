module.exports = function(res, err){
	console.log(err);
	res.render('Error', {title: "Error", message: err});
}