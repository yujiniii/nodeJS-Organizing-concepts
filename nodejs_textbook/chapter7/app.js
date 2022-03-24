const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const {sequelize} = require('./models');
const indexRouter = require('./routes');
const usersRouter = require('./routes/users');
const User = require('./models/user');
const commentsRouter = require('./routes/comments');


/* express start */
var app = express();

/* 포트설정 */
app.set('port',process.env.PORT || 3001);

/* 탬플릿 엔진 설정 */
app.set('view engine', 'html');
// views의 확장자는 html이지만 nunjucks문법(?) 사용함
nunjucks.configure('views',{
  express:app,
  watch:true,
});


/* 데이터베이스 연동부 */
sequelize.sync({force:false})
  .then(()=>{
    console.log('데이터베이스 연결 성공');
  })
  .catch((err)=>{
    console.error(err);
  });

/* 만약 코드 내부에서 데이터베이스에 값을 넣을 때 이런식으로 작성..
User.create({
      name:'zeroro',
      age:24,
      married:false,
      comment:'test1',
  })
*/

/* middleware */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users',usersRouter);
app.use('/comments',commentsRouter);

app.use(function(req, res, next) {   //오류제어
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {}; //config 파일과 동일해야 함
  res.status(err.status || 500);
  res.render('error');
});


/* server start */
app.listen(app.get('port'),() => {
  console.log(app.get('port'),'빈 포트에서 대기중');
});


module.exports = app;
