const url = require('url');
const uuidAPIkey = require('uuid-apikey');

var morgan = require('morgan'); // 로그 표출

// express generator
var express = require('express');
var app = express();

//포트설정
app.set('port', process.env.PORT || 8080);

//공통 미들웨어
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//test data
let boardList =[];
let numOfBoard = 0;


//라우팅 설정
app.get('/',(req,res)=>{
  res.send('this is API.js');
});

//게시글 API
app.get('/board', (req,res)=>{
  res.send(boardList);
});

app.post('/board', (req, res)=>{
  const board = {
    "id" : ++numOfBoard,
    "user_id" : req.body.user_id,
    "date" : new Date(),
    "title" : req.body.title,
    "content" : req.body.content
  };
  boardList.push(board);

  res.redirect('/board');
});

//리스트에 요소 추가
app.put('/board/:id', (req,res)=>{
  //삭제하는 부분
  const findItem = boardList.find((item)=>{
    return item.id == +req.params.id
  });
  const idx = boardList.indexOf(findItem);
  boardList.splice(idx,1);
  const board = {
    "id" : +req.params.id,
    "user_id" : req.params.user_id,
    "date" : new Date(),
    "title" : req.body.title,
    "content" : req.body.content
  };
  //그리고 다시 넣어
  boardList.push(board);

  res.redirect('/board');
});

//리스트에서 삭제
app.delete('/board:id',(req,res)=>{
  const findItem = boardList.find((item)=>{
    return item.id == +req.params.id
  });
  const idx = boardList.indexOf(findItem);
  boardList.splice(idx,1);

  res.redirect('/board');
});


// 서버와 포트 연결
app.listen(app.get('port'),()=>{
  console.log(app.get('port'),"번 포트에서 실행 중.....");
});