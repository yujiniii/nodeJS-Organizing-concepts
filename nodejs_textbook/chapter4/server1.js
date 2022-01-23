
const http = require('http');

const server = http.createServer((req,res) => {
    res.write('<h1>Hello Node!!</h1>');
    res.end('<p>hello server!</p>');
});

server.listen(8080);
server.on('listening',() =>  {
    console.log('8080 포트에서 서버대기중입니다');
});

server.on('error', (error) => {
    console.log(error);
});
