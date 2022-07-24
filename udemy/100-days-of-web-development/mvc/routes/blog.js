const express = require('express');
const router = express.Router();
const postController = require('../controller/post-controller')

router.get('/', postController.getWelcome);

router.get('/admin', postController.getAdmin);

router.post('/posts',postController.postPost);

router.get('/posts/:id/edit', postController.getEdit);

router.post('/posts/:id/edit',postController.postEdit);

router.post('/posts/:id/delete', postController.postDelete);

module.exports = router;
