var express = require('express');
var router = express.Router();
var controller = require('../controllers/TagController')

router.get('/', controller.tag_list);

// CREATE
router.get('/create', controller.tag_create_get);
router.post('/create', controller.tag_create_post);

//READ
router.get('/:id(\\d+)/', controller.tag_detail);

//UPDATE
router.get('/:id/update', controller.tag_update_get);
router.post('/:id/update', controller.tag_update_post);

//DELETE
router.get('/:id/delete', controller.tag_delete_get);
router.post('/:id/delete', controller.tag_delete_post);

module.exports = router;
