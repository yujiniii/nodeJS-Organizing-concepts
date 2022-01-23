const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');

const {sequelize} = require('./models');

const indexRouter = require('./routes');
const usersRouter = require('./routes/users');
const User = require('./models/user');
const commentsRouter = require('./routes/comments');


var app = express();

app.set('port',process.env.PORT || 3001);
app.set('view engine', 'html');
nunjucks.configure('views',{
  express:app,
  watch:true,
});
sequelize.sync({force:false})
  .then(()=>{
    console.log('데이터베이스 연결 성공');
  })
  .catch((err)=>{
    console.error(err);
  });
/*
User.create({
      name:'zeroro',
      age:24,
      married:false,
      comment:'test1',
  })
*/
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users',usersRouter);
app.use('/comments',commentsRouter);

app.use(function(req, res, next) {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
  error.status = 404;
  next(error);
});


app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'),() => {
  console.log(app.get('port'),'빈 포트에서 대기중');
});


module.exports = app;
