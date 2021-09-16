var express = require('express');
var router = express.Router();
var controller = require('../controllers/RecipeController')

router.get('/', controller.recipe_list);

// TEST
router.get('/test/', controller.recipe_test);

// CREATE
router.get('/create', controller.recipe_create_get);
router.post('/create', controller.recipe_create_post);

//READ
router.get('/:id(\\d+)/', controller.recipe_detail);

//UPDATE
router.get('/:id/update', controller.recipe_update_get);
router.post('/:id/update', controller.recipe_update_post);

//DELETE
router.get('/:id/delete', controller.recipe_delete_get);
router.post('/:id/delete', controller.recipe_delete_post);

//PUBLISH
router.get('/:id/publish', controller.recipe_publish_get);
router.post('/:id/publish', controller.recipe_publish_post);

module.exports = router;
