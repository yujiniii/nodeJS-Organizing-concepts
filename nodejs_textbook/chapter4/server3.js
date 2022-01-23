const http = require('http');

const parseCookies = (cookie = '' ) => 
    cookie
        .split(';')
        .map(v=>v.split('='))
        .map(([k, ... vs]) => [k,vs.join('=')])
        .reduce((acc,[k,v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});

http.createServer((req,res) => {
    const cookie = parseCookies(req.headers.cookie); // 쿠키의 위치
    console.log(req.url, cookie);
    ////(상태코드, 헤더내용) 200==성공 Set-Cookies ; 클라이언트에서 서버가 보내준my cookie = test를 저장
    //f12 network에서 확인 가능
    res.writeHead(200, {'Set-Cookies' : 'my cookie = test'}); 
    res.end('hello cookies');
})
    .listen(8082, () => {
        console.log('8082 포트에서 대기중입니다')
    })