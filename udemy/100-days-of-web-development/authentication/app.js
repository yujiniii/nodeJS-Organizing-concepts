const path = require('path');

const express = require('express');
const session = require('express-session');
const mongodbS = require('connect-mongodb-session')
const MongodbStore = mongodbS(session);
const sessionStore = new MongodbStore({
  url:'localhost:27017',
  databaseName:'auth',
  collection:"sessions"
});
const db = require('./data/database');
const demoRoutes = require('./routes/demo');
const database = require('./data/database');
const { Cookie } = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret:'super',
  resave:false,   // true : 변경이 없어도 모든 세션 요청에 대해 저장
  saveUninitialized : false,
  store:sessionStore,
  cookie:{  // 만료 기한 설정, 생략시 브라우저가 종료되지 않는 이상은 만료되지 않음
    maxAge: 24 * 60 * 60 * 1000 // 하루
  }
}));
app.use(demoRoutes);

app.use(function(error, req, res, next) {
  res.render('500');
})

db.connectToDatabase().then(function () {
  app.listen(3000);
});
