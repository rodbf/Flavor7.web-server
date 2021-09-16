var express = require('express');
var router = express.Router();
var controller = require('../controllers/IngredientController')

router.get('/', controller.ingredient_list);

// CREATE
router.get('/create', controller.ingredient_create_get);
router.post('/create', controller.ingredient_create_post);

//READ
router.get('/:id(\\d+)/', controller.ingredient_detail);

//UPDATE
router.get('/:id/update', controller.ingredient_update_get);
router.post('/:id/update', controller.ingredient_update_post);

//DELETE
router.get('/:id/delete', controller.ingredient_delete_get);
router.post('/:id/delete', controller.ingredient_delete_post);

module.exports = router;
