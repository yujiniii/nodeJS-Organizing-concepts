var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

/* 라우터에서 자주 보이는 꿀팁
  
 router.get('/user/:id', function(req, res){
   console.log(req.params, req.query);
 });
:id   : req.params.id
:type : req.params.type
*/