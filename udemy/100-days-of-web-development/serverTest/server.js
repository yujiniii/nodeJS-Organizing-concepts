//라이브러리 불러오기
const express= require('express');
const app = express();

//서비 열 수 있음()안에 포트번호, 익명함수?(띄운 후 실행할 코드)

app.listen(8080, function(){
    console.log("listening on 8080")

});


//get요청 -> /test/index/1210 을 주소창에 입력
//get('경로',함수(요청,응답))

app.get('/', function(req,res){//홈페이지
    res.sendFile(__dirname +'/index.html');
});

//누군가가 /pet으로 방문을 하면 pet관련된 안내문을 띄워주기
app.get('/pet', function(req,res){
    res.send('펫용품을 쇼핑할 수 있는 페이지입니다.');

});

app.get('/beauty', function(req,res){
    res.send('뷰티용품을 쇼핑할 수 있는 페이지입니다.');

});

