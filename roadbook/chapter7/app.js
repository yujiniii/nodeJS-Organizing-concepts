const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require("passport");
const Localstrategy = require('passport-local').Strategy;

const app = express();

// 포트설정
app.set('port',process.env.PORT || 8080);

// 가상 데이터
let fakeUser = {
    username:'test@test.com',
    password:'test@1234'
}

//공통 미들웨어
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extends:false}));
app.use(cookieParser('passportExample'));
app.use(session({
    resave:false,
    saveUninitalized:false,
    secret:'passportExample',
    cookie:{
        httpOnly:true,
        secure:false
    }
}));

//passport 미들웨어
app.use(passport.initialize());  // passport 초기화
app.use(passport.session());     // passport session 연동


// 세션 처리 : 로그인에 성공했을 경우 딱 한번 호출되어 사용자의 식별자를 session에 저장
passport.serializeUser(function(user, done){
    console.log('serializeUser', user);
    done(null,user.username);
});


// 세션 처리 : 로그인 후 페이지 방문마다 사용자의 실제 데이터 주입 (  deserializeUser()  )
passport.deserializeUser(function(id,done){
    console.log('deserializeUser',id);
    done(null,fakeUser);
});


passport.use(new Localstrategy( // 추후 데이터베이스에서 조회 및 암호화와 해싱기술 적용하는 부분
    function (username, password, done){  //done(오류여부, 결과값, 실패했을 경우 작성하는 매서드)
        if (username === fakeUser.username){
            if(password === fakeUser.password){
                return done(null, fakeUser);   // 로그인 성공
            } else {
                return done(null, false, {message:"password incorrect !"} );
            }
     } else {
            return done(null, false, {message:"username incorrect !"} );
        }    
    }
));


// 라우터 설정
app.get('/',(req,res) => {
    if(!req.user){
        res.sendFile(__dirname+'/index.html');
    }else {
            const user = req.user.username;
            const html = `
            <!DOCTYPE html>
            <html lang="ko">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body>
                <p>${user} 님 안녕하세요 !!</p>
                <button type="button" onclick="location.href = '/logout'">LOGOUT</button>
            </body>
            </html>`
            res.send(html);
        }
});

// passport Login : strategy-Local
// Authenticate Request
app.post('/login',
    passport.authenticate('local', { failureRedirect: '/' }),
    function (req,res){
        res.send('Login success !! ');
    });

    app.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
});

// 404 오류 처리
app.use((req,res,next) => {
    const error = new Error(`${req.method} ${req.url} 해당 주소가 없습니다.`);
    error.status = 404;
    next(error);
});

// 오류 처리 미들웨어 
app.use((req, res,next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'development' ? err : {};
    res.status(err.status || 500);
    res.send('error Occurred');
});

// 서버와 포트 연결
app.listen(app.get('port'),()=>{
    console.log(app.get('port'), '번 포트에서 서버 실행 중............');
});



