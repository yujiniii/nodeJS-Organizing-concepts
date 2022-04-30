const express = require('express');
const router = express.Router();


router.get('/', function(req,res){
    res.render('index'); //동적 파일 ejs 를 브라우저로 전송, 파일명만 기재
    /* 정적 파일을 브라우저로 전송, 
    const htmlFliePath = path.join(__dirname,'views',"index.html");
    res.sendFile(htmlFliePath);
    */
});

router.get('/about', function(req,res){
    res.render('about');
});


router.get('/confirm', function(req,res){
    res.render('confirm');
});

module.exports = router;




