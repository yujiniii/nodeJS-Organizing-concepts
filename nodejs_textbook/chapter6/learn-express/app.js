var createError = require('http-errors');
var express = require('express');
var path = require('path');
// 쿠키 해석,, req.cookies
var cookieParser = require('cookie-parser');
// 콘솔에 접속 로고가 출력
// GET             /       200          672.963 ms  -  170
// HTTP요청(GET)  주소  HTTP상태코드       응답속도      응답 바이트
var logger = require('morgan');
var session = require('express-session');
/* express-session은 세션 관리 식 클라이언트에 쿠키를 보냄 : 세션쿠키
안전하게 쿠키를 전송하여면 쿠키에 서명을 추가해야하고, 이떄 secret 코드가 필요함*/   

var flash = require('connect-flash');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { Cookie } = require('express-session');

//express 패키지를 호출하여 app변수 객제를 만들었음, 각종 기능 연결 가능
var app = express();

// app.set()메서드로 express app 실행
// view engine setup
// 랜더링 할 폴더 지정, render 매서드의 기준
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 미들웨어로 연결하는 부분
// app.use(미들웨어) : 요청과 응답의 중간에 위치
// 순차적으로 거친 후 라우터에서 클라이언트로 응답을 보냄
app.use(function(req,res,next){
  console.log(req.url,"저도 미들웨어입니다");
  next(); // 없으면 요청의 흐름이 끊겨서 응답 X
});
/* next 의 역할
   - () 다음 미들웨어로
   - ('route') 다음 라우터로 => 즉 기존 라우터의 미들웨어는 건너뛰고 다음 라우터의 미들웨어로
   - (error) 에러 핸들러로
*/

// 정적인 파일 제공, 최대한 위쪽에 배치해야 정적 파일 들어왔을때 라우팅됨
// 근데 이걸 morgan 보다 위로 올리면 큰일나용(파일 요청 기록 X)
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));

// 원해는 body-parser를 선언해야 가능했지만 요즘은 ㄱㅊㄱㅊ
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
/*app.use(cookieParser('secret code'));
app.use(session({
  // resave : 요청이 왔을 때 세션에 수정사항이 생기지 않더라도 세션을 다시 저장할지 여부
  // saveUninitialized : 세션에 저장할 내용이 없더라도 세션을 저장할지에 대한 설정(방문자 추적 등) 
  resave:false,
  saveUninitialized:false,
  cookie:{
    httpOnly:true,
    secure:false,
    // store : T/F  메모리에 세션 저장하면 서버 재시작시 날라감, 이거 나중에 DB에 저장할 수 있음
  },
}));

app.use(session({
  resave:false,
  saveUninitialized:false,
  secret: 'secret code',
  cookie:{
    httpOnly:true,
    secure:false,
    // store : T/F  메모리에 세션 저장하면 서버 재시작시 날라감, 이거 나중에 DB에 저장할 수 있음
  },
}));*/

app.use(flash());

// 라우터 앞에 주소인자가 하나 더 들어감
// use대신 http 메서드도 사용가능 그러면 "" 주소와 해당하는 메서드일때만 실행됨
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // 일치하는 주소가 없다면 여기로 오게 됨, 404 페이지 에러를 만들어(createError) 바로 밑 error handler로 보냄
  next(createError(404));
});

// error handler err:next에 넣어준 error값, 제일 아래 위치
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
