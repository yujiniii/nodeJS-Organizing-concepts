/* 공공데이터포털에서 받은 대기오염 정보 api를 활용하는 예제입니다.
    - axios를 이용
    - dotenv 이용
 */ 

    const express = require('express');
    const axios = require('axios');
    const morgan = require('morgan');
    const path = require('path');
    const dotenv = require('dotenv');
    
    //dotenv 연결
    dotenv.config({path:path.resolve(__dirname,"../../.env") });
    
    var app = express();
    //포트 연결
    app.set('port',process.env.PORT||8081);
    
    //공통 미들웨어
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    //라우팅 설정
    app.get('/airkorea', async (req, res) => {
        const serviceKey = "s5yw4P%2B6RGgj7iguiiF8Vli5GQZZ%2FzOZ0nMLtam5zf89kcvy8knNsIW0CTftD9dyFCr%2BV790S%2F9472oG3L%2FI3w%3D%3D";
        const airUrl ="http://apis.data.go.kr./B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?";
    
        let params = encodeURI('serviceKey') + '=' + serviceKey;
        
        params +='&'+ encodeURI('returnType') + '='+ encodeURI('json');
        params +='&'+ encodeURI('numOfRows') + '='+ encodeURI('1');
        params +='&'+ encodeURI('pageNo') + '='+ encodeURI('1');
        params +='&'+ encodeURI('dataTerm') + '='+ encodeURI('DAILY');
        params +='&'+ encodeURI('ver') + '='+ encodeURI('1.3');
        params +='&'+ encodeURI('stationName') + '='+ encodeURI('마포구');
       
    
        const url = airUrl+params;
        try{
            const result = await axios.get(url);
            res.json(result.data); //.data필수
        }catch(error){
            console.log(error);
        }
    });
    
    app.get('/airkorea/detail', async (req, res) => {
        const serviceKey = "s5yw4P%2B6RGgj7iguiiF8Vli5GQZZ%2FzOZ0nMLtam5zf89kcvy8knNsIW0CTftD9dyFCr%2BV790S%2F9472oG3L%2FI3w%3D%3D";
        const airUrl ="http://apis.data.go.kr./B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?";
    
        let params = encodeURI('serviceKey') + '=' + serviceKey;
    
        params +='&'+ encodeURI('numOfRows') + '=' + encodeURI('1');
        params +='&'+ encodeURI('pageNo') + '=' + encodeURI('1');
        params +='&'+ encodeURI('dataTerm') + '=' + encodeURI('DAILY');
        params +='&'+ encodeURI('ver') + '=' + encodeURI('1.3');
        params +='&'+ encodeURI('stationName') + '=' + encodeURI('마포구');
        params +='&'+ encodeURI('returnType') + '=' + encodeURI('json');
    
        const url = airUrl+params;
        try{
            const result = await axios.get(url);
            const airItem = {
                /* 여기 경로는 내가 /airkorea 에 있는 정보 보고 찾은거
                axios_openData.js 실행 중 /airkorea 라우터를 실행하였을 떄 나오는 결과값  ==> a.json 확인 */
                "time" : result.data.response.body.items[0]['dataTiem'],  // 시간대
                "pm10" : result.data.response.body.items[0]['pm10Value'], // pm10 수치
                "pm25" : result.data.response.body.items[0]['pm25Value']  // pm25 수치
            }
            const badAir = [];
            
        
            // pm10 미세먼지 수치    
            if (airItem.pm10 <= 30){
                badAir.push('죠음');
            }else if(airItem.pm10 > 30 && airItem.pm10 < 80){
                badAir.push('구냥 그래');
            } else {
                badAir.push('나뿜');
            }
    
            // pm25 초미세먼지 수치
            if (airItem.pm25<=30){
                badAir.push('죠음');
            }else if(airItem.pm25 > 30 && airItem.pm25 < 80){
                badAir.push('구냥 그래');
            } else {
                badAir.push('나뿜');
            }
    
            res.send(`관측시간 : ${airItem.time} <br> 미세먼지 ${badAir[0]} 초미세먼지 ${badAir[1]} 입니다.`);
        }catch(error){
            console.log(error);
        }
    });
    
    app.listen(app.get('port'),()=>{
        console.log(app.get('port'),'번 포트에서 서버 실행 중.......');
    });
    