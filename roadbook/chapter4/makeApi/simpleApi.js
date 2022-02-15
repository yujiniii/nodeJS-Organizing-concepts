const express = require('express');
const app = express();

app.get('/:type',(req,res)=>{
    let { type } = req.params; // req.params에 들어오는건 라우드 파라미터,,,
    res.send(type);
});

app.listen(8080);

/* localhost:8080/type 에 들어가면 type 의 문자가 브라우저 화면에 뜸 */