var express = require('express');
var router = express.Router();
var controller = require('../controllers/StepController')

router.get('/', controller.step_list);

// CREATE
router.get('/create', controller.step_create_get);
router.post('/create', controller.step_create_post);

//READ
router.get('/:id(\\d+)/', controller.step_detail);

//UPDATE
router.get('/:id/update', controller.step_update_get);
router.post('/:id/update', controller.step_update_post);

//DELETE
router.get('/:id/delete', controller.step_delete_get);
router.post('/:id/delete', controller.step_delete_post);

module.exports = router;
