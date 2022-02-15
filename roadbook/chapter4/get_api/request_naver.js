/* 네이버 개발자센터에서 받은 검색 api를 활용하는 예제입니다 
    - request를 이용
*/


var express = require('express');
var request = require('request');
var morgan = require('morgan');



var app = express();

//포트 연결
app.set('port',process.env.PORT||8080);

//공통 미들웨어
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//라우팅 설정
app.get('/naver/news',(req,res) => {
    const client_id = 'No466rQ1MA8SQzwgDrWZ';
    const client_secret='aH7BfII5zG';
    const api_url = 'https://openapi.naver.com/v1/search/news?query=' + encodeURI('코로나'); /* encodeURI(req.query.query */
    const option={
        //...
    };
    const options ={
        url:api_url,
        qs:option,
        headers:{ 'X-Naver-Client-Id' : client_id,
                    'X-Naver-Client-Secret' : client_secret },
    };
    request.get(options,( error,response, body)=>{
        if(!error && response.statusCode==200){
            let newsItem=JSON.parse(body).items;

            const newsJson = {
                title:[],
                link:[],
                description:[],
                pubDate:[]
            }
            for(let i =0;i<newsItem.length;i++){
                newsJson.title.push(newsItem[i].title.replace(/(<([^>]+)>)|&quot;/ig,""));
                newsJson.link.push(newsItem[i].link);
                newsJson.description.push(newsItem[i].description.replace(/(<([^>]+)>)|&quot;/ig,""));
                newsJson.pubDate.push(newsItem[i].pubDate);
            }
            res.json(newsJson);
        }else{
            res.status(response.statusCode).end();
            console.log('error = '+response.statusCode);
        }
    });
});

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 서버 실행 중.......');
});
