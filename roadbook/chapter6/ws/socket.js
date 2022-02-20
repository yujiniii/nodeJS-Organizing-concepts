const WebSocket = require('ws');

module.exports = (server)=>{ 
    const wss = new WebSocket.Server({server});
    wss.on('connection', (ws, req) => {  // connection
        const ip = req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress;  //IP알아내는 과정
        console.log('New Client',ip);
        ws.on('message',(message) => { // 클라이언트로부터 받은 메세지 on:받는거
            console.log(message);
        });
        ws.on('error',(err)=>{  // 오류 처리
            console.error(err);
        });
        ws.on('close',()=>{  // 종료
            console.log('클라이언트 접속 해제',ip);
            clearInterval(ws.interval); //연결 종료하면 꼭 인터벌 제거해주시기
        });
        ws.interval = setInterval(()=>{  // 서버에서 뿌린 메세지
            if(ws.readyState === ws.OPEN){
                ws.send('Message From Server.');  //send:보배는거
            }
        }, 3000);
    });
};
/* readyState : OPEN, CLOSE CLOSING CONNECTING */