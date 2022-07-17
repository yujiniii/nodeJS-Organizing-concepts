const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../data/database');

const router = express.Router();

router.get('/', function (req, res) {
  res.render('welcome');
});

router.get('/signup', function (req, res) {
  let sessionInputData = req.session.inputData;
  if(!sessionInputData){
    sessionInputData = {
      hasError:false,
      message:'올바른 형식으로 입력하세요',
      email:'',
      confirmEmail:'',
      password:''
    }
  }
  req.session.inputData = null; // 안하면 계속 남아서 로그인 이후에도 회원가입 화면에서 보임 이렇게 바로 없애는걸 플래싱이라고 함
  res.render('signup',{inputData:sessionInputData});
});

router.get('/login', function (req, res) {
  let sessionInputData = req.session.inputData;
  if(!sessionInputData){
    sessionInputData = {
      hasError:false,
      message:'올바른 형식으로 입력하세요',
      email:'',
      password:''
    }
  }
  req.session.inputData = null; 
  res.render('login',{inputData:sessionInputData});

});

router.post('/signup', async function (req, res) {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredConfirmEmail = userData['confirm-email']; // -가 .을 사용할 때 사용 금지인 문자열이라서 이런 방식 사용함
  const enteredPassword = userData.password;
  const hashedPassword = await bcrypt.hash(enteredPassword, 12);

  if(
    !enteredEmail ||
    !enteredConfirmEmail ||
    !enteredPassword ||
    enteredPassword.length < 6 ||
    enteredEmail !== enteredConfirmEmail ||
    !enteredEmail.includes('@')
  ){
    console.log("올바른 형식으로 입력하세요")
    req.session.inputData = await {
      hasError:true,
      message:'올바른 형식으로 입력하세요',
      email:enteredEmail,
      confirmEmail:enteredConfirmEmail,
      password:enteredPassword
      };
    console.log(req.session.inputData)
    req.session.save(function(){
      return res.redirect('/signup')
    });
    return ;    // 이거 안하면 응답 2개 보낸걸로 떠서 에러남
  }

  const existingUser = await db.getDb().collection('users').findOne({
    email : enteredEmail
  });
  if(existingUser){
  req.session.inputData = await {
    hasError:true,
    message:'다른 이메일을 사용하세요',
    email:enteredEmail,
    confirmEmail:enteredConfirmEmail,
    password:enteredPassword
    }
    console.log(req.session.inputData)
    req.session.save(function(){
      return res.redirect('/signup')
    });
    return ;
}

  const user = {
    email : enteredEmail,
    password : hashedPassword
  }
  console.log("NEW : ", user);
  await db.getDb().collection('users').insertOne(user);

  res.redirect('/login');

});

router.post('/login', async function (req, res) {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;

  const existingUser = await db.getDb().collection('users').findOne({
    email : enteredEmail
  });
  
  if(!existingUser){
    req.session.inputData = await {
      hasError:true,
      message:'사용자가 존재하지 않습니다.',
      email:enteredEmail,
      password:enteredPassword
      }
      console.log(req.session.inputData)
      req.session.save(function(){
        return res.redirect('/login')
      });
      return ;
  }

  const passwordsAreEqual = await bcrypt.compare(enteredPassword, existingUser.password); // bcrypt.compare(비교할 문자열, 해싱된 값) 

  if(!passwordsAreEqual){
    req.session.inputData = await {
      hasError:true,
      message:'비밀번호가 일치하지 않습니다.',
      email:enteredEmail,
      password:enteredPassword
    }
    console.log(req.session.inputData)
    req.session.save(function(){
      return res.redirect('/login')
    });
    return ;
  }
  
  console.log("HI ",enteredEmail);
  req.session.user = { id:existingUser._id ,email:existingUser.email};
  req.session.isAuthenticated = true;
  req.session.save(function(){ // session 에 저장이 끝나면 그때 렌더링
    res.redirect('/profile');
  })

});

router.get('/admin', async function (req, res) {
  if(!res.locals.isAuth){ // !req.session.user || !req.session.isAuthenticated
    return res.status(401).render('401');
  }
  //const user = await db.getDb().collection('users').findOne({_id:req.session.user.id});
  if(!res.locals.isAdmin){ //!user || !user.isAdmin
    return res.status(403).render('403');
  }
  else {
    res.render('admin');
  }
});


router.get('/profile', function (req, res) {
  if(!res.locals.isAuth){ // !req.session.user || !req.session.isAuthenticated
    return res.status(401).render('401');
  }
  res.render('profile');

});


router.post('/logout', function (req, res) {
  // 전체 세션을 지우는 것은 지양하기
  req.session.user = null
  req.session.isAuthenticated = false;
  res.redirect('/');
}
  );

module.exports = router;
