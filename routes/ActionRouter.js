var express = require('express');
var router = express.Router();
var controller = require('../controllers/ActionController')

router.get('/', controller.action_list);

// CREATE
router.get('/create', controller.action_create_get);
router.post('/create', controller.action_create_post);

//READ
router.get('/:id(\\d+)/', controller.action_detail);

//UPDATE
router.get('/:id/update', controller.action_update_get);
router.post('/:id/update', controller.action_update_post);

//DELETE
router.get('/:id/delete', controller.action_delete_get);
router.post('/:id/delete', controller.action_delete_post);

module.exports = router;
