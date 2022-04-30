const express = require("express");
const path = require("path");
const fs = require('fs');
const uuid = require('uuid');

const app = express();

const defaultRoute = require('./routes/default');
const restaurantRoute = require('./routes/restaurant');

// 탬플릿 엔진 ejs, 동적으로 설정
// 동적파일 : 서버에서 구문분석되고 랜더링됨 (정적은 브라우저에서 구문분석됨?? 아마??)
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static('public')); // 정적 파일을 보관하는 폴더..
app.use(express.urlencoded({extended:false})); // post 요청으로 값을 받아왔을 떄 파싱하는


// route 설정
// '/' 이어야 함. 아니면 /aa/bb 이런식으로 쌓이게 됨
app.use('/', defaultRoute);
app.use('/', restaurantRoute);


//지금까지 지난 라우터 중에서 원하는 페이지를 찾지 못했으면 
app.use(function(req,res){
    res.status(404).render('404');
});

app.use(function(error,req,res,next){
    res.status(500).render('500');
});


app.listen(3000);