const express = require('express');
const router = express.Router();
const authCotroller = require('../controller/auth-controller')

router.get('/signup', authCotroller.getSignup);
  
router.get('/login', authCotroller.getLogin);

router.post('/signup', authCotroller.postSignup);

router.post('/login',authCotroller.postLogin);

router.post('/logout',authCotroller.postLogout );

module.exports = router;
