const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') =>
    cookie
        .split(';')
        .map(v => v.split('='))
        .map(([k, ...vs]) => [k, vs.join('=')])
        .reduce((acc,[k,v])=>{
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        },{});

http.createServer((req,res)=>{
    const cookies = parseCookies(req.headers.cookie);
    if(req.url.startsWith('/login')){
        const { query } = url.parse(req.url);
        const { name } = qs.parse(query);
        const expires = new Date();

        expires.setMinutes(expires.getMinutes()+5);
        res.writeHead(302,{ //리다이렉트(다른페이지로 이동) 301영구이동 302 임시이동
            Location:'/',
            // 헤더에 한글을 사용하기 위해 endcode함
            //name : 쿠키명
            // expire : 만료기한
            //path : 쿠키가 전송퇼 URL
            // secure : HTTPS일떄만 쿠키 전송
            //HTTP ONLY: 자바스크립트에서 쿠키에 접근할 수 없음
            'Set-Cookie' : `name=${encodeURIComponent(name)}; Expires = ${expires.toGMTString()}; HttpOnly; Path=/`
        });
        res.end();
    }
    else if(cookies.name){
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});//한글 endcode문제 해결
        res.end(`${cookies.name}님 안녕하세요`);
    }
    else{ // 그 외의 경우(/)로 접속했을 때, 쿠키가 없다면 로그인가능, html전송
        fs.readFile('./server4.html' ,(err,data)=>{
            if(err){
                throw err;
            }
            res.end(data);
        });
    }
})
    .listen(8083,()=>{
        console.log('8083포트에서 대기중입니다');
    });
